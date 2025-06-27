// Video Downloader Frontend JavaScript
class VideoDownloader {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
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
            const response = await fetch(`${this.apiBaseUrl}/health`);
            const data = await response.json();
            
            if (data.status === 'healthy') {
                console.log('Backend is healthy:', data);
                this.showNotification('Backend connected successfully', 'success');
            }
        } catch (error) {
            console.error('Backend health check failed:', error);
            this.showNotification('Backend not available. Please start the server.', 'error');
        }
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
            }
        } catch (error) {
            console.error('Error getting video info:', error);
        }
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
        
        infoDisplay.innerHTML = `
            <div class="video-preview">
                <img src="${videoInfo.thumbnail}" alt="Video thumbnail" onerror="this.style.display='none'">
                <div class="video-details">
                    <h4>${videoInfo.title}</h4>
                    <p><strong>Uploader:</strong> ${videoInfo.uploader}</p>
                    <p><strong>Duration:</strong> ${duration}</p>
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

        try {
            const response = await fetch(`${this.apiBaseUrl}/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    url: url, 
                    platform: platform 
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showNotification('Video downloaded successfully!', 'success');
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