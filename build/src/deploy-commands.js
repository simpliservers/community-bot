"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const tslog_1 = require("tslog");
const dotenv_1 = require("dotenv");
const js_yaml_1 = require("js-yaml");
const fs_1 = require("fs");
const utils_1 = require("./utils");
(0, dotenv_1.config)();
const conf = (0, js_yaml_1.load)((0, fs_1.readFileSync)('./config.yml', 'utf8'));
const clientToken = process.env.TOKEN || '';
const clientID = conf.clientID || '';
const guildID = conf.guildID || '';
const log = new tslog_1.Logger();
const commands = [];
const commandFiles = (0, utils_1.readdirSyncRecursive)('./src/commands', '.ts');
commandFiles.forEach((file) => {
    const command = require(`.${file}`);
    commands.push(command.data.toJSON());
});
const rest = new rest_1.REST({ version: '9' }).setToken(clientToken);
rest
    .put(v9_1.Routes.applicationGuildCommands(clientID, guildID), { body: commands })
    .then(() => log.info('Successfully registered application commands.'))
    .catch(console.error);
//# sourceMappingURL=deploy-commands.js.map