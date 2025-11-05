import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getSeasonStats, getAllMatches } from '../services/matchService';
import { hasTestData, loadTestData, clearAllTestData } from '../services/testDataService';

export default function HomePage() {
  const { player } = useApp();
  const [stats, setStats] = useState(null);
  const [recentMatches, setRecentMatches] = useState([]);
  const [testDataLoaded, setTestDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!player) return;
      
      try {
        const seasonStats = await getSeasonStats(player.id, player.season);
        setStats(seasonStats);
        
        const matches = await getAllMatches(player.id);
        setRecentMatches(matches.slice(0, 3));
        
        const hasTest = await hasTestData();
        setTestDataLoaded(hasTest);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [player]);

  const handleLoadTestData = async () => {
    try {
      const count = await loadTestData(player.id);
      alert(`Loaded ${count} test matches successfully!`);
      window.location.reload(); // Refresh to show new data
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClearTestData = async () => {
    if (window.confirm('Are you sure you want to clear all test data? This cannot be undone.')) {
      try {
        const count = await clearAllTestData();
        alert(`Cleared ${count} test matches successfully!`);
        window.location.reload(); // Refresh to show updated data
      } catch (error) {
        alert('Failed to clear test data: ' + error.message);
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
      <div className="bg-afl-red text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Jays Footy Stats</h1>
        <p className="text-sm opacity-90 mt-1">
          {player?.teamName} - Season {player?.season}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Quick Action */}
        <div className="mb-6">
          <Link
            to="/match/new"
            className="block w-full bg-afl-red text-white py-4 px-6 rounded-lg text-center text-xl font-bold shadow-lg hover:bg-red-700 transition"
          >
            + New Match
          </Link>
        </div>

        {/* Test Data Controls */}
        {testDataLoaded && (
          <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            <p className="font-semibold">Test Data Loaded</p>
            <p className="text-sm">
              You are viewing test data from the 2025 fixture. Real matches are not affected.
            </p>
            <button
              onClick={handleClearTestData}
              className="mt-2 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm"
            >
              Clear Test Data
            </button>
          </div>
        )}

        {!testDataLoaded && stats?.totalGames === 0 && (
          <div className="mb-4 bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded">
            <p className="font-semibold">No Matches Yet</p>
            <p className="text-sm mb-2">
              Load test data to see how the dashboard looks with sample matches, or add a real match.
            </p>
            <button
              onClick={handleLoadTestData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Load Test Data (17 matches)
            </button>
          </div>
        )}

        {/* Season Summary */}
        {stats && stats.totalGames > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Season Summary</h2>
            
            {/* Games Played */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm">Games Played</p>
              <p className="text-4xl font-bold text-afl-red">{stats.totalGames}</p>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-grass-green">{stats.stats.goals}</p>
                <p className="text-sm text-gray-600">Goals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{stats.stats.kicks}</p>
                <p className="text-sm text-gray-600">Kicks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{stats.stats.marks}</p>
                <p className="text-sm text-gray-600">Marks</p>
              </div>
            </div>

            {/* Averages */}
            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Per Game Averages</p>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div>
                  <p className="font-bold">{stats.averages.kicks}</p>
                  <p className="text-gray-600 text-xs">Kicks</p>
                </div>
                <div>
                  <p className="font-bold">{stats.averages.handballs}</p>
                  <p className="text-gray-600 text-xs">Handballs</p>
                </div>
                <div>
                  <p className="font-bold">{stats.averages.tackles}</p>
                  <p className="text-gray-600 text-xs">Tackles</p>
                </div>
                <div>
                  <p className="font-bold">{stats.averages.marks}</p>
                  <p className="text-gray-600 text-xs">Marks</p>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="block mt-4 text-center text-afl-red hover:underline font-semibold"
            >
              View Full Dashboard →
            </Link>
          </div>
        )}

        {/* Recent Matches */}
        {recentMatches.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Matches</h2>
            <div className="space-y-3">
              {recentMatches.map((match) => (
                <Link
                  key={match.id}
                  to={`/match/${match.id}/view`}
                  className="block border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">vs {match.opponent}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(match.date).toLocaleDateString()} • {match.venue}
                      </p>
                      {match.isTestData && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded mt-1 inline-block">
                          Test Data
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-grass-green">
                        {match.stats.goals}G {match.stats.behinds}B
                      </p>
                      <p className="text-xs text-gray-600">
                        {match.stats.kicks}K {match.stats.marks}M
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              to="/history"
              className="block mt-4 text-center text-afl-red hover:underline font-semibold"
            >
              View All Matches →
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/dashboard"
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <p className="text-2xl mb-2">📊</p>
            <p className="font-semibold text-gray-800">Dashboard</p>
          </Link>
          <Link
            to="/history"
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition"
          >
            <p className="text-2xl mb-2">📋</p>
            <p className="font-semibold text-gray-800">Match History</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
