const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`${client.user.tag} olarak giris yapildi. Bot aktif!`);
    client.user.setPresence({
      activities: [{ name: 'sunucuyu yonetiyorum', type: ActivityType.Watching }],
      status: 'online',
    });
  },
};
