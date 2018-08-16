import { Cell } from 'fixed-data-table-2'
import React from 'react'
import { UncontrolledTooltip, Badge } from 'reactstrap'

class CollapseCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, collapsedRows, callback, ...props } = this.props;
        return (
            <Cell {...props}>
                <a onClick={() => callback(rowIndex)}>
                    {collapsedRows.has(rowIndex) ? '\u25BC' : '\u25BA'}
                </a>
            </Cell>
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

class TextCellForArray extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, ...props } = this.props;
        let value = "-"
        let arr = data[rowIndex][columnKey]
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

        return (
            <Cell {...props}>
                {value}
            </Cell>
        );
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
        const value = data[rowIndex][columnKey];
        if (value == 'Mismatch') {
            return (<Cell {...props}> <Badge color="danger">{value}</Badge> </Cell>)
        }
        else
            return (<Cell {...props}>{value} </Cell>)
    }
};
module.exports.BadgeCell = BadgeCell;

class ValidationCell extends React.PureComponent {
    render() {
        let a = [];
        const { data, rowIndex, columnKey, match, field, ...props } = this.props;
        const value = data[rowIndex][columnKey];

        if (value && data[rowIndex].validationStatus) {
            if (data[rowIndex].validationStatus[match]) {
                return (<Cell {...props}>  <span style={{ color: 'black' }}>{value}</span> </Cell>)
            }
            else {
                let tooltip = null;
                if (data[rowIndex].validationStatus[field])
                    tooltip = (<UncontrolledTooltip placement="top" target={columnKey + rowIndex}>{data[rowIndex].validationStatus[field]}</UncontrolledTooltip>)
                return (<Cell id={columnKey + rowIndex} {...props}>  <span style={{ color: 'red' }} key={columnKey + rowIndex}>{value}</span> {tooltip} </Cell>);
            }

        }
        else {
            // value to be set -
            if (data[rowIndex].validationStatus) {
                if (data[rowIndex].validationStatus[match]) {
                    return (<Cell {...props}>  <span style={{ color: 'black' }}>{'-'}</span> </Cell>)
                }
                else {
                    let tooltip = null;
                    if (data[rowIndex].validationStatus[field])
                        tooltip = (<UncontrolledTooltip placement="top" target={columnKey + rowIndex}>{data[rowIndex].validationStatus[field]}</UncontrolledTooltip>)
                    return (<Cell id={columnKey + rowIndex} {...props}>  <span style={{ color: 'red' }} key={columnKey + rowIndex}>{'-'}</span> {tooltip} </Cell>);
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