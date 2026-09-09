import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { hasCommandPermission } from '../../services/permissions';
import { createTrainingRecord, getTrainingRecord } from '../../services/training';
import { sendCustomDM, getDMTemplate, defaultDMTemplates } from '../../services/dm';
import { validateTrainingScore, formatDate } from '../../utils/helpers';

module.exports = {
  data: new SlashCommandBuilder().setName('training').setDescription('Submit training evaluation').addUserOption(o => o.setName('trainee').setDescription('Trainee').setRequired(true)).addStringOption(o => o.setName('result_status').setDescription('Result').addChoices({ name: 'Passed', value: 'Passed' }, { name: 'Failed', value: 'Failed' }, { name: 'Pending', value: 'Pending' }, { name: 'Needs Retraining', value: 'Needs Retraining' }).setRequired(true)).addIntegerOption(o => o.setName('patrol_performance').setDescription('0-10').setRequired(true).setMinValue(0).setMaxValue(10)).addIntegerOption(o => o.setName('moderation_ability').setDescription('0-10').setRequired(true).setMinValue(0).setMaxValue(10)).addIntegerOption(o => o.setName('grammar_usage').setDescription('0-10').setRequired(true).setMinValue(0).setMaxValue(10)).addIntegerOption(o => o.setName('professionalism').setDescription('0-10').setRequired(true).setMinValue(0).setMaxValue(10)).addIntegerOption(o => o.setName('scene_handling').setDescription('0-10').setRequired(true).setMinValue(0).setMaxValue(10)).addStringOption(o => o.setName('additional_notes').setDescription('Notes').setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const trainee = interaction.options.getUser('trainee');
    const resultStatus = interaction.options.getString('result_status');
    const patrolPerf = interaction.options.getInteger('patrol_performance');
    const modAbility = interaction.options.getInteger('moderation_ability');
    const grammar = interaction.options.getInteger('grammar_usage');
    const prof = interaction.options.getInteger('professionalism');
    const scene = interaction.options.getInteger('scene_handling');
    const notes = interaction.options.getString('additional_notes');
    const roles = interaction.member?.roles.cache.map((r: any) => r.id) || [];
    if (!await hasCommandPermission(interaction.user.id, interaction.guildId!, roles as string[], 'training')) return interaction.reply({ content: '❌ Trainer+ required', ephemeral: true });
    if (![patrolPerf, modAbility, grammar, prof, scene].every(s => validateTrainingScore(s!))) return interaction.reply({ content: '❌ All scores must be 0-10', ephemeral: true });
    const trainingId = await createTrainingRecord(interaction.guildId!, trainee!.id, interaction.user.id, resultStatus!, { patrol: patrolPerf!, moderation: modAbility!, grammar: grammar!, professionalism: prof!, scene: scene! }, notes || undefined);
    const record = await getTrainingRecord(trainingId);
    const templateKey = resultStatus === 'Passed' ? 'training_passed' : resultStatus === 'Failed' ? 'training_failed' : 'training_pending';
    const template = await getDMTemplate(interaction.guildId!, templateKey) || (defaultDMTemplates as any)[templateKey];
    await sendCustomDM(trainee, template, { user: trainee?.username || 'User', staff_member: interaction.user.username, result: resultStatus || 'N/A', patrol_performance: patrolPerf?.toString() || '0', moderation_ability: modAbility?.toString() || '0', grammar_usage: grammar?.toString() || '0', professionalism: prof?.toString() || '0', scene_handling: scene?.toString() || '0', total_score: record?.total_score?.toString() || '0', average_score: record?.average_score?.toString() || '0', percentage: record?.percentage?.toString() || '0', additional_notes: notes || 'None', training_id: trainingId });
    const embed = new EmbedBuilder().setColor(resultStatus === 'Passed' ? '#2ECC71' : '#D72638').setTitle('🎓 Training Evaluation').addFields({ name: 'Trainee', value: `<@${trainee?.id}>`, inline: true }, { name: 'Result', value: resultStatus || 'N/A', inline: true }, { name: 'Training ID', value: trainingId, inline: true }, { name: 'Patrol Performance', value: `${patrolPerf}/10`, inline: true }, { name: 'Moderation Ability', value: `${modAbility}/10`, inline: true }, { name: 'Grammar Usage', value: `${grammar}/10`, inline: true }, { name: 'Professionalism', value: `${prof}/10`, inline: true }, { name: 'Scene Handling', value: `${scene}/10`, inline: true }, { name: 'Total Score', value: `${record?.total_score}/50 (${record?.percentage}%)`, inline: true }).setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
