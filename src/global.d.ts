export interface IConfig {
    token: string,
    guild: string,
    channel: string,
    role: string,
    log_channel: string,
    spam_message: string,
    spam_user_friends: boolean,
    whitelisted_users: string[],
}

export interface IFriend {
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

export interface IChannel {
    id: string,
    type: number,
    last_message_id: string,
    recipients: IFriend[]
}

export interface IData {
    op: string;
    heartbeat_interval?: number;
    timeout_ms?: number;
    encrypted_nonce?: string;
    fingerprint?: string;
    encrypted_user_payload?: string;
    encrypted_token?: string;
}