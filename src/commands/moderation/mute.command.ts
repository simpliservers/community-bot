import { SlashCommandBuilder } from '@discordjs/builders';
import { checkUserPermissions } from '../../utils';
import { sendMuteAction } from '../../utils/embeds';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { Logger } from 'tslog';
import Member from '../../api/api';
import { Interaction } from 'discord.js';

const log = new Logger();

const conf: any = load(readFileSync('./config.yml', 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a person.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to mute.')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('The reason for the mute.'),
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.channel!.type != 'GUILD_TEXT') return;
    if (!interaction.guild)
      return interaction.reply({
        content: 'No guild found.',
        ephemeral: true,
      });

    const user = await interaction.options.getUser('user');
    const reason: string =
      (await interaction.options.getString('reason')) || 'No reason given.';

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const muted = await interaction.guild.members.fetch(user!.id);

    const role = interaction.guild.roles.cache.find(
      (r: any) => r.id === `${conf.muteRole}`,
    );

    if (!role)
      return interaction.reply({
        content: 'No mute role found.',
        ephemeral: true,
      });

    if (checkUserPermissions(member)) {
      muted.roles
        .add(role)
        .then(async () => {
          await Member.mute(user!.id, interaction.user.id, reason);
          await interaction.reply({
            embeds: [
              sendMuteAction(interaction.user.id, user!.id, reason, 'mute'),
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
        content: `You're missing the permissions to mute people.`,
        ephemeral: true,
      });
    }
  },
};
