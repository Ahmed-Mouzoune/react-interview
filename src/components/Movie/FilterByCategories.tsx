"use client";
import React, {
  useCallback,
  useRef,
  useState,
  KeyboardEvent,
  useEffect,
} from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useMovieContext } from "@/context/MovieContext";

export function FilterByCategories() {
  const { state, dispatch } = useMovieContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback((categorie: string) => {
    setSelected((prev) => prev.filter((s) => s !== categorie));
    dispatch({ type: "SET_SELECTED_CATEGORIES", payload: selected });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
          dispatch({ type: "SET_SELECTED_CATEGORIES", payload: selected });
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_SELECTED_CATEGORIES", payload: selected });
  }, [selected, dispatch]);

  const selectables = state.categories.filter(
    (categorie) => !selected.includes(categorie)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((categorie) => {
            return (
              <Badge key={`${categorie}-item`} variant="secondary">
                {categorie}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(categorie);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(categorie)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Filtrer par catégories"
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((categorie) => {
                  return (
                    <CommandItem
                      key={`${categorie}-command-item`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, categorie]);
                        dispatch({
                          type: "SET_SELECTED_CATEGORIES",
                          payload: [...selected, categorie],
                        });
                      }}
                      className={"cursor-pointer"}
                    >
                      {categorie}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
