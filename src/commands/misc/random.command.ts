import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import checkChannel from '../../utils/checkChannel.util';
import { sendRandom } from '../../utils/embeds';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription("Returns a random number. That's it...")
    .addNumberOption((option) =>
      option.setName('min').setDescription('Minimum value.'),
    )
    .addNumberOption((option) =>
      option.setName('max').setDescription('Maximum value.'),
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

    if (checkChannel(interaction.channel))
      return interaction.reply({
        content: `You can't execute commands here, try <#${conf.commandsChannel}> instead.`,
        ephemeral: true,
      });

    let min: number = (await interaction.options.getNumber('min')) || 0;
    let max: number = (await interaction.options.getNumber('max')) || 100;

    min = Math.ceil(min);
    max = Math.floor(max);

    const random: number = Math.floor(Math.random() * (max - min) + min);

    await interaction.reply({
      embeds: [sendRandom(random)],
    });
  },
};
