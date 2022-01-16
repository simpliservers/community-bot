import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { checkUserPermissions } from '../../utils';
import { sendContent } from '../../utils/embeds';
import axios from 'axios';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send')
    .setDescription('Sends an embedded message.')
    .addStringOption((option) =>
      option
        .setName('content')
        .setDescription('Content of the message.')
        .setRequired(true),
    )
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Channel to send the message to.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('title').setDescription('The title of the embed.'),
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

    const content = await interaction.options.getString('content');
    const title = await interaction.options.getString('title');
    const channelData = await interaction.options.getChannel('channel');

    if (!content)
      return interaction.reply({
        content: 'No content found.',
        ephemeral: true,
      });
    if (!channelData)
      return interaction.reply({
        content: 'No channel found.',
        ephemeral: true,
      });
    if (!content.startsWith('https://paste.simpliservers.com/raw/'))
      return interaction.reply({
        content: 'Invalid content.',
        ephemeral: true,
      });

    const text: string = (await axios.get(content)).data;

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const channel = await interaction.guild.channels.fetch(channelData.id);

    if (!(channel && channel.type === 'GUILD_TEXT'))
      return interaction.reply({
        content: 'Invalid channel.',
        ephemeral: true,
      });

    if (checkUserPermissions(member)) {
      channel.send({
        embeds: [sendContent(text, title)],
      });
      interaction.reply({
        content: `Message sent to <#${channel.id}>`,
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: `You're missing the permissions to see user info.`,
        ephemeral: true,
      });
    }
  },
};
