import React, {
  Component
} from 'react';
import {
  Route, Switch, Redirect
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Movies from "./components/movies";
import Navigation from "./components/navigation";
import Customers from "./components/customers";
import NotFound from "./components/notFound";
import Rentals from "./components/rentals";
import MoviePage from "./components/moviePage";
import LoginForm from './components/loginForm';
import RegisterForm from './components/registerForm';
import Logout from './components/logout';
import auth from './services/authService';
import ProtectedRoute from './components/common/protectedRoute'
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({user});
  }
  render() {
    const {user} = this.state;
    return (
      <React.Fragment>
        <ToastContainer />
        <Navigation user = {user} />
        <main className = "container" >
          <Switch>
            <ProtectedRoute
             path= "/movies/:id" component ={MoviePage} />
            <Route path= "/login" component= {LoginForm} />
            <Route path= "/logout" component= {Logout} />
            <Route path= "/register" component= {RegisterForm} />
            <Route path="/movies" render= {props => <Movies user = {this.state.user} {...props} />} />
            <Route path= "/customers" component= {Customers} />
            <Route path= "/rentals" component= {Rentals} />
            <Route path= "/notFound" component= {NotFound} />
            <Redirect from="/" exact to= "/movies" />
            <Redirect to="/notFound" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;