import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import checkChannel from '../../utils/checkChannel.util';
import { sendResult } from '../../utils/embeds';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription("Coinflip. That's it..."),
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

    if (checkChannel(interaction.channel))
      return interaction.reply({
        content: `You can't execute commands here, try <#${conf.commandsChannel}> instead.`,
        ephemeral: true,
      });

    const flip = Math.round(Math.random()) + 1;

    if (flip === 1) {
      interaction.reply({
        embeds: [sendResult(1)],
      });
    } else {
      interaction.reply({
        embeds: [sendResult(0)],
      });
    }
  },
};
