const { GoogleGenerativeAI } = require('@google/generative-ai');
const vectorService = require('./vectorService');

class RAGService {
  constructor() {
    this.genAI = null;
    this.model = null;
  }

  async initialize() {
    try {
      console.log('Initializing RAG service...');
      
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is required');
      }

      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
      
      console.log('RAG service initialized successfully');
    } catch (error) {
      console.error('Error initializing RAG service:', error);
      throw error;
    }
  }

  async retrieveRelevantArticles(query, limit = 5) {
    try {
      console.log(`Retrieving relevant articles for query: ${query}`);
      
      const similarArticles = await vectorService.searchSimilar(query, limit);
      
      console.log(`Found ${similarArticles.length} relevant articles`);
      return similarArticles;
      
    } catch (error) {
      console.error('Error retrieving relevant articles:', error);
      return [];
    }
  }

  async generateResponse(userQuery, relevantArticles) {
    try {
      console.log('Generating response with Gemini...');
      
      // Prepare context from relevant articles
      const context = this.prepareContext(relevantArticles);
      
      // Create the prompt
      const prompt = this.createPrompt(userQuery, context);
      
      // Generate response using Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Response generated successfully');
      return text;
      
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response
      return this.generateFallbackResponse(userQuery, relevantArticles);
    }
  }

  prepareContext(articles) {
    if (!articles || articles.length === 0) {
      return 'No relevant news articles found.';
    }

    let context = 'RELEVANT NEWS ARTICLES:\n\n';
    
    articles.forEach((article, index) => {
      context += `${index + 1}. **${article.title}**\n`;
      context += `   Source: ${article.source}\n`;
      context += `   Published: ${article.publishedDate ? new Date(article.publishedDate).toLocaleDateString() : 'Unknown'}\n`;
      context += `   Summary: ${article.summary}\n`;
      if (article.content && article.content.length > 100) {
        context += `   Content: ${article.content.substring(0, 500)}...\n`;
      }
      context += `   URL: ${article.url}\n\n`;
    });

    return context;
  }

  createPrompt(userQuery, context) {
    return `You are a knowledgeable news assistant with access to recent news articles. Answer the user's question using the provided news content.

NEWS ARTICLES CONTEXT:
${context}

USER QUESTION: ${userQuery}

INSTRUCTIONS:
1. Use ONLY the information from the provided news articles above
2. Provide specific details, facts, and quotes from the articles
3. Mention the source (e.g., "According to BBC News..." or "The Washington Post reports...")
4. If multiple articles cover the same topic, combine the information
5. If the articles don't contain relevant information, say: "The available news articles don't contain information about [topic]. The articles focus on [list main topics from articles]."
6. Be specific and detailed - avoid vague responses
7. Include relevant dates, numbers, and specific facts when available
8. If asking about economy, look for business, financial, or economic news specifically

RESPONSE:`;
  }

  generateFallbackResponse(userQuery, relevantArticles) {
    if (relevantArticles.length === 0) {
      return "I apologize, but I couldn't find any relevant news articles to answer your question. Please try asking about recent news topics or rephrase your question.";
    }

    let response = "Based on the available news articles, here's what I found:\n\n";
    
    relevantArticles.forEach((article, index) => {
      response += `${index + 1}. **${article.title}**\n`;
      response += `   ${article.summary}\n`;
      response += `   Source: ${article.source}\n\n`;
    });

    response += "For more detailed information, please check the full articles using the provided links.";
    
    return response;
  }

  async getAvailableTopics() {
    try {
      // Get a sample of articles to identify available topics
      const sampleArticles = await vectorService.searchSimilar('news topics', 20);
      
      const topics = new Set();
      sampleArticles.forEach(article => {
        // Extract topics from titles and content
        const text = `${article.title} ${article.summary}`.toLowerCase();
        
        if (text.includes('economy') || text.includes('business') || text.includes('financial')) {
          topics.add('Economy & Business');
        }
        if (text.includes('politics') || text.includes('government') || text.includes('election')) {
          topics.add('Politics');
        }
        if (text.includes('technology') || text.includes('tech') || text.includes('ai')) {
          topics.add('Technology');
        }
        if (text.includes('environment') || text.includes('climate') || text.includes('weather')) {
          topics.add('Environment');
        }
        if (text.includes('crime') || text.includes('police') || text.includes('arrest')) {
          topics.add('Crime & Justice');
        }
        if (text.includes('entertainment') || text.includes('movie') || text.includes('music')) {
          topics.add('Entertainment');
        }
        if (text.includes('sports') || text.includes('football') || text.includes('olympics')) {
          topics.add('Sports');
        }
        if (text.includes('health') || text.includes('medical') || text.includes('covid')) {
          topics.add('Health');
        }
      });
      
      return Array.from(topics);
    } catch (error) {
      console.error('Error getting available topics:', error);
      return ['General News'];
    }
  }

  async generateStreamingResponse(userQuery, relevantArticles, onChunk) {
    try {
      const context = this.prepareContext(relevantArticles);
      const prompt = this.createPrompt(userQuery, context);
      
      // Note: Gemini doesn't support streaming in the current API
      // This is a placeholder for future streaming implementation
      const response = await this.generateResponse(userQuery, relevantArticles);
      
      // Simulate streaming by sending chunks
      const words = response.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
        onChunk(chunk);
        
        // Add small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
    } catch (error) {
      console.error('Error generating streaming response:', error);
      onChunk('Error generating response. Please try again.');
    }
  }

  async getArticleSummary(articleId) {
    try {
      // This would typically fetch from vector database
      // For now, return a placeholder
      return {
        id: articleId,
        summary: 'Article summary not available',
        relevanceScore: 0
      };
    } catch (error) {
      console.error('Error getting article summary:', error);
      return null;
    }
  }
}

module.exports = new RAGService();
