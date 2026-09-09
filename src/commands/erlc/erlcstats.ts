import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { getERLCStats } from '../../services/erlc';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('erlcstats')
    .setDescription('Get ER:LC player statistics')
    .addStringOption(opt => opt.setName('user').setDescription('Username').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const username = interaction.options.getString('user');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'erlcstats');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    await interaction.deferReply();
    const result = await getERLCStats(username);

    if (!result.success) {
      return interaction.editReply({ content: `❌ ${result.message}` });
    }

    const embed = new EmbedBuilder()
      .setColor('#1E5EFF')
      .setTitle(`📊 ER:LC Stats - ${username}`)
      .setDescription('Player information from ER:LC server')
      .addFields(
        { name: 'Username', value: result.data?.username || 'N/A', inline: true },
        { name: 'Roblox ID', value: result.data?.robloxId || 'N/A', inline: true },
        { name: 'Team', value: result.data?.team || 'N/A', inline: true },
        { name: 'Permission Level', value: result.data?.permission || 'N/A', inline: true }
      )
      .setTimestamp();

    interaction.editReply({ embeds: [embed] });
  }
};
