import React, { useState } from 'react';
import {
  generateAllSeasonCSVs,
  downloadCSV
} from '../services/aflDataService';

// Configuration - Available seasons for CSV generation
const AVAILABLE_YEARS = [2023, 2024, 2025];

function CSVGenerator() {
  const [selectedYears, setSelectedYears] = useState([...AVAILABLE_YEARS]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleYearToggle = (year) => {
    setSelectedYears(prev => {
      if (prev.includes(year)) {
        return prev.filter(y => y !== year);
      } else {
        return [...prev, year].sort();
      }
    });
  };

  const handleGenerateCSVs = async () => {
    if (selectedYears.length === 0) {
      setError('Please select at least one year');
      return;
    }

    setLoading(true);
    setError('');
    setProgress('Starting...');
    setResults([]);

    try {
      const generatedResults = await generateAllSeasonCSVs(
        selectedYears,
        (progressData) => {
          setProgress(progressData.message);
        }
      );

      setResults(generatedResults);
      setProgress('All CSVs generated successfully!');
    } catch (err) {
      setError(`Error generating CSVs: ${err.message}`);
      console.error('CSV generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = (result) => {
    if (result.csv) {
      downloadCSV(result.csv, `afl_supercoach_${result.year}.csv`);
    }
  };

  const handleDownloadAll = () => {
    results.forEach(result => {
      if (result.csv) {
        downloadCSV(result.csv, `afl_supercoach_${result.year}.csv`);
      }
    });
  };

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '0.5rem' }}>AFL SuperCoach CSV Generator</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Generate CSV files with AFL player statistics and average SuperCoach scores
      </p>

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Select Seasons</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {AVAILABLE_YEARS.map(year => (
            <label
              key={year}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                backgroundColor: selectedYears.includes(year) ? '#4CAF50' : '#fff',
                color: selectedYears.includes(year) ? '#fff' : '#000',
                borderRadius: '4px',
                border: '1px solid #ddd',
                transition: 'all 0.2s'
              }}
            >
              <input
                type="checkbox"
                checked={selectedYears.includes(year)}
                onChange={() => handleYearToggle(year)}
                style={{ cursor: 'pointer' }}
              />
              <span>{year}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={handleGenerateCSVs}
          disabled={loading || selectedYears.length === 0}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            backgroundColor: loading ? '#ccc' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Generating...' : 'Generate CSVs'}
        </button>
      </div>

      {progress && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#e3f2fd',
          borderLeft: '4px solid #2196F3',
          marginBottom: '1rem',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, color: '#1565c0' }}>{progress}</p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#ffebee',
          borderLeft: '4px solid #f44336',
          marginBottom: '1rem',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, color: '#c62828' }}>{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Generated CSVs</h2>
            <button
              onClick={handleDownloadAll}
              style={{
                padding: '0.5rem 1.5rem',
                fontSize: '0.9rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Download All
            </button>
          </div>

          <div style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {results.map(result => (
              <div
                key={result.year}
                style={{
                  backgroundColor: result.error ? '#ffebee' : '#f5f5f5',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: result.error ? '1px solid #f44336' : '1px solid #ddd'
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                  Season {result.year}
                </h3>
                {result.error ? (
                  <p style={{ color: '#c62828', fontSize: '0.9rem' }}>
                    Error: {result.error}
                  </p>
                ) : (
                  <>
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                      {result.playerData?.length || 0} players
                    </p>
                    <button
                      onClick={() => handleDownloadCSV(result)}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Download CSV
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#333' }}>About this tool</h3>
        <p>
          This tool fetches AFL player statistics from afltables.com and SuperCoach scores
          from footywire.com. It processes the data to calculate each player's average
          SuperCoach score across all rounds they played in a season.
        </p>
        <p style={{ marginBottom: 0 }}>
          The generated CSV files include: Player Name, Games Played, Total Score, and
          Average SuperCoach Score.
        </p>
      </div>
    </div>
  );
}

export default CSVGenerator;
