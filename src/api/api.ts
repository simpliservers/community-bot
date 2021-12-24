import axios from 'axios';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { Logger } from 'tslog';
import { checkForUser } from '../utils';

const log = new Logger();
const conf: any = load(readFileSync('./config.yml', 'utf8'));

const apiUrl: string = conf.apiUrl || '';

const config = {
  headers: {
    Authorization: `${conf.apiToken}`,
  },
};

export default class Member {
  static async get(discordid: string) {
    const res = await axios.get(`${apiUrl}/members/${discordid}`, config);

    return res.data.data;
  }

  static async create(username: string, discordid: string) {
    const data: Data = {
      data: {
        username,
        discordid,
      },
    };

    const member: number = (await Member.get(discordid)).id;

    if (member) return;
    await axios.post(`${apiUrl}/members`, data, config);
  }

  static async ban(bannedId: string, bannerId: string, reason: string) {
    await checkForUser(bannedId);
    await checkForUser(bannerId);

    const banned_by: number = (await Member.get(bannerId)).id;
    const member: number = (await Member.get(bannedId)).id;

    const data: Data = {
      data: {
        banned_by,
        member,
        reason,
      },
    };

    await axios.post(`${apiUrl}/bans`, data, config);
  }

  static async kick(kickedId: string, kickerId: string, reason: string) {
    await checkForUser(kickedId);
    await checkForUser(kickerId);

    const kicked_by: number = (await Member.get(kickerId)).id;
    const member: number = (await Member.get(kickedId)).id;

    const data: Data = {
      data: {
        kicked_by,
        member,
        reason,
      },
    };

    await axios.post(`${apiUrl}/kicks`, data, config);
  }

  static async warn(warnedId: string, warnerId: string, reason: string) {
    await checkForUser(warnedId);
    await checkForUser(warnerId);

    const warned_by: number = (await Member.get(warnerId)).id;
    const member: number = (await Member.get(warnedId)).id;

    const data: Data = {
      data: {
        warned_by,
        member,
        reason,
      },
    };

    await axios.post(`${apiUrl}/warns`, data, config);
  }
}

interface MemberData {
  username: string;
  discordid: string;
}

interface BanData {
  banned_by: number;
  member: number;
  reason: string;
}

interface KickData {
  kicked_by: number;
  member: number;
  reason: string;
}

interface WarnData {
  warned_by: number;
  member: number;
  reason: string;
}

interface Data {
  data: MemberData | BanData | KickData | WarnData;
}
