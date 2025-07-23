# API Integration Guide for Next.js and Strapi

## Overview
This comprehensive guide shows how to implement Strapi API endpoints in a Next.js modular MVC project. It includes API constants, service layers, controllers, error handling, and complete Postman collection examples.

## Project Structure (Next.js MVC)
```
src/
├── constants/
│   └── apiConstants.js
├── services/
│   ├── apiService.js
│   ├── articleService.js
│   ├── authorService.js
│   └── categoryService.js
├── controllers/
│   ├── articleController.js
│   ├── authorController.js
│   └── categoryController.js
├── utils/
│   ├── apiHelpers.js
│   └── errorHandler.js
├── hooks/
│   ├── useArticles.js
│   ├── useAuthors.js
│   └── useCategories.js
└── pages/
    ├── api/
    │   ├── articles/
    │   ├── authors/
    │   └── categories/
    └── components/
```

## 1. API Constants

### File: `src/constants/apiConstants.js`
```javascript
// Base Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  API_TOKEN: process.env.STRAPI_API_TOKEN,
  TIMEOUT: 10000,
};

// Article Endpoints
export const ARTICLE_ENDPOINTS = {
  BASE: '/api/articles',
  POPULATE: '?populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*&populate[blocks]=*',
  BY_SLUG: (slug) => `?filters[slug][$eq]=${slug}&populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*&populate[blocks]=*`,
  BY_CATEGORY: (categoryId) => `?filters[category][id][$eq]=${categoryId}&populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*`,
  PAGINATED: (page, pageSize) => `?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*`,
  PUBLISHED: '?filters[publishedAt][$notNull]=true&populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*',
};

// Author Endpoints
export const AUTHOR_ENDPOINTS = {
  BASE: '/api/authors',
  POPULATE: '?populate[avatar]=*&populate[articles]=*',
  BY_ID: (id) => `/${id}?populate[avatar]=*&populate[articles]=*`,
  BY_NAME: (name) => `?filters[name][$eq]=${name}&populate[avatar]=*`,
};

// Category Endpoints
export const CATEGORY_ENDPOINTS = {
  BASE: '/api/categories',
  POPULATE: '?populate[image]=*&populate[articles]=*',
  BY_ID: (id) => `/${id}?populate[image]=*&populate[articles]=*`,
  BY_SLUG: (slug) => `?filters[slug][$eq]=${slug}&populate[image]=*&populate[articles]=*`,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_ERROR: 'Validation error occurred.',
};
```

## Next.js Integration

1. **Create API Service Module**
   - In your Next.js project, create a folder named `services`
   - Add a file named `api.js`

   ```javascript
   // services/api.js

   import axios from 'axios';

   const BASE_URL = 'http://localhost:1337';

   export async function fetchArticles(params = '') {
     const response = await axios.get(`${BASE_URL}/api/articles${params}`);
     return response.data;
   }

   export async function fetchAuthors() {
     const response = await axios.get(`${BASE_URL}/api/authors?populate[avatar]=*`);
     return response.data;
   }

   export async function fetchCategories() {
     const response = await axios.get(`${BASE_URL}/api/categories?populate[image]=*`);
     return response.data;
   }
   ```

2. **Controller Implementation**
   - In the `pages` directory, create an `articles.js` for the article logic.

   ```javascript
   // pages/articles.js

   import { fetchArticles } from '../services/api';
   import { useState, useEffect } from 'react';

   export default function Articles() {
     const [articles, setArticles] = useState([]);

     useEffect(() => {
       async function loadArticles() {
         const data = await fetchArticles('?populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*');
         setArticles(data.data);
       }
       loadArticles();
     }, []);

     return (
       <div>
         <h1>Articles</h1>
         {articles.map(article => (
           <div key={article.id}>
             <h2>{article.attributes.title}</h2>
             <p>{article.attributes.description}</p>
           </div>
         ))}
       </div>
     );
   }
   ```

## Postman Collection Examples

1. **Collection Name**: Personal Blog API

2. **Folder Structure**:
   - Articles
   - Authors
   - Categories

3. **Request Examples**:

   **GET Articles**
   - URL: `{{baseUrl}}/api/articles{{articleParams}}`
   - Method: GET
   - Description: Fetches all articles with populated fields

   **GET Authors**
   - URL: `{{baseUrl}}/api/authors{{authorParams}}`
   - Method: GET
   - Description: Fetches all authors with avatars

   **GET Categories**
   - URL: `{{baseUrl}}/api/categories{{categoryParams}}`
   - Method: GET
   - Description: Fetches all categories with images

4. **Environment Variables**:
   - `baseUrl`: http://localhost:1337
   - `articleParams`: ?populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*
   - `authorParams`: ?populate[avatar]=*
   - `categoryParams`: ?populate[image]=*

## Conclusion
This guide covers setting up a basic API service in a Next.js project using Strapi as the backend. It includes endpoint constants, example code for integration, and how to create a Postman collection to test the API.
