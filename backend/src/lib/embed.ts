import { openai } from '@ai-sdk/openai';
import { embedMany, embed, cosineSimilarity } from 'ai';

const model = openai.embedding('text-embedding-3-large');

// Function to split HTML into chunks with overlap
function splitHtml(
  html: string,
  chunkSize: number = 1200,
  overlap: number = 150,
): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < html.length) {
    const endIndex = Math.min(startIndex + chunkSize, html.length);
    let chunk = html.slice(startIndex, endIndex);

    // Adjust chunk to end at a proper HTML tag
    const lastTagEnd = chunk.lastIndexOf('>');
    if (lastTagEnd !== -1 && lastTagEnd !== chunk.length - 1) {
      chunk = chunk.slice(0, lastTagEnd + 1);
    }

    // Add overlap at the beginning (except for the first chunk)
    if (startIndex > 0) {
      const overlapStart = Math.max(0, startIndex - overlap);
      chunk = html.slice(overlapStart, startIndex) + chunk;
    }

    // Add overlap at the end (except for the last chunk)
    if (endIndex < html.length) {
      const overlapEnd = Math.min(html.length, endIndex + overlap);
      chunk = chunk + html.slice(endIndex, overlapEnd);
    }

    chunks.push(chunk);
    startIndex += chunk.length - (startIndex > 0 ? overlap : 0);
  }

  return chunks;
}

// Function to get embeddings using AI SDK
async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model,
    values: texts,
  });
  return embeddings;
}

// Function to index chunks in memory
async function indexChunks(chunks: string[], embeddings: number[][]) {
  return chunks.map((chunk, i) => ({
    embedding: embeddings[i],
    value: chunk,
  }));
}

// Function to search for relevant chunks using cosine similarity
async function searchChunks(
  db: { embedding: number[]; value: string }[],
  query: string,
  topK: number = 5,
): Promise<string[]> {
  const { embedding } = await embed({
    model,
    value: query,
  });

  return db
    .map((item) => ({
      document: item,
      similarity: cosineSimilarity(embedding, item.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map((r) => r.document.value);
}

// Main function to process HTML and perform search
async function processHtmlAndSearch(
  html: string,
  query: string,
  topK?: number,
  maxChunkSize: number = 1000,
  overlap: number = 200,
): Promise<string[]> {
  const chunks = splitHtml(html, maxChunkSize, overlap);
  const embeddings = await getEmbeddings(chunks);
  const indexedChunks = await indexChunks(chunks, embeddings);
  return searchChunks(indexedChunks, query, topK);
}

// Export functions if needed
export { processHtmlAndSearch, searchChunks, splitHtml };
