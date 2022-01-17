"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const tslog_1 = require("tslog");
const log = new tslog_1.Logger();
const readdirSyncRecursive = (dir, ending, fileArray) => {
    const files = (0, fs_1.readdirSync)(dir);
    let commandFiles = fileArray || [];
    files.forEach((file) => {
        if ((0, fs_1.statSync)(`${dir}/${file}`).isDirectory()) {
            commandFiles = readdirSyncRecursive(`${dir}/${file}`, ending, commandFiles);
        }
        else if (file.endsWith(ending)) {
            log.info('./' + path_1.default.join(`${dir}/${file}`));
            commandFiles.push('./' + path_1.default.join(`${dir}/${file}`));
        }
    });
    return commandFiles;
};
exports.default = readdirSyncRecursive;
//# sourceMappingURL=recursiveDirRead.util.js.map