const { EmbedBuilder } = require('discord.js');
const { getConfig } = require('./util-guildConfig');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const conf = getConfig(member.guild.id);
    if (!conf.leaveChannel) return;

    const channel = member.guild.channels.cache.get(conf.leaveChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0xed4245)
      .setTitle(`${member.user.username} sunucudan ayrıldı, görüşürüz.`)
      .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};
