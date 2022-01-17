import { SlashCommandBuilder } from '@discordjs/builders';
import { Logger } from 'tslog';
import { checkForUser } from '../../utils';
import { Interaction } from 'discord.js';

const log = new Logger();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fetch-members')
    .setDescription('Fetches all users from the server.'),
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

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (member.permissions.has('ADMINISTRATOR')) {
      const members: any = await interaction.guild.members.fetch();
      members.forEach(async (member: any) => {
        log.info(`${member.user.tag} - ${member.user.id}`);
        await checkForUser(member.user.id);
      });

      interaction.reply(`Fetched all users!`);
    } else {
      interaction.reply({
        content: `You're missing the permissions to do this.`,
        ephemeral: true,
      });
    }
  },
};
