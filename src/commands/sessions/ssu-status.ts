import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('ssu-status').setDescription('Check SSU vote status'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'ssu-status')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('📋 SSU Status').setDescription('No active vote').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
