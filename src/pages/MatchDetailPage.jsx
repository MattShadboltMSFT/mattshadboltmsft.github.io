import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getMatch } from '../services/matchService';
import ThemeSelector from '../components/ThemeSelector';

export default function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
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
      <div className={`min-h-screen ${theme.colors.bgPrimary} flex items-center justify-center`}>
        <div className={`text-xl ${theme.colors.textPrimary}`}>Loading...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className={`min-h-screen ${theme.colors.bgPrimary} flex items-center justify-center`}>
        <div className={`text-xl ${theme.colors.textPrimary}`}>Match not found</div>
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
    <div className={`min-h-screen ${theme.colors.bgPrimary}`}>
      {/* Header */}
      <div className={`${theme.colors.bgSecondary} ${theme.colors.textPrimary} p-4 shadow-2xl`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/history')}
            className={`${theme.colors.textPrimary} hover:opacity-80 transition-opacity`}
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Match Details</h1>
          <div className="flex items-center gap-2">
            {!match.isTestData && (
              <Link
                to={`/match/${match.id}`}
                className={`${theme.colors.textPrimary} hover:opacity-80 transition-opacity`}
              >
                Edit
              </Link>
            )}
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Match Info Card */}
        <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-6`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className={`text-2xl font-bold ${theme.colors.textPrimary} mb-2`}>
                vs {match.opponent}
              </h2>
              <p className={theme.colors.textSecondary}>
                {new Date(match.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className={`font-bold text-lg px-4 py-2 ${theme.styles.badge} ${
              match.result === 'Win' ? theme.colors.statSuccess :
              match.result === 'Loss' ? theme.colors.statWarning :
              match.result === 'Draw' ? theme.colors.statInfo :
              theme.colors.textSecondary
            }`}>
              {match.result}
            </div>
          </div>

          {match.isTestData && (
            <div className={`mb-4 ${theme.colors.statWarning} px-3 py-2 ${theme.styles.badge} text-sm`}>
              This is test data from the 2025 fixture
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {match.venue && (
              <div>
                <p className={theme.colors.textSecondary}>Venue</p>
                <p className={`font-semibold ${theme.colors.textPrimary}`}>{match.venue}</p>
              </div>
            )}
            {match.position && (
              <div>
                <p className={theme.colors.textSecondary}>Position</p>
                <p className={`font-semibold ${theme.colors.textPrimary}`}>{match.position}</p>
              </div>
            )}
            <div>
              <p className={theme.colors.textSecondary}>Quarters Played</p>
              <p className={`font-semibold ${theme.colors.textPrimary}`}>{match.quartersPlayed} / 4</p>
            </div>
            {match.weather && (
              <div>
                <p className={theme.colors.textSecondary}>Weather</p>
                <p className={`font-semibold ${theme.colors.textPrimary}`}>{match.weather}</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-6`}>
          <h3 className={`text-xl font-bold ${theme.colors.textPrimary} mb-4`}>Statistics</h3>
          
          <div className="space-y-3">
            {allStats.map(({ label, value }) => (
              <div key={label} className={`flex justify-between items-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
                <span className={theme.colors.textSecondary}>{label}</span>
                <span className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className={`mt-6 pt-4 border-t ${theme.colors.border}`}>
            <div className="flex justify-between items-center">
              <span className={`font-semibold ${theme.colors.textSecondary}`}>Total Disposals</span>
              <span className={`text-3xl font-bold ${theme.colors.textAccent}`}>
                {match.stats.kicks + match.stats.handballs}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {match.notes && (
          <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-6`}>
            <h3 className={`text-lg font-bold ${theme.colors.textPrimary} mb-2`}>Notes</h3>
            <p className={`${theme.colors.textSecondary} whitespace-pre-wrap`}>{match.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
