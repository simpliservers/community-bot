import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import Suggestion from '../../api/suggestions';
import { sendSuggestionEmbed } from '../../utils/embeds';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Submit a suggestion.')
    .addStringOption((option) =>
      option
        .setName('content')
        .setDescription('The suggestion.')
        .setRequired(true),
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.channel!.type != 'GUILD_TEXT') return;

    const content: string =
      (await interaction.options.getString('content')) || ' ';

    if (interaction.channelId !== conf.suggestionChannel) {
      interaction.reply({
        content: `You can't submit a suggestion here. Do it here instead <#${conf.suggestionChannel}>!`,
        ephemeral: true,
      });
    } else {
      await Suggestion.create(interaction.user.id, content);

      interaction.reply({
        embeds: [sendSuggestionEmbed(content, interaction.user.id)],
      });
    }
  },
};
