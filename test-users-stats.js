// Test users stats API
const testUsersStats = async () => {
  try {
    console.log('🧪 Testing Users Stats API...');
    
    const response = await fetch('http://localhost:3000/api/admin/users/stats');
    const data = await response.json();
    
    console.log('📊 Users Stats Response:');
    console.log('Total Users:', data.total);
    console.log('Deleted Users:', data.deletedUsers);
    console.log('Admin Users:', data.admins);
    console.log('Full Response:', JSON.stringify(data, null, 2));
    
    if (data.deletedUsers === 0) {
      console.log('❌ PROBLEM: deletedUsers is 0, should be 3!');
    } else {
      console.log('✅ SUCCESS: deletedUsers count looks correct!');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
};

testUsersStats();
