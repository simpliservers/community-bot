import { MessageEmbed } from 'discord.js';

function sendRandom(num: number) {
  const numberEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setDescription(`You got: ${num}`);

  return numberEmbed;
}

export default sendRandom;
