import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { db, runAsync } from '../../utils/database';

module.exports = {
  data: new SlashCommandBuilder().setName('staffreport').setDescription('Report a staff member').addUserOption(o => o.setName('user').setDescription('Staff member').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)).addStringOption(o => o.setName('additional_details').setDescription('Details').setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const details = interaction.options.getString('additional_details');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'staffreport')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    await runAsync('INSERT INTO staff_reports (report_id, guild_id, user_id, author_id, reason, additional_details) VALUES (?, ?, ?, ?, ?, ?)', [`RPT-${Date.now()}`, interaction.guildId, user!.id, interaction.user.id, reason, details || null]);
    const embed = new EmbedBuilder().setColor('#D72638').setTitle('📋 Staff Report Filed').addFields({ name: 'Staff Member', value: `<@${user?.id}>`, inline: true }, { name: 'Reason', value: reason || 'N/A', inline: false }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
