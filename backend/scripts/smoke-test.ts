import process from 'process';

const API_URL = 'http://localhost:5000/api/v1';

async function runSmokeTest() {
  console.log('Running API Smoke Tests...');
  let hasError = false;

  try {
    // 1. Health check
    const health = await fetch(`${API_URL}/health`);
    if (!health.ok) throw new Error(`Health check failed: ${health.status}`);
    console.log('✅ Health check passed');

    // 2. Fetch public configuration
    const config = await fetch(`${API_URL}/config`);
    if (!config.ok) throw new Error(`Config fetch failed: ${config.status}`);
    const configData = await config.json();
    console.log('✅ Config fetch passed');

    // 3. Admin metrics (should fail unauthenticated)
    const metrics = await fetch(`${API_URL}/admin/metrics`);
    if (metrics.status !== 401) {
       console.log('❌ Auth check failed: Expected 401, got ' + metrics.status);
       hasError = true;
    } else {
       console.log('✅ Auth middleware working securely');
    }

  } catch (error) {
    console.error('❌ Smoke test failed:', error);
    hasError = true;
  }

  if (hasError) {
    process.exit(1);
  }
}

runSmokeTest();
