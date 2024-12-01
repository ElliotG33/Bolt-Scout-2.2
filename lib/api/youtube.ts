@@ .. @@
 const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'
 
 export async function searchYouTube(query: string, maxResults: number = 50) {
-  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
+  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
 
   if (!YOUTUBE_API_KEY) {
     throw new Error('YouTube API key is not configured')
   }
 
   try {
     const params = new URLSearchParams({
       part: 'snippet',
       q: query,
       maxResults: maxResults.toString(),
       key: YOUTUBE_API_KEY,
       type: 'video',
       order: 'date',
-      relevanceLanguage: 'en',
       safeSearch: 'moderate'
     })
 
     const response = await fetch(`${YOUTUBE_API_URL}?${params}`)
     
     if (!response.ok) {
       const errorData = await response.json()
-      throw new Error(errorData.error?.message || `YouTube API error: ${response.statusText}`)
+      console.error('YouTube API Error:', errorData)
+      throw new Error('Failed to fetch YouTube results')
     }
 
     const data = await response.json()
+    
+    if (!data.items) {
+      return []
+    }
 
     return data.items.map((item: any) => ({
       id: item.id.videoId,
       title: item.snippet.title,
       description: item.snippet.description,
-      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
+      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
       url: `https://youtube.com/watch?v=${item.id.videoId}`,
       channelTitle: item.snippet.channelTitle,
       publishedAt: item.snippet.publishedAt
     }))
   } catch (error) {
     console.error('YouTube search error:', error)
-    throw error
+    return []
   }
 }