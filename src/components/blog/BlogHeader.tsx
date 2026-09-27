'use client'

import Link from 'next/link'

export default function BlogHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200">
              Quick Share
            </Link>
          </div>
          
          <nav className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              href="/blog" 
              className="text-gray-900 font-medium"
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export function BlogTitle() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Blog
      </h1>
      <p className="text-xl text-gray-600 leading-relaxed">
        Insights on file sharing, security, and technology
      </p>
    </div>
  )
}