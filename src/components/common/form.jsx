import React, { Component } from "react";
import Input from "./input";
import joi from "joi-browser";
import DropDown from "./dropDown";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      errors: {}
    };

    this.validate = this.validate.bind(this);
    this.validateProperty = this.validateProperty.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
  }

  validate() {
    const options = { abortEarly: false };
    const { error } = joi.validate(this.state.data, this.schema, options);

    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  }

  validateProperty({ name, value }) {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  }

  handleSubmit(event) {
    event.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  }

  handleChange({ currentTarget }) {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(currentTarget);

    if (errorMessage) errors[currentTarget.name] = errorMessage;
    else delete errors[currentTarget.name];

    const data = { ...this.state.data };
    data[currentTarget.name] = currentTarget.value;
    this.setState({ data, errors });
  }

  renderButton(label) {
    return (
      <button
        disabled={this.validate()}
        type="submit"
        className="btn btn-primary"
      >
        {label}
      </button>
    );
  }

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        label={label}
        value={data[name]}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
  renderSelect(item, name, label) {
    const { data, errors } = this.state;
    return (
      <DropDown
        name={name}
        value={data[name]}
        item={item}
        label={label}
        error={errors[name]}
        onChange={this.handleChange}
      />
    );
  }
}

export default Form;
