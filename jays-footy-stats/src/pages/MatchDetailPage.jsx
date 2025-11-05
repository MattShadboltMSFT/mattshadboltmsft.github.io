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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Match not found</div>
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-afl-red text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/history')}
            className="text-white hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Match Details</h1>
          {!match.isTestData && (
            <Link
              to={`/match/${match.id}`}
              className="text-white hover:underline"
            >
              Edit
            </Link>
          )}
          {match.isTestData && <div className="w-12"></div>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Match Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                vs {match.opponent}
              </h2>
              <p className="text-gray-600">
                {new Date(match.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className={`font-bold text-lg px-4 py-2 rounded ${
              match.result === 'Win' ? 'bg-green-100 text-green-800' :
              match.result === 'Loss' ? 'bg-red-100 text-red-800' :
              match.result === 'Draw' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {match.result}
            </div>
          </div>

          {match.isTestData && (
            <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-2 rounded text-sm">
              This is test data from the 2025 fixture
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {match.venue && (
              <div>
                <p className="text-gray-600">Venue</p>
                <p className="font-semibold">{match.venue}</p>
              </div>
            )}
            {match.position && (
              <div>
                <p className="text-gray-600">Position</p>
                <p className="font-semibold">{match.position}</p>
              </div>
            )}
            <div>
              <p className="text-gray-600">Quarters Played</p>
              <p className="font-semibold">{match.quartersPlayed} / 4</p>
            </div>
            {match.weather && (
              <div>
                <p className="text-gray-600">Weather</p>
                <p className="font-semibold">{match.weather}</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Statistics</h3>
          
          <div className="space-y-3">
            {allStats.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-700">{label}</span>
                <span className="text-2xl font-bold text-gray-900">{value}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Disposals</span>
              <span className="text-3xl font-bold text-afl-red">
                {match.stats.kicks + match.stats.handballs}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {match.notes && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{match.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
