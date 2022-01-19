import { MessageEmbed, TextChannel, User } from 'discord.js';

function sendEditedMessageEmbed(
  author: User,
  oldContent: string,
  newContent: string,
  channel: TextChannel,
  guildID: string,
  messageID: string,
) {
  const messageLink: string = `https://discordapp.com/channels/${guildID}/${channel.id}/${messageID}`;

  const pfp: string =
    author.avatarURL() ||
    'https://s3.eu-central-1.wasabisys.com/simpliservers/logo-high.png';

  const actionEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setAuthor(author.tag, pfp)
    .setDescription(
      `Message edited in <#${channel.id}>. [Jumo to message](${messageLink})`,
    )
    .addFields(
      { name: 'Before', value: oldContent },
      { name: 'After', value: newContent },
    )
    .setTimestamp();

  return actionEmbed;
}

export default sendEditedMessageEmbed;
