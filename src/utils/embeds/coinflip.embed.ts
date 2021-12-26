import { MessageEmbed } from 'discord.js';

export function sendResult(result: number) {
  let text: string = '';

  switch (result) {
    case 1:
      text = 'heads';
      break;
    default:
      text = 'tails';
  }
  const headsEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setDescription(`You flipped ${text}!`);

  return headsEmbed;
}
