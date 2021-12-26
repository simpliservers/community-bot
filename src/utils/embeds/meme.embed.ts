import { MessageEmbed } from 'discord.js';

function sendImageResult(
  subRedditName: string,
  title: string,
  link: string,
  image: string,
) {
  const imageEmbed = new MessageEmbed()
    .setTitle(subRedditName)
    .setImage(image)
    .setColor('#3DBEEE')
    .setDescription(`[${title}](${link})`)
    .setURL(`https://reddit.com/${subRedditName}`);

  return imageEmbed;
}

export default sendImageResult;
