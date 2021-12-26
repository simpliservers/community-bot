import { SlashCommandBuilder } from '@discordjs/builders';
import { sendResult } from '../../utils/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription("Coinflip. That's it..."),
  async execute(interaction: any) {
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
