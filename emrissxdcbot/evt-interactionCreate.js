const config = require('./botsettings');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // ISTEK: Botu sadece belirtilen ID kullanabilecek.
    if (interaction.user.id !== config.OWNER_ID) {
      return interaction.reply({
        content: 'Bu botu kullanma yetkin yok. Bu bot yalnizca sahibi tarafindan kullanilabilir.',
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Komut hatasi (${interaction.commandName}):`, error);
      const errPayload = { content: 'Komut calistirilirken bir hata olustu.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errPayload).catch(() => {});
      } else {
        await interaction.reply(errPayload).catch(() => {});
      }
    }
  },
};
