const url = 'https://hzsfxmocguvlxtiybxih.supabase.co';
const key = 'sb_publishable_E8xXJKVNuIv9UiBO1YyRRA_r3nAMski';

async function checkRest() {
  const res = await fetch(`${url}/rest/v1/`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  console.log('Status:', res.status, res.statusText);
  const data = await res.json();
  console.log('Response body:', data);
}

checkRest();
