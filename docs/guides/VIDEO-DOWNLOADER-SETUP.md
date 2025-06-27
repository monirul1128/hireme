# Video Downloader Setup Guide

This guide will help you set up the YouTube and Facebook video downloader with both backend and frontend functionality.

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- Modern web browser

## Backend Setup

### 1. Install Python Dependencies

Open a terminal/command prompt in the project directory and run:

```bash
pip install -r requirements.txt
```

This will install all required packages:
- Flask (web framework)
- Flask-CORS (cross-origin resource sharing)
- yt-dlp (video downloader library)
- Werkzeug (utilities)
- requests (HTTP library)

### 2. Start the Backend Server

Run the Flask application:

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 3. Verify Backend Health

Visit `http://localhost:5000/api/health` in your browser to check if the backend is running properly.

## Frontend Setup

### 1. Open the Video Downloader Page

Open `video-downloader.html` in your web browser. You can do this by:
- Double-clicking the file
- Dragging it into your browser
- Using a local server (recommended)

### 2. Using a Local Server (Recommended)

For better functionality, serve the files using a local server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx serve .
```

Then visit `http://localhost:8000/video-downloader.html`

## Usage

### 1. Basic Download Process

1. **Enter Video URL**: Paste a YouTube or Facebook video URL
2. **Select Platform**: Choose YouTube or Facebook (auto-detected from URL)
3. **Click Download**: The system will fetch video info and start downloading
4. **Download File**: The video will be downloaded to your computer

### 2. Supported URL Formats

**YouTube:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

**Facebook:**
- `https://www.facebook.com/video.php?v=VIDEO_ID`
- `https://fb.com/video.php?v=VIDEO_ID`
- `https://m.facebook.com/video.php?v=VIDEO_ID`

## Features

### Backend Features
- ✅ YouTube video downloading
- ✅ Facebook video downloading
- ✅ Rate limiting (10 downloads per hour per IP)
- ✅ Video information extraction
- ✅ Multiple format support
- ✅ Automatic file cleanup
- ✅ Error handling and logging
- ✅ CORS support for frontend integration

### Frontend Features
- ✅ Modern, responsive UI
- ✅ Auto-platform detection
- ✅ Real-time video info preview
- ✅ Progress indicators
- ✅ Error notifications
- ✅ Mobile-friendly design
- ✅ Legal disclaimers

## API Endpoints

### Health Check
```
GET /api/health
```
Returns backend status and supported platforms.

### Get Video Information
```
POST /api/info
Content-Type: application/json

{
    "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```
Returns video metadata and available formats.

### Download Video
```
POST /api/download
Content-Type: application/json

{
    "url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "platform": "youtube"
}
```
Downloads the video and returns success status.

### Download File
```
GET /api/download-file/<filename>
```
Serves the downloaded file for browser download.

### Cleanup Old Files
```
POST /api/cleanup
```
Removes files older than 24 hours.

## Configuration

### Rate Limiting
Edit `app.py` to modify rate limits:
```python
MAX_DOWNLOADS_PER_HOUR = 10  # Change this value
```

### Allowed Domains
Modify the allowed domains list:
```python
ALLOWED_DOMAINS = ['youtube.com', 'youtu.be', 'facebook.com', 'fb.com', 'm.facebook.com']
```

### Download Folder
Change the download directory:
```python
DOWNLOAD_FOLDER = 'downloads'  # Change this path
```

## Troubleshooting

### Common Issues

1. **"Backend not available" error**
   - Make sure the Flask server is running
   - Check if port 5000 is available
   - Verify the API URL in `video-downloader.js`

2. **"Could not extract video information" error**
   - Check if the URL is valid
   - Ensure the video is publicly accessible
   - Try a different video URL

3. **"Rate limit exceeded" error**
   - Wait for the rate limit to reset (1 hour)
   - Use a different IP address
   - Modify the rate limit in the backend

4. **Download fails**
   - Check internet connection
   - Verify video is not private/restricted
   - Try a different video format

### Debug Mode

Enable debug mode in `app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### Logs

Check the console output for detailed error messages and logs.

## Security Considerations

1. **Rate Limiting**: Prevents abuse and server overload
2. **Domain Validation**: Only allows supported platforms
3. **File Cleanup**: Automatically removes old files
4. **Input Validation**: Sanitizes user inputs
5. **Error Handling**: Prevents information leakage

## Legal Notice

⚠️ **Important**: This tool is for educational purposes and personal use only.

- Only download videos you own or have permission to download
- Respect copyright laws and terms of service
- Do not use for commercial purposes without permission
- The developers are not responsible for misuse

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console logs
3. Verify all dependencies are installed
4. Test with different video URLs

## Updates

Keep the dependencies updated:
```bash
pip install --upgrade -r requirements.txt
```

The `yt-dlp` library is frequently updated to handle new platform changes. 