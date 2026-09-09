import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playerlogs')
    .setDescription('View logs for a specific player')
    .addStringOption(opt => opt.setName('user').setDescription('Username').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getString('user');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'playerlogs');
    if (!hasPerms) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle(`📋 Player Logs - ${user}`).setDescription('Fetching player logs...').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
