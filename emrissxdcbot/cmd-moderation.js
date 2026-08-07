const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { parseDuration, formatDuration } = require('./util-timeParser');
const { addWarning, getCount, clearWarnings, getUserWarnings } = require('./util-warnings');
const config = require('./botsettings');

module.exports = [
  // --- ban.js ---
  {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bir kullanıcıyı sunucudan yasaklar')
    .addUserOption((opt) => opt.setName('kullanıcı').setDescription('Yasaklanacak kullanıcı').setRequired(true))
    .addStringOption((opt) => opt.setName('sebep').setDescription('Ban sebebi').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
    const member = interaction.guild.members.cache.get(user.id);

    if (member && !member.bannable) {
      return interaction.reply({ content: 'Bu kullanıcıyı banlayamıyorum (yetki/rol sıralaması).', ephemeral: true });
    }

    await user.send(`${user.username}, **${reason}** sebebiyle sunucudan banlandınız.`).catch(() => {});
    await interaction.guild.members.ban(user, { reason });

    await interaction.reply(`**${user.username}** sunucudan banlandı.\nSebep: ${reason}`);
  },
},

  // --- kick.js ---
  {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Bir kullanıcıyı sunucudan atar')
    .addUserOption((opt) => opt.setName('kullanıcı').setDescription('Atılacak kullanıcı').setRequired(true))
    .addStringOption((opt) => opt.setName('sebep').setDescription('Atılma sebebi').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member || !member.kickable) {
      return interaction.reply({ content: 'Bu kullanıcıyı atamıyorum (yetki/rol sıralaması).', ephemeral: true });
    }

    await user.send(`${user.username}, **${reason}** sebebiyle sunucudan atıldınız.`).catch(() => {});
    await member.kick(reason);
    await interaction.reply(`**${user.username}** sunucudan atıldı.\nSebep: ${reason}`);
  },
},

  // --- mute.js ---
  {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Bir kullanıcıyı belirtilen süre boyunca susturur')
    .addUserOption((opt) => opt.setName('kullanıcı').setDescription('Susturulacak kullanıcı').setRequired(true))
    .addStringOption((opt) => opt.setName('sebep').setDescription('Susturma sebebi').setRequired(true))
    .addStringOption((opt) =>
      opt
        .setName('süre')
        .setDescription('Örn: 30sn, 10dk, 2s, 1g (sn=saniye, dk=dakika, s=saat, g=gün)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep');
    const durationInput = interaction.options.getString('süre');
    const member = interaction.guild.members.cache.get(user.id);

    const ms = parseDuration(durationInput);
    if (!ms) {
      return interaction.reply({
        content: 'Geçersiz süre formatı. Örnek kullanım: 30sn, 10dk, 2s, 1g',
        ephemeral: true,
      });
    }

    // Discord timeout max 28 gun
    const maxMs = 28 * 24 * 60 * 60 * 1000;
    if (ms > maxMs) {
      return interaction.reply({ content: 'Susturma süresi en fazla 28 gün olabilir.', ephemeral: true });
    }

    if (!member || !member.moderatable) {
      return interaction.reply({ content: 'Bu kullanıcıyı susturamıyorum (yetki/rol sıralaması).', ephemeral: true });
    }

    await member.timeout(ms, reason);
    await user.send(`${user.username}, **${reason}** sebebiyle ${formatDuration(ms)} boyunca susturuldunuz.`).catch(() => {});

    await interaction.reply(`**${user.username}** ${formatDuration(ms)} boyunca susturuldu.\nSebep: ${reason}`);
  },
},

  // --- unban.js ---
  {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Bir kullanıcının banını kaldırır')
    .addStringOption((opt) => opt.setName('kullanıcı_id').setDescription('Banı kaldırılacak kullanıcının ID si').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const userId = interaction.options.getString('kullanıcı_id');

    try {
      await interaction.guild.members.unban(userId);
      await interaction.reply(`<@${userId}> kullanıcısının banı kaldırıldı.`);
    } catch (err) {
      await interaction.reply({ content: 'Bu ID ile banlı bir kullanıcı bulunamadı.', ephemeral: true });
    }
  },
},

  // --- unmute.js ---
  {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Bir kullanıcının susturmasını kaldırır')
    .addUserOption((opt) => opt.setName('kullanıcı').setDescription('Susturması kaldırılacak kullanıcı').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: 'Kullanıcı sunucuda bulunamadı.', ephemeral: true });
    }

    await member.timeout(null).catch(() => {});
    await interaction.reply(`**${user.username}** kullanıcısının susturması kaldırıldı.`);
  },
},

  // --- uyari.js ---
  {
  data: new SlashCommandBuilder()
    .setName('uyarı')
    .setDescription('Bir kullanıcıya uyarı verir (3 uyarıda sunucudan atılır)')
    .addUserOption((opt) => opt.setName('kullanıcı').setDescription('Uyarılacak kullanıcı').setRequired(true))
    .addStringOption((opt) => opt.setName('sebep').setDescription('Uyarı sebebi').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep');
    const member = interaction.guild.members.cache.get(user.id);

    const count = addWarning(interaction.guild.id, user.id, 'general', reason, interaction.user.tag);
    const max = config.MAX_WARNINGS;

    let dmMessage;
    if (count >= max) {
      dmMessage = `${user.username} emrissx tarafından uyarı aldınız. Uyarı şundan kaynaklıdır: ${reason} (${count}/${max}). Uyarı limitini doldurdugunuz icin sunucudan atildiniz.`;
    } else {
      const kalan = max - count;
      dmMessage = `${user.username} emrissx tarafından uyarı aldınız uyarı şundan kaynaklıdır ${reason} (${count}/${max}) eğer ${kalan} uyarı daha alırsanız sunucudan atılırsınız.`;
    }

    await user.send(dmMessage).catch(() => {});

    if (count >= max) {
      if (member && member.kickable) {
        await member.kick(`Uyarı limiti doldu (${max}/${max})`).catch(() => {});
      }
      clearWarnings(interaction.guild.id, user.id, 'general');
      await interaction.reply(`**${user.username}** ${max}. uyarısını aldığı için sunucudan atıldı.\nSebep: ${reason}`);
    } else {
      await interaction.reply(`**${user.username}** uyarıldı. (${count}/${max})\nSebep: ${reason}`);
    }
  },
},

  // --- uyarilar.js ---
  {
  data: new SlashCommandBuilder()
    .setName('uyarılar')
    .setDescription('Bir kullanıcının uyarı geçmişini gösterir')
    .addUserOption((opt) => opt.setName('kullanıcı').setDescription('Uyarıları gösterilecek kullanıcı').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const data = getUserWarnings(interaction.guild.id, user.id);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`${user.username} - Uyarı Geçmişi`)
      .addFields(
        {
          name: `Genel Uyarılar (${data.general.length}/3)`,
          value: data.general.length
            ? data.general.map((w, i) => `${i + 1}. ${w.reason} - ${w.moderator}`).join('\n')
            : 'Yok',
        },
        {
          name: `Küfür Uyarıları (${data.curse.length}/3)`,
          value: data.curse.length ? data.curse.map((w, i) => `${i + 1}. ${w.reason}`).join('\n') : 'Yok',
        }
      );

    await interaction.reply({ embeds: [embed] });
  },
},

  // --- uyarisil.js ---
  {
  data: new SlashCommandBuilder()
    .setName('uyarısil')
    .setDescription('Bir kullanıcının tüm uyarılarını siler')
    .addUserOption((opt) => opt.setName('kullanıcı').setDescription('Uyarıları silinecek kullanıcı').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    clearWarnings(interaction.guild.id, user.id, 'general');
    clearWarnings(interaction.guild.id, user.id, 'curse');
    await interaction.reply(`**${user.username}** kullanıcısının tüm uyarıları silindi.`);
  },
},
];
