import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { parseDuration } from '../../utils/helpers';

module.exports = {
  data: new SlashCommandBuilder().setName('timeout').setDescription('Timeout a user').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('duration').setDescription('Duration (5m, 1h, 1d, etc)').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'timeout')) return interaction.reply({ content: '❌ Senior Mod+ required', ephemeral: true });
    const seconds = parseDuration(duration!);
    if (!seconds) return interaction.reply({ content: '❌ Invalid duration format', ephemeral: true });
    await interaction.guild?.members.cache.get(user!.id)?.timeout(seconds * 1000, reason!);
    const embed = new EmbedBuilder().setColor('#F1C40F').setTitle('⏰ User Timed Out').addFields({ name: 'User', value: `<@${user?.id}>`, inline: true }, { name: 'Duration', value: duration || 'N/A', inline: true }, { name: 'Reason', value: reason || 'N/A', inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
