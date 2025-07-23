/**
 * Helper functions for transforming Strapi API responses to frontend Article model
 * Use this in your frontend to process API responses from your Strapi backend
 */

/**
 * Transform a single Strapi article to frontend Article interface
 * @param {Object} strapiArticle - Raw article from Strapi API
 * @returns {Object} - Transformed article matching frontend interface
 */
function transformStrapiArticle(strapiArticle) {
  const { id, attributes } = strapiArticle;
  
  return {
    id,
    title: attributes.title,
    description: attributes.description,
    content: attributes.content,
    slug: attributes.slug,
    author: attributes.author?.data?.attributes?.name || "Daniel Alvarez",
    category: attributes.category?.data?.attributes?.name || "General",
    publishedAt: attributes.publishedAt || attributes.createdAt,
    
    // Transform media fields
    image: {
      url: attributes.image?.data?.attributes?.url || ""
    },
    authorImage: {
      url: attributes.author?.data?.attributes?.avatar?.data?.attributes?.url || "/default-avatar.png"
    }
  };
}

/**
 * Transform array of Strapi articles
 * @param {Array} strapiArticles - Array of Strapi articles
 * @returns {Array} - Array of transformed articles
 */
function transformStrapiArticles(strapiArticles) {
  return strapiArticles.map(transformStrapiArticle);
}

/**
 * Fetch articles from Strapi with proper population
 * @param {string} baseUrl - Your Strapi base URL (e.g., 'http://localhost:1337')
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Transformed articles
 */
async function fetchArticles(baseUrl = 'http://localhost:1337', options = {}) {
  const {
    page = 1,
    pageSize = 25,
    category = null,
    slug = null,
    published = true
  } = options;

  // Build query parameters
  const params = new URLSearchParams({
    'populate[image]': '*',
    'populate[author][populate][avatar]': '*',
    'populate[category]': '*',
    'pagination[page]': page.toString(),
    'pagination[pageSize]': pageSize.toString(),
  });

  // Add filters
  if (published) {
    params.append('filters[publishedAt][$notNull]', 'true');
  }
  
  if (category) {
    params.append('filters[category][$eq]', category);
  }
  
  if (slug) {
    params.append('filters[slug][$eq]', slug);
  }

  try {
    const response = await fetch(`${baseUrl}/api/articles?${params}`);
    const data = await response.json();
    
    if (slug) {
      // Return single article if searching by slug
      return data.data.length > 0 ? transformStrapiArticle(data.data[0]) : null;
    }
    
    return {
      articles: transformStrapiArticles(data.data),
      meta: data.meta
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}

/**
 * Process code blocks if using dynamic zones
 * @param {Array} blocks - Strapi blocks array
 * @returns {string} - HTML string to append to content
 */
function processCodeBlocks(blocks = []) {
  return blocks
    .filter(block => block.__component === 'shared.code-block')
    .map(block => {
      const { code, language, filename, showLineNumbers } = block;
      const filenameHeader = filename ? `<div class="code-filename">${filename}</div>` : '';
      const lineNumberClass = showLineNumbers ? 'line-numbers' : '';
      
      return `
        ${filenameHeader}
        <pre class="${lineNumberClass}"><code class="language-${language}">${escapeHtml(code)}</code></pre>
      `;
    })
    .join('');
}

/**
 * Escape HTML characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Fetch categories from Strapi
 * @param {string} baseUrl - Your Strapi base URL
 * @returns {Promise<Array>} - Array of categories
 */
async function fetchCategories(baseUrl = 'http://localhost:1337') {
  try {
    const response = await fetch(`${baseUrl}/api/categories?populate[image]=*`);
    const data = await response.json();
    
    return data.data.map(category => ({
      id: category.id,
      name: category.attributes.name,
      slug: category.attributes.slug,
      description: category.attributes.description,
      color: category.attributes.color,
      image: {
        url: category.attributes.image?.data?.attributes?.url || ""
      }
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Fetch authors from Strapi
 * @param {string} baseUrl - Your Strapi base URL
 * @returns {Promise<Array>} - Array of authors
 */
async function fetchAuthors(baseUrl = 'http://localhost:1337') {
  try {
    const response = await fetch(`${baseUrl}/api/authors?populate[avatar]=*`);
    const data = await response.json();
    
    return data.data.map(author => ({
      id: author.id,
      name: author.attributes.name,
      email: author.attributes.email,
      avatar: {
        url: author.attributes.avatar?.data?.attributes?.url || "/default-avatar.png"
      }
    }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
}

// Export for ES modules
export {
  transformStrapiArticle,
  transformStrapiArticles,
  fetchArticles,
  fetchCategories,
  fetchAuthors,
  processCodeBlocks
};

// Export for CommonJS
module.exports = {
  transformStrapiArticle,
  transformStrapiArticles,
  fetchArticles,
  fetchCategories,
  fetchAuthors,
  processCodeBlocks
};

/**
 * Example usage in your Next.js frontend:
 * 
 * // In your pages or components
 * import { fetchArticles } from '../utils/strapiHelpers';
 * 
 * // Fetch all articles
 * const { articles, meta } = await fetchArticles('http://localhost:1337');
 * 
 * // Fetch articles with pagination
 * const { articles } = await fetchArticles('http://localhost:1337', {
 *   page: 2,
 *   pageSize: 4
 * });
 * 
 * // Fetch single article by slug
 * const article = await fetchArticles('http://localhost:1337', {
 *   slug: 'introduction-to-react'
 * });
 * 
 * // Fetch articles by category
 * const { articles } = await fetchArticles('http://localhost:1337', {
 *   category: 'Frontend'
 * });
 */
