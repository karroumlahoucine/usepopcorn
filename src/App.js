import { useEffect, useRef, useState } from "react";
import StarRating from "./Starrating.js";
import { Loader } from "./Loader.js";
import { ErrorMessage } from "./ErrorMessage.js";
import { Nav } from "./Nav.js";
import { Button } from "./Button.js";
import { Search } from "./Search.js";
import { NumMovies } from "./NumMovies.js";
import { Main } from "./Main.js";
import { useMovies } from "./useMovies.js";
import { useLocalStorageState } from "./useLocalStorageState.js";
import { useKey } from "./useKey.js";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "4b98a37";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, onCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function onCloseMovie() {
    setSelectedId(null);
  }

  function onSelectMovie(id) {
    setSelectedId(id === selectedId ? null : id);
  }

  function handelWatched(movie) {
    setWatched((pre) => [...pre, movie]);
  }

  function handelDeleteWatched(movie) {
    setWatched((prev) => prev.filter((i) => i.imdbID !== movie.imdbID));
  }

  return (
    <>
      <Nav>
        <Search query={query} setQuery={setQuery} />
        <NumMovies movies={movies} />
      </Nav>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={onSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              onWatched={handelWatched}
              onCloseMovie={onCloseMovie}
              selectedId={selectedId}
              watchedList={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                onDeleteWatched={handelDeleteWatched}
                setWatched={setWatched}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onWatched, watchedList }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Year: year,
    Released: released,
    Actor: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const isMovieAdded = watchedList.map((i) => i.imdbID).includes(movie.imdbID);
  const movieRated = watchedList.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function handelAddWatched() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      runtime: runtime.split(" ").at(0),
      imdbRating: Number(imdbRating),
      userRating,
      decisionCounter: countRef.current,
    };
    onWatched(newMovie);
    onCloseMovie();
  }

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  useEffect(() => {
    async function fetchMovieDetails() {
      setIsloading(true);
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
      );
      const data = await response.json();
      setMovie(data);
      setIsloading(false);
    }
    fetchMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    document.title = title ? `Movie | ${title}` : "Loading...";
    return () => {
      document.title = "UsePopcorn";
    };
  }, [title]);

  useKey("Escape", onCloseMovie);
  // useEffect(() => {
  //   function escape(e) {
  //     if (e.code === "Escape") {
  //       onCloseMovie();
  //     }
  //   }
  //   document.addEventListener("keydown", escape);
  //   return () => {
  //     document.removeEventListener("keydown", escape);
  //   };
  // }, [onCloseMovie]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="details">
            <header>
              <button className="btn-back" onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐</span>
                  {imdbRating} Imdb rating
                </p>
              </div>
            </header>
            <section>
              <div className="rating">
                {!isMovieAdded ? (
                  <>
                    <StarRating start={10} size={25} onRating={setUserRating} />
                    {userRating > 0 && (
                      <button onClick={handelAddWatched} className="btn-add">
                        + Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p>You rated this movie {movieRated} ⭐</p>
                )}
              </div>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starrig {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          onDeleteWatched={onDeleteWatched}
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime}</span>
        </p>
        <button onClick={() => onDeleteWatched(movie)} className="btn-delete">
          X
        </button>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime}min</span>
        </p>
      </div>
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <Button isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie onSelectMovie={onSelectMovie} key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
