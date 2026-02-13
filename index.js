/**
 * THE SYSTEM Discord Bot
 * 
 * Fully automated Discord community bot with:
 * - Gated onboarding
 * - Role automation
 * - Engagement-based XP system
 * - Anti-scam protection
 * - Form submission handling
 */

import { Client, GatewayIntentBits, Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';
import { config } from './config.js';

dotenv.config();

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// Data storage (in production, use a database)
const userData = new Map(); // userId -> { xp, formSubmitted, lastXpTime, roles }
const formSubmissions = new Set(); // Track who has submitted forms

/**
 * Initialize bot
 */
client.once('ready', async () => {
  console.log(`✅ THE SYSTEM Bot is online as ${client.user.tag}`);
  console.log(`📊 Monitoring ${client.guilds.cache.size} server(s)`);
  
  // Sync existing members
  await syncExistingMembers();
});

/**
 * Sync existing members and assign Unverified role
 */
async function syncExistingMembers() {
  const guild = client.guilds.cache.first();
  if (!guild) return;

  const unverifiedRole = await guild.roles.fetch(config.roles.UNVERIFIED).catch(() => null);
  if (!unverifiedRole) {
    console.warn('⚠️  Unverified role not found. Please check config.js');
    return;
  }

  const members = await guild.members.fetch();
  let synced = 0;

  for (const [id, member] of members) {
    if (member.user.bot) continue;
    
    // Check if user has any of our roles
    const hasRole = member.roles.cache.has(config.roles.VERIFIED) ||
                   member.roles.cache.has(config.roles.EARLY_ACCESS) ||
                   member.roles.cache.has(config.roles.WAITLIST);
    
    if (!hasRole && !member.roles.cache.has(config.roles.UNVERIFIED)) {
      await member.roles.add(config.roles.UNVERIFIED).catch(() => {});
      synced++;
    }
  }

  console.log(`🔄 Synced ${synced} members with Unverified role`);
}

/**
 * Handle new member joins
 */
client.on('guildMemberAdd', async (member) => {
  if (member.user.bot) return;

  const guild = member.guild;
  const unverifiedRole = await guild.roles.fetch(config.roles.UNVERIFIED).catch(() => null);
  
  if (unverifiedRole) {
    await member.roles.add(unverifiedRole).catch(console.error);
    logAction('MEMBER_JOIN', `New member: ${member.user.tag} (${member.id})`);
  }

  // Send welcome message
  const welcomeChannel = await guild.channels.fetch(config.channels.WELCOME).catch(() => null);
  if (welcomeChannel) {
    const embed = new EmbedBuilder()
      .setTitle('🌌 Welcome to THE SYSTEM')
      .setDescription(`
**You are now UNVERIFIED**

To proceed:
1. Read the rules in ${guild.channels.cache.get(config.channels.RULES) || '#rules'}
2. Verify yourself in ${guild.channels.cache.get(config.channels.VERIFY) || '#verify'}
3. Submit the access form
4. Wait for role assignment

**Remember:**
- Never share private keys
- Staff will NEVER DM you first
- No shortcuts - the system decides everything
      `)
      .setColor(0x5865F2)
      .setTimestamp();

    await welcomeChannel.send({ embeds: [embed] }).catch(console.error);
  }
});

/**
 * Handle verification button click
 */
client.on('interactionCreate', async (interaction) => {
  // Verification button
  if (interaction.isButton() && interaction.customId === 'verify_button') {
    await handleVerification(interaction);
  }

  // Form submission button
  if (interaction.isButton() && interaction.customId === 'submit_form_button') {
    await handleFormModal(interaction);
  }

  // Form modal submission
  if (interaction.isModalSubmit() && interaction.customId === 'access_form_modal') {
    await handleFormSubmission(interaction);
  }
});

/**
 * Handle verification process
 */
async function handleVerification(interaction) {
  const member = interaction.member;
  const guild = interaction.guild;

  // Check if already verified
  if (member.roles.cache.has(config.roles.VERIFIED)) {
    return interaction.reply({
      content: '✅ You are already verified!',
      ephemeral: true
    });
  }

  // Anti-alt check (basic - can be enhanced)
  const accountAge = Date.now() - member.user.createdTimestamp;
  const daysOld = accountAge / (1000 * 60 * 60 * 24);

  if (daysOld < 7) {
    return interaction.reply({
      content: '❌ Account must be at least 7 days old to verify. This helps prevent alt accounts.',
      ephemeral: true
    });
  }

  // Assign Verified role, remove Unverified
  try {
    const verifiedRole = await guild.roles.fetch(config.roles.VERIFIED).catch(() => null);
    const unverifiedRole = await guild.roles.fetch(config.roles.UNVERIFIED).catch(() => null);

    if (verifiedRole) await member.roles.add(verifiedRole);
    if (unverifiedRole) await member.roles.remove(unverifiedRole);

    logAction('VERIFICATION', `${member.user.tag} (${member.id}) verified`);

    // Show form submission button
    const embed = new EmbedBuilder()
      .setTitle('✅ Verification Successful')
      .setDescription(`
You are now **VERIFIED**!

Next step: Submit the access form to get your role assignment.

Click the button below to open the form.
      `)
      .setColor(0x00FF00)
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('submit_form_button')
          .setLabel('Submit Access Form')
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  } catch (error) {
    console.error('Verification error:', error);
    await interaction.reply({
      content: '❌ Error during verification. Please contact an admin.',
      ephemeral: true
    });
  }
}

/**
 * Show form modal
 */
async function handleFormModal(interaction) {
  // Check if already submitted
  if (formSubmissions.has(interaction.user.id)) {
    return interaction.reply({
      content: '❌ You have already submitted the form. Only one submission per user is allowed.',
      ephemeral: true
    });
  }

  // Check if verified
  if (!interaction.member.roles.cache.has(config.roles.VERIFIED)) {
    return interaction.reply({
      content: '❌ You must be verified first. Please verify in #verify',
      ephemeral: true
    });
  }

  // Create modal form
  const modal = new ModalBuilder()
    .setCustomId('access_form_modal')
    .setTitle('THE SYSTEM - Access Form');

  const walletInput = new TextInputBuilder()
    .setCustomId('wallet_address')
    .setLabel('Wallet Address')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('0x...')
    .setRequired(true)
    .setMaxLength(100);

  const emailInput = new TextInputBuilder()
    .setCustomId('email_address')
    .setLabel('Email Address')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('your@email.com')
    .setRequired(true)
    .setMaxLength(100);

  const twitterInput = new TextInputBuilder()
    .setCustomId('twitter_handle')
    .setLabel('Twitter Handle')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('@yourhandle')
    .setRequired(true)
    .setMaxLength(50);

  const telegramInput = new TextInputBuilder()
    .setCustomId('telegram_handle')
    .setLabel('Telegram Handle')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('@yourhandle')
    .setRequired(true)
    .setMaxLength(50);

  const checkboxInput = new TextInputBuilder()
    .setCustomId('private_key_checkbox')
    .setLabel('I understand never to share private keys')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Type "YES" to confirm')
    .setRequired(true)
    .setMaxLength(10);

  const row1 = new ActionRowBuilder().addComponents(walletInput);
  const row2 = new ActionRowBuilder().addComponents(emailInput);
  const row3 = new ActionRowBuilder().addComponents(twitterInput);
  const row4 = new ActionRowBuilder().addComponents(telegramInput);
  const row5 = new ActionRowBuilder().addComponents(checkboxInput);

  modal.addComponents(row1, row2, row3, row4, row5);

  await interaction.showModal(modal);
}

/**
 * Handle form submission
 */
async function handleFormSubmission(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const wallet = interaction.fields.getTextInputValue('wallet_address');
  const email = interaction.fields.getTextInputValue('email_address');
  const twitter = interaction.fields.getTextInputValue('twitter_handle');
  const telegram = interaction.fields.getTextInputValue('telegram_handle');
  const checkbox = interaction.fields.getTextInputValue('private_key_checkbox');

  // Validation
  const errors = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Invalid email format');
  }

  // Twitter handle validation
  if (!twitter.startsWith('@')) {
    errors.push('Twitter handle must start with @');
  }

  // Telegram handle validation
  if (!telegram.startsWith('@')) {
    errors.push('Telegram handle must start with @');
  }

  // Checkbox validation
  if (checkbox.toUpperCase() !== 'YES') {
    errors.push('You must confirm that you understand never to share private keys');
  }

  // Wallet address basic validation
  if (!wallet || wallet.length < 10) {
    errors.push('Invalid wallet address');
  }

  if (errors.length > 0) {
    return interaction.editReply({
      content: `❌ Form validation failed:\n${errors.map(e => `• ${e}`).join('\n')}`
    });
  }

  // Check if already submitted
  if (formSubmissions.has(interaction.user.id)) {
    return interaction.editReply({
      content: '❌ You have already submitted the form.'
    });
  }

  // Mark as submitted
  formSubmissions.add(interaction.user.id);

  // Assign Form Submitted role
  const member = interaction.member;
  const guild = interaction.guild;
  
  try {
    const formSubmittedRole = await guild.roles.fetch(config.roles.FORM_SUBMITTED).catch(() => null);
    if (formSubmittedRole) {
      await member.roles.add(formSubmittedRole);
    }

    // Log submission
    logFormSubmission(interaction.user, { wallet, email, twitter, telegram });

    // Process role assignment
    await processRoleAssignment(member);

    await interaction.editReply({
      content: '✅ Form submitted successfully! Your role is being assigned automatically...'
    });
  } catch (error) {
    console.error('Form submission error:', error);
    await interaction.editReply({
      content: '❌ Error processing form. Please contact an admin.'
    });
  }
}

