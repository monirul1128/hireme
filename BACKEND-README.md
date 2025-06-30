# WebCraft Studio Backend API

A Node.js backend with MongoDB database for managing articles and user authentication for the WebCraft Studio website.

## 🚀 Features

- **Article Management**: CRUD operations for blog articles
- **User Authentication**: JWT-based authentication with role-based access
- **MongoDB Integration**: Robust database with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Search & Filtering**: Advanced article search and category filtering
- **Comments System**: Article commenting functionality
- **SEO Support**: Built-in SEO fields for articles

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd demo2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env` and update the values:
   ```bash
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/webcraft_studio
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   ```

4. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update the connection string in `config.env`

5. **Seed Database**
   ```bash
   node utils/seeder.js
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### Setup Admin (First time only)
```http
POST /auth/setup-admin
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@webcraftstudio.com",
  "password": "admin123456"
}
```

### Article Endpoints

#### Get All Published Articles
```http
GET /articles?page=1&limit=10&category=ব্র্যান্ডিং&sort=newest
```

#### Get Featured Articles
```http
GET /articles/featured
```

#### Get Article by Slug
```http
GET /articles/slug/article-slug-name
```

#### Get Article by ID
```http
GET /articles/:id
```

#### Create Article (Admin only)
```http
POST /articles
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Article Title",
  "excerpt": "Article excerpt...",
  "content": "<h2>Article content...</h2>",
  "category": "ব্র্যান্ডিং",
  "tags": ["tag1", "tag2"],
  "featured": false,
  "status": "draft"
}
```

#### Update Article (Admin only)
```http
PUT /articles/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "published"
}
```

#### Delete Article (Admin only)
```http
DELETE /articles/:id
Authorization: Bearer <admin-token>
```

#### Add Comment
```http
POST /articles/:id/comments
Content-Type: application/json

{
  "name": "Commenter Name",
  "email": "commenter@example.com",
  "comment": "Great article!"
}
```

#### Get Categories
```http
GET /articles/categories/list
```

#### Get All Articles (Admin - includes drafts)
```http
GET /articles/admin/all?status=draft&page=1&limit=20
Authorization: Bearer <admin-token>
```

### Health Check
```http
GET /health
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **user**: Regular user (can read articles, add comments)
- **admin**: Administrator (full CRUD access to articles)

## 📊 Database Schema

### Article Schema
```javascript
{
  title: String (required),
  excerpt: String (required),
  content: String (required),
  category: String (enum),
  author: String (default: "Monirul Islam"),
  date: Date (default: now),
  publishedAt: Date,
  status: String (enum: "draft", "published"),
  featured: Boolean (default: false),
  image: String,
  slug: String (unique),
  tags: [String],
  readTime: Number,
  seo: {
    description: String,
    keywords: String
  },
  views: Number (default: 0),
  likes: Number (default: 0),
  comments: [CommentSchema]
}
```

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: "user", "admin"),
  avatar: {
    public_id: String,
    url: String
  },
  isActive: Boolean (default: true),
  lastLogin: Date
}
```

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Mongoose validation
- **Password Hashing**: bcryptjs
- **JWT**: Secure token-based authentication

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/webcraft_studio` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration | `30d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 📝 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (not implemented yet)
```

## 🗄️ Database Seeding

The seeder creates:
- Sample articles with Bengali content
- Admin user for initial access

**Admin Credentials:**
- Email: `admin@webcraftstudio.com`
- Password: `admin123456`

Run seeder:
```bash
node utils/seeder.js
```

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 1,
  "total": 10,
  "totalPages": 1,
  "currentPage": 1
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## 🌐 CORS Configuration

The API is configured to accept requests from:
- **Development**: `http://localhost:3000`, `http://127.0.0.1:5500`
- **Production**: `https://topdigitalservice.shop`, `https://www.topdigitalservice.shop`

## 📱 Frontend Integration

The backend serves the frontend static files and handles all API routes. The frontend can be accessed at:
- **Development**: `http://localhost:5000`
- **API**: `http://localhost:5000/api`

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Setup for Production
1. Set `NODE_ENV=production`
2. Update `MONGODB_URI` for production database
3. Set a strong `JWT_SECRET`
4. Configure CORS origins for production domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email: monirul4213@gmail.com

---

**Note**: This backend is designed to work with the WebCraft Studio frontend. Make sure to update the frontend JavaScript files to use the API endpoints instead of localStorage. 