# Strapi Backend Setup Guide

## Updated Schema Structure

Your Strapi backend now has the following collection types with proper relations:

### 1. Author Collection Type
- **name** (string, required) - Author name
- **avatar** (media, images only) - Author profile image
- **email** (string) - Author email
- **articles** (relation) - One-to-many relation with articles

### 2. Category Collection Type
- **name** (string) - Category name
- **slug** (uid) - URL-friendly identifier
- **description** (text) - Category description
- **image** (media, images only) - Category image
- **color** (string) - Hex color code (e.g., #FF6B6B)
- **articles** (relation) - One-to-many relation with articles

### 3. Article Collection Type
- **title** (string, required) - Article title
- **description** (text, required) - Article summary
- **content** (richtext, required) - Main article content
- **slug** (uid, required) - Auto-generated from title
- **image** (media, images only) - Article featured image
- **author** (relation, dropdown) - Select from existing authors
- **category** (relation, dropdown) - Select from existing categories
- **blocks** (dynamic zone, optional) - Rich content blocks

## Initial Setup Steps

### Step 1: Create Your Author Profile
1. Go to **Content Manager** → **Author**
2. Click **Create new entry**
3. Fill in:
   - **Name**: "Daniel Alvarez"
   - **Email**: your email
   - **Avatar**: Upload your profile image
4. **Save & Publish**

### Step 2: Create Categories
Create categories for your blog. Examples:

**Frontend Category:**
- **Name**: "Frontend"
- **Slug**: "frontend" (auto-generated)
- **Description**: "Frontend development tutorials and tips"
- **Image**: Upload a relevant icon/image
- **Color**: "#61DAFB" (React blue)

**Backend Category:**
- **Name**: "Backend"
- **Slug**: "backend"
- **Description**: "Backend development and server-side programming" 
- **Image**: Upload a relevant icon/image
- **Color**: "#68D391" (Green)

**CSS Category:**
- **Name**: "CSS"
- **Slug**: "css"
- **Description**: "CSS styling and design techniques"
- **Image**: Upload a relevant icon/image
- **Color**: "#3182CE" (CSS blue)

**Management Category:**
- **Name**: "Management"
- **Slug**: "management"
- **Description**: "Project management and development methodologies"
- **Image**: Upload a relevant icon/image
- **Color**: "#805AD5" (Purple)

### Step 3: Create Articles
1. Go to **Content Manager** → **Article**
2. Click **Create new entry**
3. Fill in the fields:
   - **Title**: Your article title
   - **Description**: Brief summary
   - **Content**: Main article content (supports rich text and code blocks)
   - **Image**: Featured image
   - **Author**: Select "Daniel Alvarez" from dropdown
   - **Category**: Select appropriate category from dropdown
   - **Blocks**: (Optional) Add code blocks or other rich content
4. **Save & Publish**

## How Dropdowns Work

### Author Dropdown
- When creating/editing an article, you'll see a dropdown with all available authors
- Select "Daniel Alvarez" (or whichever author you want)
- The author's avatar will automatically be used as the article's author image

### Category Dropdown  
- When creating/editing an article, you'll see a dropdown with all available categories
- Select the appropriate category
- The category's color and other properties are automatically linked

## Frontend Integration

### Updated Article Interface
Your frontend will now receive articles in this format:
```typescript
interface Article {
  id: number;
  title: string;
  description: string;
  content: string; // HTML from rich text
  slug: string;
  author: string; // Author name (e.g., "Daniel Alvarez")
  authorImage: { url: string }; // From author's avatar
  category: string; // Category name (e.g., "Frontend")
  image: { url: string }; // Article featured image
  publishedAt: string;
}
```

### API Endpoints
```bash
# Get all articles with relations
GET /api/articles?populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*

# Get single article by slug
GET /api/articles?filters[slug][$eq]=your-slug&populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*

# Get articles by category
GET /api/articles?filters[category][name][$eq]=Frontend&populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*
```

## Code in Articles

### Option 1: Rich Text Content (Recommended)
Use markdown syntax directly in the content field:
```markdown
Here's some inline `code` and a code block:

```javascript
const greeting = "Hello World";
console.log(greeting);
```
```

### Option 2: Dynamic Zone Code Blocks
Add code blocks through the "Blocks" section for advanced features:
- Syntax highlighting
- Filename display
- Line numbers
- 20+ supported languages

## Best Practices

1. **Always use relations** - Don't type author/category names directly
2. **Consistent naming** - Use the same author name across articles
3. **Category colors** - Use meaningful hex colors for frontend theming
4. **Image optimization** - Upload appropriate sized images
5. **Content strategy** - Use rich text for most content, blocks for complex layouts

## Migration from Old Structure

If you have existing articles with string-based authors/categories:
1. Create the author and category entries first
2. Edit each article to select the proper relations
3. Remove any hardcoded author/category strings

## Testing

After setup, test your API endpoints:
```bash
# Test article fetch
curl "http://localhost:1337/api/articles?populate[author][populate][avatar]=*&populate[category]=*&populate[image]=*"

# Verify author relation
curl "http://localhost:1337/api/authors?populate[avatar]=*"

# Verify category relation  
curl "http://localhost:1337/api/categories?populate[image]=*"
```

The API responses should now include properly nested relation data that transforms correctly with your frontend helper functions.
