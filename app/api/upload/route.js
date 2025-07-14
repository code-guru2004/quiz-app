// app/api/upload/route.ts
import cloudinary from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }).end(buffer);
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}