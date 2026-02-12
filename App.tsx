
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User, 
  Compass, 
  Layout, 
  Grid as GridIcon,
  MessageCircle,
  Bell,
  Settings as SettingsIcon,
  Sparkles,
  Layers,
  LogOut,
  MoreHorizontal,
  Flag,
  UserX,
  Link,
  EyeOff,
  ChevronDown
} from 'lucide-react';
import { Post, Tab } from './types';
import { PostCard } from './components/PostCard';
import { AIStudio } from './components/AIStudio';
import { SettingsView } from './components/Settings';
import { Login } from './components/Login';
import { AIHub } from './components/AIHub';

// Mock data
const MOCK_POSTS: Post[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `post-${i}`,
  url: `https://picsum.photos/seed/${i + 88}/800/${i % 2 === 0 ? 1200 : 800}`,
  title: [
    'Minimalist architecture in Tokyo',
    'Morning coffee vibes in Paris',
    'The secret to perfect sourdough',
    'Cyberpunk neon aesthetics',
    'Dreamy mountain sunset',
    'Luxury interior design ideas',
    'Abstract textures in nature',
    'Retro gaming setup inspiration'
  ][i % 8],
  author: ['CreativeSoul', 'Wanderlust', 'DesignDaily', 'ArtisanKey', 'UrbanExplorer', 'NeonVibe'][i % 6],
  authorAvatar: `https://i.pravatar.cc/150?u=${i}`,
  likes: Math.floor(Math.random() * 5000),
  comments: Math.floor(Math.random() * 200),
  isAI: i % 4 === 0,
  aspectRatio: ['1:1', '9:16', '4:3', '16:9', '3:4'][Math.floor(Math.random() * 5)]
}));

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [activeTab, setActiveTab] = useState<Tab>(Tab.EXPLORE);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPostOptions, setShowPostOptions] = useState(false);

  // Auto-scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setActiveTab(Tab.EXPLORE);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.EXPLORE:
        return (
          <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24 lg:pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Discover</h1>
                <p className="text-gray-500 font-medium">Explore trending vibes and AI masterpieces</p>
               </div>
               <div className="flex items-center gap-3">
                 <div className="bg-white border border-gray-100 rounded-2xl flex p-1.5 shadow-sm">
                   <button 
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${viewMode === 'grid' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}
                   >
                     <GridIcon className="w-3.5 h-3.5" />
                     Masonry
                   </button>
                   <button 
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold ${viewMode === 'list' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}
                   >
                     <Layout className="w-3.5 h-3.5" />
                     Feed
                   </button>
                 </div>
               </div>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                {MOCK_POSTS.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onClick={setSelectedPost} 
                    viewMode="grid" 
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {MOCK_POSTS.map(post => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onClick={setSelectedPost} 
                    viewMode="list" 
                  />
                ))}
              </div>
            )}
          </div>
        );
      case Tab.AI_STUDIO:
        return <AIStudio />;
      case Tab.SETTINGS:
        return <SettingsView onLogout={handleLogout} />;
      case Tab.FEED:
        return (
          <div className="max-w-xl mx-auto py-8 px-4 pb-24 lg:pb-8">
            <div className="space-y-8">
               <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar scroll-smooth">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group">
                      <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 transition-transform group-hover:scale-105">
                         <div className="w-full h-full rounded-full border-[2.5px] border-white overflow-hidden">
                           <img src={`https://i.pravatar.cc/150?u=story${i}`} className="w-full h-full object-cover" />
                         </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">User_{i}</span>
                    </div>
                  ))}
               </div>
               {MOCK_POSTS.map(post => (
                 <PostCard 
                  key={post.id} 
                  post={post} 
                  onClick={setSelectedPost} 
                  viewMode="list" 
                 />
               ))}
            </div>
          </div>
        );
      case Tab.PROFILE:
        return (
          <div className="max-w-5xl mx-auto py-12 px-4 pb-24 lg:pb-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-16">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-blue-500 shadow-2xl">
                  <div className="w-full h-full rounded-full border-4 border-white overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" />
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 p-3 bg-gray-900 border-4 border-white rounded-full text-white shadow-xl hover:scale-110 transition-transform">
                  <PlusSquare className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <h2 className="text-3xl font-black text-gray-900">arivers_studio</h2>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setActiveTab(Tab.SETTINGS)} className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">Edit Profile</button>
                    <button onClick={() => setActiveTab(Tab.SETTINGS)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                      <SettingsIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center md:justify-start gap-10 mb-6">
                   <div className="text-center md:text-left">
                      <span className="block text-xl font-black">128</span>
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Posts</span>
                   </div>
                   <div className="text-center md:text-left">
                      <span className="block text-xl font-black">4.8k</span>
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Followers</span>
                   </div>
                   <div className="text-center md:text-left">
                      <span className="block text-xl font-black">1.2k</span>
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Following</span>
                   </div>
                </div>

                <div>
                  <h3 className="font-black text-gray-900">Alex Rivers</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-md">
                    Digital Curator & AI Enthusiast. Exploring the intersection of human creativity and machine intelligence. 🎨✨
                  </p>
                  <a href="#" className="text-purple-600 text-sm font-bold mt-2 inline-block hover:underline">vibeflow.ai/alex</a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <div className="flex justify-center gap-12 mb-10">
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] border-t-2 border-gray-900 pt-4 -mt-[33px]">
                  <GridIcon className="w-4 h-4" /> Posts
                </button>
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 pt-4 -mt-[33px] hover:text-gray-600">
                  <Layers className="w-4 h-4" /> Boards
                </button>
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 pt-4 -mt-[33px] hover:text-gray-600">
                  <User className="w-4 h-4" /> Tagged
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 md:gap-4">
                 {MOCK_POSTS.slice(0, 15).map(p => (
                   <div key={p.id} className="aspect-square bg-gray-100 cursor-pointer overflow-hidden group relative rounded-lg md:rounded-2xl">
                     <img src={p.url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                     <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                        <div className="flex items-center gap-1.5 font-bold"><Heart className="w-5 h-5 fill-white" /> {p.likes > 1000 ? (p.likes/1000).toFixed(1)+'k' : p.likes}</div>
                        <div className="flex items-center gap-1.5 font-bold"><MessageCircle className="w-5 h-5 fill-white" /> {p.comments}</div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        );
      default:
        return <div className="p-20 text-center text-gray-400">Section coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative">
      <AIHub />
      
      {/* Sidebar Desktop */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-100 flex-col fixed h-screen z-30 transition-all hidden lg:flex`}>
        <div className="p-8">
           {isSidebarOpen ? (
             <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic">VIBEFLOW.</h1>
           ) : (
             <div className="w-8 h-8 bg-gray-900 rounded-xl" />
           )}
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
           <SidebarItem icon={<Home />} label="Home" active={activeTab === Tab.EXPLORE} onClick={() => setActiveTab(Tab.EXPLORE)} collapsed={!isSidebarOpen} />
           <SidebarItem icon={<Search />} label="Search" onClick={() => {}} collapsed={!isSidebarOpen} />
           <SidebarItem icon={<Compass />} label="Explore" active={activeTab === Tab.FEED} onClick={() => setActiveTab(Tab.FEED)} collapsed={!isSidebarOpen} />
           <SidebarItem icon={<Sparkles />} label="Vibe Studio" active={activeTab === Tab.AI_STUDIO} onClick={() => setActiveTab(Tab.AI_STUDIO)} collapsed={!isSidebarOpen} variant="special" />
           <SidebarItem icon={<MessageCircle />} label="Messages" onClick={() => {}} collapsed={!isSidebarOpen} />
           <SidebarItem icon={<Heart />} label="Notifications" onClick={() => {}} collapsed={!isSidebarOpen} />
           <SidebarItem icon={<PlusSquare />} label="Create" onClick={() => setActiveTab(Tab.AI_STUDIO)} collapsed={!isSidebarOpen} />
           <SidebarItem icon={<User />} label="Profile" active={activeTab === Tab.PROFILE} onClick={() => setActiveTab(Tab.PROFILE)} collapsed={!isSidebarOpen} />
        </nav>

        <div className="p-4 mt-auto mb-4">
           <SidebarItem icon={<SettingsIcon />} label="Settings" active={activeTab === Tab.SETTINGS} onClick={() => setActiveTab(Tab.SETTINGS)} collapsed={!isSidebarOpen} />
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} bg-white`}>
        {/* Header - Mobile Only */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-xl bg-white/80">
          <h1 className="text-xl font-black text-gray-900 tracking-tight italic">VF.</h1>
          <div className="flex gap-5">
             <button><Search className="w-6 h-6 text-gray-700" /></button>
             <button className="relative">
                <Heart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
          </div>
        </header>

        <div className="relative min-h-screen">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-8 flex items-center justify-between z-50">
         <button onClick={() => setActiveTab(Tab.EXPLORE)} className={`${activeTab === Tab.EXPLORE ? 'text-gray-900 scale-110' : 'text-gray-400'} transition-all`}>
            <Home className="w-7 h-7" />
         </button>
         <button onClick={() => setActiveTab(Tab.FEED)} className={`${activeTab === Tab.FEED ? 'text-gray-900 scale-110' : 'text-gray-400'} transition-all`}>
            <Search className="w-7 h-7" />
         </button>
         <button onClick={() => setActiveTab(Tab.AI_STUDIO)} className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white -mt-10 shadow-2xl shadow-gray-400 transform transition-transform active:scale-95">
            <Sparkles className="w-7 h-7" />
         </button>
         <button onClick={() => setActiveTab(Tab.PROFILE)} className={`${activeTab === Tab.PROFILE ? 'text-gray-900 scale-110' : 'text-gray-400'} transition-all`}>
            <User className="w-7 h-7" />
         </button>
         <button onClick={() => setActiveTab(Tab.SETTINGS)} className={`${activeTab === Tab.SETTINGS ? 'text-gray-900 scale-110' : 'text-gray-400'} transition-all`}>
            <SettingsIcon className="w-7 h-7" />
         </button>
      </nav>

      {/* Post Modal / Expanded View */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-0 lg:p-10 animate-in fade-in duration-300">
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-[101] bg-white/10 p-2 rounded-full backdrop-blur-md"
            onClick={() => { setSelectedPost(null); setShowPostOptions(false); }}
          >
            <PlusSquare className="w-8 h-8 rotate-45" />
          </button>
          
          <div className="bg-white rounded-none lg:rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row max-w-7xl w-full h-full lg:h-auto lg:max-h-[90vh] shadow-2xl relative">
             <div className="flex-[1.5] bg-gray-50 flex items-center justify-center overflow-hidden relative group">
                <img src={selectedPost.url} className="w-full h-full object-contain" alt={selectedPost.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </div>
             
             <div className="w-full lg:w-[450px] flex flex-col bg-white border-l border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-purple-600">
                        <img src={selectedPost.authorAvatar} className="w-full h-full rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-black text-sm text-gray-900">{selectedPost.author}</p>
                          {selectedPost.isAI && <Sparkles className="w-3 h-3 text-purple-500 fill-purple-500" />}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Creator</p>
                      </div>
                   </div>
                   <div className="relative">
                    <button 
                      onClick={() => setShowPostOptions(!showPostOptions)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                    >
                      <MoreHorizontal className="w-6 h-6" />
                    </button>
                    {showPostOptions && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in zoom-in-95 duration-200">
                        <button className="w-full px-4 py-2.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-gray-50"><Link className="w-4 h-4" /> Copy link</button>
                        <button className="w-full px-4 py-2.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-gray-50 text-red-600"><Flag className="w-4 h-4" /> Report</button>
                        <button className="w-full px-4 py-2.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-gray-50 text-red-600"><UserX className="w-4 h-4" /> Unfollow</button>
                        <button className="w-full px-4 py-2.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-gray-50"><EyeOff className="w-4 h-4" /> Not interested</button>
                      </div>
                    )}
                   </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                   <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight">{selectedPost.title}</h2>
                   <div className="flex items-center gap-2 mb-8">
                     <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider">Aesthetic</span>
                     <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider">Inspiration</span>
                     {selectedPost.isAI && <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-wider">Generated by AI</span>}
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-start gap-3">
                         <img src="https://i.pravatar.cc/150?u=c1" className="w-8 h-8 rounded-full mt-1" />
                         <div>
                            <p className="text-sm"><span className="font-bold mr-2">vibemaser_88</span>This lighting is incredible! Was this done with the Vibe Studio?</p>
                            <div className="flex gap-4 mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                               <span>1h</span>
                               <button className="hover:text-gray-900">Reply</button>
                               <button className="hover:text-gray-900">Translate</button>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <img src="https://i.pravatar.cc/150?u=c2" className="w-8 h-8 rounded-full mt-1" />
                         <div>
                            <p className="text-sm"><span className="font-bold mr-2">design_junkie</span>Absolutely obsessed with these textures.</p>
                            <div className="flex gap-4 mt-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                               <span>45m</span>
                               <button className="hover:text-gray-900">Reply</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-5">
                         <button className="hover:scale-110 transition-transform"><Heart className="w-7 h-7 text-gray-900" /></button>
                         <button className="hover:scale-110 transition-transform"><MessageCircle className="w-7 h-7 text-gray-900" /></button>
                         <button className="hover:scale-110 transition-transform"><Layout className="w-7 h-7 text-gray-900" /></button>
                      </div>
                      <button className="p-2 bg-white rounded-xl shadow-sm hover:scale-110 transition-transform"><Layers className="w-6 h-6 text-gray-900" /></button>
                   </div>
                   <p className="text-sm font-black text-gray-900 mb-1">{selectedPost.likes.toLocaleString()} likes</p>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">January 24, 2025</p>
                   
                   <div className="flex items-center gap-3">
                      <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium" 
                      />
                      <button className="text-sm font-black text-purple-600 disabled:opacity-30">Post</button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed: boolean;
  variant?: 'default' | 'special';
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, collapsed, variant = 'default' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
        active 
          ? variant === 'special' 
            ? 'bg-gray-900 text-white shadow-xl'
            : 'bg-gray-50 text-gray-900 font-bold' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className={`${active ? 'scale-110' : ''} transition-transform`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      </div>
      {!collapsed && <span className={`text-sm tracking-tight ${active ? 'font-black' : 'font-semibold'}`}>{label}</span>}
    </button>
  );
};

export default App;
