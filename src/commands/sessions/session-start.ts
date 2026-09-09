import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { db, runAsync } from '../../utils/database';

module.exports = {
  data: new SlashCommandBuilder().setName('session-start').setDescription('Start a new session'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'session-start')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    await runAsync('INSERT INTO session_records (session_id, guild_id, staff_members, status) VALUES (?, ?, ?, ?)', [`SES-${Date.now()}`, interaction.guildId, interaction.user.id, 'active']);
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('▶️ Session Started').setDescription(`Started by <@${interaction.user.id}>`).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
