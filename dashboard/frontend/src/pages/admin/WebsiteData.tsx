import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Save, 
  Send, 
  History, 
  Eye, 
  Settings2, 
  Home, 
  Info, 
  Users, 
  Mail, 
  Layout, 
  FileText,
  ChevronRight,
  Monitor,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { CTAButton } from '../../components/ui/CTAButton';
import { SyncStatusIndicator, SyncStatus } from '../../components/shared/SyncStatusIndicator';
import { WebsiteDataService } from '../../services/WebsiteDataService';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

type PageKey = 'home' | 'about' | 'membership' | 'community' | 'contact' | 'faq';

interface Section {
  id: string;
  label: string;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image';
  }[];
}

const PAGE_CONFIGS: Record<PageKey, { label: string; icon: any; sections: Section[] }> = {
  home: {
    label: 'Home Page',
    icon: Home,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'hero_badge', label: 'Hero Badge', type: 'text' },
          { key: 'hero_title', label: 'Main Title', type: 'text' },
          { key: 'hero_subtitle', label: 'Subtitle', type: 'textarea' },
          { key: 'cta_primary', label: 'Primary CTA Text', type: 'text' },
          { key: 'cta_secondary', label: 'Secondary CTA Text', type: 'text' },
        ]
      },
      {
        id: 'frameworks',
        label: 'Global Frameworks',
        fields: [
          { key: 'frameworks_title', label: 'Section Title', type: 'text' },
          { key: 'frameworks_subtitle', label: 'Section Subtitle', type: 'textarea' },
        ]
      },
      {
        id: 'membership_home',
        label: 'Membership (Home)',
        fields: [
          { key: 'membership_title', label: 'Section Title', type: 'text' },
          { key: 'membership_subtitle', label: 'Section Subtitle', type: 'textarea' },
        ]
      },
      {
        id: 'newsletter_home',
        label: 'Newsletter (Home)',
        fields: [
          { key: 'newsletter_badge', label: 'Newsletter Badge', type: 'text' },
          { key: 'newsletter_title', label: 'Newsletter Title', type: 'text' },
          { key: 'newsletter_subtitle', label: 'Newsletter Subtitle', type: 'textarea' },
        ]
      }
    ]
  },
  about: {
    label: 'About Page',
    icon: Info,
    sections: [
      {
        id: 'mission',
        label: 'Mission Section',
        fields: [
          { key: 'mission_badge', label: 'Badge Text', type: 'text' },
          { key: 'mission_title', label: 'Section Title', type: 'text' },
          { key: 'mission_subtitle', label: 'Section Subtitle', type: 'textarea' },
        ]
      },
      {
        id: 'story',
        label: 'Our Story',
        fields: [
          { key: 'story_title', label: 'Story Title', type: 'text' },
          { key: 'story_text_1', label: 'Paragraph 1', type: 'textarea' },
          { key: 'story_text_2', label: 'Paragraph 2', type: 'textarea' },
        ]
      }
    ]
  },
  membership: {
    label: 'Membership',
    icon: ShoppingBag,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'membership_hero_badge', label: 'Hero Badge', type: 'text' },
          { key: 'membership_hero_title', label: 'Hero Title', type: 'text' },
          { key: 'membership_hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
        ]
      },
      {
        id: 'benefits',
        label: 'Detailed Benefits',
        fields: [
          { key: 'membership_benefits_title', label: 'Section Title', type: 'text' },
          { key: 'membership_benefits_subtitle', label: 'Section Subtitle', type: 'textarea' },
        ]
      }
    ]
  },
  community: {
    label: 'Community',
    icon: Users,
    sections: [
      {
        id: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'community_badge', label: 'Hero Badge', type: 'text' },
          { key: 'community_title', label: 'Hero Title', type: 'text' },
          { key: 'community_subtitle', label: 'Hero Subtitle', type: 'textarea' },
        ]
      },
      {
        id: 'mentorship',
        label: 'Mentorship Culture',
        fields: [
          { key: 'community_mentorship_title', label: 'Section Title', type: 'text' },
          { key: 'community_mentorship_subtitle', label: 'Section Subtitle', type: 'textarea' },
        ]
      }
    ]
  },
  contact: {
    label: 'Contact',
    icon: Mail,
    sections: [
      {
        id: 'header',
        label: 'Contact Header',
        fields: [
          { key: 'contact_title', label: 'Header Title', type: 'text' },
          { key: 'contact_subtitle', label: 'Header Subtitle', type: 'textarea' },
        ]
      }
    ]
  },
  faq: {
    label: 'FAQ Page',
    icon: HelpCircle,
    sections: [
      {
        id: 'header',
        label: 'FAQ Header',
        fields: [
          { key: 'faq_title', label: 'Header Title', type: 'text' },
          { key: 'faq_subtitle', label: 'Header Subtitle', type: 'textarea' },
        ]
      }
    ]
  }
};

