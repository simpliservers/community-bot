import { MessageEmbed } from 'discord.js';

function sendMuteAction(
  muter: string,
  muted: string,
  reason: string,
  action: string,
) {
  let actionType: string = '';

  switch (action) {
    case 'mute':
      actionType = `<@${muter}> muted <@${muted}>.`;
      break;
    case 'unmute':
      actionType = `<@${muter}> unmuted <@${muted}>.`;
      break;
  }

  const actionEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .addField('New mute', actionType, false)
    .addField('Reason', `${reason}`, false);

  return actionEmbed;
}

export default sendMuteAction;
