import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { removeBOLO } from '../../services/bolos';

module.exports = {
  data: new SlashCommandBuilder().setName('boloremove').setDescription('Remove a BOLO').addStringOption(opt => opt.setName('id').setDescription('BOLO ID').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const id = interaction.options.getString('id');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'boloremove')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    await removeBOLO(id!, interaction.user.id);
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('🚨 BOLO Removed').addFields({ name: 'BOLO ID', value: id || 'N/A' }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
