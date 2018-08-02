import React from 'react';
import { Col, Row, Input, Popover, PopoverBody, Badge, UncontrolledTooltip } from 'reactstrap';

const POPOVER_PLACEMENT = "auto"
export default class SummaryDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            heading: [],
            selectedRowIndexes: [],
            selectEntireRow: false,
            popoverOpen: false
        };
        this.counter = 0;
        this.constHeading = JSON.parse(JSON.stringify(props.heading))
    }

    static defaultProps = {
        showCheckBox: true,

    }

    static getDerivedStateFromProps(props, state) {
        return {
            data: props.data,
            heading: props.heading,
            selectedRowIndexes: props.selectedRowIndexes,
            selectEntireRow: props.selectEntireRow,
            // showEditButton: props.showEditButton
        }
    }

    drawHeader(props = this.props) {
        let headNames = [];
        this.state.heading.map((item) => (headNames.push(<Col sm={item.colSize} className="head-name">{item.displayName}</Col>)));
        let tableSize = 12

        if (props.showCheckBox) {
            tableSize = 11
        }
        // if (props.showEditButton) {
        //     tableSize = 10
        // }
        return (
            <Row className="headerRow cursor-pointer" id={'Popover-' + POPOVER_PLACEMENT} onClick={this.handleClick} onContextMenu={this.contextMenu}>
                <Col sm="1" className="head-name"></Col>
                <Col sm={tableSize} className="head-name" >
                    <Row>
                        {headNames}
                    </Row>
                </Col>

            </Row>
        )
    }

    handleClick = (event) => {
        const { popoverOpen } = this.state;
        if (popoverOpen) this.setState({ popoverOpen: false, });

    }

    contextMenu = (e) => {
        if (!e) {
            return
        }
        e.preventDefault();
        this.setState({
            popoverOpen: !this.state.popoverOpen
        })
    }

    drawColumnSelection = () => {
        let { constHeading } = this
        let { heading } = this.state
        if (!constHeading || !constHeading.length)
            return null
        let self = this

        return (
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                {
                    constHeading.map(function (item) {
                        let showTick = false
                        for (let i in heading) {
                            if (heading[i] && heading[i].id === item.id) {
                                showTick = true
                                break
                            }
                        }
                        return (<div style={{ display: 'flex', cursor: 'pointer' }} onClick={(e) => self.columnSelectionClick(e, item)}>
                            <div style={{ padding: '5px', width: '20px' }}>{showTick && <i style={{ color: '#a4b7c1' }} className="fa fa-check" aria-hidden="true"></i>}</div>
                            <div style={{ padding: '5px', color: 'black' }}>{item.displayName}</div></div>)
                    })
                }
            </div>
        )

    }

    columnSelectionClick = (e, col) => {
        let { heading } = this.state
        let selectedIndex = -1
        if (!heading) {
            heading = []
        }
        for (let i in heading) {
            if (heading[i] && heading[i].id === col.id) {
                selectedIndex = i
                break
            }
        }
        if (selectedIndex > -1) {
            heading.splice(selectedIndex, 1)
        } else {
            let { constHeading } = this
            for (let j in constHeading) {
                if (constHeading[j] && constHeading[j].id === col.id) {
                    heading.splice(j, 0, col)
                    break
                }
            }
        }
        this.setState({
            heading: heading
        })
    }


    drawPopOver = () => {
        return (
            <div ref={this.wrapperRef}>
                <Popover placement={POPOVER_PLACEMENT} isOpen={this.state.popoverOpen} target={'Popover-' + POPOVER_PLACEMENT} toggle={this.contextMenu}>
                    <PopoverBody>
                        {this.drawColumnSelection()}
                    </PopoverBody>
                </Popover></div>)
    }

    getValue = (key, data, operation, rowIndex) => {
        let value = []
        switch (operation) {
            case "array":
                if (data.hasOwnProperty(key)) {
                    let arr = data[key]
                    if (arr && arr.length) {
                        let str = ''
                        arr.map((val, index) => {
                            if (index == arr.length - 1) {
                                str += val
                            }
                            else {
                                str += val + ','
                            }
                        })
                        value = str
                    }
                    if (value == "") {
                        value = '-'
                    }
                }
                break
            case 'validateKernel': {
                let color;
                if (data[key] && data.validationStatus) {
                    if (data.validationStatus && data.validationStatus.isKernelMatched) {
                        color = 'black';
                    }
                    else {
                        color = 'red';
                        if (data.validationStatus.kernel)
                            value.push(<UncontrolledTooltip placement="top" target={key + rowIndex}>{data.validationStatus.kernel}</UncontrolledTooltip>)
                    }
                }
                value.push(<font id={key + rowIndex} color={color}>{data[key]}</font>)
            }

                break
            case 'validateISO': {
                let color;
                if (data[key] && data.validationStatus) {
                    if (data.validationStatus && data.validationStatus.isBaseISOMatched) {
                        color = 'black';
                    }
                    else {
                        color = 'red';
                        if (data.validationStatus.baseISO)
                            value.push(<UncontrolledTooltip placement="top" target={key + rowIndex}>{data.validationStatus.baseISO}</UncontrolledTooltip>)
                    }
                }
                value.push(<font id={key + rowIndex} color={color}>{data[key]}</font>)
            }

                break
            case 'validateType': {
                let color;
                if (data[key] && data.validationStatus) {
                    if (data.validationStatus && data.validationStatus.isTypeMatched) {
                        color = 'black';
                    }
                    else {
                        color = 'red';
                        if (data.validationStatus.type)
                            value.push(<UncontrolledTooltip placement="top" target={key + rowIndex}>{data.validationStatus.type}</UncontrolledTooltip>)
                    }
                }
                value.push(<font id={key + rowIndex} color={color}>{data[key]}</font>)
            }

                break
            case 'validateSN': {
                let color;
                if (data[key] && data.validationStatus) {
                    if (data.validationStatus && data.validationStatus.isSNMatched) {
                        color = 'black';
                    }
                    else {
                        color = 'red';
                        if (data.validationStatus.serialNumber)
                            value.push(<UncontrolledTooltip placement="top" target={key + rowIndex}>{data.validationStatus.serialNumber}</UncontrolledTooltip>)
                    }
                }
                value.push(<font id={key + rowIndex} color={color}>{data[key]}</font>)
            }

                break
            case 'badge': {
                if (data[key] == "Mismatch") {
                    value = (<Badge color="danger">{data[key]}</Badge>)
                }
                else {
                    value = data[key]
                }
                break
            }
            default:
                value = data[key]
                break
        }
        if (!value) {
            value = "-"
        }
        return value
    }


    drawtable(props = this.props) {
        let { data, selectedRowIndexes } = this.state
        let rows = []
        let checkBoxColumn = null
        let editButtonColumn = null
        let tableSize = 12
        let header = this.drawHeader()
        rows.push(header)
        let self = this
        if (data && data.length) {
            let colHeader = this.state.heading
            data.map(function (datum, rowIndex) {
                if (datum && Object.keys(datum).length) {
                    let rowClassName = 'headerRow1'

                    if (rowIndex % 2 === 0) {
                        rowClassName = 'headerRow2'
                    }
                    if (rowIndex == data.length - 1) {
                        rowClassName += ' headerRow3 '
                    }

                    // if (props.showCheckBox) {
                    //     tableSize = 11
                    //     checkBoxColumn = (
                    //         <Col sm="1" className="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    //             <Input key={datum.name ? datum.name + '_' + rowIndex : datum.label + '_' + rowIndex} style={{ cursor: 'pointer' }}
                    //                 type="checkbox" onChange={() => (self.checkBoxClick(rowIndex))} defaultChecked={selectedRowIndexes && selectedRowIndexes.length && selectedRowIndexes.indexOf(rowIndex) > -1 ? true : false} />
                    //         </Col>)
                    // }

                    // if(props.showEditButton) {
                    //         editButtonColumn = (
                    //             <Col sm="1">
                    //                 <i className="fa fa-pencil" aria-hidden="true" onClick={() => (self.toggleModel(rowIndex))}></i>
                    //             </Col>
                    //         )
                    // }

                    let columns = []
                    colHeader.map(function (header) {
                        let key = header.id
                        let operation;
                        if (header.operation) {
                            operation = header.operation;
                        }
                        let value = self.getValue(key, datum, operation, rowIndex)


                        if (props.showCheckBox) {
                            tableSize = 11
                            checkBoxColumn = (
                                <Col sm="1" className="" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Input key={self.counter++} style={{ cursor: 'pointer' }}
                                        type="checkbox" onChange={() => (self.checkBoxClick(rowIndex))} defaultChecked={selectedRowIndexes && selectedRowIndexes.length && selectedRowIndexes.indexOf(rowIndex) > -1 ? true : false} />
                                </Col>)
                        }

                        columns.push(<Col sm={header.colSize ? header.colSize : 1} className="pad"> {value}</Col>)
                    })
                    var row;
                    if (props.selectEntireRow) {
                        row = (<Row className={rowClassName} >
                            {checkBoxColumn}
                            <Col sm="11" className="pad break-word" style={{ cursor: 'pointer' }} onClick={() => self.checkBoxClick(rowIndex, true)} >
                                <Row>
                                    {columns}
                                </Row>
                            </Col>
                            {/* {editButtonColumn} */}
                        </Row>)
                    }
                    else {
                        row = (<Row className={rowClassName} >
                            {checkBoxColumn}
                            <Col sm={tableSize} className="pad break-word">
                                <Row>
                                    {columns}
                                </Row>
                            </Col>
                            {/* {editButtonColumn} */}
                        </Row>)
                    }
                    rows.push(row)
                }
            })
        }
        return rows
    }

    checkBoxClick = (rowIndex, singleRowClick) => {
        this.props.checkBoxClick(rowIndex, singleRowClick)
    }

    // toggleModel = (rowIndex) => {
    //     this.props.toggleModel(rowIndex)
    // }

    render() {
        return (
            <div >
                {this.drawtable()}
                {this.drawPopOver()}
            </div>
        );
    }
}
