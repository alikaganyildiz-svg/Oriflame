import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request) {
    // Güvenlik: Sadece Vercel Cron'dan gelen istekleri kabul et (Opsiyonel ama önerilir)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Unauthorized', { status: 401 });
    // }

    try {
        console.log("Cron started: Refreshing blog content...");

        // 1. Cache'i temizle (revalidate)
        revalidatePath('/blog');
        console.log("Cache pruned using revalidatePath('/blog')");

        // 2. Sayfayı 'Warm-up' yap (Ziyaret et ki yeniden oluşsun)
        // Kendi domainimize istek atıyoruz.
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL}` || 'http://localhost:3000';
        const blogUrl = `${baseUrl}/blog`;

        console.log(`Fetching blog page to trigger generation: ${blogUrl}`);
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
