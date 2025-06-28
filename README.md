# 🌐 WebCraft Studio - Professional Web Design & Development

A comprehensive web design and development portfolio with real-time chat functionality, built with modern web technologies.

## 🚀 Features

### Core Features
- **Professional Portfolio Website** - Showcase web design and development work
- **Real-time Chat System** - Live chat with fallback demo mode
- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Beautiful, professional interface
- **SEO Optimized** - Built for search engine visibility

### Chat System
- **Real-time Communication** - Socket.IO powered chat
- **Fallback Demo Mode** - Works without server setup
- **Global Access** - Accessible from any device on network
- **Production Ready** - Windows-compatible WSGI server

### Tools & Demos
- **Landing Page Builder** - Drag-and-drop page creator
- **Video Downloader** - YouTube/Facebook video downloader
- **E-commerce Demo** - Shopping cart functionality
- **WordPress Demo** - CMS showcase
- **Admin Panel** - Content management system

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript** - Interactive functionality
- **Socket.IO** - Real-time communication
- **Font Awesome** - Icons

### Backend (Optional)
- **Python Flask** - Web framework
- **Waitress** - Windows WSGI server
- **Socket.IO** - Real-time chat server
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Quick Start (No Server Required)
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webcraft-studio.git
   cd webcraft-studio
   ```

2. **Open the website**
   - Open `index.html` in your browser
   - Chat will work in demo mode automatically

### With Chat Server (Optional)
1. **Install Python dependencies**
   ```bash
   py -m pip install -r requirements_production.txt
   ```

2. **Start the production server**
   ```bash
   py production_server_windows.py
   ```

3. **Access globally**
   - Local: `http://localhost:4000`
   - Network: `http://[your-ip]:4000`

## 🌍 Global Access

Your chat server is accessible from any device on your network:

- **Local Access**: `http://localhost:4000`
- **Network Access**: `http://192.168.1.125:4000` (your IP)
- **Mobile/Tablet**: Use the network IP from any device

## 📁 Project Structure

```
webcraft-studio/
├── index.html                 # Main portfolio website
├── frontend/                  # Frontend assets
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript files
│   └── pages/                 # Demo pages
├── backend/                   # Backend API (if needed)
├── realtime-chat-server/      # Node.js chat server
├── production_server_windows.py # Windows production server
├── requirements_production.txt # Python dependencies
└── README.md                  # This file
```

## 🚀 Deployment Options

### 1. Static Hosting (Recommended)
- **GitHub Pages** - Free hosting
- **Netlify** - Easy deployment
- **Vercel** - Fast performance
- **Firebase Hosting** - Google's platform

### 2. Full Stack Deployment
- **Heroku** - Python/Node.js support
- **Railway** - Modern platform
- **DigitalOcean** - VPS hosting
- **AWS** - Enterprise solution

## 🎯 Usage

### Portfolio Website
1. Open `index.html` in browser
2. Navigate through sections: Home, About, Services, Portfolio, Blog, Contact
3. Click "Chat" button for live chat (demo mode)

### Chat System
- **Demo Mode**: Works immediately without server
- **Production Mode**: Start server for real-time chat
- **Global Access**: Available from any device on network

### Admin Panel
- Access: `frontend/pages/admin-panel.html`
- Manage content and settings

## 🔧 Configuration

### Environment Variables
```bash
FLASK_ENV=production
PORT=4000
SECRET_KEY=your-secret-key
```

### Chat Server Settings
- **Port**: 4000 (configurable)
- **Workers**: 8 threads
- **CORS**: Enabled for all origins
- **Logging**: Production level

## 📊 Performance

- **Lightning Fast** - Optimized for speed
- **Mobile First** - Responsive design
- **SEO Ready** - Search engine optimized
- **Accessible** - WCAG compliant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Monirul Islam**
- Email: monirul4213@gmail.com
- LinkedIn: [Monirul Islam](https://www.linkedin.com/in/monirul4213)
- Portfolio: [WebCraft Studio](https://topdigitalservice.shop)

## 🙏 Acknowledgments

- Font Awesome for icons
- Unsplash for images
- Socket.IO for real-time communication
- Flask community for web framework

## 📞 Support

- **Email**: monirul4213@gmail.com
- **Phone**: 01957625659
- **Location**: Mirpur 1, Dhaka, Bangladesh

---

⭐ **Star this repository if you find it helpful!**