/**
 * Process automatic role assignment after form submission
 */
async function processRoleAssignment(member) {
  const guild = member.guild;

  // Get current role counts
  const earlyAccessRole = await guild.roles.fetch(config.roles.EARLY_ACCESS).catch(() => null);
  const waitlistRole = await guild.roles.fetch(config.roles.WAITLIST).catch(() => null);
  const formSubmittedRole = await guild.roles.fetch(config.roles.FORM_SUBMITTED).catch(() => null);

  if (!earlyAccessRole || !waitlistRole || !formSubmittedRole) {
    console.error('Required roles not found');
    return;
  }

  const earlyAccessCount = earlyAccessRole.members.size;
  const waitlistCount = waitlistRole.members.size;

  // Rule A: Early Access if < 500
  if (earlyAccessCount < config.limits.EARLY_ACCESS_MAX) {
    await member.roles.add(earlyAccessRole);
    await member.roles.remove(formSubmittedRole);
    
    logAction('ROLE_ASSIGNMENT', `${member.user.tag} → Early Access (${earlyAccessCount + 1}/${config.limits.EARLY_ACCESS_MAX})`);
    
    // Notify user
    try {
      await member.send({
        embeds: [new EmbedBuilder()
          .setTitle('🎉 Early Access Granted!')
          .setDescription('You have been assigned **Early Access** role. Welcome to THE SYSTEM!')
          .setColor(0x00FF00)
        ]
      });
    } catch {} // User may have DMs disabled
  }
  // Rule B: Waitlist if EA full and Waitlist < 10,000
  else if (waitlistCount < config.limits.WAITLIST_MAX) {
    await member.roles.add(waitlistRole);
    await member.roles.remove(formSubmittedRole);
    
    logAction('ROLE_ASSIGNMENT', `${member.user.tag} → Waitlist (${waitlistCount + 1}/${config.limits.WAITLIST_MAX})`);
    
    try {
      await member.send({
        embeds: [new EmbedBuilder()
          .setTitle('📋 Waitlist Assignment')
          .setDescription(`You have been assigned **Waitlist** role. Early Access is full (${earlyAccessCount}/${config.limits.EARLY_ACCESS_MAX}).\n\nEngage in #engage to earn XP and upgrade to Early Access!`)
          .setColor(0xFFA500)
        ]
      });
    } catch {}
  }
  // No role if both full
  else {
    logAction('ROLE_ASSIGNMENT', `${member.user.tag} → No role (both EA and Waitlist full)`);
    await member.roles.remove(formSubmittedRole);
  }
}

