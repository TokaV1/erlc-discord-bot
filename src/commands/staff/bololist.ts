import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { getActiveBOLOs } from '../../services/bolos';

module.exports = {
  data: new SlashCommandBuilder().setName('bololist').setDescription('View active BOLOs'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'bololist')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const bolos = await getActiveBOLOs(interaction.guildId!);
    const embed = new EmbedBuilder().setColor('#D72638').setTitle(`🚨 Active BOLOs (${bolos.length})`).setDescription(bolos.length === 0 ? 'No active BOLOs' : bolos.map((b: any) => `${b.bolo_id} - ${b.subject}`).join('\n')).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
