// Test ServiceRequest Creation
async function testServiceRequest() {
    const serviceRequestData = {
        name: "Test User Manual",
        email: "test.manual@example.com",
        phone: "0987654321",
        company: "Manual Test Company",
        service_type: "custom-development",
        service_name: "Phát triển ứng dụng tùy chỉnh",
        title: "Yêu cầu test manual từ console",
        description: "Đây là test từ JavaScript console để kiểm tra ServiceRequest API",
        budget_range: "5-10 triệu VNĐ",
        timeline: "1 tháng",
        priority: "high",
        requirements: {
            test_type: 'manual_console_test',
            timestamp: new Date().toISOString()
        }
    };

    try {
        console.log('🚀 Sending service request...', serviceRequestData);
        
        const response = await fetch('/api/service-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceRequestData),
        });

        console.log('📡 Response status:', response.status);
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ SUCCESS! Service request created:', result);
            return result;
        } else {
            console.error('❌ ERROR:', result);
            return null;
        }
        
    } catch (error) {
        console.error('💥 NETWORK ERROR:', error);
        return null;
    }
}

// Execute test
console.log('🧪 Testing ServiceRequest API...');
testServiceRequest().then(result => {
    if (result) {
        console.log('🎉 Test completed successfully!');
        console.log('📋 Request ID:', result.request?.id);
    } else {
        console.log('❌ Test failed!');
    }
});
