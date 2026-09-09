import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('ssu').setDescription('Start Server Startup vote'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'ssu')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#F1C40F').setTitle('🚨 Server Startup Vote').setDescription('Would you like to start an ER:LC session?').setTimestamp();
    interaction.reply({ embeds: [embed], components: [] });
  }
};
