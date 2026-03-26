import { useState, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { ManuscriptList } from '@/components/ManuscriptList';
import { ManuscriptReader } from '@/components/ManuscriptReader';
import { Dictionary } from '@/components/Dictionary';
import { ManuscriptForm } from '@/components/ManuscriptForm';
import { About } from '@/components/About';
import { LandingPage } from '@/components/LandingPage';
import { Login } from '@/components/Login';
import { useAuth } from '@/hooks/useAuth';
import { useManuscripts } from '@/hooks/useManuscripts';
import { useDictionary } from '@/hooks/useDictionary';
import { useReadingSettings } from '@/hooks/useReadingSettings';
import type { Manuscript } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const { currentUser, login, logout, isAdmin } = useAuth();
  const { 
    manuscripts, 
    addManuscript, 
    updateManuscript, 
    deleteManuscript
  } = useManuscripts();
  const { 
    entries: dictionaryEntries, 
    addEntry: addDictionaryEntry, 
    updateEntry: updateDictionaryEntry, 
    deleteEntry: deleteDictionaryEntry 
  } = useDictionary();
  const { settings, updateSettings } = useReadingSettings();

  const [hasLanded, setHasLanded] = useState(false);
  const [view, setView] = useState<'list' | 'reader' | 'dictionary' | 'about'>('list');
  const [selectedManuscript, setSelectedManuscript] = useState<Manuscript | null>(null);
  const [showManuscriptForm, setShowManuscriptForm] = useState(false);
  const [editingManuscript, setEditingManuscript] = useState<Manuscript | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const clearLoginError = useCallback(() => {
    setLoginError(null);
  }, []);

  // Landing page handlers
  const handleContinueAsGuest = useCallback(() => {
    setHasLanded(true);
  }, []);

  const handleLoginAsAdmin = useCallback(() => {
    setShowLogin(true);
  }, []);

  // Login handler
  const handleLogin = useCallback((username: string, password: string): boolean => {
    const success = login(username, password);
    if (success) {
      setLoginError(null); // Clear any previous error
      toast.success('Log masuk berjaya', {
        description: `Selamat datang, ${username}!`,
        style: {
          background: '#1a1a1a',
          border: '1px solid #d4af37'
        }
      });
      
      setShowLogin(false);
      
      setTimeout(() => {
        setHasLanded(true);
      }, 2500);
      return true;
    } else {
      // Set error message for invalid credentials
      setLoginError('Nama pengguna atau kata laluan tidak sah');
      return false;
    }
  }, [login]);


  // Logout handler
  const handleLogout = useCallback(() => {
    toast.info('Anda telah log keluar');
    // Delay state changes so toast can display
    setTimeout(() => {
      logout();
      setView('list');
      setSelectedManuscript(null);
      setHasLanded(false);
    }, 2500); 
  }, [logout]);

  // Select manuscript to read
  const handleSelectManuscript = useCallback((manuscript: Manuscript) => {
    setSelectedManuscript(manuscript);
    setView('reader');
  }, []);

  // Back to list
  const handleBackToList = useCallback(() => {
    setSelectedManuscript(null);
    setView('list');
  }, []);

  // Add new manuscript
  const handleAddManuscript = useCallback(() => {
    setEditingManuscript(null);
    setShowManuscriptForm(true);
  }, []);

  // Edit manuscript
  const handleEditManuscript = useCallback((manuscript: Manuscript) => {
    setEditingManuscript(manuscript);
    setShowManuscriptForm(true);
  }, []);

  // Save manuscript (add or update)
  const handleSaveManuscript = useCallback((manuscriptData: Omit<Manuscript, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingManuscript) {
        updateManuscript(editingManuscript.id, manuscriptData);
        toast.success('Naskhah dikemaskini', {
          description: `"${manuscriptData.title}" telah berjaya dikemaskini`
        });
        if (selectedManuscript?.id === editingManuscript.id) {
          setSelectedManuscript({ ...editingManuscript, ...manuscriptData });
        }
      } else {
        const newManuscript = addManuscript(manuscriptData);
        toast.success('Naskhah ditambah', {
          description: `"${newManuscript.title}" telah berjaya ditambah`
        });
      }
      setShowManuscriptForm(false);
      setEditingManuscript(null);
    } catch (error) {
      toast.error('Ralat', {
        description: 'Tidak dapat menyimpan naskhah'
      });
    }
  }, [editingManuscript, addManuscript, updateManuscript, selectedManuscript]);

  // Delete manuscript
  const handleDeleteManuscript = useCallback((id: string) => {
    try {
      deleteManuscript(id);
      toast.success('Naskhah dipadam', {
        description: 'Naskhah telah berjaya dipadam'
      });
      if (selectedManuscript?.id === id) {
        setSelectedManuscript(null);
        setView('list');
      }
    } catch (error) {
      toast.error('Ralat', {
        description: 'Tidak dapat memadam naskhah'
      });
    }
  }, [deleteManuscript, selectedManuscript]);

  // Add dictionary entry (admin only)
  const handleAddDictionaryEntry = useCallback((word: string, meaning: string) => {
    try {
      const result = addDictionaryEntry(word, meaning, currentUser?.username || 'pentadbir');
      if (result) {
        toast.success('Perkataan ditambah', {
          description: `"${word}" telah ditambah ke kamus`
        });
      } else {
        toast.error('Perkataan wujud', {
          description: `"${word}" sudah ada dalam kamus`
        });
      }
    } catch (error) {
      toast.error('Ralat', {
        description: 'Tidak dapat menambah perkataan'
      });
    }
  }, [addDictionaryEntry, currentUser]);

  // Update dictionary entry
  const handleUpdateDictionaryEntry = useCallback((id: string, meaning: string) => {
    try {
      updateDictionaryEntry(id, meaning);
      toast.success('Maksud dikemaskini');
    } catch (error) {
      toast.error('Ralat', {
        description: 'Tidak dapat mengemaskini maksud'
      });
    }
  }, [updateDictionaryEntry]);

  // Delete dictionary entry
  const handleDeleteDictionaryEntry = useCallback((id: string) => {
    try {
      deleteDictionaryEntry(id);
      toast.success('Perkataan dipadam');
    } catch (error) {
      toast.error('Ralat', {
        description: 'Tidak dapat memadam perkataan'
      });
    }
  }, [deleteDictionaryEntry]);

  // Change view handler
  const handleChangeView = useCallback((newView: 'list' | 'dictionary' | 'about') => {
    setView(newView);
    if (newView === 'list') {
      setSelectedManuscript(null);
    }
  }, []);

  // Show landing page if not landed yet
  if (!hasLanded) {
    return (
      <>
        <LandingPage 
          onContinueAsGuest={handleContinueAsGuest}
          onLoginAsAdmin={handleLoginAsAdmin}
        />
        {showLogin && (
          <Login 
            onLogin={handleLogin} 
            onClose={() => {
              setShowLogin(false);
              setLoginError(null); // Clear error when closing
            }}
            onClearError={clearLoginError}
            error={loginError}
          />
        )}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid #3a3a3a'
            }
          }}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation 
        currentUser={currentUser}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
        currentView={view === 'reader' ? 'list' : view}
        onChangeView={handleChangeView}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'list' && (
          <ManuscriptList
            manuscripts={manuscripts}
            isAdmin={isAdmin()}
            onSelectManuscript={handleSelectManuscript}
            onAddManuscript={handleAddManuscript}
            onEditManuscript={handleEditManuscript}
            onDeleteManuscript={handleDeleteManuscript}
          />
        )}

        {view === 'reader' && selectedManuscript && (
          <ManuscriptReader
            manuscript={selectedManuscript}
            settings={settings}
            onUpdateSettings={updateSettings}
            onUpdateManuscript={updateManuscript}
            onBack={handleBackToList}
            dictionary={dictionaryEntries}
            isAdmin={isAdmin()}
          />
        )}

        {view === 'dictionary' && (
          <Dictionary
            entries={dictionaryEntries}
            isAdmin={isAdmin()}
            onAddEntry={handleAddDictionaryEntry}
            onUpdateEntry={handleUpdateDictionaryEntry}
            onDeleteEntry={handleDeleteDictionaryEntry}
          />
        )}

        {view === 'about' && <About />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#3a3a3a] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#d4af37] font-semibold">WPM - Wisma Pustaka Melayu</p>
          <p className="text-[#a0a0a0] text-sm mt-1">Dibangunkan oleh Tengku Lafuan</p>
          <p className="text-[#666] text-xs mt-2">
            Memelihara khazanah kesusasteraan Melayu klasik
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <Login 
          onLogin={handleLogin} 
          onClose={() => {
            setShowLogin(false);
            setLoginError(null); // Clear error when closing
          }}
          onClearError={clearLoginError}
          error={loginError}
        />
      )}

      {/* Manuscript Form Modal */}
      <ManuscriptForm
        manuscript={editingManuscript}
        isOpen={showManuscriptForm}
        onClose={() => {
          setShowManuscriptForm(false);
          setEditingManuscript(null);
        }}
        onSave={handleSaveManuscript}
      />

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid #3a3a3a'
          }
        }}
      />
    </div>
  );
}

export default App;
