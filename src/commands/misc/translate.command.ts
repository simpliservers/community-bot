import { SlashCommandBuilder } from '@discordjs/builders';
import DeepL from '../../api/deepl';
import { sendTranslatedEmbed } from '../../utils/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translates a message from one language to another.')
    .addStringOption((option) =>
      option.setName('text').setDescription('The text to translate.'),
    )
    .addStringOption((option) =>
      option
        .setName('to')
        .setDescription('The language to translate to.')
        .addChoice('English', 'English')
        .addChoice('Dutch', 'Dutch')
        .addChoice('German', 'German')
        .addChoice('Spanish', 'Spanish'),
    ),
  async execute(interaction: any) {
    const text: string = await interaction.options.getString('text');
    const toLanguage: string = await interaction.options.getString('to');
    let to: string = '';

    switch (toLanguage) {
      case 'English':
        to = 'EN-US';
        break;
      case 'Dutch':
        to = 'NL';
        break;
      case 'German':
        to = 'DE';
        break;
      case 'Spanish':
        to = 'ES';
        break;
    }

    const translation: any = await DeepL.translate(text, to);

    await interaction.reply({
      embeds: [
        sendTranslatedEmbed(
          translation.text,
          translation.detected_source_language,
          toLanguage,
        ),
      ],
    });
  },
};
