import React, { Component } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Alert, Media, Nav, NavItem, NavLink, Row, TabContent, TabPane, Col
} from 'reactstrap';
import '../../views.css';
import SummaryDataTable from '../NodeSummary/SummaryDataTable';
import { frrHead } from '../../../consts';
import { trimString, getNameById } from '../../../components/Utility/Utility';
import { FETCH_ALL_FRR, ADD_FRR, UPDATE_FRR, DELETE_FRR } from '../../../apis/RestConfig';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { getFrr, addFrr, updateFrr, deleteFrrs, setFrrHeadings } from '../../../actions/frrAction';
import I from 'immutable'
import classnames from 'classnames';

class Frr extends Component {


    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            data: [],
            showDelete: false,
            selectedRowIndexes: [],
            displayModel: false,
            displayEditModel: false,
            visible: false,
            activeTab: '0',
            editActiveTab: 't0',
            frrConfig: []
        }
        this.counter = 0;
    }

    componentDidMount() {
        this.props.getFrr(FETCH_ALL_FRR)
    }

    static getDerivedStateFromProps(props) {
        return {
            data: props.data ? props.data.toJS() : [],
            frrHead: props.frrHeadings ? props.frrHeadings.toJS() : frrHead
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
        if (this.state.editActiveTab !== tab) {
            this.setState({
                editActiveTab: tab,
            });
        }
    }

    checkBoxClick = (rowIndex) => {
        let { selectedRowIndexes } = this.state
        let arrayIndex = selectedRowIndexes.indexOf(rowIndex)
        if (arrayIndex > -1) {
            selectedRowIndexes.splice(arrayIndex, 1)
        } else {
            selectedRowIndexes.push(rowIndex)
        }
        if (this.state.selectedRowIndexes.length > 0) {
            this.setState({ showDelete: true });
        }
        else {
            this.setState({ showDelete: false });
        }
    }


    showDeleteButton() {
        let a = [];
        if (this.state.showDelete == true) {
            a.push(<Button className="custBtn animated fadeIn" outline color="secondary" onClick={() => (this.deleteFrr())}>Delete</Button>);
            return a;
        }
        else
            return null;
    }


    deleteFrr() {
        let self = this;
        let deleteIds = [];
        this.state.selectedRowIndexes.map(function (item) {
            deleteIds.push(self.state.data[item].Id)
        })

        this.props.deleteFrrs(DELETE_FRR, deleteIds).then(function (data) {
            if (data.Failure && data.Failure.length) {
                let nameArr = getNameById(data.Failure, self.state.data)
                let str = ""
                if (nameArr.length === 1) {
                    str += nameArr[0] + " is in use."
                } else {
                    nameArr.map(function (name) {
                        str += name + ","
                    })
                    str += " are in use."
                }
                NotificationManager.error(str)
            } else {
                NotificationManager.success("FRR deleted successfully", "FRR") // "Success!"
            }
        }).catch(function (e) {
            console.log(E)
            NotificationManager.error("Something went wrong", "FRR") // "error!FRR
        })
        self.setState({ showDelete: false, selectedRowIndexes: [] });

    }

    onDismiss() {
        this.setState({ visible: false });

    }

    tabHeading = () => {
        const configs = [
            {
                Name: 'daemons',
                Content: ''
            },
            {
                Name: 'zebra.conf',
                Content: ''
            },
            {
                Name: 'vtysh.conf',
                Content: ''
            },
            {
                Name: 'ripgnd.conf',
                Content: ''
            },
            {
                Name: 'ripd.conf',
                Content: ''
            },
            {
                Name: 'pmid.conf',
                Content: ''
            },
            {
                Name: 'ospfd.conf',
                Content: ''
            },
            {
                Name: 'ospf6d.conf',
                Content: ''
            },
            {
                Name: 'ldpd.conf',
                Content: ''
            },
            {
                Name: 'bgpd.conf',
                Content: ''
            },
            {
                Name: 'isisd.conf',
                Content: ''
            },
            {
                Name: 'daemons.conf',
                Content: ''
            },
        ]

        let arr = []
        for (let i in configs) {
            arr.push(<NavItem>
                <NavLink className={classnames({ active: this.state.activeTab == i })} onClick={() => { this.toggle(i); }} >
                    {configs[i].Name}
                </NavLink>
            </NavItem>)
        }

        return arr

    }

    // tabPanel = () => {
    //     const configs = [
    //         {
    //             Name: 'Demons',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Zebra',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Vtysh',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Ripngd',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Ripd',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Pimd',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Ospfd',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Ospf6d',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Ldpd',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Bgpd',
    //             Content: ''
    //         },
    //         {
    //             Name: 'Isisd',
    //             Content: ''
    //         },
    //         {
    //             Name: 'FRR',
    //             Content: ''
    //         }
    //     ]
    //     let arr = ''
    //     for (let i in configs) {
    //         if (i == this.state.activeTab) {
    //             arr = (<div>
    //                 <TabPane tabId={i} onTabChange={this.chkTabChanges(i)}>
    //                     <Input type="textarea" name="text" id={"tab" + i} placeholder="Add content...." />
    //                     <div style={{ float: 'right' }}>
    //                         <Button className="custBtn" outline color="primary" onClick={() => (this.saveFRRConfig(configs[i], i))}>Save</Button>
    //                     </div>
    //                 </TabPane>
    //             </div >)
    //         }
    //     }
    //     return arr
    // }

    chkTabChanges = (i) => {
        console.log('on Tab change' + i)
        // let val = document.getElementById("tab" + i).value
        // if (val) {
        //     val = null
        // }
    }

    saveFRRConfig = (frrConfig, index) => {
        let frrConfigList = this.state.frrConfig
        frrConfig.Content = document.getElementById("tab" + index).value,
            // document.getElementById("tab" + index).value = null
            frrConfigList.push(frrConfig)


        this.setState({ frrConfig: frrConfigList })
    }

    addFrrModal() {
        let tabHeading = this.tabHeading()
        //  let tabPanel = this.tabPanel()
        if (this.state.displayModel) {
            return (
                <Modal isOpen={this.state.displayModel} toggle={() => this.cancel()} size="lg" centered="true" >
                    <ModalHeader toggle={() => this.cancel()}>Add FRR</ModalHeader>
                    <ModalBody>
                        <Alert color="danger" isOpen={this.state.visible} toggle={() => this.onDismiss()} >Name cannot be empty</Alert>
                        <Row>
                            <Col md="6">Name<font color="red"><sup>*</sup></font> <Input autoFocus className="marTop10" id='frrName' /></Col>
                            <Col md="6">Location <Input className="marTop10" id='frrLoc' /></Col>
                            <Row>
                            </Row>
                            <Col md="6">Version <Input className="marTop10" id='frrVersion' /></Col>
                            <Col md="6">Description <Input className="marTop10" id='frrDesc' /></Col>
                        </Row>
                        <br />
                        FRR configuration
                        <Nav tabs>
                            {tabHeading}
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="0" >
                                <Input type="textarea" name="text" id="tab0" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="1" >
                                <Input type="textarea" name="text" id="tab1" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="2" >
                                <Input type="textarea" name="text" id="tab2" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="3" >
                                <Input type="textarea" name="text" id="tab3" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="4" >
                                <Input type="textarea" name="text" id="tab4" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="5" >
                                <Input type="textarea" name="text" id="tab5" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="6" >
                                <Input type="textarea" name="text" id="tab6" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="7" >
                                <Input type="textarea" name="text" id="tab7" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="8" >
                                <Input type="textarea" name="text" id="tab8" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="9" >
                                <Input type="textarea" name="text" id="tab9" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="10" >
                                <Input type="textarea" name="text" id="tab10" placeholder="Add content...." />
                            </TabPane>
                            <TabPane tabId="11" >
                                <Input type="textarea" name="text" id="tab11" placeholder="Add content...." />
                            </TabPane>

                        </TabContent >
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.addFrr())}>Add</Button>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.cancel())}>Cancel</Button>
                    </ModalFooter>
                </Modal >
            );
        }
    }

    cancel() {
        this.setState({ displayModel: !this.state.displayModel, visible: false, frrConfig: [] })
    }

    addFrr() {
        let configs = [
            {
                Name: 'daemons',
                Content: document.getElementById('tab0').value
            },
            {
                Name: 'zebra.conf',
                Content: document.getElementById('tab1').value
            },
            {
                Name: 'vtysh.conf',
                Content: document.getElementById('tab2').value
            },
            {
                Name: 'ripgnd.conf',
                Content: document.getElementById('tab3').value
            },
            {
                Name: 'ripd.conf',
                Content: document.getElementById('tab4').value
            },
            {
                Name: 'pimd.conf',
                Content: document.getElementById('tab5').value
            },
            {
                Name: 'ospfd.conf',
                Content: document.getElementById('tab6').value
            },
            {
                Name: 'ospf6d.conf',
                Content: document.getElementById('tab7').value
            },
            {
                Name: 'ldpd.conf',
                Content: document.getElementById('tab8').value
            },
            {
                Name: 'bgpd.conf',
                Content: document.getElementById('tab9').value
            },
            {
                Name: 'isisd.conf',
                Content: document.getElementById('tab10').value
            },
            {
                Name: 'daemons.conf',
                Content: document.getElementById('tab11').value
            },
        ]

        let self = this;
        let frr = document.getElementById('frrName').value

        let validFrr = trimString(frr)
        if (!validFrr) {
            this.setState({ visible: true });
            return;
        }
        let params = {
            'Name': validFrr,
            'Location': document.getElementById('frrLoc').value,
            'Version': document.getElementById('frrVersion').value,
            'Description': document.getElementById('frrDesc').value,
            'FrrConfig': configs
        }
        let frrPromise = self.props.addFrr(ADD_FRR, params)

        frrPromise.then(function (value) {
            NotificationManager.success("FRR added successfully", "FRR") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "FRR") // "error!"
        })
        self.setState({ displayModel: false, visible: false, frrConfig: [] })
    }

    showEditDialogBox() {
        if (!this.state.selectedRowIndexes.length || this.state.selectedRowIndexes.length > 1) {
            alert("Please select one FRR to edit")
            return
        }
        this.setState({ displayEditModel: true })
    }

    toggleEditModal() {
        this.setState({ displayEditModel: !this.state.displayEditModel })
    }

    edittabHeading = (configs) => {
        let arr = []
        for (let i in configs) {
            arr.push(<NavItem>
                <NavLink className={classnames({ active: this.state.activeTab == i })} onClick={() => { this.toggle(i); }} >
                    {configs[i].Name}
                </NavLink>
            </NavItem>)
        }
        return arr
    }

    // edittabPanel = (configs) => {
    //     let arr = ''
    //     for (let i in configs) {
    //         let activeTab = 't' + i
    //         if (activeTab == this.state.editActiveTab) {
    //             arr = (<div>
    //                 <TabPane tabId={'t' + i}>
    //                     {console.log(configs[i].Content)}
    //                     <Input type="textarea" name="text" id={"tabEdit" + i} placeholder={configs[i].Name} defaultValue={configs[i].Content + configs[i].Id} />
    //                 </TabPane>
    //                 <Button className="custBtn" outline color="primary" onClick={() => (this.saveFRRConfig(configs[i], i))}>Save</Button>
    //             </div>)
    //         }
    //     }
    //     return arr
    // }

    editFrrModal() {
        if (this.state.displayEditModel) {

            let edittedData = this.state.data[this.state.selectedRowIndexes[0]]

            let edittabHeading = this.edittabHeading(edittedData.FrrConfig)
            // let edittabPanel = this.edittabPanel(edittedData.FrrConfig)

            return (
                <Modal isOpen={this.state.displayEditModel} toggle={() => this.toggleEditModal()} size="lg" centered="true" >
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit FRR</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md="6">Name<font color="red"><sup>*</sup></font><Input autoFocus disabled className="marTop10" value={edittedData.Name} /></Col>
                            <Col md="6">Location <Input className="marTop10" id='frrLocEdit' defaultValue={edittedData.Location} /></Col>
                            <Row>
                            </Row>
                            <Col md="6">Version <Input className="marTop10" id='frrVersionEdit' defaultValue={edittedData.Version} /></Col>
                            <Col md="6">Description <Input className="marTop10" id='frrDescEdit' defaultValue={edittedData.Description} /></Col>
                        </Row>
                        <br />
                        FRR configuration
                        <Nav tabs>
                            {edittabHeading}
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="0" >
                                <Input type="textarea" name="text" id="tab01" placeholder="add a content.." defaultValue={edittedData.FrrConfig[0].Content ? edittedData.FrrConfig[0].Content : ''} />
                            </TabPane>
                            <TabPane tabId="1" >
                                <Input type="textarea" name="text" id="tab11" placeholder="add a content.." defaultValue={edittedData.FrrConfig[1].Content ? edittedData.FrrConfig[1].Content : ''} />
                            </TabPane>
                            <TabPane tabId="2" >
                                <Input type="textarea" name="text" id="tab21" placeholder="add a content.." defaultValue={edittedData.FrrConfig[2].Content ? edittedData.FrrConfig[2].Content :''} />
                            </TabPane>
                            <TabPane tabId="3" >
                                <Input type="textarea" name="text" id="tab31" placeholder="add a content.." defaultValue={edittedData.FrrConfig[3].Content ? edittedData.FrrConfig[3].Content : '' } />
                            </TabPane>
                            <TabPane tabId="4" >
                                <Input type="textarea" name="text" id="tab41" placeholder="add a content.." defaultValue={edittedData.FrrConfig[4].Content ? edittedData.FrrConfig[4].Content : ''} />
                            </TabPane>
                            <TabPane tabId="5" >
                                <Input type="textarea" name="text" id="tab51" placeholder="add a content.." defaultValue={edittedData.FrrConfig[5].Content ? edittedData.FrrConfig[5].Content : ''} />
                            </TabPane>
                            <TabPane tabId="6" >
                                <Input type="textarea" name="text" id="tab61" placeholder="add a content.." defaultValue={edittedData.FrrConfig[6].Content ? edittedData.FrrConfig[6].Content : ''} />
                            </TabPane>
                            <TabPane tabId="7" >
                                <Input type="textarea" name="text" id="tab71" placeholder="add a content.." defaultValue={edittedData.FrrConfig[7].Content ? edittedData.FrrConfig[7].Content : ''} />
                            </TabPane>
                            <TabPane tabId="8" >
                                <Input type="textarea" name="text" id="tab81" placeholder="add a content.." defaultValue={edittedData.FrrConfig[8].Content ? edittedData.FrrConfig[8].Content : ''} />
                            </TabPane>
                            <TabPane tabId="9" >
                                <Input type="textarea" name="text" id="tab91" placeholder="add a content.." defaultValue={edittedData.FrrConfig[9].Content ? edittedData.FrrConfig[9].Content : ''} />
                            </TabPane>
                            <TabPane tabId="10" >
                                <Input type="textarea" name="text" id="tab101" placeholder="add a content.." defaultValue={edittedData.FrrConfig[10].Content ? edittedData.FrrConfig[10].Content : ''} />
                            </TabPane>
                            <TabPane tabId="11" >
                                <Input type="textarea" name="text" id="tab111" placeholder="add a content.." defaultValue={edittedData.FrrConfig[11].Content ? edittedData.FrrConfig[11].Content : ''} />
                            </TabPane>

                        </TabContent >
                    </ModalBody>
                    <ModalFooter>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.editFrr(edittedData.Id))}>Save</Button>
                        <Button className="custBtn" outline color="primary" onClick={() => (this.toggleEditModal())}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            );
        }
    }

    editFrr = (frrId) => {

        let edittedFrr = this.state.data[this.state.selectedRowIndexes[0]]

        //CODE NEEDS IMPROVISATION
        let configs = [
            {
                Id: edittedFrr.FrrConfig[0].Id,
                Name: edittedFrr.FrrConfig[0].Name,
                Content: document.getElementById('tab01').value
            },
            {
                Id: edittedFrr.FrrConfig[1].Id,
                Name: edittedFrr.FrrConfig[1].Name,
                Content: document.getElementById('tab11').value
            },
            {
                Id: edittedFrr.FrrConfig[2].Id,
                Name: edittedFrr.FrrConfig[2].Name,
                Content: document.getElementById('tab21').value
            },
            {
                Id: edittedFrr.FrrConfig[3].Id,
                Name: edittedFrr.FrrConfig[3].Name,
                Content: document.getElementById('tab31').value
            },
            {
                Id: edittedFrr.FrrConfig[4].Id,
                Name: edittedFrr.FrrConfig[4].Name,
                Content: document.getElementById('tab41').value
            },
            {
                Id: edittedFrr.FrrConfig[5].Id,
                Name: edittedFrr.FrrConfig[5].Name,
                Content: document.getElementById('tab51').value
            },
            {
                Id: edittedFrr.FrrConfig[6].Id,
                Name: edittedFrr.FrrConfig[6].Name,
                Content: document.getElementById('tab61').value
            },
            {
                Id: edittedFrr.FrrConfig[7].Id,
                Name: edittedFrr.FrrConfig[7].Name,
                Content: document.getElementById('tab71').value
            },
            {
                Id: edittedFrr.FrrConfig[8].Id,
                Name: edittedFrr.FrrConfig[8].Name,
                Content: document.getElementById('tab81').value
            },
            {
                Id: edittedFrr.FrrConfig[9].Id,
                Name: edittedFrr.FrrConfig[9].Name,
                Content: document.getElementById('tab91').value
            },
            {
                Id: edittedFrr.FrrConfig[10].Id,
                Name: edittedFrr.FrrConfig[10].Name,
                Content: document.getElementById('tab101').value
            },
            {
                Id: edittedFrr.FrrConfig[11].Id,
                Name: edittedFrr.FrrConfig[11].Name,
                Content: document.getElementById('tab111').value
            }
        ]
        let self = this

        let params = {
            'Id': frrId,
            'Location': document.getElementById('frrLocEdit').value ? document.getElementById('frrLocEdit').value : "-",
            'Version': document.getElementById('frrVersionEdit').value ? document.getElementById('frrVersionEdit').value : "-",
            'Description': document.getElementById('frrDescEdit').value ? document.getElementById('frrDescEdit').value : "-",
            'FrrConfig': configs
        }

        let frrPromise = self.props.updateFrr(UPDATE_FRR, params)

        frrPromise.then(function (value) {
            NotificationManager.success("FRR updated successfully", "FRR") // "Success!"
        }).catch(function (e) {
            console.warn(e)
            NotificationManager.error("Something went wrong", "FRR") // "error!"
        })
        this.setState({ displayEditModel: false, selectedRowIndexes: [], showDelete: false })
    }

    setFrrHeadings = (headings) => {
        this.props.setFrrHeadings(I.fromJS(headings))
    }

    render() {
        return (
            <div>
                <Media className="tableTitle">
                    <Media body>
                        <div className="padTop5">FRR</div>
                    </Media>
                    <Media right>
                        <div className='marginLeft10'>
                            <Button onClick={() => (this.cancel())} className="custBtn animated fadeIn marginLeft13N" outline color="secondary">New</Button>
                            <Button onClick={() => (this.showEditDialogBox())} className="custBtn animated fadeIn">Edit</Button>
                            {this.showDeleteButton()}
                        </div>
                    </Media>
                </Media>
                <div style={{ height: '200px' }}>
                    <SummaryDataTable
                        maxContainerHeight={200}
                        heading={this.state.frrHead}
                        data={this.state.data}
                        checkBoxClick={this.checkBoxClick}
                        constHeading={frrHead}
                        setHeadings={this.setFrrHeadings}
                        selectedRowIndexes={this.state.selectedRowIndexes}
                        tableName={"frrTable"} />
                </div>
                {this.addFrrModal()}
                {this.editFrrModal()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.frrReducer.get('frr'),
        frrHeadings: state.frrReducer.getIn(['frrHeadings'])
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getFrr: (url) => dispatch(getFrr(url)),
        addFrr: (url, params) => dispatch(addFrr(url, params)),
        updateFrr: (url, params) => dispatch(updateFrr(url, params)),
        deleteFrrs: (url, params) => dispatch(deleteFrrs(url, params)),
        setFrrHeadings: (params) => dispatch(setFrrHeadings(params))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Frr);
