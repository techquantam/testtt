import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Menu, 
  X, 
  Home, 
  User, 
  Settings, 
  Bell, 
  Search,
  Heart,
  Share2,
  MessageCircle,
  Star,
  ChevronRight,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';

// Custom hooks
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return isLoading;
};

// Components
const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center z-50"
  >
    <div className="text-center text-white">
      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
      <p className="text-lg font-medium">Loading your experience...</p>
    </div>
  </motion.div>
);

const OfflineBanner = ({ isOnline }: { isOnline: boolean }) => (
  <AnimatePresence>
    {!isOnline && (
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center text-sm font-medium z-40"
      >
        <WifiOff className="w-4 h-4 inline mr-2" />
        You're offline. Some features may be limited.
      </motion.div>
    )}
  </AnimatePresence>
);

const Header = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isOnline 
}: { 
  isMenuOpen: boolean; 
  setIsMenuOpen: (open: boolean) => void;
  isOnline: boolean;
}) => (
  <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-bold text-gray-900">MobileApp</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <button className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        <motion.nav
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-2">
              {[
                { icon: Home, label: 'Home', active: true },
                { icon: User, label: 'Profile' },
                { icon: Settings, label: 'Settings' },
                { icon: Bell, label: 'Notifications' },
              ].map((item, index) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors touch-manipulation ${
                    item.active 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'hover:bg-gray-50 active:bg-gray-100 text-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </motion.nav>
      </>
    )}
  </AnimatePresence>
);

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div className={`relative transition-all duration-200 ${isFocused ? 'scale-105' : ''}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search anything..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base touch-manipulation"
        />
      </div>
      
      {searchValue && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-20"
        >
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-2">Recent searches</p>
            <div className="space-y-2">
              {['React components', 'Mobile design', 'Accessibility'].map((term) => (
                <button
                  key={term}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const Card = ({ 
  title, 
  description, 
  image, 
  likes, 
  comments 
}: { 
  title: string; 
  description: string; 
  image: string; 
  likes: number; 
  comments: number; 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 touch-manipulation ${
                isLiked 
                  ? 'bg-red-50 text-red-600' 
                  : 'hover:bg-gray-50 active:bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            
            <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 text-gray-600 transition-colors touch-manipulation">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{comments}</span>
            </button>
          </div>
          
          <button className="p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 text-gray-600 transition-colors touch-manipulation">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const StatsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string; 
  change: string; 
  color: string; 
}) => (
  <div className={`bg-gradient-to-br ${color} p-4 sm:p-6 rounded-2xl text-white`}>
    <div className="flex items-center justify-between mb-4">
      <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
      <span className="text-xs sm:text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
        {change}
      </span>
    </div>
    <h3 className="text-2xl sm:text-3xl font-bold mb-1">{value}</h3>
    <p className="text-white/80 text-sm">{title}</p>
  </div>
);

const FloatingActionButton = () => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-30 touch-manipulation"
    aria-label="Add new item"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <Star className="w-6 h-6" />
    </motion.div>
  </motion.button>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOnline = useOnlineStatus();
  const isLoading = useLoadingState();

  // Sample data
  const cards = [
    {
      title: "Beautiful Mountain Landscape",
      description: "Discover breathtaking views and serene mountain landscapes that will take your breath away. Perfect for nature lovers and adventure seekers.",
      image: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 124,
      comments: 23
    },
    {
      title: "Modern Architecture Design",
      description: "Explore cutting-edge architectural designs that blend functionality with aesthetic appeal in urban environments.",
      image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 89,
      comments: 15
    },
    {
      title: "Ocean Sunset Views",
      description: "Experience the magic of golden hour by the ocean with stunning sunset views that create perfect moments of tranquility.",
      image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 256,
      comments: 42
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <OfflineBanner isOnline={isOnline} />
      
      <div className={`transition-all duration-300 ${!isOnline ? 'mt-10' : ''}`}>
        <Header 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen}
          isOnline={isOnline}
        />
        
        <MobileMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Search Section */}
          <section className="mb-8">
            <SearchBar />
          </section>

          {/* Stats Grid */}
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatsCard
                icon={User}
                title="Active Users"
                value="2.4K"
                change="+12%"
                color="from-blue-500 to-blue-600"
              />
              <StatsCard
                icon={Heart}
                title="Total Likes"
                value="18.2K"
                change="+8%"
                color="from-red-500 to-pink-600"
              />
              <StatsCard
                icon={MessageCircle}
                title="Comments"
                value="1.2K"
                change="+15%"
                color="from-green-500 to-emerald-600"
              />
              <StatsCard
                icon={Star}
                title="Rating"
                value="4.9"
                change="+0.2"
                color="from-yellow-500 to-orange-600"
              />
            </div>
          </section>

          {/* Content Grid */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Featured Content
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {cards.map((card, index) => (
                <Card key={index} {...card} />
              ))}
            </div>
          </section>

          {/* Load More Button */}
          <div className="text-center mt-8 sm:mt-12">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 touch-manipulation">
              Load More Content
            </button>
          </div>
        </main>

        <FloatingActionButton />
      </div>
    </div>
  );
}

export default App;