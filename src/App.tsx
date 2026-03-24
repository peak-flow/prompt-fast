import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Code2, 
  Bookmark, 
  Variable, 
  Settings, 
  Menu, 
  History, 
  Share2, 
  Copy, 
  Play, 
  Search, 
  Plus, 
  Star, 
  ThumbsUp, 
  ThumbsDown,
  X,
  Command,
  ChevronRight,
  Zap,
  StickyNote,
  LayoutGrid,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { View, Prompt, MOCK_PROMPTS } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('editor');
  const [activePrompt, setActivePrompt] = useState<Prompt>(MOCK_PROMPTS[0]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({
    topic: 'Quantum Computing',
    framework: 'Qiskit',
    tone: 'Technical & Precise',
    difficulty: 'Beginner'
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'library':
        return <LibraryView onSelectPrompt={(p) => { setActivePrompt(p); setCurrentView('editor'); }} />;
      case 'dashboard':
        return <DashboardView />;
      default:
        return <EditorView prompt={activePrompt} variables={variables} setVariables={setVariables} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden font-body">
      {/* Sidebar */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar onOpenSearch={() => setIsCommandPaletteOpen(true)} />
        
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Nav */}
        <MobileNav currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <CommandPalette onClose={() => setIsCommandPaletteOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar({ currentView, setCurrentView }: { currentView: View, setCurrentView: (v: View) => void }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Terminal },
    { id: 'editor', label: 'Editor', icon: Code2 },
    { id: 'library', label: 'Library', icon: Bookmark },
    { id: 'variables', label: 'Variables', icon: Variable },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface-container-low shadow-[4px_0_24px_rgba(163,166,255,0.04)] z-40">
      <div className="p-6 flex items-center gap-4 bg-surface-container-high/50">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Terminal className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xs font-headline font-bold text-primary uppercase tracking-tighter">root@kinetic</h3>
          <p className="text-[10px] text-on-surface/40 uppercase">Pro Plan Active</p>
        </div>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        <div className="px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-wider transition-all duration-200 rounded-md",
                currentView === item.id 
                  ? "bg-surface-container-high text-primary border-l-2 border-primary" 
                  : "text-on-surface/60 hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-6 border-t border-outline-variant/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-outline-variant uppercase">Storage</span>
          <span className="text-[10px] font-mono text-primary uppercase">82%</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '82%' }}
            className="h-full bg-primary" 
          />
        </div>
      </div>
    </aside>
  );
}

function TopBar({ onOpenSearch }: { onOpenSearch: () => void }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface border-b border-outline-variant/5 z-30">
      <div className="flex items-center gap-4">
        <Menu className="w-5 h-5 text-primary lg:hidden" />
        <span className="text-lg font-headline font-bold text-primary tracking-widest uppercase">KINETIC_IDE</span>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl mx-8">
        <button 
          onClick={onOpenSearch}
          className="w-full flex items-center gap-3 bg-surface-container-highest px-4 py-2 rounded-lg group transition-all duration-200 border border-transparent focus-within:border-primary/30"
        >
          <Search className="w-4 h-4 text-outline" />
          <span className="text-sm text-outline-variant font-body flex-1 text-left">Search Prompts...</span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30 text-outline font-mono">⌘</span>
            <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30 text-outline font-mono">K</span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="md:hidden text-on-surface-variant">
          <Search className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-primary/20 flex items-center justify-center overflow-hidden">
          <img 
            src="https://picsum.photos/seed/kinetic/100/100" 
            alt="User" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}

