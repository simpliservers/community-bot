import { SlashCommandBuilder } from '@discordjs/builders';
import { checkUserPermissions } from '../../utils';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server.')
    .addUserOption((option) =>
      option.setName('target').setDescription('Ban target.'),
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason for the ban.'),
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
        content: `You're missing the permissions to ban people.`,
        ephemeral: true,
      });
    }
  },
};
