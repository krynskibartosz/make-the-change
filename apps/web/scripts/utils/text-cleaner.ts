export function cleanHtml(html: string): string {
  if (!html) return '';
  
  // Replace <br> with newlines
  let text = html.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  
  // Remove scripts
  text = text.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "");
  // Remove styles
  text = text.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "");
  
  // Strip tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Decode entities (basic)
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  
  // Collapse multiple newlines
  text = text.replace(/\n\s*\n/g, '\n\n');
  
  return text.trim();
}
