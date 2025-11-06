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
import { useTheme } from '../context/ThemeContext';
import { getSeasonStats } from '../services/matchService';
import { exportToCSV, exportToPDF } from '../services/exportService';
import ThemeSelector from '../components/ThemeSelector';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ThemedDashboardPage() {
  const { player } = useApp();
  const { theme, currentTheme } = useTheme();
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
      <div className={`min-h-screen ${theme.colors.bgPrimary} flex items-center justify-center`}>
        <div className={`text-xl ${theme.colors.textPrimary}`}>Loading...</div>
      </div>
    );
  }

  const getBackgroundClass = () => {
    if (currentTheme === 'vibrantGradient') {
      return `min-h-screen bg-gradient-to-br ${theme.colors.bgPrimary}`;
    }
    return `min-h-screen ${theme.colors.bgPrimary}`;
  };

  if (!stats || stats.totalGames === 0) {
    return (
      <div className={getBackgroundClass()}>
        <div className={`${currentTheme === 'vibrantGradient' ? 'bg-gradient-to-r' : ''} ${theme.colors.bgSecondary} ${theme.colors.textPrimary} p-4 shadow-2xl`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate('/')} className={`${theme.colors.textPrimary} hover:opacity-80 transition-opacity`}>
              ← Home
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <ThemeSelector />
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-4">
          <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-8 text-center`}>
            <p className={theme.colors.textSecondary}>No matches to display</p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare chart data with theme-aware colors
  const matches = stats.matches.slice().reverse();
  const getChartColors = () => {
    if (currentTheme === 'vibrantGradient') {
      return {
        goals: { border: '#4ade80', background: 'rgba(74, 222, 128, 0.3)' },
        kicks: { border: '#60a5fa', background: 'rgba(96, 165, 250, 0.3)' }
      };
    } else if (currentTheme === 'minimalistClean') {
      return {
        goals: { border: '#059669', background: 'rgba(5, 150, 105, 0.2)' },
        kicks: { border: '#2563eb', background: 'rgba(37, 99, 235, 0.2)' }
      };
    } else {
      return {
        goals: { border: '#15803d', background: 'rgba(21, 128, 61, 0.3)' },
        kicks: { border: '#1d4ed8', background: 'rgba(29, 78, 216, 0.3)' }
      };
    }
  };

  const chartColors = getChartColors();
  const chartData = {
    labels: matches.map((_, index) => `Match ${index + 1}`),
    datasets: [
      {
        label: 'Goals',
        data: matches.map(m => m.stats.goals),
        borderColor: chartColors.goals.border,
        backgroundColor: chartColors.goals.background,
        tension: 0.3,
      },
      {
        label: 'Kicks',
        data: matches.map(m => m.stats.kicks),
        borderColor: chartColors.kicks.border,
        backgroundColor: chartColors.kicks.background,
        tension: 0.3,
      },
    ],
  };

  const getTextColor = () => {
    if (currentTheme === 'vibrantGradient') return '#E5E7EB';
    if (currentTheme === 'minimalistClean') return '#1F2937';
    return '#1F2937';
  };

  const getGridColor = () => {
    if (currentTheme === 'vibrantGradient') return 'rgba(255, 255, 255, 0.1)';
    if (currentTheme === 'minimalistClean') return '#E5E7EB';
    return '#CBD5E1';
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: getTextColor(),
        },
      },
      title: {
        display: true,
        text: 'Performance Trends',
        color: getTextColor(),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: getTextColor(),
        },
        grid: {
          color: getGridColor(),
        },
      },
      x: {
        ticks: {
          color: getTextColor(),
        },
        grid: {
          color: getGridColor(),
        },
      },
    },
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(stats.matches, player.name, player.season);
    } catch (error) {
      alert('Failed to export CSV: ' + error.message);
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(stats.matches, player.name, player.teamName, player.season, stats);
    } catch (error) {
      alert('Failed to export PDF: ' + error.message);
    }
  };

  return (
    <div className={getBackgroundClass()}>
      {/* Header */}
      <div className={`${currentTheme === 'vibrantGradient' ? 'bg-gradient-to-r' : ''} ${theme.colors.bgSecondary} ${theme.colors.textPrimary} p-4 shadow-2xl`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className={`${theme.colors.textPrimary} hover:opacity-80 transition-opacity`}
          >
            ← Home
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <ThemeSelector />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Season Overview */}
        <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-6`}>
          <h2 className={`text-2xl font-bold mb-4 ${theme.colors.textPrimary}`}>Season {player.season}</h2>
          <div className="text-center mb-4">
            <p className={`${theme.colors.textSecondary} text-sm`}>Total Games Played</p>
            <p className={`text-5xl font-bold ${theme.colors.textAccent}`}>{stats.totalGames}</p>
          </div>

          {/* Export Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={handleExportCSV}
              className={`${theme.colors.btnSecondary} py-3 px-4 ${theme.styles.button} text-sm`}
            >
              📊 Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className={`${theme.colors.btnPrimary} py-3 px-4 ${theme.styles.button} text-sm`}
            >
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-6 text-center`}>
            <p className={`text-4xl font-bold ${theme.colors.statSuccess} mb-2`}>{stats.stats.goals}</p>
            <p className={theme.colors.textPrimary}>Total Goals</p>
            <p className={`text-sm ${theme.colors.textSecondary} mt-1`}>Avg: {stats.averages.goals}/game</p>
          </div>
          <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-6 text-center`}>
            <p className={`text-4xl font-bold ${theme.colors.textPrimary} mb-2`}>{stats.stats.kicks}</p>
            <p className={theme.colors.textPrimary}>Total Kicks</p>
            <p className={`text-sm ${theme.colors.textSecondary} mt-1`}>Avg: {stats.averages.kicks}/game</p>
          </div>
        </div>

        {/* All Stats Grid */}
        <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-6`}>
          <h3 className={`text-xl font-bold mb-4 ${theme.colors.textPrimary}`}>Season Totals</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className={`text-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
              <p className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{stats.stats.handballs}</p>
              <p className={`text-sm ${theme.colors.textSecondary}`}>Handballs</p>
              <p className={`text-xs ${theme.colors.textSecondary}`}>Avg: {stats.averages.handballs}</p>
            </div>
            <div className={`text-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
              <p className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{stats.stats.marks}</p>
              <p className={`text-sm ${theme.colors.textSecondary}`}>Marks</p>
              <p className={`text-xs ${theme.colors.textSecondary}`}>Avg: {stats.averages.marks}</p>
            </div>
            <div className={`text-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
              <p className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{stats.stats.tackles}</p>
              <p className={`text-sm ${theme.colors.textSecondary}`}>Tackles</p>
              <p className={`text-xs ${theme.colors.textSecondary}`}>Avg: {stats.averages.tackles}</p>
            </div>
            <div className={`text-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
              <p className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{stats.stats.spoils}</p>
              <p className={`text-sm ${theme.colors.textSecondary}`}>Spoils</p>
              <p className={`text-xs ${theme.colors.textSecondary}`}>Avg: {stats.averages.spoils}</p>
            </div>
            <div className={`text-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
              <p className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{stats.stats.interceptions}</p>
              <p className={`text-sm ${theme.colors.textSecondary}`}>Interceptions</p>
              <p className={`text-xs ${theme.colors.textSecondary}`}>Avg: {stats.averages.interceptions}</p>
            </div>
            <div className={`text-center ${theme.colors.bgCard} ${theme.styles.card} p-3`}>
              <p className={`text-2xl font-bold ${theme.colors.textPrimary}`}>{stats.stats.behinds}</p>
              <p className={`text-sm ${theme.colors.textSecondary}`}>Behinds</p>
              <p className={`text-xs ${theme.colors.textSecondary}`}>Avg: {stats.averages.behinds}</p>
            </div>
          </div>
        </div>

        {/* Personal Bests */}
        <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-6`}>
          <h3 className={`text-xl font-bold mb-4 ${theme.colors.textPrimary}`}>Personal Bests</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className={`text-center ${theme.colors.bgCard} border ${theme.colors.borderAccent} p-3 ${theme.styles.card}`}>
              <p className={`text-2xl font-bold ${theme.colors.textAccent}`}>{stats.personalBests.goals}</p>
              <p className={`text-sm ${theme.colors.textPrimary}`}>Goals</p>
            </div>
            <div className={`text-center ${theme.colors.bgCard} border ${theme.colors.borderAccent} p-3 ${theme.styles.card}`}>
              <p className={`text-2xl font-bold ${theme.colors.textAccent}`}>{stats.personalBests.kicks}</p>
              <p className={`text-sm ${theme.colors.textPrimary}`}>Kicks</p>
            </div>
            <div className={`text-center ${theme.colors.bgCard} border ${theme.colors.borderAccent} p-3 ${theme.styles.card}`}>
              <p className={`text-2xl font-bold ${theme.colors.textAccent}`}>{stats.personalBests.marks}</p>
              <p className={`text-sm ${theme.colors.textPrimary}`}>Marks</p>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className={`${theme.colors.bgCard} border ${theme.colors.border} ${theme.styles.card} p-6`}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
