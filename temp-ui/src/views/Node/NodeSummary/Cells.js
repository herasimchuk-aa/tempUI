import { Cell } from 'fixed-data-table-2'
import React from 'react'
import { UncontrolledTooltip, Badge, Row, Col, ListGroup, ListGroupItem } from 'reactstrap'


class CollapseCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, collapsedRows, callback, ...props } = this.props;
        if ((!data[rowIndex].interfaces) || (data[rowIndex].interfaces.length == 1)) {
            return (<Cell></Cell>)
        }

        return (

            <Cell {...props}>
                <a onClick={() => callback(rowIndex)}>
                    {collapsedRows == rowIndex ? '\u2212' : '\u002B'}
                </a>
            </Cell >
        );
    }
};
module.exports.CollapseCell = CollapseCell;

class DateCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, ...props } = this.props;
        return (
            <Cell {...props}>
                {data.getObjectAt(rowIndex)[columnKey].toLocaleString()}
            </Cell>
        );
    }
};
module.exports.DateCell = DateCell;

class ImageCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, ...props } = this.props;
        return (
            <ExampleImage
                src={data.getObjectAt(rowIndex)[columnKey]}
            />
        );
    }
};
module.exports.ImageCell = ImageCell;

class LinkCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, ...props } = this.props;
        return (
            <Cell {...props}>
                <a href="#">{data.getObjectAt(rowIndex)[columnKey]}</a>
            </Cell>
        );
    }
};
module.exports.LinkCell = LinkCell;

class PendingCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, dataVersion, ...props } = this.props;
        const rowObject = data.getObjectAt(rowIndex);
        return (
            <Cell {...props}>
                {rowObject ? rowObject[columnKey] : 'pending'}
            </Cell>
        );
    }
};
const PagedCell = ({ data, ...props }) => {
    const dataVersion = data.getDataVersion();
    return (
        <PendingCell
            data={data}
            dataVersion={dataVersion}
            {...props}>
        </PendingCell>
    );
};
module.exports.PagedCell = PagedCell;

class RemovableHeaderCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, callback, children, ...props } = this.props;
        return (
            <Cell {...props}>
                {children}
                <a style={{ float: 'right' }} onClick={() => callback(columnKey)}>
                    {'\u274C'}
                </a>
            </Cell>
        );
    }
};
module.exports.RemovableHeaderCell = RemovableHeaderCell;

class TextCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, ...props } = this.props;

        return (
            <Cell {...props}>

                {data[rowIndex][columnKey]}
            </Cell>
        );
    }
};
module.exports.TextCell = TextCell;

