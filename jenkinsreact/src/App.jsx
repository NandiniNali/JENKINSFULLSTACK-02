import React from "react";
import MovieWatchlist from "./components/MovieWatchlist.jsx";
import "./components/style.css";

const App = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎥 My Movie Watchlist</h1>
      </header>

      <main>
        <MovieWatchlist />
      </main>

      <footer className="app-footer">
      
      </footer>
    </div>
  );
};

export default App;
