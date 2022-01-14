import { MessageEmbed } from 'discord.js';

function sendContent(content: string, title: string | null) {
  const imageEmbed = new MessageEmbed().setDescription(content).setTimestamp();

  if (title != null) {
    imageEmbed.setTitle(title);
  }

  return imageEmbed;
}

export default sendContent;
