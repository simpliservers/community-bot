import { config } from 'dotenv';
import {
  Client,
  Collection,
  GuildMember,
  Intents,
  Interaction,
  Message,
  MessageSelectMenu,
  Role,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { Logger } from 'tslog';
import { checkForUser, readdirSyncRecursive } from './utils';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import Shortcut from './api/shortcuts';
import {
  displayShortcut,
  memberLeftEmbed,
  sendDeletedMessageEmbed,
  sendEditedMessageEmbed,
  sendModifedChannel,
  sendRoleEventEmbed,
} from './utils/embeds';
import { Ticket } from './commands/ticketing';
import { Player } from 'discord-music-player';
import Radio from './utils/radio.util';

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

const player: Player = new Player(client, {
  leaveOnEmpty: false,
  deafenOnJoin: true,
  leaveOnEnd: false,
  leaveOnStop: true,
  quality: 'high',
  timeout: 0,
  volume: 100,
});

client.player = player;

client.commands = new Collection();
const commandFiles: string[] = readdirSyncRecursive('./src/commands', '.ts');

commandFiles.forEach((file: string) => {
  const command = require(`.${file}`);
  if (command.data) client.commands.set(command.data.name, command);
});

// On client ready, log to console
client.once('ready', async () => {
  log.info('Ready!');
  client.user.setActivity('with your feelings.');

  const guild = await client.guilds.fetch(conf.guildID);
  const channel = await guild.channels.fetch(conf.radioChannelID);

  await Radio.defaultPlaylist(conf.defaultPlaylist, channel);
});

client.on('guildMemberAdd', async (member: GuildMember) => {
  await checkForUser(member.user.id);

  const defaultRoles: string[] = conf.defaultRoles;

  if (!defaultRoles) return log.info('No default roles found.');

  defaultRoles.forEach((roleID: string) => {
    member.roles.add(roleID);
  });
});

client.on('messageUpdate', async (oldMessage: Message, newMessage: Message) => {
  if (newMessage.channel.type !== 'GUILD_TEXT') return;

  const guild = await client.guilds.fetch(conf.guildID);
  const channel = (await guild.channels.fetch(conf.logChannel)) as TextChannel;

  channel.send({
    embeds: [
      sendEditedMessageEmbed(
        oldMessage.author,
        oldMessage.content,
        newMessage.content,
        newMessage.channel as TextChannel,
        conf.guildID,
        oldMessage.id,
      ),
    ],
  });
});

client.on('messageDelete', async (message: Message) => {
  if (message.channel.type !== 'GUILD_TEXT') return;

  const guild = await client.guilds.fetch(conf.guildID);
  const channel = (await guild.channels.fetch(conf.logChannel)) as TextChannel;

  channel.send({
    embeds: [
      sendDeletedMessageEmbed(
        message.author,
        message.content,
        message.channel as TextChannel,
      ),
    ],
  });
});

client.on('channelCreate', async (channel: TextChannel | VoiceChannel) => {
  const guild = await client.guilds.fetch(conf.guildID);
  const sendChannel = (await guild.channels.fetch(
    conf.logChannel,
  )) as TextChannel;

  sendChannel.send({
    embeds: [sendModifedChannel(guild, channel, 'created')],
  });
});

client.on('channelDelete', async (channel: TextChannel | VoiceChannel) => {
  const guild = await client.guilds.fetch(conf.guildID);
  const sendChannel = (await guild.channels.fetch(
    conf.logChannel,
  )) as TextChannel;

  sendChannel.send({
    embeds: [sendModifedChannel(guild, channel, 'deleted')],
  });
});

client.on('guildMemberRemove', async (member: GuildMember) => {
  const guild = await client.guilds.fetch(conf.guildID);
  const channel = (await guild.channels.fetch(conf.logChannel)) as TextChannel;

  channel.send({
    embeds: [memberLeftEmbed(member)],
  });
});

client.on('roleCreate', async (role: Role) => {
  const guild = await client.guilds.fetch(conf.guildID);
  const channel = (await guild.channels.fetch(conf.logChannel)) as TextChannel;

  channel.send({
    embeds: [sendRoleEventEmbed(role, 'created')],
  });
});

client.on('roleDelete', async (role: Role) => {
  const guild = await client.guilds.fetch(conf.guildID);
  const channel = (await guild.channels.fetch(conf.logChannel)) as TextChannel;

  channel.send({
    embeds: [sendRoleEventEmbed(role, 'deleted')],
  });
});

// Music controller
// Stops playing music when there is no one in the voice channel
// Resumes playing when someone joins the voice channel
client.on('voiceStateUpdate', async () => {
  await Radio.voiceStateHandler();
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
