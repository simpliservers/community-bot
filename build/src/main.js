"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const discord_js_1 = require("discord.js");
const tslog_1 = require("tslog");
const utils_1 = require("./utils");
// Load environment variables from .env file, where API keys and passwords are configured
(0, dotenv_1.config)();
// Initialize logger
const log = new tslog_1.Logger();
// Get client token from .env file
const clientToken = process.env.TOKEN || '';
// Initialize new Discord client
const client = new discord_js_1.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new discord_js_1.Collection();
const commandFiles = (0, utils_1.readdirSyncRecursive)('./src/commands', '.ts');
commandFiles.forEach((file) => {
    const command = require(`.${file}`);
    client.commands.set(command.data.name, command);
});
// On client ready, log to console
client.once('ready', () => {
    log.info('Ready!');
    client.user.setActivity('with your feelings.');
});
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command)
        return;
    try {
        yield command.execute(interaction);
    }
    catch (error) {
        log.error(error);
        return interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
}));
client.login(clientToken);
//# sourceMappingURL=main.js.map