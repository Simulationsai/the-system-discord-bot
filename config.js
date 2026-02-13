/**
 * THE SYSTEM Discord Bot Configuration
 * 
 * IMPORTANT: Update role IDs and channel IDs after creating them in Discord
 * Get IDs by enabling Developer Mode in Discord and right-clicking → Copy ID
 */

export const config = {
  // Role IDs (Auto-generated from setup)
  roles: {
    ADMIN: '1471499373769789561',
    MODERATOR: '1471862345272791223',
    EARLY_ACCESS: '1471862052179021995',
    WAITLIST: '1471499383299113105',
    FORM_SUBMITTED: '1471862053839962226',
    VERIFIED: '1471499385236885505',
    UNVERIFIED: '1471862055559630960'
  },

  // Channel IDs (Auto-generated from setup)
  channels: {
    WELCOME: '1471862071221293056',
    RULES: '1471862082034208769',
    VERIFY: '1471862093551636572',
    SUBMIT_FORM: '1471862105681563680',
    ANNOUNCEMENTS: '1471862117081809051',
    GENERAL: '1471862130813829181',
    ENGAGE: '1471862142126002351',
    EARLY_ACCESS_CHAT: '1471862154536816854',
    LOGS: '1471862165840330859',
    REPORTS: '1471862174120149113',
    FORM_LOGS: '1471862182965936271'
  },

  // Limits
  limits: {
    EARLY_ACCESS_MAX: 500,
    WAITLIST_MAX: 10000
  },

  // XP System Configuration
  xp: {
    ENABLED_CHANNEL: '1471862142126002351', // #engage channel
    XP_PER_POST: 10,
    COOLDOWN_SECONDS: 120, // 2 minutes
    PROMOTION_THRESHOLD: 1000 // XP needed for Waitlist → Early Access upgrade
  },

  // Link Validation Regex (Twitter/X only)
  linkRegex: /https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/[0-9]+/,

  // Form validation
  form: {
    MAX_SUBMISSIONS_PER_USER: 1,
    REQUIRED_FIELDS: ['wallet', 'email', 'twitter', 'telegram', 'checkbox']
  }
};
