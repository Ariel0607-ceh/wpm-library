import { useState, useMemo } from 'react';
import { Search, BookOpen, Calendar, User as UserIcon, MapPin, FileText, Plus, Edit, Trash2, Info, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { Manuscript } from '@/types';
import type { SortOption } from '@/types';
import { getCenturyFromYear, countWords, MANUSCRIPT_TYPES } from '@/lib/utils';

interface ManuscriptListProps {
  manuscripts: Manuscript[];
  isAdmin: boolean;
  onSelectManuscript: (manuscript: Manuscript) => void;
  onAddManuscript: () => void;
  onEditManuscript: (manuscript: Manuscript) => void;
  onDeleteManuscript: (id: string) => void;
}

export function ManuscriptList({ manuscripts, isAdmin, onSelectManuscript, onAddManuscript, onEditManuscript, onDeleteManuscript }: ManuscriptListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('alphabet');
  const [selectedInfo, setSelectedInfo] = useState<Manuscript | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredManuscripts = useMemo(() => {
    if (!searchQuery.trim()) return manuscripts;
    const lowerQuery = searchQuery.toLowerCase();
    return manuscripts.filter(m => m.title.toLowerCase().includes(lowerQuery));
  }, [manuscripts, searchQuery]);

  const groupedByLetter = useMemo(() => {
    const groups: Record<string, Manuscript[]> = {};
    for (let i = 65; i <= 90; i++) groups[String.fromCharCode(i)] = [];
    manuscripts.forEach(m => {  // 👈 Use manuscripts (all) not filteredManuscripts
      const firstLetter = m.title.charAt(0).toUpperCase();
      if (groups[firstLetter]) groups[firstLetter].push(m);
    });
    return groups;
  }, [manuscripts]); // 👈 Dependency on manuscripts only, not filteredManuscripts

  const groupedByCentury = useMemo(() => {
    const groups: Record<string, Manuscript[]> = {};
    filteredManuscripts.forEach(m => {
      const century = getCenturyFromYear(m.info.year || '');
      if (!groups[century]) groups[century] = [];
      groups[century].push(m);
    });
    return groups;
  }, [filteredManuscripts]);

  const groupedByType = useMemo(() => {
    const groups: Record<string, Manuscript[]> = {};
    MANUSCRIPT_TYPES.forEach(type => groups[type.label] = []);
    groups['Lain-lain'] = [];
    filteredManuscripts.forEach(m => {
      const typeLabel = MANUSCRIPT_TYPES.find(t => t.value === m.info.type)?.label || 'Lain-lain';
      if (!groups[typeLabel]) groups[typeLabel] = [];
      groups[typeLabel].push(m);
    });
    return groups;
  }, [filteredManuscripts]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#f5f5dc]">Senarai Naskhah</h2>
          <p className="text-[#a0a0a0]">Koleksi teks Melayu klasik</p>
        </div>
        {isAdmin && <Button onClick={onAddManuscript} className="gold-button"><Plus className="w-4 h-4 mr-2" />Tambah Naskhah</Button>}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0a0a0]" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari mengikut tajuk..." className="pl-10 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5dc]" />
      </div>

      <Tabs value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
        <TabsList className="bg-[#2a2a2a]">
          <TabsTrigger value="alphabet" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]">Abjad</TabsTrigger>
          <TabsTrigger value="chronological" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]">Kronologi</TabsTrigger>
          <TabsTrigger value="type" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a0a0a]">Jenis</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="text-[#a0a0a0] text-sm">
        {searchQuery.trim() ? `${filteredManuscripts.length} hasil carian` : `${manuscripts.length} naskhah tersedia`}
      </div>

      {/* SEARCH MODE: Show results without A-Z letters */}
      {searchQuery.trim() && (
        <div className="animate-fade-in">
          {filteredManuscripts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-16 h-16 text-[#3a3a3a] mb-4" />
              <p className="text-[#a0a0a0] text-lg">Tiada naskhah tersedia</p>
              <p className="text-[#666] text-sm mt-2">Tiada hasil carian untuk "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredManuscripts.map((m) => (
                <ManuscriptCard 
                  key={m.id} 
                  manuscript={m} 
                  isAdmin={isAdmin} 
                  onSelect={() => onSelectManuscript(m)} 
                  onEdit={() => onEditManuscript(m)} 
                  onDelete={() => setDeleteConfirm(m.id)} 
                  onInfo={() => setSelectedInfo(m)} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* NORMAL MODE: Show A-Z sections (only when not searching) */}
      {!searchQuery.trim() && sortOption === 'alphabet' && (
        <div className="space-y-8">
          {Object.entries(groupedByLetter).map(([letter, items]) => (
            <div key={letter} id={`section-${letter}`}>
              <h3 className="text-2xl font-bold text-[#d4af37] mb-4 border-b border-[#3a3a3a] pb-2">{letter}</h3>
              {items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((m) => (
                    <ManuscriptCard 
                      key={m.id} 
                      manuscript={m} 
                      isAdmin={isAdmin} 
                      onSelect={() => onSelectManuscript(m)} 
                      onEdit={() => onEditManuscript(m)} 
                      onDelete={() => setDeleteConfirm(m.id)} 
                      onInfo={() => setSelectedInfo(m)} 
                    />
                  ))}
                </div>
              ) : (
                // 👇 Fixed: Added BookOpen icon for empty letters
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="w-12 h-12 text-[#3a3a3a] mb-3" />
                  <p className="text-[#666] text-sm">Tiada naskhah tersedia</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!searchQuery.trim() && sortOption === 'chronological' && (
        <div className="space-y-8">
          {Object.entries(groupedByCentury).sort((a, b) => (parseInt(a[0].replace(/[^0-9]/g, '')) || 0) - (parseInt(b[0].replace(/[^0-9]/g, '')) || 0)).map(([century, items]) => (
            <div key={century}>
              <h3 className="text-xl font-bold text-[#d4af37] mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" />{century}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((m) => <ManuscriptCard key={m.id} manuscript={m} isAdmin={isAdmin} onSelect={() => onSelectManuscript(m)} onEdit={() => onEditManuscript(m)} onDelete={() => setDeleteConfirm(m.id)} onInfo={() => setSelectedInfo(m)} />)}
              </div>
            </div>
          ))}
          {filteredManuscripts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-16 h-16 text-[#3a3a3a] mb-4" />
              <p className="text-[#a0a0a0] text-lg">Tiada naskhah tersedia</p>
            </div>
          )}
        </div>
      )}

      {!searchQuery.trim() && sortOption === 'type' && (
        <div className="space-y-8">
          {Object.entries(groupedByType).filter(([_, items]) => items.length > 0).map(([type, items]) => (
            <div key={type}>
              <h3 className="text-xl font-bold text-[#d4af37] mb-4 flex items-center gap-2"><Type className="w-5 h-5" />{type}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((m) => <ManuscriptCard key={m.id} manuscript={m} isAdmin={isAdmin} onSelect={() => onSelectManuscript(m)} onEdit={() => onEditManuscript(m)} onDelete={() => setDeleteConfirm(m.id)} onInfo={() => setSelectedInfo(m)} />)}
              </div>
            </div>
          ))}
          {filteredManuscripts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-16 h-16 text-[#3a3a3a] mb-4" />
              <p className="text-[#a0a0a0] text-lg">Tiada naskhah tersedia</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={!!selectedInfo} onOpenChange={() => setSelectedInfo(null)}>
        <DialogContent className="bg-[#1a1a1a] border-[#3a3a3a] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#d4af37] text-xl">{selectedInfo?.info.title}</DialogTitle>
            <DialogDescription className="text-[#a0a0a0]">Maklumat Naskhah</DialogDescription>
          </DialogHeader>
          {selectedInfo && (
            <div className="space-y-4 mt-4">
              <InfoRow icon={Calendar} label="Tahun" value={selectedInfo.info.year || 'Tidak diketahui'} />
              <InfoRow icon={UserIcon} label="Pengarang" value={selectedInfo.info.author || 'Tidak diketahui'} />
              <InfoRow icon={MapPin} label="Asal" value={selectedInfo.info.origin || 'Tidak diketahui'} />
              <InfoRow icon={Type} label="Jenis" value={selectedInfo.info.type || 'Tidak diketahui'} />
              <InfoRow icon={FileText} label="Jumlah Perkataan" value={countWords(selectedInfo).toLocaleString()} />
              {selectedInfo.info.description && <div className="pt-4 border-t border-[#3a3a3a]"><p className="text-[#a0a0a0] text-sm mb-2">Keterangan:</p><p className="text-[#f5f5dc]">{selectedInfo.info.description}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-[#1a1a1a] border-[#3a3a3a]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f5f5dc]">Padam Naskhah?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#a0a0a0]">Tindakan ini tidak boleh dibatalkan. Naskhah akan dipadam secara kekal.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#2a2a2a] text-[#f5f5dc] border-[#3a3a3a]">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteConfirm) { onDeleteManuscript(deleteConfirm); setDeleteConfirm(null); } }} className="bg-red-600 text-white">Padam</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ManuscriptCardProps {
  manuscript: Manuscript;
  isAdmin: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onInfo: () => void;
}

function ManuscriptCard({ manuscript, isAdmin, onSelect, onEdit, onDelete, onInfo }: ManuscriptCardProps) {
  const wordCount = countWords(manuscript);
  return (
    <Card className="majestic-card group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#d4af37]/20" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-[#f5f5dc] group-hover:text-[#d4af37] transition-colors">{manuscript.title}</CardTitle>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#a0a0a0] hover:text-[#d4af37]" onClick={onInfo}><Info className="w-4 h-4" /></Button>
            {isAdmin && <><Button variant="ghost" size="icon" className="h-8 w-8 text-[#a0a0a0] hover:text-[#d4af37]" onClick={onEdit}><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-[#a0a0a0] hover:text-red-400" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button></>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-3">
          {manuscript.info.year && <Badge variant="secondary" className="bg-[#2a2a2a] text-[#d4af37]"><Calendar className="w-3 h-3 mr-1" />{manuscript.info.year}</Badge>}
          {manuscript.info.type && <Badge variant="secondary" className="bg-[#2a2a2a] text-[#a0a0a0]"><Type className="w-3 h-3 mr-1" />{manuscript.info.type}</Badge>}
          {manuscript.hasChapters && <Badge variant="secondary" className="bg-[#2a2a2a] text-[#a0a0a0]"><BookOpen className="w-3 h-3 mr-1" />{manuscript.chapters?.length} bab</Badge>}
          <Badge variant="secondary" className="bg-[#2a2a2a] text-[#a0a0a0]"><FileText className="w-3 h-3 mr-1" />{wordCount.toLocaleString()} patah perkataan</Badge>
        </div>
        {manuscript.info.author && <p className="text-sm text-[#a0a0a0] flex items-center gap-1"><UserIcon className="w-3 h-3" />{manuscript.info.author}</p>}
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return <div className="flex items-center gap-3"><Icon className="w-4 h-4 text-[#d4af37]" /><span className="text-[#a0a0a0] text-sm w-32">{label}:</span><span className="text-[#f5f5dc]">{value}</span></div>;
}