import { SlashCommandBuilder } from '@discordjs/builders';
import { checkUserPermissions } from '../../utils';
import { sendMuteAction } from '../../utils/embeds';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { Logger } from 'tslog';
import { Interaction } from 'discord.js';

const log = new Logger();

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmutes a person.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to unmute.')
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

    const user = await interaction.options.getUser('user');

    if (!user)
      return interaction.reply({
        content: 'No guild found.',
        ephemeral: true,
      });

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const muted = await interaction.guild.members.fetch(user.id);

    const role = interaction.guild.roles.cache.find(
      (r: any) => r.id === `${conf.muteRole}`,
    );

    if (!role)
      return interaction.reply({
        content: 'No mute role found.',
        ephemeral: true,
      });

    if (checkUserPermissions(member) && role) {
      muted.roles
        .remove(role)
        .then(() => {
          interaction.reply({
            embeds: [
              sendMuteAction(user.id, interaction.user.id, '/', 'unmute'),
            ],
          });
        })
        .catch((e: any) => {
          log.info('There was an error.');

          return interaction.reply({
            content: `Sorry, I ran into an error.`,
            ephemeral: true,
          });
        });
    } else {
      interaction.reply({
        content: `You're missing the permissions to unmute people.`,
        ephemeral: true,
      });
    }
  },
};
