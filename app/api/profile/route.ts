import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const s = supabaseServer();
  const { data: existing } = await s.from('profiles')
    .select('*').eq('user_id', userId).maybeSingle();

  if (existing) {
    const { salt, ...safe } = existing;
    return NextResponse.json({ profile: safe });
  }

  const salt = randomBytes(16).toString('base64');
  const { data, error } = await s.from('profiles').insert({
    user_id: userId, display_name: null, birthdate: null, bio: null, photo_url: null, salt,
  }).select('*').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { salt: _, ...safe } = data;
  return NextResponse.json({ profile: safe });
}

export async function PUT(req: NextRequest) {
  const { userId, display_name, birthdate, bio } = await req.json();
  const s = supabaseServer();
  const { data, error } = await s.from('profiles').update({
    display_name, birthdate, bio,
  }).eq('user_id', userId).select('*').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { salt, ...safe } = data;
  return NextResponse.json({ profile: safe });
}