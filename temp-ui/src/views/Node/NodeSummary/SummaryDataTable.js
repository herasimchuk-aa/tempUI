import React, { Component } from 'react';
import { Table, Column, Cell } from 'fixed-data-table-2'
import { TextCell, TextCellForArray, BadgeCell, ValidationCell } from './Cells';
import 'fixed-data-table-2/dist/fixed-data-table.css';
import { Input, Popover, PopoverBody } from 'reactstrap';

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
            columnWidths: {}
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
        }
    }

    render() {
        return (
            <div>
                <div id="popoverContainer">
                    {this.drawPopOver()}
                    {this.drawtable()}
                </div>
            </div>
        );
    }

    drawtable = (props = this.props) => {
        let { data } = this.state
        let columns = this.drawColumns()
        let dataLen = 0
        if (data && data.length) {
            dataLen = data.length
        }
        let tableHeight = rowHeight * (dataLen) + headerHeight + 2
        return (
            <div>
                <div style={{ float: "right" }} id={'popoverPlacementDiv'}></div>
                <Table
                    className="tableOutlineNone"
                    rowHeight={rowHeight}
                    headerHeight={headerHeight}
                    rowsCount={dataLen}
                    width={containerWidth}
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
        heading.map(function (header) {
            let headName = header.displayName
            let id = header.id
            let operation = header.operation;
            let cellValue = self.getCellValue(operation)
            columns.push(
                <Column
                    columnKey={id}
                    header={<Cell key={headName} id={id} onContextMenu={self.contextMenu}>{headName}</Cell>}
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


    getCellValue = (operation) => {
        let { data } = this.state
        let value = null
        switch (operation) {
            case "array":
                value = <TextCellForArray data={data} />
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

export default SummaryDataTable;