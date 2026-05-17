'use client';
import * as React from "react";
import { motion } from "motion/react";
import { ArrowRight, Calendar, User, Bookmark, Share2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Article {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
}

interface CategoryChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
        active 
          ? "bg-brand-purple text-white border-brand-purple shadow-md" 
          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-brand-purple hover:text-brand-purple"
      )}
    >
      {label}
    </button>
  );
};

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = "default" }) => {
  if (variant === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex gap-6 group cursor-pointer"
      >
        <div className="w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shrink-0">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col justify-center">
          <Badge variant="outline" className="w-fit mb-2 border-brand-purple/20 text-brand-purple bg-brand-purple/5">
            {article.category}
          </Badge>
          <h3 className="text-xl font-bold font-heading leading-tight group-hover:text-brand-purple transition-colors mb-2">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {article.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="h-full border-none shadow-none bg-transparent overflow-hidden">
        <div className="aspect-video rounded-3xl overflow-hidden mb-6">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <CardHeader className="p-0 space-y-3">
          <div className="flex items-center justify-between">
            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none hover:bg-brand-purple hover:text-white transition-colors">
              {article.category}
            </Badge>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold font-heading leading-tight group-hover:text-brand-purple transition-colors">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          <p className="text-muted-foreground line-clamp-2 leading-relaxed mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-200" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{article.date}</span>
              <span>{article.readTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const FeaturedPost: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <section className="py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <img 
              src={article.image} 
              alt={article.title} 
              className="object-cover w-full h-full"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-8 left-8">
              <Badge className="bg-brand-purple text-white border-none px-6 py-1.5 text-sm font-bold shadow-lg">Featured Story</Badge>
            </div>
          </motion.div>
        </div>
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5 text-brand-orange"><Calendar className="h-4 w-4" /> {article.date}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.readTime}</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.1]">
            {article.title}
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${article.author}`} alt={article.author} />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{article.author}</div>
                <div className="text-xs text-muted-foreground">Senior Editor</div>
              </div>
            </div>
            <Button variant="link" className="text-brand-purple font-bold text-lg group p-0">
              Read Full Story <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CTABanner: React.FC<{ title: string; description: string; buttonText: string; variant?: "purple" | "orange" | "dark" }> = ({ title, description, buttonText, variant = "purple" }) => {
  const variants = {
    purple: "from-brand-purple to-indigo-600",
    orange: "from-brand-orange to-amber-500",
    dark: "from-slate-900 to-slate-800"
  };

  return (
    <section className="py-12">
      <div className={cn("rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden bg-gradient-to-br", variants[variant])}>
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h3 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">{title}</h3>
          <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed">
            {description}
          </p>
          <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-10 text-lg font-bold rounded-2xl shadow-xl">
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
};
