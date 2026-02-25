import { getAllPosts } from '@/services/blog-service';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://oriflamekatalogun.com';

    // Get all posts for dynamic routes
    const posts = await getAllPosts();

    const blogUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    const arsivUrls = posts.map((post) => ({
        url: `${baseUrl}/arsiv/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog/arsiv`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        ...blogUrls,
        ...arsivUrls,
    ];
}
