const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readDB(name) {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, JSON.stringify({}, null, 2));
    return {};
  }
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch (err) {
    console.error(`DB okuma hatasi (${name}):`, err);
    return {};
  }
}

function writeDB(name, data) {
  const fp = filePath(name);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
