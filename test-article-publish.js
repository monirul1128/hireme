// Test script to verify article publishing
import fetch from 'node-fetch';

async function testArticlePublish() {
    console.log('🧪 Testing Article Publishing...\n');

    const testArticle = {
        title: "Test Article - JSON Database Working",
        excerpt: "This is a test article to verify that the JSON database is working correctly.",
        content: "<p>This is a test article content. The JSON database is working perfectly!</p><p>You can now publish articles from the dashboard and they will be saved to the database.</p>",
        category: "Test",
        author: "Monirul Islam",
        date: "2024-01-25",
        status: "published",
        featured: false,
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
        slug: "test-article-json-database",
        tags: ["Test", "Database", "JSON"],
        readTime: 3,
        seo: {
            description: "Test article to verify JSON database functionality",
            keywords: "test, database, json"
        }
    };

    try {
        console.log('📝 Publishing test article...');
        
        const response = await fetch('http://localhost:5000/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testArticle)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Article published successfully!');
            console.log('📊 Article ID:', result.data._id);
            console.log('📄 Article Title:', result.data.title);
        } else {
            console.log('❌ Failed to publish article:', result.message);
        }

        console.log('\n📋 Fetching all articles...');
        
        const articlesResponse = await fetch('http://localhost:5000/api/articles');
        const articlesResult = await articlesResponse.json();

        if (articlesResult.success) {
            console.log('✅ Articles fetched successfully!');
            console.log('📊 Total articles:', articlesResult.total);
            console.log('📄 Articles:', articlesResult.data.map(a => a.title));
        } else {
            console.log('❌ Failed to fetch articles:', articlesResult.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testArticlePublish(); 