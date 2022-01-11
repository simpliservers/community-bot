import { SlashCommandBuilder } from '@discordjs/builders';
import { checkUserPermissions } from '../../utils';
import { sendClearEmbed } from '../../utils/embeds';
import { Logger } from 'tslog';
import { Interaction } from 'discord.js';

const log = new Logger();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear messages from a channel.')
    .addNumberOption((option) =>
      option
        .setName('count')
        .setDescription('The amount of messages to delete.'),
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (!interaction.guild) throw new Error('No guild found.');
    if (!interaction.channel) throw new Error('No channel found.');
    if (interaction.channel.type != 'GUILD_TEXT') return;

    const count: number = (await interaction.options.getNumber('count')) || 5;

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (checkUserPermissions(member)) {
      if (count === 0) {
        await interaction.reply({
          content: `You can't delete 0 messages.`,
          ephemeral: true,
        });

        return;
      }

      interaction.channel
        .bulkDelete(count)
        .then(() => {
          interaction.reply({
            embeds: [sendClearEmbed(count)],
          });
        })
        .catch((e: any) => {
          log.error(e);

          interaction.reply({
            content: `I ran into an error: ${e.message}`,
            ephemeral: true,
          });
        });
    } else {
      interaction.reply({
        content: `You're missing the permissions to clear messages.`,
        ephemeral: true,
      });
    }
  },
};
