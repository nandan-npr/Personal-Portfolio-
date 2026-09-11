import { createClient } from '@supabase/supabase-js';

const url = 'https://hzsfxmocguvlxtiybxih.supabase.co';
const key = 'sb_publishable_E8xXJKVNuIv9UiBO1YyRRA_r3nAMski';

const supabase = createClient(url, key);

async function testAuth() {
  console.log('Testing auth endpoint...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'nandanpruthvi1@gmail.com',
    password: 'dummy_password_to_check_response',
  });

  console.log('Auth result:');
  console.log('Error:', error);
}

testAuth();