/**
 * Handle messages - XP system and link filtering
 */
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const member = message.member;
  if (!member) return;

  // Link filtering in #engage channel
  if (message.channel.id === config.channels.ENGAGE) {
    await handleEngageChannel(message);
  }

  // Anti-scam protection (check all channels)
  await checkForScams(message);
});

/**
 * Handle #engage channel - XP system
 */
async function handleEngageChannel(message) {
  const member = message.member;
  const userId = message.author.id;

  // Check if user has Early Access or Waitlist role
  const hasAccess = member.roles.cache.has(config.roles.EARLY_ACCESS) ||
                   member.roles.cache.has(config.roles.WAITLIST);

  if (!hasAccess) {
    await message.delete().catch(() => {});
    return;
  }

  // Check for valid Twitter/X link
  const content = message.content;
  const hasValidLink = config.linkRegex.test(content);

  if (!hasValidLink) {
    await message.delete().catch(() => {});
    await message.channel.send({
      content: `${message.author}, ❌ Only Twitter/X post links are allowed in this channel. Format: https://twitter.com/username/status/1234567890`,
      deleteAfter: 5000
    }).catch(() => {});
    return;
  }

  // Check cooldown
  const userDataEntry = userData.get(userId) || { xp: 0, lastXpTime: 0 };
  const now = Date.now();
  const timeSinceLastXP = now - userDataEntry.lastXpTime;

  if (timeSinceLastXP < config.xp.COOLDOWN_SECONDS * 1000) {
    const remaining = Math.ceil((config.xp.COOLDOWN_SECONDS * 1000 - timeSinceLastXP) / 1000);
    await message.reply({
      content: `⏳ Cooldown: ${remaining}s remaining`,
      deleteAfter: 3000
    }).catch(() => {});
    return;
  }

  // Award XP
  userDataEntry.xp = (userDataEntry.xp || 0) + config.xp.XP_PER_POST;
  userDataEntry.lastXpTime = now;
  userData.set(userId, userDataEntry);

  // Check for promotion (Waitlist → Early Access)
  if (member.roles.cache.has(config.roles.WAITLIST) && 
      userDataEntry.xp >= config.xp.PROMOTION_THRESHOLD) {
    await checkPromotion(member, userDataEntry.xp);
  }

  // React to message
  await message.react('✅').catch(() => {});
}

