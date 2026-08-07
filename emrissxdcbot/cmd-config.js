const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const { getConfig, setConfig } = require('./util-guildConfig');
const { lockChannel, findOwnerRole, unlockChannel } = require('./util-channelLock');

module.exports = [
  // --- du.js ---
  {
  data: new SlashCommandBuilder()
    .setName('du')
    .setDescription('Ayarlanan duyuru kanalına duyuru gönderir')
    .addStringOption((opt) => opt.setName('mesaj').setDescription('Duyuru metni').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const conf = getConfig(interaction.guild.id);
    if (!conf.announceChannel) {
      return interaction.reply({
        content: 'Önce /dukanalı komutuyla bir duyuru kanalı ayarlamalısınız.',
        ephemeral: true,
      });
    }

    const channel = interaction.guild.channels.cache.get(conf.announceChannel);
    if (!channel) {
      return interaction.reply({ content: 'Ayarlı duyuru kanalı bulunamadı, tekrar ayarlayın.', ephemeral: true });
    }

    const mesaj = interaction.options.getString('mesaj');
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📢 Duyuru')
      .setDescription(mesaj)
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Duyuru gönderildi.', ephemeral: true });
  },
},

  // --- dukanali.js ---
  {
  data: new SlashCommandBuilder()
    .setName('dukanalı')
    .setDescription('Bu kanalı duyuru kanalı olarak ayarlar (sadece Owner rolü yazabilir)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.channel;
    setConfig(interaction.guild.id, { announceChannel: channel.id });

    await lockChannel(channel);
    const ownerRole = findOwnerRole(interaction.guild);

    const note = ownerRole
      ? ''
      : '\n(Not: sunucuda "Owner" isimli bir rol bulunamadı, bu yüzden şu an kanala sadece bot yazabiliyor. Rolü oluşturursanız o rol de yazabilecek.)';

    await interaction.reply(`Bu kanal duyuru kanalı olarak ayarlandı ve kilitlendi.${note}`);
  },
},

  // --- gorayarla.js ---
  {
  data: new SlashCommandBuilder()
    .setName('gorayarla')
    .setDescription('Bu kanalı ayrılma (görüşürüz) mesajları kanalı olarak ayarlar ve kilitler')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.channel;

    setConfig(interaction.guild.id, { leaveChannel: channel.id });

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
    }).catch(() => {});

    await interaction.reply(`Bu kanal artık ayrılma mesajları kanalı olarak ayarlandı ve kilitlendi. Sadece bot mesaj atabilecek.`);
  },
},

  // --- hosayarla.js ---
  {
  data: new SlashCommandBuilder()
    .setName('hosayarla')
    .setDescription('Bu kanalı hoşgeldin mesajları kanalı olarak ayarlar ve kilitler')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const channel = interaction.channel;

    setConfig(interaction.guild.id, { welcomeChannel: channel.id });

    // Kanali kitle: sadece bot yazabilsin
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
    }).catch(() => {});

    await interaction.reply(`Bu kanal artık hoşgeldin mesajları kanalı olarak ayarlandı ve kilitlendi. Sadece bot mesaj atabilecek.`);
  },
},

  // --- lock.js ---
  {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Bu kanalı kilitler (sadece Owner rolü yazabilir)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await lockChannel(interaction.channel);
    await interaction.reply('🔒 Bu kanal kilitlendi.');
  },
},

  // --- lockall.js ---
  {
  data: new SlashCommandBuilder()
    .setName('lockall')
    .setDescription('Tüm metin kanallarını kilitler (hoşgeldin/görüşürüz/duyuru kanalları hariç)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();
    const conf = getConfig(interaction.guild.id);
    const excluded = [conf.welcomeChannel, conf.leaveChannel, conf.announceChannel].filter(Boolean);

    const textChannels = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildText && !excluded.includes(c.id)
    );

    let count = 0;
    for (const channel of textChannels.values()) {
      await lockChannel(channel).catch(() => {});
      count++;
    }

    await interaction.editReply(`🔒 ${count} kanal kilitlendi.`);
  },
},

  // --- unlock.js ---
  {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Bu kanalın kilidini açar')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    await unlockChannel(interaction.channel);
    await interaction.reply('🔓 Bu kanalın kilidi açıldı.');
  },
},

  // --- unlockall.js ---
  {
  data: new SlashCommandBuilder()
    .setName('unlockall')
    .setDescription('Tüm kilitli kanalları açar (hoşgeldin/görüşürüz/duyuru kanalları hariç)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply();
    const conf = getConfig(interaction.guild.id);
    const excluded = [conf.welcomeChannel, conf.leaveChannel, conf.announceChannel].filter(Boolean);

    const textChannels = interaction.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildText && !excluded.includes(c.id)
    );

    let count = 0;
    for (const channel of textChannels.values()) {
      await unlockChannel(channel).catch(() => {});
      count++;
    }

    await interaction.editReply(`🔓 ${count} kanalın kilidi açıldı.`);
  },
},
];
