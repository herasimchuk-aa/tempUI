import React, { Component } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2'
import { TextCell, TextCellForArray, BadgeCell, ValidationCell, CollapseCell } from './Cells';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import {
    Input, Popover, PopoverBody, Row, Col, ListGroup,
    ListGroupItem
} from 'reactstrap';
import Dimensions from 'react-dimensions'
import '../../views.css'

var widthOffset = window.innerWidth < 680 ? 0 : 290;
const containerWidth = window.innerWidth - widthOffset;
const containerHeight = window.innerHeight - 300;
const rowHeight = 50
const headerHeight = 50
const POPOVER_PLACEMENT = "top"



class SummaryDataTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            heading: [],
            selectedRowIndexes: [],
            selectEntireRow: false,
            popoverOpen: false,
            columnWidths: {},
            scrollToRow: null,
            collapsedRows: new Set(),
            showCollapse: false
        };
        this.counter = 0;
        this.constHeading = JSON.parse(JSON.stringify(props.heading))

    }

    static defaultProps = {
        showCheckBox: true
    }

    static getDerivedStateFromProps(props, state) {
        return {
            data: props.data,
            heading: props.heading,
            selectedRowIndexes: props.selectedRowIndexes,
            selectEntireRow: props.selectEntireRow,
            // showEditButton: props.showEditButton
            showCollapse: props.showCollapse
        }
    }

    render() {
        return (
            <div>
                <div id="popoverContainer" className="marBot5pc">
                    {this.drawPopOver()}
                    {this.drawtable()}
                </div>
            </div>
        );
    }

    _handleCollapseClick = (rowIndex) => {
        const { collapsedRows } = this.state;
        const shallowCopyOfCollapsedRows = new Set([...collapsedRows]);
        let scrollToRow = rowIndex;
        if (shallowCopyOfCollapsedRows.has(rowIndex)) {
            shallowCopyOfCollapsedRows.delete(rowIndex);
            scrollToRow = null
        } else {
            shallowCopyOfCollapsedRows.add(rowIndex);
        }

        this.setState({
            scrollToRow: scrollToRow,
            collapsedRows: shallowCopyOfCollapsedRows
        });
    }

    _subRowHeightGetter = (index) => {

        return this.state.collapsedRows.has(index) ? 100 : 0;
    }

    _rowExpandedGetter = ({ rowIndex, width, height, props = this.props }) => {
        if (!this.state.collapsedRows.has(rowIndex)) {
            return null;
        }
        const style = {
            height: height,
            width: width - 2,
        };
        let { heading } = this.props
        let { columnWidths, data } = this.state

        let expandedRow = data[rowIndex]
        // console.log(rowIndex)
        // let dataLen = 0
        // if (expandedRow && expandedRow.length) {
        //     dataLen = expandedRow.length
        // }

        // let tableHeight = rowHeight * (dataLen) + headerHeight + 2
        // let tableWidth = this.props.containerWidth
        // if (!heading || !heading.length)
        //     return []
        // let columnsList = []
        // let self = this

        // heading.map(function (header) {
        //     let headName = header.displayName
        //     let id = header.id
        //     let operation = header.operation;
        //     let cellValue = self.getCellValue(operation, expandedRow)
        //     columnsList.push(
        //         <Column

        //             columnKey={id}
        //             header={<Cell>{cellValue}</Cell>}
        //             cell={<Cell >check</Cell>}

        //             width={100}
        //         />
        //     )
        // })

        let interfaceList = expandedRow.interfaces.map((interfaceItem) => {
            return (
                <ListGroup><ListGroupItem className="visibleOnHover">{interfaceItem.Name ? interfaceItem.Name : '-'}</ListGroupItem></ListGroup>
            )
        })

        let ipList = expandedRow.interfaces.map((interfaceItem) => {
            return (
                <ListGroup><ListGroupItem className="visibleOnHover">{interfaceItem.Ip_address ? interfaceItem.Ip_address : '-'}</ListGroupItem></ListGroup>
            )
        })

        let connectedToList = expandedRow.interfaces.map((interfaceItem) => {
            return (
                <ListGroup><ListGroupItem className="visibleOnHover">{interfaceItem.Remote_node_name && interfaceItem.Remote_interface ? interfaceItem.Remote_node_name + interfaceItem.Remote_interface : '-'}</ListGroupItem></ListGroup>
            )
        })

        let Admin_stateList = expandedRow.interfaces.map((interfaceItem) => {
            return (
                <ListGroup><ListGroupItem className="visibleOnHover">{interfaceItem.Admin_state}</ListGroupItem></ListGroup>
            )
        })
        let Link_statusList = expandedRow.interfaces.map((interfaceItem) => {
            return (
                <ListGroup><ListGroupItem className="visibleOnHover">{interfaceItem.Link_status}</ListGroupItem></ListGroup>
            )
        })
        let Lldp_matchedList = expandedRow.interfaces.map((interfaceItem) => {
            return (
                <ListGroup><ListGroupItem className="visibleOnHover">{interfaceItem.Lldp_matched}</ListGroupItem></ListGroup>
            )
        })
        let Interface_alarmList = expandedRow.interfaces.map((interfaceItem) => {
            return (
                <ListGroup><ListGroupItem className="visibleOnHover">{interfaceItem.Interface_alarm ? interfaceItem.Interface_alarm : '-'}</ListGroupItem></ListGroup>
            )
        })

        return (
            <div style={style}>
                <div style={{
                    backgroundColor: 'transparent',
                    padding: '10px',
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    marginLeft: '30px'
                }}>

                    {/* <Table
                        className="tableOutlineNone"
                        rowHeight={rowHeight}
                        headerHeight={50}
                        rowsCount={dataLen}
                        width={tableWidth}
                        height={Math.min(containerHeight, tableHeight)}
                        isColumnResizing={false}
                        {...props}>
                        {columnsList}
                    </Table> */}
                    <Row>
                        <Col></Col>
                        <Col></Col>
                        <Col></Col>
                        <Col></Col>
                        <Col>
                            {interfaceList}
                        </Col>
                        <Col>
                            {ipList}
                        </Col>
                        <Col>
                            {connectedToList}
                        </Col>
                        <Col>
                            {Admin_stateList}
                        </Col>
                        <Col>
                            {Link_statusList}
                        </Col>
                        <Col>
                            {Lldp_matchedList}
                        </Col>
                        <Col>
                            {Interface_alarmList}
                        </Col>
                    </Row>
                </div>
            </div >

        );
    }

    drawtable = (props = this.props) => {
        let { data, collapsedRows } = this.state
        let columns = this.drawColumns()
        let dataLen = 0
        if (data && data.length) {
            dataLen = data.length
        }
        let tableHeight = rowHeight * (dataLen) + headerHeight + 2
        let tableWidth = this.props.containerWidth
        return (
            <div>
                <div style={{ float: "right" }} id={'popoverPlacementDiv'}></div>
                <Table
                    className="tableOutlineNone"
                    rowHeight={rowHeight}
                    headerHeight={headerHeight}
                    rowsCount={dataLen}
                    subRowHeightGetter={this._subRowHeightGetter}
                    rowExpanded={this._rowExpandedGetter}
                    width={tableWidth}
                    height={Math.min(containerHeight, tableHeight)}
                    rowClassNameGetter={(rowIndex) => "cursor-pointer"}
                    onRowDoubleClick={(e, rowIndex) => this.checkBoxClick(rowIndex, true)}
                    onColumnResizeEndCallback={this._onColumnResizeEndCallback}
                    isColumnResizing={false}
                    {...props}>

                    {columns}
                </Table>
            </div>
        )
    }

    _onColumnResizeEndCallback = (newColumnWidth, columnKey) => {
        this.setState(({ columnWidths }) => ({
            columnWidths: {
                ...columnWidths,
                [columnKey]: newColumnWidth,
            }
        }));
    }

    drawColumns = (props = this.props) => {
        let { heading } = this.props
        let { collapsedRows } = this.state
        if (!heading || !heading.length)
            return []
        let columns = []
        let self = this
        let { selectedRowIndexes, columnWidths } = this.state
        if (props.showCheckBox) {
            columns.push(
                <Column
                    columnKey={"checkBoxColumn"}
                    cell={({ rowIndex, width, height }) => (
                        <Cell width={50} align="right">
                            <Input key={self.counter++} style={{ cursor: 'pointer' }}
                                type="checkbox" onChange={() => (self.checkBoxClick(rowIndex))} defaultChecked={selectedRowIndexes
                                    && selectedRowIndexes.length && selectedRowIndexes.indexOf(rowIndex) > -1 ? true : false} />
                        </Cell>
                    )}
                    width={50}
                />
            )
        }
        if (self.state.showCollapse) {
            columns.push(<Column
                cell={<CollapseCell callback={self._handleCollapseClick} collapsedRows={collapsedRows} />}
                fixed={true}
                width={30}
            />)
        }
        heading.map(function (header) {
            let headName = header.displayName
            let id = header.id
            let operation = header.operation;
            let cellValue = self.getCellValue(operation)
            columns.push(
                <Column
                    columnKey={id}
                    header={<Cell style={{ cursor: 'pointer' }} key={headName} id={id} onContextMenu={self.contextMenu} onClick={self.closePopover}>{headName}</Cell>}
                    cell={cellValue}
                    flexGrow={1}
                    width={columnWidths[id] ? columnWidths[id] : 50}
                    isResizable={header.isResizable}
                />
            )
        })
        return columns

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

    checkBoxClick = (rowIndex, singleRowClick) => {
        this.props.checkBoxClick(rowIndex, singleRowClick)
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

    closePopover = () => {
        this.setState({ popoverOpen: false })
    }

    drawPopOver = () => {
        if (!this.state.popoverOpen)
            return null
        return (
            <div ref={this.wrapperRef}>
                <Popover placement={'top-end'} hideArrow={false}
                    container={document.getElementById('popoverPlacementDiv')}
                    isOpen={this.state.popoverOpen} target={'popoverPlacementDiv'} toggle={this.contextMenu}>
                    <PopoverBody>
                        {this.drawColumnSelection()}
                    </PopoverBody>
                </Popover>
            </div>)
    }


    getCellValue = (operation, rowdata) => {
        let { data } = this.state
        let value = null
        switch (operation) {
            case "array":
                value = <TextCellForArray data={data} identity={'roles'} />
                break
            case "interfaceArray":
                value = <TextCellForArray data={data} rowData={rowdata} identity={'interfaces'} />
                break
            case "ipArray":
                value = <TextCellForArray data={data} rowData={rowdata} identity={'ip'} />
                break
            case "connectedToArray":
                value = <TextCellForArray data={data} rowData={rowdata} identity={'connectedTo'} />
                break
            case "adminStateArray":
                value = <TextCellForArray data={data} rowData={rowdata} identity={'adminState'} />
                break
            case "linkArray":
                value = <TextCellForArray data={data} rowData={rowdata} identity={'link'} />
                break
            case "lldpArray":
                value = <TextCellForArray data={data} rowData={rowdata} identity={'lldp'} />
                break
            case 'validateKernel':
                value = <ValidationCell data={data} match={'isKernelMatched'} field={'kernel'} />
                break
            case 'validateISO':
                value = <ValidationCell data={data} match={'isBaseISOMatched'} field={'baseISO'} />
                break
            case 'validateType':
                value = <ValidationCell data={data} match={'isTypeMatched'} field={'type'} />
                break
            case 'validateSN':
                value = <ValidationCell data={data} match={'isSNMatched'} field={'serialNumber'} />
                break
            case 'badge':
                value = <BadgeCell data={data} />
                break
            default:
                value = <TextCell data={data} />
                break
        }
        return value
    }


}



export default Dimensions()(SummaryDataTable);