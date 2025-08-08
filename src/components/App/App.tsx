import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import css from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import { keepPreviousData } from "@tanstack/react-query";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery.trim() !== "",
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    setCurrentPage(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <Toaster position="top-right" />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length === 0 &&
        searchQuery &&
        !isLoading &&
        !isError &&
        toast.error("No movies found for your request.")}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}
