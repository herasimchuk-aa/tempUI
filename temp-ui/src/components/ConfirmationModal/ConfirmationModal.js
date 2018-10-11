import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ConfirmationModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true,
        }
    }

    static getDerivedStateFromProps(props, state) {
        return { open: props.open }
    }

    action = () => {
        if (this.props.action) {
            this.props.action()
        }

        this.setState({ open: false })
    }

    cancel() {
        this.setState({ open: false })
        this.props.cancel()
    }

    render() {
        return (
            <Modal isOpen={this.state.open} toggle={() => this.cancel()} size="sm" centered="true" >
                <ModalHeader toggle={() => this.cancel()}> Confirmation </ModalHeader>
                <ModalBody>
                    <h5>Do you really want to {this.props.actionName}?</h5>
                </ModalBody>
                <ModalFooter>
                    <Button outline className="custBtn" color="primary" onClick={() => (this.action())}>Yes</Button>
                    <Button outline className="custBtn" color="primary" onClick={() => (this.cancel())}>No</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default ConfirmationModal