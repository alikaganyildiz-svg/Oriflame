import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { generateAndSaveNewPost } from '@/services/blog-service';

export async function GET(request) {
    // Güvenlik: Sadece Vercel Cron'dan gelen istekleri kabul et (Opsiyonel ama önerilir)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Unauthorized', { status: 401 });
    // }

    try {
        console.log("Cron started: Refreshing blog content...");

        // 1. Yeni içerik oluştur ve kaydet
        console.log("Generating new blog post...");
        const newPost = await generateAndSaveNewPost();

        if (newPost.error) {
            console.error("Failed to generate post:", newPost.error);
            return NextResponse.json({ error: newPost.error }, { status: 500 });
        }

        // 2. Cache'i temizle (revalidate) - Sayfanın yeni içeriği göstermesi için
        revalidatePath('/blog');
        console.log("Cache pruned using revalidatePath('/blog') after new post generation.");

        // 3. Sayfayı 'Warm-up' yap (Opsiyonel ama iyi olur)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}` || 'http://localhost:3000';
        const blogUrl = `${baseUrl}/blog`;

        console.log(`Fetching blog page to warm cache: ${blogUrl}`);
        const res = await fetch(blogUrl);

        if (res.ok) {
            console.log("Blog page successfully regenerated.");
            return NextResponse.json({ message: 'Blog updated successfully', timestamp: new Date().toISOString() });
        } else {
            console.error(`Failed to fetch blog page: ${res.status}`);
            return NextResponse.json({ error: 'Failed to fetch blog page' }, { status: 500 });
        }

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
