import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('config').setDescription('Configure bot settings'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'config')) return interaction.reply({ content: '❌ Management+ required', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('⚙️ Bot Configuration').setDescription('Configuration system coming soon...').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
