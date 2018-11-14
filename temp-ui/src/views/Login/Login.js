import React, {Component} from 'react';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Col,
    Container,
    Form,
    Input,
    FormGroup,
    Label,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Alert,
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import {validateName, validateEmail, validateUrl,updateServerURL, trimUrlProtocol,getUrlBase } from '../../components/Utility/Utility';
import {login,fetchUserProfile} from '../../actions/loginAction';
import {connect} from 'react-redux'
import {postRequest} from '../../apis/RestApi';
import { FORGOT_PASSWORD } from "../../apis/RestConfig";

const serverUrlID = "logInServerIP";
const advancedSectionArrowID = "advanced-arrow";
const usernameForgotID = "usernameForgotID";

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            signUp: false,
            error: [],
            success: '',
            showAlert: false,
            showSuccess: false,
            showAdvanced: false,
        }
    }

    static getDerivedStateFromProps(props, state) {
        return {
            showSuccess: props.showSuccess,
            success: props.success
        }
    }

    logIn = () => {
        let self = this
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
        let serverURL = document.getElementById('serverURL').value
        if (!serverURL) {
            error.push('Server URL is mandatory ')
        }else {
            if (!validateUrl(serverURL)) {
                error.push('Server url is not valid ')
            }
        }
        if (error.length) {
            this.setState({error: error, showAlert: true, showSuccess: false})
            return
        }
        updateServerURL(serverURL)

        let params = {
            "username": username,
            "password": psw
        }
        this.props.login(params).then(function () {
            fetchUserProfile(username).then(function(){
                self.setState({signUp: true})
            }).catch(function (e) {
                    console.error(e)
                    let error = []
                    error.push('Unable to get user profile')
                    self.setState({error: error, showAlert: true, showSuccess: false})
                }
            )
        }).catch(function (e) {
                console.error(e)
                let error = []
                error.push('Incorrect Credentials')
                self.setState({error: error, showAlert: true, showSuccess: false})
            }
        )
    }

    forgotPsw = () => {
        let self = this
        let username = document.getElementById(usernameForgotID).value
        let usedUrl = getUrlBase(window.location.href)
        let error = []
        if (!username){
            error.push("Username is mandatory ")
        }
        if (error.length) {
            this.setState({error: error, showAlert: true})
            return
        }
        let params = {
            "username": username,
            "source": usedUrl+"/setPass",
        }
        postRequest(FORGOT_PASSWORD, params).then(function (json) {
            self.setState({showAlert: false, showSuccess: true, success: "An E-mail has been sent"})
            //if (json==undefined || json.StatusCode != 200) {
            //    let error = []
            //    error.push('Unable to restore password for specified email')
            //    self.setState({error: error, showAlert: true, showSuccess: false})
            //}else{
            //    self.setState({showAlert: false, showSuccess: true, success: "An E-mail has been sent to " + email})
            //}
        })
    }

    hideAdvanced = (hide) => {
        if (hide) {
            document.getElementById(advancedSectionArrowID).classList.remove("icon-arrow-up")
            document.getElementById(advancedSectionArrowID).classList.add("icon-arrow-down")
            document.getElementById(serverUrlID).style.display = 'none'
        } else {
            document.getElementById(advancedSectionArrowID).classList.remove("icon-arrow-down")
            document.getElementById(advancedSectionArrowID).classList.add("icon-arrow-up")
            document.getElementById(serverUrlID).style.display = 'block'
        }
    }

    toggleAdvanced = () => {
        this.hideAdvanced(!this.state.showAdvanced)
        this.state.showAdvanced = !this.state.showAdvanced;
    }

    showLogin = () => {
        document.getElementById('logIn').style.display = 'block'
        document.getElementById('forgotpassword').style.display = 'none'
        document.getElementById('logInBtn').style.display = 'none'
        document.getElementById('forgotpasswordBtn').style.display = 'block'
        this.setState({showAlert: false, showSuccess: false})
    }
    showForgotPsw = () => {
        document.getElementById('logIn').style.display = 'none'
        document.getElementById('forgotpassword').style.display = 'block'
        document.getElementById('logInBtn').style.display = 'block'
        document.getElementById('forgotpasswordBtn').style.display = 'none'
        this.setState({showAlert: false, showSuccess: false})
    }


    cancelAlert = () => {
        this.setState({showAlert: false, showSuccess: false});
    }

    render() {

        if (this.state.signUp) {
            return <Redirect to={{pathname: '/pcc'}}/>
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
            <div style={{backgroundColor: '#e4e5e6'}}>
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
                                <Card className="mx-4"
                                      style={{boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'}}>
                                    <CardBody className="p-4">
                                        {errorAlert}
                                        {success}
                                        <div id="logIn">
                                            <h3>Log In</h3>
                                            <p className="text-muted"></p>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-user"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" placeholder="Username" id="user"/>
                                            </InputGroup>
                                            <InputGroup className="mb-3">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-lock"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="password" placeholder="Password"
                                                       autoComplete="new-password" id="psw"/>
                                            </InputGroup>
                                            <div id="login-advanced-section">
                                                <div className="row">
                                                    <i id={advancedSectionArrowID} className="icon-arrow-down mt-1 ml-3"
                                                       onClick={() => (this.toggleAdvanced())}></i>
                                                    <h5 className="ml-2 pb-2">Advanced Options</h5>
                                                </div>
                                                <div id={serverUrlID}>
                                                    <InputGroup className="mb-3">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="icon-screen-desktop"></i>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input type="text" defaultValue={trimUrlProtocol(Window.invaderServerAddress)} placeholder="Server URL"
                                                               autoComplete="" id="serverURL"/>
                                                    </InputGroup>
                                                </div>
                                            </div>
                                            <Button block className="custBtn"
                                                    onClick={(e) => (this.logIn(e))}>Login</Button>
                                        </div>
                                        <Form id="forgotpassword">
                                            <h3>Forgot Password</h3>
                                            <p className="text-muted"></p>
                                            <InputGroup className="mb-4">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-user"></i>
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input type="text" placeholder="Username" id={usernameForgotID}/>
                                            </InputGroup>
                                            <Button block className="custBtn"
                                                    onClick={() => (this.forgotPsw())}>Submit</Button>
                                        </Form>
                                    </CardBody>
                                    <CardFooter className="p-4">
                                        <Col xs="12">
                                            <Button className="custFillBtn" id="logInBtn" block
                                                    onClick={() => (this.showLogin())}><span>LogIn</span></Button>
                                        </Col>
                                        <Col xs="12">
                                            <Button className="custFillBtn" id="forgotpasswordBtn" block
                                                    onClick={() => (this.showForgotPsw())}><span>Forgot password?</span></Button>
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
    return {login: (params) => dispatch(login(params))}
}
function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)