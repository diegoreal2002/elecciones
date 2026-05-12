'use client';

import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

interface Candidate {
  id: number;
  text: string;
  votes: number;
}

export default function PresidentialPoll() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  const POLL_ID = 1;
  const REFRESH_INTERVAL = 2000;

  // Generar fingerprint único del dispositivo
  useEffect(() => {
    const fingerprint = CryptoJS.SHA256(
      navigator.userAgent + navigator.language
    ).toString();
    setDeviceFingerprint(fingerprint);
    setInitialized(true);
  }, []);

  // Cargar candidatos una sola vez al montar
  useEffect(() => {
    if (!initialized) return;
    loadCandidates();
  }, [initialized]);

  // Polling de resultados cada 2 segundos
  useEffect(() => {
    if (!initialized || candidates.length === 0) return;

    const interval = setInterval(updateResults, REFRESH_INTERVAL);
    updateResults(); // Actualizar inmediatamente al montar
    return () => clearInterval(interval);
  }, [initialized, candidates]);

  // Obtener lista completa de candidatos con sus votos
  async function loadCandidates() {
    try {
      const res = await fetch(`/api/polls`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const polls = await res.json();

      if (polls.length > 0) {
        const poll = polls[0];
        const candidatesWithVotes = poll.options.map((option: any) => ({
          id: option.id,
          text: option.text,
          votes: 0
        }));
        setCandidates(candidatesWithVotes);
        setError('');
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError('Error cargando candidatos');
    }
  }

  // Actualizar solo los votos de los candidatos
  async function updateResults() {
    try {
      const res = await fetch(`/api/results/${POLL_ID}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Mapear votos a candidatos
      const updatedCandidates = candidates.map(candidate => {
        const result = data.results.find((r: any) => r.id === candidate.id);
        return {
          ...candidate,
          votes: result?.votes || 0
        };
      });

      setCandidates(updatedCandidates);
      setTotalVotes(data.totalVotes || 0);
    } catch (err) {
      console.error('Error updating results:', err);
    }
  }

  async function handleVote(optionId: number) {
    if (!deviceFingerprint) {
      setError('Inicializando dispositivo...');
      return;
    }

    if (hasVoted) {
      setError('Ya has votado en esta encuesta');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: POLL_ID,
          optionId,
          deviceFingerprint
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setHasVoted(true);
        setError('');
        // Pequeña pausa antes de actualizar para asegurar que el voto se registró
        setTimeout(() => {
          updateResults();
        }, 500);
      } else if (res.status === 409) {
        setError('⚠️ Ya has votado desde este dispositivo');
        setHasVoted(true);
      } else {
        const errorMsg = data.error || 'Error desconocido al registrar tu voto';
        setError(`❌ Error: ${errorMsg}`);
        console.error('Vote error:', data);
      }
    } catch (err) {
      console.error('Error voting:', err);
      setError('❌ Error de conexión al registrar tu voto');
    } finally {
      setLoading(false);
    }
  }

  const getPercentage = (votes: number): string => {
    if (totalVotes === 0) return '0';
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  if (!initialized || candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-red-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando encuesta presidencial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-red-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🇨🇴 Elecciones Presidenciales 2026
          </h1>
          <p className="text-lg text-gray-600">
            ¿Por quién votarías?
          </p>
          <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
            <span className="font-semibold text-xl">{totalVotes}</span>
            <span className="ml-2">votos registrados</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Candidates List */}
        <div className="space-y-3">
          {candidates.map(candidate => (
            <div key={candidate.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Vote Button */}
              <button
                onClick={() => handleVote(candidate.id)}
                disabled={loading || hasVoted}
                className={`w-full p-4 text-left transition relative group ${
                  hasVoted || loading
                    ? 'bg-gray-50 cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50 cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {candidate.text}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {candidate.votes}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getPercentage(candidate.votes)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 h-full transition-all duration-500 ease-out"
                    style={{ width: `${getPercentage(candidate.votes)}%` }}
                  />
                </div>

                {/* Vote Label on Hover */}
                {!hasVoted && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/50 rounded-lg">
                    <span className="text-white font-semibold">Votar</span>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Voting Status */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          {hasVoted ? (
            <div className="text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-blue-900 font-semibold">¡Tu voto ha sido registrado!</p>
              <p className="text-blue-700 text-sm mt-2">
                Los resultados se actualizan automáticamente cada 2 segundos
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-700">
                Selecciona una fórmula para votar
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Tu voto es anónimo y se protege mediante rastreo de dispositivo
              </p>
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Protección: IP + Device Fingerprint para evitar votos duplicados</p>
          <p>📊 Los resultados se actualizan automáticamente en tiempo real</p>
        </div>
      </div>
    </div>
  );
}
