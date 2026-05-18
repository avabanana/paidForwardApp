/**
 * Utility functions for managing player stats with localStorage as primary storage
 */

const STAT_KEYS = ['xp', 'gameWins', 'gamesPlayed', 'coursesCompleted', 'streak'];

/**
 * Check if a stat value looks corrupted (suspiciously large numbers)
 */
export const isCorruptedValue = (value) => {
  if (typeof value !== 'number') return false;
  // If any stat is above 1,000,000 it's likely corrupted data
  return value > 1000000;
};

/**
 * Get stats from localStorage with validation
 */
export const getLocalStats = (userId) => {
  try {
    const key = `paidforward_stats_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const stats = JSON.parse(stored);
    
    // Validate each stat
    STAT_KEYS.forEach(statKey => {
      if (isCorruptedValue(stats[statKey])) {
        console.warn(`Corrupted stat detected: ${statKey} = ${stats[statKey]}`);
        stats[statKey] = 0;
      }
    });
    
    return stats;
  } catch (err) {
    console.warn('Failed to read stats from localStorage:', err);
    return null;
  }
};

/**
 * Save stats to localStorage
 */
export const setLocalStats = (userId, stats) => {
  try {
    const key = `paidforward_stats_${userId}`;
    // Ensure all values are numbers, not strings
    const cleanStats = { ...stats };
    STAT_KEYS.forEach(statKey => {
      if (statKey in cleanStats) {
        cleanStats[statKey] = parseInt(cleanStats[statKey], 10) || 0;
      }
    });
    localStorage.setItem(key, JSON.stringify(cleanStats));
  } catch (err) {
    console.warn('Failed to write stats to localStorage:', err);
  }
};

/**
 * Clear corrupted stats for a user
 */
export const clearCorruptedStats = (userId) => {
  try {
    const key = `paidforward_stats_${userId}`;
    localStorage.removeItem(key);
    console.log(`Cleared stats for user ${userId}`);
  } catch (err) {
    console.warn('Failed to clear stats:', err);
  }
};

/**
 * Detect if stats are corrupted and need reset
 */
export const detectCorruption = (stats) => {
  if (!stats) return false;
  return STAT_KEYS.some(key => isCorruptedValue(stats[key]));
};
