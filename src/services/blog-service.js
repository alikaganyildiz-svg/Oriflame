
import { createClient } from 'redis';

// Initialize Redis client
const client = createClient({
    url: process.env.KV_URL || process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Ensure client connects
const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
    }
};

const REDIS_KEY = 'blog_posts';

// Helper to read posts from Redis
const getPosts = async () => {
    try {
        await connectRedis();
        const data = await client.get(REDIS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading blog posts from Redis:", error);
        return [];
    }
};

// Helper to save posts to Redis
const savePosts = async (posts) => {
    try {
        await connectRedis();
        await client.set(REDIS_KEY, JSON.stringify(posts));
    } catch (error) {
        console.error("Error saving blog posts to Redis:", error);
    }
};

// Generate a slug from title
const createSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
};

import { generateDailyBlogContent } from './ai.js';

export async function getLatestPost() {
    const posts = await getPosts();

    // Just return the first post if it exists
    if (posts.length > 0) {
        return posts[0];
    }

    // Return null if no posts (Frontend handles this gracefully or we can trigger init)
    // For now, let's trigger one if completely empty so the site isn't broken on first deploy
    console.log("No posts found in Redis. Generating initial post...");
    const initialPost = await generateAndSaveNewPost();
    return initialPost;
}

export async function generateAndSaveNewPost(forceTestMode = false) {
    console.log("Generating new daily blog post via Cron/Manual trigger...");
    const newPostData = await generateDailyBlogContent();

    if (newPostData.error) {
        console.error("Failed to generate post:", newPostData.error);
        return newPostData;
    }

    const posts = await getPosts();
    const today = new Date().toISOString().split('T')[0];

    // Check if we already have a post for today to prevent duplicates (UNLESS IN TEST MODE)
    if (!forceTestMode) {
        const existingToday = posts.find(post => post.date === today);
        if (existingToday) {
            console.log("Post for today already exists. Skipping save.");
            return existingToday;
        }
    }

    const newPost = {
        ...newPostData,
        id: Date.now().toString(),
        date: today,
        // If testing, append timestamp to title to make it unique in UI logs if needed
        slug: createSlug(newPostData.title) + (forceTestMode ? `-${Date.now()}` : ''),
        timestamp: new Date().toISOString()
    };

    // Add to beginning of array
    posts.unshift(newPost);
    await savePosts(posts);

    return newPost;
}

export async function getAllPosts() {
    return await getPosts();
}

export async function getPostBySlug(slug) {
    const posts = await getPosts();
    return posts.find(post => post.slug === slug);
}
