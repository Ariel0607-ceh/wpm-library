import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Manuscript } from '@/types';
import type { Chapter } from '@/types';
import type { ManuscriptInfo } from '@/types';
import { MANUSCRIPT_TYPES } from '@/lib/utils';

interface ManuscriptFormProps {
  manuscript?: Manuscript | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (manuscript: Omit<Manuscript, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function ManuscriptForm({ manuscript, isOpen, onClose, onSave }: ManuscriptFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasChapters, setHasChapters] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [displayMode, setDisplayMode] = useState<'continuous' | 'perChapter'>('continuous');
  const [info, setInfo] = useState<ManuscriptInfo>({
    title: '',
    year: '',
    author: '',
    origin: '',
    type: 'teks prosa',
    description: ''
  });
  const [activeTab, setActiveTab] = useState<'content' | 'info'>('content');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (manuscript) {
      setTitle(manuscript.title);
      setContent(manuscript.content || '');
      setHasChapters(manuscript.hasChapters);
      setChapters(manuscript.chapters || []);
      setDisplayMode(manuscript.displayMode);
      setInfo(manuscript.info);
    } else {
      resetForm();
    }
  }, [manuscript, isOpen]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setHasChapters(false);
    setChapters([]);
    setDisplayMode('continuous');
    setInfo({
      title: '',
      year: '',
      author: '',
      origin: '',
      type: 'teks prosa',
      description: ''
    });
    setErrors({});
    setActiveTab('content');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Tajuk diperlukan';
    }
    
    if (hasChapters) {
      if (chapters.length === 0) {
        newErrors.chapters = 'Sekurang-kurangnya satu bab diperlukan';
      } else {
        chapters.forEach((chapter, idx) => {
          if (!chapter.title.trim()) {
            newErrors[`chapter_${idx}_title`] = `Tajuk bab ${idx + 1} diperlukan`;
          }
          if (!chapter.content.trim()) {
            newErrors[`chapter_${idx}_content`] = `Kandungan bab ${idx + 1} diperlukan`;
          }
        });
      }
    } else {
      if (!content.trim()) {
        newErrors.content = 'Kandungan diperlukan';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    onSave({
      title,
      content: hasChapters ? undefined : content,
      hasChapters,
      chapters: hasChapters ? chapters : undefined,
      displayMode,
      info: { ...info, title }
    });
    
    resetForm();
    onClose();
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: `temp-${Date.now()}`,
      title: '',
      content: '',
      order: chapters.length
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapter = (index: number, updates: Partial<Chapter>) => {
    const updated = chapters.map((c, i) => 
      i === index ? { ...c, ...updates } : c
    );
    setChapters(updated);
  };

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const moveChapter = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === chapters.length - 1) return;
    
    const newChapters = [...chapters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newChapters[index], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[index]];
    setChapters(newChapters.map((c, i) => ({ ...c, order: i })));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#3a3a3a] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#d4af37] text-xl">
            {manuscript ? 'Kemaskini Naskhah' : 'Tambah Naskhah Baru'}
          </DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            {manuscript ? 'Kemaskini maklumat naskhah' : 'Isi maklumat naskhah baharu'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'info')}>
          <TabsList className="bg-[#2a2a2a] mb-4">
            <TabsTrigger 
              value="content" 
              className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Kandungan
            </TabsTrigger>
            <TabsTrigger 
              value="info"
              className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Maklumat
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Label className="text-[#d4af37] mb-2 block">Tajuk Naskhah *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan tajuk naskhah..."
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37]"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Has Chapters Toggle - Always visible */}
              <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                <div>
                  <Label className="text-[#f5f5dc]">Gunakan Bab</Label>
                  <p className="text-sm text-[#a0a0a0]">Bahagikan naskhah kepada beberapa bab</p>
                </div>
                <Switch
                  checked={hasChapters}
                  onCheckedChange={setHasChapters}
                  className="data-[state=checked]:bg-[#d4af37] data-[state=unchecked]:bg-[#3a3a3a]"
                />
              </div>

              {/* Display Mode (if has chapters) */}
              {hasChapters && (
                <div className="flex items-center justify-between p-4 bg-[#2a2a2a] rounded-lg border border-[#3a3a3a]">
                  <div>
                    <Label className="text-[#f5f5dc]">Gaya Paparan</Label>
                    <p className="text-sm text-[#a0a0a0]">Pilih cara paparan naskhah secara</p>
                  </div>
                  <Tabs value={displayMode} onValueChange={(v) => setDisplayMode(v as 'continuous' | 'perChapter')}>
                    <TabsList className="bg-[#1a1a1a]">
                      <TabsTrigger 
                        value="continuous"
                        className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]"
                      >
                        Berterusan
                      </TabsTrigger>
                      <TabsTrigger 
                        value="perChapter"
                        className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]"
                      >
                        Sefasal
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}

              {/* Content Input */}
              {!hasChapters ? (
                <div>
                  <Label className="text-[#d4af37] mb-2 block">Kandungan *</Label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Masukkan kandungan naskhah..."
                    className="w-full p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] min-h-[300px]"
                  />
                  {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#d4af37]">Senarai Bab *</Label>
                    <Button onClick={addChapter} variant="outline" size="sm" className="border-[#d4af37] text-[#d4af37]">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Bab
                    </Button>
                  </div>
                  
                  {errors.chapters && <p className="text-red-400 text-sm">{errors.chapters}</p>}
                  
                  <div className="space-y-4">
                    {chapters.map((chapter, index) => (
                      <Card key={chapter.id} className="bg-[#2a2a2a] border-[#3a3a3a]">
                        <CardContent className="p-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-[#a0a0a0]" />
                            <span className="text-[#d4af37] font-medium">Bab {index + 1}</span>
                            <div className="flex-1" />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveChapter(index, 'up')}
                              disabled={index === 0}
                              className="h-7 w-7 text-[#a0a0a0]"
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveChapter(index, 'down')}
                              disabled={index === chapters.length - 1}
                              className="h-7 w-7 text-[#a0a0a0]"
                            >
                              ↓
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeChapter(index)}
                              className="h-7 w-7 text-red-400 hover:bg-red-400/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div>
                            <Input
                              value={chapter.title}
                              onChange={(e) => updateChapter(index, { title: e.target.value })}
                              placeholder="Tajuk bab..."
                              className="bg-[#1a1a1a] border-[#3a3a3a] text-[#f5f5dc] placeholder:text-[#666]"
                            />
                            {errors[`chapter_${index}_title`] && (
                              <p className="text-red-400 text-sm mt-1">{errors[`chapter_${index}_title`]}</p>
                            )}
                          </div>
                          
                          <textarea
                            value={chapter.content}
                            onChange={(e) => updateChapter(index, { content: e.target.value })}
                            placeholder="Kandungan bab..."
                            className="w-full p-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-md text-[#f5f5dc] placeholder:text-[#666] min-h-[150px]"
                          />
                          {errors[`chapter_${index}_content`] && (
                            <p className="text-red-400 text-sm">{errors[`chapter_${index}_content`]}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <Label className="text-[#d4af37] mb-2 block">Jenis Naskhah *</Label>
                <select
                  value={info.type}
                  onChange={(e) => setInfo({ ...info, type: e.target.value as ManuscriptInfo['type'] })}
                  className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-[#f5f5dc] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                >
                  {MANUSCRIPT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label className="text-[#d4af37] mb-2 block">Tahun</Label>
                <Input
                  value={info.year}
                  onChange={(e) => setInfo({ ...info, year: e.target.value })}
                  placeholder="Contoh: 1400-an, 1612"
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37]"
                />
              </div>
              
              <div>
                <Label className="text-[#d4af37] mb-2 block">Pengarang</Label>
                <Input
                  value={info.author}
                  onChange={(e) => setInfo({ ...info, author: e.target.value })}
                  placeholder="Nama pengarang..."
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37]"
                />
              </div>
              
              <div>
                <Label className="text-[#d4af37] mb-2 block">Asal</Label>
                <Input
                  value={info.origin}
                  onChange={(e) => setInfo({ ...info, origin: e.target.value })}
                  placeholder="Contoh: Melaka, Patani, Kedah..."
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37]"
                />
              </div>
              
              <div>
                <Label className="text-[#d4af37] mb-2 block">Keterangan</Label>
                <textarea
                  value={info.description}
                  onChange={(e) => setInfo({ ...info, description: e.target.value })}
                  placeholder="Keterangan ringkas tentang naskhah..."
                  className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-[#f5f5dc] placeholder:text-[#666] min-h-[100px]"
                />
              </div>
            </div>
          )}
        </Tabs>

        {/* Actions */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-[#3a3a3a]">
          <Button onClick={handleSave} className="flex-1 gold-button">
            {manuscript ? 'Kemaskini' : 'Simpan'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex-1 border-[#3a3a3a] text-[#f5f5dc] hover:bg-[#3a3a3a]"
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
