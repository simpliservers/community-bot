import axios from 'axios';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';

const conf: any = load(readFileSync('./config.yml', 'utf8'));

const apiUrl: string = conf.deeplUrl || '';

export default class DeepL {
  static async translate(text: string, language: string) {
    const res = await axios.post(
      `${apiUrl}/translate?auth_key=${conf.deeplAuthKey}&text=${text}&target_lang=${language}`,
    );

    console.log(res.data.translations[0]);

    return res.data.translations[0];
  }
}
