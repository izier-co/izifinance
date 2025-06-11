import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@supabase-config'; 

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign Up error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: 'Sign Up successful! Please check your email for confirmation.',
    user: data.user,
    accessToken: data.session?.access_token, 
    refreshToken: data.session?.refresh_token,
  });
}