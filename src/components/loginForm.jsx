import React from "react";
import Form from "./common/form";
import joi from "joi-browser";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  constructor(props) {
    super(props);
    this.state = { data: { username: "", password: "" }, errors: {} };

    this.doSubmit = this.doSubmit.bind(this);
  }

  schema = {
    username: joi
      .string()
      .required()
      .label("Username"),
    password: joi
      .string()
      .required()
      .label("Password")
  };

  async doSubmit() {
    try {
      const { data } = this.state;
      await auth.login(data.username, data.password);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
