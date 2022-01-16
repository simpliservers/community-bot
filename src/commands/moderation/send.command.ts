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
    if (interaction.channel!.type != 'GUILD_TEXT') return;
    if (!interaction.guild) throw Error('No guild found.');

    const content = await interaction.options.getString('content');
    const title = await interaction.options.getString('title');
    const channelData = await interaction.options.getChannel('channel');

    if (!content) throw Error('No content found.');
    if (!channelData) throw Error('No channel found.');
    if (!content.startsWith('https://www.toptal.com/developers/hastebin/raw/'))
      throw Error('Invalid content.');

    const text: string = (await axios.get(content)).data;

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const channel = await interaction.guild.channels.fetch(channelData.id);

    if (!(channel && channel.type === 'GUILD_TEXT'))
      throw Error('Invalid channel.');

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
