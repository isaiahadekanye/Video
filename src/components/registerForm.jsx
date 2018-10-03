import React from "react";
import Form from "./common/form";
import joi from "joi-browser";
import * as userService from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Form {
  constructor(props) {
    super(props);
    this.state = { data: { username: "", password: "", name: "" }, errors: {} };

    this.doSubmit = this.doSubmit.bind(this);
  }

  schema = {
    username: joi
      .string()
      .required()
      .email()
      .label("Username"),
    password: joi
      .string()
      .required()
      .min(5)
      .label("Password"),
    name: joi
      .string()
      .required()
      .label("Name")
  };

  async doSubmit() {
    try {
      const response = await userService.register(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("name", "Name")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
