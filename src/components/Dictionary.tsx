import { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, BookMarked, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { DictionaryEntry } from '@/types';

interface DictionaryProps {
  entries: DictionaryEntry[];
  isAdmin: boolean;
  onAddEntry: (word: string, meaning: string) => void;
  onUpdateEntry: (id: string, meaning: string) => void;
  onDeleteEntry: (id: string) => void;
}

export function Dictionary({ 
  entries, 
  isAdmin, 
  onAddEntry, 
  onUpdateEntry, 
  onDeleteEntry 
}: DictionaryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [error, setError] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const lowerQuery = searchQuery.toLowerCase();
    return entries.filter(e => 
      e.word.toLowerCase().includes(lowerQuery) || 
      e.meaning.toLowerCase().includes(lowerQuery)
    );
  }, [entries, searchQuery]);

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => a.word.localeCompare(b.word, 'ms'));
  }, [filteredEntries]);

  const handleAdd = () => {
    setError(null);
    if (!newWord.trim() || !newMeaning.trim()) {
      setError('Sila isi perkataan dan maksud');
      return;
    }
    
    const existing = entries.find(e => e.word.toLowerCase() === newWord.trim().toLowerCase());
    if (existing) {
      setError('Perkataan ini sudah wujud dalam kamus');
      return;
    }
    
    onAddEntry(newWord.trim(), newMeaning.trim());
    setNewWord('');
    setNewMeaning('');
    setShowAddDialog(false);
  };

  const handleUpdate = () => {
    if (editingEntry && newMeaning.trim()) {
      onUpdateEntry(editingEntry.id, newMeaning.trim());
      setEditingEntry(null);
      setNewMeaning('');
    }
  };

  const openEdit = (entry: DictionaryEntry) => {
    setEditingEntry(entry);
    setNewMeaning(entry.meaning);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#f5f5dc] flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-[#d4af37]" />
            Kamus
          </h2>
          <p className="text-[#a0a0a0]">Kumpulan maksud perkataan Melayu klasik</p>
        </div>
        
        {isAdmin && (
          <Button onClick={() => setShowAddDialog(true)} className="gold-button">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Perkataan
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a0a0a0]" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari perkataan atau maksud..."
          className="pl-10 bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37] focus:ring-[#d4af37]"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-[#a0a0a0] hover:text-[#f5f5dc]"
            onClick={() => setSearchQuery('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="text-[#a0a0a0] text-sm">
        {sortedEntries.length} perkataan ditemui
      </div>

      {/* Dictionary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEntries.map((entry) => (
          <Card key={entry.id} className="majestic-card group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-[#d4af37] capitalize">
                  {entry.word}
                </CardTitle>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-[#a0a0a0] hover:text-[#d4af37] hover:bg-[#d4af37]/10"
                      onClick={() => openEdit(entry)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-[#a0a0a0] hover:text-red-400 hover:bg-red-400/10"
                      onClick={() => setDeleteConfirm(entry.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[#f5f5dc]">{entry.meaning}</p>
              <p className="text-xs text-[#666] mt-2">
                Ditambah oleh: {entry.addedBy}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedEntries.length === 0 && (
        <div className="text-center py-12">
          <BookMarked className="w-16 h-16 text-[#3a3a3a] mx-auto mb-4" />
          <p className="text-[#a0a0a0]">Tiada perkataan ditemui</p>
        </div>
      )}

      {/* Add Dialog - Admin Only */}
      {isAdmin && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="bg-[#1a1a1a] border-[#3a3a3a]">
            <DialogHeader>
              <DialogTitle className="text-[#d4af37]">Tambah Perkataan Baru</DialogTitle>
              <DialogDescription className="text-[#a0a0a0]">
                Tambah perkataan dan maksudnya ke dalam kamus
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>
              )}
              
              <div>
                <label className="text-sm text-[#a0a0a0] mb-2 block">Perkataan:</label>
                <Input
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Masukkan perkataan..."
                  className="bg-[#2a2a2a] border-[#3a3a3a] text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37]"
                />
              </div>
              
              <div>
                <label className="text-sm text-[#a0a0a0] mb-2 block">Maksud:</label>
                <textarea
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Masukkan maksud perkataan..."
                  className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAdd} className="flex-1 gold-button">
                  Simpan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setNewWord('');
                    setNewMeaning('');
                    setError(null);
                  }}
                  className="flex-1 border-[#3a3a3a] text-[#f5f5dc] hover:bg-[#3a3a3a]"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog - Admin Only */}
      {isAdmin && (
        <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
          <DialogContent className="bg-[#1a1a1a] border-[#3a3a3a]">
            <DialogHeader>
              <DialogTitle className="text-[#d4af37]">Kemaskini Maksud</DialogTitle>
              <DialogDescription className="text-[#a0a0a0]">
                Perkataan: <span className="text-[#f5f5dc] font-semibold capitalize">{editingEntry?.word}</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm text-[#a0a0a0] mb-2 block">Maksud:</label>
                <textarea
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Masukkan maksud perkataan..."
                  className="w-full p-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-[#f5f5dc] placeholder:text-[#666] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleUpdate} className="flex-1 gold-button">
                  Kemaskini
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingEntry(null);
                    setNewMeaning('');
                  }}
                  className="flex-1 border-[#3a3a3a] text-[#f5f5dc] hover:bg-[#3a3a3a]"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation - Admin Only */}
      {isAdmin && (
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent className="bg-[#1a1a1a] border-[#3a3a3a]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#f5f5dc]">Padam Perkataan?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#a0a0a0]">
                Tindakan ini tidak boleh dibatalkan. Perkataan akan dipadam secara kekal.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2a2a2a] text-[#f5f5dc] border-[#3a3a3a] hover:bg-[#3a3a3a]">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteConfirm) {
                    onDeleteEntry(deleteConfirm);
                    setDeleteConfirm(null);
                  }
                }}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Padam
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
