import { Client, Collection, GatewayIntentBits, REST, Routes, EmbedBuilder, ChannelType, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { initializeDatabase } from './utils/database';
import { getPermissionLevel } from './services/permissions';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent] });
(client as any).commands = new Collection();

let commandsArray: any[] = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => fs.statSync(path.join(commandsPath, f)).isDirectory());

for (const folder of commandFiles) {
  const folderPath = path.join(commandsPath, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);
    if (command.data && command.execute) {
      (client as any).commands.set(command.data.name, command);
      commandsArray.push(command.data.toJSON());
    }
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.name && event.execute) {
    if (event.once) {
      client.once(event.name, (...args: any[]) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args: any[]) => event.execute(...args, client));
    }
  }
}

client.once('ready', async () => {
  console.log(`✅ Bot logged in as ${client.user?.tag}`);
  
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    const guildId = process.env.DISCORD_GUILD_ID;
    
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, guildId), { body: commandsArray });
      console.log(`✅ Registered ${commandsArray.length} slash commands to guild`);
    } else {
      await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), { body: commandsArray });
      console.log(`✅ Registered ${commandsArray.length} global slash commands`);
    }
  } catch (error) {
    console.error('❌ Command registration failed:', error);
  }
  
  await initializeDatabase();
  console.log('✅ Database initialized');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = (client as any).commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Command error (${interaction.commandName}):`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ An error occurred executing this command.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ An error occurred executing this command.', ephemeral: true });
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) return;
  
  const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
  if (!welcomeChannelId) return;
  
  const channel = member.guild.channels.cache.get(welcomeChannelId);
  if (channel?.isTextBased()) {
    const embed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle('👋 Welcome to the Server!')
      .setDescription(`Welcome ${member.user.toString()}! We're glad to have you here.`)
      .addFields(
        { name: 'Member #', value: member.guild.memberCount.toString(), inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();
    
    await (channel as TextChannel).send({ embeds: [embed] });
  }
});

client.on('guildMemberRemove', async (member) => {
  if (member.user.bot) return;
  
  const goodbyeChannelId = process.env.GOODBYE_CHANNEL_ID;
  if (!goodbyeChannelId) return;
  
  const channel = member.guild.channels.cache.get(goodbyeChannelId);
  if (channel?.isTextBased()) {
    const embed = new EmbedBuilder()
      .setColor('#D72638')
      .setTitle('👋 Member Departed')
      .setDescription(`${member.user.username} has left the server.`)
      .addFields(
        { name: 'Account', value: `<@${member.user.id}>`, inline: true },
        { name: 'Joined At', value: member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : 'Unknown', inline: true }
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();
    
    await (channel as TextChannel).send({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);

export default client;
