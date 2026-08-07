const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  StreamType,
} = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

// guildId -> { connection, player }
const activeSessions = new Map();

async function getVideoInfo(url) {
  const info = await ytdl.getInfo(url);
  const details = info.videoDetails;
  const thumbnails = details.thumbnails || [];
  return {
    title: details.title,
    thumbnail: thumbnails.length ? thumbnails[thumbnails.length - 1].url : null,
    url: details.video_url,
    durationRaw: details.lengthSeconds,
  };
}

async function playInVoiceChannel(voiceChannel, url, onFinish) {
  const guildId = voiceChannel.guild.id;

  // Onceden aktif bir oturum varsa temizle
  stop(guildId);

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    selfDeaf: true, // bot sagirlassin
  });

  await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

  const stream = ytdl(url, {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
  });

  // inputType Arbitrary birakiliyor: @discordjs/voice bunu ffmpeg-static ile
  // otomatik islerken herhangi bir konteyner/codec farkina daha dayanikli oluyor.
  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
  });

  const player = createAudioPlayer();
  player.play(resource);
  connection.subscribe(player);

  activeSessions.set(guildId, { connection, player });

  player.on(AudioPlayerStatus.Idle, () => {
    stop(guildId);
    if (onFinish) onFinish();
  });

  player.on('error', (err) => {
    console.error('Muzik calma hatasi:', err);
    stop(guildId);
    if (onFinish) onFinish();
  });

  stream.on('error', (err) => {
    console.error('YouTube stream hatasi:', err);
    stop(guildId);
    if (onFinish) onFinish();
  });

  return true;
}

function stop(guildId) {
  const session = activeSessions.get(guildId);
  if (!session) return false;
  try {
    session.player.stop();
  } catch (_) {}
  try {
    session.connection.destroy();
  } catch (_) {}
  activeSessions.delete(guildId);
  return true;
}

function isPlaying(guildId) {
  return activeSessions.has(guildId);
}

module.exports = { playInVoiceChannel, stop, isPlaying, getVideoInfo };
