'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CryptoJS from 'crypto-js';

interface Candidate {
  id: number;
  text: string;
  votes: number;
  image_url?: string;
  isBlank?: boolean;
  isSpaceEmpty?: boolean;
}

export default function ElectoralBallot() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activePollId, setActivePollId] = useState<number | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  const REFRESH_INTERVAL = 2000;

  useEffect(() => {
    const fingerprint = CryptoJS.SHA256(
      navigator.userAgent + navigator.language
    ).toString();
    setDeviceFingerprint(fingerprint);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    loadCandidates();
  }, [initialized]);

  useEffect(() => {
    if (!initialized || candidates.length === 0 || !activePollId) return;
    const interval = setInterval(updateResults, REFRESH_INTERVAL);
    updateResults();
    return () => clearInterval(interval);
  }, [initialized, candidates.length, activePollId]);

  async function loadCandidates() {
    try {
      const res = await fetch(`/api/polls`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const polls = await res.json();

      if (polls.length > 0) {
        const poll = polls[0];
        setActivePollId(poll.id);
        const candidatesWithData = poll.options.map((option: any) => {
          const isSpaceEmpty = option.text.toUpperCase() === 'ESPACIO EN BLANCO';
          const isBlank = option.text.toUpperCase() === 'VOTO EN BLANCO';

          return {
            id: option.id,
            text: option.text,
            votes: 0,
            image_url: option.image_url,
            isBlank: isBlank,
            isSpaceEmpty: isSpaceEmpty
          };
        });

        setCandidates(candidatesWithData);
        setError('');
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError('Error cargando candidatos');
    }
  }

  async function updateResults() {
    if (!activePollId) return;

    try {
      const res = await fetch(`/api/results/${activePollId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setCandidates(prev =>
        prev.map(candidate => {
          const result = data.results.find((r: any) => r.id === candidate.id);
          return {
            ...candidate,
            votes: result?.votes || 0
          };
        })
      );
      setTotalVotes(data.totalVotes || 0);
    } catch (err) {
      console.error('Error updating results:', err);
    }
  }

  async function handleVote(candidateId: number) {
    if (!activePollId) {
      setError('Encuesta no inicializada');
      return;
    }

    if (!deviceFingerprint) {
      setError('Inicializando dispositivo...');
      return;
    }

    if (hasVoted) {
      setError('Ya has emitido tu voto');
      return;
    }

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate || candidate.isSpaceEmpty || !candidate.image_url) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: activePollId,
          optionId: candidateId,
          deviceFingerprint
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setHasVoted(true);
        setVotedFor(candidateId);
        setError('');
        setTimeout(() => updateResults(), 500);
      } else if (res.status === 409) {
        setError('Ya has votado en estas elecciones');
        setHasVoted(true);
      } else {
        setError(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error voting:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  if (!initialized || candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin mb-6">
            <div className="text-6xl">🇨🇴</div>
          </div>
          <p className="text-2xl font-bold text-white mb-2">Preparando Tarjeta Electoral</p>
          <p className="text-slate-400">Cargando candidatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 rounded-2xl p-1 shadow-2xl">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6 text-xs sm:text-sm font-semibold text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇨🇴</span>
                  <span>REPÚBLICA DE COLOMBIA</span>
                </div>
                <div>AÑO 2026</div>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-blue-400 to-red-400 mb-2 text-center">
                ELECCIONES PRESIDENCIALES
              </h1>
              <p className="text-center text-slate-300 text-sm sm:text-base font-medium mb-6">
                Selecciona el candidato de tu preferencia
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-3xl sm:text-4xl font-black text-blue-400 mb-1">{totalVotes}</div>
                  <div className="text-xs sm:text-sm text-blue-300 font-semibold">Votos Registrados</div>
                </div>
                {hasVoted && (
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-400/30 rounded-lg p-4 backdrop-blur-sm animate-pulse">
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">✓</div>
                    <div className="text-xs sm:text-sm text-emerald-300 font-semibold">Voto Emitido</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border-l-4 border-red-400 text-red-300 rounded-lg font-semibold backdrop-blur-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Electoral Ballot Grid - 4 columns */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {candidates.map((candidate) => {
              const isVotable = !candidate.isSpaceEmpty && candidate.image_url && candidate.image_url.length > 0;

              return (
                <button
                  key={candidate.id}
                  onClick={() => handleVote(candidate.id)}
                  disabled={loading || hasVoted || !isVotable}
                  className={`
                    group relative rounded-xl transition-all duration-300 transform
                    border-2 border-slate-600/50 bg-slate-700/30 backdrop-blur-sm overflow-hidden
                    ${isVotable
                      ? votedFor === candidate.id
                        ? 'ring-4 ring-yellow-400/60 scale-105 border-yellow-400'
                        : 'hover:border-slate-500 hover:bg-slate-700/50 hover:scale-105 cursor-pointer hover:shadow-lg hover:shadow-slate-700/50'
                      : ''}
                    ${hasVoted && isVotable ? 'opacity-50' : ''}
                    ${!isVotable ? 'opacity-0 pointer-events-none' : ''}
                    disabled:opacity-40
                    aspect-square flex flex-col items-center justify-center p-2
                  `}
                >
                  {isVotable && (
                    <>
                      {/* Image Container */}
                      <div className="w-full h-3/4 relative mb-2 overflow-hidden rounded-lg">
                        {candidate.image_url && (
                          <Image
                            src={candidate.image_url}
                            alt={candidate.text}
                            fill
                            className="object-contain object-top"
                            unoptimized
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/40" />
                      </div>

                      {/* Name and Votes */}
                      <div className="w-full text-center">
                        <p className="text-xs font-bold text-slate-200 line-clamp-2 leading-tight">
                          {candidate.text}
                        </p>
                        <p className="text-sm font-black text-blue-400 mt-1">
                          {candidate.votes}
                        </p>
                      </div>

                      {/* Checkmark Badge */}
                      {votedFor === candidate.id && (
                        <div className="absolute top-2 right-2 bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 rounded-full w-7 h-7 flex items-center justify-center font-black text-lg shadow-lg">
                          ✓
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Message */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-lg rounded-xl border border-slate-600/50 p-4 sm:p-6 mb-6">
          {hasVoted ? (
            <div className="text-center">
              <div className="text-3xl mb-3 animate-bounce">✅</div>
              <p className="text-slate-100 font-bold text-sm sm:text-base mb-1">¡Tu voto ha sido registrado!</p>
              <p className="text-slate-400 text-xs sm:text-sm">Los resultados se actualizan en tiempo real</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-slate-200 font-semibold text-sm sm:text-base mb-2">👇 Selecciona un candidato para votar</p>
              <p className="text-slate-400 text-xs sm:text-sm">Tu voto es secreto y protegido por encriptación</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center space-y-1.5 text-slate-400 text-xs sm:text-sm">
          <p className="flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>Protección: IP + Device Fingerprint</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span>⚡</span>
            <span>Actualizaciones cada 2 segundos</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span>🗳️</span>
            <span>Un voto por dispositivo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
