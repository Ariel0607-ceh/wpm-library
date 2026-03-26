import { BookOpen, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  onContinueAsGuest: () => void;
  onLoginAsAdmin: () => void;
}

export function LandingPage({ onContinueAsGuest, onLoginAsAdmin }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c9a227]/5 rounded-full blur-3xl" />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-28 h-28 rounded-full gold-gradient flex items-center justify-center shadow-lg shadow-[#d4af37]/30">
            <BookOpen className="w-14 h-14 text-[#0a0a0a]" />
          </div>
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-4xl md:text-5xl font-bold gold-gradient-text mb-4">
          Selamat Datang
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#f5f5dc] mb-6">
          ke Warisan Kesusasteraan Melayu Klasik
        </h2>
        
        <p className="text-[#a0a0a0] text-lg mb-2">
          Wisma Pustaka Melayu
        </p>
        <p className="text-[#666] text-sm mb-12">
          Dibangunkan oleh Tengku Lafuan
        </p>
        
        {/* Description */}
        <div className="mb-12 px-4">
          <p className="text-[#a0a0a0] leading-relaxed">
            Terokai khazanah manuskrip Melayu yang berharga, dari hikayat klasik hingga sejarah kerajaan. 
            Baca, pelajari, dan hayati warisan budaya kita yang kaya.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onContinueAsGuest}
            className="gold-button h-14 px-8 text-lg"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Sambung sebagai Tetamu
          </Button>
          
          <Button
            variant="outline"
            onClick={onLoginAsAdmin}
            className="h-14 px-8 text-lg border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0a0a0a]"
          >
            <User className="w-5 h-5 mr-2" />
            Log Masuk Pentadbir
          </Button>
        </div>
        
        {/* Footer Quote */}
        <div className="mt-16 pt-8 border-t border-[#3a3a3a]">
          <p className="text-[#d4af37] italic text-sm">
            "Memelihara khazanah kesusasteraan Melayu untuk generasi akan datang"
          </p>
        </div>
      </div>
    </div>
  );
}
