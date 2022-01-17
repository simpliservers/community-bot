import { readFileSync } from 'fs';
import { load } from 'js-yaml';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

function checkChannel(channel: any): boolean {
  if (channel.id !== conf.commandsChannel) return true;

  return false;
}

export default checkChannel;
