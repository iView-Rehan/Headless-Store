import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 4 * 1024 * 1024;
const EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};
const MEDIA_API = 'https://www.wixapis.com/site-media/v1/files';

const fail = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });

function matchesType(bytes: Uint8Array, type: string) {
  if (type === 'image/png') {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e;
  }
  if (type === 'image/jpeg') {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45
  );
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.WIX_API_KEY;
  const siteId = process.env.WIX_SITE_ID;
  if (!apiKey || !siteId) {
    return fail('Design uploads are not configured on the server.', 500);
  }

  const form = await request.formData();
  const file = form.get('file');
  const kind = form.get('kind') === 'preview' ? 'preview' : 'art';
  if (!(file instanceof File)) return fail('No file received.');

  const ext = EXT[file.type];
  if (!ext) return fail('Only PNG, JPG and WebP images are allowed.');
  if (file.size > MAX_BYTES) return fail('That file is too large.');

  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!matchesType(bytes, file.type)) {
    return fail('The file content does not match its type.');
  }

  const fileName = `design-${kind}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;
  const headers = { Authorization: apiKey, 'wix-site-id': siteId };

  const gen = await fetch(`${MEDIA_API}/generate-upload-url`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mimeType: file.type, fileName }),
  });
  if (!gen.ok) {
    console.error(
      'Wix generate-upload-url failed',
      gen.status,
      await gen.text()
    );
    return fail('Could not start the upload.', 502);
  }
  const { uploadUrl } = await gen.json();

  const target = new URL(uploadUrl);
  target.searchParams.set('filename', fileName);
  const put = await fetch(target.toString(), {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: bytes,
  });
  if (!put.ok) {
    console.error('Wix upload failed', put.status, await put.text());
    return fail('Could not upload the file.', 502);
  }

  const data = await put.json().catch(() => null);
  const uploaded = data?.file ?? data?.files?.[0] ?? data;
  const url: string | undefined =
    uploaded?.url ??
    (uploaded?.id
      ? `https://static.wixstatic.com/media/${uploaded.id}`
      : undefined);
  if (!url) {
    console.error('Unexpected Wix upload response', JSON.stringify(data));
    return fail('Upload finished but no file URL was returned.', 502);
  }

  if (uploaded?.id) {
    for (let i = 0; i < 6; i++) {
      try {
        const res = await fetch(`${MEDIA_API}/${uploaded.id}`, { headers });
        const status = (await res.json())?.file?.operationStatus;
        if (status === 'READY' || status === 'FAILED') break;
      } catch (e) {
        break;
      }
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  return NextResponse.json({ url });
}
