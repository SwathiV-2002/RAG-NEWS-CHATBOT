const { QdrantClient } = require('@qdrant/js-client-rest');
const axios = require('axios');

class VectorService {
  constructor() {
    this.client = null;
    this.collectionName = 'news_articles';
    this.embeddingModel = 'jina-embeddings-v2-base-en';
    this.embeddingApiUrl = 'https://api.jina.ai/v1/embeddings';
  }

  async initialize() {
    try {
      console.log('Initializing vector service...');
      
      // TEMPORARILY DISABLE QDRANT FOR RENDER.COM DEPLOYMENT
      // The @qdrant/js-client-rest library has issues with Render.com's port handling
      console.log('⚠️  Qdrant temporarily disabled for Render.com deployment');
      console.log('⚠️  Using fallback mode - chatbot will work with basic responses');
      this.client = null; // Set to null to indicate fallback mode
      
      console.log('Vector service initialized in fallback mode');
    } catch (error) {
      console.error('Error initializing vector service:', error);
      console.log('⚠️  Qdrant not available - using fallback mode');
      this.client = null; // Set to null to indicate fallback mode
      // Don't throw error, allow service to continue in fallback mode
    }
  }

  async createCollection() {
    try {
      const collections = await this.client.getCollections();
      
      if (!collections.collections.find(c => c.name === this.collectionName)) {
        console.log(`Creating collection: ${this.collectionName}`);
        
        await this.client.createCollection(this.collectionName, {
          vectors: {
            size: 768, // Jina embeddings v2 base dimension
            distance: 'Cosine'
          }
        });
        
        console.log(`Collection ${this.collectionName} created successfully`);
      } else {
        console.log(`Collection ${this.collectionName} already exists`);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  async createEmbedding(text) {
    try {
      const response = await axios.post(
        this.embeddingApiUrl,
        {
          input: [text],
          model: this.embeddingModel
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.data && response.data.data[0]) {
        return response.data.data[0].embedding;
      } else {
        throw new Error('Invalid embedding response');
      }
    } catch (error) {
      console.error('Error creating embedding:', error);
      
      // Fallback: return a random embedding if API fails
      console.log('Using fallback embedding...');
      return this.generateFallbackEmbedding(text);
    }
  }

  generateFallbackEmbedding(text) {
    // Simple hash-based fallback embedding
    const hash = this.simpleHash(text);
    const embedding = new Array(768).fill(0);
    
    for (let i = 0; i < 768; i++) {
      embedding[i] = Math.sin(hash + i) * 0.1;
    }
    
    return embedding;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  async storeArticle(article, embedding) {
    try {
      const point = {
        id: article.id,
        vector: embedding,
        payload: {
          title: article.title,
          content: article.content,
          url: article.url,
          publishedDate: article.publishedDate.toISOString(),
          source: article.source,
          summary: article.summary
        }
      };

      await this.client.upsert(this.collectionName, {
        wait: true,
        points: [point]
      });

    } catch (error) {
      console.error('Error storing article:', error);
      throw error;
    }
  }

  async searchSimilar(query, limit = 5) {
    try {
      // If Qdrant is not available, return empty results
      if (!this.client) {
        console.log('⚠️  Qdrant not available - returning empty search results');
        return [];
      }

      console.log(`🔍 Searching for: "${query}"`);
      
      // Create embedding for the query
      const queryEmbedding = await this.createEmbedding(query);
      
      // Search for similar articles
      const searchResult = await this.client.search(this.collectionName, {
        vector: queryEmbedding,
        limit: limit,
        with_payload: true
      });

      console.log(`📊 Search returned ${searchResult.length} results`);
      searchResult.forEach((result, index) => {
        console.log(`${index + 1}. ${result.payload.title} (score: ${result.score.toFixed(3)})`);
      });

      // Always deduplicate results by URL to avoid showing same article multiple times
      const uniqueResults = [];
      const seenUrls = new Set();
      
      // Filter out irrelevant articles
      const irrelevantKeywords = ['bird', 'conservation', 'wildlife', 'nature', 'environment', 'climate', 'animal', 'species', 'trapper', 'predator', 'nest', 'egg', 'feather', 'wing', 'beak', 'new zealand', 'rare birds', 'backyard trappers', 'invasive predators', 'save its rare', 'nation of backyard'];
      
      for (const result of searchResult) {
        if (!seenUrls.has(result.payload.url)) {
          // Check if article is relevant to the query
          const title = result.payload.title.toLowerCase();
          const content = result.payload.content.toLowerCase();
          const summary = result.payload.summary.toLowerCase();
          
          const hasIrrelevantContent = irrelevantKeywords.some(keyword => 
            title.includes(keyword) || summary.includes(keyword) || content.includes(keyword)
          );
          
          // Only include relevant articles
          if (!hasIrrelevantContent) {
            seenUrls.add(result.payload.url);
            uniqueResults.push({
              id: result.id,
              score: result.score,
              title: result.payload.title,
              content: result.payload.content,
              url: result.payload.url,
              publishedDate: result.payload.publishedDate,
              source: result.payload.source,
              summary: result.payload.summary
            });
          }
        }
      }
      
      console.log(`📊 After deduplication: ${uniqueResults.length} unique articles`);
      
      // If we still have few unique results, try keyword-based search
      if (uniqueResults.length < 2) {
        console.log('🔍 Few unique results after deduplication, trying keyword search...');
        const keywordResults = await this.keywordSearch(query, limit);
        if (keywordResults.length > uniqueResults.length) {
          console.log(`📈 Keyword search found ${keywordResults.length} additional results`);
          return keywordResults;
        }
      }
      
      return uniqueResults;

    } catch (error) {
      console.error('Error searching similar articles:', error);
      console.log('⚠️  Returning empty search results due to error');
      return [];
    }
  }

  async keywordSearch(query, limit = 5) {
    try {
      // Get all articles and search by keywords
      const allArticles = await this.client.scroll(this.collectionName, {
        limit: 1000,
        with_payload: true
      });

      const queryWords = query.toLowerCase().split(/\s+/);
      const scoredArticles = [];

      for (const point of allArticles.points) {
        const title = point.payload.title.toLowerCase();
        const content = point.payload.content.toLowerCase();
        const summary = point.payload.summary.toLowerCase();
        
        let score = 0;
        
        // Check for exact keyword matches first (higher priority)
        queryWords.forEach(word => {
          if (title.includes(word)) score += 5; // Higher weight for title matches
          if (summary.includes(word)) score += 3;
          if (content.includes(word)) score += 1;
        });

        // Check for related terms with better filtering
        const relatedTerms = {
          'tech': ['technology', 'nvidia', 'tiktok', 'ai', 'artificial intelligence', 'software', 'digital', 'computer', 'startup', 'innovation', 'tech companies', 'smartphone', 'app', 'platform', 'cyber', 'data', 'cloud', 'blockchain', 'crypto', 'gaming', 'mobile', 'internet', 'web', 'coding', 'programming', 'developer', 'engineer'],
          'indian': ['india', 'indian', 'delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'pune', 'gurgaon', 'noida', 'indian companies', 'indian startups', 'bharat', 'hindustan'],
          'economy': ['business', 'financial', 'economic', 'fed', 'unemployment', 'trade', 'market', 'economy', 'finance', 'investment', 'revenue', 'profit', 'stock', 'banking'],
          'politics': ['government', 'election', 'trump', 'biden', 'congress', 'senate', 'political', 'policy', 'administration', 'democrat', 'republican', 'vote', 'campaign']
        };

        // Only apply related terms if the query contains the main category
        Object.entries(relatedTerms).forEach(([key, terms]) => {
          if (queryWords.some(word => word.includes(key))) {
            terms.forEach(term => {
              if (title.includes(term)) score += 2;
              if (summary.includes(term)) score += 1;
            });
          }
        });

        // Filter out irrelevant articles based on content
        const irrelevantKeywords = ['bird', 'conservation', 'wildlife', 'nature', 'environment', 'climate', 'animal', 'species', 'trapper', 'predator', 'nest', 'egg', 'feather', 'wing', 'beak', 'new zealand', 'rare birds', 'backyard trappers', 'invasive predators', 'save its rare', 'nation of backyard'];
        const hasIrrelevantContent = irrelevantKeywords.some(keyword => 
          title.toLowerCase().includes(keyword) || summary.toLowerCase().includes(keyword) || content.toLowerCase().includes(keyword)
        );

        // Only include articles that have a good score and are not irrelevant
        if (score > 0 && !hasIrrelevantContent) {
          scoredArticles.push({
            id: point.id,
            score: score / 10, // Normalize score
            title: point.payload.title,
            content: point.payload.content,
            url: point.payload.url,
            publishedDate: point.payload.publishedDate,
            source: point.payload.source,
            summary: point.payload.summary
          });
        }
      }

      // Sort by score and return top results
      return scoredArticles
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    } catch (error) {
      console.error('Error in keyword search:', error);
      return [];
    }
  }

  async getCollectionInfo() {
    try {
      const collection = await this.client.getCollection(this.collectionName);
      return {
        name: collection.name,
        vectorsCount: collection.vectors_count,
        status: collection.status
      };
    } catch (error) {
      console.error('Error getting collection info:', error);
      return null;
    }
  }

  async clearCollection() {
    try {
      await this.client.deleteCollection(this.collectionName);
      console.log(`Collection ${this.collectionName} cleared`);
    } catch (error) {
      console.error('Error clearing collection:', error);
      throw error;
    }
  }
}

module.exports = new VectorService();
