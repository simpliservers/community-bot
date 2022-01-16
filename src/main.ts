import { config } from 'dotenv';
import {
  Client,
  Collection,
  GuildMember,
  Intents,
  Interaction,
  Message,
  MessageSelectMenu,
} from 'discord.js';
import { Logger } from 'tslog';
import { readdirSyncRecursive } from './utils';
import Member from './api/api';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import Shortcut from './api/shortcuts';
import { displayShortcut } from './utils/embeds';
import { Ticket } from './commands/ticketing';

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
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
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
  if (interaction.isButton()) {
    switch (interaction.customId) {
      case 'open-ticket':
        await Ticket.ticketEvent(interaction);
        break;
      case 'close-ticket':
        await Ticket.closeTicket(interaction);
        break;
      case 'delete-ticket':
        await Ticket.deleteTicket(interaction);
        break;
    }
  }

  if (interaction.isSelectMenu()) {
    const { values, member } = interaction;

    if (
      interaction.customId === 'role-selection' &&
      member instanceof GuildMember
    ) {
      const component = interaction.component as MessageSelectMenu;
      const removed = component.options.filter((option) => {
        return !values.includes(option.value);
      });

      removed.forEach((id) => {
        member.roles.remove(id.value);
      });

      values.forEach((id: string) => {
        member.roles.add(id);
      });

      interaction.reply({
        content: 'Roles updated!',
        ephemeral: true,
      });
    }
  }

  if (!interaction.isCommand()) return;
  if (interaction.channel!.type != 'GUILD_TEXT') return;

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
