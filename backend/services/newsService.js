const axios = require('axios');
const Parser = require('rss-parser');
const cheerio = require('cheerio');
const vectorService = require('./vectorService');

class NewsService {
  constructor() {
    this.parser = new Parser();
    this.newsArticles = [];
    this.rssFeeds = [
      'https://feeds.bbci.co.uk/news/rss.xml',
      'https://feeds.npr.org/1001/rss.xml',
      'https://feeds.washingtonpost.com/rss/world',
      'https://feeds.washingtonpost.com/rss/business',
      'https://feeds.washingtonpost.com/rss/politics',
      'https://rss.cnn.com/rss/edition.rss',
      'https://rss.cnn.com/rss/edition_business.rss',
      'https://rss.cnn.com/rss/edition_technology.rss',
      'https://feeds.reuters.com/reuters/topNews',
      'https://feeds.reuters.com/reuters/businessNews',
      'https://feeds.reuters.com/reuters/technologyNews',
      // Indian tech news sources
      'https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms',
      'https://www.livemint.com/rss/technology',
      'https://www.hindustantimes.com/rss/tech',
      'https://www.indiatoday.in/rss/1206514',
      'https://www.moneycontrol.com/rss/technology.xml',
      'https://www.business-standard.com/rss/technology-106.rss'
    ];
  }

  async initialize() {
    console.log('Initializing news service...');
    await this.fetchAndProcessNews();
    console.log(`Loaded ${this.newsArticles.length} news articles`);
  }

  async fetchAndProcessNews() {
    try {
      const allArticles = [];
      
      for (const feedUrl of this.rssFeeds) {
        try {
          console.log(`Fetching from ${feedUrl}...`);
          const feed = await this.parser.parseURL(feedUrl);
          
          for (const item of feed.items.slice(0, 10)) { // Limit to 10 per feed
            const article = await this.processArticle(item);
            if (article) {
              allArticles.push(article);
            }
          }
        } catch (error) {
          console.error(`Error fetching from ${feedUrl}:`, error.message);
        }
      }

      // Store articles in vector database
      await this.storeArticlesInVectorDB(allArticles);
      this.newsArticles = allArticles;
      
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  async processArticle(item) {
    try {
      // Extract content from article URL
      let fullContent = item.contentSnippet || item.content || '';
      
      if (item.link && fullContent.length < 200) {
        try {
          const response = await axios.get(item.link, {
            timeout: 5000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          const $ = cheerio.load(response.data);
          
          // Try to extract main content
          const contentSelectors = [
            'article .story-body',
            'article .article-body',
            '.article-content',
            '.entry-content',
            'main article',
            '.story-content'
          ];
          
          for (const selector of contentSelectors) {
            const content = $(selector).text().trim();
            if (content.length > fullContent.length) {
              fullContent = content;
            }
          }
        } catch (error) {
          console.log(`Could not fetch full content for ${item.link}:`, error.message);
        }
      }

      if (fullContent.length < 50) {
        return null; // Skip articles with insufficient content
      }

      const article = {
        id: this.generateArticleId(item.link),
        title: item.title || 'Untitled',
        content: fullContent,
        url: item.link,
        publishedDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        source: this.extractSource(item.link),
        summary: this.generateSummary(fullContent)
      };
      
      console.log(`📰 Processed: ${article.title} from ${article.source} (${article.content.length} chars)`);
      return article;
    } catch (error) {
      console.error('Error processing article:', error);
      return null;
    }
  }

  generateArticleId(url) {
    // Generate a UUID instead of base64 encoded URL
    const { v4: uuidv4 } = require('uuid');
    return uuidv4();
  }

  extractSource(url) {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '').split('.')[0];
    } catch {
      return 'unknown';
    }
  }

  generateSummary(content) {
    // Simple extractive summary - take first 200 characters
    return content.substring(0, 200).replace(/\s+\S*$/, '') + '...';
  }

  async storeArticlesInVectorDB(articles) {
    try {
      console.log('Storing articles in vector database...');
      
      // Check if vector service is available
      if (!vectorService.client) {
        console.log('⚠️  Vector database not available - skipping article storage');
        return;
      }
      
      for (const article of articles) {
        // Create embedding for the article content
        const embedding = await vectorService.createEmbedding(
          `${article.title}\n\n${article.content}`
        );
        
        // Store in vector database
        await vectorService.storeArticle(article, embedding);
      }
      
      console.log(`Stored ${articles.length} articles in vector database`);
    } catch (error) {
      console.error('Error storing articles in vector database:', error);
      console.log('⚠️  Continuing without vector storage');
    }
  }

  async refreshNews() {
    console.log('Refreshing news articles...');
    await this.fetchAndProcessNews();
  }

  getArticleCount() {
    return this.newsArticles.length;
  }

  getArticles() {
    return this.newsArticles;
  }
}

module.exports = new NewsService();
