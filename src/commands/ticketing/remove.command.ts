import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { checkUserPermissions } from '../../utils';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-from-ticket')
    .setDescription('Removes a user from a ticket')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to remove from the ticket.')
        .setRequired(true),
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
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
    if (interaction.channel.type != 'GUILD_TEXT')
      return interaction.reply({
        content: "You can't do this here.",
        ephemeral: true,
      });

    const executer = await interaction.guild.members.fetch(interaction.user.id);

    if (!checkUserPermissions(executer))
      return interaction.reply({
        content: `You're missing the permissions to do this.`,
      });

    const channel: any = await interaction.guild.channels.cache.get(
      interaction.channelId,
    );

    const member = interaction.options.getUser('user');

    if (!member)
      return interaction.reply({
        content: 'No target user found.',
        ephemeral: true,
      });

    if (channel.name.includes('ticket')) {
      channel
        .edit({
          permissionOverwrites: [
            {
              id: member,
              deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS'],
            },
            {
              id: interaction.guild.roles.everyone,
              deny: ['VIEW_CHANNEL'],
            },
            {
              id: conf.supportRole,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS'],
            },
          ],
        })
        .then(async () => {
          interaction.reply({
            content: `Removed <@${member.id}> from the ticket.`,
          });
        });
    } else {
      return interaction.reply({
        content: "This channel isn't a ticket.",
        ephemeral: true,
      });
    }
  },
};
