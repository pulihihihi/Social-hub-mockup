const MAX_REPAIR_PASSES = 4;

// Common mojibake leaders produced when UTF-8 bytes are decoded as cp1252/latin1.
const SUSPICIOUS_TEXT_RE = /(?:\u00c3.|\u00c2.|\u00c4.|\u00c5.|\u00c6.|\u00d0.|\u00e2..|\u00f0.|\u0102|\u0111|\u0106|\u00e1[\u00ba\u00bb].|\ufffd)/g;
const CONTROL_CHAR_RE = /[\u0080-\u009f]/g;
const REPLACEMENT_CHAR_RE = /\ufffd/g;

// Characters in the cp1252 extension block (0x80-0x9f) that are represented as
// printable Unicode points after a bad decode.
const CP1252_CHAR_TO_BYTE = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

const countMatches = (value, regex) => {
  const matches = value.match(regex);
  return matches ? matches.length : 0;
};

const getSuspiciousScore = (value) =>
  countMatches(value, SUSPICIOUS_TEXT_RE) * 4 +
  countMatches(value, CONTROL_CHAR_RE) * 2 +
  countMatches(value, REPLACEMENT_CHAR_RE) * 6;

const hasPotentialMojibake = (value) => getSuspiciousScore(value) > 0;

const toCp1252Bytes = (value) => {
  const bytes = [];

  for (const char of value) {
    const code = char.codePointAt(0);

    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }

    const mapped = CP1252_CHAR_TO_BYTE.get(code);
    if (mapped !== undefined) {
      bytes.push(mapped);
      continue;
    }

    return null;
  }

  return Uint8Array.from(bytes);
};

const decodeCp1252AsUtf8 = (value) => {
  const bytes = toCp1252Bytes(value);
  if (!bytes) {
    return null;
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
};

export const repairMojibake = (value) => {
  if (typeof value !== "string" || !hasPotentialMojibake(value)) {
    return value;
  }

  try {
    let best = value;
    let bestScore = getSuspiciousScore(value);

    for (let i = 0; i < MAX_REPAIR_PASSES; i += 1) {
      const decoded = decodeCp1252AsUtf8(best);
      if (!decoded || decoded === best) {
        break;
      }

      const decodedScore = getSuspiciousScore(decoded);
      if (decodedScore >= bestScore) {
        break;
      }

      best = decoded;
      bestScore = decodedScore;

      if (bestScore === 0) {
        break;
      }
    }

    return best;
  } catch {
    return value;
  }
};

export const repairDataTextDeep = (value, seen = new WeakMap()) => {
  if (typeof value === "string") {
    return repairMojibake(value);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (Array.isArray(value)) {
    const next = [];
    seen.set(value, next);
    value.forEach((item, index) => {
      next[index] = repairDataTextDeep(item, seen);
    });
    return next;
  }

  const next = {};
  seen.set(value, next);
  Object.entries(value).forEach(([key, item]) => {
    next[key] = repairDataTextDeep(item, seen);
  });
  return next;
};
