import { MessageEmbed, TextChannel, User } from 'discord.js';

function sendDeletedMessageEmbed(
  author: User,
  content: string,
  channel: TextChannel,
) {
  const pfp: string =
    author.avatarURL() ||
    'https://s3.eu-central-1.wasabisys.com/simpliservers/logo-high.png';

  const actionEmbed = new MessageEmbed()
    .setColor('#FF470F')
    .setAuthor(author.tag, pfp)
    .setDescription(`Message deleted in <#${channel.id}>.`)
    .addFields({ name: 'Content', value: content })
    .setTimestamp();

  return actionEmbed;
}

export default sendDeletedMessageEmbed;
