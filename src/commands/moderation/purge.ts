import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';

module.exports = {
  data: new SlashCommandBuilder().setName('purge').setDescription('Delete messages').addIntegerOption(o => o.setName('amount').setDescription('Number of messages').setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction: CommandInteraction) {
    const amount = interaction.options.getInteger('amount');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'purge')) return interaction.reply({ content: '❌ Senior Mod+ required', ephemeral: true });
    const channel = interaction.channel as any;
    const messages = await channel.messages.fetch({ limit: amount });
    await channel.bulkDelete(messages);
    const embed = new EmbedBuilder().setColor('#2ECC71').setTitle('🗑️ Messages Purged').addFields({ name: 'Amount', value: amount?.toString() || '0', inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
