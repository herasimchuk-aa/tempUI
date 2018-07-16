import React from 'react';
import { Col, Row, Input } from 'reactstrap';
import { Button } from 'reactstrap';

export default class SummaryDataTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            selectedRowIndexes: []
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {
            nodes: props.nodes,
            selectedRowIndexes : props.selectedRowIndexes
        }
    }

    drawHeader() {
        return (
            <Row className="headerRow">
                <Col sm="1" className="head-name"></Col>
                <Col sm="10" className="head-name" >
                    <Row>
                        <Col sm="2" className="head-name">Name</Col>
                        <Col sm="1" className="head-name">Site</Col>
                        <Col sm="1" className="head-name">Status</Col>
                        <Col sm="1" className="head-name">Roles</Col>
                        <Col sm="1" className="head-name">Type</Col>
                        <Col sm="2" className="head-name">Serial Number</Col>
                        <Col sm="2" className="head-name">Linux Kernel</Col>
                        <Col sm="2" className="head-name">Base Linux ISO</Col>
                    </Row>
                </Col>
                <Col sm="1" className="head-name"><Button color="link"><i className="fa fa-plus fa-lg" aria-hidden="true"></i></Button></Col>
            </Row>
        )
    }

    drawtable() {
        let { nodes,selectedRowIndexes } = this.state
        let rows = []
        let header = this.drawHeader()
        rows.push(header)
        if (nodes && nodes.length) {
            let roles = nodes;
            roles.map((role, i) => {
                let row1 = 'headerRow1'

                if (i % 2 === 0) {
                    row1 = 'headerRow2'
                }
                if (i == roles.length - 1) {
                    row1 =  row1 +' headerRow3 '
                }
                let row = (<Row className={row1 } >
                    <Col sm="1" className="pad" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <Input  id={role.serialNumber} style={{ cursor: 'pointer' }} value={role.serialNumber} 
                        type="checkbox" className="" onChange={() => (this.checkBoxClick(i))} defaultChecked={selectedRowIndexes && selectedRowIndexes.length &&selectedRowIndexes.indexOf(i) > -1 ? true : false}/>
                    </Col>
                    <Col sm="10" className="pad" style={{ cursor: 'pointer' }} onClick={() => this.checkBoxClick(i, true)} >
                        <Row>
                            <Col sm="2" className="pad">{role.name}</Col>
                            <Col sm="1" className="pad">{role.site ? role.site : '-'}</Col>
                            <Col sm="1" className="pad">-</Col>
                            <Col sm="1" className="pad">-</Col>
                            <Col sm="1" className="pad">{role.nodeType}</Col>
                            <Col sm="2" className="pad">{role.serialNumber}</Col>
                            <Col sm="2" className="pad">{role.kernel}</Col>
                            <Col sm="2" className="pad">{role.linuxISO}</Col>
                        </Row>
                    </Col>
                </Row>)
                rows.push(row)
            })
        }
        return rows
    }

    checkBoxClick = (rowIndex, singleRowClick) => {
        this.props.checkBoxClick(rowIndex, singleRowClick)
    }

    render() {
        return (
            <div >
                {this.drawtable()}
            </div>
        );
    }
}
