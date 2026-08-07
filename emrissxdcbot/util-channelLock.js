function findOwnerRole(guild) {
  return guild.roles.cache.find((r) => r.name.toLowerCase() === 'owner');
}

async function lockChannel(channel) {
  const guild = channel.guild;
  const ownerRole = findOwnerRole(guild);

  await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
  if (ownerRole) {
    await channel.permissionOverwrites.edit(ownerRole, { SendMessages: true, ViewChannel: true });
  }
}

async function unlockChannel(channel) {
  const guild = channel.guild;
  // @everyone icin SendMessages overwrite'ini kaldir (varsayilan izne don)
  await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: null });
}

module.exports = { lockChannel, unlockChannel, findOwnerRole };
