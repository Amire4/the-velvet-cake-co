/**
 * Helper to parse customization JSON into a clean, luxury human-readable string or key-value tags.
 * Example input: '{"flavor":"Chocolate Truffle","size":"8-inch","message":"Happy Anniversary David & Sophia!"}'
 * Output: Flavor: Chocolate Truffle • Size: 8-inch • Message: "Happy Anniversary David & Sophia!"
 */
export function formatCustomization(rawCustomization?: string | null): string | null {
  if (!rawCustomization || !rawCustomization.trim()) return null;

  try {
    // If it's a JSON string
    if (rawCustomization.startsWith('{') || rawCustomization.startsWith('[')) {
      const parsed = JSON.parse(rawCustomization);
      if (typeof parsed === 'object' && parsed !== null) {
        const parts: string[] = [];
        if (parsed.flavor) parts.push(`Flavor: ${parsed.flavor}`);
        if (parsed.size) parts.push(`Size: ${parsed.size}`);
        if (parsed.tier || parsed.tiers) parts.push(`Tiers: ${parsed.tier || parsed.tiers}`);
        if (parsed.message) parts.push(`Inscription: "${parsed.message}"`);
        if (parsed.dietary) parts.push(`Dietary: ${parsed.dietary}`);
        if (parsed.notes) parts.push(`Note: ${parsed.notes}`);
        
        // If other custom keys exist
        Object.entries(parsed).forEach(([key, val]) => {
          if (!['flavor', 'size', 'tier', 'tiers', 'message', 'dietary', 'notes'].includes(key) && val) {
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            parts.push(`${formattedKey}: ${val}`);
          }
        });

        return parts.length > 0 ? parts.join(' • ') : null;
      }
    }
  } catch (e) {
    // If not JSON, clean up raw text
    return rawCustomization.replace(/[{}"]/g, '').replace(/,/g, ' • ').trim();
  }

  return rawCustomization;
}

export function parseCustomizationTags(rawCustomization?: string | null): { label: string; value: string }[] {
  if (!rawCustomization || !rawCustomization.trim()) return [];

  try {
    if (rawCustomization.startsWith('{') || rawCustomization.startsWith('[')) {
      const parsed = JSON.parse(rawCustomization);
      if (typeof parsed === 'object' && parsed !== null) {
        const tags: { label: string; value: string }[] = [];
        if (parsed.flavor) tags.push({ label: 'Flavor', value: parsed.flavor });
        if (parsed.size) tags.push({ label: 'Size', value: parsed.size });
        if (parsed.tier || parsed.tiers) tags.push({ label: 'Tiers', value: String(parsed.tier || parsed.tiers) });
        if (parsed.message) tags.push({ label: 'Inscription', value: `"${parsed.message}"` });
        if (parsed.dietary) tags.push({ label: 'Dietary', value: parsed.dietary });
        if (parsed.notes) tags.push({ label: 'Notes', value: parsed.notes });

        Object.entries(parsed).forEach(([key, val]) => {
          if (!['flavor', 'size', 'tier', 'tiers', 'message', 'dietary', 'notes'].includes(key) && val) {
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            tags.push({ label: formattedKey, value: String(val) });
          }
        });
        return tags;
      }
    }
  } catch (e) {
    // fallback
  }

  return [{ label: 'Customization', value: rawCustomization.replace(/[{}"]/g, '') }];
}
