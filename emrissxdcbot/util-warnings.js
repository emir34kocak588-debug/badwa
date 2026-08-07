const { readDB, writeDB } = require('./util-db');

// Yapı: { "guildId": { "userId": { general: [ {reason, moderator, date} ], curse: [ {reason, date} ] } } }

function getGuildData(guildId) {
  const db = readDB('warnings');
  if (!db[guildId]) db[guildId] = {};
  return db;
}

function getUserWarnings(guildId, userId) {
  const db = getGuildData(guildId);
  if (!db[guildId][userId]) {
    db[guildId][userId] = { general: [], curse: [] };
  }
  return db[guildId][userId];
}

function addWarning(guildId, userId, type, reason, moderator) {
  const db = getGuildData(guildId);
  const user = getUserWarnings(guildId, userId);
  const entry = { reason, moderator: moderator || 'Sistem', date: new Date().toISOString() };
  user[type].push(entry);
  db[guildId][userId] = user;
  writeDB('warnings', db);
  return user[type].length;
}

function clearWarnings(guildId, userId, type) {
  const db = getGuildData(guildId);
  const user = getUserWarnings(guildId, userId);
  user[type] = [];
  db[guildId][userId] = user;
  writeDB('warnings', db);
}

function getCount(guildId, userId, type) {
  const user = getUserWarnings(guildId, userId);
  return user[type].length;
}

module.exports = { addWarning, clearWarnings, getCount, getUserWarnings };
