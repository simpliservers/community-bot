import { SlashCommandBuilder } from '@discordjs/builders';
import Member from '../../api/api';
import { checkUserPermissions } from '../../utils';
import { sendInfoEmbed } from '../../utils/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Retrieve user information.')
    .addUserOption((option) =>
      option.setName('target').setDescription('Kick target.'),
    ),
  async execute(interaction: any) {
    const target = await interaction.options.getUser('target');

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
