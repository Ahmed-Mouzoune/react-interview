import { movies$ } from "@/data/movies";

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const movies = await movies$;
    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};
