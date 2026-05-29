'use client';
import * as React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Star, 
  Search, 
  Download, 
  BookOpen, 
  FileText, 
  Layout, 
  Package,
  Check,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { usePublishedSiteDocument } from "@/lib/usePublishedSiteDocument";
import { FIELD_KEYS, defaultStoreCatalog, parseStoreCatalog } from "@pms/site-content";

const categoryIcons: Record<string, typeof Package> = {
  'All Resources': Package,
  'Mock Exams': BookOpen,
  Templates: FileText,
  Planners: Layout,
  Bundles: Package,
  'Study Packs': BookOpen,
};

/** Store sections used on /community (Resource Store tab) and legacy /store redirect target */
export function StoreContent() {
  const fallback = defaultStoreCatalog();
  const { data: catalog } = usePublishedSiteDocument(FIELD_KEYS.STORE_CATALOG, {
    parse: (raw) => (raw ? parseStoreCatalog(raw) : null),
  });
  const products = (catalog?.products ?? fallback.products)
    .filter((p) => p.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => ({
      title: p.title,
      price: p.displayPrice,
      category: catalog?.categories.find((c) => c.id === p.categoryId)?.name ?? p.categoryId,
      rating: p.rating ?? 4.5,
      reviews: p.reviewCount ?? 0,
      image: p.image?.url ?? p.imageUrl ?? 'https://picsum.photos/seed/product/400/500',
      description: p.description,
      badge: p.badge ?? '',
    }));
  const categories = [
    { name: 'All Resources', icon: Package },
    ...(catalog?.categories ?? fallback.categories)
      .filter((c) => c.id !== 'all')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((c) => ({ name: c.name, icon: categoryIcons[c.name] ?? Package })),
  ];

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("All Resources");

  const filteredProducts = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All Resources" || product.category === activeCategory;
      const matchesSearch =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <>
      {/* Category filter + search */}
      <section className="py-6 bg-white/80 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto pb-2 no-scrollbar lg:pb-0">
              {categories.map((cat) => (
                <Button
                  key={cat.name}
                  type="button"
                  variant={activeCategory === cat.name ? 'secondary' : 'ghost'}
                  onClick={() => setActiveCategory(cat.name)}
                  className={cn(
                    'h-10 shrink-0 whitespace-nowrap rounded-xl px-6 text-sm font-bold transition-all',
                    activeCategory === cat.name
                      ? 'bg-brand-orange/10 text-brand-orange'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900',
                  )}
                >
                  <cat.icon className="mr-2 h-4 w-4 text-brand-orange" />
                  {cat.name}
                </Button>
              ))}
            </div>
            <form
              className="flex w-full shrink-0 gap-2 sm:max-w-sm lg:ml-4 lg:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-xl border-slate-100 bg-white pl-10 text-sm font-medium shadow-sm focus:ring-brand-orange dark:border-slate-800 dark:bg-slate-900"
                />
              </div>
              <Button
                type="submit"
                variant="brand"
                className="h-10 shrink-0 rounded-xl px-5 text-sm font-bold"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className={sectionSurface('soft', 'py-20')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 font-medium py-16">
              No resources match your search. Try another category or clear the search.
            </p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full flex flex-col group overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] bg-white dark:bg-slate-900">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-50 dark:bg-slate-800 relative">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="object-cover w-full h-full"
                      referrerPolicy="no-referrer"
                    />
                    {product.badge && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-brand-orange text-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                          {product.badge}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-brand-purple uppercase tracking-[0.2em]">{product.category}</span>
                      <div className="flex items-center gap-1.5 text-yellow-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{product.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold leading-tight tracking-tight dark:text-white mb-3">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-6 mt-auto">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{product.price}</div>
                  </CardContent>
                  <CardFooter className="px-8 pb-8 pt-0">
                    <Button
                      type="button"
                      disabled
                      aria-disabled="true"
                      variant="outline"
                      className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add to Cart (soon)
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Downloadable Resources Section */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[160px] -mr-48 -mt-48 opacity-20" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
                Instant Access <span className="text-brand-orange">Digital Downloads</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-medium">
                All our resources are available for immediate download upon purchase. 
                Start your preparation in seconds with our high-quality digital assets.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  "Lifetime Updates",
                  "Mobile Friendly",
                  "Print-Ready PDFs",
                  "Editable Templates"
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-slate-300 text-base font-semibold">
                    <div className="bg-brand-orange/20 rounded-full p-1">
                      <Check className="h-4 w-4 text-brand-orange" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-brand-orange hover:bg-brand-hover text-white h-14 px-10 rounded-2xl font-bold text-lg shadow-xl transition-all">
                Browse All Downloads <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-sm shadow-2xl">
              <div className="space-y-6">
                {[
                  { title: "Project Charter Template", desc: "Professional Word & PDF formats", icon: FileText, color: "text-brand-purple", bg: "bg-brand-purple/10" },
                  { title: "Agile Sprint Planner", desc: "Excel & Google Sheets compatible", icon: Layout, color: "text-brand-orange", bg: "bg-brand-orange/10" },
                  { title: "PMP Formula Cheat Sheet", desc: "High-resolution printable PDF", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className={cn("p-4 rounded-xl shrink-0 transition-transform group-hover:scale-110", item.bg, item.color)}>
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg tracking-tight">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium mt-0.5">{item.desc}</p>
                    </div>
                    <Download className="h-6 w-6 text-slate-600 group-hover:text-white transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** @deprecated Use Community page with Resource Store tab; /store redirects to /community */
export function Store() {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreContent />
    </div>
  );
}
