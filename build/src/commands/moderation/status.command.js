"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const tslog_1 = require("tslog");
const log = new tslog_1.Logger();
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName('status')
        .setDescription('Sets new status'),
    // .addStringOption((option) =>
    //   option.setName('type').setDescription('Status type.'),
    // )
    // .addStringOption((option) =>
    //   option.setName('content').setDescription('Status content.'),
    // ),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // const type = await interaction.options.getString('type');
            // const content = await interaction.options.getString('content');
            // log.info(type);
            // log.info(content);
            // await client.user.setActivity(content, { type });
            interaction.reply('New status set!');
        });
    },
};
//# sourceMappingURL=status.command.js.map