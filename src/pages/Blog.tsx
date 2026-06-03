import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Search, 
  Filter,
  ArrowRight,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { blogPosts, getCategories, getTags } from '../data/blogPosts';
import SeoHead from '../components/SeoHead';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  
  const categories = ['All', ...getCategories()];
  const tags = ['All', ...getTags()];
  
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedTag]);
  
  const featuredPost = blogPosts[0];
  const regularPosts = filteredPosts.filter(post => post.id !== featuredPost?.id);
  
  return (
    <div className="overflow-x-hidden">
      <SeoHead
        title="Blog - Career Tips, Interview Advice & Job Search Strategies"
        description="Expert career advice, interview tips, resume writing guides, and job search strategies. Stay updated with the latest trends in career development and job hunting."
        keywords="career blog, interview tips, job search advice, resume writing, career development, job interview preparation"
        ogImage="https://lumintoolkit.com/og-blog.png"
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-canvas-soft py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-sm text-xs font-normal uppercase tracking-wider mb-6">
              <BookOpen size={14} />
              Career Blog
            </div>
            <h1 className="text-4xl md:text-6xl font-normal text-ink mb-6 tracking-tight">
              Expert Career Advice & Insights
            </h1>
            <p className="text-lg md:text-xl text-body-mid mb-8 max-w-2xl mx-auto">
              Master your job search with proven strategies, interview tips, and career development insights from industry experts.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-body-mid" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-canvas border border-hairline rounded-sm text-ink placeholder:text-body-mid focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 flex flex-wrap gap-4 items-center justify-between"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-sm text-xs font-normal uppercase tracking-wider transition-all",
                  selectedCategory === category
                    ? "bg-white text-black"
                    : "bg-canvas text-body-mid hover:bg-canvas-soft"
                )}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Tag Filter */}
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-body-mid" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 bg-canvas border border-hairline rounded-sm text-xs font-normal uppercase tracking-wider text-body-mid focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </motion.div>
        
        {/* Featured Post */}
        {featuredPost && !searchQuery && selectedCategory === 'All' && selectedTag === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="relative bg-canvas-card border-2 border-white rounded-sm overflow-hidden group">
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded-sm text-xs font-normal uppercase tracking-wider">
                  <TrendingUp size={12} />
                  Featured
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 text-xs font-normal text-body-mid uppercase tracking-wider">
                    <span className="px-3 py-1 bg-white/10 text-white rounded-sm">{featuredPost.category}</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-normal text-ink mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-body-mid mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-body-mid" />
                      <span className="text-sm font-normal text-body-mid">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-body-mid" />
                      <span className="text-sm font-normal text-body-mid">{featuredPost.readingTime} min read</span>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-black rounded-sm text-sm font-normal uppercase tracking-wider transition-all group-hover:scale-105"
                  >
                    Read Article
                    <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="relative bg-canvas-soft rounded-sm flex items-center justify-center min-h-[300px]">
                  <BookOpen size={120} className="text-white/30" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-normal text-ink mb-8 flex items-center gap-3">
            <Filter size={24} className="text-white" />
            {searchQuery || selectedCategory !== 'All' || selectedTag !== 'All' 
              ? `Search Results (${filteredPosts.length})` 
              : 'Latest Articles'}
          </h2>
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={64} className="text-body-mid mx-auto mb-4" />
              <h3 className="text-xl font-normal text-ink mb-2">No articles found</h3>
              <p className="text-body-mid">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block h-full bg-canvas-card border border-hairline rounded-sm overflow-hidden hover:border-white/30 transition-all group"
                  >
                    <div className="relative bg-canvas-soft h-48 flex items-center justify-center">
                      <BookOpen size={64} className="text-white/30 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-white/10 text-white rounded-sm text-[10px] font-normal uppercase tracking-wider">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-normal text-body-mid">
                          <Clock size={10} />
                          {post.readingTime} min
                        </div>
                      </div>
                      <h3 className="text-lg font-normal text-ink mb-2 line-clamp-2 group-hover:text-white transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-body-mid mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs font-normal text-body-mid">
                          <Calendar size={12} />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Popular Tags */}
        {searchQuery === '' && selectedCategory === 'All' && selectedTag === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 p-8 bg-canvas-card border border-hairline rounded-sm"
          >
            <h3 className="text-lg font-normal text-ink mb-6 flex items-center gap-2">
              <Tag size={20} className="text-white" />
              Popular Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.filter(tag => tag !== 'All').slice(0, 10).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className="px-4 py-2 bg-canvas-soft rounded-sm text-xs font-normal text-body-mid hover:bg-canvas hover:text-white transition-all"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
