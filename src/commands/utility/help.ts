import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Get help with commands'),
  async execute(interaction: CommandInteraction) {
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('👋 Help Menu').setDescription('Use `/help` to see all available commands.').addFields({ name: 'Categories', value: 'ER:LC • Logs • Sessions • Staff • Moderation • Applications • Bot' }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
