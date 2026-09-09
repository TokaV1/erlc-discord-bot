import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('slowmode').setDescription('Set channel slowmode').addIntegerOption(o => o.setName('duration').setDescription('Seconds (0 to disable)').setRequired(true).setMinValue(0).setMaxValue(21600)),
  async execute(interaction: CommandInteraction) {
    const duration = interaction.options.getInteger('duration');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'slowmode')) return interaction.reply({ content: '❌ Senior Mod+ required', ephemeral: true });
    const channel = interaction.channel as any;
    await channel.setRateLimitPerUser(duration);
    const embed = new EmbedBuilder().setColor('#1E5EFF').setTitle('⏱️ Slowmode Set').addFields({ name: 'Duration', value: duration === 0 ? 'Disabled' : `${duration}s`, inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
