import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import Member from '../../api/api';
import { checkUserPermissions } from '../../utils';
import { sendActionEmbed } from '../../utils/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user.')
    .addUserOption((option) =>
      option.setName('target').setDescription('Warn target.').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason for the warning.'),
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
    if (interaction.channel!.type != 'GUILD_TEXT')
      return interaction.reply({
        content: "You can't do this.",
        ephemeral: true,
      });

    const target = await interaction.options.getUser('target');
    const reason: string =
      (await interaction.options.getString('reason')) || 'No reason given.';

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!target)
      return interaction.reply({
        content: 'No target found.',
        ephemeral: true,
      });

    if (checkUserPermissions(member)) {
      await Member.warn(target.id, interaction.user.id, reason);

      interaction.reply({
        embeds: [
          sendActionEmbed(target.id, interaction.user.id, reason, 'warn'),
        ],
      });
    } else {
      interaction.reply({
        content: `You're missing the permissions to kick people.`,
        ephemeral: true,
      });
    }
  },
};
