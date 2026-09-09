import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { updateBOLO } from '../../services/bolos';

module.exports = {
  data: new SlashCommandBuilder().setName('boloedit').setDescription('Edit a BOLO').addStringOption(opt => opt.setName('id').setDescription('BOLO ID').setRequired(true)).addStringOption(opt => opt.setName('subject').setDescription('New subject').setRequired(false)).addStringOption(opt => opt.setName('location').setDescription('New location').setRequired(false)).addStringOption(opt => opt.setName('reason').setDescription('New reason').setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const id = interaction.options.getString('id');
    const subject = interaction.options.getString('subject');
    const location = interaction.options.getString('location');
    const reason = interaction.options.getString('reason');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'boloedit')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    await updateBOLO(id!, subject || undefined, location || undefined, reason || undefined);
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('🚨 BOLO Updated').addFields({ name: 'BOLO ID', value: id || 'N/A' }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
