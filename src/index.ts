import dotenv from 'dotenv';
dotenv.config();

import DiscordClient from "./DiscordClient";
import SocketClient from './SocketClient';
import SpamFriends from './util/SpamFriends';
import mongoose from 'mongoose';
import express from 'express';

(async () => {
    await mongoose.connect((process.env.MONGO as string));
    DiscordClient();
    express().get('/', (req, res) => {res.status(200).json({success: true})}).listen(process.env.PORT || 4949);

    await new Promise((resolve) => { setTimeout(resolve, 999999) });
})();