// Test script for backend API
const API_BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
    console.log('🧪 Testing WebCraft Studio Backend API...\n');

    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        if (data.success) {
            console.log('✅ Health check passed:', data.message);
        } else {
            console.log('❌ Health check failed');
        }
    } catch (error) {
        console.log('❌ Health check error:', error.message);
    }

    // Test 2: Get Articles
    console.log('\n2️⃣ Testing Get Articles...');
    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        const data = await response.json();
        if (data.success) {
            console.log(`✅ Found ${data.count} articles`);
            console.log('📄 Articles:', data.data.map(a => a.title).slice(0, 3));
        } else {
            console.log('❌ Failed to get articles');
        }
    } catch (error) {
        console.log('❌ Get articles error:', error.message);
    }

    // Test 3: Get Categories
    console.log('\n3️⃣ Testing Get Categories...');
    try {
        const response = await fetch(`${API_BASE_URL}/articles/categories/list`);
        const data = await response.json();
        if (data.success) {
            console.log('✅ Categories:', data.data);
        } else {
            console.log('❌ Failed to get categories');
        }
    } catch (error) {
        console.log('❌ Get categories error:', error.message);
    }

    // Test 4: Login Test
    console.log('\n4️⃣ Testing Login...');
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@webcraftstudio.com',
                password: 'admin123456'
            })
        });
        const data = await response.json();
        if (data.success) {
            console.log('✅ Login successful');
            console.log('👤 User:', data.user.name);
            console.log('🔑 Token received');
            
            // Test 5: Create Article (with token)
            console.log('\n5️⃣ Testing Create Article...');
            const articleData = {
                title: 'Test Article from API',
                excerpt: 'This is a test article created via API',
                content: '<h2>Test Content</h2><p>This is test content for the article.</p>',
                category: 'Development',
                author: 'Monirul Islam',
                status: 'published',
                featured: false,
                tags: ['test', 'api'],
                readTime: 3
            };

            const articleResponse = await fetch(`${API_BASE_URL}/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify(articleData)
            });

            const articleResult = await articleResponse.json();
            if (articleResult.success) {
                console.log('✅ Article created successfully');
                console.log('📝 Article ID:', articleResult.data._id);
            } else {
                console.log('❌ Failed to create article:', articleResult.message);
            }
        } else {
            console.log('❌ Login failed:', data.message);
        }
    } catch (error) {
        console.log('❌ Login error:', error.message);
    }

    console.log('\n🎉 Backend testing completed!');
}

// Run the test
testBackend().catch(console.error); 