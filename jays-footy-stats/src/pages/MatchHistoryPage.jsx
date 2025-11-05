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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-afl-red text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-white hover:underline"
          >
            ← Home
          </button>
          <h1 className="text-xl font-bold">Match History</h1>
          <Link
            to="/match/new"
            className="text-white hover:underline"
          >
            + New
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No matches recorded yet</p>
            <Link
              to="/match/new"
              className="inline-block bg-afl-red text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-700"
            >
              Add Your First Match
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        vs {match.opponent}
                      </h3>
                      {match.isTestData && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                          Test Data
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(match.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {match.venue && (
                      <p className="text-sm text-gray-600">{match.venue}</p>
                    )}
                    {match.position && (
                      <p className="text-xs text-gray-500 mt-1">{match.position}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold text-sm px-3 py-1 rounded ${
                      match.result === 'Win' ? 'bg-green-100 text-green-800' :
                      match.result === 'Loss' ? 'bg-red-100 text-red-800' :
                      match.result === 'Draw' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.result}
                    </div>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-4 gap-2 mb-3 text-center text-sm">
                  <div>
                    <p className="font-bold text-grass-green text-lg">
                      {match.stats.goals}
                    </p>
                    <p className="text-gray-600 text-xs">Goals</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">
                      {match.stats.kicks}
                    </p>
                    <p className="text-gray-600 text-xs">Kicks</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">
                      {match.stats.marks}
                    </p>
                    <p className="text-gray-600 text-xs">Marks</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">
                      {match.stats.tackles}
                    </p>
                    <p className="text-gray-600 text-xs">Tackles</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <Link
                    to={`/match/${match.id}/view`}
                    className="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm font-medium"
                  >
                    View Details
                  </Link>
                  {!match.isTestData && (
                    <>
                      <Link
                        to={`/match/${match.id}`}
                        className="flex-1 text-center py-2 px-4 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(match.id)}
                        className="flex-1 py-2 px-4 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm font-medium"
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
