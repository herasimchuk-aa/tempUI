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

    signUp = () => {
        let error = []
        let username = document.getElementById('username').value
        let validatename = validateName(username)
        if (!validatename) {
            error.push('Name field is mandatory ')
        }
        let email = document.getElementById('email').value
        let validatemail = validateEmail(email)
        if (!validatemail) {
            error.push('please enter correct Email')
        }
        let psw1 = document.getElementById('password').value
        let psw2 = document.getElementById('confirmPassword').value
        if (psw1.length != 6) {
            error.push('password must be of 6 characters')
        }
        if (psw1 != psw2) {
            error.push('password does not match')
        }

        if (error.length) {
            this.setState({ error: error, showAlert: true })
            return
        }
        this.setState({ signUp: true })
    }

    logIn = () => {
        let error = []
        let username = document.getElementById('user').value
        let validatename = validateName(username)
        if (!validatename) {
            error.push('Name field is mandatory ')
        }
        let psw = document.getElementById('psw').value
        if (psw.length != 6) {
            error.push('password must be of 6 characters')
        }
        console.log(error.length)
        if (error.length) {
            this.setState({ error: error, showAlert: true })
            return
        }
        this.setState({ signUp: true })
        // let password = document.getElementById('password').value, confirmPassword
        // let confirmPassword = document.getElementById('confirmPassword').value,

    }

    forgotPsw = () => {
        let error = []
        let psw1 = document.getElementById('password').value
        let psw2 = document.getElementById('confirmPassword').value
        if (psw1.length != 6) {
            error.push('password must be of 6 characters')
        }
        if (psw1 != psw2) {
            error.push('password does not match')
        }

        if (error.length) {
            this.setState({ error: error, showAlert: true })
            return
        }
        this.setState({ signUp: true })
    }

    showLogin = () => {
        document.getElementById('logIn').style.display = 'block'
        document.getElementById('register').style.display = 'none'
        document.getElementById('forgotpassword').style.display = 'none'
        document.getElementById('logInBtn').style.display = 'none'
        document.getElementById('forgotpasswordBtn').style.display = 'block'
        document.getElementById('registerBtn').style.display = 'block'
    }
    showForgotPsw = () => {
        document.getElementById('logIn').style.display = 'none'
        document.getElementById('register').style.display = 'none'
        document.getElementById('forgotpassword').style.display = 'block'
        document.getElementById('logInBtn').style.display = 'block'
        document.getElementById('forgotpasswordBtn').style.display = 'none'
        document.getElementById('registerBtn').style.display = 'block'
    }
    showRegister = () => {
        document.getElementById('logIn').style.display = 'none'
        document.getElementById('register').style.display = 'block'
        document.getElementById('forgotpassword').style.display = 'none'
        document.getElementById('logInBtn').style.display = 'block'
        document.getElementById('forgotpasswordBtn').style.display = 'block'
        document.getElementById('registerBtn').style.display = 'none'
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
                                        <Form id="register">
                                            <h3>Register</h3>
                                            <p className="text-muted">Create your account</p>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-user"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" placeholder="Username" id="username" />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>@</InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" placeholder="Email" autoComplete="email" id="email" />
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Password" autoComplete="new-password" id="password" />
                                            </InputGroup>
                                            <InputGroup className="mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Repeat password" autoComplete="new-password" id="confirmPassword" />
                                            </InputGroup>
                                            <FormGroup row>
                                                <Col md="2">
                                                    <Label>Roles</Label>
                                                </Col>
                                                <Col md="10">
                                                    <FormGroup check inline className="radio">
                                                        <Input className="form-check-input" type="radio" id="radio1" name="radios" value="option1" />
                                                        <Label check className="form-check-label" htmlFor="radio1">Admin</Label>
                                                    </FormGroup>
                                                    <FormGroup check inline className="radio">
                                                        <Input className="form-check-input" type="radio" id="radio2" name="radios" value="option2" />
                                                        <Label check className="form-check-label" htmlFor="radio2">Developer</Label>
                                                    </FormGroup>
                                                    <FormGroup check inline className="radio">
                                                        <Input className="form-check-input" type="radio" id="radio3" name="radios" value="option3" />
                                                        <Label check className="form-check-label" htmlFor="radio3">Read Only</Label>
                                                    </FormGroup>
                                                </Col>
                                            </FormGroup>
                                            <Button block className="custBtn" onClick={() => (this.signUp())}>Create Account</Button>
                                        </Form>
                                        <Form id="logIn">
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
                                            <Button block className="custBtn" onClick={() => (this.logIn())}>Login</Button>
                                        </Form>
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
                                        <Col xs="12">
                                            <Button className="custFillBtn" id="registerBtn" block onClick={() => (this.showRegister())}><span>Register</span></Button>
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