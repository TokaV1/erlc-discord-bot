import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { executeERLCCommand } from '../../services/erlc';
import { db, runAsync } from '../../utils/database';

const ALLOWED_COMMANDS = [
  'm',
  'me',
  'pm',
  'announcement',
  'ann',
  'setteam',
  'promote',
  'demote',
  'resetteam'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('erlc-command')
    .setDescription('Execute an authorized ER:LC command')
    .addStringOption(opt => opt.setName('command').setDescription('Command to execute').setRequired(true)),
  async execute(interaction: CommandInteraction) {
    const command = interaction.options.getString('command')!;
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    const hasPerms = await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'erlc-command');

    if (!hasPerms) return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });

    const cmdPrefix = command.split(' ')[0].toLowerCase();
    if (!ALLOWED_COMMANDS.includes(cmdPrefix)) {
      return interaction.reply({ content: `❌ Command "${cmdPrefix}" is not allowed.`, ephemeral: true });
    }

    await interaction.deferReply();
    const result = await executeERLCCommand(command);

    if (!result.success) {
      return interaction.editReply({ content: `❌ ${result.message}` });
    }

    const embed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle('✅ Command Executed')
      .addFields(
        { name: 'Command', value: `\`${command}\``, inline: false },
        { name: 'Executed By', value: `<@${interaction.user.id}>`, inline: true },
        { name: 'Status', value: 'Success', inline: true }
      )
      .setTimestamp();

    await runAsync(
      'INSERT INTO command_logs (command, user_id, guild_id, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      [command, interaction.user.id, interaction.guildId]
    );

    interaction.editReply({ embeds: [embed] });
  }
};
