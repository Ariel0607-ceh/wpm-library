import { useState, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Copy, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Manuscript } from '@/types';
import type { DictionaryEntry } from '@/types';
import type { ReadingSettings } from '@/types';
import { getFullText, countWords } from '@/lib/utils';

interface ManuscriptReaderProps {
  manuscript: Manuscript;
  settings: ReadingSettings;
  onUpdateSettings: (settings: Partial<ReadingSettings>) => void;
  onUpdateManuscript: (id: string, updates: Partial<Manuscript>) => void;
  onBack: () => void;
  dictionary: DictionaryEntry[];
  isAdmin: boolean;
}

export function ManuscriptReader({ 
  manuscript, 
  settings, 
  onUpdateSettings, 
  onUpdateManuscript,
  onBack,
  dictionary,
  isAdmin
}: ManuscriptReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [displayMode, setDisplayMode] = useState(manuscript.displayMode);

  const dictionaryMap = useMemo(() => {
    const map = new Map<string, string>();
    dictionary.forEach(entry => {
      map.set(entry.word.toLowerCase(), entry.meaning);
    });
    return map;
  }, [dictionary]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFullText(manuscript));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDisplayModeChange = (mode: 'continuous' | 'perChapter') => {
    setDisplayMode(mode);
    if (isAdmin) {
      onUpdateManuscript(manuscript.id, { displayMode: mode });
    }
  };

  const renderText = (text: string) => {
    const words = text.split(/(\s+)/);
    return words.map((word, i) => {
      const cleanWord = word.toLowerCase().replace(/[^a-zA-Z]/g, '');
      const meaning = dictionaryMap.get(cleanWord);
      
      if (meaning) {
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span className="word-hover text-[#d4af37] border-b border-dotted border-[#d4af37]">
                {word}
              </span>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-[#1a1a1a] border-[#d4af37] text-[#f5f5dc] max-w-xs"
            >
              <p className="font-semibold text-[#d4af37]">{cleanWord}</p>
              <p className="text-sm">{meaning}</p>
            </TooltipContent>
          </Tooltip>
        );
      }
      
      return <span key={i}>{word}</span>;
    });
  };

  const chapters = manuscript.hasChapters ? manuscript.chapters || [] : [];
  const hasMultipleChapters = chapters.length > 1;
  const displayPerChapter = displayMode === 'perChapter' && hasMultipleChapters;

  const currentContent = displayPerChapter 
    ? chapters[currentChapter]?.content 
    : getFullText(manuscript);

  const currentTitle = displayPerChapter
    ? chapters[currentChapter]?.title
    : manuscript.title;

  const wordCount = countWords(manuscript);

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-[#a0a0a0] hover:text-[#d4af37] hover:bg-[#d4af37]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h2 className="text-xl font-bold text-[#f5f5dc]">{manuscript.title}</h2>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfo(true)}
              className="border-[#3a3a3a] text-[#a0a0a0] hover:text-[#d4af37] hover:border-[#d4af37]"
            >
              <Info className="w-4 h-4 mr-2" />
              Maklumat
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-[#3a3a3a] text-[#a0a0a0] hover:text-[#d4af37] hover:border-[#d4af37]"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Disalin' : 'Salin'}
            </Button>
          </div>
        </div>

        {/* Reading Controls */}
        <Card className="majestic-card">
          <CardContent className="p-4 space-y-6">
            {/* Display Mode Toggle */}
            {manuscript.hasChapters && hasMultipleChapters && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 border-b border-[#3a3a3a]">
                <div className="flex flex-col">
                  <span className="text-[#d4af37] font-semibold">Gaya Paparan</span>
                  <span className="text-sm text-[#a0a0a0]">Pilih cara paparan naskhah secara</span>
                </div>
                <Tabs value={displayMode} onValueChange={(v) => handleDisplayModeChange(v as 'continuous' | 'perChapter')} className="ml-auto">
                  <TabsList className="bg-[#2a2a2a]">
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

            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              {/* Font Size */}
              <div className="flex items-center gap-3 flex-1 w-full lg:w-auto">
                <Type className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm text-[#a0a0a0] w-20">Saiz Fon:</span>
                <div className="flex-1 px-2">
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([v]) => onUpdateSettings({ fontSize: v })}
                    min={12}
                    max={32}
                    step={1}
                    className="w-full [&_[role=slider]]:bg-[#d4af37] [&_[role=slider]]:border-[#d4af37] [&_.bg-primary]:bg-[#d4af37] [&_[data-orientation=horizontal]]:bg-[#3a3a3a]"
                  />
                </div>
                <span className="text-sm text-[#f5f5dc] w-10">{settings.fontSize}px</span>
              </div>

              {/* Line Height */}
              <div className="flex items-center gap-3 flex-1 w-full lg:w-auto">
                <span className="text-sm text-[#a0a0a0] w-24">Jarak Baris:</span>
                <div className="flex-1 px-2">
                  <Slider
                    value={[settings.lineHeight]}
                    onValueChange={([v]) => onUpdateSettings({ lineHeight: v })}
                    min={1.2}
                    max={3}
                    step={0.1}
                    className="w-full [&_[role=slider]]:bg-[#d4af37] [&_[role=slider]]:border-[#d4af37] [&_.bg-primary]:bg-[#d4af37] [&_[data-orientation=horizontal]]:bg-[#3a3a3a]"
                  />
                </div>
                <span className="text-sm text-[#f5f5dc] w-10">{settings.lineHeight.toFixed(1)}</span>
              </div>

              {/* Text Align */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateSettings({ textAlign: 'left' })}
                  className={settings.textAlign === 'left' ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a0a0a0]'}
                >
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateSettings({ textAlign: 'center' })}
                  className={settings.textAlign === 'center' ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a0a0a0]'}
                >
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateSettings({ textAlign: 'right' })}
                  className={settings.textAlign === 'right' ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a0a0a0]'}
                >
                  <AlignRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateSettings({ textAlign: 'justify' })}
                  className={settings.textAlign === 'justify' ? 'text-[#d4af37] bg-[#d4af37]/10' : 'text-[#a0a0a0]'}
                >
                  <AlignJustify className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapter Navigation */}
        {displayPerChapter && hasMultipleChapters && (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentChapter(c => Math.max(0, c - 1))}
              disabled={currentChapter === 0}
              className="border-[#3a3a3a] text-[#f5f5dc] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Fasal Sebelumnya
            </Button>
            
            <span className="text-[#d4af37]">
              Fasal {currentChapter + 1} dari {chapters.length}
            </span>
            
            <Button
              variant="outline"
              onClick={() => setCurrentChapter(c => Math.min(chapters.length - 1, c + 1))}
              disabled={currentChapter === chapters.length - 1}
              className="border-[#3a3a3a] text-[#f5f5dc] disabled:opacity-50"
            >
              Fasal Seterusnya
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Content */}
        <Card className="majestic-card ornate-border">
          <CardContent className="p-8">
            {displayPerChapter && currentTitle && (
              <h3 className="text-2xl font-bold text-[#d4af37] mb-6 text-center">
                {currentTitle}
              </h3>
            )}
            
            <div
              className="reading-text text-[#f5f5dc]"
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                textAlign: settings.textAlign
              }}
            >
              {displayPerChapter ? (
                renderText(currentContent || '')
              ) : manuscript.hasChapters && manuscript.chapters ? (
                manuscript.chapters.map((chapter, idx) => (
                  <div key={chapter.id} className={idx > 0 ? 'mt-8 pt-8 border-t border-[#3a3a3a]' : ''}>
                    <h4 className="text-xl font-bold text-[#d4af37] mb-4">{chapter.title}</h4>
                    <div className="mb-6">{renderText(chapter.content)}</div>
                  </div>
                ))
              ) : (
                renderText(manuscript.content || '')
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Dialog */}
        <Dialog open={showInfo} onOpenChange={setShowInfo}>
          <DialogContent className="bg-[#1a1a1a] border-[#3a3a3a] max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-[#d4af37] text-xl">
                {manuscript.info.title}
              </DialogTitle>
              <DialogDescription className="text-[#a0a0a0]">
                Maklumat Naskhah
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 mt-4">
              {manuscript.info.year && (
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Tahun:</span>
                  <span className="text-[#f5f5dc]">{manuscript.info.year}</span>
                </div>
              )}
              {manuscript.info.author && (
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Pengarang:</span>
                  <span className="text-[#f5f5dc]">{manuscript.info.author}</span>
                </div>
              )}
              {manuscript.info.origin && (
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Asal:</span>
                  <span className="text-[#f5f5dc]">{manuscript.info.origin}</span>
                </div>
              )}
              {manuscript.info.type && (
                <div className="flex justify-between">
                  <span className="text-[#a0a0a0]">Jenis:</span>
                  <span className="text-[#f5f5dc]">{manuscript.info.type}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#a0a0a0]">Jumlah Perkataan:</span>
                <span className="text-[#f5f5dc]">{wordCount.toLocaleString()}</span>
              </div>
              
              {manuscript.info.description && (
                <div className="pt-4 border-t border-[#3a3a3a]">
                  <p className="text-[#a0a0a0] text-sm mb-2">Keterangan:</p>
                  <p className="text-[#f5f5dc]">{manuscript.info.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
