import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

type AppealCategory = 'DESYNC_PING' | 'SMURF_SUSPICION' | 'BUG_ABUSE' | 'TOXIC_COMMS';
type AppealStatus = 'PENDING' | 'UPHELD' | 'OVERTURNED';

interface AppealCase {
  _id: string;
  playerTag: string;
  matchId: string;
  category: AppealCategory;
  evidenceNote: string;
  status: AppealStatus;
  createdAt: string;
}

const API_BASE = 'http://localhost:3001/api/appeals';

function TribunalDashboard() {
  const [appeals, setAppeals] = useState<AppealCase[]>([]);
  const [filter, setFilter] = useState<'ALL' | AppealStatus>('ALL');
  const [playerTag, setPlayerTag] = useState('');
  const [matchId, setMatchId] = useState('');
  const [category, setCategory] = useState<AppealCategory>('DESYNC_PING');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAppeals = async () => {
    try {
      setErrorMsg(null);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch appeals');
      const data: AppealCase[] = await res.json();
      setAppeals(data);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppeals();
  }, []);

  // Pure derived metrics computed from current state
  const pendingCount = appeals.filter((item) => item.status === 'PENDING').length;
  const upheldCount = appeals.filter((item) => item.status === 'UPHELD').length;
  const overturnedCount = appeals.filter((item) => item.status === 'OVERTURNED').length;

  const visibleAppeals =
    filter === 'ALL' ? appeals : appeals.filter((item) => item.status === filter);

  const handleCreateAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerTag.trim() || !matchId.trim() || !evidenceNote.trim()) return;

    try {
      setErrorMsg(null);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerTag: playerTag.trim(),
          matchId: matchId.trim(),
          category,
          evidenceNote: evidenceNote.trim(),
        }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || 'Could not submit appeal');
      }
      const created: AppealCase = await res.json();
      setAppeals((prev) => [created, ...prev]);
      setPlayerTag('');
      setMatchId('');
      setEvidenceNote('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submit error');
    }
  };

  const handleVerdict = async (id: string, nextStatus: 'UPHELD' | 'OVERTURNED') => {
    try {
      setErrorMsg(null);
      const res = await fetch(`${API_BASE}/${id}/verdict`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error('Verdict update failed');
      const updated: AppealCase = await res.json();
      setAppeals((prev) => prev.map((item) => (item._id === id ? updated : item)));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Verdict error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-amber-400">
              Esports Fair-Play Appeal Tribunal
            </h1>
            <p className="text-sm text-slate-400">
              Review match incidents, evaluate evidence, and issue fair-play rulings.
            </p>
          </div>

          <div className="flex gap-3 text-sm">
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg">
              Pending: <span className="font-bold text-amber-400">{pendingCount}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg">
              Upheld: <span className="font-bold text-emerald-400">{upheldCount}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg">
              Overturned: <span className="font-bold text-rose-400">{overturnedCount}</span>
            </div>
          </div>
        </header>

        {errorMsg && (
          <div className="bg-rose-950/70 border border-rose-700 text-rose-200 px-4 py-3 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form nộp khiếu nại mới */}
          <form
            onSubmit={handleCreateAppeal}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 h-fit"
          >
            <h2 className="text-lg font-semibold">File New Appeal</h2>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Player Tag</label>
              <input
                type="text"
                value={playerTag}
                onChange={(e) => setPlayerTag(e.target.value)}
                placeholder="e.g. AceStriker"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Match ID</label>
              <input
                type="text"
                value={matchId}
                onChange={(e) => setMatchId(e.target.value)}
                placeholder="e.g. MATCH-9012"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Violation Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AppealCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="DESYNC_PING">DESYNC_PING</option>
                <option value="SMURF_SUSPICION">SMURF_SUSPICION</option>
                <option value="BUG_ABUSE">BUG_ABUSE</option>
                <option value="TOXIC_COMMS">TOXIC_COMMS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Evidence Summary</label>
              <textarea
                rows={3}
                value={evidenceNote}
                onChange={(e) => setEvidenceNote(e.target.value)}
                placeholder="Timestamp, telemetry log, or VOD summary..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-2 rounded-lg text-sm transition"
            >
              Submit Appeal
            </button>
          </form>

          {/* Danh sách hồ sơ & phán quyết */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'PENDING', 'UPHELD', 'OVERTURNED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === tab
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="text-slate-400 text-sm">Loading appeal docket...</p>
            ) : visibleAppeals.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-sm">
                No appeal cases in this filter.
              </div>
            ) : (
              <div className="space-y-3">
                {visibleAppeals.map((item) => (
                  <div
                    key={item._id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white">{item.playerTag}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {item.matchId}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                          {item.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-semibold ${item.status === 'PENDING'
                              ? 'bg-amber-950 text-amber-300'
                              : item.status === 'UPHELD'
                                ? 'bg-emerald-950 text-emerald-300'
                                : 'bg-rose-950 text-rose-300'
                            }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{item.evidenceNote}</p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleVerdict(item._id, 'UPHELD')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                      >
                        Uphold
                      </button>
                      <button
                        onClick={() => handleVerdict(item._id, 'OVERTURNED')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition"
                      >
                        Overturn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TribunalDashboard />} />
    </Routes>
  );
}