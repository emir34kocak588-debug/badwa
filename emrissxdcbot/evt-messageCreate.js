const { EmbedBuilder } = require('discord.js');
const { containsCurse, containsHolyInsult, normalize } = require('./util-profanity');
const { addWarning, getCount, clearWarnings } = require('./util-warnings');
const config = require('./botsettings');

const SELAM_VARIANTS = ['selamun aleykum', 'selamün aleyküm', 'selamun aleyküm', 'selamün aleykum'];

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    const rawContent = message.content;
    const normalized = normalize(rawContent);

    // --- Selam esprisi ---
    if (normalized === 'sa') {
      message.reply('as').catch(() => {});
      return;
    }
    if (SELAM_VARIANTS.map(normalize).includes(normalized)) {
      message.reply('aleykümselam').catch(() => {});
      return;
    }

    // --- Kutsal degerlere hakaret: direkt ban ---
    if (containsHolyInsult(rawContent)) {
      if (message.member?.bannable) {
        await message.delete().catch(() => {});
        await message.member.send(
          `${message.author.username}, dini/milli degerlere hakaret nedeniyle sunucudan banlandiniz.`
        ).catch(() => {});
        await message.member.ban({ reason: 'Dini/milli degerlere hakaret' }).catch(() => {});
        message.channel.send(`**${message.author.username}** dini/milli degerlere hakaret ettigi icin banlandi.`).catch(() => {});
      }
      return;
    }

    // --- Kufur filtresi ---
    if (containsCurse(rawContent)) {
      await message.delete().catch(() => {});

      const count = addWarning(message.guild.id, message.author.id, 'curse', 'Küfür', 'Otomatik Sistem');

      const warnEmbed = new EmbedBuilder()
        .setColor(0xffa500)
        .setDescription(
          `**${message.author.username}** Uyarı\nSebep: Küfür\nküfür uyarısı: (${count}/${config.CURSE_MAX_WARNINGS})`
        );
      message.channel.send({ embeds: [warnEmbed] }).catch(() => {});

      if (count >= config.CURSE_MAX_WARNINGS) {
        const muteMs = config.MUTE_HOURS_ON_CURSE_LIMIT * 60 * 60 * 1000;
        if (message.member?.moderatable) {
          await message.member.timeout(muteMs, 'Kufur limiti asildi (3/3)').catch(() => {});
          clearWarnings(message.guild.id, message.author.id, 'curse');
          message.channel.send(
            `**${message.author.username}** küfür uyarı limitini doldurdugu icin **${config.MUTE_HOURS_ON_CURSE_LIMIT} saat** susturuldu.`
          ).catch(() => {});
        }
      }
    }
  },
};
