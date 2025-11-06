import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getMatch } from '../services/matchService';

export default function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatch() {
      try {
        const matchData = await getMatch(parseInt(id));
        setMatch(matchData);
      } catch (error) {
        console.error('Failed to load match:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-xl text-white">Match not found</div>
      </div>
    );
  }

  const allStats = [
    { label: 'Kicks', value: match.stats.kicks },
    { label: 'Handballs', value: match.stats.handballs },
    { label: 'Marks', value: match.stats.marks },
    { label: 'Goals', value: match.stats.goals },
    { label: 'Behinds', value: match.stats.behinds },
    { label: 'Tackles', value: match.stats.tackles },
    { label: 'Spoils', value: match.stats.spoils },
    { label: 'Smothers', value: match.stats.smothers },
    { label: 'Interceptions', value: match.stats.interceptions },
    { label: 'Frees For', value: match.stats.freesFor },
    { label: 'Frees Against', value: match.stats.freesAgainst },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-afl-navy via-afl-blue to-afl-blue-light text-white p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/history')}
            className="text-white hover:text-afl-gold transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Match Details</h1>
          {!match.isTestData && (
            <Link
              to={`/match/${match.id}`}
              className="text-white hover:text-afl-gold transition-colors"
            >
              Edit
            </Link>
          )}
          {match.isTestData && <div className="w-12"></div>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Match Info Card */}
        <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                vs {match.opponent}
              </h2>
              <p className="text-gray-400">
                {new Date(match.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className={`font-bold text-lg px-4 py-2 rounded-lg ${
              match.result === 'Win' ? 'bg-green-900/50 text-green-300 border border-green-700/50' :
              match.result === 'Loss' ? 'bg-red-900/50 text-red-300 border border-red-700/50' :
              match.result === 'Draw' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50' :
              'bg-gray-800/50 text-gray-300 border border-gray-700/50'
            }`}>
              {match.result}
            </div>
          </div>

          {match.isTestData && (
            <div className="mb-4 bg-yellow-900/30 border border-yellow-700/50 text-yellow-200 px-3 py-2 rounded-lg text-sm">
              This is test data from the 2025 fixture
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {match.venue && (
              <div>
                <p className="text-gray-400">Venue</p>
                <p className="font-semibold text-white">{match.venue}</p>
              </div>
            )}
            {match.position && (
              <div>
                <p className="text-gray-400">Position</p>
                <p className="font-semibold text-white">{match.position}</p>
              </div>
            )}
            <div>
              <p className="text-gray-400">Quarters Played</p>
              <p className="font-semibold text-white">{match.quartersPlayed} / 4</p>
            </div>
            {match.weather && (
              <div>
                <p className="text-gray-400">Weather</p>
                <p className="font-semibold text-white">{match.weather}</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
          
          <div className="space-y-3">
            {allStats.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center bg-afl-navy/50 rounded-lg p-3">
                <span className="text-gray-300">{label}</span>
                <span className="text-2xl font-bold text-white">{value}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-4 border-t border-dark-border">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-300">Total Disposals</span>
              <span className="text-3xl font-bold text-afl-gold">
                {match.stats.kicks + match.stats.handballs}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {match.notes && (
          <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Notes</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{match.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
