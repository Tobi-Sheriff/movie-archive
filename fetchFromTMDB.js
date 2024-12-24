const axios = require('axios');
const movieService = require('./services/movieServices');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3';

// Utility function for delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry mechanism for transient errors
const fetchWithRetry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Retrying... (${i + 1}/${retries})`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
};

// Fetch additional movie details
const fetchAdditionalMovieData = async (movie) => {
  const MOVIE_ID = movie.id;

  try {
    await sleep(300); // Wait to avoid rate-limiting

    const [imageResponse, videoResponse, creditsResponse, reviewsResponse] = await Promise.all([
    const [imageResponse, videoResponse, creditsResponse, reviewsResponse] = await Promise.all([
      fetchWithRetry(() =>
        axios.get(`${TMDB_API_URL}/movie/${MOVIE_ID}/images`, {
          params: { api_key: TMDB_API_KEY },
        })
      ),
      fetchWithRetry(() =>
        axios.get(`${TMDB_API_URL}/movie/${MOVIE_ID}/videos`, {
          params: { api_key: TMDB_API_KEY },
        })
      ),
      fetchWithRetry(() =>
        axios.get(`${TMDB_API_URL}/movie/${MOVIE_ID}/credits`, {
          params: { api_key: TMDB_API_KEY },
        })
      ),
      fetchWithRetry(() =>
        axios.get(`${TMDB_API_URL}/movie/${MOVIE_ID}/reviews`, {
          params: { api_key: TMDB_API_KEY },
        })
      ),
      fetchWithRetry(() =>
        axios.get(`${TMDB_API_URL}/movie/${MOVIE_ID}/reviews`, {
          params: { api_key: TMDB_API_KEY },
        })
      ),
    ]);

    const topBackdrop = imageResponse.data.backdrops
      .reduce((max, current) => {
        return current.vote_count > max.vote_count ? current : max;
      }, imageResponse.data.backdrops[0]).file_path;

    const enBackdrops = imageResponse.data.backdrops
      .filter((image) => image.iso_639_1 === 'en')
      .map((image) => image.file_path);
    const backdrops = [topBackdrop, enBackdrops[0]];

    const filteredMovieVideo = videoResponse.data.results
      .filter((video) => video.name === 'Final Trailer')
      .map((video) => video.key);

    const cast = creditsResponse.data.cast.slice(0, 3).map((member) => ({
      name: member.name,
      profile: member.profile_path || null,
    }));

    const directors = creditsResponse.data.crew
      .filter((member) => member.job === 'Director')
      .map((director) => ({
        name: director.name,
        profile: director.profile_path || null,
      }));

    const reviews = reviewsResponse.data.results
      .map((review) => ({
        name: review.author_details.username,
        avartar: review.author_details.avatar_path || null,
        rating: review.author_details.rating,
        content: review.content,
        id: review.id,
      }));

    return { backdrops, filteredMovieVideo, cast, directors, reviews };
    const reviews = reviewsResponse.data.results
      .map((review) => ({
        name: review.author_details.username,
        avartar: review.author_details.avatar_path || null,
        rating: review.author_details.rating,
        content: review.content,
        id: review.id,
      }));

    return { backdrops, filteredMovieVideo, cast, directors, reviews };
  } catch (error) {
    console.error(`Failed to fetch additional data for movie ${MOVIE_ID}:`, error.message);
    return {};
  }
};

// Fetch movies in batches to handle rate limiting
const fetchBatchedMovies = async (movies, batchSize) => {
  const results = [];
  for (let i = 0; i < movies.length; i += batchSize) {
  for (let i = 0; i < movies.length; i += batchSize) {
    const batch = movies.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchAdditionalMovieData));
    results.push(...batchResults);
    console.log(`Fetched batch ${i}/${movies.length}`);
    console.log(`Wait 1 second before next batch...`);
    await sleep(1000); // Wait 1 second between batches
  }
  return results;
};

// Fetch popular movies
const fetchPopularMovies = async (pages) => {
  const movies = [];

  for (let i = 1; i <= pages; i++) {
    try {
      const response = await axios.get(`${TMDB_API_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'en-US',
          page: i,
        },
      });

      movies.push(...response.data.results);
      console.log(`Fetched page ${i}/${pages}`);
    } catch (error) {
      console.error(`Failed to fetch page ${i}:`, error.message);
      break;
    }
  }

  console.log(`Fetched ${movies.length} popular movies. Fetching additional details...`);
  const detailedMovies = await fetchBatchedMovies(movies, 10); // Fetch additional details in batches of 10
  return movies.map((movie, index) => ({
    ...movie,
    ...detailedMovies[index], // Merge additional details with the base movie data
  }));
};

// Seed popular movies into the database
const seedPopularMovies = async () => {
  try {    
    const movies = await fetchPopularMovies(3); // Adjust pages as needed
    console.log(`Fetched ${movies.length} movies. Saving to database...`);

    // Transform data to match your database schema
    const formattedMovies = movies.map((movie) => ({
      tmdb_movie_id: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      backdrops: movie.backdrops || [],
      release_date: movie.release_date,
      genres: movie.genre_ids,
      overview: movie.overview,
      likes: 0,
      ratings: movie.vote_average,
      directors: movie.directors || [],
      top_casts: movie.cast || [],
      trailers: movie.filteredMovieVideo || [],
      reviews: movie.reviews || [],
      reviews: movie.reviews || [],
    }));

    await movieService.addAllMovies(formattedMovies);
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error while seeding popular movies:', error.message);
  }
};

seedPopularMovies();
module.exports = { seedPopularMovies };
