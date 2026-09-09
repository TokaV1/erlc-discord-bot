# ER:LC Discord Bot 🤖

A production-ready Discord bot with **75+ slash commands** built for ER:LC roleplay servers. Features comprehensive moderation, staff management, training systems, ticket support, and welcome/goodbye functionality.

## 🌟 Features

- ✅ **75+ Slash Commands** - Organized into logical categories
- ✅ **Moderation System** - Warn, kick, ban, timeout, purge messages
- ✅ **Staff Management** - Promotions, demotions, LOA, duty status
- ✅ **Training System** - Comprehensive training evaluations with scoring
- ✅ **Ticket System** - Support ticket creation and management
- ✅ **Welcome/Goodbye Events** - Auto-send embeds on member join/leave
- ✅ **Logging System** - Track kills, joins, leaves, commands
- ✅ **Applications** - Staff application handling
- ✅ **BOLO System** - Be On The Lookout alerts
- ✅ **Permission System** - Role-based command access (Senior Mod+ for moderation)
- ✅ **ER:LC API Integration** - Connect to ER:LC servers
- ✅ **Database** - SQLite with comprehensive schemas

## 📋 Command Categories

### ER:LC Commands (10)
`erlcstats`, `erlcserver`, `players`, `staff`, `queue`, `bans`, `erlc-command`, `player`, `vehicles`, `baninfo`

### Logging (10)
`joinlogs`, `leavelogs`, `killlogs`, `commandlogs`, `modcalls`, `logs`, `searchlogs`, `playerlogs`, `sessionlogs`, `exportlogs`

### Sessions (10)
`session-start`, `session-end`, `session-status`, `session-lock`, `session-unlock`, `session-announce`, `sessionplayers`, `sessionstaff`, `ssu`, `ssu-status`

### Staff Management (20)
`stafflist`, `staffinfo`, `staffactivity`, `staffstats`, `staffon`, `staffoff`, `duty`, `loa`, `loalist`, `loa-remove`, `bolo`, `bololist`, `boloremove`, `boloedit`, `staffnotes`, `staffhistory`, `staffreport`, `staffcommend`, `staffactivity-log`, `onlinestaff`

### Moderation (10)
`warn`, `infract`, `kick`, `ban`, `unban`, `timeout`, `untimeout`, `purge`, `slowmode`, `case`

### Management (4)
`promote`, `demote`, `training`, `roster`, `rank`

### Applications (4)
`apply`, `applications`, `application`, `accept`, `deny`

### Utility (12)
`ticket`, `ticket-close`, `welcome`, `goodbye`, `about`, `status`, `help`, `ping`, `botinfo`, `config`, `setup`, `invite`, `announce`, `stats`, `userinfo`

**Total: 75+ Commands**

## ⚙️ Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Discord Bot Token
- Discord Server (for testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TokaV1/erlc-discord-bot.git
cd erlc-discord-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Fill in your `.env` values:
```env
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_GUILD_ID=your_guild_id
OWNER_ID=your_user_id
WELCOME_CHANNEL_ID=welcome_channel_id
GOODBYE_CHANNEL_ID=goodbye_channel_id
TICKET_CATEGORY_ID=ticket_category_id
```

5. Build the bot:
```bash
npm run build
```

6. Start the bot:
```bash
npm start
```

## 🚀 Development

For development with hot reload:
```bash
npm run dev
```

## 📖 Command Usage

### Moderation (Senior Mod+ Required)
```
/warn @user reason
/infract @user [warning|kick|softban|ban|timeout] reason
/ban @user reason
/kick @user reason
/timeout @user 5m Reason
/purge 10
/slowmode 5
```

### Staff Management (Management+ Required)
```
/promote @user "New Role" reason
/demote @user "Previous Role" reason
/training @trainee [Passed|Failed|Pending|Needs Retraining] patrol:8 moderation:9 grammar:8 professionalism:9 scene:8
/loa reason
```

### Tickets
```
/ticket - Create a ticket
/ticket-close - Close current ticket
```

### ER:LC Integration
```
/erlcstats username
/erlcserver
/players
/staff
/bans
```

## 📊 Database Structure

The bot uses SQLite with the following tables:
- `guild_config` - Server configuration
- `cases` - Case records (warnings, infractions, promotions)
- `infractions` - Punishment records
- `training_records` - Training evaluations
- `bolos` - Be On The Lookout alerts
- `tickets` - Support tickets
- `staff_notes` - Notes about staff members
- `staff_reports` - Reports against staff
- `staff_commendations` - Commendations for staff
- `loa` - Leave of absence records
- `session_records` - Session tracking
- `applications` - Staff applications

## 🔐 Permission Levels

1. **Owner** - Full access (set via OWNER_ID)
2. **Management** - Promotions, demotions, training
3. **Admin** - Advanced moderation
4. **Senior Mod** - Moderation commands (warn, infract, ban, kick, timeout)
5. **Moderator** - Basic moderation
6. **Trainer** - Training commands
7. **Staff** - Basic staff commands
8. **Everyone** - Public commands (ticket, help, stats)

## 🎯 Welcome & Goodbye Events

- **Join Event**: Automatically sends a welcome embed to WELCOME_CHANNEL_ID
- **Leave Event**: Automatically sends a goodbye embed to GOODBYE_CHANNEL_ID

Customize messages in `.env`!

## 📝 Customization

Edit DM templates in `src/services/dm.ts` to customize automated messages sent to users.

## 🐛 Troubleshooting

**Commands not showing?**
- Make sure your bot has `applications.commands` scope
- Redeploy commands: `npm run deploy`
- Wait 1 hour for Discord to cache globally (if not using guild ID)

**Bot can't send DMs?**
- Check user privacy settings
- Ensure bot can DM in server

**Database errors?**
- Delete `database.db` to reset
- Ensure `src/utils/database.ts` schemas are valid

## 📄 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 👨‍💻 Author

Built by **TokaV1** for ER:LC roleplay communities.

---

**Made with ❤️ for Discord & ER:LC communities**
