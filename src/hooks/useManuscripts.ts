import { useState, useEffect, useCallback } from 'react';
import type { Manuscript } from '@/types';

const STORAGE_KEY = 'wpm_manuscripts';

const SAMPLE_MANUSCRIPTS: Manuscript[] = [
  {
    id: '1',
    title: 'Hikayat Hang Tuah',
    hasChapters: true,
    displayMode: 'perChapter',
    chapters: [
      { id: 'c1', title: 'Bab 1: Kelahiran Hang Tuah', content: 'Pada zaman dahulu, di sebuah kampung bernama Kampung Bendahara, lahirlah seorang anak lelaki yang amat gagah berani. Anak itu dinamakan Hang Tuah. Sejak kecil lagi, Hang Tuah menunjukkan kebijaksanaan yang luar biasa. Beliau belajar ilmu silat dari guru-guru terbaik di Melaka.', order: 1 },
      { id: 'c2', title: 'Bab 2: Hang Tuah Ke Melaka', content: 'Hang Tuah bersama empat sahabatnya, Hang Jebat, Hang Kasturi, Hang Lekir, dan Hang Lekiu berkelana ke Melaka untuk mencari nama. Di sana, mereka bertemu dengan Bendahara dan menunjukkan kebolehan mereka dalam ilmu persilatan.', order: 2 },
      { id: 'c3', title: 'Bab 3: Menjadi Laksamana', content: 'Kerana kebijaksanaan dan kesetiaannya, Hang Tuah dilantik menjadi Laksamana oleh Sultan Melaka. Beliau memimpin tentera laut Melaka dengan penuh keberanian dan berjaya mempertahankan kerajaan daripada serangan musuh.', order: 3 }
    ],
    info: {
      title: 'Hikayat Hang Tuah',
      year: '1700-an',
      author: 'Tidak diketahui',
      origin: 'Melaka/Kesultanan Melayu',
      type: 'teks prosa',
      description: 'Kisah kepahlawanan Hang Tuah, Laksamana Melaka yang setia kepada sultan.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Sejarah Melayu',
    hasChapters: true,
    displayMode: 'continuous',
    chapters: [
      { id: 'c1', title: 'Asal-usul Raja-raja Melayu', content: 'Bermulalah cerita ini dengan keturunan Raja-raja Melayu yang berasal dari Palembang. Sang Sapurba, sang Nila Utama, dan keturunan mereka yang membuka negeri-negeri di Nusantara.', order: 1 },
      { id: 'c2', title: 'Pembukaan Singapura', content: 'Sang Nila Utama berlayar ke sebuah pulau dan melihat seekor singa. Beliau menamakan pulau itu Singapura dan membuka kota di sana.', order: 2 }
    ],
    info: {
      title: 'Sejarah Melayu',
      year: '1612',
      author: 'Tun Sri Lanang',
      origin: 'Kesultanan Johor',
      type: 'teks prosa',
      description: 'Karya sejarah Melayu yang menceritakan asal-usul keturunan raja-raja Melayu.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Hikayat Raja-raja Pasai',
    hasChapters: false,
    displayMode: 'continuous',
    content: 'Al-kisah maka tersebutlah perkataan negeri Pasai yang amat terkenal itu. Bermulalah cerita ini dengan raja yang pertama bernama Merah Silu. Pada suatu malam, Merah Silu bermimpi bertemu dengan seorang puteri yang amat jelita. Puteri itu memberitahu bahawa negeri Pasai akan menjadi negeri yang besar dan terkenal dengan agama Islam. Sesudah itu, Merah Silu pun memeluk agama Islam dan dinamakan Sultan Malikul Saleh. Baginda memerintah dengan adil dan saksama, membawa kemakmuran kepada negeri Pasai.',
    info: {
      title: 'Hikayat Raja-raja Pasai',
      year: '1300-an',
      author: 'Tidak diketahui',
      origin: 'Kesultanan Pasai',
      type: 'teks prosa',
      description: 'Kisah raja-raja Pasai dan penyebaran Islam di Sumatera.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Hikayat Patani',
    hasChapters: true,
    displayMode: 'perChapter',
    chapters: [
      { id: 'c1', title: 'Bab 1: Asal-usul Patani', content: 'Negeri Patani terletak di pantai timur tanah Melayu. Dahulunya negeri ini dipanggil Negara Patani dan diperintah oleh seorang raja yang beragama Islam.', order: 1 },
      { id: 'c2', title: 'Bab 2: Ratu Hijau', content: 'Ratu Hijau adalah seorang ratu yang bijaksana memerintah Patani. Beliau memperkukuhkan negeri dan menjalin hubungan dagang dengan negeri-negeri lain.', order: 2 }
    ],
    info: {
      title: 'Hikayat Patani',
      year: '1600-an',
      author: 'Tidak diketahui',
      origin: 'Kesultanan Patani',
      type: 'teks prosa',
      description: 'Sejarah kesultanan Patani dan pemerintahan ratu-ratunya.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Hikayat Merong Mahawangsa',
    hasChapters: false,
    displayMode: 'continuous',
    content: 'Hikayat ini menceritakan tentang Merong Mahawangsa, seorang raja dari negeri Rum yang datang ke tanah Melayu. Beliau membuka negeri Kedah dan memerintah dengan adil. Kisah ini penuh dengan keajaiban dan kepahlawanan. Merong Mahawangsa mempunyai tiga orang putera yang masing-masing menjadi raja di negeri-negeri berbeza. Putera sulung menjadi raja di Kedah, putera kedua di Perak, dan putera bongsu di Johor.',
    info: {
      title: 'Hikayat Merong Mahawangsa',
      year: '1500-an',
      author: 'Tidak diketahui',
      origin: 'Kedah',
      type: 'teks prosa',
      description: 'Kisah asal-usul negeri Kedah dan keturunan raja-rajanya.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Hikayat Bayan Budiman',
    hasChapters: true,
    displayMode: 'continuous',
    chapters: [
      { id: 'c1', title: 'Bab 1: Khojah Maimun', content: 'Khojah Maimun adalah seorang saudagar kaya yang bijaksana. Beliau mempunyai seekor burung bayan yang boleh berkata-kata dan memberi nasihat.', order: 1 },
      { id: 'c2', title: 'Bab 2: Nasihat Bayan', content: 'Burung bayan itu selalu memberi nasihat kepada tuannya tentang kebaikan dan keburukan. Setiap nasihatnya mengandungi hikmah yang mendalam.', order: 2 }
    ],
    info: {
      title: 'Hikayat Bayan Budiman',
      year: '1371',
      author: 'Tidak diketahui',
      origin: 'India/ Melayu',
      type: 'teks prosa',
      description: 'Kisah burung bayan yang memberi nasihat kepada tuannya.'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function useManuscripts() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setManuscripts(JSON.parse(stored));
      } catch {
        setManuscripts(SAMPLE_MANUSCRIPTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MANUSCRIPTS));
      }
    } else {
      setManuscripts(SAMPLE_MANUSCRIPTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MANUSCRIPTS));
    }
    setIsLoading(false);
  }, []);

  const saveManuscripts = useCallback((newManuscripts: Manuscript[]) => {
    setManuscripts(newManuscripts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newManuscripts));
  }, []);

  const addManuscript = useCallback((manuscript: Omit<Manuscript, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newManuscript: Manuscript = {
      ...manuscript,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...manuscripts, newManuscript];
    saveManuscripts(updated);
    return newManuscript;
  }, [manuscripts, saveManuscripts]);

  const updateManuscript = useCallback((id: string, updates: Partial<Manuscript>) => {
    const updated = manuscripts.map(m => 
      m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
    );
    saveManuscripts(updated);
  }, [manuscripts, saveManuscripts]);

  const deleteManuscript = useCallback((id: string) => {
    const updated = manuscripts.filter(m => m.id !== id);
    saveManuscripts(updated);
  }, [manuscripts, saveManuscripts]);

  const getManuscriptById = useCallback((id: string) => {
    return manuscripts.find(m => m.id === id);
  }, [manuscripts]);

  const searchManuscripts = useCallback((query: string) => {
    if (!query.trim()) return manuscripts;
    
    const lowerQuery = query.toLowerCase();
    return manuscripts.filter(m => {
      const inTitle = m.title.toLowerCase().includes(lowerQuery);
      const inContent = m.content?.toLowerCase().includes(lowerQuery) || 
        m.chapters?.some(c => c.content.toLowerCase().includes(lowerQuery));
      return inTitle || inContent;
    });
  }, [manuscripts]);

  const sortManuscripts = useCallback((option: 'alphabet' | 'chronological') => {
    const sorted = [...manuscripts];
    if (option === 'alphabet') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'ms'));
    } else {
      sorted.sort((a, b) => {
        const yearA = parseInt(a.info.year?.replace(/[^0-9]/g, '') || '0');
        const yearB = parseInt(b.info.year?.replace(/[^0-9]/g, '') || '0');
        return yearA - yearB;
      });
    }
    return sorted;
  }, [manuscripts]);

  return {
    manuscripts,
    isLoading,
    addManuscript,
    updateManuscript,
    deleteManuscript,
    getManuscriptById,
    searchManuscripts,
    sortManuscripts
  };
}
