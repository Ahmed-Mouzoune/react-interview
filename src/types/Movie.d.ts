interface Movie {
    id: string;
    title: string;
    category: string;
    likes: number;
    dislikes: number;
}

interface MovieState {
    movies: Movie[];
    categories: string[];
    currentPage: number;
    itemsPerPage: number;
    selectedCategories: string[];
    likedMovies: { [key: string]: boolean };
    dislikedMovies: { [key: string]: boolean };
    moviesFilterByCategories: Movie[];
}

type MovieAction =
    | { type: 'SET_MOVIES'; payload: Movie[] }
    | { type: 'ADD_MOVIE'; payload: Movie }
    | { type: 'REMOVE_MOVIE'; payload: string }
    | { type: 'TOGGLE_LIKE_DISLIKE'; payload: IPAYLOAD_TOGGLE_LIKE_DISLIKE }
    | { type: 'SET_CURRENT_PAGE'; payload: number }
    | { type: 'SET_ITEMS_PER_PAGE'; payload: number }
    | { type: 'SET_SELECTED_CATEGORIES'; payload: string[] }
    | { type: "SET_MOVIES_FILTER_BY_CATEGORIES"; payload: null };

type ACTION_TYPE_TOGGLE_LIKE_DISLIKE = "likes" | "dislikes";
interface IPAYLOAD_TOGGLE_LIKE_DISLIKE {
    movieId:string,
    actionType: ACTION_TYPE_TOGGLE_LIKE_DISLIKE
}

interface IPAYLOAD_SET_MOVIES_TO_SHOW { movies: Movie[]; selectedCategories: string[]; currentPage: number; itemsPerPage: number }

interface MovieContextProps {
    state: MovieState;
    dispatch: React.Dispatch<MovieAction>;
}

interface FilterProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryChange: (selectedCategories: string[]) => void;
}

interface PaginationProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}
