import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import Member from '../../api/api';
import { checkUserPermissions } from '../../utils';
import { sendActionEmbed } from '../../utils/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription(
      'Bans a user from the server, deletes 7 days of messages and unbans him.',
    )
    .addUserOption((option) =>
      option.setName('target').setDescription('Ban target.').setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason for the ban.'),
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.channel!.type != 'GUILD_TEXT') return;
    if (!interaction.guild) throw new Error('No guild found.');

    const target = await interaction.options.getUser('target');
    const reason: string =
      (await interaction.options.getString('reason')) || 'No reason given.';

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!target) throw new Error('No target found.');

    if (checkUserPermissions(member)) {
      await interaction.guild.members.ban(target, { reason, days: 7 });
      await Member.softban(target!.id, interaction.user.id, reason);
      await interaction.guild.members.unban(target);

      interaction.reply({
        embeds: [
          sendActionEmbed(target.id, interaction.user.id, reason, 'softban'),
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
