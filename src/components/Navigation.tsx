import { BookOpen, LogOut, User as UserIcon, Library, BookMarked, Info, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';

interface NavigationProps {
  currentUser: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  currentView: 'list' | 'dictionary' | 'about';
  onChangeView: (view: 'list' | 'dictionary' | 'about') => void;
}

export function Navigation({ currentUser, onLogout, onLoginClick, currentView, onChangeView }: NavigationProps) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#3a3a3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onChangeView('list')}>
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#0a0a0a]" />
            </div>
            <div>
              <h1 className="text-xl font-bold gold-gradient-text">WPM</h1>
              <p className="text-xs text-[#a0a0a0]">Wisma Pustaka Melayu</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => onChangeView('list')}
              className={`flex items-center gap-2 ${
                currentView === 'list' 
                  ? 'text-[#d4af37] bg-[#d4af37]/10' 
                  : 'text-[#f5f5dc] hover:text-[#d4af37] hover:bg-[#d4af37]/10'
              }`}
            >
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Senarai Naskhah</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onChangeView('dictionary')}
              className={`flex items-center gap-2 ${
                currentView === 'dictionary' 
                  ? 'text-[#d4af37] bg-[#d4af37]/10' 
                  : 'text-[#f5f5dc] hover:text-[#d4af37] hover:bg-[#d4af37]/10'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              <span className="hidden sm:inline">Kamus</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => onChangeView('about')}
              className={`flex items-center gap-2 ${
                currentView === 'about' 
                  ? 'text-[#d4af37] bg-[#d4af37]/10' 
                  : 'text-[#f5f5dc] hover:text-[#d4af37] hover:bg-[#d4af37]/10'
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Tentang Kami</span>
            </Button>
          </div>

          {/* User Info & Login/Logout */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <div className="flex items-center gap-2 text-[#f5f5dc] px-3 py-1 bg-[#d4af37]/20 rounded-full">
                  <UserIcon className="w-4 h-4 text-[#d4af37]" />
                  <span className="hidden sm:inline text-sm">{currentUser.username}</span>
                  <span className="px-2 py-0.5 text-xs bg-[#d4af37] text-[#0a0a0a] rounded-full font-medium">
                    Pentadbir
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-[#a0a0a0] hover:text-red-400 hover:bg-red-400/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onLoginClick}
                className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0a]"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Log Masuk Pentadbir</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