function EditorView({ prompt, variables, setVariables }: { 
  prompt: Prompt, 
  variables: Record<string, string>,
  setVariables: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Simple regex to highlight variables in the prompt body
  const renderPromptBody = (text: string) => {
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, i) => {
      if (part.startsWith('{{') && part.endsWith('}}')) {
        const varName = part.slice(2, -2);
        return <span key={i} className="text-primary font-bold">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Editor Main */}
      <div className="flex-1 flex flex-col h-full bg-surface-container-low mono-canvas relative overflow-hidden">
        {/* Toolbar */}
        <div className="h-12 flex items-center justify-between px-6 bg-surface-container-high/50 border-b border-outline-variant/10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">{prompt.id}.sh</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              <span className="text-[10px] text-on-surface-variant font-medium">Auto-saving...</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <History className="w-4 h-4" />
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20 uppercase">Stable</span>
                <span className="text-on-surface/40 text-[10px] font-mono tracking-widest uppercase">ID: {prompt.id}</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-headline font-bold leading-tight">
                {renderPromptBody(prompt.title)}
              </h1>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/10 blur opacity-25 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-surface-container-highest p-6 rounded-xl overflow-hidden min-h-[300px] border border-outline-variant/10">
                <div className="flex items-center justify-between mb-6 border-b border-outline-variant/10 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-error/30" />
                    <div className="w-3 h-3 rounded-full bg-tertiary/30" />
                    <div className="w-3 h-3 rounded-full bg-primary/30" />
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs font-mono text-primary hover:text-primary-fixed transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'COPIED!' : 'COPY_BUFFER'}</span>
                  </button>
                </div>
                <pre className="font-mono text-sm leading-relaxed text-on-surface/80 whitespace-pre-wrap">
                  {renderPromptBody(prompt.body)}
                </pre>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-tertiary" />
                <h3 className="text-xs font-headline font-bold text-on-surface/60 uppercase tracking-widest">Architect's Notes</h3>
              </div>
              <div className="bg-surface-container/50 p-4 rounded-lg text-sm text-on-surface-variant leading-relaxed">
                This prompt uses high-density semantic tokens. Ensure the LLM temperature is set to <span className="text-on-surface font-mono">0.7</span> for optimal creativity/accuracy ratio. Testing showed 15% better results with GPT-4o.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variable Panel */}
      <aside className="w-full md:w-80 bg-surface-container-highest border-l border-outline-variant/10 flex flex-col">
        <div className="p-6 border-b border-outline-variant/10">
          <h2 className="text-sm font-headline font-bold text-primary uppercase tracking-widest">Variable Input</h2>
          <p className="text-[10px] text-on-surface-variant mt-1 uppercase">Injection parameters for active session</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {Object.entries(variables).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-[10px] font-mono text-on-surface/60 uppercase">{key}</label>
              {key === 'tone' ? (
                <select 
                  value={value}
                  onChange={(e) => setVariables(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary outline-none px-0 py-2 text-sm text-on-surface transition-all appearance-none cursor-pointer"
                >
                  <option>Technical & Precise</option>
                  <option>Conversational</option>
                  <option>Socratic</option>
                </select>
              ) : key === 'difficulty' ? (
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Inter', 'Expert'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setVariables(prev => ({ ...prev, [key]: d }))}
                      className={cn(
                        "py-2 text-[10px] font-bold uppercase rounded-sm transition-all",
                        value === d 
                          ? "bg-primary/20 text-primary border border-primary/40" 
                          : "bg-surface-container-low border border-outline-variant/30 text-on-surface/40 hover:border-outline"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              ) : (
                <input 
                  type="text"
                  value={value}
                  onChange={(e) => setVariables(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary outline-none px-0 py-2 text-sm text-on-surface transition-all"
                />
              )}
            </div>
          ))}

          <div className="pt-4 mt-8 border-t border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-headline font-bold text-on-surface/40 uppercase">Output Config</h4>
              <Settings className="w-3 h-3 text-on-surface/40" />
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg">
              <Zap className="w-4 h-4 text-tertiary" />
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase">Turbo Execution</p>
                <p className="text-[9px] text-on-surface-variant uppercase">Stream response tokens</p>
              </div>
              <div className="w-8 h-4 bg-primary/20 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-2 h-2 bg-primary rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-container-highest flex flex-col gap-3">
          <button className="w-full py-4 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-headline font-bold uppercase tracking-widest text-xs rounded-md shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2">
            <Play className="w-4 h-4 fill-current" />
            RUN_PROMPT
          </button>
          <button className="w-full py-3 bg-surface-container-low text-primary border border-primary/20 font-headline font-bold uppercase tracking-widest text-[10px] rounded-md hover:bg-surface-container transition-colors active:scale-95">
            SAVE_TEMPLATE
          </button>
        </div>
      </aside>
    </div>
  );
}

function LibraryView({ onSelectPrompt }: { onSelectPrompt: (p: Prompt) => void }) {
  const categories = ['ALL_PROMPTS', 'CODING', 'LOGIC', 'DEBUGGING', 'CREATIVE'];
  const [activeCategory, setActiveCategory] = useState('ALL_PROMPTS');

  return (
    <div className="h-full overflow-y-auto p-6 md:p-12 custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h2 className="text-3xl font-headline font-bold">Prompt Library</h2>
          <button className="bg-primary text-on-primary p-2 rounded-lg hover:bg-primary-dim transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </header>

        <section className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all",
                activeCategory === cat 
                  ? "bg-primary text-on-primary" 
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              )}
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                activeCategory === cat ? "bg-on-primary" : "bg-primary"
              )} />
              {cat}
            </button>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_PROMPTS.map((prompt) => (
            <article 
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt)}
              className="group relative bg-surface-container-low p-5 rounded-xl transition-all duration-200 hover:bg-surface-container-high hover:shadow-[0_0_20px_rgba(163,166,255,0.05)] border-l-2 border-transparent hover:border-primary cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-1">
                  <h3 className="font-headline text-lg font-bold text-on-surface leading-tight">{prompt.title}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex text-tertiary">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("w-3 h-3", i < prompt.rating ? "fill-current" : "opacity-30")} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-outline-variant tracking-tighter uppercase">ID: {prompt.id}</span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-surface-container-highest rounded-lg text-primary hover:bg-primary hover:text-on-primary transition-all">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed">
                {prompt.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <ThumbsUp className="w-3.5 h-3.5 text-primary" />
                    <span className="text-on-surface">{prompt.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <ThumbsDown className="w-3.5 h-3.5 text-outline" />
                    <span className="text-on-surface-variant">{prompt.dislikes.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded uppercase">
                  {prompt.category}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-12 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-12">
        <header>
          <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Active Repositories</h2>
          <p className="text-on-surface-variant mt-2">Managing 12 microservices across 3 clusters.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 h-64 bg-surface-container-low rounded-xl border border-outline-variant/5 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-primary uppercase">Cluster_Alpha</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-500 font-bold">HEALTHY</span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full h-32 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-center">
                <span className="text-xs text-primary/40 font-mono">Real-time Traffic Visualization</span>
              </div>
            </div>
          </div>
          <div className="col-span-1 h-64 bg-surface-container-high rounded-xl border border-outline-variant/5 p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface/40 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Prompts', value: '1,204', color: 'text-primary' },
                { label: 'Executions', value: '45.2k', color: 'text-secondary' },
                { label: 'Success Rate', value: '99.8%', color: 'text-emerald-500' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">{stat.label}</span>
                  <span className={cn("font-headline font-bold", stat.color)}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNav({ currentView, setCurrentView }: { currentView: View, setCurrentView: (v: View) => void }) {
  const items = [
    { id: 'dashboard', label: 'Feed', icon: LayoutGrid },
    { id: 'editor', label: 'Studio', icon: Code2 },
    { id: 'library', label: 'Search', icon: Search },
    { id: 'tags', label: 'Tags', icon: Tag },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full h-16 bg-background/80 backdrop-blur-xl flex justify-around items-center px-6 pb-2 border-t border-primary/10 z-50">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentView(item.id as View)}
          className={cn(
            "flex flex-col items-center justify-center transition-all",
            currentView === item.id ? "text-primary" : "text-on-surface/50"
          )}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -20 }}
        className="w-full max-w-2xl glass-panel rounded-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(163,166,255,0.1)] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative flex items-center px-6 py-5 border-b border-outline-variant/10">
          <Search className="w-6 h-6 text-primary mr-4" />
          <input 
            autoFocus 
            className="w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant focus:ring-0 text-xl font-body" 
            placeholder="Type to search..." 
          />
          <div className="flex items-center gap-1.5 ml-4">
            <kbd className="px-2 py-1 rounded bg-surface-container-highest border border-outline-variant/20 text-[10px] font-mono text-on-surface-variant">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[530px] overflow-y-auto py-4 px-2 custom-scrollbar">
          <div className="px-4 py-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-3 px-2">Global Actions</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg bg-primary/10 text-primary group transition-all">
                <div className="flex items-center gap-3">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Create New Deployment Prompt</span>
                </div>
                <span className="text-[10px] font-mono opacity-60">ENTER</span>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-container-highest text-on-surface group transition-all">
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4" />
                  <span className="text-sm font-medium">Re-sync AWS Environment</span>
                </div>
                <span className="text-[10px] font-mono opacity-0 group-hover:opacity-40">ENTER</span>
              </button>
            </div>
          </div>

          <div className="px-4 py-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 px-2">Prompt Library</h3>
            <div className="space-y-1">
              {MOCK_PROMPTS.map((p) => (
                <div key={p.id} className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-surface-container-highest text-on-surface cursor-pointer group transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{p.title.replace(/\{\{[^}]+\}\}/g, '...')}</span>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span className="text-[10px] text-on-surface-variant">{p.category}</span>
                      </div>
                      <span className="text-[10px] text-outline">•</span>
                      <span className="text-[10px] text-on-surface-variant">Updated {p.updatedAt}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-outline-variant group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-surface-container-highest/40 border-t border-outline-variant/10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Command className="w-3 h-3 text-on-surface-variant" />
              <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Navigate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30 text-outline font-mono">ENTER</span>
              <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Select</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">Search in</span>
            <span className="text-[10px] font-mono font-bold text-primary">PROJECT_MAIN</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
