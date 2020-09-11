import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import FormValidator from '../components/FormValidator';
import axios from '../Helpers/axiosInst'
import { authenticateUser, getRememberUser, setRememberUser } from '../Helpers/Auth'

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
            },
            // {
            //     field: 'password',
            //     method: 'isEmpty',
            //     validWhen: true,
            //     message: 'Enter valid password.'
            // },
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
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
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
                // const { from } = location.state || { from: { pathname: "/" } };
                // history.push(from);
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
        document.title = "Login";
        //this.props.title;
        window.scrollTo(0, 0);

        const user = getRememberUser();
        if (user) {
            this.setState({ username: user.username, password: user.password, rememberme: true });
        }
    }

    render() {
        const validation = this.state.submitted ? this.validator.validate(this.state) : this.state.validation
        const { username, password, rememberme, submitted, loading, error } = this.state;
        console.log(rememberme);
        return (
            <React.Fragment>
                <main className="flex-shrink-0 col-md-3 mt-3">
                    <section className="common-block">
                        <div className="container">
                            <div className="login-main">
                                <h2 className="mb-3"> Sign In</h2>
                                <div className="white-box-no-animate p-20">
                                    <div className="form-group">
                                        <label htmlFor="email" className="user-select-all">Username <span style={{ color: 'red' }}>*</span> </label>
                                        <input type="email" name='username' placeholder="Enter Username" className="form-control" id="username" aria-describedby="emailHelp" value={username} onChange={this.handleInputChange} />
                                        <span className="help-block">{validation.username.message}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Password <span style={{ color: 'red' }}>*</span></label>
                                        <input type="Password" name='password' placeholder="Enter Password" className="form-control" id="password" value={password} onChange={this.handleInputChange} />
                                        <span className="help-block">{validation.password.message}</span>
                                    </div>
                                    <div className="form-group form-check">
                                        <input type="checkbox" className="form-check-input" id="rememberMe" Checked={rememberme} onChange={this.handleInputChange} />
                                        <label className="form-check-label" htmlFor="rememberMe"> Remember me</label>
                                        <Link className="float-right" to="/ForgetPassword">Forgot Password?</Link>
                                    </div>
                                    <button onClick={this.handleFormSubmit} className="btn btn-primary" disabled={loading} >
                                        {loading && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </React.Fragment>
        )
    }
}

export default Login