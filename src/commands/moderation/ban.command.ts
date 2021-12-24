import { SlashCommandBuilder } from '@discordjs/builders';
import Member from '../../api/api';
import { checkUserPermissions } from '../../utils';
import { sendActionEmbed } from '../../utils/embeds';

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
      await interaction.guild.members.ban(target, { reason });
      await Member.ban(target.id, interaction.user.id, reason);

      interaction.reply({
        embeds: [
          sendActionEmbed(target.id, interaction.user.id, reason, 'ban'),
        ],
      });
    } else {
      interaction.reply({
        content: `You're missing the permissions to ban people.`,
        ephemeral: true,
      });
    }
  },
};
