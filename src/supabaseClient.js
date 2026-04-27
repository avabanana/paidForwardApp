import { createClient } from '@supabase/supabase-js'

// For development/testing - replace with your actual Supabase URL and key
const supabaseUrl = 'https://zderurkesdcsfyqcqbhp.supabase.com'
const supabaseKey = 'sb_publishable_RtXJTGiZ_1dAIZkbKYZ4KQ_XCFf0yxw'

// Create mock client for development when Supabase is not available
class MockSupabaseClient {
  constructor() {
    this.authListeners = [];
    this.monitorAuthChanges();
    
    this.auth = {
      signUp: async ({ email, password, options }) => {
        // Mock successful signup
        const user = {
          id: 'mock-user-' + Date.now(),
          email,
          user_metadata: options?.data || {}
        };
        localStorage.setItem('mock_user', JSON.stringify(user));
        this.notifyAuthChange('SIGNED_UP', user);
        return { data: { user }, error: null };
      },
      signInWithPassword: async ({ email, password }) => {
        // Mock successful login
        const user = {
          id: 'mock-user-' + Date.now(),
          email,
          user_metadata: { username: email.split('@')[0] }
        };
        localStorage.setItem('mock_user', JSON.stringify(user));
        this.notifyAuthChange('SIGNED_IN', user);
        return { data: { user }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('mock_user');
        this.notifyAuthChange('SIGNED_OUT', null);
        return { error: null };
      },
      getSession: async () => {
        const user = localStorage.getItem('mock_user');
        const session = user ? { user: JSON.parse(user) } : null;
        return { data: { session }, error: null };
      },
      onAuthStateChange: (callback) => {
        // Register listener
        this.authListeners.push(callback);
        
        // Immediately call with current state
        const user = localStorage.getItem('mock_user');
        if (user) {
          setTimeout(() => callback('SIGNED_IN', { user: JSON.parse(user) }), 10);
        } else {
          setTimeout(() => callback('SIGNED_OUT', null), 10);
        }
        
        // Return unsubscribe function
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {
                this.authListeners = this.authListeners.filter(l => l !== callback);
              } 
            } 
          } 
        };
      }
    };
  }

  notifyAuthChange(event, user) {
    this.authListeners.forEach(callback => {
      setTimeout(() => callback(event, user ? { user } : null), 10);
    });
  }

  monitorAuthChanges() {
    // Monitor localStorage for changes
    let lastState = localStorage.getItem('mock_user');
    setInterval(() => {
      const currentState = localStorage.getItem('mock_user');
      if (currentState !== lastState) {
        lastState = currentState;
        if (currentState) {
          this.notifyAuthChange('SIGNED_IN', JSON.parse(currentState));
        } else {
          this.notifyAuthChange('SIGNED_OUT', null);
        }
      }
    }, 100);

    this.from = (table) => ({
      select: () => ({
        eq: () => ({
          single: async () => {
            // Mock user data retrieval
            const user = localStorage.getItem('mock_user');
            if (user && table === 'users') {
              const parsedUser = JSON.parse(user);
              return {
                data: {
                  id: parsedUser.id,
                  username: parsedUser.user_metadata?.username || parsedUser.email?.split('@')[0],
                  email: parsedUser.email,
                  xp: 0,
                  gameWins: 0,
                  gamesPlayed: 0,
                  coursesCompleted: 0,
                  streak: 1,
                  tier: 'adult',
                  birthYear: parsedUser.user_metadata?.birthYear || 2000,
                  courseProgressMap: {},
                  achievements: [],
                  lastLogin: new Date().toISOString().slice(0, 10)
                },
                error: null
              };
            }
            return { data: null, error: null };
          }
        })
      }),
      insert: (data) => Promise.resolve({ data, error: null }),
      update: (data) => ({
        eq: () => Promise.resolve({ data, error: null })
      })
    });
  }
}

// Use mock client for development
// To use real Supabase, set VITE_USE_REAL_SUPABASE=true
let supabase;

const useRealSupabase = import.meta.env.VITE_USE_REAL_SUPABASE === 'true';

if (useRealSupabase) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Using real Supabase client');
  } catch (error) {
    console.warn('Real Supabase failed, falling back to mock client');
    supabase = new MockSupabaseClient();
  }
} else {
  console.log('Using mock client for development. Set VITE_USE_REAL_SUPABASE=true to use real Supabase');
  supabase = new MockSupabaseClient();
}

export { supabase };