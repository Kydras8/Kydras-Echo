
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  FileText, 
  Brain, 
  Eye,
  Plus,
  Zap,
  Users,
  Mic,
  Menu,
  X
} from "lucide-react";
import { createPageUrl } from "@/utils";
import HelpWidget from "./components/help/HelpWidget";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: "Dashboard", path: "Dashboard", icon: Eye },
    { name: "Upload", path: "Upload", icon: Upload },
    { name: "Library", path: "Library", icon: FileText },
    { name: "Content Studio", path: "ContentStudio", icon: Zap },
    { name: "Search Hub", path: "SearchHub", icon: Brain },
    { name: "Teams", path: "Teams", icon: Users },
    { name: "Live Meeting", path: "LiveMeeting", icon: Mic },
    { name: "Analytics", path: "Analytics", icon: Brain },
    { name: "Integrations", path: "Integrations", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-900/20">
      <style jsx>{`
        /* Liquid Gold Performance Optimizations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .kydras-gradient {
          background: linear-gradient(135deg, #d4af37 0%, #ffd700 25%, #b8860b 50%, #daa520 75%, #f4d03f 100%);
          will-change: transform;
        }
        
        .kydras-text {
          background: linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #f4d03f 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          will-change: transform;
        }
        
        .kydras-shadow {
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
          will-change: box-shadow;
        }
        
        .kydras-border {
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        /* Smooth Animations */
        .smooth-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);
        }
        
        .smooth-hover:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.4);
        }
        
        /* Hardware Acceleration */
        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Loading Animation Optimization */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .shimmer {
          animation: shimmer 1.5s infinite;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        }

        /* Fade in animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b kydras-border sticky top-0 z-50 gpu-accelerated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link 
              to={createPageUrl("Dashboard")} 
              className="flex items-center space-x-3 lg:space-x-4 smooth-hover group"
            >
              <div className="relative gpu-accelerated">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2297efba8_kydras_logo.png" 
                  alt="Kydras Logo" 
                  className="w-10 h-10 lg:w-12 lg:h-12 object-contain kydras-shadow transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-2xl"
                />
              </div>
              <div className="gpu-accelerated hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold kydras-text tracking-wider transition-all duration-300 group-hover:scale-105">
                  KYDRAS ECHO
                </h1>
                <p className="text-xs text-amber-400/80 font-medium tracking-widest transition-all duration-300 group-hover:text-amber-300">
                  NOTHING IS OFF LIMITS
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  className={`px-4 xl:px-6 py-3 rounded-lg text-sm font-medium smooth-hover flex items-center gap-2 gpu-accelerated ${
                    currentPageName === item.path
                      ? "kydras-gradient text-black shadow-lg transform scale-105"
                      : "text-amber-200 hover:bg-amber-900/20 hover:text-amber-100 border border-amber-700/30"
                  }`}
                >
                  <item.icon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="hidden xl:inline">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button & Quick Action */}
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className="kydras-gradient text-black font-bold smooth-hover kydras-shadow gpu-accelerated relative overflow-hidden group hidden sm:flex lg:hidden"
                asChild
              >
                <Link to={createPageUrl("Upload")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Upload
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                className="kydras-gradient text-black font-bold smooth-hover kydras-shadow gpu-accelerated relative overflow-hidden group hidden lg:flex"
                asChild
              >
                <Link to={createPageUrl("Upload")}>
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100"></div>
                  <Plus className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-180" />
                  New Upload
                </Link>
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-amber-200 hover:bg-amber-900/20"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t kydras-border py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.path)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium smooth-hover flex items-center gap-3 ${
                    currentPageName === item.path
                      ? "kydras-gradient text-black"
                      : "text-amber-200 hover:bg-amber-900/20 hover:text-amber-100"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t kydras-border">
                <Link
                  to={createPageUrl("Upload")}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium kydras-gradient text-black text-center"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  New Upload
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 gpu-accelerated">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-sm border-t kydras-border mt-auto gpu-accelerated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="text-center space-y-2">
            <p className="text-amber-400/60 text-sm font-medium transition-all duration-300 hover:text-amber-400">
              © 2024 KYDRAS ECHO. Advanced AI Transcription Platform.
            </p>
            <div className="flex justify-center items-center gap-4 text-xs">
               <Link to={createPageUrl("License")} className="text-amber-600/50 hover:text-amber-400 transition-colors">
                License
               </Link>
               <span className="text-amber-600/50">|</span>
               <p className="text-amber-600/40 tracking-widest transition-all duration-300 hover:tracking-wider">
                NOTHING IS OFF LIMITS
               </p>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Help Widget */}
      <HelpWidget />
    </div>
  );
}
