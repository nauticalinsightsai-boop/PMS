import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Linkedin, Youtube, Github, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="w-full border-t border-sandstone dark:border-slate-800 bg-ivory dark:bg-obsidian">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white shadow-md">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight font-heading text-obsidian dark:text-white">PMStructure</span>
            </Link>
            <p className="text-sm text-carbon dark:text-slate-400 leading-relaxed max-w-xs font-medium">
              Empowering project professionals worldwide with structured certification pathways, expert resources, and a global community.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/nauticalinsightsai-boop/PMS" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm text-carbon dark:text-slate-400 hover:text-brand-orange transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm text-carbon dark:text-slate-400 hover:text-brand-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm text-carbon dark:text-slate-400 hover:text-brand-orange transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm text-carbon dark:text-slate-400 hover:text-brand-orange transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm text-carbon dark:text-slate-400 hover:text-brand-orange transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-obsidian dark:text-white">Certifications</h3>
            <ul className="flex flex-col gap-3 text-sm text-carbon dark:text-slate-400 font-medium">
              <li><Link to="/certifications" className="hover:text-brand-orange transition-colors">PMP® Certification</Link></li>
              <li><Link to="/certifications" className="hover:text-brand-orange transition-colors">CAPM® Certification</Link></li>
              <li><Link to="/certifications" className="hover:text-brand-orange transition-colors">PMI-ACP® Agile</Link></li>
              <li><Link to="/certifications" className="hover:text-brand-orange transition-colors">PRINCE2® Foundation</Link></li>
              <li><Link to="/certifications" className="hover:text-brand-orange transition-colors">Six Sigma Green Belt</Link></li>
              <li><Link to="/compare" className="hover:text-brand-orange font-bold text-brand-orange/80">Compare All Certs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-obsidian dark:text-white">Resources</h3>
            <ul className="flex flex-col gap-3 text-sm text-carbon dark:text-slate-400 font-medium">
              <li><Link to="/newsletter" className="hover:text-brand-orange transition-colors">Newsletter & Insights</Link></li>
              <li><Link to="/store" className="hover:text-brand-orange transition-colors">Study Resources Store</Link></li>
              <li><Link to="/community" className="hover:text-brand-orange transition-colors">Community Network</Link></li>
              <li><Link to="/faq" className="hover:text-brand-orange transition-colors">Help & FAQ</Link></li>
              <li><Link to="#" className="hover:text-brand-orange transition-colors">CV Maker Tool</Link></li>
              <li><Link to="#" className="hover:text-brand-orange transition-colors">Study Planner</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-obsidian dark:text-white">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-sm text-carbon dark:text-slate-400 font-medium">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-orange shrink-0" />
                <span>support@pmstructure.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-orange shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-orange shrink-0" />
                <span>123 Project Way, Suite 400<br />London, UK EC1A 1BB</span>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-12 bg-sandstone dark:bg-slate-800" />
        
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-carbon dark:text-slate-500 font-medium">
            <span>© {new Date().getFullYear()} PMStructure. All rights reserved.</span>
            <Link to="#" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-brand-orange transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-brand-orange transition-colors">Cookie Policy</Link>
          </div>
          <p className="text-[10px] text-slate-400 max-w-md text-center md:text-right leading-tight font-medium">
            PMI, PMP, CAPM, PMI-ACP, and PMI-RMP are registered marks of the Project Management Institute, Inc. PRINCE2 is a registered trademark of AXELOS Limited.
          </p>
        </div>
      </div>
    </footer>
  );
}
