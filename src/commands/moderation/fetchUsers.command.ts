import { SlashCommandBuilder } from '@discordjs/builders';
import Member from '../../api/api';
import { Logger } from 'tslog';

const log = new Logger();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fetch-members')
    .setDescription('Fetches all users from the server.'),
  async execute(interaction: any) {
    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (member.permissions.has('ADMIN')) {
      const members: any = await interaction.guild.members.fetch();
      members.forEach(async (member: any) => {
        log.info(`${member.user.tag}: ${member.user.id}`);
        await Member.create(member.user.tag, member.user.id);
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
