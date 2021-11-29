import { SlashCommandBuilder } from '@discordjs/builders';
import { Logger } from 'tslog';

const log = new Logger();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Sets new status')
    .addStringOption((option) =>
      option.setName('type').setDescription('Status type.'),
    )
    .addStringOption((option) =>
      option.setName('content').setDescription('Status content.'),
    ),
  async execute(interaction: any, client: any) {
    const type = await interaction.options.getString('type');
    const content = await interaction.options.getString('content');

    log.info(type);
    log.info(content);

    await client.user.setActivity(content, { type });

    interaction.reply('New status set!');
  },
};
