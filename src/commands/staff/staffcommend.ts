import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { db, runAsync } from '../../utils/database';

module.exports = {
  data: new SlashCommandBuilder().setName('staffcommend').setDescription('Commend a staff member').addUserOption(o => o.setName('user').setDescription('Staff member').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'staffcommend')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    await runAsync('INSERT INTO staff_commendations (commendation_id, guild_id, user_id, author_id, reason) VALUES (?, ?, ?, ?, ?)', [`CMD-${Date.now()}`, interaction.guildId, user!.id, interaction.user.id, reason]);
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('🌟 Staff Commendation').addFields({ name: 'Staff Member', value: `<@${user?.id}>`, inline: true }, { name: 'Reason', value: reason || 'N/A', inline: false }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
