#!/usr/bin/env node
/**
 * Script to update API URL in video-downloader.js for deployment
 * Usage: node update-api-url.js <your-deployed-url>
 * Example: node update-api-url.js https://my-app.herokuapp.com
 */

const fs = require('fs');
const path = require('path');

// Get the new API URL from command line argument
const newApiUrl = process.argv[2];

if (!newApiUrl) {
    console.log('❌ Please provide the deployed API URL');
    console.log('Usage: node update-api-url.js <your-deployed-url>');
    console.log('Example: node update-api-url.js https://my-app.herokuapp.com');
    process.exit(1);
}

// Validate URL format
if (!newApiUrl.startsWith('http')) {
    console.log('❌ Please provide a valid URL starting with http:// or https://');
    process.exit(1);
}

// Remove trailing slash if present
const cleanApiUrl = newApiUrl.replace(/\/$/, '');
const fullApiUrl = `${cleanApiUrl}/api`;

// Read the video-downloader.js file
const filePath = path.join(__dirname, 'video-downloader.js');

try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the API URL
    const oldPattern = /this\.apiBaseUrl\s*=\s*['"`][^'"`]+['"`]/;
    const newLine = `this.apiBaseUrl = '${fullApiUrl}'`;
    
    if (oldPattern.test(content)) {
        content = content.replace(oldPattern, newLine);
        
        // Write the updated content back
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log('✅ Successfully updated API URL!');
        console.log(`📍 New API URL: ${fullApiUrl}`);
        console.log('\n📝 Next steps:');
        console.log('1. Upload the updated video-downloader.html to your web server');
        console.log('2. Test the video downloader with the new backend');
        console.log('3. Make sure your backend is running at:', cleanApiUrl);
        
    } else {
        console.log('❌ Could not find the API URL line in video-downloader.js');
        console.log('Please manually update the apiBaseUrl in the file.');
    }
    
} catch (error) {
    console.log('❌ Error updating file:', error.message);
    console.log('\n📝 Manual update required:');
    console.log('Open video-downloader.js and change this line:');
    console.log(`this.apiBaseUrl = '${fullApiUrl}';`);
} 