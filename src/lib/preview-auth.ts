/** HttpOnly cookie that lets the Presentation iframe skip Basic Auth. */
export const PREVIEW_ACCESS_COOKIE = 'hiweb_preview';

const TTL_SECONDS = 60 * 60 * 12;

export const PREVIEW_ACCESS_MAX_AGE = TTL_SECONDS;

function bytesToHex(bytes: ArrayBuffer) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string) {
  if (!hex || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    const byte = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
    if (Number.isNaN(byte)) return null;
    bytes[index] = byte;
  }
  return bytes;
}

function hmacKey(password: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function message(exp: number) {
  return new TextEncoder().encode(`hiweb-preview.${exp}`);
}

export async function signPreviewAccess(password: string, now = Date.now()) {
  const exp = Math.floor(now / 1000) + TTL_SECONDS;
  const signature = bytesToHex(await crypto.subtle.sign('HMAC', await hmacKey(password), message(exp)));
  return `${exp}.${signature}`;
}

export async function verifyPreviewAccess(password: string, value: string | undefined, now = Date.now()) {
  if (!value) return false;
  const dot = value.indexOf('.');
  if (dot < 1) return false;
  const exp = Number(value.slice(0, dot));
  const signature = hexToBytes(value.slice(dot + 1));
  if (!Number.isFinite(exp) || exp * 1000 < now || !signature) return false;
  return crypto.subtle.verify('HMAC', await hmacKey(password), signature, message(exp));
}
