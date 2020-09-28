import React, { Component } from 'react';

class Test extends Component {
    constructor(props) {
        super(props);
    }
    handleInputChange = event => {
        console.log(event.target.name);
        console.log(event.target.value);
    }

    render() {
        return (
            <React.Fragment>
                <div className="App col-md-4">
                    <h1>hello select tools</h1>
                    <select data-live-search="true" className="selectpicker" name='customer' id="customer"
                        onChange={this.handleInputChange} value='Lychee'>
                        <option>Mango</option>
                        <option>Orange</option>
                        <option>Lychee</option>
                        <option>Pineapple</option>
                        <option>Apple</option>
                        <option>Banana</option>
                        <option>Grapes</option>
                        <option>Water Melon</option>
                    </select>
                </div>
            </React.Fragment>
        );
    }
}

export default Test;
