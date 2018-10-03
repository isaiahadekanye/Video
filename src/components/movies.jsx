import React, { Component } from "react";
import Pages from "./common/pages";
import Genre from "./common/genres";
import MoviesTable from "./moviesTable";
import SearchBox from "./searchBox";
import { Paginate } from "../utils/paginate";
import { getGenres } from "../services/genreService";
import { getMovies, deleteMovie } from "../services/movieService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import _ from "lodash";

class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genres: [],
      currentPage: 1,
      pageSize: 4,
      movies: [],
      currentGenre: [],
      searchQuery: "",
      sortColumn: { path: "title", order: "asc" }
    };
    this.removeMovie = this.removeMovie.bind(this);
    this.like = this.like.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.genreSelect = this.genreSelect.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ name: "All Genres", _id: "" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  addMovie(item) {
    const movies = [...item];
    this.setState({ movies });
  }

  async removeMovie(id) {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter(mov => mov._id !== id);
    this.setState({ movies });

    try {
      deleteMovie(id);
    } catch (ex) {
      if (ex.repsonse && ex.response.status === 404) {
        toast.error("This Movie has already been deleted.");
        this.setState({ movies: originalMovies });
      }
    }
  }

  like(movie) {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].like = !movies[index].like;

    this.setState({
      movies
    });
  }

  pageChange(page) {
    this.setState({ currentPage: page });
  }

  genreSelect(genre) {
    this.setState({ currentGenre: genre, searchQuery: "", currentPage: 1 });
  }

  genreSelectorAll() {
    const {
      currentGenre,
      searchQuery,
      sortColumn,
      currentPage,
      pageSize,
      movies: allMovies
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (currentGenre && currentGenre._id)
      filtered = allMovies.filter(m => m.genre._id === currentGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = Paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  }

  handleSort(sortColumn) {
    this.setState({ sortColumn });
  }

  handleSearch(query) {
    this.setState({ searchQuery: query, currentGenre: [], currentPage: 1 });
  }
  render() {
    const {
      pageSize,
      currentPage,
      genres,
      searchQuery,
      currentGenre,
      sortColumn
    } = this.state;
    const { user } = this.props;

    const { totalCount, data: movies } = this.genreSelectorAll();
    return (
      <div className="row">
        <div className="col-3">
          <Genre
            items={genres}
            onItemSelect={this.genreSelect}
            currentGenre={currentGenre}
          />
        </div>
        <div className="col">
          {user && (
            <Link to="/movies/new">
              <button className="btn btn-primary" style={{ marginBottom: 30 }}>
                New Movie
              </button>
            </Link>
          )}

          <p>Showing {totalCount} movies in the Database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.like}
            onDelete={this.removeMovie}
            onSort={this.handleSort}
          />
          <Pages
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.pageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
