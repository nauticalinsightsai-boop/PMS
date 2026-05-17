import * as React from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Mail, ArrowRight, TrendingUp } from "lucide-react";
import { 
  CategoryChip, 
  ArticleCard, 
  FeaturedPost, 
  CTABanner 
} from "../components/NewsletterComponents";

const categories = [
  "All", "PMP", "CAPM", "Agile", "Risk", "Business Analysis", 
  "PRINCE2", "PMO", "Six Sigma", "Career Growth", "Exam Strategies"
];

const articles = [
  {
    title: "The 2026 PMP® Exam: What's Really Changing?",
    excerpt: "A deep dive into the new Exam Content Outline (ECO) and how it impacts your study strategy for the coming year.",
    category: "Exam Strategies",
    date: "Oct 12, 2025",
    author: "Dr. Robert Chen",
    readTime: "8 min read",
    image: "https://picsum.photos/seed/pmp/800/600"
  },
  {
    title: "Mastering Hybrid Methodologies in Enterprise Projects",
    excerpt: "Why the 'Waterfall vs Agile' debate is dead, and how the most successful PMOs are blending both for maximum efficiency.",
    category: "Agile",
    date: "Oct 10, 2025",
    author: "Sarah Jenkins",
    readTime: "12 min read",
    image: "https://picsum.photos/seed/agile/800/600"
  },
  {
    title: "Risk Management: Beyond the Probability Matrix",
    excerpt: "Advanced techniques for identifying 'Black Swan' events in complex infrastructure projects.",
    category: "Risk",
    date: "Oct 08, 2025",
    author: "Marcus Thorne",
    readTime: "10 min read",
    image: "https://picsum.photos/seed/risk/800/600"
  },
  {
    title: "The Rise of the AI-Augmented Project Manager",
    excerpt: "How generative AI is transforming risk assessment, resource allocation, and stakeholder communication.",
    category: "Career Growth",
    date: "Oct 05, 2025",
    author: "Elena Rodriguez",
    readTime: "15 min read",
    image: "https://picsum.photos/seed/ai/800/600"
  },
  {
    title: "PRINCE2® 7th Edition: A Practitioner's Perspective",
    excerpt: "Key takeaways from the latest update to the world's most popular project management methodology.",
    category: "PRINCE2",
    date: "Oct 02, 2025",
    author: "James Wilson",
    readTime: "7 min read",
    image: "https://picsum.photos/seed/prince/800/600"
  },
  {
    title: "Building a High-Performance PMO from Scratch",
    excerpt: "A step-by-step guide to establishing governance, standards, and value delivery in a growing organization.",
    category: "PMO",
    date: "Sep 28, 2025",
    author: "Linda Wu",
    readTime: "20 min read",
    image: "https://picsum.photos/seed/pmo/800/600"
  }
];

export function Newsletter() {
  const [activeCategory, setActiveCategory] = React.useState("All");

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* 1. Newsletter Hero / Title Section */}
      <section className="pt-20 pb-12 border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4 border-brand-purple/20 text-brand-purple bg-brand-purple/5 px-4 py-1 font-bold">
                Editorial & Insights
              </Badge>
              <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                The <span className="text-brand-purple">Structure</span> Report
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Expert analysis, certification strategies, and the latest trends in global project leadership. Delivered weekly to 5,000+ professionals.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-brand-purple transition-colors" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-12 h-14 w-full md:w-[350px] rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-brand-purple"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Topics / Categories Grid */}
      <section className="py-8 bg-slate-50/50 dark:bg-slate-900/20 sticky top-16 z-40 backdrop-blur-md border-b border-slate-100 dark:border-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest shrink-0 mr-2">Topics:</span>
            {categories.map((cat) => (
              <CategoryChip 
                key={cat} 
                label={cat} 
                active={activeCategory === cat} 
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* 2. Featured Article */}
        <FeaturedPost article={articles[3]} />

        <Separator className="my-12 opacity-50" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content: Latest Posts */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-heading text-3xl font-bold">Latest Insights</h2>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <span>Sort by:</span>
                <select className="bg-transparent border-none focus:ring-0 cursor-pointer font-bold text-slate-900 dark:text-white">
                  <option>Newest First</option>
                  <option>Most Read</option>
                  <option>Long Reads</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {articles.map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))}
            </div>

            <div className="mt-16 flex justify-center">
              <Button variant="outline" size="lg" className="h-14 px-12 rounded-2xl border-slate-200 dark:border-slate-800 font-bold group">
                Load More Articles <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Sidebar: Popular & Editor Picks */}
          <aside className="lg:col-span-4 space-y-16">
            {/* 4. Popular Posts */}
            <div>
              <div className="flex items-center gap-2 mb-8">
                <TrendingUp className="h-6 w-6 text-brand-orange" />
                <h3 className="font-heading text-2xl font-bold">Popular Now</h3>
              </div>
              <div className="space-y-8">
                {articles.slice(0, 4).map((article, index) => (
                  <div key={index} className="flex gap-4 group cursor-pointer">
                    <span className="text-4xl font-heading font-black text-slate-100 dark:text-slate-800 group-hover:text-brand-orange/20 transition-colors">
                      0{index + 1}
                    </span>
                    <div>
                      <Badge variant="link" className="p-0 h-auto text-brand-purple text-[10px] uppercase tracking-widest font-bold mb-1">
                        {article.category}
                      </Badge>
                      <h4 className="font-bold leading-tight group-hover:text-brand-purple transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2">{article.readTime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Editor Picks */}
            <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h3 className="font-heading text-2xl font-bold mb-8">Editor's Picks</h3>
              <div className="space-y-8">
                {articles.slice(4, 6).map((article, index) => (
                  <ArticleCard key={index} article={article} variant="horizontal" />
                ))}
              </div>
              <Button className="w-full mt-8 bg-brand-purple hover:bg-brand-purple/90">
                View All Picks
              </Button>
            </div>

            {/* Newsletter Mini CTA */}
            <div className="p-8 rounded-[2rem] bg-brand-orange text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl pointer-events-none" />
              <Mail className="h-10 w-10 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Never miss an update</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Get the latest PM insights and certification strategies delivered to your inbox every Tuesday.
              </p>
              <div className="space-y-3">
                <Input placeholder="Your email address" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                <Button className="w-full bg-white text-brand-orange hover:bg-slate-100 font-bold">Subscribe</Button>
              </div>
            </div>
          </aside>
        </div>

        {/* 7. Join Newsletter CTA (Large) */}
        <CTABanner 
          title="Stay Ahead of the Curve" 
          description="Join 5,000+ project professionals receiving our weekly deep-dives into methodology, leadership, and career growth."
          buttonText="Join the Newsletter"
          variant="purple"
        />

        {/* 8. Membership CTA */}
        <CTABanner 
          title="Unlock Premium Insights" 
          description="Members get exclusive access to our full archive of case studies, exam simulators, and expert-led webinars."
          buttonText="Explore Membership"
          variant="dark"
        />
      </div>
    </div>
  );
}
