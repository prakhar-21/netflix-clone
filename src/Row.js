import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  // if [] , run once when the row loads , and don't run again
  // if [movies] , runs every time the variable 'movie' changes

  console.log(title);
  console.log(movies);

  const opts = {
    height: "390px",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      console.log(movie);
      console.log(movie && (movie.name || movie.title)); //movie.title was not used in the original code but a lot of movies have the title instead of the name
      movieTrailer((movie && (movie.name || movie.title)) || "") //can use optional chaining    //movie trailer is an npm module that returns a youtube trailer
        .then((url) => {
          console.log(typeof url + " " + url);
          // url has the complete video url but we only need the video id
          const urlParams = new URLSearchParams(new URL(url).search);
          console.log(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      {/* title */}
      <h2>{title}</h2>

      <div className="row_posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${
              isLargeRow
                ? movie.poster_path
                : movie.backdrop_path || movie.poster_path //if backdrop_path is not available
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
