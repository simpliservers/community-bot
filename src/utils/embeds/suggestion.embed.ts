import { MessageEmbed } from 'discord.js';

function sendSuggestionEmbed(content: string, member: string) {
  const embed = new MessageEmbed()
    .setColor('#3DBEEE')
    .addFields(
      { name: 'Suggestion by', value: `<@${member}>` },
      { name: 'Suggestion', value: content },
    );

  return embed;
}

export default sendSuggestionEmbed;
