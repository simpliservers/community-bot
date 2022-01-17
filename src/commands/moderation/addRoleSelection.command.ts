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
        .setName('role-description')
        .setDescription('Description of the role.')
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
    if (!interaction.guild)
      return interaction.reply({
        content: 'No guild found.',
        ephemeral: true,
      });
    if (!interaction.channel)
      return interaction.reply({
        content: 'No channel found.',
        ephemeral: true,
      });

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!checkUserPermissions(member))
      return interaction.reply({
        content: `You're missing the permissions to add roles to the role selection.`,
        ephemeral: true,
      });

    const role = await interaction.options.getRole('role');
    const roleDescription = await interaction.options.getString(
      'role-description',
    );
    const messageId = await interaction.options.getString('message-id');

    if (!role || !messageId || !roleDescription)
      return interaction.reply({
        content: 'Missing required fields.',
        ephemeral: true,
      });

    const targetMessage = await interaction.channel.messages.fetch(messageId);

    if (!targetMessage)
      return interaction.reply({
        content: 'Message not found.',
        ephemeral: true,
      });

    if (targetMessage.author.id !== client.user?.id)
      return interaction.reply({
        content:
          "The message you are trying to append the role (selection) to, wasn't sent by the bot.",
        ephemeral: true,
      });

    let row: MessageActionRow = targetMessage.components[0] as MessageActionRow;
    if (!row) row = new MessageActionRow();

    const option: MessageSelectOptionData[] = [
      {
        label: role.name,
        value: role.id,
        description: roleDescription,
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
