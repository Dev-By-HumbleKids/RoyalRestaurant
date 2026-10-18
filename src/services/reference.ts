// No 0/O, 1/I/L — easy to read aloud and type.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateReference(): string {
  const bytes = new Uint32Array(4);
  crypto.getRandomValues(bytes);
  return `RYL-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')}`;
}
