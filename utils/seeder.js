const mongoose = require('mongoose');
const Article = require('../models/Article');
const User = require('../models/User');
require('dotenv').config({ path: './config.env' });

// Sample articles data
const sampleArticles = [
    {
        title: "🌐 নিজের ওয়েবসাইট ব্র্যান্ড করুন: সফল অনলাইন উপস্থিতির শক্তিশালী কৌশল",
        excerpt: "বর্তমানে আপনি যদি ই-কমার্স করেন, সেবা ভিত্তিক ব্যবসা চালান, পোর্টফোলিও তৈরি করেন বা কনটেন্ট ক্রিয়েটর হন — নিজের একটি ওয়েবসাইট থাকা প্রয়োজন। তবু একটি ওয়েবসাইট বানানোই যথেষ্ট নয়, সেটিকে একটি শক্তিশালী ব্র্যান্ডে পরিণত করাই মূল লক্ষ্য হওয়া উচিত।",
        content: `
        <h2>ওয়েবসাইট ব্র্যান্ডিং কেন গুরুত্বপূর্ণ?</h2>
        <p>বর্তমানে আপনি যদি ই-কমার্স করেন, সেবা ভিত্তিক ব্যবসা চালান, পোর্টফোলিও তৈরি করেন বা কনটেন্ট ক্রিয়েটর হন — নিজের একটি ওয়েবসাইট থাকা প্রয়োজন। তবু একটি ওয়েবসাইট বানানোই যথেষ্ট নয়, সেটিকে একটি শক্তিশালী ব্র্যান্ডে পরিণত করাই মূল লক্ষ্য হওয়া উচিত। একটি ব্র্যান্ডেড ওয়েবসাইটই পারে আপনাকে প্রতিযোগিতামূলক অনলাইন দুনিয়ায় টিকে থাকতে এবং উন্নতি করতে।</p>

        <h2>ব্র্যান্ডিং এর মূল উপাদানসমূহ</h2>
        <h3>১. লোগো ও ভিজ্যুয়াল আইডেন্টিটি</h3>
        <p>আপনার ব্র্যান্ডের প্রথম পরিচয় হল লোগো। এটি এমন হওয়া উচিত যা সহজেই মনে রাখা যায় এবং আপনার ব্যবসার প্রকৃতি প্রতিফলিত করে। লোগোর সাথে সাথে রঙের প্যালেট, টাইপোগ্রাফি, এবং অন্যান্য ভিজ্যুয়াল উপাদানও গুরুত্বপূর্ণ।</p>

        <h3>২. ব্র্যান্ড ভয়েস ও টোন</h3>
        <p>আপনার ওয়েবসাইটের কনটেন্ট কীভাবে লেখা হয়েছে তা আপনার ব্র্যান্ডের ব্যক্তিত্ব নির্ধারণ করে। আপনি কি আনুষ্ঠানিক, বন্ধুত্বপূর্ণ, নাকি পেশাদার টোন ব্যবহার করবেন? এই সিদ্ধান্ত আপনার টার্গেট অডিয়েন্সের উপর নির্ভর করে।</p>

        <h3>৩. ইউজার এক্সপেরিয়েন্স (UX)</h3>
        <p>ওয়েবসাইটের নেভিগেশন, লোডিং স্পিড, এবং মোবাইল রেসপনসিভনেস সবই আপনার ব্র্যান্ডের মান নির্ধারণ করে। একটি ভালো ইউজার এক্সপেরিয়েন্স আপনার ব্র্যান্ডের প্রতি বিশ্বাস তৈরি করে।</p>

        <h2>ওয়েবসাইট ব্র্যান্ডিং এর কৌশল</h2>
        <h3>১. কনসিস্টেন্ট ডিজাইন</h3>
        <p>সব পেজে একই রকমের ডিজাইন, রঙ, এবং ফন্ট ব্যবহার করুন। এটি আপনার ব্র্যান্ডের পরিচয়কে শক্তিশালী করে।</p>

        <h3>২. স্টোরিটেলিং</h3>
        <p>আপনার ব্র্যান্ডের গল্প বলুন। কেন আপনি এই ব্যবসা শুরু করলেন, আপনার লক্ষ্য কী, এবং আপনি কীভাবে গ্রাহকদের সাহায্য করতে পারেন।</p>

        <h3>৩. সোশ্যাল প্রুফ</h3>
        <p>গ্রাহকদের রিভিউ, টেস্টিমোনিয়াল, এবং সোশ্যাল মিডিয়া প্রেজেন্স আপনার ব্র্যান্ডের বিশ্বাসযোগ্যতা বাড়ায়।</p>

        <h2>ব্র্যান্ডিং এর সুবিধা</h2>
        <ul>
            <li><strong>বিশ্বাসযোগ্যতা:</strong> একটি ভালো ব্র্যান্ডেড ওয়েবসাইট গ্রাহকদের বিশ্বাস অর্জন করে</li>
            <li><strong>মেমোরেবিলিটি:</strong> মানুষ সহজেই আপনার ব্র্যান্ড মনে রাখতে পারে</li>
            <li><strong>প্রতিযোগিতামূলক সুবিধা:</strong> অন্যান্য ব্যবসার থেকে আলাদা হওয়া যায়</li>
            <li><strong>লয়্যাল কাস্টমার:</strong> ব্র্যান্ড লয়্যালিটি তৈরি হয়</li>
        </ul>

        <h2>উপসংহার</h2>
        <p>ওয়েবসাইট ব্র্যান্ডিং শুধু একটি সুন্দর লোগো বা রঙের প্যালেট নয়। এটি আপনার ব্যবসার সম্পূর্ণ পরিচয় এবং অভিজ্ঞতা। সঠিক ব্র্যান্ডিং কৌশল ব্যবহার করে আপনি একটি শক্তিশালী অনলাইন উপস্থিতি তৈরি করতে পারেন যা আপনার ব্যবসার বৃদ্ধিতে সাহায্য করবে।</p>
        `,
        category: "ব্র্যান্ডিং",
        author: "Monirul Islam",
        status: "published",
        featured: true,
        image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
        tags: ["ব্র্যান্ডিং", "ওয়েবসাইট", "মার্কেটিং"],
        readTime: 8,
        seo: {
            description: "ওয়েবসাইট ব্র্যান্ডিং এর গুরুত্ব ও কৌশল নিয়ে বিস্তারিত আলোচনা। সফল অনলাইন উপস্থিতির জন্য ব্র্যান্ডিং এর প্রয়োজনীয়তা।",
            keywords: "ওয়েবসাইট ব্র্যান্ডিং, অনলাইন মার্কেটিং, ব্র্যান্ডিং কৌশল, বাংলা"
        }
    },
    {
        title: "ওয়েব ডেভেলপমেন্টে HTML5 এর গুরুত্ব",
        excerpt: "ওয়েব ডেভেলপমেন্টে HTML5 কেন গুরুত্বপূর্ণ এবং কিভাবে এটি আপনার ওয়েবসাইটকে আধুনিক করে তোলে জানুন।",
        content: `
        <h2>HTML5 কি?</h2>
        <p>HTML5 ওয়েব ডেভেলপমেন্টের জন্য একটি মৌলিক প্রযুক্তি। এটি ওয়েবপেজের স্ট্রাকচার নির্ধারণ করে এবং আধুনিক ব্রাউজার ফিচার সাপোর্ট করে। HTML5 এর মাধ্যমে ভিডিও, অডিও, ক্যানভাস, এবং আরও অনেক কিছু সহজেই ইমপ্লিমেন্ট করা যায়।</p>

        <h2>HTML5 এর নতুন ফিচার</h2>
        <h3>১. সেমান্টিক এলিমেন্ট</h3>
        <p>HTML5 এ নতুন সেমান্টিক ট্যাগ যেমন &lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, &lt;section&gt;, &lt;article&gt;, &lt;aside&gt;, এবং &lt;footer&gt; যোগ হয়েছে। এই ট্যাগগুলি ওয়েবপেজের স্ট্রাকচার আরও স্পষ্ট করে।</p>

        <h3>২. মাল্টিমিডিয়া সাপোর্ট</h3>
        <p>HTML5 এ &lt;video&gt; এবং &lt;audio&gt; ট্যাগ যোগ হয়েছে। এখন তৃতীয় পক্ষের প্লাগইন ছাড়াই ভিডিও এবং অডিও প্লে করা যায়।</p>

        <h3>৩. ক্যানভাস API</h3>
        <p>ক্যানভাস API এর মাধ্যমে জাভাস্ক্রিপ্ট দিয়ে গ্রাফিক্স এবং অ্যানিমেশন তৈরি করা যায়।</p>

        <h2>HTML5 এর সুবিধা</h2>
        <ul>
            <li><strong>SEO ফ্রেন্ডলি:</strong> সেমান্টিক ট্যাগ সার্চ ইঞ্জিন অপটিমাইজেশনে সাহায্য করে</li>
            <li><strong>অ্যাক্সেসিবিলিটি:</strong> স্ক্রিন রিডার এবং অন্যান্য অ্যাসিস্টিভ টেকনোলজির জন্য ভালো</li>
            <li><strong>পারফরম্যান্স:</strong> দ্রুত লোডিং এবং কম ব্যান্ডউইথ ব্যবহার</li>
            <li><strong>ক্রস-ব্রাউজার সাপোর্ট:</strong> সব আধুনিক ব্রাউজারে সাপোর্ট</li>
        </ul>
        `,
        category: "Development",
        author: "Monirul Islam",
        status: "published",
        featured: false,
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
        tags: ["HTML5", "ওয়েব ডেভেলপমেন্ট", "টেক"],
        readTime: 5,
        seo: {
            description: "ওয়েব ডেভেলপমেন্টে HTML5 এর গুরুত্ব ও ব্যবহার নিয়ে বিস্তারিত আলোচনা।",
            keywords: "HTML5, ওয়েব ডেভেলপমেন্ট, বাংলা টেক আর্টিকেল"
        }
    },
    {
        title: "CSS Grid ও Flexbox: আধুনিক লেআউট ডিজাইন",
        excerpt: "CSS Grid ও Flexbox দিয়ে কিভাবে দ্রুত ও রেসপনসিভ ওয়েব লেআউট তৈরি করবেন জানুন।",
        content: `
        <h2>CSS Grid vs Flexbox</h2>
        <p>CSS Grid ও Flexbox ওয়েব ডিজাইনে বিপ্লব এনেছে। Flexbox ছোট স্কেল লেআউটের জন্য এবং Grid বড় স্কেল লেআউটের জন্য আদর্শ। এদের মাধ্যমে কম কোডে সুন্দর ও রেসপনসিভ ডিজাইন সম্ভব।</p>

        <h2>Flexbox এর ব্যবহার</h2>
        <p>Flexbox এক-মাত্রিক লেআউটের জন্য ব্যবহার করা হয়। এটি রো বা কলাম ভিত্তিক লেআউট তৈরি করতে সাহায্য করে।</p>

        <h2>CSS Grid এর ব্যবহার</h2>
        <p>CSS Grid দুই-মাত্রিক লেআউটের জন্য ব্যবহার করা হয়। এটি রো এবং কলাম উভয়ই নিয়ন্ত্রণ করতে পারে।</p>

        <h2>রেসপনসিভ ডিজাইন</h2>
        <p>দুটি প্রযুক্তি একসাথে ব্যবহার করে শক্তিশালী রেসপনসিভ লেআউট তৈরি করা যায়।</p>
        `,
        category: "Design",
        author: "Monirul Islam",
        status: "published",
        featured: false,
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        tags: ["CSS", "Grid", "Flexbox", "ওয়েব ডিজাইন"],
        readTime: 6,
        seo: {
            description: "CSS Grid ও Flexbox দিয়ে ওয়েব লেআউট ডিজাইনের সহজ উপায়।",
            keywords: "CSS Grid, Flexbox, ওয়েব ডিজাইন, বাংলা"
        }
    }
];

// Admin user data
const adminUser = {
    name: "Monirul Islam",
    email: "admin@webcraftstudio.com",
    password: "admin123456",
    role: "admin"
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected for seeding');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Clear existing data
const clearData = async () => {
    try {
        await Article.deleteMany();
        await User.deleteMany({ role: 'admin' });
        console.log('🗑️ Existing data cleared');
    } catch (error) {
        console.error('❌ Error clearing data:', error);
    }
};

// Seed articles
const seedArticles = async () => {
    try {
        await Article.insertMany(sampleArticles);
        console.log(`✅ ${sampleArticles.length} articles seeded`);
    } catch (error) {
        console.error('❌ Error seeding articles:', error);
    }
};

// Seed admin user
const seedAdmin = async () => {
    try {
        await User.create(adminUser);
        console.log('✅ Admin user seeded');
        console.log('📧 Email: admin@webcraftstudio.com');
        console.log('🔑 Password: admin123456');
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
    }
};

// Main seeding function
const seedData = async () => {
    await connectDB();
    await clearData();
    await seedArticles();
    await seedAdmin();
    
    console.log('🎉 Database seeding completed!');
    process.exit(0);
};

// Run seeder
if (require.main === module) {
    seedData();
}

module.exports = { seedData }; 