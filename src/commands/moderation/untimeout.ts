import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('untimeout').setDescription('Remove timeout from user').addUserOption(o => o.setName('user').setDescription('User').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'untimeout')) return interaction.reply({ content: '❌ Senior Mod+ required', ephemeral: true });
    await interaction.guild?.members.cache.get(user!.id)?.timeout(null);
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('✅ Timeout Removed').addFields({ name: 'User', value: `<@${user?.id}>`, inline: true }, { name: 'Reason', value: reason || 'N/A', inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
