/* eslint-disable no-bitwise */
// sha256.ts
export function sha256(
  text: string,
  encoding: 'hex' | 'base64' = 'base64'
): string {
  const ROTR = (n: number, x: number) => (x >>> n) | (x << (32 - n));
  const Ch = (x: number, y: number, z: number) => (x & y) ^ (~x & z);
  const Maj = (x: number, y: number, z: number) => (x & y) ^ (x & z) ^ (y & z);
  const Σ0 = (x: number) => ROTR(2, x) ^ ROTR(13, x) ^ ROTR(22, x);
  const Σ1 = (x: number) => ROTR(6, x) ^ ROTR(11, x) ^ ROTR(25, x);
  const σ0 = (x: number) => ROTR(7, x) ^ ROTR(18, x) ^ (x >>> 3);
  const σ1 = (x: number) => ROTR(17, x) ^ ROTR(19, x) ^ (x >>> 10);

  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);

  const encoder = new TextEncoder();
  const msg = encoder.encode(text);

  const bitLen = msg.length * 8;
  let k = 56 - ((msg.length + 1) % 64);
  if (k < 0) k += 64;

  const padded = new Uint8Array(msg.length + 1 + k + 8);
  padded.set(msg, 0);
  padded[msg.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor(bitLen / 2 ** 32));
  view.setUint32(padded.length - 4, bitLen >>> 0);

  let h0 = 0x6a09e667,
    h1 = 0xbb67ae85,
    h2 = 0x3c6ef372,
    h3 = 0xa54ff53a;
  let h4 = 0x510e527f,
    h5 = 0x9b05688c,
    h6 = 0x1f83d9ab,
    h7 = 0x5be0cd19;

  const W = new Uint32Array(64);

  for (let i = 0; i < padded.length; i += 64) {
    for (let t = 0; t < 16; t++) {
      W[t] = view.getUint32(i + t * 4);
    }
    for (let t = 16; t < 64; t++) {
      //@ts-ignore
      W[t] = (σ1(W[t - 2]) + W[t - 7] + σ0(W[t - 15]) + W[t - 16]) >>> 0;
    }

    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4,
      f = h5,
      g = h6,
      h = h7;

    for (let t = 0; t < 64; t++) {
      //@ts-ignore
      const T1 = (h + Σ1(e) + Ch(e, f, g) + K[t] + W[t]) >>> 0;
      const T2 = (Σ0(a) + Maj(a, b, c)) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + T1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (T1 + T2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const digest = new Uint8Array(
    [
      h0 >> 24,
      h0 >> 16,
      h0 >> 8,
      h0,
      h1 >> 24,
      h1 >> 16,
      h1 >> 8,
      h1,
      h2 >> 24,
      h2 >> 16,
      h2 >> 8,
      h2,
      h3 >> 24,
      h3 >> 16,
      h3 >> 8,
      h3,
      h4 >> 24,
      h4 >> 16,
      h4 >> 8,
      h4,
      h5 >> 24,
      h5 >> 16,
      h5 >> 8,
      h5,
      h6 >> 24,
      h6 >> 16,
      h6 >> 8,
      h6,
      h7 >> 24,
      h7 >> 16,
      h7 >> 8,
      h7,
    ].map((b) => b & 0xff)
  );

  if (encoding === 'hex') {
    return Array.from(digest)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    // Base64 encoding
    let binary = '';
    digest.forEach((b) => (binary += String.fromCharCode(b)));
    //@ts-ignore
    return globalThis.btoa
      ? btoa(binary)
      : Buffer.from(binary, 'binary').toString('base64');
  }
}
