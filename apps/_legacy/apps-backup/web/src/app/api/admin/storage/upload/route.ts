import { Buffer } from 'node:buffer';

import { NextRequest, NextResponse } from 'next/server';

import { createSupabaseAdmin } from '@/supabase/admin';
import { createSupabaseServer } from '@/supabase/server';

const BUCKET_ENV_KEY = 'NEXT_PUBLIC_SUPABASE_STORAGE_PRODUCER_BUCKET';
const FALLBACK_BUCKET = 'producer-images';

const getBucketName = () => process.env[BUCKET_ENV_KEY] || FALLBACK_BUCKET;

const isAdminEmail = (email: string | null | undefined) => {
  if (!email) return false;
  const allow = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
    .split(',')
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);

  if (!allow.length) return true; // No allowlist defined -> allow any authenticated user

  return allow.includes(email.toLowerCase());
};

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const serverClient = await createSupabaseServer();
    const {
      data: { user },
    } = await serverClient.auth.getUser();

    if (!user || !isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const partnerId = formData.get('partnerId');
    const fileName = formData.get('fileName');
    const contentType = formData.get('contentType');
    const variant = formData.get('variant') ?? 'generic';

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'Invalid file payload' }, { status: 400 });
    }

    if (typeof partnerId !== 'string' || !partnerId) {
      return NextResponse.json({ error: 'Missing partnerId' }, { status: 400 });
    }

    const originalName = typeof fileName === 'string' && fileName.length ? fileName : 'upload';
    const sanitizedName = originalName.replace(/[^\w\.\-]+/g, '_');
    const bucketName = getBucketName();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const adminClient = createSupabaseAdmin();

    // Ensure bucket exists (create if necessary)
    const { data: existingBucket, error: getBucketError } = await adminClient.storage.getBucket(bucketName);
    if (getBucketError && getBucketError.message?.includes('not found')) {
      const { error: bucketCreateError } = await adminClient.storage.createBucket(bucketName, {
        public: true,
      });
      if (bucketCreateError) {
        return NextResponse.json(
          {
            error: 'Failed to create storage bucket',
            details: bucketCreateError.message,
          },
          { status: 500 }
        );
      }
    } else if (!existingBucket && getBucketError) {
      return NextResponse.json(
        {
          error: 'Failed to verify storage bucket',
          details: getBucketError.message,
        },
        { status: 500 }
      );
    }

    const timestamp = Date.now();
    const path = `${partnerId}/${variant}/${timestamp}-${sanitizedName}`;

    const { error: uploadError } = await adminClient.storage
      .from(bucketName)
      .upload(path, buffer, {
        contentType: typeof contentType === 'string' && contentType.length ? contentType : undefined,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error: 'Failed to upload file',
          details: uploadError.message,
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from(bucketName).getPublicUrl(path);

    return NextResponse.json({ publicUrl, path, bucket: bucketName });
  } catch (error) {
    console.error('[storage/upload] Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
