import { MessageEmbed } from 'discord.js';

function sendClearEmbed(count: number) {
  const actionEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setDescription(`${count} messages deleted.`)
    .setTimestamp();

  return actionEmbed;
}

export default sendClearEmbed;
