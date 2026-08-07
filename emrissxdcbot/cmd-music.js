const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ytdl = require('@distube/ytdl-core');
const { playInVoiceChannel, getVideoInfo, stop, isPlaying } = require('./util-musicPlayer');

module.exports = [
  // --- cal.js ---
  {
  data: new SlashCommandBuilder()
    .setName('cal')
    .setDescription('Verilen YouTube linkini bulunduğunuz ses kanalında çalar')
    .addStringOption((opt) => opt.setName('link').setDescription('YouTube video linki').setRequired(true)),

  async execute(interaction) {
    const link = interaction.options.getString('link');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: 'Önce bir ses kanalına katılmalısınız.', ephemeral: true });
    }

    if (!ytdl.validateURL(link)) {
      return interaction.reply({ content: 'Geçerli bir YouTube linki girin.', ephemeral: true });
    }

    await interaction.deferReply();

    let info;
    try {
      info = await getVideoInfo(link);
    } catch (err) {
      console.error('Video bilgisi alinamadi:', err.message);
      return interaction.editReply(
        'Video bilgisi alınamadı. Video yaş sınırlı, bölge kısıtlamalı veya özel olabilir, başka bir video deneyin. Sorun devam ederse konsoldaki hata mesajını kontrol edin (kütüphanenin güncellenmesi gerekebilir: `npm update @distube/ytdl-core`).'
      );
    }

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle(info.title)
      .setDescription('Şarkı çalınıyor')
      .setThumbnail(info.thumbnail);

    await interaction.editReply({ embeds: [embed] });

    try {
      await playInVoiceChannel(voiceChannel, link, () => {
        interaction.channel.send(`⏹️ **${info.title}** bitti, ses kanalından ayrıldım.`).catch(() => {});
      });
    } catch (err) {
      console.error('Muzik hatasi:', err);
      stop(interaction.guild.id);
      interaction.channel.send('Şarkı çalınırken bir hata oluştu.').catch(() => {});
    }
  },
},

  // --- dur.js ---
  {
  data: new SlashCommandBuilder()
    .setName('dur')
    .setDescription('Çalan şarkıyı durdurur ve sesten çıkar'),

  async execute(interaction) {
    if (!isPlaying(interaction.guild.id)) {
      return interaction.reply({ content: 'Şu anda çalan bir şarkı yok.', ephemeral: true });
    }

    stop(interaction.guild.id);
    await interaction.reply('⏹️ Şarkı durduruldu, ses kanalından çıkıldı.');
  },
},
];
