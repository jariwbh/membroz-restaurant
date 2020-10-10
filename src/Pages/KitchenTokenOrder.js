import React, { Component } from 'react'
import * as moment from 'moment';
import uuid from 'react-uuid'
import SignalRService from '../Helpers/signalRService';
import * as Api from '../Api/TokenServices'
import * as Sounds from '../components/Sounds.js'

export default class KitchenTokenOrder extends Component {
    constructor(props) {
        super(props);

        this.senderID = uuid();
        this.state = {
            waiting: true,
            inProgress: true,
            prepared: false,
            tokenList: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    receiveMessage = (msg) => {
        //console.log('Signal received by component: ' + msg);
        //console.log('Signal received by component: ', JSON.parse(msg));
        const token = JSON.parse(msg)
        // this.setState(previousState => ({
        //     tokenList: [...previousState.tokenList, token]
        // }));
        if (token.senderID && token.senderID !== this.senderID) {
            let tokenList = this.state.tokenList
            let foundToken = tokenList.find(x => x._id === token._id)
            if (foundToken) {
                foundToken = token
            } else {
                tokenList.push(token)
            }

            this.setState({ tokenList })
            this.playAudio();
        }
    }

    playAudio = () => {
        var audio = new Audio(Sounds.notification); audio.play(); audio.loop = false;
    }

    changeTokenStatus = async (token) => {
        let tokenList = this.state.tokenList
        let foundToken = tokenList.find(x => x._id === token._id)
        if (foundToken) {
            switch (token.status) {
                case "waiting":
                    foundToken.status = 'inprogress';
                    break;
                case "inprogress":
                    foundToken.status = 'prepared';
                    break;
                case "prepared":
                    foundToken.status = 'served';
                    break;
                case "served":
                    foundToken.status = 'inprogress';
                    break;
            }


            const responseToken = await Api.save(foundToken)
            foundToken = responseToken.data;
            foundToken.senderID = this.senderID;
            // console.log('Send KOT Token Response AAAAAAAAAAAAA:', JSON.stringify(kotToken))
            SignalRService.sendMessage(JSON.stringify(foundToken));

            this.setState({ tokenList: tokenList })
            //console.log('this.state.tokenList : ', this.state.tokenList)
        }
    }

    getTokenList = () => {
        Api.getList().then((response) => {
            this.setState({ tokenList: response.data })
        })
    }

    async componentDidMount() {
        await this.getTokenList();

        SignalRService.registerReceiveEvent((msg) => {
            this.receiveMessage(msg);
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    renderToken = (props) => {
        const token = props.token;
        const { waiting, inProgress, prepared } = this.state;

        if (token.status === 'waiting' && waiting !== true) {
            return null
        }
        if (token.status === 'inprogress' && inProgress !== true) {
            return null
        }
        if (token.status === 'prepared' && prepared !== true) {
            return null
        }

        return <div key={token._id} className="white-box card">
            <div className="d-flex kot-top-bar in-progress-bg">
                <div className="flex-grow-1 person-title">{token.prefix}{token.tokennumber}</div>
                {(token.property.table) &&
                    <div className="person-title flex-grow-1"> Table: {token.property.table.tablename}</div>
                }
                <div className="person-title">{moment(token.createdAt).format("LT")}</div>
            </div>
            <div className="table-responsive">
                <table className="table mb-0">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th className="text-right">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {token.property.items && token.property.items.length > 0 &&
                            token.property.items.map(item =>
                                <tr key={item._id}>
                                    <td>{item.itemname}</td>
                                    <td className="text-right">{item.quantity}</td>
                                    <td></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <div className="border-top kot-bottom-bar">
                <div className="d-flex justify-content-end">
                    {/* <button type="button" className="btn btn-primary btn-block">Accept</button> */}

                    {(token.status === "waiting") &&
                        <button type="button" className="btn btn-primary btn-block" onClick={() => this.changeTokenStatus(token)}>Accept</button>
                    }
                    {(token.status === "inprogress") &&
                        <button type="button" className="btn btn-primary btn-block" onClick={() => this.changeTokenStatus(token)}>Prepared</button>
                    }

                </div>
            </div>
        </div>
    }

    render() {
        const { waiting, inProgress, prepared, tokenList } = this.state;

        const renderTokenList = tokenList.map((token) =>
            <this.renderToken key={token._id} token={token}></this.renderToken>
        );


        return (
            <React.Fragment>
                <div id="layoutSidenav_content">
                    <div className="container-fluid">
                        <div className="row table-item-gutters my-3">
                            <div className="col-xl-12 col-lg-12 col-md-12">
                                <div className="row">
                                    <div className="col-xl-7 col-lg-6 col-md-6">
                                        <ul className="nav nav-pills mb-2 categories-pills" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link active" id="pills-item-1-tab" data-toggle="pill" href="#pills-item-1" role="tab" aria-controls="pills-item-1" aria-selected="true">All</a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link" id="pills-item-2-tab" data-toggle="pill" href="#pills-item-2" role="tab" aria-controls="pills-item-2" aria-selected="false">Dine In </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link" id="pills-item-3-tab" data-toggle="pill" href="#pills-item-3" role="tab" aria-controls="pills-item-3" aria-selected="false">Take Away </a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link" id="pills-item-4-tab" data-toggle="pill" href="#pills-item-4" role="tab" aria-controls="pills-item-4" aria-selected="false">Delivery </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-xl-5 col-lg-6 col-md-6 d-flex justify-content-md-end mb-3 mb-md-0">
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox" className="custom-control-input inprogress-switch" id="waiting" name="waiting" checked={waiting} onChange={this.handleInputChange} />
                                            <label className="custom-control-label font-weight-bold" htmlFor="waiting">Waiting</label>
                                        </div>
                                        <div className="custom-control custom-switch ml-2 ml-lg-4">
                                            <input type="checkbox" className="custom-control-input inprogress-switch" id="inProgress" name="inProgress" checked={inProgress} onChange={this.handleInputChange} />
                                            <label className="custom-control-label font-weight-bold" htmlFor="inProgress">In Progress</label>
                                        </div>
                                        <div className="custom-control custom-switch ml-2 ml-lg-4">
                                            <input type="checkbox" className="custom-control-input prepared-switch" id="prepared" name="prepared" checked={prepared} onChange={this.handleInputChange} />
                                            <label className="custom-control-label font-weight-bold" htmlFor="prepared">Prepared</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-content categories-tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-item-1" role="tabpanel" aria-labelledby="pills-item-1-tab">
                                        <div className="card-columns">
                                            {renderTokenList}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
