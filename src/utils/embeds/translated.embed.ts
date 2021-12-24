import { MessageEmbed } from 'discord.js';

function sendTranslatedEmbed(text: string, source: string, target: string) {
  const translationEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setTitle(`Translation from ${source} to ${target}`)
    .setDescription(text);

  return translationEmbed;
}

export default sendTranslatedEmbed;
