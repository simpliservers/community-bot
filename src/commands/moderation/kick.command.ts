import { SlashCommandBuilder } from '@discordjs/builders';
import { checkUserPermissions } from '../../utils';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server.')
    .addUserOption((option) =>
      option.setName('target').setDescription('Kick target.'),
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason for the kick.'),
    ),
  async execute(interaction: any) {
    const target = await interaction.options.getUser('target');
    const reason: string = await interaction.options.getString('reason');

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (checkUserPermissions(member)) {
      await interaction.guild.members.kick(target, reason);

      interaction.reply(
        `${interaction.user} kicked ${target} with the reason reason: ${reason}.`,
      );
    } else {
      interaction.reply({
        content: `You're missing the permissions to kick people.`,
        ephemeral: true,
      });
    }
  },
};
