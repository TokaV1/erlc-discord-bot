import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('staffstats').setDescription('Get staff stats').addUserOption(opt => opt.setName('user').setDescription('Staff member').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser('user');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'staffstats')) return interaction.reply({ content: '❌ Permission denied', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle(`📋 Staff Stats - ${user?.username}`).setDescription('Fetching stats...').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
