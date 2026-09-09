import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('staffinfo').setDescription('Get staff info').addUserOption(opt => opt.setName('user').setDescription('Staff member').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'staffinfo')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle(`📋 Staff Info - ${user?.username}`).setDescription('Fetching staff info...').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
