const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = [
  // --- 8ball.js ---
  {
  data: new SlashCommandBuilder()
    .setName('sekiztop')
    .setDescription('Sihirli sekiz topa soru sor')
    .addStringOption((o) => o.setName('soru').setDescription('Sorunuz').setRequired(true)),
  async execute(interaction) {
    const soru = interaction.options.getString('soru');
    const cevap = answers[Math.floor(Math.random() * answers.length)];
    await interaction.reply(`🎱 Soru: ${soru}\nCevap: **${cevap}**`);
  },
},

  // --- choose.js ---
  {
  data: new SlashCommandBuilder()
    .setName('sec')
    .setDescription('Virgul ile ayirdiginiz secenekler arasindan birini secer')
    .addStringOption((o) => o.setName('seçenekler').setDescription('Virgulle ayirin, orn: pizza, burger, lahmacun').setRequired(true)),
  async execute(interaction) {
    const raw = interaction.options.getString('seçenekler');
    const options = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (options.length < 2) return interaction.reply({ content: 'En az 2 secenek girmelisiniz.', ephemeral: true });
    const choice = options[Math.floor(Math.random() * options.length)];
    await interaction.reply(`🤔 Secimim: **${choice}**`);
  },
},

  // --- coinflip.js ---
  {
  data: new SlashCommandBuilder().setName('yazitura').setDescription('Yazi tura atar'),
  async execute(interaction) {
    const result = Math.random() < 0.5 ? 'Yazi' : 'Tura';
    await interaction.reply(`🪙 Sonuc: **${result}**`);
  },
},

  // --- dice.js ---
  {
  data: new SlashCommandBuilder()
    .setName('zar')
    .setDescription('Zar atar')
    .addIntegerOption((o) => o.setName('yuz_sayisi').setDescription('Zarin kac yuzu olsun (varsayilan 6)').setRequired(false)),
  async execute(interaction) {
    const sides = interaction.options.getInteger('yuz_sayisi') || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(`🎲 ${sides} yuzlu zar sonucu: **${result}**`);
  },
},

  // --- poll.js ---
  {
  data: new SlashCommandBuilder()
    .setName('anket')
    .setDescription('Basit bir evet/hayir anketi olusturur')
    .addStringOption((o) => o.setName('soru').setDescription('Anket sorusu').setRequired(true)),
  async execute(interaction) {
    const soru = interaction.options.getString('soru');
    const embed = new EmbedBuilder().setTitle('📊 Anket').setDescription(soru).setColor(0x5865f2);
    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    await msg.react('👍');
    await msg.react('👎');
  },
},

  // --- rps.js ---
  {
  data: new SlashCommandBuilder()
    .setName('taskagitmakas')
    .setDescription('Bota karsi tas kagit makas oynarsin')
    .addStringOption((o) =>
      o
        .setName('seçim')
        .setDescription('Seciminiz')
        .setRequired(true)
        .addChoices({ name: 'Taş', value: 'tas' }, { name: 'Kağıt', value: 'kagit' }, { name: 'Makas', value: 'makas' })
    ),
  async execute(interaction) {
    const options = ['tas', 'kagit', 'makas'];
    const userChoice = interaction.options.getString('seçim');
    const botChoice = options[Math.floor(Math.random() * options.length)];

    let result;
    if (userChoice === botChoice) result = 'Berabere!';
    else if (
      (userChoice === 'tas' && botChoice === 'makas') ||
      (userChoice === 'kagit' && botChoice === 'tas') ||
      (userChoice === 'makas' && botChoice === 'kagit')
    ) {
      result = 'Kazandin!';
    } else {
      result = 'Kaybettin!';
    }

    await interaction.reply(`Sen: **${userChoice}** | Bot: **${botChoice}**\nSonuc: **${result}**`);
  },
},
];
