import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from "react-router-dom";

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
            <Modal isOpen={this.state.open} toggle={() => this.cancel()} size="md"  >
                <ModalHeader toggle={() => this.cancel()}> </ModalHeader>
                <ModalBody>
                    <h5>please select location first <Link to="/pcc/node/apps">Go to apps</Link></h5>
                </ModalBody>
            </Modal>
        )
    }
}

export default ConfirmationModal