// "10dk", "1s", "2g", "30sn" gibi girdileri milisaniyeye cevirir.
function parseDuration(input) {
  if (!input) return null;
  const match = String(input).trim().toLowerCase().match(/^(\d+)\s*(sn|dk|s|g)$/);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const unitToMs = {
    sn: 1000,
    dk: 60 * 1000,
    s: 60 * 60 * 1000,
    g: 24 * 60 * 60 * 1000,
  };

  return value * unitToMs[unit];
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds} saniye`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} dakika`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat`;
  const days = Math.floor(hours / 24);
  return `${days} gün`;
}

module.exports = { parseDuration, formatDuration };
