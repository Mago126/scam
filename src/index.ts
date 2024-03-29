import dotenv from 'dotenv';
dotenv.config();

import DiscordClient from "./DiscordClient";
import SocketClient from './SocketClient';
import express from 'express';
import mongoose from 'mongoose';

import { IConfig } from './global';
const config: IConfig = require('../config.json');

(async () => {
    if (config.mongoose.enabled) 
        await mongoose.connect(config.mongoose.uri);
    DiscordClient();
    express().get('/', (req, res) => {res.status(200).json({success: true})}).listen(process.env.PORT || 4949);
    await new Promise((resolve) => { setTimeout(resolve, 999999) });
})();