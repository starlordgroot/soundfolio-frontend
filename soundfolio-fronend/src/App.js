import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = "http://localhost:8080/songfolio/my-music";

function App() {
  const [songs, setSongs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    artist: '',
    rating: 3,
    review: '',
    moods: ''
  });

  const [sort, setSort] = useState('');
  const [artistSearch, setArtistSearch] = useState('');
  const [moodSearch, setMoodSearch] = useState('');

  useEffect(() => {
    fetchSongs();
  }, [sort]);

  const fetchSongs = async () => {
    const params = {};
    if (artistSearch) params.artist = artistSearch;
    if (moodSearch) params.mood = moodSearch;
    if (sort) params.sort = sort;

    try {
      const res = await axios.get(`${BACKEND_URL}/songs`, { params });
      setSongs(res.data);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      moods: form.moods.split(',').map(m => m.trim())
    };

    try {
      await axios.post(`${BACKEND_URL}/create`, payload);
      setForm({ title: '', artist: '', rating: 3, review: '', moods: '' });
      fetchSongs();
    } catch (err) {
      console.error("Error adding song:", err);
    }
  };

  return (
      <>
        {/* Animated Background */}
        <div style={styles.background}></div>

        {/* Foreground UI */}
        <div style={styles.container}>
          <h1 style={styles.title}>🎧 Soundfolio</h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input style={styles.input} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input style={styles.input} placeholder="Artist" value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} />
            <input
                style={styles.input}
                type="number"
                step="0.5"
                min="1"
                max="5"
                placeholder="Rating"
                value={form.rating}
                onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) })}
            />
            <input style={styles.input} placeholder="Moods (comma-separated)" value={form.moods} onChange={e => setForm({ ...form, moods: e.target.value })} />
            <textarea style={{ ...styles.input, height: 60 }} placeholder="Review" value={form.review} onChange={e => setForm({ ...form, review: e.target.value })} />
            <button type="submit" style={styles.button}>Add Song</button>
          </form>

          <div style={styles.filters}>
            <input style={styles.input} placeholder="Search by artist" value={artistSearch} onChange={e => setArtistSearch(e.target.value)} />
            <input style={styles.input} placeholder="Search by mood" value={moodSearch} onChange={e => setMoodSearch(e.target.value)} />
            <select style={styles.select} onChange={e => setSort(e.target.value)} value={sort}>
              <option value="">Sort: None</option>
              <option value="newest">Newest</option>
              <option value="top">Top Rated</option>
            </select>
            <button style={styles.button} onClick={fetchSongs}>Search</button>
          </div>

          <div style={styles.songList}>
            {songs.map(song => (
                <div key={song.id} style={styles.songCard}>
                  <h3 style={styles.songTitle}>{song.title} <span style={{ fontWeight: 300 }}>by {song.artist}</span></h3>
                  <p>⭐ {song.rating} / 5</p>
                  <p><b>Moods:</b> {song.moods.join(', ')}</p>
                  {song.review && <p style={styles.review}>“{song.review}”</p>}
                </div>
            ))}
          </div>
        </div>
      </>
  );
}

const styles = {
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(-45deg, #f0f4f8, #e0ecf8, #f4f7fa, #dee9f7)',
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
    opacity: 0.7
  },
  container: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: 'transparent',
    color: '#1f2937',
    padding: 40,
    maxWidth: 900,
    margin: '0 auto',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    marginBottom: 30,
    color: '#111827',
    fontWeight: 700,
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: 10,
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
    marginBottom: 32,
    backgroundColor: '#ffffffcc',
    padding: 24,
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
    backdropFilter: 'blur(8px)',
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: '1px solid #d1d5db',
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#1f2937',
  },
  button: {
    padding: 12,
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    gridColumn: 'span 2',
    transition: 'background-color 0.2s ease',
  },
  filters: {
    display: 'flex',
    gap: 12,
    marginBottom: 30,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  select: {
    padding: 10,
    fontSize: 14,
    borderRadius: 6,
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    color: '#1f2937',
  },
  songList: {
    display: 'grid',
    gap: 20,
  },
  songCard: {
    padding: 20,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffffcc',
    backdropFilter: 'blur(6px)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
  },
  songTitle: {
    marginBottom: 6,
    fontSize: 20,
    fontWeight: 600,
    color: '#111827',
  },
  review: {
    fontStyle: 'italic',
    marginTop: 10,
    color: '#6b7280',
  }
};

export default App;