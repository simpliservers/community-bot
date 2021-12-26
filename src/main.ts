import { config } from 'dotenv';
import { Client, Collection, Intents, Interaction, Message } from 'discord.js';
import { Logger } from 'tslog';
import { readdirSyncRecursive } from './utils';
import Member from './api/api';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import Shortcut from './api/shortcuts';
import { displayShortcut } from './utils/embeds';

// Load configurations
const conf: any = load(readFileSync('./config.yml', 'utf8'));

// Load environment variables from .env file, where API keys and passwords are configured
config();

// Initialize logger
const log = new Logger();

// Get client token from .env file
const clientToken: string = process.env.TOKEN || '';

// Client prefix
const prefix: string = conf.shortcutPrefix;

// Initialize new Discord client
const client: any = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.commands = new Collection();
const commandFiles: string[] = readdirSyncRecursive('./src/commands', '.ts');

commandFiles.forEach((file: string) => {
  const command = require(`.${file}`);
  if (command.data) client.commands.set(command.data.name, command);
});

// On client ready, log to console
client.once('ready', () => {
  log.info('Ready!');
  client.user.setActivity('with your feelings.');
});

client.on('messageCreate', async (message: any) => {
  const args = message.content.slice(prefix.length).trim().split(' ');
  const gotShortcut = args.shift().toLowerCase();

  const shortcuts = await Shortcut.getAll();

  if (message.channel.type != 'GUILD_TEXT') return;
  if (message.author.id == client.user.id) return;

  shortcuts.forEach((shortcut: any) => {
    if (shortcut.attributes.name == gotShortcut) {
      message.channel.send({
        embeds: [displayShortcut(shortcut.attributes.content)],
      });
    }
  });

  await Member.logMessage(
    message.author.id,
    message.channel.name,
    message.channelId,
    message.content,
  );
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error: any) {
    log.error(error);

    const member = await interaction!.guild!.members.fetch(interaction.user.id);

    if (error.httpStatus === 401) {
      return interaction.reply({
        content: `Sorry, but I'm missing some permissions for this command.`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Sorry, I ran into an error.`,
      ephemeral: true,
    });
  }
});

client.login(clientToken);

export default client;
