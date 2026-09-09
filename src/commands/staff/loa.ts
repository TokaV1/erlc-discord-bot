import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { db, runAsync } from '../../utils/database';

module.exports = {
  data: new SlashCommandBuilder().setName('loa').setDescription('Request a leave of absence').addStringOption(opt => opt.setName('reason').setDescription('Reason for LOA').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const reason = interaction.options.getString('reason');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'loa')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    await runAsync('INSERT INTO loa (loa_id, guild_id, user_id, reason, start_date, status) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)', [`LOA-${Date.now()}`, interaction.guildId, interaction.user.id, reason, 'active']);
    const embed = new EmbedBuilder().setColor('#F1C40F').setTitle('📋 LOA Requested').setDescription(`Reason: ${reason}`).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
