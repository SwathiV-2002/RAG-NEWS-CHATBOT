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

  async retrieveRelevantArticles(query, conversationHistory = [], limit = 5) {
    try {
      console.log(`Retrieving relevant articles for query: ${query}`);
      console.log(`Conversation history length: ${conversationHistory ? conversationHistory.length : 0}`);
      console.log(`Conversation history:`, conversationHistory);
      
      // Simple but effective context handling
      let searchQuery = query;
      
      if (conversationHistory && conversationHistory.length > 0) {
        // Get user messages to understand what they were talking about
        const userMessages = conversationHistory.filter(msg => msg.role === 'user');
        
        if (userMessages.length > 1) {
          // Get the previous user message (not the current one) for context
          const previousUserMessage = userMessages[userMessages.length - 2];
          const currentUserMessage = userMessages[userMessages.length - 1];
          
          console.log(`Previous user message: ${previousUserMessage.content}`);
          console.log(`Current user message: ${currentUserMessage.content}`);
          
          // If current query uses pronouns or is a follow-up question, combine with previous context
          const isFollowUp = query.toLowerCase().includes('he') || 
                           query.toLowerCase().includes('she') || 
                           query.toLowerCase().includes('it') || 
                           query.toLowerCase().includes('they') ||
                           query.toLowerCase().includes('why') ||
                           query.toLowerCase().includes('how') ||
                           query.toLowerCase().includes('when') ||
                           query.toLowerCase().includes('where') ||
                           query.toLowerCase().includes('what') ||
                           query.toLowerCase().includes('who');
          
          console.log(`Is follow-up question: ${isFollowUp}`);
          
          if (isFollowUp) {
            // For follow-up questions, search for the previous topic + current question
            searchQuery = `${previousUserMessage.content} ${query}`;
            console.log(`🔍 Follow-up detected. Searching for: ${searchQuery}`);
          }
        }
      }
      
      console.log(`Final search query: ${searchQuery}`);
      const similarArticles = await vectorService.searchSimilar(searchQuery, limit);
      console.log(`Found ${similarArticles.length} relevant articles`);
      
      return similarArticles;
      
    } catch (error) {
      console.error('Error retrieving relevant articles:', error);
      return [];
    }
  }

  async generateResponse(userQuery, relevantArticles, conversationHistory = []) {
    try {
      console.log('Generating response with Gemini...');
      
      // Prepare context from relevant articles
      const context = this.prepareContext(relevantArticles);
      
      // Create the prompt with conversation history
      const prompt = this.createPrompt(userQuery, context, conversationHistory);
      
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

  createPrompt(userQuery, context, conversationHistory = []) {
    let conversationContext = '';
    
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = `\nCONVERSATION HISTORY:\n`;
      conversationHistory.forEach((msg, index) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationContext += `${role}: ${msg.content}\n`;
      });
      conversationContext += `\nCurrent User Question: ${userQuery}\n\n`;
    }

    // Check if this is a greeting
    const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)$/i.test(userQuery.trim());

    if (isGreeting) {
      return `You are a friendly news assistant. The user has greeted you. Respond warmly and then suggest the available news topics they can ask about.

${conversationContext}NEWS ARTICLES CONTEXT:
${context}

INSTRUCTIONS:
1. Respond in a friendly, conversational tone like "Hi there! I'm your news assistant..."
2. Briefly mention what you can help with
3. Then list the main news topics available from the articles above
4. Encourage them to ask about any specific topic
5. Be warm and helpful, not formal

RESPONSE:`;
    }

    return `You are a knowledgeable news assistant with access to recent news articles. Answer the user's question using the provided news content.

${conversationContext}NEWS ARTICLES CONTEXT:
${context}

USER QUESTION: ${userQuery}

INSTRUCTIONS:
1. Use ONLY the information from the provided news articles above
2. Consider the conversation history to understand follow-up questions and maintain context
3. If this is a follow-up question (using words like "why", "how", "what", "when", "where", "who"):
   - Reference the previous topic being discussed
   - Use pronouns like "he", "she", "it" appropriately based on context
   - Build upon the previous conversation naturally
4. Format your response clearly with:
   - Use emojis to make it more engaging (📰, 💡, 🔍, etc.)
   - Use **bold** for important points and article titles
   - Use bullet points or numbered lists when appropriate
   - Keep paragraphs short and readable
5. Mention the source (e.g., "According to BBC News..." or "The Washington Post reports...")
6. If multiple articles cover the same topic, combine the information
7. If the articles don't contain relevant information, say: "The available news articles don't contain information about [topic]. The articles focus on [list main topics from articles]."
8. Be specific and detailed - avoid vague responses
9. Include relevant dates, numbers, and specific facts when available
10. If asking about economy, look for business, financial, or economic news specifically
11. For follow-up questions, acknowledge the previous context and build upon it

RESPONSE:`;
  }

  generateFallbackResponse(userQuery, relevantArticles) {
    // Check if this is a greeting
    const isGreeting = /^(hi|hello|hey|good morning|good afternoon|good evening|greetings)$/i.test(userQuery.trim());

    if (isGreeting) {
      let response = "👋 Hi there! I'm your news assistant. I can help you find information about the latest news.\n\n";
      
      if (relevantArticles.length > 0) {
        response += "📰 Here are some current news topics you can ask about:\n\n";
        
        // Group articles by topic for better organization
        const topics = {};
        relevantArticles.slice(0, 5).forEach((article) => {
          const topic = article.title.split('|')[0].trim() || article.title.split(':')[0].trim();
          if (!topics[topic]) {
            topics[topic] = [];
          }
          topics[topic].push(article);
        });
        
        Object.entries(topics).forEach(([topic, articles], index) => {
          response += `**${index + 1}. ${topic}**\n`;
          const mainArticle = articles[0];
          response += `   ${mainArticle.summary.substring(0, 120)}...\n`;
        });
        
        response += "💬 Feel free to ask me about any of these topics or anything else you're curious about!";
      } else {
        response += "⏳ I'm currently loading the latest news articles. Please try again in a moment!";
      }
      
      return response;
    }

    if (relevantArticles.length === 0) {
      return "I apologize, but I couldn't find any relevant news articles to answer your question. Please try asking about recent news topics or rephrase your question.";
    }

    let response = "📰 Based on the available news articles, here's what I found:\n\n";
    
    relevantArticles.forEach((article, index) => {
      response += `**${index + 1}. ${article.title}**\n`;
      response += `   ${article.summary}\n`;
    });

    response += "💡 For more detailed information, please check the full articles using the provided links.";
    
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
