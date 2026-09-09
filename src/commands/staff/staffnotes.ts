import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { db, runAsync } from '../../utils/database';

module.exports = {
  data: new SlashCommandBuilder().setName('staffnotes').setDescription('Add staff notes').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('notes').setDescription('Notes').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const notes = interaction.options.getString('notes');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'staffnotes')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    await runAsync('INSERT INTO staff_notes (note_id, guild_id, user_id, author_id, notes) VALUES (?, ?, ?, ?, ?)', [`NOTE-${Date.now()}`, interaction.guildId, user!.id, interaction.user.id, notes]);
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('📋 Staff Note Added').addFields({ name: 'User', value: `<@${user?.id}>`, inline: true }, { name: 'Note', value: notes || 'N/A', inline: false }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
