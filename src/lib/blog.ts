import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readTime: number
  tags?: string[]
  author?: string
}

export interface BlogPostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  readTime: number
  tags?: string[]
  author?: string
}

// Calculate reading time (average 200 words per minute)
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Get all blog posts metadata
export function getAllPosts(): BlogPostMeta[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        return {
          slug,
          title: matterResult.data.title || 'Untitled',
          date: matterResult.data.date || new Date().toISOString(),
          excerpt: matterResult.data.excerpt || matterResult.content.slice(0, 150) + '...',
          readTime: calculateReadTime(matterResult.content),
          tags: matterResult.data.tags || [],
          author: matterResult.data.author || 'Quick Share Team'
        }
      })

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error('Error reading blog posts:', error)
    return []
  }
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    // Remove the first H1 if it matches the title to avoid duplication
    let content = matterResult.content
    const title = matterResult.data.title || 'Untitled'
    const firstH1Regex = new RegExp(`^#\\s+${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm')
    content = content.replace(firstH1Regex, '')

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html)
      .process(content)
    const contentHtml = processedContent.toString()

    return {
      slug,
      title: matterResult.data.title || 'Untitled',
      date: matterResult.data.date || new Date().toISOString(),
      excerpt: matterResult.data.excerpt || matterResult.content.slice(0, 150) + '...',
      content: contentHtml,
      readTime: calculateReadTime(matterResult.content),
      tags: matterResult.data.tags || [],
      author: matterResult.data.author || 'Quick Share Team'
    }
  } catch (error) {
    console.error('Error reading blog post:', error)
    return null
  }
}

// Get all unique tags
export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = posts.flatMap(post => post.tags || [])
  return Array.from(new Set(tags)).sort()
}