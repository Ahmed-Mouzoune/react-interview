"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMovieContext } from "@/context/MovieContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function MoviePagination() {
  const { state, dispatch } = useMovieContext();
  const { movies, moviesFilterByCategories, currentPage, itemsPerPage } = state;
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState<number>(4);

  useEffect(() => {
    dispatch({ type: "SET_ITEMS_PER_PAGE", payload: selectedItemsPerPage });
    setTotalPages(
      Math.ceil(moviesFilterByCategories.length / selectedItemsPerPage)
    );
  }, [selectedItemsPerPage]);
  useEffect(() => {
    setTotalPages(Math.ceil(moviesFilterByCategories.length / itemsPerPage));
    return () => {
      setTotalPages(0);
    };
  }, [moviesFilterByCategories]);

  return (
    <Pagination className="items-center sm:justify-between flex-col sm:flex-row">
      <Select
        value={selectedItemsPerPage.toString()}
        onValueChange={(value) => {
          setSelectedItemsPerPage(Number(value));
        }}
      >
        <div className="flex gap-2 items-center mb-2 sm:mb-0">
          <SelectTrigger className="w-min gap-2">
            <SelectValue />
          </SelectTrigger>
          Entrée par page
        </div>
        <SelectContent>
          <SelectGroup>
            {/* <SelectLabel>Fruits</SelectLabel> */}
            <SelectItem value={"4"}>4</SelectItem>
            <SelectItem value={"8"}>8</SelectItem>
            <SelectItem value={"12"}>12</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem key="previous">
            <PaginationPrevious
              onClick={() =>
                dispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: Math.max(currentPage - 1, 1),
                })
              }
            />
          </PaginationItem>
        )}
        {totalPages > 0 &&
          Array.from({ length: totalPages })
            .fill(null)
            .map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={i + 1 === currentPage}
                  onClick={() => {
                    dispatch({ type: "SET_CURRENT_PAGE", payload: i + 1 });
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
        {currentPage < totalPages && (
          <PaginationItem key="next">
            <PaginationNext
              onClick={() =>
                dispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: Math.min(currentPage + 1, totalPages),
                })
              }
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
