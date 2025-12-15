export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export function getAvatarFallback(username: string): string {
  return username.slice(0, 2).toUpperCase();
}
