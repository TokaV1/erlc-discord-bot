import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('accept').setDescription('Accept an application').addStringOption(o => o.setName('application').setDescription('Application ID').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const appId = interaction.options.getString('application');
    const reason = interaction.options.getString('reason');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'accept')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('✅ Application Accepted').addFields({ name: 'Application ID', value: appId || 'N/A' }, { name: 'Reason', value: reason || 'N/A' }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
