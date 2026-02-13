/**
 * Automated Discord Server Setup Script
 * 
 * This script automatically creates all required roles and channels
 * for THE SYSTEM Discord community.
 * 
 * Usage: node setup-discord-server.js
 * 
 * Make sure:
 * 1. Bot is invited to server with Administrator permission (temporarily)
 * 2. Bot token is set in .env file
 * 3. You run this script ONCE after inviting bot
 */

import { Client, GatewayIntentBits, PermissionFlagsBits, ChannelType, RoleFlags } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// Configuration for roles (in order of hierarchy - top to bottom)
const rolesConfig = [
  {
    name: 'Admin',
    color: '#FF0000',
    permissions: PermissionFlagsBits.Administrator,
    mentionable: true,
    hoist: true
  },
  {
    name: 'Moderator',
    color: '#FFA500',
    permissions: null, // Will be calculated in createRoles function
    mentionable: true,
    hoist: true
  },
  {
    name: 'Early Access',
    color: '#FFD700',
    permissions: 0n,
    mentionable: true,
    hoist: true
  },
  {
    name: 'Waitlist',
    color: '#0099FF',
    permissions: 0n,
    mentionable: true,
    hoist: true
  },
  {
    name: 'Form Submitted',
    color: '#808080',
    permissions: 0n,
    mentionable: false,
    hoist: false
  },
  {
    name: 'Verified',
    color: '#00FF00',
    permissions: 0n,
    mentionable: false,
    hoist: false
  },
  {
    name: 'Unverified',
    color: '#808080',
    permissions: 0n,
    mentionable: false,
    hoist: false
  }
];

// Configuration for channels
const channelsConfig = [
  {
    category: 'Welcome',
    channels: [
      {
        name: 'welcome',
        type: ChannelType.GuildText,
        topic: 'Welcome to THE SYSTEM! Read the rules and verify yourself.',
        permissions: {
          everyone: { ViewChannel: true, SendMessages: false },
          unverified: { ViewChannel: true, SendMessages: false },
          verified: { ViewChannel: true, SendMessages: false }
        }
      },
      {
        name: 'rules',
        type: ChannelType.GuildText,
        topic: 'Community rules and guidelines',
        permissions: {
          everyone: { ViewChannel: true, SendMessages: false },
          unverified: { ViewChannel: true, SendMessages: false },
          verified: { ViewChannel: true, SendMessages: false }
        }
      },
      {
        name: 'verify',
        type: ChannelType.GuildText,
        topic: 'Click the button to verify your account',
        permissions: {
          everyone: { ViewChannel: false },
          unverified: { ViewChannel: true, SendMessages: false },
          verified: { ViewChannel: true, SendMessages: false }
        }
      }
    ]
  },
  {
    category: 'Registration',
    channels: [
      {
        name: 'submit-access-form',
        type: ChannelType.GuildText,
        topic: 'Submit your access form here',
        permissions: {
          everyone: { ViewChannel: false },
          verified: { ViewChannel: true, SendMessages: false }
        }
      }
    ]
  },
  {
    category: 'Announcements',
    channels: [
      {
        name: 'announcements',
        type: ChannelType.GuildText,
        topic: 'Important announcements',
        permissions: {
          everyone: { ViewChannel: false },
          earlyAccess: { ViewChannel: true, SendMessages: false },
          waitlist: { ViewChannel: true, SendMessages: false },
          admin: { ViewChannel: true, SendMessages: true },
          moderator: { ViewChannel: true, SendMessages: true }
        }
      }
    ]
  },
  {
    category: 'Community',
    channels: [
      {
        name: 'general',
        type: ChannelType.GuildText,
        topic: 'General discussion',
        permissions: {
          everyone: { ViewChannel: false },
          earlyAccess: { ViewChannel: true, SendMessages: true },
          waitlist: { ViewChannel: true, SendMessages: true }
        }
      }
    ]
  },
  {
    category: 'Engagement',
    channels: [
      {
        name: 'engage',
        type: ChannelType.GuildText,
        topic: 'Share Twitter/X links here to earn XP!',
        permissions: {
          everyone: { ViewChannel: false },
          earlyAccess: { ViewChannel: true, SendMessages: true },
          waitlist: { ViewChannel: true, SendMessages: true }
        }
      }
    ]
  },
  {
    category: 'Early Access',
    channels: [
      {
        name: 'early-access-chat',
        type: ChannelType.GuildText,
        topic: 'Exclusive chat for Early Access members',
        permissions: {
          everyone: { ViewChannel: false },
          earlyAccess: { ViewChannel: true, SendMessages: true }
        }
      }
    ]
  },
  {
    category: 'Moderation',
    channels: [
      {
        name: 'logs',
        type: ChannelType.GuildText,
        topic: 'Bot action logs',
        permissions: {
          everyone: { ViewChannel: false },
          admin: { ViewChannel: true },
          moderator: { ViewChannel: true }
        }
      },
      {
        name: 'reports',
        type: ChannelType.GuildText,
        topic: 'Security reports and incidents',
        permissions: {
          everyone: { ViewChannel: false },
          admin: { ViewChannel: true },
          moderator: { ViewChannel: true }
        }
      },
      {
        name: 'form-logs',
        type: ChannelType.GuildText,
        topic: 'Form submission logs',
        permissions: {
          everyone: { ViewChannel: false },
          admin: { ViewChannel: true },
          moderator: { ViewChannel: true }
        }
      }
    ]
  }
];

