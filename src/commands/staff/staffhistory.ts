import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { getUserCases } from '../../services/cases';

module.exports = {
  data: new SlashCommandBuilder().setName('staffhistory').setDescription('View staff history').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'staffhistory')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const history = await getUserCases(interaction.guildId!, user!.id);
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle(`📋 Staff History - ${user?.username}`).setDescription(history.length === 0 ? 'No history' : history.map((h: any) => `${h.case_id} - ${h.type}`).join('\n')).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
