import { Cell } from 'fixed-data-table-2'
import React from 'react'


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

class ColoredTextCell extends React.PureComponent {
    render() {
        const { data, rowIndex, columnKey, ...props } = this.props;
        return (
            <Cell {...props}>
                {this.colorizeText(data.getObjectAt(rowIndex)[columnKey], rowIndex)}
            </Cell>
        );
    }

    colorizeText(str, index) {
        let val, n = 0;
        return str.split('').map((letter) => {
            val = index * 70 + n++;
            let color = 'hsl(' + val + ', 100%, 50%)';
            return <span style={{ color }} key={val}>{letter}</span>;
        });
    }
};
module.exports.ColoredTextCell = ColoredTextCell;

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