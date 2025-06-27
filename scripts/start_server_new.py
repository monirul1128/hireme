#!/usr/bin/env python3
"""
Video Downloader Server Startup Script (New Structure)
This script checks dependencies and starts the Flask server from the new folder structure
"""

import sys
import os
import subprocess

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print("❌ Error: Python 3.7 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'flask',
        'flask_cors', 
        'yt_dlp',
        'werkzeug',
        'requests'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} - Missing")
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("Please install dependencies using:")
        print("pip install -r backend/requirements.txt")
        return False
    
    return True

def create_downloads_folder():
    """Create downloads folder if it doesn't exist"""
    downloads_path = os.path.join('backend', 'downloads')
    if not os.path.exists(downloads_path):
        os.makedirs(downloads_path)
        print("✅ Created downloads folder")
    else:
        print("✅ Downloads folder exists")

def start_server():
    """Start the Flask server"""
    print("\n🚀 Starting Video Downloader Server...")
    print("📍 Server will be available at: http://localhost:5000")
    print("🔗 API Health Check: http://localhost:5000/api/health")
    print("📱 Frontend: Open frontend/pages/video-downloader.html in your browser")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Change to backend directory and run the server
        backend_dir = os.path.join(os.getcwd(), 'backend')
        os.chdir(backend_dir)
        
        # Import and run the Flask app
        from main import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Error starting server: {e}")
        return False
    
    return True

def main():
    """Main startup function"""
    print("🎬 Video Downloader Server Setup (New Structure)")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        return False
    
    print("\n📦 Checking dependencies...")
    if not check_dependencies():
        return False
    
    print("\n📁 Checking folders...")
    create_downloads_folder()
    
    # Start the server
    return start_server()

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1) 