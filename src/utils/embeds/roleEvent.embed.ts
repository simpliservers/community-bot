import { MessageEmbed, Role } from 'discord.js';

function sendRoleEventEmbed(role: Role, type: string) {
  let action: string = 'Created';

  switch (type) {
    case 'created':
      action = 'Created';
      break;
    case 'deleted':
      action = 'Deleted';
  }

  const pfp: string =
    role.guild.iconURL() ||
    'https://s3.eu-central-1.wasabisys.com/simpliservers/logo-high.png';

  const actionEmbed = new MessageEmbed()
    .setColor(type === 'created' ? '#3DBFEE' : '#FF470F')
    .setAuthor(role.guild.name, pfp)
    .setDescription(`${action} role: \`${role.name}\``)
    .setTimestamp();

  return actionEmbed;
}

export default sendRoleEventEmbed;
