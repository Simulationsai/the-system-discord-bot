/**
 * Quick script to create Moderator role with correct permissions
 */
import { Client, GatewayIntentBits, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
  const guild = client.guilds.cache.first();
  if (!guild) {
    console.error('Bot not in any server');
    process.exit(1);
  }

  const roles = await guild.roles.fetch();
  const existing = roles.find(r => r.name === 'Moderator');
  
  if (existing) {
    console.log(`Moderator role already exists: ${existing.id}`);
    console.log('Update config.js with: MODERATOR: \'' + existing.id + '\'');
    process.exit(0);
  }

  try {
    // Calculate permissions properly
    const msgPerm = PermissionFlagsBits.ManageMessages;
    const timeoutPerm = PermissionFlagsBits.TimeoutMembers;
    const auditPerm = PermissionFlagsBits.ViewAuditLog;
    
    // Combine BigInt values properly
    const combinedPerms = msgPerm | timeoutPerm | auditPerm;
    
    // Create Moderator role
    const role = await guild.roles.create({
      name: 'Moderator',
      color: 0xFFA500, // Orange color as number
      permissions: combinedPerms,
      mentionable: true,
      hoist: true,
      reason: 'THE SYSTEM setup - Moderator role'
    });

    console.log(`✅ Created Moderator role: ${role.id}`);
    console.log('\nUpdate config.js with:');
    console.log(`MODERATOR: '${role.id}',`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
