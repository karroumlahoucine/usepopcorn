import { useEffect, useState } from "react";

const key = "4b98a37";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        setError("");
        setIsloading(true);
        const response = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error("Something went wrong with fetching movies");
        }
        const data = await response.json();
        if (data.Response === "False") {
          throw new Error("movie not found");
        }
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log(`${err.message} 🧨`);
          setError(err.message);
        }
      } finally {
        setIsloading(false);
      }
    }
    if (query.length < 3) {
      setError("");
      setMovies([]);
      return;
    }
    // onCloseMovie();
    fetchData();
    return () => {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
