const ARRAY_FIELDS = new Set([
  'technologies',
  'features',
  'tags',
  'links'
]);

export default function parsePossibleArrays(body) {
  const parsed = {};

  for (const key in body) {
    const value = body[key];

    // Fields that should ALWAYS be arrays
    if (ARRAY_FIELDS.has(key)) {
      if (Array.isArray(value)) {
        parsed[key] = value;
      } else if (typeof value === 'string') {
        parsed[key] = value
          .split(',')
          .map(v => v.trim())
          .filter(Boolean);
      } else {
        parsed[key] = [];
      }
    }

    // Fields that should ALWAYS be strings
    else {
      if (Array.isArray(value)) {
        // Join multiline / chunked content safely
        parsed[key] = value.join(' ');
      } else {
        parsed[key] = value;
      }
    }
  }

  return parsed;
}
