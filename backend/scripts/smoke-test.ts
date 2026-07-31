/**
 * Run with: npx tsx scripts/smoke-test.ts
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */

import process from 'process';

const API_URL = 'http://localhost:5000/api/v1';

async function runTests() {
  console.log('🧪 Starting Smoke Tests...\n');
  let token = '';
  let orderId = '';

  try {
    // 1. Health Check
    console.log('1️⃣ Testing Health Endpoint...');
    const healthRes = await fetch(`${API_URL}/health`);
    if (!healthRes.ok) throw new Error('Health check failed');
    console.log('✅ Health check passed\n');

    // 2. Admin Login
    console.log('2️⃣ Testing Admin Login...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (!loginRes.ok) throw new Error('Login failed');
    const loginData = await loginRes.json();
    token = loginData.data.token;
    if (!token) throw new Error('Token not received');
    console.log('✅ Admin login passed\n');

    // 3. Fetch Admin Metrics
    console.log('3️⃣ Testing Admin Metrics...');
    const metricsRes = await fetch(`${API_URL}/admin/metrics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!metricsRes.ok) throw new Error('Metrics fetch failed');
    const metricsData = await metricsRes.json();
    if (!metricsData.data.delivered) throw new Error('Invalid metrics shape');
    console.log('✅ Metrics fetch passed\n');

    // 4. Fetch Admin Orders
    console.log('4️⃣ Testing Admin Orders List...');
    const ordersRes = await fetch(`${API_URL}/admin/orders?limit=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!ordersRes.ok) {
      const err = await ordersRes.text();
      throw new Error(`Orders fetch failed: ${err}`);
    }
    const ordersData = await ordersRes.json();
    
    if (!Array.isArray(ordersData.data.orders)) throw new Error('Invalid orders shape');
    console.log(`✅ Orders fetch passed (Found ${ordersData.data.pagination.total} orders)\n`);

    if (ordersData.data.orders.length > 0) {
      orderId = ordersData.data.orders[0].id;
      const currentStatus = ordersData.data.orders[0].status;

      // 5. Update Order Status
      console.log(`5️⃣ Testing Order Status Update on Order ${orderId}...`);
      
      // Toggle status just to test the endpoint
      const nextStatus = currentStatus === 'PENDING' ? 'CONFIRMED' : 'PENDING';

      const updateRes = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: nextStatus, notes: 'Automated smoke test update' })
      });

      if (!updateRes.ok) {
        const errBody = await updateRes.text();
        throw new Error(`Order update failed: ${errBody}`);
      }
      
      const updateData = await updateRes.json();
      if (updateData.data.status !== nextStatus) throw new Error('Status did not update correctly');
      console.log(`✅ Order status updated to ${nextStatus}\n`);
    } else {
      console.log('⚠️ Skipping status update test: No orders found in DB\n');
    }

    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! No crashes detected.');
    process.exit(0);

  } catch (error) {
    console.error('❌ TEST FAILED:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

runTests();