let createdRoles = {};
let createdChannels = {};

client.once('ready', async () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  console.log(`📊 Connected to ${client.guilds.cache.size} server(s)\n`);

  const guild = client.guilds.cache.first();
  if (!guild) {
    console.error('❌ Bot is not in any server!');
    console.log('Please invite the bot to your server first.');
    process.exit(1);
  }

  console.log(`🏠 Setting up server: ${guild.name} (${guild.id})\n`);

  try {
    // Step 1: Create roles
    console.log('📋 Step 1: Creating roles...');
    await createRoles(guild);
    console.log('✅ All roles created!\n');

    // Step 2: Set role hierarchy
    console.log('📋 Step 2: Setting role hierarchy...');
    await setRoleHierarchy(guild);
    console.log('✅ Role hierarchy set!\n');

    // Step 3: Create channels
    console.log('📋 Step 3: Creating channels...');
    await createChannels(guild);
    console.log('✅ All channels created!\n');

    // Step 4: Set default role
    console.log('📋 Step 4: Setting default role...');
    await setDefaultRole(guild);
    console.log('✅ Default role set!\n');

    // Step 5: Generate config.js update
    console.log('📋 Step 5: Generating config update...');
    generateConfigUpdate();
    console.log('✅ Config update ready!\n');

    console.log('🎉 Server setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Copy the config.js update from above');
    console.log('2. Update your config.js file with the IDs');
    console.log('3. Restart your bot');
    console.log('4. Remove Administrator permission from bot (optional but recommended)');
    console.log('\n✅ Your Discord server is ready for THE SYSTEM!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
});

async function createRoles(guild) {
  const existingRoles = await guild.roles.fetch();
  
  for (const roleConfig of rolesConfig) {
    const existing = existingRoles.find(r => r.name === roleConfig.name);
    
    if (existing) {
      console.log(`  ⚠️  Role "${roleConfig.name}" already exists, skipping...`);
      createdRoles[roleConfig.name.toLowerCase().replace(/\s+/g, '_')] = existing.id;
      continue;
    }

    try {
      // Calculate permissions for Moderator role
      let permissions = roleConfig.permissions;
      if (roleConfig.name === 'Moderator' && permissions === null) {
        permissions = PermissionFlagsBits.ManageMessages | PermissionFlagsBits.TimeoutMembers | PermissionFlagsBits.ViewAuditLog;
      }

      const role = await guild.roles.create({
        name: roleConfig.name,
        color: roleConfig.color,
        permissions: permissions,
        mentionable: roleConfig.mentionable,
        hoist: roleConfig.hoist,
        reason: 'THE SYSTEM automated setup'
      });
      
      createdRoles[roleConfig.name.toLowerCase().replace(/\s+/g, '_')] = role.id;
      console.log(`  ✅ Created role: ${roleConfig.name} (${role.id})`);
    } catch (error) {
      console.error(`  ❌ Failed to create role "${roleConfig.name}":`, error.message);
    }
  }
}

async function setRoleHierarchy(guild) {
  const roles = await guild.roles.fetch();
  const botRole = guild.members.me.roles.highest;
  
  // Get all created roles in order
  const roleOrder = [];
  for (const roleConfig of rolesConfig) {
    const roleId = createdRoles[roleConfig.name.toLowerCase().replace(/\s+/g, '_')];
    if (roleId) {
      const role = roles.get(roleId);
      if (role) roleOrder.push(role);
    }
  }

  // Set positions (Admin at top, Unverified at bottom)
  try {
    for (let i = 0; i < roleOrder.length; i++) {
      const role = roleOrder[i];
      const position = guild.roles.cache.size - roleOrder.length + i;
      await role.setPosition(position, 'THE SYSTEM setup');
    }
    console.log('  ✅ Role positions updated');
  } catch (error) {
    console.error('  ⚠️  Could not set role positions:', error.message);
    console.log('  💡 You may need to manually drag roles in Discord');
  }
}

async function createChannels(guild) {
  for (const categoryConfig of channelsConfig) {
    // Create category
    let category;
    const existingCategory = guild.channels.cache.find(
      c => c.type === ChannelType.GuildCategory && c.name === categoryConfig.category
    );

    if (existingCategory) {
      category = existingCategory;
      console.log(`  ⚠️  Category "${categoryConfig.category}" already exists`);
    } else {
      try {
        category = await guild.channels.create({
          name: categoryConfig.category,
          type: ChannelType.GuildCategory,
          reason: 'THE SYSTEM setup'
        });
        console.log(`  ✅ Created category: ${categoryConfig.category}`);
      } catch (error) {
        console.error(`  ❌ Failed to create category "${categoryConfig.category}":`, error.message);
        continue;
      }
    }

    // Create channels in category
    for (const channelConfig of categoryConfig.channels) {
      const existing = guild.channels.cache.find(
        c => c.name === channelConfig.name && c.parentId === category.id
      );

      if (existing) {
        console.log(`    ⚠️  Channel "#${channelConfig.name}" already exists, updating permissions...`);
        createdChannels[channelConfig.name.toUpperCase().replace(/-/g, '_')] = existing.id;
        await updateChannelPermissions(existing, channelConfig, categoryConfig.category);
        continue;
      }

      try {
        const channel = await guild.channels.create({
          name: channelConfig.name,
          type: channelConfig.type,
          parent: category.id,
          topic: channelConfig.topic,
          reason: 'THE SYSTEM setup'
        });

        createdChannels[channelConfig.name.toUpperCase().replace(/-/g, '_')] = channel.id;
        console.log(`    ✅ Created channel: #${channelConfig.name}`);

        // Set permissions
        await updateChannelPermissions(channel, channelConfig, categoryConfig.category);
      } catch (error) {
        console.error(`    ❌ Failed to create channel "#${channelConfig.name}":`, error.message);
      }
    }
  }
}

async function updateChannelPermissions(channel, channelConfig, categoryName) {
  try {
    const everyoneRole = channel.guild.roles.everyone;
    const permissions = channelConfig.permissions;

    // Reset permissions
    await channel.permissionOverwrites.edit(everyoneRole, {
      ViewChannel: null,
      SendMessages: null
    });

    // Apply permissions based on config
    if (permissions.everyone) {
      await channel.permissionOverwrites.edit(everyoneRole, permissions.everyone);
    }

    // Apply role-specific permissions
    const roleMap = {
      unverified: createdRoles.unverified,
      verified: createdRoles.verified,
      earlyAccess: createdRoles.early_access,
      waitlist: createdRoles.waitlist,
      admin: createdRoles.admin,
      moderator: createdRoles.moderator
    };

    for (const [key, roleId] of Object.entries(roleMap)) {
      if (roleId && permissions[key]) {
        const role = channel.guild.roles.cache.get(roleId);
        if (role) {
          await channel.permissionOverwrites.edit(role, permissions[key]);
        }
      }
    }

    // Bot permissions
    const botMember = channel.guild.members.me;
    await channel.permissionOverwrites.edit(botMember, {
      ViewChannel: true,
      SendMessages: true,
      EmbedLinks: true,
      ManageMessages: true
    });

  } catch (error) {
    console.error(`      ⚠️  Could not update permissions for #${channel.name}:`, error.message);
  }
}

async function setDefaultRole(guild) {
  const unverifiedRoleId = createdRoles.unverified;
  if (!unverifiedRoleId) return;

  try {
    await guild.members.fetch();
    const unverifiedRole = guild.roles.cache.get(unverifiedRoleId);
    
    // Set as default role for new members
    // Note: Discord doesn't have API to set default role, but we can assign it to existing members
    const members = guild.members.cache.filter(m => !m.user.bot);
    let assigned = 0;

    for (const [id, member] of members) {
      if (!member.roles.cache.has(unverifiedRoleId) && 
          !member.roles.cache.has(createdRoles.verified) &&
          !member.roles.cache.has(createdRoles.early_access) &&
          !member.roles.cache.has(createdRoles.waitlist)) {
        try {
          await member.roles.add(unverifiedRoleId);
          assigned++;
        } catch {}
      }
    }

    if (assigned > 0) {
      console.log(`  ✅ Assigned Unverified role to ${assigned} existing members`);
    }
  } catch (error) {
    console.error('  ⚠️  Could not set default role:', error.message);
  }
}

function generateConfigUpdate() {
  console.log('\n📋 Copy this into your config.js file:\n');
  console.log('export const config = {');
  console.log('  roles: {');
  console.log(`    ADMIN: '${createdRoles.admin || 'YOUR_ADMIN_ROLE_ID'}',`);
  console.log(`    MODERATOR: '${createdRoles.moderator || 'YOUR_MODERATOR_ROLE_ID'}',`);
  console.log(`    EARLY_ACCESS: '${createdRoles.early_access || 'YOUR_EARLY_ACCESS_ROLE_ID'}',`);
  console.log(`    WAITLIST: '${createdRoles.waitlist || 'YOUR_WAITLIST_ROLE_ID'}',`);
  console.log(`    FORM_SUBMITTED: '${createdRoles.form_submitted || 'YOUR_FORM_SUBMITTED_ROLE_ID'}',`);
  console.log(`    VERIFIED: '${createdRoles.verified || 'YOUR_VERIFIED_ROLE_ID'}',`);
  console.log(`    UNVERIFIED: '${createdRoles.unverified || 'YOUR_UNVERIFIED_ROLE_ID'}'`);
  console.log('  },');
  console.log('');
  console.log('  channels: {');
  console.log(`    WELCOME: '${createdChannels.WELCOME || 'YOUR_WELCOME_CHANNEL_ID'}',`);
  console.log(`    RULES: '${createdChannels.RULES || 'YOUR_RULES_CHANNEL_ID'}',`);
  console.log(`    VERIFY: '${createdChannels.VERIFY || 'YOUR_VERIFY_CHANNEL_ID'}',`);
  console.log(`    SUBMIT_FORM: '${createdChannels.SUBMIT_ACCESS_FORM || 'YOUR_SUBMIT_FORM_CHANNEL_ID'}',`);
  console.log(`    ANNOUNCEMENTS: '${createdChannels.ANNOUNCEMENTS || 'YOUR_ANNOUNCEMENTS_CHANNEL_ID'}',`);
  console.log(`    GENERAL: '${createdChannels.GENERAL || 'YOUR_GENERAL_CHANNEL_ID'}',`);
  console.log(`    ENGAGE: '${createdChannels.ENGAGE || 'YOUR_ENGAGE_CHANNEL_ID'}',`);
  console.log(`    EARLY_ACCESS_CHAT: '${createdChannels.EARLY_ACCESS_CHAT || 'YOUR_EARLY_ACCESS_CHAT_CHANNEL_ID'}',`);
  console.log(`    LOGS: '${createdChannels.LOGS || 'YOUR_LOGS_CHANNEL_ID'}',`);
  console.log(`    REPORTS: '${createdChannels.REPORTS || 'YOUR_REPORTS_CHANNEL_ID'}',`);
  console.log(`    FORM_LOGS: '${createdChannels.FORM_LOGS || 'YOUR_FORM_LOGS_CHANNEL_ID'}'`);
  console.log('  },');
  console.log('');
  console.log('  limits: {');
  console.log('    EARLY_ACCESS_MAX: 500,');
  console.log('    WAITLIST_MAX: 10000');
  console.log('  },');
  console.log('');
  console.log('  xp: {');
  console.log(`    ENABLED_CHANNEL: '${createdChannels.ENGAGE || 'YOUR_ENGAGE_CHANNEL_ID'}',`);
  console.log('    XP_PER_POST: 10,');
  console.log('    COOLDOWN_SECONDS: 120,');
  console.log('    PROMOTION_THRESHOLD: 1000');
  console.log('  },');
  console.log('');
  console.log('  linkRegex: /https?:\\/\\/(www\\.)?(twitter\\.com|x\\.com)\\/[A-Za-z0-9_]+\\/status\\/[0-9]+/,');
  console.log('');
  console.log('  form: {');
  console.log('    MAX_SUBMISSIONS_PER_USER: 1,');
  console.log('    REQUIRED_FIELDS: [\'wallet\', \'email\', \'twitter\', \'telegram\', \'checkbox\']');
  console.log('  }');
  console.log('};');
  console.log('');
}

// Start bot
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error('❌ DISCORD_BOT_TOKEN not found in .env file');
  console.log('Please create .env file with: DISCORD_BOT_TOKEN=your_token_here');
  process.exit(1);
}

client.login(token);