/**
 * Check if user should be promoted from Waitlist to Early Access
 */
async function checkPromotion(member, userXP) {
  const guild = member.guild;
  const earlyAccessRole = await guild.roles.fetch(config.roles.EARLY_ACCESS).catch(() => null);
  const waitlistRole = await guild.roles.fetch(config.roles.WAITLIST).catch(() => null);

  if (!earlyAccessRole || !waitlistRole) return;

  const earlyAccessCount = earlyAccessRole.members.size;

  // Only promote if EA is not full
  if (earlyAccessCount < config.limits.EARLY_ACCESS_MAX) {
    await member.roles.add(earlyAccessRole);
    await member.roles.remove(waitlistRole);

    logAction('PROMOTION', `${member.user.tag} promoted to Early Access via XP (${userXP} XP)`);

    try {
      await member.send({
        embeds: [new EmbedBuilder()
          .setTitle('🎉 Promotion to Early Access!')
          .setDescription(`Congratulations! You've reached ${userXP} XP and have been promoted to **Early Access**!`)
          .setColor(0x00FF00)
        ]
      });
    } catch {}
  }
}

/**
 * Anti-scam protection
 */
async function checkForScams(message) {
  const content = message.content.toLowerCase();
  const suspiciousPatterns = [
    'private key',
    'seed phrase',
    'send me',
    'dm me',
    'click here',
    'free money',
    'giveaway',
    'airdrop'
  ];

  const hasSuspiciousContent = suspiciousPatterns.some(pattern => content.includes(pattern));

  // Check for external links (except Twitter in #engage)
  const linkPattern = /https?:\/\/[^\s]+/g;
  const links = message.content.match(linkPattern) || [];
  const hasUnauthorizedLinks = links.some(link => {
    if (message.channel.id === config.channels.ENGAGE) {
      return !config.linkRegex.test(link);
    }
    return true; // No links allowed outside #engage
  });

  if (hasSuspiciousContent || hasUnauthorizedLinks) {
    await message.delete().catch(() => {});
    
    // Timeout user
    try {
      await message.member.timeout(60 * 60 * 1000, 'Suspicious content detected'); // 1 hour timeout
    } catch {}

    logAction('SECURITY', `Suspicious content deleted from ${message.author.tag} in ${message.channel.name}`);

    // Log to reports channel
    const reportsChannel = await message.guild.channels.fetch(config.channels.REPORTS).catch(() => null);
    if (reportsChannel) {
      await reportsChannel.send({
        embeds: [new EmbedBuilder()
          .setTitle('⚠️ Suspicious Content Detected')
          .setDescription(`**User:** ${message.author.tag} (${message.author.id})\n**Channel:** ${message.channel}\n**Content:** ${message.content.substring(0, 500)}`)
          .setColor(0xFF0000)
          .setTimestamp()
        ]
      }).catch(() => {});
    }
  }
}

