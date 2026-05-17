import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  Calendar, 
  Tag, 
  MoreVertical,
  CheckCircle2,
  Clock,
  Layout
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { CTAButton } from '../../components/ui/CTAButton';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  status: 'published' | 'draft' | 'scheduled';
  author: string;
  date: string;
  category: string;
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Certification Strategies for 2024',
    excerpt: 'Master the art of project management certifications with these proven tactics...',
    status: 'published',
    author: 'Abdullah',
    date: '2024-03-10',
    category: 'Strategy'
  },
  {
    id: '2',
    title: 'Understanding the New PMP Exam Format',
    excerpt: 'The PMP exam has undergone significant changes in 2024. Here is what you need to know...',
    status: 'draft',
    author: 'Abdullah',
    date: '2024-03-12',
    category: 'Certification'
  },
  {
    id: '3',
    title: 'Agile vs Waterfall: Which Path for You?',
    excerpt: 'Choosing the right methodology is crucial for your career growth...',
    status: 'scheduled',
    author: 'Abdullah',
    date: '2024-03-15',
    category: 'Career'
  }
];

export const BlogEditor: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_POSTS);
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    published: 'text-green-500 bg-green-500/10',
    draft: 'text-gw-text-secondary bg-white/5',
    scheduled: 'text-blue-500 bg-blue-500/10'
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Blogs & Insights</h1>
          <p className="text-gw-text-secondary font-medium uppercase tracking-widest text-[10px] flex items-center gap-2">
            <FileText size={12} className="text-gw-accent-primary" /> Content Management System
          </p>
        </div>
        <CTAButton size="sm" variant="primary">
          <Plus size={16} className="mr-2" /> NEW ARTICLE
        </CTAButton>
      </header>

      {/* Filter Bar */}
      <GlassCard className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gw-text-secondary group-focus-within:text-gw-accent-primary transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search articles, categories, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gw-accent-primary transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-bold uppercase tracking-widest outline-none">
            <option>All Status</option>
            <option>Published</option>
            <option>Drafts</option>
            <option>Scheduled</option>
          </select>
          <select className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs font-bold uppercase tracking-widest outline-none">
            <option>Latest First</option>
            <option>Oldest First</option>
            <option>A-Z</option>
          </select>
        </div>
      </GlassCard>

      {/* Posts List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard variant="surface" className="p-6 hover:border-white/20 transition-all group">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-full md:w-32 aspect-video bg-white/5 rounded-xl flex items-center justify-center overflow-hidden relative">
                   <Layout size={24} className="text-gw-text-secondary opacity-30 group-hover:scale-110 transition-transform" />
                   <div className="absolute top-2 left-2">
                     <span className={cn(
                       "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                       statusColors[post.status]
                     )}>
                       {post.status}
                     </span>
                   </div>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gw-accent-primary">
                    <Tag size={10} />
                    {post.category}
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-gw-accent-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-gw-text-secondary line-clamp-1">{post.excerpt}</p>
                  
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2 text-[10px] text-gw-text-secondary font-bold uppercase tracking-widest">
                       <Calendar size={12} />
                       {post.date}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gw-text-secondary font-bold uppercase tracking-widest">
                       <Plus size={12} className="rotate-45" />
                       By {post.author}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <button className="flex-1 md:flex-none p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gw-text-secondary transition-colors" title="Preview">
                    <Eye size={18} />
                  </button>
                  <button className="flex-1 md:flex-none p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gw-accent-primary transition-colors" title="Edit">
                    <Edit3 size={18} />
                  </button>
                  <button className="flex-1 md:flex-none p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-red-500 transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-gw-text-secondary">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 text-gw-text-secondary mb-6">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">No articles found</h3>
          <p className="text-gw-text-secondary max-w-xs mx-auto text-sm">
            Try adjusting your search filters or create a new blog post.
          </p>
        </div>
      )}
    </div>
  );
};
