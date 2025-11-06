import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAllMatches, deleteMatch } from '../services/matchService';

export default function MatchHistoryPage() {
  const { player } = useApp();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      if (!player) return;
      
      try {
        const allMatches = await getAllMatches(player.id);
        setMatches(allMatches);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [player]);

  const handleDelete = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this match? This cannot be undone.')) {
      try {
        await deleteMatch(matchId);
        setMatches(matches.filter(m => m.id !== matchId));
      } catch (error) {
        alert('Failed to delete match: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-afl-navy via-afl-blue to-afl-blue-light text-white p-4 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:text-afl-gold transition-colors"
          >
            ← Home
          </button>
          <h1 className="text-xl font-bold">Match History</h1>
          <Link
            to="/match/new"
            className="text-white hover:text-afl-gold transition-colors"
          >
            + New
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {matches.length === 0 ? (
          <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl p-8 text-center">
            <p className="text-gray-400 mb-4">No matches recorded yet</p>
            <Link
              to="/match/new"
              className="inline-block bg-gradient-to-r from-afl-accent to-red-600 text-white py-2 px-6 rounded-lg font-semibold hover:from-red-600 hover:to-afl-accent transition-all duration-200 shadow-lg"
            >
              Add Your First Match
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-dark-card border border-dark-border rounded-xl shadow-2xl p-4 card-hover"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-white">
                        vs {match.opponent}
                      </h3>
                      {match.isTestData && (
                        <span className="text-xs bg-yellow-900/50 text-yellow-300 border border-yellow-700/50 px-2 py-1 rounded">
                          Test Data
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(match.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {match.venue && (
                      <p className="text-sm text-gray-400">{match.venue}</p>
                    )}
                    {match.position && (
                      <p className="text-xs text-gray-500 mt-1">{match.position}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold text-sm px-3 py-1 rounded-lg ${
                      match.result === 'Win' ? 'bg-green-900/50 text-green-300 border border-green-700/50' :
                      match.result === 'Loss' ? 'bg-red-900/50 text-red-300 border border-red-700/50' :
                      match.result === 'Draw' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50' :
                      'bg-gray-800/50 text-gray-300 border border-gray-700/50'
                    }`}>
                      {match.result}
                    </div>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-4 gap-2 mb-3 text-center text-sm">
                  <div className="bg-afl-navy/50 rounded-lg p-2">
                    <p className="font-bold text-grass-green text-lg">
                      {match.stats.goals}
                    </p>
                    <p className="text-gray-400 text-xs">Goals</p>
                  </div>
                  <div className="bg-afl-navy/50 rounded-lg p-2">
                    <p className="font-bold text-white text-lg">
                      {match.stats.kicks}
                    </p>
                    <p className="text-gray-400 text-xs">Kicks</p>
                  </div>
                  <div className="bg-afl-navy/50 rounded-lg p-2">
                    <p className="font-bold text-white text-lg">
                      {match.stats.marks}
                    </p>
                    <p className="text-gray-400 text-xs">Marks</p>
                  </div>
                  <div className="bg-afl-navy/50 rounded-lg p-2">
                    <p className="font-bold text-white text-lg">
                      {match.stats.tackles}
                    </p>
                    <p className="text-gray-400 text-xs">Tackles</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-dark-border">
                  <Link
                    to={`/match/${match.id}/view`}
                    className="flex-1 text-center py-2 px-4 bg-afl-navy/70 text-white rounded-lg hover:bg-afl-blue-light text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                  {!match.isTestData && (
                    <>
                      <Link
                        to={`/match/${match.id}`}
                        className="flex-1 text-center py-2 px-4 bg-afl-blue-light text-white rounded-lg hover:bg-afl-blue-lighter text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(match.id)}
                        className="flex-1 py-2 px-4 bg-red-900/50 text-red-300 border border-red-700/50 rounded-lg hover:bg-red-900/70 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
