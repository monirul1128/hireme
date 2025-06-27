#!/usr/bin/env python3
"""
Main entry point for the Video Downloader Flask application
"""

import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

if __name__ == '__main__':
    # Get port from environment variable (for cloud deployment)
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"🚀 Starting Video Downloader Server on port {port}")
    print(f"📍 Server will be available at: http://localhost:{port}")
    print(f"🔗 API Health Check: http://localhost:{port}/api/health")
    print(f"📱 Frontend: Open frontend/pages/video-downloader.html in your browser")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)
    
    app.run(debug=debug, host='0.0.0.0', port=port) 