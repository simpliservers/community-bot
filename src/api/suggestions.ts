import axios from 'axios';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { Logger } from 'tslog';
import Member from './api';

const log = new Logger();
const conf: any = load(readFileSync('./config.yml', 'utf8'));

const apiUrl: string = conf.apiUrl || '';

const config = {
  headers: {
    Authorization: `Bearer ${conf.apiToken}`,
  },
};

export default class Suggestion {
  static async create(memberID: string, content: string) {
    const author: number = (await Member.get(memberID)).id;

    const data: SuggestionData = {
      data: {
        content,
        author,
      },
    };

    await axios.post(`${apiUrl}/suggestions`, data, config);
  }

  static async getSuggestion(id: string) {
    const suggestion: SuggestionResponse = (
      await axios.get(`${apiUrl}/suggestions/${id}?populate=*`, config)
    ).data.data;

    log.info(suggestion);

    return suggestion;
  }
}

interface SuggestionData {
  data: {
    content: string;
    author: number;
  };
}

interface SuggestionResponse {
  id: number;
  attributes: {
    content: string;
    createdAt: string;
    updatedAt: string;
    author: {
      data: {
        id: number;
        attributes: {
          username: string;
          discordid: string;
          createdAt: string;
          updatedAt: string;
        };
      };
    };
  };
}
