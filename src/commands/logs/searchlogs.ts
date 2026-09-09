import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('searchlogs')
    .setDescription('Search logs')
    .addStringOption(opt => opt.setName('query').setDescription('Search query').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const query = interaction.options.getString('query');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'searchlogs');
    if (!hasPerms) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('🔍 Log Search').setDescription(`Searching for: ${query}`).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
