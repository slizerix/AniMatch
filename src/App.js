import React, { useState } from 'react';
import { request, gql } from 'graphql-request';

// 🔽 PLACE THIS OUTSIDE the App component
const fetchAnime = async (title) => {
  const endpoint = 'https://graphql.anilist.co';

  const query = gql`
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        title {
          romaji
          english
        }
        episodes
        description(asHtml: false)
        coverImage {
          large
        }
        genres
        averageScore
      }
    }
  `;

  const variables = { search: title };

  try {
    const data = await request(endpoint, query, variables);
    console.log('Anime data:', data.Media);
    return data.Media; // 🧠 optional: return the result
  } catch (error) {
    console.error('AniList fetch error:', error);
  }
};

function App() {
  const [anime, setAnime] = useState(null);

  const handleGetAnime = async () => {
    const result = await fetchAnime("Naruto"); // can be dynamic later
    setAnime(result);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>AniList Test</h1>
      <button onClick={handleGetAnime}>Get Anime</button>

      {anime && (
        <div style={{ marginTop: '2rem' }}>
          <h2>{anime.title.english || anime.title.romaji}</h2>
          <img src={anime.coverImage.large} alt="cover" width="200" />
          <p>{anime.description}</p>
          <p><strong>Genres:</strong> {anime.genres.join(', ')}</p>
          <p><strong>Episodes:</strong> {anime.episodes}</p>
          <p><strong>Score:</strong> {anime.averageScore}</p>
        </div>
      )}
    </div>
  );
}

export default App;
