import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import { Interaction, TextChannel } from 'discord.js';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import Suggestion from '../../api/suggestions';
import { checkUserPermissions } from '../../utils';
import { sendSuggestionReply } from '../../utils/embeds';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reply-suggestion')
    .setDescription('Reply to a suggestion.')
    .addStringOption((option) =>
      option
        .setName('id')
        .setDescription('The ID of the suggestion in the admin panel.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('response')
        .setDescription('The suggestion response.')
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

    if (!checkUserPermissions(interaction.member))
      return interaction.reply({
        content: "You don't have permission to do that.",
        ephemeral: true,
      });

    const id: string = (await interaction.options.getString('id')) || ' ';

    const response: string =
      (await interaction.options.getString('response')) || ' ';

    if (!response.startsWith('https://paste.simpliservers.com/raw/'))
      return interaction.reply({
        content: 'Invalid content.',
        ephemeral: true,
      });

    const channel = (await interaction.guild.channels.fetch(
      conf.suggestionChannel,
    )) as TextChannel;

    if (!channel)
      return interaction.reply({
        content: "Couldn't find the suggestions channel.",
        ephemeral: true,
      });

    const text: string = (await axios.get(response)).data;
    const suggestion = await Suggestion.getSuggestion(id);

    channel.send({
      embeds: [
        sendSuggestionReply(
          suggestion.attributes.author.data.attributes.discordid,
          suggestion.attributes.content,
          text,
        ),
      ],
    });

    interaction.reply({
      content: `Suggestion response sent to <#${conf.suggestionChannel}>!`,
      ephemeral: true,
    });
  },
};
