import { createClient } from '@supabase/supabase-js'

class MockSupabaseClient {
  constructor() {
    this.authEvents = []; // Stores functions that listen for login/logout

    this.auth = {
      // SIGN UP
      signUp: async ({ email, password, options }) => {
        const user = { 
          id: 'local-user-123', 
          email, 
          user_metadata: options?.data || { username: email.split('@')[0] } 
        };
        const session = { user };
        localStorage.setItem('local_session', JSON.stringify(session));
        
        // Signal to the app: USER SIGNED UP
        this.notify('SIGNED_IN', session); 
        return { data: { user, session }, error: null };
      },

      // SIGN IN
      signInWithPassword: async ({ email }) => {
        const user = { 
          id: 'local-user-123', 
          email, 
          user_metadata: { username: email.split('@')[0] } 
        };
        const session = { user };
        localStorage.setItem('local_session', JSON.stringify(session));
        
        // Signal to the app: USER SIGNED IN
        this.notify('SIGNED_IN', session);
        return { data: { user, session }, error: null };
      },

      // SIGN OUT
      signOut: async () => {
        localStorage.removeItem('local_session');
        this.notify('SIGNED_OUT', null);
        window.location.reload(); 
        return { error: null };
      },

      // GET CURRENT SESSION
      getSession: async () => {
        const session = JSON.parse(localStorage.getItem('local_session') || 'null');
        return { data: { session }, error: null };
      },

      // AUTH LISTENER (This makes the buttons work!)
      onAuthStateChange: (callback) => {
        this.authEvents.push(callback);
        
        // Immediately check if someone is already logged in
        const session = JSON.parse(localStorage.getItem('local_session') || 'null');
        if (session) {
          callback('SIGNED_IN', session);
        } else {
          callback('SIGNED_OUT', null);
        }

        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {
                this.authEvents = this.authEvents.filter(cb => cb !== callback);
              } 
            } 
          } 
        };
      }
    };
  }

  // Helper function to tell React the status changed
  notify(event, session) {
    this.authEvents.forEach(callback => callback(event, session));
  }

  from(table) {
    const getLocal = () => JSON.parse(localStorage.getItem(`db_${table}`) || '[]');
    const setLocal = (data) => localStorage.setItem(`db_${table}`, JSON.stringify(data));

    return {
      select: () => {
        const data = getLocal();
        return {
          eq: (f, v) => ({
            single: async () => {
              const item = data.find(i => String(i[f]) === String(v));
              return { data: item || null, error: null };
            }
          }),
          or: () => ({
            order: () => Promise.resolve({ data, error: null })
          }),
          order: (col, { ascending } = {}) => {
            const sorted = [...data].sort((a, b) => {
              return ascending ? new Date(a[col]) - new Date(b[col]) : new Date(b[col]) - new Date(a[col]);
            });
            return Promise.resolve({ data: sorted, error: null });
          },
          then: (resolve) => resolve({ data, error: null })
        };
      },
      insert: async (rows) => {
        const data = getLocal();
        const newRows = rows.map(r => ({ 
          ...r, 
          id: r.id || Math.random().toString(36).substr(2, 9), 
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }));
        setLocal([...data, ...newRows]);
        return { data: newRows, error: null };
      },
      update: (updates) => ({
        eq: (f, v) => {
          const data = getLocal();
          const updated = data.map(i => String(i[f]) === String(v) ? { ...i, ...updates } : i);
          setLocal(updated);
          return Promise.resolve({ data: updated, error: null });
        }
      }),
      delete: () => ({
        eq: (f, v) => {
          const data = getLocal();
          const filtered = data.filter(i => String(i[f]) !== String(v));
          setLocal(filtered);
          return Promise.resolve({ error: null });
        }
      })
    };
  }
}

export const supabase = new MockSupabaseClient();