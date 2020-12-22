import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import store from './redux/store';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import 'semantic-ui-css/semantic.min.css'
import { setUser, clearUser } from './redux/actions/userActions';
import Spinner from './components/Spinner';



class Root extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user){
                console.log(user)
                this.props.setUser(user);
                this.props.history.push('/');
            }else {
                this.props.history.push('/login');
                this.props.clearUser();
            }
        })
    }
    render() {
        return  this.props.isLoading ? <Spinner/> : (
            <Switch>
               <Route exact path="/" component={App} />
               <Route exact path="/login" component={Login} />
               <Route exact path="/register" component={Register} />
            </Switch>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>, document.getElementById('root'));
serviceWorker.unregister();
