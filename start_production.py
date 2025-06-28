#!/usr/bin/env python3
"""
Production Chat Server Starter
This script starts the Flask chat server using Gunicorn for production.
"""

import os
import subprocess
import sys
import time
import signal
import socket

def check_port(port):
    """Check if a port is in use"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)
            result = s.connect_ex(('localhost', port))
            return result == 0
    except:
        return False

def kill_process_on_port(port):
    """Kill any process using the specified port"""
    try:
        # On Windows, use netstat to find and kill process
        result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
        for line in result.stdout.split('\n'):
            if f':{port}' in line and 'LISTENING' in line:
                parts = line.split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    print(f"Killing process {pid} on port {port}")
                    subprocess.run(['taskkill', '/PID', pid, '/F'], 
                                 capture_output=True, text=True)
    except Exception as e:
        print(f"Warning: Could not kill process on port {port}: {e}")

def start_production_server():
    """Start the production Gunicorn server"""
    port = 4000
    
    print("🚀 Production Chat Server Manager")
    print("=" * 40)
    
    # Kill any existing process on port 4000
    if check_port(port):
        print(f"⚠️  Port {port} is in use. Stopping existing process...")
        kill_process_on_port(port)
        time.sleep(2)
    
    # Set environment variables
    env = os.environ.copy()
    env['FLASK_ENV'] = 'production'
    env['PORT'] = str(port)
    env['GUNICORN_WORKERS'] = '4'
    
    print(f"📦 Environment: {env['FLASK_ENV']}")
    print(f"🌐 Port: {port}")
    print(f"👥 Workers: {env['GUNICORN_WORKERS']}")
    print()
    
    try:
        print("🚀 Starting Gunicorn production server...")
        
        # Start Gunicorn with production configuration
        cmd = [
            sys.executable, '-m', 'gunicorn',
            '--bind', f'0.0.0.0:{port}',
            '--workers', '4',
            '--worker-class', 'eventlet',
            '--worker-connections', '1000',
            '--max-requests', '1000',
            '--max-requests-jitter', '50',
            '--preload',
            '--access-logfile', '-',
            '--error-logfile', '-',
            '--log-level', 'info',
            '--proc-name', 'chat-server',
            'app:app'
        ]
        
        process = subprocess.Popen(cmd, env=env)
        
        # Wait a moment for server to start
        time.sleep(3)
        
        if process.poll() is None:
            print("✅ Production server started successfully!")
            print(f"🔗 Health check: http://localhost:{port}/health")
            print(f"📊 Status: http://localhost:{port}/status")
            print(f"🌐 Chat server: http://localhost:{port}")
            print()
            print("📝 Instructions:")
            print("- Server is running in production mode")
            print("- Open your website to test the chat feature")
            print("- To stop: Press Ctrl+C")
            
            try:
                process.wait()
            except KeyboardInterrupt:
                print("\n🛑 Stopping production server...")
                process.terminate()
                process.wait()
                print("✅ Server stopped")
        else:
            print("❌ Failed to start production server")
            return False
            
    except Exception as e:
        print(f"❌ Error starting production server: {e}")
        return False
    
    return True

if __name__ == '__main__':
    start_production_server() 