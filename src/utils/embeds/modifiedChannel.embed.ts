import { MessageEmbed, TextChannel, Guild, VoiceChannel } from 'discord.js';

function sendModifedChannel(
  guild: Guild,
  channel: TextChannel | VoiceChannel,
  type: string,
) {
  let action: string = 'Created';

  switch (type) {
    case 'created':
      action = 'Created';
      break;
    case 'deleted':
      action = 'Deleted';
  }

  const pfp: string =
    guild.iconURL() ||
    'https://s3.eu-central-1.wasabisys.com/simpliservers/logo-high.png';

  const actionEmbed = new MessageEmbed()
    .setColor(type === 'created' ? '#3DBFEE' : '#FF470F')
    .setAuthor(guild.name, pfp)
    .setDescription(
      `${action} channel: ${channel.name}${
        type === 'created' ? ` | <#${channel.id}>.` : '.'
      }`,
    )
    .setTimestamp();

  return actionEmbed;
}

export default sendModifedChannel;
