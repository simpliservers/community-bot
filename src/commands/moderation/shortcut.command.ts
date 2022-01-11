import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';
import Shortcut from '../../api/shortcuts';
import { shortcutsAction, displayShortcuts } from '../../utils/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shortcut')
    .setDescription('Shortcut management command.')
    .addStringOption((option: any) =>
      option
        .setName('action')
        .setDescription('What to do with the shortcut.')
        .addChoice('create', 'create')
        .addChoice('delete', 'delete')
        .addChoice('show', 'show')
        .setRequired(true),
    )
    .addStringOption((option: any) =>
      option
        .setName('name')
        .setDescription('The name of the shortcut.')
        .setRequired(true),
    )
    .addStringOption((option: any) =>
      option
        .setName('content')
        .setDescription('The conntent of the shortcut.')
        .setRequired(true),
    ),
  async execute(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (interaction.channel!.type != 'GUILD_TEXT') return;
    if (!interaction.guild) throw new Error('No guild found.');

    const action: string | null = await interaction.options.getString('action');
    const name: string | null = await interaction.options.getString('name');
    const content: string | null = await interaction.options.getString(
      'content',
    );

    if (!action || !name || !content)
      throw new Error('Missing required fields.');

    switch (action) {
      case 'create':
        await Shortcut.create(name, content);
        await interaction.reply({
          embeds: [shortcutsAction(name, content, 'create')],
        });
        break;
      case 'delete':
        await Shortcut.delete(name);
        await interaction.reply({
          embeds: [shortcutsAction(name, content, 'delete')],
        });
        break;
      case 'show':
        await interaction.reply({
          embeds: [await displayShortcuts()],
        });
    }
  },
};
