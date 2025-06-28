// Video Downloader Frontend JavaScript
class VideoDownloader {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.backendAvailable = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkBackendHealth();
    }

    setupEventListeners() {
        const form = document.querySelector('.downloader-form');
        const urlInput = document.getElementById('videoUrl');
        const platformSelect = document.getElementById('platform');

        // Form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Auto-detect platform from URL
        urlInput.addEventListener('input', (e) => this.autoDetectPlatform(e.target.value));

        // Get video info when URL changes
        urlInput.addEventListener('blur', (e) => this.getVideoInfo(e.target.value));
    }

    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`, {
                method: 'GET',
                timeout: 5000
            });
            const data = await response.json();
            
            if (data.status === 'healthy') {
                console.log('Backend is healthy:', data);
                this.backendAvailable = true;
                this.showNotification('Backend connected successfully! Real video downloading enabled.', 'success');
            }
        } catch (error) {
            console.error('Backend health check failed:', error);
            this.backendAvailable = false;
            this.showNotification('Backend not available. Running in demo mode.', 'warning');
            this.showDemoModeNotice();
        }
    }

    showDemoModeNotice() {
        // Create demo mode notice
        const notice = document.createElement('div');
        notice.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        `;
        notice.innerHTML = `
            <h4><i class="fas fa-info-circle"></i> Demo Mode</h4>
            <p>The video downloader backend is not running. This is a demonstration of the interface.</p>
            <p><strong>To enable real downloads:</strong></p>
            <ol>
                <li>Start the backend server: <code>python video_downloader_server.py</code></li>
                <li>Or use the batch file: <code>start_video_downloader.bat</code></li>
                <li>The server will run on <code>http://localhost:5000</code></li>
            </ol>
        `;
        
        const form = document.querySelector('.downloader-form');
        form.parentNode.insertBefore(notice, form);
    }

    autoDetectPlatform(url) {
        const platformSelect = document.getElementById('platform');
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            platformSelect.value = 'youtube';
        } else if (url.includes('facebook.com') || url.includes('fb.com')) {
            platformSelect.value = 'facebook';
        }
    }

    async getVideoInfo(url) {
        if (!url || url.length < 10) return;

        if (!this.backendAvailable) {
            // Demo mode - show mock video info
            this.displayDemoVideoInfo(url);
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });

            const data = await response.json();

            if (data.success) {
                this.displayVideoInfo(data.video_info);
            } else {
                console.error('Failed to get video info:', data.error);
                this.showNotification('Failed to get video info: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error getting video info:', error);
            this.showNotification('Network error while getting video info', 'error');
        }
    }

    displayDemoVideoInfo(url) {
        // Create mock video info for demo
        const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
        const isFacebook = url.includes('facebook.com') || url.includes('fb.com');
        
        let mockInfo = {
            title: 'Demo Video',
            uploader: 'Demo User',
            thumbnail: 'https://via.placeholder.com/120x90/667eea/ffffff?text=Demo',
            duration: 180
        };

        if (isYouTube) {
            mockInfo.title = 'YouTube Demo Video';
            mockInfo.uploader = 'YouTube Creator';
            mockInfo.thumbnail = 'https://via.placeholder.com/120x90/ff0000/ffffff?text=YouTube';
        } else if (isFacebook) {
            mockInfo.title = 'Facebook Demo Video';
            mockInfo.uploader = 'Facebook User';
            mockInfo.thumbnail = 'https://via.placeholder.com/120x90/1877f2/ffffff?text=Facebook';
        }

        this.displayVideoInfo(mockInfo);
    }

    displayVideoInfo(videoInfo) {
        // Create or update video info display
        let infoDisplay = document.getElementById('video-info-display');
        if (!infoDisplay) {
            infoDisplay = document.createElement('div');
            infoDisplay.id = 'video-info-display';
            infoDisplay.className = 'video-info-display';
            document.querySelector('.downloader-form').insertBefore(
                infoDisplay, 
                document.querySelector('.downloader-form .btn')
            );
        }

        const duration = this.formatDuration(videoInfo.duration);
        const viewCount = videoInfo.view_count ? this.formatNumber(videoInfo.view_count) : 'Unknown';
        const likeCount = videoInfo.like_count ? this.formatNumber(videoInfo.like_count) : 'Unknown';
        
        infoDisplay.innerHTML = `
            <div class="video-preview">
                <img src="${videoInfo.thumbnail}" alt="Video thumbnail" onerror="this.style.display='none'">
                <div class="video-details">
                    <h4>${videoInfo.title}</h4>
                    <p><strong>Uploader:</strong> ${videoInfo.uploader}</p>
                    <p><strong>Duration:</strong> ${duration}</p>
                    <p><strong>Views:</strong> ${viewCount}</p>
                    <p><strong>Likes:</strong> ${likeCount}</p>
                    ${videoInfo.description ? `<p><strong>Description:</strong> ${videoInfo.description}</p>` : ''}
                </div>
            </div>
        `;
    }

    formatDuration(seconds) {
        if (!seconds) return 'Unknown';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const url = document.getElementById('videoUrl').value.trim();
        const platform = document.getElementById('platform').value;
        
        if (!url || !platform) {
            this.showNotification('Please enter a video URL and select a platform.', 'error');
            return;
        }

        // Show loading state
        const btn = e.target.querySelector('.btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        btn.disabled = true;

        if (!this.backendAvailable) {
            // Demo mode - simulate download
            setTimeout(() => {
                this.showNotification('Demo mode: Download simulation completed!', 'success');
                this.simulateDownload();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    url: url, 
                    quality: 'best'
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification('Video downloaded successfully! Starting download...', 'success');
                this.downloadFile(data.filename);
            } else {
                this.showNotification(data.error || 'Download failed', 'error');
            }
        } catch (error) {
            console.error('Download error:', error);
            this.showNotification('Network error. Please try again.', 'error');
        } finally {
            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    simulateDownload() {
        // Create a demo download file
        const blob = new Blob([
            '# Demo Video Download\n',
            '# This is a demonstration file\n',
            '# Created by Video Downloader Demo\n',
            '# \n',
            '# To enable real downloads:\n',
            '# 1. Start the backend server\n',
            '# 2. The server will handle real video downloads\n'
        ], { type: 'text/plain' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'demo_video_download.txt';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    downloadFile(filename) {
        // Create download link
        const link = document.createElement('a');
        link.href = `${this.apiBaseUrl}/download-file/${encodeURIComponent(filename)}`;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoDownloader();
}); 