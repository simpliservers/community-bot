import { SlashCommandBuilder } from '@discordjs/builders';
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
        .addChoice('show', 'show'),
    )
    .addStringOption((option: any) =>
      option.setName('name').setDescription('The name of the shortcut.'),
    )
    .addStringOption((option: any) =>
      option.setName('content').setDescription('The conntent of the shortcut.'),
    ),
  async execute(interaction: any) {
    const action: string = await interaction.options.getString('action');
    const name: string = await interaction.options.getString('name');
    const content: string = await interaction.options.getString('content');

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
