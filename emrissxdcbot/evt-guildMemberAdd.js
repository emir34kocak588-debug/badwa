const { EmbedBuilder } = require('discord.js');
const { getConfig } = require('./util-guildConfig');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const conf = getConfig(member.guild.id);
    if (!conf.welcomeChannel) return;

    const channel = member.guild.channels.cache.get(conf.welcomeChannel);
    if (!channel) return;

    const memberCount = member.guild.memberCount;

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle(`${member.user.username} Sunucumuza hoşgeldin`)
      .setDescription(`Senle birlikte toplam **${memberCount}** kişi olduk!`)
      .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};
