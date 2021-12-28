import { MessageEmbed } from 'discord.js';
import Shortcut from '../../api/shortcuts';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

export function shortcutsAction(name: string, content: string, action: string) {
  let what: string = '';

  switch (action) {
    case 'create':
      what = 'New shortcut';
      break;
    case 'delete':
      what = 'Deleted shortcut';
      break;
  }

  if (content === null || content === undefined) {
    content = '/';
  }

  const shortcutsEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setTitle(`${what}`)
    .addFields(
      { name: 'Name', value: `${conf.shortcutPrefix}${name}` },
      { name: 'Content', value: content },
    )
    .setTimestamp();

  return shortcutsEmbed;
}

export async function displayShortcuts() {
  const shortcuts = await Shortcut.getAll();

  const shortcutsEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setTitle('Shortcuts')
    .setTimestamp();

  shortcuts.forEach((shortcut: any) => {
    shortcutsEmbed.addField(
      `${conf.shortcutPrefix}${shortcut.attributes.name}`,
      `${shortcut.attributes.content}`,
      false,
    );
  });

  return shortcutsEmbed;
}

export function displayShortcut(content: string) {
  const shortcutsEmbed = new MessageEmbed()
    .setColor('#3DBEEE')
    .setDescription(`${content}`)
    .setTimestamp();

  return shortcutsEmbed;
}