class GetFirstValueCell extends React.PureComponent {
    render() {

        const { data, rowIndex, columnKey, rowData, ...props } = this.props;

        let value = "-"
        let arr = []

        arr = data[rowIndex]['interfaces']

        if (arr && arr.length) {
            let firstInterface = arr[0]
            if (this.props.identity == 'ip') {

                value = firstInterface.Ip_address ? firstInterface.Ip_address : '-'

                if (firstInterface.Ip_address && firstInterface.ValidationStatus) {
                    if (firstInterface.ValidationStatus['Is_valid_ip']) {
                        return (<Cell {...props}>  <span style={{ color: 'black' }}>{value}</span> </Cell>)
                    }
                    else {
                        return (<Cell id={'ipFirst' + rowIndex} {...props}>
                            <span style={{ color: 'red' }} key={'ipFirst' + rowIndex}>{value}</span>
                            {<UncontrolledTooltip placement="top-start" target={'ipFirst' + rowIndex}>{firstInterface.ValidationStatus['Ip_address'] ? firstInterface.ValidationStatus['Ip_address'] : '-'}</UncontrolledTooltip>}
                        </Cell>);
                    }
                }
                return (<Cell {...props}>  {value} </Cell>)

            } else if (this.props.identity == 'connectedTo') {

                value = firstInterface.Remote_interface && firstInterface.Remote_ip ? firstInterface.Remote_interface + ':' + firstInterface.Remote_ip : '-'

                if (firstInterface.Remote_interface && firstInterface.Remote_ip && firstInterface.ValidationStatus) {
                    if (firstInterface.ValidationStatus['Is_lldp_matched']) {
                        return (<Cell {...props}>  <span style={{ color: 'black' }}>{value}</span> </Cell>)
                    }
                    else {
                        return (<Cell id={'connectedToFirst' + rowIndex} {...props}>
                            <span style={{ color: 'red' }} key={'connectedToFirst' + rowIndex}>{value}</span>
                            {<UncontrolledTooltip placement="top-start" target={'connectedToFirst' + rowIndex}>{firstInterface.ValidationStatus['Remote_interface'] && firstInterface.ValidationStatus['Remote_ip'] ? firstInterface.ValidationStatus['Remote_interface'] + ':' + firstInterface.ValidationStatus['Remote_ip'] : '-'}</UncontrolledTooltip>}
                        </Cell>);
                    }
                }
                return (<Cell {...props}>  {value} </Cell>)

            } else if (this.props.identity == 'link') {
                return (
                    <Cell {...props}>
                        {firstInterface.Link_status ? firstInterface.Link_status : '-'}
                    </Cell >
                );
            } else if (this.props.identity == 'lldp') {
                return (
                    <Cell {...props}>
                        {firstInterface.ValidationStatus['Is_lldp_matched'] ? 'true' : 'false'}
                    </Cell >
                );
            } else {
                return (
                    <Cell {...props}>
                        {firstInterface.Name ? firstInterface.Name : '-'}
                    </Cell >
                );
            }
        }
        return (<Cell {...props}>  {value} </Cell>)
    }
};
module.exports.GetFirstValueCell = GetFirstValueCell;

class TextCellForArray extends React.PureComponent {

    render() {

        const { data, rowIndex, columnKey, rowData, expandedrow, ...props } = this.props;

        let value = "-"
        let arr = []
        let rIndex = rowIndex
        rIndex = rIndex + 1
        if (expandedrow) {

            if (expandedrow.interfaces && expandedrow.interfaces.length) {
                let val = expandedrow.interfaces[rIndex]

                let str = ''

                if (this.props.identity == 'ip') {

                    value = val.Ip_address ? val.Ip_address : '-'

                    if (val.Ip_address && val.ValidationStatus) {
                        if (val.ValidationStatus['Is_valid_ip']) {
                            return (<Cell {...props}>  <span style={{ color: 'black' }}>{value}</span> </Cell>)
                        }
                        else {
                            return (<Cell id={'ip' + rIndex} {...props}>
                                <span style={{ color: 'red' }} key={'ip' + rIndex}>{value}</span>
                                {<UncontrolledTooltip placement="top-start" target={'ip' + rIndex}>{val.ValidationStatus['Ip_address'] ? val.ValidationStatus['Ip_address'] : '-'}</UncontrolledTooltip>}
                            </Cell>);
                        }
                    }
                    return (<Cell {...props}>  {value} </Cell>)

                } else if (this.props.identity == 'connectedTo') {

                    value = val.Remote_interface && val.Remote_ip ? val.Remote_interface + ':' + val.Remote_ip : ''

                    if (val.Remote_interface && val.Remote_ip && val.ValidationStatus) {
                        if (val.ValidationStatus['Is_lldp_matched']) {
                            return (<Cell {...props}>  <span style={{ color: 'black' }}>{value}</span> </Cell>)
                        }
                        else {
                            return (<Cell id={'connectedTo' + rIndex} {...props}>
                                <span style={{ color: 'red' }} key={'connectedTo' + rIndex}>{value}</span>
                                {<UncontrolledTooltip placement="top-start" target={'connectedTo' + rIndex}>{val.ValidationStatus['Remote_interface'] && val.ValidationStatus['Remote_ip'] ? val.ValidationStatus['Remote_interface'] + ':' + val.ValidationStatus['Remote_ip'] : '-'}</UncontrolledTooltip>}
                            </Cell>);
                        }
                    }
                    return (<Cell {...props}>  {value} </Cell>)

                } else if (this.props.identity == 'lldp') {

                    return (
                        <Cell {...props}>
                            {val.ValidationStatus['Is_lldp_matched'] ? 'true' : 'false'}
                        </Cell >
                    );
                } else if (this.props.identity == 'link') {

                    return (
                        <Cell {...props}>
                            {val.Link_status ? val.Link_status : '-'}
                        </Cell >
                    );
                } else if (this.props.identity == 'interfaces') {

                    return (
                        <Cell {...props}>
                            {val.Name ? val.Name : '-'}
                        </Cell >
                    );
                }

            } else {
                return (
                    <Cell {...props}>
                        {'-'}
                    </Cell >
                );
            }

        } else {
            if (columnKey == 'roleDetails') {
                arr = data[rowIndex][columnKey]
            } else {
                arr = data[rowIndex]['interfaces']
            }
            if (arr && arr.length) {
                let str = ''
                arr.map((val, index) => {
                    if (index == arr.length - 1) {
                        str = val.Name
                    }
                    else {
                        str += val.Name + '\n'
                    }
                })
                value = str
            }
            return (
                <Cell {...props}>
                    {value}
                </Cell >
            );
        }


    }
};
module.exports.TextCellForArray = TextCellForArray;

class TooltipCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, ...props } = this.props;
        const value = data[rowIndex][columnKey];
        return (
            <Cell
                {...props}
                onMouseEnter={() => { }}
                onMouseLeave={() => { }}>
                <div ref='valueDiv' data-tip={value}>
                    {value}
                </div>
            </Cell>
        );
    }
};
module.exports.TooltipCell = TooltipCell;

class BadgeCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, ...props } = this.props;
        let value = '-'
        if (!data[rowIndex]['ValidationStatus']['OverallStatus']) {
            value = 'Mismatch'
            return (<Cell {...props}> <Badge color="danger">{value}</Badge> </Cell>)
        }
        else {
            value = 'Registered'
            return (<Cell {...props}>{value} </Cell>)
        }

    }
};
module.exports.BadgeCell = BadgeCell;

class ValidationCell extends React.PureComponent {
    render() {
        let a = [];
        const { data, rowIndex, columnKey, match, field, ...props } = this.props;
        const value = data[rowIndex][columnKey];
        if (value && data[rowIndex].ValidationStatus) {
            if (data[rowIndex].ValidationStatus[match]) {
                return (<Cell {...props}>  <span style={{ color: 'black' }}>{value}</span> </Cell>)
            }
            else {
                return (<Cell id={columnKey + rowIndex} {...props}>
                    <span style={{ color: 'red' }} key={columnKey + rowIndex}>{value}</span>
                    <UncontrolledTooltip placement="top-start" target={columnKey + rowIndex}>{data[rowIndex].ValidationStatus[field] ? data[rowIndex].ValidationStatus[field] : '-'}</UncontrolledTooltip>
                </Cell>);
            }

        }
        else {
            // value to be set -
            if (data[rowIndex].ValidationStatus) {
                if (data[rowIndex].ValidationStatus[match]) {
                    return (<Cell {...props}>  <span style={{ color: 'black' }}>{'-'}</span> </Cell>)
                }
                else {
                    return (<Cell id={columnKey + rowIndex} {...props}>
                        <span style={{ color: 'red' }} key={columnKey + rowIndex}>{'-'}</span>
                        <UncontrolledTooltip placement="top-start" target={columnKey + rowIndex}>{data[rowIndex].ValidationStatus[field]}</UncontrolledTooltip>
                    </Cell>);
                }
            }
        }

        if (value) {
            return (<Cell {...props}>  <span style={{ color: 'black' }}>{value}</span> </Cell>)
        }
        return <Cell></Cell>
    }
}
module.exports.ValidationCell = ValidationCell;