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
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleInputChange(event) {
        // const target = event.target;
        // const value = target.type === 'checkbox' ? target.checked : target.value;
        // const name = target.name;
        // this.setState({ [name]: value });
        //event.preventDefault();
        this.setState({
            [event.target.name]: event.target.value,
            rememberme: event.target.checked
        });
    }

    handleFormSubmit = async event => {
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
                    this.setState({ loading: false, error: response.data.message })
                    return
                }
                authenticateUser(JSON.stringify(response.data))
                this.setState({ submitted: true });
                this.setState({ loading: false })
                this.props.history.push('/')
            }
            catch (error) {
                this.setState({ loading: false, error: 'User name or password is wrong!' })
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
        const { username, password, rememberme, loading } = this.state;

        return (
            <React.Fragment>
                <div class="login-full-page landing-main">
                    <div class="top-right-square"></div>
                    <nav class="navbar navbar-expand-md navbar-light p-0">
                        <div class="container">
                            <a class="navbar-brand ml-md-0" href="/#"><img src={membrozlogowhite} alt="" /></a>
                            <button class="navbar-toggler navbar-toggler-login" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                {/* <ul class="navbar-nav ml-auto">
                                    <li class="nav-item"> <a class="nav-link white-link" href="#">Admin Login</a> </li>
                                </ul> */}
                            </div>
                        </div>
                    </nav>
                    <div class="container login-container">
                        <div class="row" >
                            <div class="col-xl-6 col-md-6 d-flex align-items-center">
                                <div class="text-center text-md-left" >
                                    <div class="top-left-dots"></div>
                                    <h1 class="h2 landing-head"> Powerful POS Solutions for your business</h1>
                                    <div class="landing-intro">
                                        <p >A Complete SaaS Solution Tailored to Your Business Need</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-5 col-md-6">
                                <div class="landing-box p-4 membroz-form align-items-center" >
                                    <div class="ie-dblock">
                                        <h4 class="mb-3 font-weight-bold">Staff Login</h4>
                                        <div class="form-group">
                                            <input type="text" name='username' class="form-control" placeholder="User Name" id="username" aria-describedby="emailHelp" value={username} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.username.message}</span>
                                        </div>
                                        <div class="form-group">
                                            <input type="password" name='password' class="form-control" placeholder="Password" id="password" value={password} onChange={this.handleInputChange} />
                                            <span className="help-block">{validation.password.message}</span>
                                        </div>
                                        <div class="form-group">
                                            <button onClick={this.handleFormSubmit} type="button" class="btn btn-primary btn-lg btn-block" disabled={loading}>
                                                {loading && <span className="spinner-border spinner-border-sm mr-1"></span>}Login</button>
                                        </div>
                                        {/* <div class="form-group">
                                            <div class="row mt-4">
                                                <div class="col-6"><a href="#" target="_blank">Reset Password?</a></div>
                                                <div class="col-6 text-right"><a href="#" target="_blank">Reset Wallet PIN?</a></div>
                                            </div>
                                        </div> */}
                                        <div class="form-group text-center">
                                            <div class="row">
                                                <div class="col-6">
                                                    <select name="lang" class="form-control"><option selected>English</option></select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bottom-right-round-square"></div>
                    <div class="bottom-left-round-square-1"></div>
                    <div class="bottom-left-round-square-2"></div>
                    <footer class="login-footer mt-auto py-3">
                        <div class="container">
                            <div class="row">
                                <div class="col text-center"> © Copyright Membroz. Power by <a class="white-link" href="http://www.krtya.com/" target="_blank">Krtya Technologies Pvt. Ltd.</a> </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </React.Fragment>
        )
    }
}

export default Login