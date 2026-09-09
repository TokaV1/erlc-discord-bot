import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Check bot latency'),
  async execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('🎳 Pong!').addFields({ name: 'Latency', value: `${interaction.client.ws.ping}ms`, inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
