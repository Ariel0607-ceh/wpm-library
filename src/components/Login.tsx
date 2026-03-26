import { useState } from 'react';
import { BookOpen, Lock, User, X, Eye, EyeOff } from 'lucide-react'; // Add Eye, EyeOff
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginProps {
  onLogin: (username: string, password: string) => boolean;
  onClose: () => void;
  onClearError: () => void; // ADD THIS PROP
  error: string | null;
}

export function Login({ onLogin, onClose, onClearError, error }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For eye toggle
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler for username - clears error on any change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) onClearError(); // Clear error immediately on any change
  };

  // Handler for password - clears error on any change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) onClearError(); // Clear error immediately on any change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    setIsSubmitting(true);
    const success = onLogin(username, password);
    if (!success) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c9a227]/5 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md majestic-card gold-shadow relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a0a0a0] hover:text-[#f5f5dc]"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-[#0a0a0a]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold gold-gradient-text">
            Log Masuk Pentadbir
          </CardTitle>
          <CardDescription className="text-[#a0a0a0] text-lg mt-2">
            Akses khas untuk pentadbir sahaja
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[#d4af37] text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Nama Pengguna
              </label>
              <Input
                type="text"
                value={username}
                onChange={handleUsernameChange} // Use new handler
                placeholder="Masukkan nama pengguna"
                className="bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37] focus:ring-[#d4af37]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[#d4af37] text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Kata Laluan
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange} // Use new handler
                  placeholder="Masukkan kata laluan"
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37] focus:ring-[#d4af37] pr-10"
                />
                {/* Eye Icon - Always visible with absolute positioning */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-[#d4af37] transition-colors focus:outline-none"
                  tabIndex={-1} // Prevent tab focus
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Error message positioned below password field */}
            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 text-red-300">
                <AlertDescription className="text-sm font-medium text-center">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting || !username.trim() || !password.trim()}
              className="w-full gold-button h-12 text-lg"
            >
              {isSubmitting ? 'Sedang Log Masuk...' : 'Log Masuk'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}