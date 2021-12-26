import { SlashCommandBuilder } from '@discordjs/builders';
import { sendRandom } from '../../utils/embeds';

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
  async execute(interaction: any) {
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
