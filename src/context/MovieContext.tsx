"use client";
import {
  filterMoviesByCategories,
  getUniqueCategories,
} from "@/lib/movie-helpers";
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";

const initialState: MovieState = {
  movies: [],
  categories: [],
  currentPage: 1,
  itemsPerPage: 4,
  selectedCategories: [],
  likedMovies: {},
  dislikedMovies: {},
  moviesFilterByCategories: [],
};

const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
  switch (action.type) {
    case "SET_MOVIES":
      return {
        ...state,
        movies: action.payload,
        categories: getUniqueCategories(action.payload),
      };
    case "ADD_MOVIE":
      return {
        ...state,
        movies: [...state.movies, action.payload],
        categories: getUniqueCategories([...state.movies, action.payload]),
      };
    case "REMOVE_MOVIE":
      const updatedMovies = state.movies.filter(
        (movie) => movie.id !== action.payload
      );
      return {
        ...state,
        movies: updatedMovies,
        categories: getUniqueCategories(updatedMovies),
      };
    case "TOGGLE_LIKE_DISLIKE":
      const { movieId, actionType } = action.payload;
      const movieToUpdate = state.movies.find((movie) => movie.id === movieId);
      if (!movieToUpdate) return state;

      let likedMovies = { ...state.likedMovies };
      let dislikedMovies = { ...state.dislikedMovies };
      let likes = movieToUpdate.likes;
      let dislikes = movieToUpdate.dislikes;

      if (actionType === "likes") {
        if (likedMovies[movieId]) {
          delete likedMovies[movieId];
          likes -= 1;
          return {
            ...state,
            likedMovies,
            movies: state.movies.map((movie) =>
              movie.id === movieId ? { ...movie, likes } : movie
            ),
          };
        }

        likedMovies[movieId] = true;
        likes += 1;

        if (dislikedMovies[movieId]) {
          delete dislikedMovies[movieId];
          dislikes -= 1;
        }

        return {
          ...state,
          likedMovies,
          dislikedMovies,
          movies: state.movies.map((movie) =>
            movie.id === movieId ? { ...movie, likes, dislikes } : movie
          ),
        };
      }

      if (actionType === "dislikes") {
        if (dislikedMovies[movieId]) {
          delete dislikedMovies[movieId];
          dislikes -= 1;
          return {
            ...state,
            dislikedMovies,
            movies: state.movies.map((movie) =>
              movie.id === movieId ? { ...movie, dislikes } : movie
            ),
          };
        }

        dislikedMovies[movieId] = true;
        dislikes += 1;

        if (likedMovies[movieId]) {
          delete likedMovies[movieId];
          likes -= 1;
        }

        return {
          ...state,
          likedMovies,
          dislikedMovies,
          movies: state.movies.map((movie) =>
            movie.id === movieId ? { ...movie, likes, dislikes } : movie
          ),
        };
      }

      return state;

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_ITEMS_PER_PAGE":
      return { ...state, itemsPerPage: action.payload, currentPage: 1 };
    case "SET_SELECTED_CATEGORIES":
      return { ...state, selectedCategories: action.payload, currentPage: 1 };
    case "SET_MOVIES_FILTER_BY_CATEGORIES":
      const filteredMovies = filterMoviesByCategories(
        state.movies,
        state.selectedCategories
      );
      return {
        ...state,
        moviesFilterByCategories: filteredMovies,
      };
    default:
      return state;
  }
};

const MovieContext = createContext<MovieContextProps | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  useEffect(() => {
    dispatch({
      type: "SET_MOVIES_FILTER_BY_CATEGORIES",
      payload: null,
    });
  }, [state.movies, state.selectedCategories]);

  return (
    <MovieContext.Provider value={{ state, dispatch }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = (): MovieContextProps => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};
