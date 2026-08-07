// Bu dosya artik zorunlu degil - bot artik acilirken komutlari otomatik kaydediyor.
// Yine de istersen manuel olarak "npm run deploy" ile ayrica calistirabilirsin.
const fs = require('fs');
const path = require('path');
const { deployCommands } = require('./util-deploy');

const commands = [];
const commandFiles = fs.readdirSync(__dirname).filter((f) => f.startsWith('cmd-') && f.endsWith('.js'));

for (const file of commandFiles) {
  const exported = require(path.join(__dirname, file));
  const commandList = Array.isArray(exported) ? exported : [exported];
  for (const command of commandList) {
    if (command?.data) {
      commands.push(command.data.toJSON());
    }
  }
}

deployCommands(commands);
