import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from "react-bootstrap";
import '../Assets/css/ActionLoaderStatePopup.scss';

export const LOADERSTATES = {
    LOADING: '',
    SUCCESS: 'load-success',
    FAILURE: 'load-failure'
}

function ActionLoaderStatePopup(props) {
    const { show, loadComplete, loaderState } = props
    return (
        <div className={`modal fade ${show === true ? "show" : ""}`} style={{ display: show === true ? "block" : "none" }}>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" >Sending Token</h5>
                        <button type="button" className="close" onClick={(e) => props.onClose()}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="d-flex justify-content-center">
                            <div className={`circle-loader ${loadComplete === true ? "load-complete" : ""} ${loaderState}`}>
                                <div className="checkmark draw" style={{ display: loaderState === LOADERSTATES.SUCCESS ? "block" : "none" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActionLoaderStatePopup;
