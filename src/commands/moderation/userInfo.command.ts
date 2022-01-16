import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { checkUserPermissions } from '../../utils';
import { sendInfoEmbed } from '../../utils/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Retrieve user information.')
    .addUserOption((option) =>
      option
        .setName('target')
        .setDescription('What user to get info on.')
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

    const target = await interaction.options.getUser('target');

    if (!target)
      return interaction.reply({
        content: 'No target found.',
        ephemeral: true,
      });

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const user = await interaction.guild.members.fetch(target.id);

    if (checkUserPermissions(member)) {
      interaction.reply({
        embeds: [sendInfoEmbed(user)],
      });
    } else {
      interaction.reply({
        content: `You're missing the permissions to see user info.`,
        ephemeral: true,
      });
    }
  },
};
