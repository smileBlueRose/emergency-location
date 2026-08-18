export function resolveMediaUrl(url: string) {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080';

  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname === 'localhost' ||
      parsedUrl.hostname === '0.0.0.0'
    ) {
      const apiOrigin =
        new URL(apiUrl).origin;

      return `${apiOrigin}${parsedUrl.pathname}${parsedUrl.search}`;
    }

    return url;
  } catch {
    return url;
  }
}