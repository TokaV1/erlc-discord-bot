import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('session-lock').setDescription('Lock the session'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'session-lock')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#F1C40F').setTitle('🔐 Session Locked').setDescription('Session is now locked').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
