from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import re
import os
import tempfile
import time
from datetime import datetime
import logging
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Rate limiting storage
download_attempts = {}

# Configuration
DOWNLOAD_FOLDER = 'downloads'
MAX_DOWNLOADS_PER_HOUR = 10
ALLOWED_DOMAINS = ['youtube.com', 'youtu.be', 'facebook.com', 'fb.com', 'm.facebook.com']

# Create downloads folder if it doesn't exist
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

def is_allowed_domain(url):
    """Check if the URL is from an allowed domain"""
    return any(domain in url.lower() for domain in ALLOWED_DOMAINS)

def check_rate_limit(ip_address):
    """Check if user has exceeded rate limit"""
    current_time = time.time()
    hour_ago = current_time - 3600
    
    # Clean old entries
    download_attempts[ip_address] = [
        timestamp for timestamp in download_attempts.get(ip_address, [])
        if timestamp > hour_ago
    ]
    
    # Check if limit exceeded
    if len(download_attempts[ip_address]) >= MAX_DOWNLOADS_PER_HOUR:
        return False
    
    # Add current attempt
    download_attempts[ip_address].append(current_time)
    return True

def get_video_info(url):
    """Get video information using yt-dlp"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                'title': info.get('title', 'Unknown Title'),
                'duration': info.get('duration', 0),
                'uploader': info.get('uploader', 'Unknown'),
                'thumbnail': info.get('thumbnail', ''),
                'formats': info.get('formats', []),
                'webpage_url': info.get('webpage_url', url)
            }
    except Exception as e:
        logger.error(f"Error extracting video info: {str(e)}")
        return None

def download_video(url, format_id='best'):
    """Download video using yt-dlp"""
    try:
        # Create temporary file
        temp_dir = tempfile.mkdtemp()
        output_template = os.path.join(temp_dir, '%(title)s.%(ext)s')
        
        ydl_opts = {
            'format': format_id,
            'outtmpl': output_template,
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            downloaded_file = ydl.prepare_filename(info)
            
            # Get file extension
            file_ext = os.path.splitext(downloaded_file)[1]
            if not file_ext:
                file_ext = '.mp4'  # Default extension
            
            # Create safe filename
            safe_title = secure_filename(info.get('title', 'video'))
            final_filename = f"{safe_title}{file_ext}"
            final_path = os.path.join(DOWNLOAD_FOLDER, final_filename)
            
            # Move file to downloads folder
            if os.path.exists(downloaded_file):
                os.rename(downloaded_file, final_path)
                return final_path
            
    except Exception as e:
        logger.error(f"Error downloading video: {str(e)}")
        return None

@app.route('/api/download', methods=['POST'])
def download_video_api():
    """API endpoint for video downloading"""
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        platform = data.get('platform', '').lower()
        
        # Get client IP for rate limiting
        client_ip = request.remote_addr
        
        # Validate input
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        if not is_allowed_domain(url):
            return jsonify({'error': 'Unsupported platform. Only YouTube and Facebook are supported.'}), 400
        
        # Check rate limit
        if not check_rate_limit(client_ip):
            return jsonify({
                'error': f'Rate limit exceeded. Maximum {MAX_DOWNLOADS_PER_HOUR} downloads per hour.'
            }), 429
        
        # Log download attempt
        logger.info(f"Download attempt from {client_ip}: {url}")
        
        # Get video information
        video_info = get_video_info(url)
        if not video_info:
            return jsonify({'error': 'Could not extract video information. Please check the URL.'}), 400
        
        # Download video
        downloaded_path = download_video(url)
        if not downloaded_path:
            return jsonify({'error': 'Failed to download video. Please try again.'}), 500
        
        # Return success response
        return jsonify({
            'success': True,
            'message': 'Video downloaded successfully',
            'filename': os.path.basename(downloaded_path),
            'video_info': {
                'title': video_info['title'],
                'duration': video_info['duration'],
                'uploader': video_info['uploader']
            }
        })
        
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/info', methods=['POST'])
def get_video_info_api():
    """API endpoint for getting video information"""
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        if not is_allowed_domain(url):
            return jsonify({'error': 'Unsupported platform. Only YouTube and Facebook are supported.'}), 400
        
        # Get video information
        video_info = get_video_info(url)
        if not video_info:
            return jsonify({'error': 'Could not extract video information. Please check the URL.'}), 400
        
        # Get available formats
        formats = []
        for fmt in video_info.get('formats', []):
            if fmt.get('ext') in ['mp4', 'webm', 'm4a']:
                formats.append({
                    'format_id': fmt.get('format_id', ''),
                    'ext': fmt.get('ext', ''),
                    'filesize': fmt.get('filesize', 0),
                    'quality': fmt.get('quality', ''),
                    'height': fmt.get('height', 0),
                    'width': fmt.get('width', 0)
                })
        
        return jsonify({
            'success': True,
            'video_info': {
                'title': video_info['title'],
                'duration': video_info['duration'],
                'uploader': video_info['uploader'],
                'thumbnail': video_info['thumbnail'],
                'formats': formats
            }
        })
        
    except Exception as e:
        logger.error(f"Info API error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/download-file/<filename>', methods=['GET'])
def download_file(filename):
    """Serve downloaded files"""
    try:
        file_path = os.path.join(DOWNLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        logger.error(f"File download error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'supported_platforms': ['YouTube', 'Facebook']
    })

@app.route('/api/cleanup', methods=['POST'])
def cleanup_downloads():
    """Clean up old downloaded files"""
    try:
        # Remove files older than 24 hours
        current_time = time.time()
        deleted_count = 0
        
        for filename in os.listdir(DOWNLOAD_FOLDER):
            file_path = os.path.join(DOWNLOAD_FOLDER, filename)
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > 86400:  # 24 hours
                    os.remove(file_path)
                    deleted_count += 1
        
        return jsonify({
            'success': True,
            'message': f'Cleaned up {deleted_count} old files'
        })
        
    except Exception as e:
        logger.error(f"Cleanup error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Get port from environment variable (for cloud deployment)
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 