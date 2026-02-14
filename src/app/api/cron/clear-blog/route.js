import { NextResponse } from 'next/server';
import { clearAllPosts } from '@/services/blog-service';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await clearAllPosts();

        // Purge Next.js cache
        revalidatePath('/blog');
        revalidatePath('/blog/arsiv');
        console.log("Cache cleared for /blog and /blog/arsiv");

        return NextResponse.json({ message: 'Blog archives cleared successfully & Cache purged.' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
