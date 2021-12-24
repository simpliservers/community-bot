import { SlashCommandBuilder } from '@discordjs/builders';
import Member from '../../api/api';
import { checkUserPermissions } from '../../utils';
import { sendActionEmbed } from '../../utils/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user.')
    .addUserOption((option) =>
      option.setName('target').setDescription('Warn target.'),
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason for the warning.'),
    ),
  async execute(interaction: any) {
    const target = await interaction.options.getUser('target');
    const reason: string = await interaction.options.getString('reason');

    const member = await interaction.guild.members.fetch(interaction.user.id);

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
