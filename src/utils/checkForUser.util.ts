import Member from '../api/api';
import client from '../main';
import { Logger } from 'tslog';

const log = new Logger();

async function checkForUser(id: string) {
  try {
    const member = await Member.get(id);
    if (member) throw new Error(`Member with discord id ${id} already exists`);

    const user = await client.users.cache.find((user: any) => user.id === id);

    await Member.create(user.tag, id);
  } catch (err: any) {
    log.info(err.message);
    return;
  }
}

export default checkForUser;
