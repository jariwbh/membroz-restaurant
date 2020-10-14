import React, { Component } from 'react'

const OPTIONS = {
    OPTION1: 'option1',
    OPTION2: 'option2',
    OPTION3: 'option3'
}

export default class Test extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: 'option1'
        }

        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleOptionChange = (changeEvent) => {

        const target = changeEvent.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    render() {
        const { selectedOption } = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">

                        <div>
                            <div style={{ height: '100px' }}></div>
                            <div className="form-control">
                                <label>
                                    <input
                                        type="radio"
                                        name="selectedOption"
                                        value={OPTIONS.OPTION1}
                                        checked={selectedOption === OPTIONS.OPTION1}
                                        onChange={this.handleOptionChange}
                                    />
                                Option 1
                            </label>
                            </div>
                            <div className="form-control">
                                <label>
                                    <input
                                        type="radio"
                                        name="selectedOption"
                                        value={OPTIONS.OPTION2}
                                        checked={selectedOption === OPTIONS.OPTION2}
                                        onChange={this.handleOptionChange}
                                    />
                                    Option 2
                                </label>
                            </div>
                            <div className="form-control">
                                <label>
                                    <input
                                        type="radio"
                                        name="selectedOption"
                                        value={OPTIONS.OPTION3}
                                        checked={selectedOption === OPTIONS.OPTION3}
                                        onChange={this.handleOptionChange}
                                    />
                                    Option 3
                                </label>
                            </div>
                            <div className="form-control">
                                <label>
                                    {this.state.selectedOption}
                                </label>
                            </div>
                            <button className="btn btn-default" type="submit">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}