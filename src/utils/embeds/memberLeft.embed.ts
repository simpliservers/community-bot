import { GuildMember, MessageEmbed } from 'discord.js';

function memberLeftEmbed(member: GuildMember) {
  const pfp: string | null = member.user.avatarURL();

  const actionEmbed = new MessageEmbed()
    .setColor('#FF470F')
    .setAuthor('Member left', pfp!)
    .setDescription(`<@${member.id}> ${member.user.tag}.`)
    .setTimestamp();

  return actionEmbed;
}

export default memberLeftEmbed;
