import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';

export interface EvidencePhoto {
  id: string;
  title: string;
  category: 'ALL' | 'MATCH_VOD' | 'TELEMETRY' | 'VENUE';
  imageUrl: string;
  caption: string;
}

export const EVIDENCE_PHOTOS: EvidencePhoto[] = [
  {
    id: 'vod-01',
    title: 'Final Objective Contest Frame',
    category: 'MATCH_VOD',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&q=80',
    caption: 'Replay capture at 28:14 showing player positioning and ping indicator.',
  },
  {
    id: 'net-02',
    title: 'Packet Loss & Latency Graph',
    category: 'TELEMETRY',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80',
    caption: 'Network telemetry spike logged during late-game teamfight.',
  },
  {
    id: 'stage-03',
    title: 'Arena Tribunal Briefing Desk',
    category: 'VENUE',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&q=80',
    caption: 'Referees reviewing match evidence and appeal documentation.',
  },
];

const CATEGORIES: Array<EvidencePhoto['category']> = ['ALL', 'MATCH_VOD', 'TELEMETRY', 'VENUE'];

function PhotoGalleryLayout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');

  const rawCategory = (searchParams.get('category') || 'ALL').toUpperCase();
  const activeCategory: EvidencePhoto['category'] = CATEGORIES.includes(
    rawCategory as EvidencePhoto['category']
  )
    ? (rawCategory as EvidencePhoto['category'])
    : 'ALL';

  const selectedPhotoId = searchParams.get('photoId');
  const selectedPhoto =
    EVIDENCE_PHOTOS.find((photo) => photo.id === selectedPhotoId) ?? null;

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedPhoto) {
      if (!dialog.open) {
        dialog.showModal();
      }
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus();
      });
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedPhoto]);

  const handleSelectCategory = (nextCategory: EvidencePhoto['category']) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextCategory === 'ALL') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', nextCategory);
    }
    setSearchParams(nextParams);
  };

  const handleSelectPhoto = (photoId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('photoId', photoId);
    setSearchParams(nextParams);
  };

  const handleCloseDialog = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('photoId');
    setSearchParams(nextParams);
  };

  const visiblePhotos = EVIDENCE_PHOTOS.filter((photo) => {
    const matchesCategory = activeCategory === 'ALL' || photo.category === activeCategory;
    const term = keyword.trim().toLowerCase();
    const matchesText =
      !term ||
      photo.title.toLowerCase().includes(term) ||
      photo.caption.toLowerCase().includes(term);
    return matchesCategory && matchesText;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="border-b border-slate-800 pb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-400">
              Lab 4 · Homework 3 · Photo &amp; Evidence Gallery
            </p>
            <h1 className="text-2xl font-bold mt-1">Evidence Gallery Layout</h1>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            category={activeCategory}
            {selectedPhotoId ? ` | photoId=${selectedPhotoId}` : ''}
          </span>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleSelectCategory(category)}
                aria-pressed={activeCategory === category}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeCategory === category
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search evidence..."
            aria-label="Search evidence"
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-400"
          />
        </div>

        <section
          aria-label="Evidence photos"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {visiblePhotos.map((photo) => (
            <article
              key={photo.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 space-y-1.5">
                  <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    {photo.category}
                  </span>
                  <h2 className="font-bold text-white">{photo.title}</h2>
                  <p className="text-xs text-slate-300">{photo.caption}</p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <button
                  type="button"
                  onClick={() => handleSelectPhoto(photo.id)}
                  className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition"
                >
                  Inspect Photo
                </button>
              </div>
            </article>
          ))}
        </section>

        <dialog
          ref={dialogRef}
          onClose={handleCloseDialog}
          aria-labelledby="lightbox-title"
          className="backdrop:bg-black/75 bg-slate-900 text-slate-100 border border-slate-700 rounded-2xl p-0 max-w-2xl w-full shadow-2xl"
        >
          {selectedPhoto && (
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-cyan-400 font-semibold">
                    {selectedPhoto.category} · ID: {selectedPhoto.id}
                  </p>
                  <h3 id="lightbox-title" className="text-xl font-bold mt-0.5">
                    {selectedPhoto.title}
                  </h3>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={handleCloseDialog}
                  aria-label="Close lightbox dialog"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  Close (Esc)
                </button>
              </div>

              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full max-h-[60vh] object-contain rounded-lg bg-slate-950"
              />

              <p className="text-sm text-slate-300">{selectedPhoto.caption}</p>
            </div>
          )}
        </dialog>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PhotoGalleryLayout />} />
      <Route path="*" element={<PhotoGalleryLayout />} />
    </Routes>
  );
}