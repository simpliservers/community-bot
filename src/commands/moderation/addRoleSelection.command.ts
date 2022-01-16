import { SlashCommandBuilder } from '@discordjs/builders';
import {
  Interaction,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
} from 'discord.js';
import client from '../../main';
import { checkUserPermissions } from '../../utils';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-role-selection')
    .setDescription('Add a role to the role selection dropdown.')
    .addRoleOption((option) =>
      option
        .setName('role')
        .setDescription('The role to add to the dropdown.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('message-id')
        .setDescription('ID of the message to add the role (selection) to.')
        .setRequired(true),
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.channel!.type != 'GUILD_TEXT') return;
    if (!interaction.guild) throw new Error('No guild found.');
    if (!interaction.channel) throw new Error('No channel found.');

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!checkUserPermissions(member))
      return interaction.reply({
        content: `You're missing the permissions to add roles to the role selection.`,
        ephemeral: true,
      });

    const role = await interaction.options.getRole('role');
    const messageId = await interaction.options.getString('message-id');

    if (!role || !messageId) throw new Error('Missing required fields.');

    const targetMessage = await interaction.channel.messages.fetch(messageId);

    if (!targetMessage) throw new Error('Message not found.');

    if (targetMessage.author.id !== client.user?.id)
      throw new Error(
        "The message you are trying to append the role (selection) to, wasn't sent by the bot.",
      );

    let row: MessageActionRow = targetMessage.components[0] as MessageActionRow;
    if (!row) row = new MessageActionRow();

    const option: MessageSelectOptionData[] = [
      {
        label: role.name,
        value: role.id,
      },
    ];

    let menu: MessageSelectMenu = row.components[0] as MessageSelectMenu;
    if (menu) {
      menu.options.forEach((o: any) => {
        if (o.value === option[0].value) {
          interaction.reply({
            content: `<@&${o.value}> is already in the role selection dropdown.`,
            allowedMentions: {
              roles: [],
            },
            ephemeral: true,
          });
        }
      });

      menu.addOptions(option);
      menu.setMaxValues(menu.options.length);
    } else {
      row.addComponents(
        new MessageSelectMenu()
          .setCustomId('role-selection')
          .setMinValues(0)
          .setMaxValues(1)
          .setPlaceholder('Select your roles')
          .addOptions(option),
      );
    }

    targetMessage.edit({
      components: [row],
    });

    return await interaction.reply({
      content: `<@&${role.id}> has been added to the role selection dropdown.`,
      allowedMentions: {
        roles: [],
      },
      ephemeral: true,
    });
  },
};
