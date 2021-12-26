import axios from 'axios';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { Logger } from 'tslog';

const log = new Logger();
const conf: any = load(readFileSync('./config.yml', 'utf8'));

const apiUrl: string = conf.apiUrl || '';

const config = {
  headers: {
    Authorization: `Bearer ${conf.apiToken}`,
  },
};

export default class Shortcut {
  static async get(name: string) {
    const res = await axios.get(`${apiUrl}/shortcuts/${name}`, config);

    return res.data.data;
  }

  static async getAll() {
    const res = await axios.get(`${apiUrl}/shortcuts/`, config);

    return res.data.data;
  }

  static async create(name: string, content: string) {
    const data: ShortcutData = {
      data: {
        name,
        content,
      },
    };

    await axios.post(`${apiUrl}/shortcuts`, data, config);
  }

  static async delete(name: string) {
    const id: number = (await Shortcut.get(name)).id;

    await axios.delete(`${apiUrl}/shortcuts/${id}`, config);
  }
}

interface ShortcutData {
  data: {
    name: string;
    content: string;
  };
}
