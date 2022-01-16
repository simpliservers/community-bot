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
    if (!interaction.guild)
      return interaction.reply({
        content: 'No guild found.',
        ephemeral: true,
      });
    if (!interaction.channel)
      return interaction.reply({
        content: 'No channel found.',
        ephemeral: true,
      });
    if (interaction.channel.type != 'GUILD_TEXT')
      return interaction.reply({
        content: "You can't do this here.",
        ephemeral: true,
      });

    const playlist = await interaction.options.getString('playlist');

    if (!playlist)
      return interaction.reply({
        content: 'No playlist found.',
        ephemeral: true,
      });

    await Radio.playlist(interaction, playlist);
  },
};
