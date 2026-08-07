const { readDB, writeDB } = require('./util-db');

function getConfig(guildId) {
  const db = readDB('guildConfig');
  if (!db[guildId]) {
    db[guildId] = {
      welcomeChannel: null,
      leaveChannel: null,
      announceChannel: null,
      lockedChannels: [], // /lockall ile kilitlenenler haric tutulacak (hosgeldin/gorusuruz/duyuru)
    };
    writeDB('guildConfig', db);
  }
  return db[guildId];
}

function setConfig(guildId, patch) {
  const db = readDB('guildConfig');
  const current = getConfig(guildId);
  db[guildId] = { ...current, ...patch };
  writeDB('guildConfig', db);
  return db[guildId];
}

module.exports = { getConfig, setConfig };
