'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { BlogPostMeta } from '@/src/lib/blog'

interface BlogListProps {
  posts: BlogPostMeta[]
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-medium text-gray-900 mb-4">No posts yet</h2>
        <p className="text-gray-600">Check back soon for new content!</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-12">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="space-y-3">
                <h2 className="text-2xl font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200 leading-tight">
                  {post.title}
                </h2>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <time dateTime={post.date}>
                    {format(new Date(post.date), 'MMM d, yyyy')}
                  </time>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                  {post.author && (
                    <>
                      <span>•</span>
                      <span>{post.author}</span>
                    </>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed text-lg">
                  {post.excerpt}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}