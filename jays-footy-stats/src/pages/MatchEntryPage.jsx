import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { createMatch, updateMatch, getMatch } from '../services/matchService';

export default function MatchEntryPage() {
  const { player } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id !== 'new';

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    venue: '',
    position: '',
    quartersPlayed: 4,
    result: 'Unknown',
    stats: {
      kicks: 0,
      handballs: 0,
      marks: 0,
      goals: 0,
      behinds: 0,
      tackles: 0,
      spoils: 0,
      smothers: 0,
      interceptions: 0,
      freesFor: 0,
      freesAgainst: 0,
    },
    notes: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      async function loadMatch() {
        const match = await getMatch(parseInt(id));
        if (match && match.date) {
          const matchDate = typeof match.date === 'string' ? match.date : new Date(match.date).toISOString();
          setFormData({
            date: matchDate.split('T')[0],
            opponent: match.opponent || '',
            venue: match.venue || '',
            position: match.position || '',
            quartersPlayed: match.quartersPlayed || 4,
            result: match.result || 'Unknown',
            stats: match.stats || {},
            notes: match.notes || '',
          });
        }
      }
      loadMatch();
    }
  }, [id, isEditing]);

  const updateStat = (statName, delta) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statName]: Math.max(0, prev.stats[statName] + delta)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.opponent.trim()) {
      alert('Please enter opponent name');
      return;
    }

    setSaving(true);
    try {
      const matchData = {
        ...formData,
        playerId: player.id,
        date: new Date(formData.date).toISOString(),
      };

      if (isEditing) {
        await updateMatch(parseInt(id), matchData);
      } else {
        await createMatch(matchData);
      }

      navigate('/history');
    } catch (error) {
      alert('Failed to save match: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const StatCounter = ({ label, statName, value }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => updateStat(statName, -1)}
          className="bg-red-500 text-white w-12 h-12 rounded-full text-2xl font-bold hover:bg-red-600 active:bg-red-700"
        >
          -
        </button>
        <span className="text-4xl font-bold text-gray-800 min-w-[60px] text-center">
          {value}
        </span>
        <button
          type="button"
          onClick={() => updateStat(statName, 1)}
          className="bg-grass-green text-white w-12 h-12 rounded-full text-2xl font-bold hover:bg-green-700 active:bg-green-800"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-afl-red text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">
            {isEditing ? 'Edit Match' : 'New Match'}
          </h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
        {/* Match Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Match Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opponent *
              </label>
              <input
                type="text"
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="e.g., Hampton Rovers"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="e.g., President Park"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select position</option>
                  <option value="Forward">Forward</option>
                  <option value="Midfield">Midfield</option>
                  <option value="Defence">Defence</option>
                  <option value="Ruck">Ruck</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quarters Played
                </label>
                <select
                  value={formData.quartersPlayed}
                  onChange={(e) => setFormData({ ...formData, quartersPlayed: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="1">1 Quarter</option>
                  <option value="2">2 Quarters</option>
                  <option value="3">3 Quarters</option>
                  <option value="4">4 Quarters</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Result
              </label>
              <select
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="Unknown">Unknown</option>
                <option value="Win">Win</option>
                <option value="Loss">Loss</option>
                <option value="Draw">Draw</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Counters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Statistics</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCounter label="Kicks" statName="kicks" value={formData.stats.kicks} />
              <StatCounter label="Handballs" statName="handballs" value={formData.stats.handballs} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCounter label="Marks" statName="marks" value={formData.stats.marks} />
              <StatCounter label="Tackles" statName="tackles" value={formData.stats.tackles} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCounter label="Goals" statName="goals" value={formData.stats.goals} />
              <StatCounter label="Behinds" statName="behinds" value={formData.stats.behinds} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCounter label="Spoils" statName="spoils" value={formData.stats.spoils} />
              <StatCounter label="Smothers" statName="smothers" value={formData.stats.smothers} />
              <StatCounter label="Interceptions" statName="interceptions" value={formData.stats.interceptions} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCounter label="Frees For" statName="freesFor" value={formData.stats.freesFor} />
              <StatCounter label="Frees Against" statName="freesAgainst" value={formData.stats.freesAgainst} />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Notes (Optional)</h2>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24"
            placeholder="Add any additional notes about this match..."
          />
        </div>

        {/* Save Button */}
        <div className="sticky bottom-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-afl-red text-white py-4 px-6 rounded-lg text-xl font-bold shadow-lg hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Match' : 'Save Match')}
          </button>
        </div>
      </form>
    </div>
  );
}
