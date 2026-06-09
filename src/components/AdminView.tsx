import { useState, useRef, useEffect } from 'react';
import { AppConfig, BoxMessage } from '../types';
import { Save, ArrowLeft, Plus, Trash2, Smile, Upload } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface AdminViewProps {
  config: AppConfig;
  onSave: () => void;
  onBack: () => void;
}

// Reusable inline emoji trigger
function EmojiTrigger({ onEmojiSelect }: { onEmojiSelect: (emoji: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setOpen(!open)}
        className="p-3 bg-zinc-800 rounded-r-lg border-y border-r border-zinc-700 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
        title="Sisipkan Emoji"
      >
        <Smile size={20} />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 shadow-2xl">
          <EmojiPicker 
            theme={Theme.DARK} 
            onEmojiClick={(e) => onEmojiSelect(e.emoji)} 
            lazyLoadEmojis={true} 
          />
        </div>
      )}
    </div>
  );
}

export default function AdminView({ config: initialConfig, onSave, onBack }: AdminViewProps) {
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const appendEmoji = (field: keyof AppConfig, emoji: string) => {
    setConfig(prev => ({ ...prev, [field]: (prev[field] as string) + emoji }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setMessage('Pengaturan berhasil disimpan!');
        onSave();
      } else {
        setMessage('Gagal menyimpan pengaturan.');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  };

  const addGalleryImage = () => {
    setConfig(prev => ({
      ...prev,
      gallery: [...prev.gallery, '']
    }));
  };

  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio' | 'bg') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file); // Change to match server.ts 'file'

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (type === 'image') {
          setConfig(prev => {
            const newConfig = {
              ...prev,
              gallery: [...prev.gallery, data.url]
            };
            
            fetch('/api/config', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newConfig)
            }).catch(console.error);

            return newConfig;
          });
          setMessage('Foto berhasil diunggah!');
        } else if (type === 'audio') {
          setConfig(prev => {
            const newConfig = {
              ...prev,
              musicUrl: data.url
            };
            
            fetch('/api/config', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newConfig)
            }).catch(console.error);

            return newConfig;
          });
          setMessage('Musik berhasil diunggah!');
        } else if (type === 'bg') {
          setConfig(prev => {
            const newConfig = {
              ...prev,
              backgroundImage: data.url
            };
            
            fetch('/api/config', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newConfig)
            }).catch(console.error);

            return newConfig;
          });
          setMessage('Background berhasil diunggah!');
        }
      } else {
        alert('Upload gagal');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat upload');
    } finally {
      setUploading(false);
      if (type === 'image' && imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      if (type === 'audio' && audioInputRef.current) {
        audioInputRef.current.value = '';
      }
      if (type === 'bg' && bgInputRef.current) {
        bgInputRef.current.value = '';
      }
    }
  };

  const updateGalleryImage = (index: number, url: string) => {
    const newGallery = [...config.gallery];
    newGallery[index] = url;
    setConfig(prev => ({ ...prev, gallery: newGallery }));
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = config.gallery.filter((_, i) => i !== index);
    setConfig(prev => ({ ...prev, gallery: newGallery }));
  };

  const addBoxMessage = () => {
    setConfig(prev => ({
      ...prev,
      boxMessages: [
        ...prev.boxMessages,
        { id: Date.now().toString(), title: 'Catatan Baru', content: 'Isi pesan...' }
      ]
    }));
  };

  const updateBoxMessage = (index: number, field: keyof BoxMessage, value: string) => {
    const newBoxes = [...config.boxMessages];
    newBoxes[index] = { ...newBoxes[index], [field]: value };
    setConfig(prev => ({ ...prev, boxMessages: newBoxes }));
  };

  const removeBoxMessage = (index: number) => {
    const newBoxes = config.boxMessages.filter((_, i) => i !== index);
    setConfig(prev => ({ ...prev, boxMessages: newBoxes }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-950/90 backdrop-blur-md rounded-2xl my-8 min-h-screen text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft className="text-zinc-400" />
          </button>
          <h1 className="text-2xl font-bold font-sans text-rose-500">Editor Konten</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-lg font-medium border ${message.includes('berhasil') ? 'bg-green-950/50 border-green-900 text-green-400' : 'bg-red-950/50 border-red-900 text-red-500'}`}>
          {message}
        </div>
      )}

      <div className="space-y-10">
        {/* General Settings */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100 border-l-4 border-rose-600 pl-3">Pengaturan Umum</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Judul Utama</label>
              <div className="flex">
                <input
                  type="text"
                  name="title"
                  value={config.title}
                  onChange={handleChange}
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-l-lg focus:ring-2 focus:ring-rose-500/50 outline-none transition-colors"
                />
                <EmojiTrigger onEmojiSelect={(emoji) => appendEmoji('title', emoji)} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Pesan Pembuka (Hero)</label>
              <div className="flex">
                <textarea
                  name="heroMessage"
                  value={config.heroMessage}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-l-lg focus:ring-2 focus:ring-rose-500/50 outline-none transition-colors"
                />
                <div className="flex flex-col">
                  <EmojiTrigger onEmojiSelect={(emoji) => appendEmoji('heroMessage', emoji)} />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Pesan Rahasia (Secret)</label>
              <div className="flex">
                <textarea
                  name="secretMessage"
                  value={config.secretMessage}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-l-lg focus:ring-2 focus:ring-rose-500/50 outline-none transition-colors"
                />
                <div className="flex flex-col">
                  <EmojiTrigger onEmojiSelect={(emoji) => appendEmoji('secretMessage', emoji)} />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">URL Musik Latar (MP3 / YouTube)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="musicUrl"
                  value={config.musicUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=... atau link MP3"
                  className="flex-1 p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-rose-500/50 outline-none transition-colors"
                />
                <input 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  ref={audioInputRef}
                  onChange={(e) => handleFileUpload(e, 'audio')}
                />
                <button 
                  onClick={() => audioInputRef.current?.click()} 
                  disabled={uploading}
                  className="flex items-center gap-1 text-sm bg-rose-600 text-white hover:bg-rose-500 px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                  title="Upload MP3"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Background Image (Opsional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="backgroundImage"
                  value={config.backgroundImage || ''}
                  onChange={handleChange}
                  placeholder="URL Gambar atau Upload"
                  className="flex-1 p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-rose-500/50 outline-none transition-colors"
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={bgInputRef}
                  onChange={(e) => handleFileUpload(e, 'bg')}
                />
                <button 
                  onClick={() => bgInputRef.current?.click()} 
                  disabled={uploading}
                  className="flex items-center gap-1 text-sm bg-rose-600 text-white hover:bg-rose-500 px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                  title="Upload Background"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Box Messages */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-100 border-l-4 border-rose-600 pl-3">Kotak Catatan</h2>
            <button onClick={addBoxMessage} className="flex items-center gap-1 text-sm bg-zinc-800 text-zinc-200 hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors shadow-sm">
              <Plus size={16} /> Tambah
            </button>
          </div>
          <div className="grid gap-4">
            {config.boxMessages.map((msg, index) => (
              <div key={msg.id} className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/50 flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex">
                    <input
                      type="text"
                      value={msg.title}
                      onChange={(e) => updateBoxMessage(index, 'title', e.target.value)}
                      placeholder="Judul Catatan"
                      className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-l-lg font-bold outline-none focus:border-rose-500"
                    />
                    <EmojiTrigger onEmojiSelect={(emoji) => updateBoxMessage(index, 'title', msg.title + emoji)} />
                  </div>
                  <div className="flex">
                    <textarea
                      value={msg.content}
                      onChange={(e) => updateBoxMessage(index, 'content', e.target.value)}
                      placeholder="Isi catatan..."
                      rows={2}
                      className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-l-lg outline-none focus:border-rose-500"
                    />
                    <EmojiTrigger onEmojiSelect={(emoji) => updateBoxMessage(index, 'content', msg.content + emoji)} />
                  </div>
                </div>
                <button
                  onClick={() => removeBoxMessage(index)}
                  className="text-red-400 hover:text-red-500 p-2 h-fit bg-red-950/30 rounded border border-red-900/30 transition-colors"
                  title="Hapus Catatan"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-100 border-l-4 border-rose-600 pl-3">Galeri Foto</h2>
            <div className="flex gap-2">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={imageInputRef}
                onChange={(e) => handleFileUpload(e, 'image')}
              />
              <button 
                onClick={() => imageInputRef.current?.click()} 
                disabled={uploading}
                className="flex items-center gap-1 text-sm bg-rose-600 text-white hover:bg-rose-500 px-4 py-2 rounded-full transition-colors shadow-sm disabled:opacity-50"
              >
                <Upload size={16} /> {uploading ? 'Upload...' : 'Upload File'}
              </button>
              <button onClick={addGalleryImage} className="flex items-center gap-1 text-sm bg-zinc-800 text-zinc-200 hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors shadow-sm">
                <Plus size={16} /> Tambah Link
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {config.gallery.map((url, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                {url && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img 
                      src={url} 
                      alt="preview" 
                      className="w-full h-full object-cover hidden" 
                      onLoad={(e) => (e.currentTarget.style.display = 'block')} 
                      onError={(e) => (e.currentTarget.style.display = 'none')} 
                    />
                  </div>
                )}
                <div className="flex-1 w-full flex items-center gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateGalleryImage(index, e.target.value)}
                    placeholder="https://drive.google.com/... atau /uploads/..."
                    className="flex-1 p-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-rose-500/50 outline-none transition-colors"
                  />
                  <button
                    onClick={() => removeGalleryImage(index)}
                    className="text-red-400 hover:text-red-500 p-3 bg-red-950/30 rounded-lg border border-red-900/30 transition-colors"
                    title="Hapus Foto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
