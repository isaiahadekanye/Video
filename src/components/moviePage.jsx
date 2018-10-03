import React from "react";
import Form from "./common/form";
import joi from "joi-browser";
import { getGenres } from "../services/genreService";
import { getMovie, saveMovie } from "../services/movieService";

class MovieAdd extends Form {
  constructor(props) {
    super(props);
    this.state = {
      data: { title: "", genreId: "", numberInStock: "", dailyRentalRate: "" },
      errors: {},
      genres: []
    };

    this.doSubmit = this.doSubmit.bind(this);
    this.populateGenres = this.populateGenres.bind(this);
    this.populateMovie = this.populateMovie.bind(this);
  }
  schema = {
    _id: joi.string(),
    title: joi
      .string()
      .required()
      .label("Title"),
    genreId: joi
      .string()
      .required()
      .label("Genre"),
    numberInStock: joi
      .number()
      .required()
      .min(0)
      .max(100)
      .label("Number In Stock"),
    dailyRentalRate: joi
      .number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate")
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovie() {
    try {
      const movieId = this.props.match.params.id;
      if (movieId === "new") return;

      const { data: movie } = await getMovie(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/notFound");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovie();
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate
    };
  }
  async doSubmit() {
    await saveMovie(this.state.data);
    this.props.history.push("/movies");
  }

  render() {
    return (
      <div>
        <h1>Movie Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect(this.state.genres, "genreId", "Genre")}
          {this.renderInput("numberInStock", "Number In Stock", "number")}
          {this.renderInput("dailyRentalRate", "Daily Rental Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieAdd;
