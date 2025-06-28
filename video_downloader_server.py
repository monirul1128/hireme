#!/usr/bin/env python3
"""
Video Downloader Backend Server
Supports YouTube and Facebook video downloads using yt-dlp
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import re
import requests
import json
import logging
from urllib.parse import urlparse, parse_qs
import tempfile
import subprocess
import sys
import yt_dlp

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'

# Configure CORS
CORS(app, origins=['*'])

# Create downloads directory
DOWNLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'downloads')
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

# Get yt-dlp version
YT_DLP_VERSION = "2025.6.25"

class VideoDownloader:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def get_video_info(self, url):
        """Get video information using yt-dlp"""
        try:
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'extract_flat': False,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                if not info:
                    return None, "Failed to extract video information"
                
                return {
                    'title': info.get('title', 'Unknown Title'),
                    'uploader': info.get('uploader', 'Unknown Uploader'),
                    'thumbnail': info.get('thumbnail', ''),
                    'duration': info.get('duration'),
                    'view_count': info.get('view_count'),
                    'like_count': info.get('like_count'),
                    'description': info.get('description', '')[:200] + '...' if info.get('description') else '',
                    'upload_date': info.get('upload_date'),
                    'webpage_url': info.get('webpage_url', url)
                }, None
                
        except Exception as e:
            logger.error(f"Error getting video info: {e}")
            return None, str(e)

    def download_video(self, url, quality='best'):
        """Download video using yt-dlp"""
        try:
            # Generate filename based on video title
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'extract_flat': False,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                if not info:
                    return None, "Failed to extract video information"
                
                title = info.get('title', 'video')
                
                # Clean filename
                safe_title = re.sub(r'[^\w\s-]', '', title).strip()
                safe_title = re.sub(r'[-\s]+', '-', safe_title)
                filename = f"{safe_title[:50]}.mp4"
                
                # Download options
                download_opts = {
                    'format': 'best[ext=mp4]/best',
                    'outtmpl': os.path.join(DOWNLOADS_DIR, filename),
                    'quiet': False,
                    'progress_hooks': [self.progress_hook],
                }
                
                # Download the video
                with yt_dlp.YoutubeDL(download_opts) as ydl:
                    ydl.download([url])
                
                # Check if file was created
                filepath = os.path.join(DOWNLOADS_DIR, filename)
                if os.path.exists(filepath):
                    return filename, None
                else:
                    return None, "Download completed but file not found"
                    
        except Exception as e:
            logger.error(f"Error downloading video: {e}")
            return None, str(e)

    def progress_hook(self, d):
        """Progress hook for download updates"""
        if d['status'] == 'downloading':
            try:
                percent = d.get('_percent_str', '0%')
                speed = d.get('_speed_str', 'N/A')
                eta = d.get('_eta_str', 'N/A')
                logger.info(f"Downloading: {percent} at {speed} ETA: {eta}")
            except:
                pass
        elif d['status'] == 'finished':
            logger.info("Download completed")

    def get_available_formats(self, url):
        """Get available video formats"""
        try:
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                
                if not info:
                    return None, "Failed to extract video information"
                
                formats = info.get('formats', [])
                
                # Filter and format the available formats
                available_formats = []
                for fmt in formats:
                    if fmt.get('ext') in ['mp4', 'webm', 'mkv']:
                        available_formats.append({
                            'format_id': fmt.get('format_id'),
                            'ext': fmt.get('ext'),
                            'resolution': fmt.get('resolution', 'N/A'),
                            'filesize': fmt.get('filesize'),
                            'vcodec': fmt.get('vcodec'),
                            'acodec': fmt.get('acodec'),
                        })
                
                return available_formats, None
                
        except Exception as e:
            logger.error(f"Error getting formats: {e}")
            return None, str(e)

# Initialize video downloader
downloader = VideoDownloader()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'video-downloader',
        'version': '1.0.0',
        'downloads_dir': DOWNLOADS_DIR,
        'yt_dlp_version': YT_DLP_VERSION
    })

@app.route('/api/info', methods=['POST'])
def get_video_info():
    """Get video information"""
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400

        video_info, error = downloader.get_video_info(url)
        
        if error:
            return jsonify({'success': False, 'error': error}), 400

        return jsonify({
            'success': True,
            'video_info': video_info
        })

    except Exception as e:
        logger.error(f"Error in get_video_info: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/formats', methods=['POST'])
def get_formats():
    """Get available video formats"""
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400

        formats, error = downloader.get_available_formats(url)
        
        if error:
            return jsonify({'success': False, 'error': error}), 400

        return jsonify({
            'success': True,
            'formats': formats
        })

    except Exception as e:
        logger.error(f"Error in get_formats: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download_video():
    """Download video"""
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        quality = data.get('quality', 'best')
        
        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400

        filename, error = downloader.download_video(url, quality)
        
        if error:
            return jsonify({'success': False, 'error': error}), 400

        return jsonify({
            'success': True,
            'filename': filename,
            'message': 'Video downloaded successfully'
        })

    except Exception as e:
        logger.error(f"Error in download_video: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/download-file/<filename>', methods=['GET'])
def download_file(filename):
    """Serve downloaded file"""
    try:
        filepath = os.path.join(DOWNLOADS_DIR, filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404

        return send_file(filepath, as_attachment=True, download_name=filename)

    except Exception as e:
        logger.error(f"Error serving file: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Server status"""
    return jsonify({
        'server': 'Video Downloader API',
        'version': '1.0.0',
        'status': 'running',
        'downloads_dir': DOWNLOADS_DIR,
        'yt_dlp_version': YT_DLP_VERSION,
        'supported_platforms': [
            'YouTube', 'Facebook', 'Instagram', 'Twitter', 'TikTok', 
            'Vimeo', 'Dailymotion', 'Reddit', 'LinkedIn', 'Tumblr'
        ]
    })

@app.route('/')
def index():
    """API documentation"""
    return jsonify({
        'service': 'Video Downloader API',
        'version': '1.0.0',
        'yt_dlp_version': YT_DLP_VERSION,
        'endpoints': {
            'GET /api/health': 'Health check',
            'GET /api/status': 'Server status',
            'POST /api/info': 'Get video information',
            'POST /api/formats': 'Get available formats',
            'POST /api/download': 'Download video',
            'GET /api/download-file/<filename>': 'Download file'
        },
        'usage': {
            'info': {
                'method': 'POST',
                'url': '/api/info',
                'body': {'url': 'video_url'}
            },
            'formats': {
                'method': 'POST',
                'url': '/api/formats',
                'body': {'url': 'video_url'}
            },
            'download': {
                'method': 'POST',
                'url': '/api/download',
                'body': {'url': 'video_url', 'quality': 'best|worst|format_id'}
            }
        },
        'supported_platforms': [
            'YouTube', 'Facebook', 'Instagram', 'Twitter', 'TikTok', 
            'Vimeo', 'Dailymotion', 'Reddit', 'LinkedIn', 'Tumblr'
        ]
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = '0.0.0.0'
    
    logger.info(f"🚀 Starting Video Downloader Server")
    logger.info(f"🌐 Host: {host}")
    logger.info(f"🔌 Port: {port}")
    logger.info(f"📁 Downloads Directory: {DOWNLOADS_DIR}")
    logger.info(f"📦 yt-dlp Version: {YT_DLP_VERSION}")
    logger.info(f"🌍 CORS: Enabled for all origins")
    
    app.run(host=host, port=port, debug=True) 