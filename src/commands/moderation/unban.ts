import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('unban').setDescription('Unban a user').addStringOption(o => o.setName('userid').setDescription('User ID').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'unban')) return interaction.reply({ content: '❌ Senior Mod+ required', ephemeral: true });
    await interaction.guild?.bans.remove(userId!, reason!);
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('✅ User Unbanned').addFields({ name: 'User ID', value: userId || 'N/A', inline: true }, { name: 'Reason', value: reason || 'N/A', inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
