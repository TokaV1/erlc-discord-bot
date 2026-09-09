import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('ban').setDescription('Ban a user').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'ban')) return interaction.reply({ content: '❌ Senior Mod+ required', ephemeral: true });
    await interaction.guild?.members.ban(user!.id, { reason: reason! });
    const embed = new EmbedBuilder().setColor('#D72638').setTitle('🔨 User Banned').addFields({ name: 'User', value: `<@${user?.id}>`, inline: true }, { name: 'Reason', value: reason || 'N/A', inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
