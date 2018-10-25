import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, FormGroup, Label, InputGroup, InputGroupAddon, InputGroupText, Row, Alert, ListGroup, ListGroupItem } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { validateName, validateEmail } from '../../components/Utility/Utility';
import { login } from '../../actions/loginAction';
import { connect } from 'react-redux'
import { postRequest, putRequest } from '../../apis/RestApi';


class Password extends Component {

    constructor(props) {
        super(props)
        this.state = {
            error: [],
            success: '',
            showAlert: true,
            showSuccess: true,
            setPassword: false
        }
    }

    setNewPassword() {
        let error = []
        // let psw = document.getElementById('opsw').value
        let psw1 = document.getElementById('npsw').value
        let psw2 = document.getElementById('cpsw').value
        if (!psw1) {
            error.push('Password is mandatory')
        }
        if (!psw2) {
            error.push('Please confirm the password')
        }
        if (psw1 != psw2) {
            error.push('Passwords do not match')
        }

        if (error.length) {
            this.setState({ error: error, showAlert: true })
            return
        }
        //call set new pwd api
        let params = {}
        putRequest("/rbac/setPassword", params)
        this.setState({ setPassword: true })
    }

    cancelAlert = () => {
        this.setState({ showAlert: false, showSuccess: false });
    }

    render() {
        if (this.state.setPassword) {
            return <Redirect to={{ pathname: '/' }} />
        }
        let errorAlert = null
        let success = null
        if (this.state.error.length) {
            errorAlert = <Alert color="danger" isOpen={this.state.showAlert} toggle={this.cancelAlert}>
                {this.state.error.map((err) => {
                    return <ListGroup><ListGroupItem>{err}</ListGroupItem> </ListGroup>
                })}
            </Alert>
        }
        if (this.state.success) {
            success = (<Alert color="success" isOpen={this.state.showSuccess} toggle={this.cancelAlert}>
                {this.state.success}
            </Alert>)
        }

        return (
            <div style={{ backgroundColor: '#e4e5e6' }}>
                <p style={{
                    backgroundColor: 'white',
                    color: '#4f908e', padding: '15px',
                    fontSize: '30px',
                    fontWeight: '600', marginBottom: '0rem'
                }}>PLATINA COMMAND CENTER</p>

                <div className="app flex-row align-items-center">

                    <Container>
                        <Row className="justify-content-center">
                            <Col md="6">
                                <Card className="mx-4" style={{ boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' }}>
                                    <CardBody className="p-4">
                                        {errorAlert}
                                        {success}
                                        <Form id="firstLogin">
                                            <h3>Set New Password</h3>
                                            <p className="text-muted"></p>
                                            {/* <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Old Password" id="opsw" />
                                            </InputGroup> */}
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="New Password" id="npsw" />
                                            </InputGroup>
                                            <InputGroup className="mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Confirm password" id="cpsw" />
                                            </InputGroup>
                                            {/* <Button block className="custBtn" onClick={() => (this.setNewPassword())}>Confirm</Button> */}
                                        </Form>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Col xs="12">
                                            <Button block className="custFillBtn" onClick={() => (this.setNewPassword())}>Confirm</Button>
                                        </Col>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </Container>

                </div >
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return { login: (params) => dispatch(login(params)) }
}
function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Password)