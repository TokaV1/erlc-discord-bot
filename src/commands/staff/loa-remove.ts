import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('loa-remove').setDescription('Remove a LOA').addUserOption(opt => opt.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'loa-remove')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('📋 LOA Removed').setDescription(`Removed from ${user?.username}`).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
