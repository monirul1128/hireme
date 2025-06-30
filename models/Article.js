const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Article title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    excerpt: {
        type: String,
        required: [true, 'Article excerpt is required'],
        trim: true,
        maxlength: [500, 'Excerpt cannot exceed 500 characters']
    },
    content: {
        type: String,
        required: [true, 'Article content is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Article category is required'],
        enum: {
            values: [
                'ব্র্যান্ডিং',
                'WordPress',
                'ওয়েব ডিজাইন',
                'ডেভেলপমেন্ট',
                'SEO',
                'ল্যান্ডিং পেজ',
                'ডিজাইন',
                'মার্কেটিং',
                'Development',
                'Design',
                'Web Design',
                'Landing Pages'
            ],
            message: 'Please select a valid category'
        }
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        default: 'Monirul Islam'
    },
    date: {
        type: Date,
        default: Date.now
    },
    publishedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80'
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    readTime: {
        type: Number,
        min: [1, 'Read time must be at least 1 minute'],
        max: [120, 'Read time cannot exceed 120 minutes']
    },
    seo: {
        description: {
            type: String,
            maxlength: [160, 'SEO description cannot exceed 160 characters']
        },
        keywords: {
            type: String,
            maxlength: [200, 'SEO keywords cannot exceed 200 characters']
        }
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        approved: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for better query performance
articleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ featured: 1, status: 1 });
articleSchema.index({ slug: 1 });

// Virtual for formatted date
articleSchema.virtual('formattedDate').get(function() {
    return this.date.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Virtual for article URL
articleSchema.virtual('url').get(function() {
    return this.slug ? `${this.slug}.html` : `article-${this._id}.html`;
});

// Pre-save middleware to generate slug if not provided
articleSchema.pre('save', function(next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    
    // Set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    
    next();
});

// Static method to get published articles
articleSchema.statics.getPublished = function() {
    return this.find({ status: 'published' }).sort({ publishedAt: -1 });
};

// Static method to get featured articles
articleSchema.statics.getFeatured = function() {
    return this.find({ status: 'published', featured: true }).sort({ publishedAt: -1 });
};

// Static method to get articles by category
articleSchema.statics.getByCategory = function(category) {
    return this.find({ status: 'published', category }).sort({ publishedAt: -1 });
};

// Instance method to increment views
articleSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

// Instance method to add comment
articleSchema.methods.addComment = function(commentData) {
    this.comments.push(commentData);
    return this.save();
};

module.exports = mongoose.model('Article', articleSchema); 