import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import DeepL from '../../api/deepl';
import { sendTranslatedEmbed } from '../../utils/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translates a message from one language to another.')
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('The text to translate.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('from')
        .setDescription('The language to translate from.')
        .addChoice('English', 'EN')
        .addChoice('Dutch', 'NL')
        .addChoice('German', 'DE')
        .addChoice('Spanish', 'ES')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('to')
        .setDescription('The language to translate to.')
        .addChoice('English', 'EN')
        .addChoice('Dutch', 'NL')
        .addChoice('German', 'DE')
        .addChoice('Spanish', 'ES')
        .setRequired(true),
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.channel!.type != 'GUILD_TEXT') return;
    if (!interaction.guild) throw new Error('No guild found.');

    const text: string = (await interaction.options.getString('text')) || '';
    const fromLanguage: string =
      (await interaction.options.getString('from')) || '';
    const toLanguage: string =
      (await interaction.options.getString('to')) || '';

    const translation: any = await DeepL.translate(
      text,
      toLanguage,
      fromLanguage,
    );

    await interaction.reply({
      embeds: [
        sendTranslatedEmbed(
          translation.text,
          getLanguage(fromLanguage),
          getLanguage(toLanguage),
        ),
      ],
    });
  },
};

function getLanguage(code: string): string {
  switch (code) {
    case 'EN':
      return 'English';
    case 'NL':
      return 'Dutch';
    case 'DE':
      return 'German';
    case 'ES':
      return 'Spanish';
    default:
      return 'Unknown';
  }
}
