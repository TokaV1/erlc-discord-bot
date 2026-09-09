import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check bot and server status'),
  async execute(interaction: CommandInteraction) {
    const uptime = interaction.client.uptime;
    const hours = Math.floor(uptime! / 3600000);
    const minutes = Math.floor((uptime! % 3600000) / 60000);
    
    const embed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle('📊 System Status')
      .addFields(
        { name: 'Bot Status', value: '✅ Online', inline: true },
        { name: 'Uptime', value: `${hours}h ${minutes}m`, inline: true },
        { name: 'Server', value: `${interaction.guild?.name}`, inline: true },
        { name: 'Members', value: `${interaction.guild?.memberCount}`, inline: true },
        { name: 'Latency', value: `${interaction.client.ws.ping}ms`, inline: true }
      )
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed] });
  }
};
