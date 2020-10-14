import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import FormValidator from '../components/FormValidator';
import axios from '../Helpers/axiosInst'
import { authenticateUser, getRememberUser, setRememberUser } from '../Helpers/Auth'
import { membrozlogowhite } from '../components/Image';

class Login extends Component {
    constructor(props) {
        super(props);

        this.validator = new FormValidator([
            {
                field: 'username',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter your username.'
            },
            {
                field: 'username',
                method: 'isEmail',
                validWhen: true,
                message: 'Enter valid username.'
            },
            {
                field: 'password',
                method: 'isEmpty',
                validWhen: false,
                message: 'Enter password.'
            }
        ]);

        this.state = {
            username: '',
            password: '',
            rememberme: false,
            validation: this.validator.valid(),
            submitted: false,
            loading: false,
            errorMessage: ''
        }
        this.onChangeValue = this.onChangeValue.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onChangeValue(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    onFormSubmit = async event => {
        event.preventDefault();
        const validation = this.validator.validate(this.state);
        this.setState({ validation });

        if (validation.isValid) {
            this.setState({ loading: true })
            const { username, password, rememberme } = this.state
            setRememberUser(username, password, rememberme);
            try {
                const response = await axios.post('auth/login', { username, password })
                if (response.data.type && response.data.type === 'Error') {
                    this.setState({ loading: false, errorMessage: response.data.message })
                    return
                }
                authenticateUser(JSON.stringify(response.data))
                this.setState({ submitted: true });
                this.setState({ loading: false })
                this.props.history.push('/')
            }
            catch (error) {
                this.setState({ loading: false, errorMessage: 'User name or password is wrong!' })
            }
        }
        else {
            this.setState({ loading: false })
        }
    }

    componentDidMount() {
        document.title = this.props.title
        window.scrollTo(0, 0);

        const user = getRememberUser();
        if (user) {
            this.setState({ username: user.username, password: user.password, rememberme: true });
        }
    }

    render() {
        const validation = this.state.submitted ? this.validator.validate(this.state) : this.state.validation
        const { username, password, rememberme, loading, errorMessage } = this.state;

        return (
            <React.Fragment>
                <div className="login-full-page landing-main">
                    <div className="top-right-square"></div>
                    <nav className="navbar navbar-expand-md navbar-light p-0">
                        <div className="container">
                            <a className="navbar-brand ml-md-0" href="/#"><img src={membrozlogowhite} alt="" /></a>
                            <button className="navbar-toggler navbar-toggler-login" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span> </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                {/* <ul className="navbar-nav ml-auto">
                                    <li className="nav-item"> <a class="nav-link white-link" href="#">Admin Login</a> </li>
                                </ul> */}
                            </div>
                        </div>
                    </nav>
                    <div className="container login-container">
                        <div className="row" >
                            <div className="col-xl-6 col-md-6 d-flex align-items-center">
                                <div className="text-center text-md-left" >
                                    <div className="top-left-dots"></div>
                                    <h1 className="h2 landing-head"> Powerful POS Solutions for your business</h1>
                                    <div className="landing-intro">
                                        <p >A Complete SaaS Solution Tailored to Your Business Need</p>
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={this.onFormSubmit} className="col-xl-5 col-md-6">
                                <div className="landing-box p-4 membroz-form align-items-center" >
                                    <div className="ie-dblock">
                                        <h4 className="mb-3 font-weight-bold">Staff Login</h4>
                                        <span className="help-block">{errorMessage}</span>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                aria-describedby="emailHelp"
                                                type="text"
                                                placeholder="User Name"
                                                id="username"
                                                name='username'
                                                value={username}
                                                onChange={this.onChangeValue}
                                            />
                                            <span className="help-block">{validation.username.message}</span>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="password"
                                                placeholder="Password"
                                                id="password"
                                                name='password'
                                                value={password}
                                                onChange={this.onChangeValue}
                                            />
                                            <span className="help-block">{validation.password.message}</span>
                                        </div>
                                        <div className="form-group">
                                            <div class="custom-control custom-checkbox">
                                                <input
                                                    class="custom-control-input"
                                                    type="checkbox"
                                                    id="rememberMe"
                                                    name="rememberme"
                                                    checked={rememberme}
                                                    onChange={this.onChangeValue}
                                                />
                                                <label class="custom-control-label" htmlFor="rememberMe">Remember me</label>
                                                {/* <Link className="float-right" to="/ForgetPassword">Forgot Password?</Link> */}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                                                {loading && <span className="spinner-border spinner-border-sm mr-1"></span>}Login</button>
                                        </div>
                                        {/* <div className="form-group">
                                            <div className="row mt-4">
                                                <div className="col-6"><a href="#" target="_blank">Reset Password?</a></div>
                                                <div className="col-6 text-right"><a href="#" target="_blank">Reset Wallet PIN?</a></div>
                                            </div>
                                        </div> */}
                                        <div className="form-group text-center">
                                            <div className="row">
                                                <div className="col-6">
                                                    <select name="lang" className="form-control"><option defaultValue>English</option></select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="bottom-right-round-square"></div>
                    <div className="bottom-left-round-square-1"></div>
                    <div className="bottom-left-round-square-2"></div>
                    <footer className="login-footer mt-auto py-3">
                        <div className="container">
                            <div className="row">
                                <div className="col text-center"> © Copyright Membroz. Power by <a className="white-link" href="http://www.krtya.com/" target="_blank">Krtya Technologies Pvt. Ltd.</a> </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </React.Fragment>
        )
    }
}

export default Login