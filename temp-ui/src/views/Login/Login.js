import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, FormGroup, Label, InputGroup, InputGroupAddon, InputGroupText, Row, Alert, ListGroup, ListGroupItem } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { validateName, validateEmail } from '../../components/Utility/Utility';


class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            signUp: false,
            error: [],
            showAlert: true
        }
    }


    logIn = () => {
        let error = []
        let username = document.getElementById('user').value
        let validatename = validateName(username)
        if (!username) {
            error.push('Username is mandatory ')
        }
        let psw = document.getElementById('psw').value
        if (!psw) {
            error.push('Password is mandatory')
        }
        if (error.length) {
            this.setState({ error: error, showAlert: true })
            return
        }
        this.setState({ signUp: true })
    }

    forgotPsw = () => {
        let error = []
        let psw1 = document.getElementById('password').value
        let psw2 = document.getElementById('confirmPassword').value
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
        this.setState({ signUp: true })
    }

    showLogin = () => {
        document.getElementById('logIn').style.display = 'block'
        document.getElementById('forgotpassword').style.display = 'none'
        document.getElementById('logInBtn').style.display = 'none'
        document.getElementById('forgotpasswordBtn').style.display = 'block'

    }
    showForgotPsw = () => {
        document.getElementById('logIn').style.display = 'none'
        document.getElementById('forgotpassword').style.display = 'block'
        document.getElementById('logInBtn').style.display = 'block'
        document.getElementById('forgotpasswordBtn').style.display = 'none'

    }


    cancelAlert = () => {
        this.setState({ showAlert: false });
    }

    render() {

        if (this.state.signUp) {
            return <Redirect to={{ pathname: '/pcc' }} />
        }
        let errorAlert = null
        if (this.state.error.length) {
            errorAlert = <Alert color="danger" isOpen={this.state.showAlert} toggle={this.cancelAlert}>
                {this.state.error.map((err) => {
                    return <ListGroup><ListGroupItem>{err}</ListGroupItem> </ListGroup>
                })}
            </Alert>
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

                                        <form id="logIn" onSubmit={(e) => (this.logIn(e))}>
                                            <h3>LogIn</h3>
                                            <p className="text-muted"></p>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-user"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" placeholder="Username" id="user" />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Password" autoComplete="new-password" id="psw" />
                                            </InputGroup>
                                            <Button block className="custBtn" type="submit" >Login</Button>
                                        </form>
                                        <Form id="forgotpassword">
                                            <h3>Forgot Password</h3>
                                            <p className="text-muted"></p>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Password" autoComplete="new-password" id="npsw" />
                                            </InputGroup>
                                            <InputGroup className="mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Repeat password" autoComplete="new-password" id="cpsw" />
                                            </InputGroup>
                                            <Button block className="custBtn" onClick={() => (this.forgotPsw())}>Submit</Button>
                                        </Form>
                                    </CardBody>
                                    <CardFooter className="p-4">

                                        <Col xs="12">
                                            <Button className="custFillBtn" id="logInBtn" block onClick={() => (this.showLogin())}><span>LogIn</span></Button>
                                        </Col>
                                        <Col xs="12">
                                            <Button className="custFillBtn" id="forgotpasswordBtn" block onClick={() => (this.showForgotPsw())}><span>Forgot password??</span></Button>
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

export default Login