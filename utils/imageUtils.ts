export const getLogoUrl = (name: string): string => {
  if (!name) return '';
  try {
    // Basic cleaning of the name to guess a domain for Clearbit's logo API
    const domain = name
      .toLowerCase()
      .replace(/\s+(airlines|airline|hotels|hotel|resorts|group|inc|llc|co)\.?\b/g, '') // remove common suffixes
      .replace(/[^\w\s-]/g, '') // remove punctuation except dash
      .replace(/\s+/g, '') // remove spaces
      .trim();
    
    return `https://logo.clearbit.com/${domain}.com`;
  } catch (error) {
    console.error("Error generating logo URL for:", name, error);
    return ''; // Return empty string to trigger fallback
  }
};

export const getInitials = (name: string): string => {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1 && words[0]) {
        return words[0].substring(0, 2).toUpperCase();
    }
    if (words.length > 1 && words[0] && words[words.length - 1]) {
       return (words[0][0] + (words[words.length - 1][0])).toUpperCase();
    }
    if(name.length > 1) {
      return name.substring(0,2).toUpperCase();
    }
    return '?';
};
