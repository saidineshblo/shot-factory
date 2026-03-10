// Utility to auto-upload local files and data-URIs in prediction inputs.
// Detects local file paths and data:mime;base64,... strings, uploads to Replicate (up to 100MB).

import * as fs from 'fs';
import * as pathMod from 'path';
import Replicate from 'replicate-stainless';
import { toFile } from 'replicate-stainless/uploads';

const DATA_URI_RE = /^data:([^;,]+);base64,(.+)$/s;

const EXT_TO_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
};

const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
  'audio/wav': 'wav',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'application/pdf': 'pdf',
  'application/zip': 'zip',
  'application/octet-stream': 'bin',
};

function mimeToExt(mime: string): string {
  return MIME_TO_EXT[mime] || mime.split('/')[1] || 'bin';
}

function isLocalFilePath(str: string): boolean {
  if (/^[A-Za-z]:[\\/]/.test(str) || str.startsWith('/')) {
    try { return fs.existsSync(str); } catch { return false; }
  }
  return false;
}

async function uploadLocalFile(replicate: Replicate, filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const filename = pathMod.basename(filePath);
  const ext = pathMod.extname(filePath).toLowerCase();
  const mimeType = EXT_TO_MIME[ext] || 'application/octet-stream';
  const fileObj = await toFile(buffer, filename, { type: mimeType });
  const result = await replicate.files.create({ content: fileObj });
  return result.urls.get!;
}

/**
 * Recursively walk a prediction input object.
 * - Local file paths are read from disk, uploaded, and replaced with hosted URLs.
 * - data:mime;base64,... strings are decoded, uploaded, and replaced with hosted URLs.
 * - Everything else passes through unchanged.
 * Supports up to 100 MB per file (Replicate SDK limit).
 */
export async function processFileInputs(replicate: Replicate, input: unknown): Promise<unknown> {
  if (input === null || input === undefined) return input;

  if (Array.isArray(input)) {
    return Promise.all(input.map((item) => processFileInputs(replicate, item)));
  }

  if (typeof input === 'object') {
    const processed: Record<string, unknown> = {};
    const entries = Object.entries(input as Record<string, unknown>);
    for (const [key, value] of entries) {
      processed[key] = await processFileInputs(replicate, value);
    }
    return processed;
  }

  if (typeof input === 'string') {
    // Local file path
    if (isLocalFilePath(input)) {
      return uploadLocalFile(replicate, input);
    }
    // Data URI
    const match = input.match(DATA_URI_RE);
    if (match) {
      const mimeType = match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const ext = mimeToExt(mimeType);
      const filename = `upload.${ext}`;
      const fileObj = await toFile(buffer, filename, { type: mimeType });
      const result = await replicate.files.create({ content: fileObj });
      return result.urls.get;
    }
  }

  return input;
}
