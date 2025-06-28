# Video Downloader

A real video downloader that supports YouTube, Facebook, Instagram, Twitter, TikTok, and many other platforms using yt-dlp.

## Features

- ✅ **Real Video Downloads** - Uses yt-dlp for actual video downloading
- 🌐 **Multiple Platforms** - YouTube, Facebook, Instagram, Twitter, TikTok, Vimeo, Reddit, and more
- 📱 **Mobile Friendly** - Works on all devices and browsers
- 🔒 **Safe & Secure** - No malware, no ads
- ⚡ **Fast Downloads** - Optimized for speed
- 📊 **Video Information** - Shows title, duration, views, likes, and description

## Quick Start

### 1. Start the Backend Server

**Option A: Using Python directly**
```bash
python video_downloader_server.py
```

**Option B: Using the batch file (Windows)**
```bash
start_video_downloader.bat
```

The server will start on `http://localhost:5000`

### 2. Open the Video Downloader

Navigate to: `frontend/pages/video-downloader.html`

Or access it from your main portfolio site.

### 3. Download Videos

1. Paste a video URL (YouTube, Facebook, etc.)
2. The platform will be auto-detected
3. Click "Download Video"
4. The video will be downloaded to your computer

## Supported Platforms

- **YouTube** - Full video downloads with best quality
- **Facebook** - Video downloads from Facebook posts
- **Instagram** - Instagram video and Reels
- **Twitter** - Twitter video downloads
- **TikTok** - TikTok video downloads
- **Vimeo** - Vimeo video downloads
- **Reddit** - Reddit video downloads
- **LinkedIn** - LinkedIn video downloads
- **Tumblr** - Tumblr video downloads
- **And many more** - yt-dlp supports 1000+ sites

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/status` - Server status
- `POST /api/info` - Get video information
- `POST /api/formats` - Get available formats
- `POST /api/download` - Download video
- `GET /api/download-file/<filename>` - Download file

## Technical Details

- **Backend**: Python Flask with yt-dlp
- **Frontend**: HTML, CSS, JavaScript
- **Dependencies**: Flask, Flask-CORS, requests, yt-dlp
- **Downloads Directory**: `./downloads/`

## Troubleshooting

### Backend Not Starting
- Make sure Python is installed
- Install dependencies: `pip install -r requirements_video_downloader.txt`
- Check if port 5000 is available

### Download Issues
- Ensure the video URL is valid and accessible
- Check your internet connection
- Some videos may be restricted or private

### File Not Found
- Check the `downloads/` directory
- Files are saved with cleaned video titles
- Large files may take time to download

## Legal Notice

⚠️ **Important**: This tool is for downloading videos you own or have permission to download. Please respect copyright laws and only download content you have rights to. Downloaded videos should be for personal use only.

## Development

To modify or extend the video downloader:

1. **Backend**: Edit `video_downloader_server.py`
2. **Frontend**: Edit `frontend/js/video-downloader.js`
3. **Styling**: Edit `frontend/pages/video-downloader.html`

The backend uses yt-dlp which is actively maintained and supports new platforms regularly. 