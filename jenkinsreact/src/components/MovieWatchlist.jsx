import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import config from './config.js';

const MovieWatchlist = () => {
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState({
    id: '',
    title: '',
    genre: '',
    hero: '',
    heroine: '',
    releaseYear: '',
    rating: '',
    status: ''
  });
  const [statusToFetch, setStatusToFetch] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${config.url}/watchlistapi`;

  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchAllMovies = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setMovies(res.data);
    } catch (error) {
      setMessage('Failed to fetch movies.');
    }
  };

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const validateForm = (isEdit = false) => {
    const keysToValidate = Object.keys(movie).filter((k) => !(k === 'id' && !isEdit));
    for (let key of keysToValidate) {
      const val = movie[key];
      if (val === null || val === undefined || val.toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addMovie = async () => {
    if (!validateForm(false)) return;
    try {
      const payload = { ...movie };
      if ('id' in payload) delete payload.id;
      await axios.post(`${baseUrl}/add`, payload);
      setMessage('Movie added successfully!');
      fetchAllMovies();
      resetForm();
    } catch (error) {
      setMessage('Error adding movie.');
    }
  };

  const updateMovie = async () => {
    if (!validateForm(true)) return;
    try {
      await axios.put(`${baseUrl}/update`, movie);
      setMessage('Movie updated successfully!');
      fetchAllMovies();
      resetForm();
    } catch (error) {
      setMessage('Error updating movie.');
    }
  };

  const deleteMovie = async (id, fromFiltered = false) => {
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage('Movie deleted successfully!');
      fetchAllMovies();
      if (fromFiltered) {
        setFilteredMovies(filteredMovies.filter((m) => m.id !== id));
      }
    } catch (error) {
      setMessage('Error deleting movie.');
    }
  };

  const getMoviesByStatus = async () => {
    if (!statusToFetch) {
      setMessage('Please select a status to fetch.');
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/status/${statusToFetch}`);
      setFilteredMovies(res.data);
      setMessage('');
    } catch (error) {
      setFilteredMovies([]);
      setMessage('No movies found for this status.');
    }
  };

  const handleEdit = (mov) => {
    setMovie({
      id: mov.id,
      title: mov.title,
      genre: mov.genre,
      hero: mov.hero,
      heroine: mov.heroine,
      releaseYear: mov.releaseYear,
      rating: mov.rating,
      status: mov.status
    });
    setEditMode(true);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setMovie({
      id: '',
      title: '',
      genre: '',
      hero: '',
      heroine: '',
      releaseYear: '',
      rating: '',
      status: ''
    });
    setEditMode(false);
    setMessage('');
  };

  return (
    <div className="movie-container">
      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>🎬 Movie Watchlist</h2>

      <div>
        <h3>{editMode ? 'Edit Movie' : 'Add Movie'}</h3>
        <div className="form-grid">
          {editMode && (
            <input
              type="number"
              name="id"
              placeholder="ID (required for update)"
              value={movie.id}
              onChange={handleChange}
              readOnly
            />
          )}
          <input type="text" name="title" placeholder="Title" value={movie.title} onChange={handleChange} />
          <input type="text" name="genre" placeholder="Genre" value={movie.genre} onChange={handleChange} />
          <input type="text" name="hero" placeholder="Hero" value={movie.hero} onChange={handleChange} />
          <input type="text" name="heroine" placeholder="Heroine" value={movie.heroine} onChange={handleChange} />
          <input type="number" name="releaseYear" placeholder="Release Year" value={movie.releaseYear} onChange={handleChange} />
          <input type="text" name="rating" placeholder="Rating (e.g. 8.5)" value={movie.rating} onChange={handleChange} />
          <select name="status" value={movie.status} onChange={handleChange}>
            <option value="">Select Status</option>
            <option value="Watched">Watched</option>
            <option value="Not Watched">Not Watched</option>
          </select>
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addMovie}>Add Movie</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateMovie}>Update Movie</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Filter Movies by Status</h3>
        <select value={statusToFetch} onChange={(e) => setStatusToFetch(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Watched">Watched</option>
          <option value="Not Watched">Not Watched</option>
        </select>
        <button className="btn-blue" onClick={getMoviesByStatus} style={{ marginLeft: 8 }}>Fetch</button>

        {filteredMovies.length > 0 && (
          <div className="table-wrapper" style={{ marginTop: 12 }}>
            <h4>🎞 Movies with status: {statusToFetch}</h4>
            <table>
              <thead>
                <tr>
                  {Object.keys(movie).map((key) => <th key={key}>{key}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((mov) => (
                  <tr key={mov.id}>
                    {Object.keys(movie).map((key) => <td key={key}>{mov[key]}</td>)}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(mov)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteMovie(mov.id, true)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>All Movies</h3>
        {movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(movie).map((key) => <th key={key}>{key}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((mov) => (
                  <tr key={mov.id}>
                    {Object.keys(movie).map((key) => <td key={key}>{mov[key]}</td>)}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(mov)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteMovie(mov.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieWatchlist;
