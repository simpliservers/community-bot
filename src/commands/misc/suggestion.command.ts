import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction, TextChannel } from 'discord.js';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import Suggestion from '../../api/suggestions';
import checkChannel from '../../utils/checkChannel.util';
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

    if (checkChannel(interaction.channel))
      return interaction.reply({
        content: `You can't execute commands here, try <#${conf.commandsChannel}> instead.`,
        ephemeral: true,
      });

    const content: string =
      (await interaction.options.getString('content')) || ' ';

    const channel = (await interaction.guild.channels.fetch(
      conf.suggestionChannel,
    )) as TextChannel;

    if (!channel)
      return interaction.reply({
        content: "Couldn't find the suggestions channel.",
        ephemeral: true,
      });

    await Suggestion.create(interaction.user.id, content);
    channel.send({
      embeds: [sendSuggestionEmbed(content, interaction.user.id)],
    });

    interaction.reply({
      content: `Suggestion sent to <#${conf.suggestionChannel}>!`,
      ephemeral: true,
    });
  },
};
