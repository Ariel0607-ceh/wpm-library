import { BookOpen, Scroll, Feather, Globe, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function About() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center py-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-[#0a0a0a]" />
          </div>
        </div>
        <h2 className="text-3xl font-bold gold-gradient-text mb-2">Tentang Kami</h2>
        <p className="text-[#a0a0a0] text-lg">Wisma Pustaka Melayu</p>
      </div>

      {/* Main Content */}
      <Card className="majestic-card">
        <CardContent className="p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-[#f5f5dc] text-lg leading-relaxed mb-6">
              Selamat datang ke wisma keramat kami untuk khazanah kesusasteraan Melayu Klasik. 
              Misi kami ringkas tetapi mendalam: menjadikan manuskrip Melayu yang jarang, indah, 
              dan amat bernilai dari segi sejarah dapat dimiliki dan dibaca oleh semua—tanpa bayaran.
            </p>
            
            <p className="text-[#f5f5dc] leading-relaxed mb-6">
              Manuskrip Melayu Klasik tersebar di seluruh dunia, sering tersorok di arkib, 
              perpustakaan, atau koleksi peribadi. Ramai yang terkunci di sebalik bayaran atau 
              sukar diperoleh kerana jarak, halangan bahasa, atau cabaran pemeliharaan. Malah 
              apabila seseorang memilikinya, teks-teks ini sering memerlukan transliterasi dan 
              semakan teliti untuk menyingkap ilmu yang terkandung.
            </p>
            
            <p className="text-[#f5f5dc] leading-relaxed mb-6">
              Kami menubuhkan wisma keramat ini kerana percaya bahawa warisan kesusasteraan, 
              bahasa, dan pemikiran Melayu tidak wajar terhad kepada golongan tertentu sahaja. 
              Setiap manuskrip yang kami simpan memegang suara, cerita, dan kebijaksanaan dari 
              generasi terdahulu—suara yang wajar didengar, dikaji, dan dihargai.
            </p>
            
            <p className="text-[#f5f5dc] leading-relaxed mb-6">
              Matlamat kami ialah memupuk minat membaca, rasa ingin tahu, dan penghargaan terhadap 
              budaya Melayu Klasik. Sama ada anda seorang sarjana, pelajar, atau pembaca yang gemar 
              menelaah, koleksi kami mengajak anda menyingkap dunia sejarah, puisi, dan falsafah 
              yang telah membentuk identiti Melayu selama berabad-abad.
            </p>
            
            <p className="text-[#f5f5dc] leading-relaxed">
              Dengan menjadikan manuskrip ini dapat dibaca oleh semua, kami berharap dapat 
              mengilhamkan generasi baru untuk kembali menghubungkan diri dengan akar budaya mereka, 
              menemui semula pengetahuan yang terlupa, dan turut serta dalam memelihara khazanah 
              kesusasteraan kita yang kaya.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FeatureCard 
          icon={Scroll}
          title="Koleksi Klasik"
          description="Akses kepada manuskrip Melayu bersejarah yang terpelihara"
        />
        <FeatureCard 
          icon={Feather}
          title="Kamus Digital"
          description="Ketahui maksud perkataan-perkataan klasik Melayu"
        />
        <FeatureCard 
          icon={Globe}
          title="Akses Percuma"
          description="Baca tanpa sebarang bayaran atau pendaftaran"
        />
        <FeatureCard 
          icon={Heart}
          title="Warisan Kita"
          description="Memelihara khazanah kesusasteraan untuk generasi akan datang"
        />
      </div>

      {/* Footer Quote */}
      <div className="text-center py-8 border-t border-[#3a3a3a]">
        <p className="text-[#d4af37] text-xl italic font-serif">
          "Sertailah kami meraikan legasi kesusasteraan Melayu Klasik—
        </p>
        <p className="text-[#d4af37] text-xl italic font-serif">
          sebuah perjalanan menembusi masa, tinta, dan imaginasi."
        </p>
        <p className="text-[#a0a0a0] mt-4">— Wisma Pustaka Melayu</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: typeof Scroll; title: string; description: string }) {
  return (
    <Card className="majestic-card text-center">
      <CardContent className="p-6">
        <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6 text-[#d4af37]" />
        </div>
        <h3 className="text-lg font-semibold text-[#f5f5dc] mb-2">{title}</h3>
        <p className="text-sm text-[#a0a0a0]">{description}</p>
      </CardContent>
    </Card>
  );
}
