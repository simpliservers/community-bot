import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import Member from '../../api/api';
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
    if (interaction.channel!.type != 'GUILD_TEXT') return;
    if (!interaction.guild) throw new Error('No guild found.');

    const target = await interaction.options.getUser('target');

    if (!target) throw new Error('No target found.');

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
