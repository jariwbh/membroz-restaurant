import React, { Component } from 'react'

export default class Kitchen extends Component {
    constructor(props) {
        super(props)
        document.title = this.props.title
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}
