import { MessageEmbed } from 'discord.js';

function sendSuggestionReply(
  suggesterID: string,
  suggestion: string,
  response: string,
) {
  const actionEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setAuthor(
      'Suggestion response',
      'https://s3.eu-central-1.wasabisys.com/simpliservers/logo-high.png',
    )
    .setDescription(`Replying to suggestion by <@${suggesterID}>.`)
    .addFields(
      { name: 'Suggestion:', value: suggestion },
      { name: 'Response', value: response },
    )
    .setTimestamp();

  return actionEmbed;
}

export default sendSuggestionReply;
