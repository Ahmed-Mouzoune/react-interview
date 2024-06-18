export function getUniqueCategories (movies: Movie[]): string[] {
    const categories = movies.map(movie => movie.category);
    return categories.filter((category, index) => categories.indexOf(category) === index);
};

export function filterMoviesByCategories (movies: Movie[], selectedCategories: string[]) {
    return movies.filter((movie) =>
        (selectedCategories.length === 0) || selectedCategories.includes(movie.category)
    );
  };

export function calculateLikeRatio(likes: number, dislikes: number): number {
    const totalVotes = likes + dislikes;

    if (totalVotes === 0) return 0;
    const likeRatio = (likes / totalVotes) * 100;

    return parseFloat(likeRatio.toFixed(2));
}
