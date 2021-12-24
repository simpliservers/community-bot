import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translates a message from one language to another.')
    .addStringOption((option) =>
      option.setName('text').setDescription('The text to translate.'),
    )
    .addStringOption((option) =>
      option.setName('to').setDescription('The language to translate to.'),
    ),
  async execute(interaction: any) {
    const text: string = await interaction.options.getString('text');
    const toLanguage: string = await interaction.options.getString('to');
  },
};
