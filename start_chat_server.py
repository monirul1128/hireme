#!/usr/bin/env python3
"""
Simple Chat Server Starter
This script starts the chat server and provides status information.
"""

import socket
import subprocess
import sys
import time
import os
from pathlib import Path

def check_port(port):
    """Check if a port is in use"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)
            result = s.connect_ex(('localhost', port))
            return result == 0
    except:
        return False

def start_node_chat_server():
    """Start the Node.js chat server"""
    chat_dir = Path("realtime-chat-server")
    if not chat_dir.exists():
        print("❌ Chat server directory not found")
        return False
    
    try:
        print("🚀 Starting Node.js chat server...")
        # Start the server in the background
        process = subprocess.Popen(
            ["node", "server.js"],
            cwd=chat_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Wait a moment for server to start
        time.sleep(2)
        
        if process.poll() is None:
            print("✅ Chat server started successfully!")
            print(f"📡 Server running on port 4000")
            print(f"🔗 Health check: http://localhost:4000/health")
            return True
        else:
            print("❌ Failed to start chat server")
            return False
            
    except Exception as e:
        print(f"❌ Error starting chat server: {e}")
        return False

def main():
    print("🔍 Chat Server Manager")
    print("=" * 30)
    
    # Check if port 4000 is already in use
    if check_port(4000):
        print("✅ Chat server is already running on port 4000")
        print("🔗 Health check: http://localhost:4000/health")
        return
    
    # Try to start the Node.js server
    if start_node_chat_server():
        print("\n📝 Instructions:")
        print("- Chat server is now running")
        print("- Open your website to test the chat feature")
        print("- To stop: Press Ctrl+C")
        
        try:
            # Keep the script running
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping chat server...")
    else:
        print("\n❌ Failed to start chat server")
        print("💡 Alternative solutions:")
        print("1. Install Node.js: https://nodejs.org/")
        print("2. Use the Python chat server: python simple_chat_server.py")
        print("3. Contact support for assistance")

if __name__ == "__main__":
    main() 