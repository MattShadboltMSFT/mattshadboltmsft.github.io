import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useApp } from '../context/AppContext';
import { getSeasonStats } from '../services/matchService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { player } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!player) return;
      
      try {
        const seasonStats = await getSeasonStats(player.id, player.season);
        setStats(seasonStats);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [player]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!stats || stats.totalGames === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-afl-red text-white p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate('/')} className="text-white hover:underline">
              ← Home
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="w-16"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">No matches to display</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const matches = stats.matches.slice().reverse(); // Chronological order
  const chartData = {
    labels: matches.map((_, index) => `Match ${index + 1}`),
    datasets: [
      {
        label: 'Goals',
        data: matches.map(m => m.stats.goals),
        borderColor: '#2C7A3D',
        backgroundColor: 'rgba(44, 122, 61, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Kicks',
        data: matches.map(m => m.stats.kicks),
        borderColor: '#E21837',
        backgroundColor: 'rgba(226, 24, 55, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Season Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Season {player.season}</h2>
          <div className="text-center mb-4">
            <p className="text-gray-600 text-sm">Total Games Played</p>
            <p className="text-5xl font-bold text-afl-red">{stats.totalGames}</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-4xl font-bold text-grass-green mb-2">{stats.stats.goals}</p>
            <p className="text-gray-600">Total Goals</p>
            <p className="text-sm text-gray-500 mt-1">Avg: {stats.averages.goals}/game</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-4xl font-bold text-gray-800 mb-2">{stats.stats.kicks}</p>
            <p className="text-gray-600">Total Kicks</p>
            <p className="text-sm text-gray-500 mt-1">Avg: {stats.averages.kicks}/game</p>
          </div>
        </div>

        {/* All Stats Grid */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Season Totals</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.stats.handballs}</p>
              <p className="text-sm text-gray-600">Handballs</p>
              <p className="text-xs text-gray-500">Avg: {stats.averages.handballs}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.stats.marks}</p>
              <p className="text-sm text-gray-600">Marks</p>
              <p className="text-xs text-gray-500">Avg: {stats.averages.marks}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.stats.tackles}</p>
              <p className="text-sm text-gray-600">Tackles</p>
              <p className="text-xs text-gray-500">Avg: {stats.averages.tackles}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.stats.spoils}</p>
              <p className="text-sm text-gray-600">Spoils</p>
              <p className="text-xs text-gray-500">Avg: {stats.averages.spoils}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.stats.interceptions}</p>
              <p className="text-sm text-gray-600">Interceptions</p>
              <p className="text-xs text-gray-500">Avg: {stats.averages.interceptions}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{stats.stats.behinds}</p>
              <p className="text-sm text-gray-600">Behinds</p>
              <p className="text-xs text-gray-500">Avg: {stats.averages.behinds}</p>
            </div>
          </div>
        </div>

        {/* Personal Bests */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Personal Bests</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-achievement-gold bg-opacity-20 p-3 rounded">
              <p className="text-2xl font-bold">{stats.personalBests.goals}</p>
              <p className="text-sm">Goals</p>
            </div>
            <div className="text-center bg-achievement-gold bg-opacity-20 p-3 rounded">
              <p className="text-2xl font-bold">{stats.personalBests.kicks}</p>
              <p className="text-sm">Kicks</p>
            </div>
            <div className="text-center bg-achievement-gold bg-opacity-20 p-3 rounded">
              <p className="text-2xl font-bold">{stats.personalBests.marks}</p>
              <p className="text-sm">Marks</p>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