/**
 * Setup verification button in #verify channel
 */
async function setupVerificationChannel() {
  const guild = client.guilds.cache.first();
  if (!guild) return;

  const verifyChannel = await guild.channels.fetch(config.channels.VERIFY).catch(() => null);
  if (!verifyChannel) {
    console.warn('⚠️  Verify channel not found');
    return;
  }

  // Check if message already exists
  const messages = await verifyChannel.messages.fetch({ limit: 10 });
  const existingMessage = messages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

  if (existingMessage) {
    console.log('✅ Verification message already exists');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('🔐 Verification Required')
    .setDescription(`
Click the button below to verify your account.

**Requirements:**
• Account must be at least 7 days old
• No alt accounts allowed

After verification, you'll be able to submit the access form.
    `)
    .setColor(0x5865F2)
    .setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('verify_button')
        .setLabel('Verify Me')
        .setStyle(ButtonStyle.Success)
    );

  await verifyChannel.send({ embeds: [embed], components: [row] });
  console.log('✅ Verification channel setup complete');
}

/**
 * Setup form submission button in #submit-access-form channel
 */
async function setupFormChannel() {
  const guild = client.guilds.cache.first();
  if (!guild) return;

  const formChannel = await guild.channels.fetch(config.channels.SUBMIT_FORM).catch(() => null);
  if (!formChannel) return;

  // Check if message already exists
  const messages = await formChannel.messages.fetch({ limit: 10 });
  const existingMessage = messages.find(m => m.author.id === client.user.id && m.embeds.length > 0);

  if (existingMessage) {
    console.log('✅ Form submission message already exists');
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle('📝 Access Form Submission')
    .setDescription(`
Click the button below to submit your access form.

**Required Information:**
• Wallet Address
• Email Address
• Twitter Handle (@username)
• Telegram Handle (@username)
• Confirmation checkbox

**Note:** Only one submission per user is allowed.
    `)
    .setColor(0x5865F2)
    .setTimestamp();

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('submit_form_button')
        .setLabel('Open Form')
        .setStyle(ButtonStyle.Primary)
    );

  await formChannel.send({ embeds: [embed], components: [row] });
  console.log('✅ Form channel setup complete');
}

/**
 * Log actions to #logs channel
 */
async function logAction(action, details) {
  const guild = client.guilds.cache.first();
  if (!guild) return;

  const logsChannel = await guild.channels.fetch(config.channels.LOGS).catch(() => null);
  if (!logsChannel) return;

  const embed = new EmbedBuilder()
    .setTitle(`📊 ${action}`)
    .setDescription(details)
    .setColor(0x5865F2)
    .setTimestamp();

  await logsChannel.send({ embeds: [embed] }).catch(() => {});
}

/**
 * Log form submissions to #form-logs channel
 */
async function logFormSubmission(user, data) {
  const guild = client.guilds.cache.first();
  if (!guild) return;

  const formLogsChannel = await guild.channels.fetch(config.channels.FORM_LOGS).catch(() => null);
  if (!formLogsChannel) return;

  const embed = new EmbedBuilder()
    .setTitle('📝 Form Submission')
    .setFields([
      { name: 'User', value: `${user.tag} (${user.id})`, inline: true },
      { name: 'Wallet', value: data.wallet.substring(0, 20) + '...', inline: true },
      { name: 'Email', value: data.email, inline: true },
      { name: 'Twitter', value: data.twitter, inline: true },
      { name: 'Telegram', value: data.telegram, inline: true }
    ])
    .setColor(0x00FF00)
    .setTimestamp();

  await formLogsChannel.send({ embeds: [embed] }).catch(() => {});
}

// Setup channels when bot is ready
client.once('ready', async () => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  await setupVerificationChannel();
  await setupFormChannel();
});

// Login
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error('❌ DISCORD_BOT_TOKEN not found in .env file');
  process.exit(1);
}

client.login(token);
