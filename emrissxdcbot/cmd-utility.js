const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = [
  // --- avatar.js ---
  {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Bir kullanicinin profil fotografini gosterir')
    .addUserOption((o) => o.setName('kullanıcı').setDescription('Kullanici').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı') || interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`${user.username} - Profil Fotografi`)
      .setImage(user.displayAvatarURL({ size: 1024 }))
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed] });
  },
},

  // --- botasoylet.js ---
  {
  data: new SlashCommandBuilder()
    .setName('botasöylet')
    .setDescription('Botun belirttiğiniz mesajı göndermesini sağlar')
    .addStringOption((opt) => opt.setName('mesaj').setDescription('Botun söyleyeceği mesaj').setRequired(true)),

  async execute(interaction) {
    const mesaj = interaction.options.getString('mesaj');
    await interaction.reply({ content: 'Mesaj gönderildi.', ephemeral: true });
    await interaction.channel.send(mesaj);
  },
},

  // --- botinfo.js ---
  {
  data: new SlashCommandBuilder().setName('botinfo').setDescription('Bot hakkinda bilgi gosterir'),
  async execute(interaction) {
    const client = interaction.client;
    const uptimeSec = Math.floor(client.uptime / 1000);
    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username} - Bot Bilgisi`)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'Sunucu Sayisi', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Komut Sayisi', value: `${client.commands.size}`, inline: true },
        { name: 'Calisma Suresi', value: `${Math.floor(uptimeSec / 3600)} saat ${Math.floor((uptimeSec % 3600) / 60)} dakika`, inline: true },
        { name: 'Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true }
      )
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed] });
  },
},

  // --- channelinfo.js ---
  {
  data: new SlashCommandBuilder()
    .setName('kanalinfo')
    .setDescription('Bir kanal hakkinda bilgi gosterir')
    .addChannelOption((o) => o.setName('kanal').setDescription('Kanal').setRequired(false)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal') || interaction.channel;
    const embed = new EmbedBuilder()
      .setTitle(`Kanal: ${channel.name}`)
      .setColor(0x5865f2)
      .addFields(
        { name: 'ID', value: channel.id, inline: true },
        { name: 'Tip', value: `${channel.type}`, inline: true },
        { name: 'Olusturma Tarihi', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  },
},

  // --- channellist.js ---
  {
  data: new SlashCommandBuilder().setName('kanallistesi').setDescription('Sunucudaki tum kanallari listeler'),
  async execute(interaction) {
    const channels = interaction.guild.channels.cache
      .filter((c) => c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice)
      .map((c) => `${c.type === ChannelType.GuildVoice ? '🔊' : '#'} ${c.name}`)
      .slice(0, 50);
    const embed = new EmbedBuilder()
      .setTitle('Kanal Listesi')
      .setDescription(channels.length ? channels.join('\n') : 'Kanal bulunamadi')
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed] });
  },
},

  // --- createchannel.js ---
  {
  data: new SlashCommandBuilder()
    .setName('kanalac')
    .setDescription('Yeni bir metin kanali olusturur')
    .addStringOption((o) => o.setName('isim').setDescription('Kanal adi').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const name = interaction.options.getString('isim');
    const channel = await interaction.guild.channels.create({ name, type: ChannelType.GuildText });
    await interaction.reply(`${channel} kanali olusturuldu.`);
  },
},

  // --- createrole.js ---
  {
  data: new SlashCommandBuilder()
    .setName('rololustur')
    .setDescription('Yeni bir rol olusturur')
    .addStringOption((o) => o.setName('isim').setDescription('Rol adi').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const name = interaction.options.getString('isim');
    const role = await interaction.guild.roles.create({ name });
    await interaction.reply(`${role} rolu olusturuldu.`);
  },
},

  // --- deletechannel.js ---
  {
  data: new SlashCommandBuilder()
    .setName('kanalsil')
    .setDescription('Belirtilen kanali siler')
    .addChannelOption((o) => o.setName('kanal').setDescription('Silinecek kanal').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');
    await interaction.reply(`**#${channel.name}** kanali silinecek.`);
    await channel.delete().catch(() => {});
  },
},

  // --- deleterole.js ---
  {
  data: new SlashCommandBuilder()
    .setName('rolsil')
    .setDescription('Belirtilen rolu siler')
    .addRoleOption((o) => o.setName('rol').setDescription('Silinecek rol').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const role = interaction.options.getRole('rol');
    const name = role.name;
    await role.delete().catch(() => {});
    await interaction.reply(`**${name}** rolu silindi.`);
  },
},

  // --- giverole.js ---
  {
  data: new SlashCommandBuilder()
    .setName('rolver')
    .setDescription('Bir kullaniciya rol verir')
    .addUserOption((o) => o.setName('kullanıcı').setDescription('Kullanici').setRequired(true))
    .addRoleOption((o) => o.setName('rol').setDescription('Verilecek rol').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const role = interaction.options.getRole('rol');
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ content: 'Kullanici bulunamadi.', ephemeral: true });
    await member.roles.add(role).catch(() => {});
    await interaction.reply(`${role} rolu **${user.username}** kullanicisina verildi.`);
  },
},

  // --- help.js ---
  {
  data: new SlashCommandBuilder().setName('yardım').setDescription('Tum komutlarin listesini gosterir'),
  async execute(interaction) {
    const client = interaction.client;
    const commandNames = [...client.commands.keys()].sort().map((n) => `/${n}`);
    const chunks = [];
    for (let i = 0; i < commandNames.length; i += 30) {
      chunks.push(commandNames.slice(i, i + 30).join(', '));
    }
    const embed = new EmbedBuilder()
      .setTitle(`Komut Listesi (${commandNames.length} komut)`)
      .setColor(0x5865f2)
      .setDescription(chunks[0] || 'Komut bulunamadi');
    for (let i = 1; i < chunks.length; i++) {
      embed.addFields({ name: '\u200b', value: chunks[i] });
    }
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
},

  // --- hidechannel.js ---
  {
  data: new SlashCommandBuilder()
    .setName('kanalgizle')
    .setDescription('Bu kanali herkesten gizler')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
    await interaction.reply('Bu kanal gizlendi.');
  },
},

  // --- membercount.js ---
  {
  data: new SlashCommandBuilder().setName('uyesayisi').setDescription('Sunucunun uye sayisini gosterir'),
  async execute(interaction) {
    await interaction.reply(`Sunucuda toplam **${interaction.guild.memberCount}** uye var.`);
  },
},

  // --- nickname.js ---
  {
  data: new SlashCommandBuilder()
    .setName('isimdegistir')
    .setDescription('Bir kullanicinin sunucu takma adini degistirir')
    .addUserOption((o) => o.setName('kullanıcı').setDescription('Kullanici').setRequired(true))
    .addStringOption((o) => o.setName('yeni_isim').setDescription('Yeni takma isim').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const newNick = interaction.options.getString('yeni_isim');
    const member = interaction.guild.members.cache.get(user.id);
    if (!member || !member.manageable) return interaction.reply({ content: 'Bu kullanicinin ismini degistiremiyorum.', ephemeral: true });
    await member.setNickname(newNick);
    await interaction.reply(`**${user.username}** kullanicisinin takma adi **${newNick}** olarak degistirildi.`);
  },
},

  // --- permissions.js ---
  {
  data: new SlashCommandBuilder()
    .setName('yetkilerim')
    .setDescription('Bir kullanicinin bu kanaldaki yetkilerini gosterir')
    .addUserOption((o) => o.setName('kullanıcı').setDescription('Kullanici').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    const perms = member.permissionsIn(interaction.channel).toArray().join(', ') || 'Yok';
    await interaction.reply({ content: `**${user.username}** yetkileri: ${perms}`, ephemeral: true });
  },
},

  // --- ping.js ---
  {
  data: new SlashCommandBuilder().setName('ping').setDescription('Botun gecikme suresini gosterir'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Hesaplaniyor...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong! Gecikme: ${latency}ms | API: ${Math.round(interaction.client.ws.ping)}ms`);
  },
},

  // --- purge.js ---
  {
  data: new SlashCommandBuilder()
    .setName('temizle')
    .setDescription('Kanaldan belirtilen sayida mesaj siler')
    .addIntegerOption((o) => o.setName('adet').setDescription('Silinecek mesaj sayisi (1-100)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger('adet');
    if (amount < 1 || amount > 100) {
      return interaction.reply({ content: 'Adet 1 ile 100 arasinda olmali.', ephemeral: true });
    }
    const deleted = await interaction.channel.bulkDelete(amount, true).catch(() => null);
    await interaction.reply({ content: `${deleted ? deleted.size : 0} mesaj silindi.`, ephemeral: true });
  },
},

  // --- roleinfo.js ---
  {
  data: new SlashCommandBuilder()
    .setName('rolinfo')
    .setDescription('Bir rol hakkinda bilgi gosterir')
    .addRoleOption((o) => o.setName('rol').setDescription('Rol').setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('rol');
    const embed = new EmbedBuilder()
      .setTitle(`Rol: ${role.name}`)
      .setColor(role.color || 0x5865f2)
      .addFields(
        { name: 'ID', value: role.id, inline: true },
        { name: 'Uye Sayisi', value: `${role.members.size}`, inline: true },
        { name: 'Renk', value: role.hexColor, inline: true },
        { name: 'Konum', value: `${role.position}`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  },
},

  // --- rolelist.js ---
  {
  data: new SlashCommandBuilder().setName('rollistesi').setDescription('Sunucudaki tum rolleri listeler'),
  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .filter((r) => r.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map((r) => `${r} (${r.members.size} uye)`)
      .slice(0, 40);
    const embed = new EmbedBuilder()
      .setTitle('Rol Listesi')
      .setDescription(roles.length ? roles.join('\n') : 'Rol bulunamadi')
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed] });
  },
},

  // --- serverinfo.js ---
  {
  data: new SlashCommandBuilder().setName('sunucuinfo').setDescription('Sunucu hakkinda bilgi gosterir'),
  async execute(interaction) {
    const g = interaction.guild;
    const embed = new EmbedBuilder()
      .setTitle(`${g.name} - Sunucu Bilgisi`)
      .setThumbnail(g.iconURL({ size: 512 }))
      .addFields(
        { name: 'Sahip', value: `<@${g.ownerId}>`, inline: true },
        { name: 'Uye Sayisi', value: `${g.memberCount}`, inline: true },
        { name: 'Olusturma Tarihi', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Kanal Sayisi', value: `${g.channels.cache.size}`, inline: true },
        { name: 'Rol Sayisi', value: `${g.roles.cache.size}`, inline: true },
        { name: 'Boost Seviyesi', value: `${g.premiumTier}`, inline: true }
      )
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed] });
  },
},

  // --- serverowner.js ---
  {
  data: new SlashCommandBuilder().setName('sunucusahibi').setDescription('Sunucunun sahibini gosterir'),
  async execute(interaction) {
    const owner = await interaction.guild.fetchOwner();
    await interaction.reply(`Sunucu sahibi: **${owner.user.username}** (${owner.id})`);
  },
},

  // --- showchannel.js ---
  {
  data: new SlashCommandBuilder()
    .setName('kanalgoster')
    .setDescription('Gizlenmis bir kanali tekrar gorunur yapar')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: null });
    await interaction.reply('Bu kanal tekrar gorunur yapildi.');
  },
},

  // --- slowmode.js ---
  {
  data: new SlashCommandBuilder()
    .setName('yavaslat')
    .setDescription('Kanala yavas mod ayarlar (saniye)')
    .addIntegerOption((o) => o.setName('saniye').setDescription('0-21600 arasi saniye, 0 = kapali').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const seconds = interaction.options.getInteger('saniye');
    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply(seconds === 0 ? 'Yavas mod kapatildi.' : `Yavas mod ${seconds} saniye olarak ayarlandi.`);
  },
},

  // --- takerole.js ---
  {
  data: new SlashCommandBuilder()
    .setName('rolal')
    .setDescription('Bir kullanicidan rol alir')
    .addUserOption((o) => o.setName('kullanıcı').setDescription('Kullanici').setRequired(true))
    .addRoleOption((o) => o.setName('rol').setDescription('Alinacak rol').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const role = interaction.options.getRole('rol');
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ content: 'Kullanici bulunamadi.', ephemeral: true });
    await member.roles.remove(role).catch(() => {});
    await interaction.reply(`${role} rolu **${user.username}** kullanicisindan alindi.`);
  },
},

  // --- uptime.js ---
  {
  data: new SlashCommandBuilder().setName('uptime').setDescription('Botun ne kadar suredir acik oldugunu gosterir'),
  async execute(interaction) {
    const uptimeSec = Math.floor(interaction.client.uptime / 1000);
    const h = Math.floor(uptimeSec / 3600);
    const m = Math.floor((uptimeSec % 3600) / 60);
    const s = uptimeSec % 60;
    await interaction.reply(`Bot **${h} saat ${m} dakika ${s} saniyedir** aktif.`);
  },
},

  // --- userinfo.js ---
  {
  data: new SlashCommandBuilder()
    .setName('kullaniciinfo')
    .setDescription('Bir kullanici hakkinda bilgi gosterir')
    .addUserOption((o) => o.setName('kullanıcı').setDescription('Kullanici').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    const embed = new EmbedBuilder()
      .setTitle(`${user.username} - Kullanici Bilgisi`)
      .setThumbnail(user.displayAvatarURL({ size: 512 }))
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Hesap Olusturma', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Sunucuya Katilma', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Bilinmiyor', inline: true },
        { name: 'Rol Sayisi', value: member ? `${member.roles.cache.size - 1}` : '0', inline: true }
      )
      .setColor(0x5865f2);
    await interaction.reply({ embeds: [embed] });
  },
},
];
