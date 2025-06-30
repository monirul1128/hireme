# 🚀 WebCraft Studio Backend Setup Guide

This guide will help you set up the Node.js backend with MongoDB to work with your article dashboard.

## 📋 Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - You have two options:
   - **Local MongoDB**: Install MongoDB Community Server
   - **MongoDB Atlas**: Free cloud database (recommended for beginners)

## 🛠️ Step-by-Step Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up MongoDB

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `config.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webcraft_studio
   ```

#### Option B: Local MongoDB
1. Download and install MongoDB Community Server
2. Start MongoDB service
3. Keep the default connection string in `config.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/webcraft_studio
   ```

### Step 3: Seed the Database
```bash
node utils/seeder.js
```

This will create:
- Sample articles with Bengali content
- Admin user with credentials:
  - **Email**: `admin@webcraftstudio.com`
  - **Password**: `admin123456`

### Step 4: Start the Backend Server
```bash
npm run dev
```

Or use the batch file:
```bash
start-backend.bat
```

### Step 5: Test the Backend
```bash
node test-backend.js
```

## 🎯 How to Use the Article Dashboard

### 1. Access the Dashboard
- Go to: `http://localhost:5000/frontend/pages/article-dashboard.html`

### 2. Create and Publish Articles
1. Fill in the article form
2. Click "Publish Article"
3. If not logged in, you'll see a login modal
4. Use the admin credentials:
   - Email: `admin@webcraftstudio.com`
   - Password: `admin123456`
5. The article will be saved to MongoDB and appear on the all-articles page

### 3. View Published Articles
- Go to: `http://localhost:5000/frontend/pages/all-articles.html`
- Articles from the database will be displayed here

## 🔧 API Endpoints

### Public Endpoints (No login required)
- `GET /api/articles` - Get all published articles
- `GET /api/articles/featured` - Get featured articles
- `GET /api/articles/slug/:slug` - Get article by slug
- `GET /api/health` - Health check

### Admin Endpoints (Login required)
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `GET /api/articles/admin/all` - Get all articles (including drafts)

## 🐛 Troubleshooting

### Backend won't start
1. Check if MongoDB is running
2. Verify the connection string in `config.env`
3. Make sure port 5000 is not in use

### Can't connect to database
1. Check your MongoDB connection string
2. For Atlas: Make sure your IP is whitelisted
3. For local: Make sure MongoDB service is running

### Login fails
1. Make sure you ran the seeder: `node utils/seeder.js`
2. Use the correct credentials:
   - Email: `admin@webcraftstudio.com`
   - Password: `admin123456`

### Articles not showing
1. Check if the backend is running on port 5000
2. Verify the API calls in browser console
3. Make sure articles are published (not drafts)

## 📱 Frontend Integration

The frontend has been updated to:
- Load articles from the API instead of localStorage
- Show login modal when publishing articles
- Display articles from the database on all-articles page
- Handle API errors gracefully

## 🔐 Security Features

- JWT authentication for admin access
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection

## 📊 Database Schema

### Articles Collection
- Title, excerpt, content
- Category, author, date
- Status (draft/published)
- Featured flag, tags
- SEO fields, view tracking

### Users Collection
- Name, email, password
- Role (user/admin)
- Authentication tokens

## 🚀 Production Deployment

For production:
1. Set `NODE_ENV=production` in `config.env`
2. Use a strong `JWT_SECRET`
3. Set up MongoDB Atlas or production MongoDB
4. Configure CORS for your domain
5. Set up proper SSL certificates

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Make sure MongoDB is running
4. Check the network tab in browser dev tools

---

**Happy coding! 🎉** 