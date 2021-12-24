import { config } from 'dotenv';
import { Client, Collection, Intents, Interaction } from 'discord.js';
import { Logger } from 'tslog';
import { readdirSyncRecursive } from './utils';

// Load environment variables from .env file, where API keys and passwords are configured
config();

// Initialize logger
const log = new Logger();

// Get client token from .env file
const clientToken: string = process.env.TOKEN || '';

// Initialize new Discord client
const client: any = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

client.commands = new Collection();
const commandFiles: string[] = readdirSyncRecursive('./src/commands', '.ts');

commandFiles.forEach((file: string) => {
  const command = require(`.${file}`);
  if (command.data) client.commands.set(command.data.name, command);
});

// On client ready, log to console
client.once('ready', () => {
  log.info('Ready!');
  client.user.setActivity('with your feelings.');
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error: any) {
    log.error(error);

    const member = await interaction!.guild!.members.fetch(interaction.user.id);

    if (error.httpStatus === 401) {
      return interaction.reply({
        content: `Sorry, but I'm missing some permissions for this command.`,
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Sorry, I ran into an error.`,
      ephemeral: true,
    });
  }
});

client.login(clientToken);

export default client;
