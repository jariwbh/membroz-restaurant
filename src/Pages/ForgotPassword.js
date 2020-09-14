import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import FormValidator from '../components/FormValidator';

export class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        document.title = this.props.title
        window.scrollTo(0, 0);

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
            }

        ]);

        this.state = {
            username: '',
            validation: this.validator.valid(),
            submitted: false,
            loading: false,
            errorMessage: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value

        });
    }

    handleFormSubmit = async event => {
        event.preventDefault();
        const validation = this.validator.validate(this.state);
        this.setState({ validation });

        if (validation.isValid) {
            this.setState({ loading: true })
            console.log("done");
            this.setState({ loading: false })
        }
        else {
            this.setState({ loading: false })
        }
    }

    render() {
        const validation = this.state.submitted ? this.validator.validate(this.state) : this.state.validation
        const { username, loading, error } = this.state;
        return (
            <main className="flex-shrink-0 col-md-3 mt-3">
                <section className="common-block">
                    <div className="container">
                        <div className="login-main">
                            <h2 className="mb-3">Forgot Password</h2>
                            <div className="white-box-no-animate p-20">
                                <div className="form-group">
                                    <label htmlFor="email" className="user-select-all">Username or Email <span style={{ color: 'red' }}>*</span> </label>
                                    <input type="email" name='username' placeholder="Enter Username" className="form-control" id="username" aria-describedby="emailHelp" value={username} onChange={this.handleInputChange} />
                                    <span className="help-block">{validation.username.message}</span>
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
        )
    }
}

export default ForgotPassword
