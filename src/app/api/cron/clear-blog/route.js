import { NextResponse } from 'next/server';
import { clearAllPosts } from '@/services/blog-service';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await clearAllPosts();
        return NextResponse.json({ message: 'Blog archives cleared successfully.' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
