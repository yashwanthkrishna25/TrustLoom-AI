import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '339be7e36cbf72e6e80f4e4d13045c84cc831c00f424c5b44f0ce36d7659caa1f9510d9ca1332325315756d0318966d6';
const token = jwt.sign({ id: '4b30f50f-c962-4fe5-b929-cc0d64a8c4a8', role: 'admin', mfa: true }, JWT_SECRET, { expiresIn: '1h' });

const testQueries = [
  { platform: 'x', username: 'elonmusk' },
  { platform: 'x', username: 'crypto_airdrop_bot99' },
  { platform: 'instagram', username: 'cristiano' },
  { platform: 'instagram', username: 'bot_spammer_3921' },
  { platform: 'meta', username: 'Yashwanth Krishna' },
  { platform: 'meta', username: 'Mark Zuckerberg' }
];

async function runTests() {
  console.log('Testing /api/intelligence/search endpoint:');
  for (const q of testQueries) {
    try {
      const url = 'http://localhost:5050/api/intelligence/search?platform=' + q.platform + '&username=' + encodeURIComponent(q.username);
      const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
      const data = await res.json();
      console.log('[' + q.platform.toUpperCase() + '] "' + q.username + '": HTTP ' + res.status + ' | Name: "' + data.profile?.name + '" | Followers: ' + data.profile?.public_metrics?.followers_count + ' | Label: ' + data.analysis?.mlVerdict?.label + ' (' + data.analysis?.mlVerdict?.classification + ') | Authenticity: ' + data.analysis?.mlVerdict?.authenticityScore + '%');
    } catch (e) {
      console.error('[' + q.platform.toUpperCase() + '] "' + q.username + '" FAILED:', e.message);
    }
  }
}

runTests();
