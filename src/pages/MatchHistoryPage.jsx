import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getAllMatches, deleteMatch } from '../services/matchService';
import ThemeSelector from '../components/ThemeSelector';

export default function MatchHistoryPage() {
  const { player } = useApp();
  const { theme } = useTheme();
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
      <div className={`min-h-screen ${theme.colors.bgPrimary} flex items-center justify-center`}>
        <div className={`text-xl ${theme.colors.textPrimary}`}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.colors.bgPrimary}`}>
      {/* Header */}
      <div className={`${theme.colors.bgSecondary} ${theme.colors.textPrimary} p-4 shadow-2xl`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className={`${theme.colors.textPrimary} hover:opacity-80 transition-opacity`}
          >
            ← Home
          </button>
          <h1 className="text-xl font-bold">Match History</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/match/new"
              className={`${theme.colors.textPrimary} hover:opacity-80 transition-opacity`}
            >
              + New
            </Link>
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {matches.length === 0 ? (
          <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-8 text-center`}>
            <p className={`${theme.colors.textSecondary} mb-4`}>No matches recorded yet</p>
            <Link
              to="/match/new"
              className={`inline-block ${theme.colors.btnPrimary} ${theme.colors.textPrimary} py-2 px-6 ${theme.styles.button} font-semibold`}
            >
              Add Your First Match
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-4 ${theme.colors.bgCardHover} transition-all duration-200`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-lg ${theme.colors.textPrimary}`}>
                        vs {match.opponent}
                      </h3>
                      {match.isTestData && (
                        <span className={`text-xs ${theme.colors.statWarning} px-2 py-1 ${theme.styles.badge}`}>
                          Test Data
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${theme.colors.textSecondary}`}>
                      {new Date(match.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {match.venue && (
                      <p className={`text-sm ${theme.colors.textSecondary}`}>{match.venue}</p>
                    )}
                    {match.position && (
                      <p className={`text-xs ${theme.colors.textSecondary} mt-1`}>{match.position}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold text-sm px-3 py-1 ${theme.styles.badge} ${
                      match.result === 'Win' ? theme.colors.statSuccess :
                      match.result === 'Loss' ? theme.colors.statWarning :
                      match.result === 'Draw' ? theme.colors.statInfo :
                      theme.colors.textSecondary
                    }`}>
                      {match.result}
                    </div>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-4 gap-2 mb-3 text-center text-sm">
                  <div className={`${theme.colors.bgCard} ${theme.styles.card} p-2`}>
                    <p className={`font-bold ${theme.colors.statSuccess} text-lg`}>
                      {match.stats.goals}
                    </p>
                    <p className={`${theme.colors.textSecondary} text-xs`}>Goals</p>
                  </div>
                  <div className={`${theme.colors.bgCard} ${theme.styles.card} p-2`}>
                    <p className={`font-bold ${theme.colors.textPrimary} text-lg`}>
                      {match.stats.kicks}
                    </p>
                    <p className={`${theme.colors.textSecondary} text-xs`}>Kicks</p>
                  </div>
                  <div className={`${theme.colors.bgCard} ${theme.styles.card} p-2`}>
                    <p className={`font-bold ${theme.colors.textPrimary} text-lg`}>
                      {match.stats.marks}
                    </p>
                    <p className={`${theme.colors.textSecondary} text-xs`}>Marks</p>
                  </div>
                  <div className={`${theme.colors.bgCard} ${theme.styles.card} p-2`}>
                    <p className={`font-bold ${theme.colors.textPrimary} text-lg`}>
                      {match.stats.tackles}
                    </p>
                    <p className={`${theme.colors.textSecondary} text-xs`}>Tackles</p>
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex gap-2 pt-3 border-t ${theme.colors.border}`}>
                  <Link
                    to={`/match/${match.id}/view`}
                    className={`flex-1 text-center py-2 px-4 ${theme.colors.btnSecondary} ${theme.colors.textPrimary} ${theme.styles.button} text-sm font-medium`}
                  >
                    View Details
                  </Link>
                  {!match.isTestData && (
                    <>
                      <Link
                        to={`/match/${match.id}`}
                        className={`flex-1 text-center py-2 px-4 ${theme.colors.btnPrimary} ${theme.colors.textPrimary} ${theme.styles.button} text-sm font-medium`}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(match.id)}
                        className={`flex-1 py-2 px-4 ${theme.colors.statWarning} ${theme.styles.button} text-sm font-medium`}
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
