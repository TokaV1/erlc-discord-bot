import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('setup').setDescription('Initial bot setup'),
  async execute(interaction: CommandInteraction) {
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (interaction.user.id !== process.env.OWNER_ID) return interaction.reply({ content: '❌ Owner only', ephemeral: true });
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('🛠️ Setup Wizard').setDescription('Bot setup wizard will launch here...').setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
