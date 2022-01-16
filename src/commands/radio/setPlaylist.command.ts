import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import Radio from '../../utils/radio.util';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-playlist')
    .setDescription('Sets the playlist for the radio.')
    .addStringOption((option) =>
      option
        .setName('playlist')
        .setDescription('The playlist to set.')
        .setRequired(true),
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.channel!.type != 'GUILD_TEXT') return;
    if (!interaction.guild) throw new Error('No guild found.');
    if (!interaction.channel) throw new Error('No channel found.');

    const playlist = await interaction.options.getString('playlist');

    if (!playlist) throw new Error('No playlist found.');

    await Radio.playlist(interaction, playlist);
  },
};
