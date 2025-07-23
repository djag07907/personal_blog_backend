# Code Handling in Articles

## Overview
Your updated article schema now supports two ways to include programming code:

### 1. Simple Code in Rich Text Content
For inline code snippets or simple code blocks, you can use markdown syntax directly in the `content` rich text field:

```markdown
Here's some inline `code` example.

```javascript
// Code block example
const greeting = "Hello World";
console.log(greeting);
```
```

### 2. Advanced Code Blocks (Dynamic Zone)
For more complex code snippets with advanced features, use the `blocks` dynamic zone with the "Code Block" component:

**Features:**
- Syntax highlighting for 20+ languages
- Optional filename display
- Line numbers toggle
- Better formatting control

**Supported Languages:**
- javascript, typescript, jsx, tsx
- html, css, json, markdown
- python, java, php, go, rust
- c, cpp, csharp
- bash, sql, yaml, xml

## Content Strategy

### Option 1: Rich Text Only (Recommended for most articles)
Use the `content` field for the main article body. This supports:
- Formatted text
- Headers, lists, links
- Inline code and code blocks
- Images
- Basic formatting

### Option 2: Rich Text + Dynamic Blocks (For complex articles)
Use `content` for the main text and `blocks` for:
- Complex code examples
- Interactive content
- Mixed media sections
- Quotes with special formatting

## Frontend Integration

Your frontend expects this Article interface:
```typescript
interface Article {
  id: number;
  author: string;
  authorImage: { url: string };
  title: string;
  description: string;
  content: string;
  slug: string;
  image: { url: string };
  publishedAt: string;
  category: string;
}
```

### API Response Mapping
When fetching from Strapi, you'll need to:

1. **Media Fields**: Transform Strapi media objects
   ```javascript
   // Strapi response
   image: { data: { attributes: { url: "/uploads/image.jpg" } } }
   
   // Frontend expectation
   image: { url: "/uploads/image.jpg" }
   ```

2. **Author Image**: Map from media field
   ```javascript
   authorImage: { 
     url: article.authorImage?.data?.attributes?.url || "/default-avatar.png" 
   }
   ```

3. **Content**: Use rich text content as HTML
   ```javascript
   content: article.content // Already HTML from rich text
   ```

4. **Blocks** (if using dynamic zones): Process and inject into content
   ```javascript
   // Process code blocks and append to content or handle separately
   const processedContent = combineContentAndBlocks(article.content, article.blocks);
   ```

## Best Practices

1. **Keep it Simple**: Use rich text content for most articles
2. **Code Syntax**: Use proper markdown syntax for code blocks
3. **Language Tags**: Always specify language for syntax highlighting
4. **File Names**: Include filenames for code blocks when relevant
5. **Author Consistency**: Use "Daniel Alvarez" as default author name
6. **Categories**: Keep categories consistent (Frontend, Backend, CSS, etc.)

## Example Article Structure

```json
{
  "title": "React Hooks Tutorial",
  "description": "Learn React Hooks with practical examples",
  "content": "<p>React Hooks revolutionized functional components...</p><pre><code class=\"language-javascript\">const [count, setCount] = useState(0);</code></pre>",
  "slug": "react-hooks-tutorial",
  "author": "Daniel Alvarez",
  "category": "Frontend",
  "image": { "url": "/uploads/react-hooks.jpg" },
  "authorImage": { "url": "/uploads/daniel-avatar.jpg" },
  "blocks": [] // Optional, use only for complex content
}
```
