import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('duty').setDescription('Check current duty status'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'duty')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('📋 Duty Status').setDescription('You are currently off duty').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
