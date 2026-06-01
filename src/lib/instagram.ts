export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
}

export async function getInstagramPosts(limit: number = 3): Promise<InstagramMedia[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    console.warn("INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID is not set. Falling back to static images.");
    return [];
  }

  try {
    // Using the modern Graph API v20.0 endpoint
    const url = `https://graph.facebook.com/v20.0/${accountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${accessToken}&limit=${limit}`;
    const response = await fetch(url, {
      next: { revalidate: 86400 } // Refetch once a day
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch Instagram posts via Graph API:", errorText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    return [];
  }
}
