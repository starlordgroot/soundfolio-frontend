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
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 40,
    maxWidth: 900,
    margin: '0 auto',
    color: '#333',
  },
  title: {
    fontSize: 42,
    marginBottom: 20,
    color: '#111',
    borderBottom: '2px solid #ddd',
    paddingBottom: 10
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 12,
    marginBottom: 30
  },
  input: {
    padding: 10,
    borderRadius: 4,
    border: '1px solid #ccc',
    fontSize: 14
  },
  button: {
    padding: 10,
    background: '#111',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    gridColumn: 'span 2'
  },
  filters: {
    display: 'flex',
    gap: 12,
    marginBottom: 30,
    flexWrap: 'wrap'
  },
  select: {
    padding: 10,
    fontSize: 14,
    borderRadius: 4,
    border: '1px solid #ccc'
  },
  songList: {
    display: 'grid',
    gap: 20
  },
  songCard: {
    padding: 20,
    border: '1px solid #eee',
    borderRadius: 6,
    backgroundColor: '#fafafa',
    boxShadow: '1px 1px 4px rgba(0,0,0,0.05)'
  },
  songTitle: {
    marginBottom: 4,
    fontSize: 20
  },
  review: {
    fontStyle: 'italic',
    marginTop: 10
  }
};

export default App;