export const WebsiteDataEditor: React.FC = () => {
  const [activePage, setActivePage] = useState<PageKey>('home');
  const [content, setContent] = useState<Record<string, string>>({});
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSynced, setLastSynced] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await WebsiteDataService.getData('draft');
        const contentMap: Record<string, string> = {};
        data.forEach(item => {
          if (typeof item.content === 'object' && item.content !== null) {
            Object.assign(contentMap, item.content);
          }
        });
        setContent(contentMap);
        setSyncStatus('synced');
        setLastSynced(new Date());
      } catch (err) {
        console.error('Error fetching website data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debounced auto-save logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (syncStatus === 'pending') {
        setSyncStatus('syncing');
        try {
          // We save globally since contentMap handles all pages
          await WebsiteDataService.saveDraft(`global_content`, content);
          setSyncStatus('synced');
          setLastSynced(new Date());
        } catch (err) {
          setSyncStatus('error');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, syncStatus]);

  const handleChange = (field: string, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
    setSyncStatus('pending');
  };

  const handlePublish = async () => {
    setSyncStatus('syncing');
    try {
      await WebsiteDataService.publish(`global_content`);
      setSyncStatus('synced');
      setLastSynced(new Date());
      alert(`Website content published successfully!`);
    } catch (err) {
      setSyncStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gw-accent-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Website Command</h1>
          <p className="text-gw-text-secondary font-medium uppercase tracking-widest text-[10px] flex items-center gap-2">
            <Globe size={12} className="text-gw-accent-primary" /> Multi-Page Content Engine
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SyncStatusIndicator 
            status={syncStatus} 
            lastSynced={lastSynced} 
            onManualSync={() => setSyncStatus('pending')} 
          />
          <CTAButton size="sm" onClick={handlePublish} variant="primary" className="bg-green-600 hover:bg-green-700 shadow-green-600/20">
            <Send size={14} className="mr-2" /> PUBLISH ALL CHANGES
          </CTAButton>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <GlassCard variant="surface" className="p-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gw-text-secondary mb-4 px-2 tracking-widest font-black">Structure</h3>
            <nav className="space-y-1">
              {(Object.keys(PAGE_CONFIGS) as PageKey[]).map((pageKey) => {
                const config = PAGE_CONFIGS[pageKey];
                const Icon = config.icon;
                const isActive = activePage === pageKey;
                
                return (
                  <button
                    key={pageKey}
                    onClick={() => setActivePage(pageKey)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                      isActive 
                        ? "bg-gw-accent-primary text-white shadow-lg shadow-gw-accent-primary/20" 
                        : "text-gw-text-secondary hover:text-gw-text-primary hover:bg-white/5"
                    )}
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-left">{config.label}</span>
                    {isActive && <ChevronRight size={14} />}
                  </button>
                );
              })}
            </nav>
          </GlassCard>

          <GlassCard className="p-6" variant="raised">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-8 rounded-lg bg-gw-accent-primary/10 flex items-center justify-center text-gw-accent-primary">
                 <Monitor size={16} />
               </div>
               <h4 className="text-xs font-black uppercase tracking-widest">Live Editor</h4>
             </div>
             <p className="text-[10px] text-gw-text-secondary leading-relaxed mb-4">
               Click any section to begin modifying core branding and messaging.
             </p>
             <CTAButton variant="outline" size="sm" className="w-full text-[10px] h-8">VIEW LIVE SITE</CTAButton>
          </GlassCard>
        </div>

        {/* Editor Main Area */}
        <div className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {PAGE_CONFIGS[activePage].sections.map((section) => (
                <GlassCard key={section.id} variant="raised" className="p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <h3 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
                      <Settings2 size={20} className="text-gw-accent-primary" /> {section.label}
                    </h3>
                    <div className="flex items-center gap-4">
                       <button className="text-[10px] font-bold text-gw-text-secondary hover:text-gw-text-primary flex items-center gap-1 uppercase tracking-widest">
                         <History size={12} /> RESTORE
                       </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gw-text-secondary ml-1">{field.label}</label>
                        {field.type === 'textarea' ? (
                          <textarea 
                            value={content[field.key] || ''}
                            placeholder={`Enter ${field.label}...`}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm leading-relaxed focus:ring-2 focus:ring-gw-accent-primary outline-none transition-all h-32" 
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={content[field.key] || ''}
                            placeholder={`Enter ${field.label}...`}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-gw-accent-primary outline-none transition-all" 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}

              {/* Page Settings & SEO */}
              <GlassCard className="p-8" variant="surface">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="text-gw-accent-primary" size={20} />
                  <h3 className="text-xl font-bold">Search Visibility</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Meta Title</label>
                      <input 
                        type="text" 
                        value={content[`${activePage}_meta_title`] || ''}
                        placeholder="e.g. Best Certification pathways 2026"
                        onChange={(e) => handleChange(`${activePage}_meta_title`, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-gw-accent-primary outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Meta Description</label>
                      <textarea 
                        value={content[`${activePage}_meta_desc`] || ''}
                        placeholder="Enter description for search results..."
                        onChange={(e) => handleChange(`${activePage}_meta_desc`, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-gw-accent-primary outline-none h-24" 
                      />
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col justify-center">
                    <p className="text-[10px] text-gw-text-secondary font-bold uppercase tracking-widest mb-4">Snippet Preview</p>
                    <div className="space-y-1">
                      <p className="text-blue-500 font-medium text-base leading-tight hover:underline cursor-pointer">
                        {content[`${activePage}_meta_title`] || PAGE_CONFIGS[activePage].label} | PMStructure
                      </p>
                      <p className="text-green-600 text-[10px]">https://pmstructure.com/{activePage === 'home' ? '' : activePage}</p>
                      <p className="text-gw-text-secondary text-[10px] line-clamp-2">
                        {content[`${activePage}_meta_desc`] || 'High-performance certification pathways for ambitious professionals. Master PMP, PRINCE2, and more.'}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
