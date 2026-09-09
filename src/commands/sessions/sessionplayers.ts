import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('sessionplayers').setDescription('View players in session'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'sessionplayers')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('👥 Session Players').setDescription('No active session').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
