"use client";
import { useMovieContext } from "@/context/MovieContext";
import { fetchMovies } from "@/services/Movie";
import React, { useEffect, useState } from "react";
import CardMovie from "./CardMovie";
import { MoviePagination } from "@/components/Movie/MoviePagination";
import { FilterByCategories } from "@/components/Movie/FilterByCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const MovieList: React.FC = () => {
  const { state, dispatch } = useMovieContext();
  const { moviesFilterByCategories, currentPage, itemsPerPage } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(
    (currentPage - 1) * itemsPerPage
  );
  const [endIndex, setEndIndex] = useState(startIndex + itemsPerPage);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      const movies = await fetchMovies();
      setIsLoading(false);
      dispatch({ type: "SET_MOVIES", payload: movies });
      dispatch({ type: "SET_MOVIES_FILTER_BY_CATEGORIES", payload: null });
    };
    loadMovies();
  }, [dispatch]);

  useEffect(() => {
    const startIndexNumber = (currentPage - 1) * itemsPerPage;
    setStartIndex(startIndexNumber);
    setEndIndex(startIndexNumber + itemsPerPage);

    return () => {
      setStartIndex((currentPage - 1) * itemsPerPage);
      setEndIndex(startIndexNumber + itemsPerPage);
    };
  }, [currentPage, itemsPerPage]);

  if (isLoading)
    return <LoadingSpinner className="mx-auto h-36 w-36 text-secondary" />;

  if (moviesFilterByCategories.length <= 0)
    return <>{`Aucun film n'est disponible actuellement !`}</>;

  return (
    <>
      <FilterByCategories />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {moviesFilterByCategories.slice(startIndex, endIndex).map((movie) => (
          <CardMovie key={movie.id} movie={movie} />
        ))}
      </div>
      <MoviePagination />
    </>
  );
};

export default MovieList;
