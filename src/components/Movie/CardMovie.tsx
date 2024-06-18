"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useMovieContext } from "@/context/MovieContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { FaRegThumbsDown, FaRegThumbsUp, FaRegTrashAlt } from "react-icons/fa";
import { calculateLikeRatio } from "@/lib/movie-helpers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CardMovieProps {
  movie: Movie;
}

const CardMovie: React.FC<CardMovieProps> = ({ movie }) => {
  const { state, dispatch } = useMovieContext();
  const { id, title, category, likes, dislikes } = movie;

  const handleToggleLikeDislike = (
    actionType: ACTION_TYPE_TOGGLE_LIKE_DISLIKE
  ) => {
    dispatch({
      type: "TOGGLE_LIKE_DISLIKE",
      payload: { movieId: id, actionType },
    });
  };
  const handleLike = () => {
    dispatch({
      type: "TOGGLE_LIKE_DISLIKE",
      payload: { movieId: movie.id, actionType: "likes" },
    });
  };

  const handleDislike = () => {
    dispatch({
      type: "TOGGLE_LIKE_DISLIKE",
      payload: { movieId: movie.id, actionType: "dislikes" },
    });
  };

  const handleRemove = () => {
    dispatch({ type: "REMOVE_MOVIE", payload: id });
  };

  return (
    <Card className="flex flex-col justify-between rounded-xl overflow-hidden">
      <CardHeader className="space-y-0 relative p-0 pb-4">
        <Button
          onClick={() => handleRemove()}
          size={"sm"}
          variant={"outline"}
          className="absolute right-0 top-0 rounded-full w-10 h-10"
        >
          <FaRegTrashAlt />
        </Button>
        <img src="https://placehold.jp/320x180.png" alt="Image de film" />
      </CardHeader>
      <CardFooter>
        <div className="flex flex-col w-full">
          <CardTitle className="mb-2">{title}</CardTitle>
          <div className="mb-4">
            <Badge variant="secondary">{category}</Badge>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex gap-2 items-center">
              <Button
                onClick={handleLike}
                variant={"outline"}
                size={"sm"}
                className={cn(
                  "rounded-full",
                  state.likedMovies[id]
                    ? "hover:text-green-500 text-green-500"
                    : ""
                )}
              >
                <FaRegThumbsUp />
                <span className="pl-2 text-xs font-light">{`${likes}`}</span>
              </Button>
              <Button
                onClick={handleDislike}
                variant={"outline"}
                size={"sm"}
                className={cn(
                  "rounded-full",
                  state.dislikedMovies[id]
                    ? "hover:text-red-500 text-red-500"
                    : ""
                )}
              >
                <span className="pr-2 text-xs font-light">{`${dislikes}`}</span>
                <FaRegThumbsDown />
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <Progress value={calculateLikeRatio(likes, dislikes)} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{calculateLikeRatio(likes, dislikes)} %</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardMovie;
