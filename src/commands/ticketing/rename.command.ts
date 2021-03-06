import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { checkUserPermissions } from '../../utils';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename-ticket')
    .setDescription('Renames current ticket.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('New name for the ticket.')
        .setRequired(true),
    ),
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

    const executer = await interaction.guild.members.fetch(interaction.user.id);

    if (!checkUserPermissions(executer))
      return interaction.reply({
        content: `You're missing the permissions to do this.`,
      });

    const channel: any = await interaction.guild.channels.cache.get(
      interaction.channelId,
    );

    const newName: string =
      interaction.options.getString('name') || channel.name.split('ticket-')[1];

    if (channel.name.includes('ticket')) {
      channel.setName(`ticket-${newName}`).then(async () => {
        interaction.reply({
          content: `Changed ticket name to <#${channel.id}>.`,
        });
      });
    } else {
      return interaction.reply({
        content: "This channel isn't a ticket.",
        ephemeral: true,
      });
    }
  },
};
