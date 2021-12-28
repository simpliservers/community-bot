import { SlashCommandBuilder } from '@discordjs/builders';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { checkUserPermissions } from '../../utils';
import { openTicketEmbed, openTicketRow } from '../../utils/embeds';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendopenticket')
    .setDescription('Sends the ticket opening embed.'),
  async execute(interaction: any) {
    const channel: any = await interaction.guild.channels.cache.get(
      conf.ticketParent,
    );

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (checkUserPermissions(member)) {
      await channel.send({
        embeds: [openTicketEmbed()],
        components: [openTicketRow()],
      });

      interaction.reply({
        content: `Sent!`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: `You're missing the permissions to do this.`,
        ephemeral: true,
      });
    }
  },
};
