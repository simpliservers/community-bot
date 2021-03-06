import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { checkUserPermissions } from '../../utils';
import { openTicketEmbed, openTicketRow } from '../../utils/embeds';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendopenticket')
    .setDescription('Sends the ticket opening embed.'),
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
