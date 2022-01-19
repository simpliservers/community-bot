import { Queue, RepeatMode, Song } from 'discord-music-player';
import {
  GuildMember,
  Interaction,
  MessageEmbed,
  VoiceChannel,
} from 'discord.js';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import client from '../main';
import { checkUserPermissions } from './';
import { Logger } from 'tslog';

const log = new Logger();
const conf: any = load(readFileSync('./config.yml', 'utf8'));

export default class Radio {
  static async voiceStateHandler() {
    const guildQueue: Queue = client.player.getQueue(conf.guildID);

    const guild = await client.guilds.fetch(conf.guildID);
    const channel: VoiceChannel = await guild.channels.fetch(
      conf.radioChannelID,
    );

    if (!channel.members) return log.error('No members in the vc.');

    let botInside = false;

    channel.members.forEach((member: GuildMember) => {
      if (member.user.id === client.user.id) botInside = true;
    });

    if (!botInside) {
      return log.info('Bot is not inside the voice channel');
    } else {
      log.info('Bot inside');

      if (channel.members.size === 1) {
        if (guildQueue.nowPlaying) await Radio.pause(conf.guildID);
        return log.info('Bot is alone in the voice channel');
      } else if (channel.members.size > 1) {
        if (guildQueue.nowPlaying) await Radio.resume(conf.guildID);
        return log.info('Bot is inside with people');
      }
    }
  }

  static async defaultPlaylist(playlist: string, channel: any) {
    log.info('Setting default playlist');

    const queue: Queue = client.player.createQueue(conf.guildID);
    const guildQueue: Queue = client.player.getQueue(conf.guildID);

    if (playlist === null) return log.error("Playlist wasn't provided");

    if (!channel) return log.error('No voice channel found.');

    await queue.join(channel);
    log.info('Joined channel.');

    log.info('Adding playlist to queue...');

    const pl: any = await queue.playlist(playlist).catch((_: any) => {
      if (!guildQueue) queue.stop();
    });

    log.info(pl.name);

    await guildQueue.setRepeatMode(RepeatMode.SONG);

    log.info('Playlist added!');
  }

  static async playlist(interaction: Interaction, playlist: string) {
    log.info('Setting new playlist');

    if (!interaction.isCommand()) return;
    if (!interaction.guild)
      return interaction.reply({
        content: 'No guild found.',
        ephemeral: true,
      });

    const queue: Queue = client.player.createQueue(interaction.guildId);
    const guildQueue: Queue = client.player.getQueue(interaction.guildId);

    const member: GuildMember = await interaction.guild.members.fetch(
      interaction.user.id,
    );

    if (!member)
      return interaction.reply({
        content: 'No member found.',
        ephemeral: true,
      });

    if (!checkUserPermissions(member))
      return interaction.reply({
        content: "You don't have the permissions to set the playlist.",
        ephemeral: true,
      });

    if (playlist === null)
      return interaction.reply({
        content: "You don't know how to use slash commands, do you?",
        ephemeral: true,
      });

    const voiceChannel = await interaction.guild.channels.fetch(
      conf.radioChannelID,
    );

    if (!voiceChannel)
      return interaction.reply({
        content: 'No voice channel found.',
        ephemeral: true,
      });

    await queue.join(voiceChannel);

    await interaction.reply('Resetting playlist...');
    await guildQueue.clearQueue();

    const pl: any = await queue.playlist(playlist).catch((_: any) => {
      if (!guildQueue) queue.stop();
    });

    await guildQueue.skip();

    await guildQueue.setRepeatMode(RepeatMode.QUEUE);

    const embed = new MessageEmbed()
      .setColor('#3DBEEE')
      .setTitle(`${pl.name}`)
      .setDescription(`by ${pl.author}`)
      .setTimestamp();

    interaction.editReply({
      embeds: [embed],
    });
  }

  static async pause(guildID: string) {
    log.info('Pausing radio.');

    const guildQueue: Queue = client.player.getQueue(guildID);

    await guildQueue.setPaused(true);
  }

  static async resume(guildID: string) {
    log.info('Resuming radio.');

    const guildQueue: Queue = client.player.getQueue(guildID);

    await guildQueue.setPaused(false);
  }
}
