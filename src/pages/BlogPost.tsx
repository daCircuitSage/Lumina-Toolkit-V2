import React from 'react';
import { motion } from 'motion/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ArrowLeft,
  Share2,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { getBlogPostBySlug, blogPosts } from '../data/blogPosts';
import SeoHead from '../components/SeoHead';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = getBlogPostBySlug(slug || '');
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={64} className="text-body-mid mx-auto mb-4" />
          <h1 className="text-2xl font-normal text-ink mb-2">Article not found</h1>
          <Link to="/blog" className="text-ink hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }
  
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag))))
    .slice(0, 3);
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.seoTitle || post.title,
    "description": post.seoDescription || post.excerpt,
    "image": "https://lumintoolkit.com/og-blog.png",
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Lumina Toolkit",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lumintoolkit.com/logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://lumintoolkit.com/blog/${post.slug}`
    },
    "keywords": post.keywords?.join(', ') || post.tags.join(', '),
    "articleSection": post.category,
    "wordCount": post.content.split(/\s+/).length,
    "timeRequired": `PT${post.readingTime}M`
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <div className="min-h-screen">
      <SeoHead
        title={post.seoTitle || post.title}
        description={post.seoDescription || post.excerpt}
        keywords={post.keywords?.join(', ') || post.tags.join(', ')}
        ogImage="https://lumintoolkit.com/og-blog.png"
        structuredData={structuredData}
      />
      
      {/* Article Header */}
      <article className="relative overflow-hidden">
        <div className="absolute inset-0 bg-canvas-soft pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-body-mid hover:text-ink mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-normal">Back to Blog</span>
          </motion.button>
          
          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-white/10 text-ink rounded-sm text-xs font-normal uppercase tracking-wider">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-sm font-normal text-body-mid">
                <Calendar size={16} />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-2 text-sm font-normal text-body-mid">
                <Clock size={16} />
                {post.readingTime} min read
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-normal text-ink mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg text-body-mid mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between pt-6 border-t border-hairline">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-normal text-ink">{post.author}</div>
                  <div className="text-xs text-body-mid">Author</div>
                </div>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-canvas border border-hairline rounded-sm text-sm font-normal text-body-mid hover:bg-canvas-soft hover:text-white transition-all"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </motion.div>
          
          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-canvas-card border border-hairline rounded-sm p-8 md:p-12"
          >
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({children}) => <h1 className="text-3xl font-normal text-ink mb-6 mt-8 first:mt-0">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl font-normal text-ink mb-4 mt-8">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-normal text-ink mb-3 mt-6">{children}</h3>,
                  h4: ({children}) => <h4 className="text-lg font-normal text-ink mb-2 mt-4">{children}</h4>,
                  p: ({children}) => <p className="text-body-mid leading-relaxed mb-4">{children}</p>,
                  ul: ({children}) => <ul className="list-disc list-inside space-y-2 mb-4 text-body-mid">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-body-mid">{children}</ol>,
                  li: ({children}) => <li className="flex items-start gap-2"><CheckCircle2 size={16} className="text-white shrink-0 mt-1" /><span>{children}</span></li>,
                  strong: ({children}) => <strong className="font-normal text-ink">{children}</strong>,
                  em: ({children}) => <em className="italic text-body-mid">{children}</em>,
                  code: ({children}) => <code className="bg-canvas-soft px-2 py-1 rounded-sm text-sm font-mono text-white">{children}</code>,
                  a: ({children, href}) => <a href={href} className="text-white hover:underline">{children}</a>,
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-white pl-4 py-2 my-6 bg-white/5 rounded-sm">
                      <p className="text-body-mid italic">{children}</p>
                    </blockquote>
                  )
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </motion.div>
          
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {post.tags.map(tag => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                className="flex items-center gap-2 px-4 py-2 bg-canvas border border-hairline rounded-sm text-xs font-normal text-body-mid hover:bg-canvas-soft hover:text-white transition-all"
              >
                <Tag size={12} />
                {tag}
              </Link>
            ))}
          </motion.div>
        </div>
      </article>
      
      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-normal text-ink mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={`/blog/${relatedPost.slug}`}
                    className="block h-full bg-canvas-card border border-hairline rounded-sm overflow-hidden hover:border-white/30 transition-all group"
                  >
                    <div className="relative bg-canvas-soft h-32 flex items-center justify-center">
                      <BookOpen size={48} className="text-white/30 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-4">
                      <span className="px-2 py-1 bg-white/10 text-white rounded-sm text-[10px] font-normal uppercase tracking-wider mb-2 inline-block">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-sm font-normal text-ink mb-2 line-clamp-2 group-hover:text-white transition-colors">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] font-normal text-body-mid">
                        <Clock size={10} />
                        {relatedPost.readingTime} min read
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/10 border border-hairline rounded-sm p-8 text-center"
        >
          <h2 className="text-2xl font-normal text-ink mb-4">Ready to Ace Your Next Interview?</h2>
          <p className="text-body-mid mb-6">Use our AI-powered tools to prepare smarter and land your dream job.</p>
          <Link
            to="/interview-prep"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-sm text-sm font-normal uppercase tracking-wider transition-all"
          >
            Start Practicing
            <ArrowLeft size={16} className="rotate-180" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
