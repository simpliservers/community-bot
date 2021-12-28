import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export function openTicketEmbed() {
  const embed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setAuthor('Open ticket!')
    .setDescription('Click on the button below to open a ticket');

  return embed;
}

export function openTicketRow() {
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('open-ticket')
      .setLabel('Open a ticket')
      .setEmoji('✉️')
      .setStyle('PRIMARY'),
  );

  return row;
}
