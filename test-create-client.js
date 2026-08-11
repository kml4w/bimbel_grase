const { createClient } = require('@supabase/supabase-js');
try {
  createClient('https://jnxmnqghgbzmccfuhasb.supabase.co', undefined);
} catch (e) {
  console.log('Error creating client:', e.message);
}
