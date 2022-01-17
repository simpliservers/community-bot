import Member from '../api/api';
import client from '../main';
import { Logger } from 'tslog';

const log = new Logger();

async function checkForUser(id: string) {
  try {
    const get = await Member.get(id);
    if (get) return log.info(`Member with discord id ${id} already exists`);
  } catch (err: any) {
    const user = await client.users.cache.find((user: any) => user.id === id);

    await Member.create(user.tag, id);

    return;
  }
}

export default checkForUser;
