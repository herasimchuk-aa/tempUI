import React, { Component } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2'
import { TextCell, TextCellForArray, BadgeCell, ValidationCell, CollapseCell, GetFirstValueCell, ProvisionCell, List, BooleanCell } from './Cells';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import { Input, Popover, PopoverBody } from 'reactstrap';
import Dimensions from 'react-dimensions'
import '../../views.css'

var widthOffset = window.innerWidth < 680 ? 0 : 290;
const containerWidth = window.innerWidth - widthOffset;
const rowHeight = 50
const headerHeight = 50
const POPOVER_PLACEMENT = "bottom-end"



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
            // collapsedRows: new Set(),
            showCollapse: false,
            height: 0
        };
        this.counter = 0;
        this.constHeading = props.constHeading

    }

    static defaultProps = {
        maxContainerHeight: (window.innerHeight - 300),
        showCheckBox: true

    }

    static getDerivedStateFromProps(props, state) {
        return {
            data: props.data,
            heading: props.heading,
            selectedRowIndexes: props.selectedRowIndexes,
            selectEntireRow: props.selectEntireRow,
            showCollapse: props.showCollapse,
            tableName: props.tableName,
            maxContainerHeight: props.maxContainerHeight
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
        const { collapsedRows, data } = this.state;
        // const shallowCopyOfCollapsedRows = new Set([...collapsedRows]);

        let scrollToRow = rowIndex;
        let sameExpandRowClick = false
        // if (shallowCopyOfCollapsedRows.has(rowIndex)) {
        //     shallowCopyOfCollapsedRows.delete(rowIndex);
        //     scrollToRow = null
        // } else {
        //     shallowCopyOfCollapsedRows.add(rowIndex);
        // }
        //height of the table 
        if (this.state.collapsedRows == rowIndex) {
            sameExpandRowClick = true
        }
        let dataLen = 0
        if (data && data.length) {
            dataLen = data.length
        }
        let tableHeight = rowHeight * (dataLen) + headerHeight + 2

        //height of the expanded row
        let ExpanDataLen = 0
        if (data[rowIndex] && data[rowIndex].interfaces && data[rowIndex].interfaces.length) {
            ExpanDataLen = data[rowIndex].interfaces.length
        }
        let expandedRowHeight = rowHeight * (ExpanDataLen - 1)

        // if (this.state.collapsedRows == rowIndex) {
        //     sameExpandRowClick = true
        //     expandedRowHeight = rowHeight
        // }

        //total height of the table
        let totalTableheight = tableHeight + expandedRowHeight

        this.setState({
            scrollToRow: scrollToRow,
            height: collapsedRows == rowIndex ? tableHeight : totalTableheight,

            collapsedRows: this.state.collapsedRows == rowIndex ? -1 : rowIndex
        });
    }

    _subRowHeightGetter = (rowIndex) => {
        if (this.state.collapsedRows == rowIndex) {
            let { data } = this.state
            let expandedRow = data[rowIndex]
            let dataLen = 0
            if (expandedRow && expandedRow.interfaces && expandedRow.interfaces.length) {
                dataLen = expandedRow.interfaces.length
            }
            return (dataLen - 1) * rowHeight
        }
        return 0
    }

    _rowExpandedGetter = ({ rowIndex, width, height, props = this.props }) => {
        if (this.state.collapsedRows != rowIndex) {
            return null;
        } else {
            const style = {
                height: height,
                width: width - 2,
            };
            let { heading } = this.props
            let { columnWidths, data } = this.state

            let expandedRow = data[rowIndex]
            let dataLen = 0
            if (expandedRow && expandedRow.interfaces && expandedRow.interfaces.length) {
                dataLen = expandedRow.interfaces.length
            }
            this.totalheight = this.totalheight + rowHeight * (dataLen)

            let tableHeight = rowHeight * (dataLen)
            let tableWidth = this.props.containerWidth
            if (!heading || !heading.length)
                return []
            let columnsList = []
            let self = this
            heading.map(function (header) {
                let headName = header.displayName
                let id = header.id
                let operation = header.operation;

                let cellValue = self.getInternalCellValue(operation, expandedRow)
                columnsList.push(
                    <Column
                        columnKey={id}
                        header={<Cell></Cell>}
                        cell={cellValue}
                        flexGrow={1}
                        width={columnWidths[id] ? columnWidths[id] : 50}
                        isResizable={header.isResizable}
                    />
                )
            })

            return (
                <div style={style}>
                    <div style={{
                        backgroundColor: 'transparent',
                        padding: '10px',
                        width: '100%',
                        height: '100%',
                        marginLeft: '8px'
                    }}>
                        <Table
                            className="tableBorderNone"
                            rowHeight={rowHeight}
                            headerHeight={0}

                            rowsCount={dataLen - 1}
                            width={tableWidth}
                            height={this.state.tableHeight ? this.state.tableHeight : tableHeight}
                            isColumnResizing={false}
                            {...props}>
                            {columnsList}
                        </Table>
                    </div>
                </div >
            );
        }
    }

    drawtable = (props = this.props) => {
        let { data, scrollToRow, maxContainerHeight } = this.state
        let columns = this.drawColumns()
        let dataLen = 0
        if (data && data.length) {
            dataLen = data.length
        }
        let tableHeight = rowHeight * (dataLen) + headerHeight + 2
        let tableWidth = this.props.containerWidth
        let totalheight = Math.min(maxContainerHeight, tableHeight)
        return (
            <div>
                <div style={{ float: "right" }} id={props.tableName}></div>
                <Table
                    className="tableOutlineNone"
                    scrollToRow={scrollToRow}
                    rowHeight={rowHeight}
                    headerHeight={headerHeight}
                    rowsCount={dataLen}
                    subRowHeightGetter={this._subRowHeightGetter}
                    rowExpanded={this._rowExpandedGetter}
                    width={tableWidth}
                    height={this.state.height ? this.state.height : totalheight}
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
        let { heading } = this.state
        let { collapsedRows, data } = this.state
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
                cell={<CollapseCell callback={self._handleCollapseClick} collapsedRows={collapsedRows} data={data} />}
                fixed={true}
                width={30}
            />)
        }
        heading.map(function (header) {
            if (header.showDefault !== false) {
                let headName = header.displayName
                let id = header.id
                let operation = header.operation;
                let connectivityRow = self.state.showCollapse
                let cellValue = self.getCellValue(operation, connectivityRow)
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
            }
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
                            if (heading[i] && heading[i].id === item.id && heading[i].showDefault !== false) {
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
        heading = heading.filter(function (a) {
            return a.showDefault !== false
        })
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
                    col.showDefault = true
                    heading.splice(j, 0, col)
                    break
                }
            }
        }

        this.props.setHeadings(heading)
        // this.setState({
        //     heading: heading
        // })
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

    drawPopOver = (props = this.props) => {
        if (!this.state.popoverOpen)
            return null
        return (
            <div ref={this.wrapperRef}>
                <Popover placement={POPOVER_PLACEMENT}
                    container={document.getElementById(props.tableName)}
                    isOpen={this.state.popoverOpen} target={props.tableName} toggle={this.contextMenu}>
                    <PopoverBody>
                        {this.drawColumnSelection()}
                    </PopoverBody>
                </Popover>
            </div>)
    }
    getInternalCellValue = (operation, expandedRow) => {

        let { data } = this.state
        let value = null
        switch (operation) {
            case "array":
                value = ''
                break
            case "interfaceArray":
                value = <TextCellForArray data={data} expandedrow={expandedRow} identity={'interfaces'} />
                break
            case "ipArray":
                value = <TextCellForArray data={data} expandedrow={expandedRow} identity={'ip'} />
                break
            case "connectedToArray":
                value = <TextCellForArray data={data} expandedrow={expandedRow} identity={'connectedTo'} />
                break
            case "adminStateArray":
                value = <TextCellForArray data={data} expandedrow={expandedRow} identity={'adminState'} />
                break
            case "linkArray":
                value = <TextCellForArray data={data} expandedrow={expandedRow} identity={'link'} />
                break
            case "lldpArray":
                value = <TextCellForArray data={data} expandedrow={expandedRow} identity={'lldp'} />
                break
            default:
                value = ''
                break
        }
        return value
    }

    getCellValue = (operation, connectivityRow) => {
        let { data } = this.state
        let value = null

        switch (operation) {
            case "array":
                value = <TextCellForArray data={data} identity={'roles'} />
                break
            case "interfaceArray":
                value = <GetFirstValueCell data={data} connectivityrow={connectivityRow} identity={'interfaces'} />
                break
            case "ipArray":
                value = <GetFirstValueCell data={data} connectivityrow={connectivityRow} identity={'ip'} />
                break
            case "connectedToArray":
                value = <GetFirstValueCell data={data} connectivityrow={connectivityRow} identity={'connectedTo'} />
                break
            case "linkArray":
                value = <GetFirstValueCell data={data} connectivityrow={connectivityRow} identity={'link'} />
                break
            case "lldpArray":
                value = <GetFirstValueCell data={data} connectivityrow={connectivityRow} identity={'lldp'} />
                break
            case 'validateKernel':
                value = <ValidationCell data={data} match={'IsKernelMatched'} field={'kernel'} />
                break
            case 'validateISO':
                value = <ValidationCell data={data} match={'IsBaseISOMatched'} field={'BaseISO'} />
                break


            case 'validateLLDP':
                value = <ValidationCell data={data} match={'IsLldpMatched'} field={'LldpVersion'} />
                break
            case 'validateEthtool':
                value = <ValidationCell data={data} match={'IsEthtoolMatched'} field={'EthtoolVersion'} />
                break
            case 'validateFRR':
                value = <ValidationCell data={data} match={'IsFrrMatched'} field={'FrrVersion'} />
                break
            case 'validateIpRoute2':
                value = <ValidationCell data={data} match={'IsIprouteMatched'} field={'IprouteVersion'} />
                break


            case 'validateType':
                value = <ValidationCell data={data} match={'IsTypeMatched'} field={'Type'} />
                break
            case 'validateSN':
                value = <ValidationCell data={data} match={'IsSNMatched'} field={'SerialNumber'} />
                break
            case 'badge':
                value = <BadgeCell data={data} />
                break
            case "provision":
                value = <ProvisionCell data={data} />
                break
            case "list":
                value = <List data={data} />
                break
            case "boolean":
                value = <BooleanCell data={data} />
                break

            default:
                value = <TextCell data={data} />
                break
        }
        return value
    }


}



export default Dimensions()(SummaryDataTable);