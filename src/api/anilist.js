import { gql, request } from 'graphql-request';

const endpoint = 'https://graphql.anilist.co';

export const fetchAnimeByQuiz = async (answers) => {
  const genres = mapAnswersToGenres(answers);
  const lengthFilter = getEpisodeRange(answers.length);

  const query = gql`
    query ($genres: [String], $episodes_greater: Int, $episodes_lesser: Int) {
      Page(perPage: 50) {
        media(
          genre_in: $genres,
          type: ANIME,
          sort: SCORE_DESC,
          episodes_greater: $episodes_greater,
          episodes_lesser: $episodes_lesser,
          isAdult: false
        ) {
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          description
          genres
          episodes
          averageScore
          siteUrl
        }
      }
    }
  `;

  const variables = {
    genres,
    ...lengthFilter,
  };

  const data = await request(endpoint, query, variables);
  return data.Page.media;
};

export const fetchRandomAnime = async () => {
  const query = gql`
    query ($page: Int!) {
      Page(page: $page, perPage: 50) {
        media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          description
          genres
          episodes
          averageScore
          siteUrl
        }
      }
    }
  `;

  const randomPage = Math.floor(Math.random() * 100) + 1;
  const data = await request(endpoint, query, { page: randomPage });
  return data.Page.media;
};

// Utility functions (copy from your App.js)
const mapAnswersToGenres = (answers) => {
  const genres = [];

  if (answers.mood === 'funny') genres.push('Comedy');
  if (answers.mood === 'emotional') genres.push('Drama', 'Romance');
  if (answers.mood === 'action') genres.push('Action');
  if (answers.mood === 'thoughtful') genres.push('Psychological', 'Thriller');
  if (answers.mood === 'cozy') genres.push('Slice of Life');

  if (answers.setting === 'school') genres.push('School');
  if (answers.setting === 'fantasy') genres.push('Fantasy');
  if (answers.setting === 'modern') genres.push('Supernatural');
  if (answers.setting === 'sci-fi') genres.push('Sci-Fi', 'Mecha');
  if (answers.setting === 'apocalyptic') genres.push('Horror');

  return [...new Set(genres)];
};

const getEpisodeRange = (lengthChoice) => {
  switch (lengthChoice) {
    case '12 and less':
      return { episodes_lesser: 13 };
    case '12-50':
      return { episodes_greater: 12, episodes_lesser: 51 };
    case '50 and more':
      return { episodes_greater: 50 };
    default:
      return {};
  }
};