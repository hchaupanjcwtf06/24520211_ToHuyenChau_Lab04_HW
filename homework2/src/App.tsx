import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

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

interface TribunalDashboardProps {
  appeals: AppealCase[];
  loading: boolean;
  errorMsg: string | null;
  onCreateAppeal: (payload: {
    playerTag: string;
    matchId: string;
    category: AppealCategory;
    evidenceNote: string;
  }) => Promise<boolean>;
  onVerdict: (id: string, nextStatus: 'UPHELD' | 'OVERTURNED') => Promise<void>;
}

function TribunalDashboard({
  appeals,
  loading,
  errorMsg,
  onCreateAppeal,
  onVerdict,
}: TribunalDashboardProps) {
  const [filter, setFilter] = useState<'ALL' | AppealStatus>('ALL');
  const [playerTag, setPlayerTag] = useState('');
  const [matchId, setMatchId] = useState('');
  const [category, setCategory] = useState<AppealCategory>('DESYNC_PING');
  const [evidenceNote, setEvidenceNote] = useState('');

  // Pure derived metrics computed from current state
  const pendingCount = appeals.filter((item) => item.status === 'PENDING').length;
  const upheldCount = appeals.filter((item) => item.status === 'UPHELD').length;
  const overturnedCount = appeals.filter((item) => item.status === 'OVERTURNED').length;

  const visibleAppeals =
    filter === 'ALL' ? appeals : appeals.filter((item) => item.status === filter);

  const handleCreateAppeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerTag.trim() || !matchId.trim() || !evidenceNote.trim()) return;

    const ok = await onCreateAppeal({
      playerTag: playerTag.trim(),
      matchId: matchId.trim(),
      category,
      evidenceNote: evidenceNote.trim(),
    });

    if (ok) {
      setPlayerTag('');
      setMatchId('');
      setEvidenceNote('');
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
                        <Link
                          to={`/dossier/${encodeURIComponent(item.playerTag)}`}
                          className="font-bold text-white hover:text-amber-400 underline-offset-4 hover:underline"
                        >
                          {item.playerTag}
                        </Link>
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
                        onClick={() => onVerdict(item._id, 'UPHELD')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                      >
                        Uphold
                      </button>
                      <button
                        onClick={() => onVerdict(item._id, 'OVERTURNED')}
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

interface PlayerDossierViewProps {
  appeals: AppealCase[];
  loading: boolean;
  onVerdict: (id: string, nextStatus: 'UPHELD' | 'OVERTURNED') => Promise<void>;
}

function PlayerDossierView({ appeals, loading, onVerdict }: PlayerDossierViewProps) {
  const { playerID } = useParams<{ playerID: string }>();
  const navigate = useNavigate();

  const decodedParam = decodeURIComponent(playerID ?? '');
  const normalizedParam = decodedParam.toLowerCase();

  const matchedCases = appeals.filter(
    (item) =>
      item.playerTag.toLowerCase() === normalizedParam ||
      item._id.toLowerCase() === normalizedParam ||
      item.matchId.toLowerCase() === normalizedParam
  );

  const availablePlayers = Array.from(new Set(appeals.map((item) => item.playerTag)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-400">
              Dynamic Case Route: /dossier/:playerID
            </p>
            <h1 className="text-2xl font-bold mt-1">
              Player Dossier: {decodedParam || 'Unknown'}
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition"
          >
            Back to Tribunal
          </button>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading dossier records...</p>
        ) : matchedCases.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-300 space-y-3">
            <p className="font-semibold">
              No appeal dossier matched &ldquo;{decodedParam}&rdquo;.
            </p>
            {availablePlayers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Open an existing player dossier:</p>
                <div className="flex flex-wrap gap-2">
                  {availablePlayers.map((tag) => (
                    <Link
                      key={tag}
                      to={`/dossier/${encodeURIComponent(tag)}`}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-sm font-medium transition"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {matchedCases.map((c) => (
              <div
                key={c._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">{c.playerTag}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {c.matchId}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      {c.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold ${c.status === 'PENDING'
                          ? 'bg-amber-950 text-amber-300'
                          : c.status === 'UPHELD'
                            ? 'bg-emerald-950 text-emerald-300'
                            : 'bg-rose-950 text-rose-300'
                        }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{c.evidenceNote}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onVerdict(c._id, 'UPHELD')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                  >
                    Uphold
                  </button>
                  <button
                    onClick={() => onVerdict(c._id, 'OVERTURNED')}
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
  );
}

export default function App() {
  const [appeals, setAppeals] = useState<AppealCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch(API_BASE)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch appeals');
        return res.json();
      })
      .then((data: AppealCase[]) => {
        if (!active) return;
        setAppeals(data);
        setErrorMsg(null);
      })
      .catch((err) => {
        if (!active) return;
        setErrorMsg(err instanceof Error ? err.message : 'Network error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleCreateAppeal = async (payload: {
    playerTag: string;
    matchId: string;
    category: AppealCategory;
    evidenceNote: string;
  }) => {
    try {
      setErrorMsg(null);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || 'Could not submit appeal');
      }
      const created: AppealCase = await res.json();
      setAppeals((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submit error');
      return false;
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
    <Routes>
      <Route
        path="/"
        element={
          <TribunalDashboard
            appeals={appeals}
            loading={loading}
            errorMsg={errorMsg}
            onCreateAppeal={handleCreateAppeal}
            onVerdict={handleVerdict}
          />
        }
      />
      <Route
        path="/dossier/:playerID"
        element={
          <PlayerDossierView
            appeals={appeals}
            loading={loading}
            onVerdict={handleVerdict}
          />
        }
      />
      <Route
        path="*"
        element={
          <TribunalDashboard
            appeals={appeals}
            loading={loading}
            errorMsg={errorMsg}
            onCreateAppeal={handleCreateAppeal}
            onVerdict={handleVerdict}
          />
        }
      />
    </Routes>
  );
}