import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class MultiselectDropDown extends Component {

    static getDerivedStateFromProps(props, state) {
        return {
            isDisabled: props.isDisabled,
            multi: props.multi,
            isSearchable: props.isSearchable,
            placeholder: props.placeholder,
            value: props.value,
            options: props.options,
        }
    }

    static defaultProps = {
        isDisabled: false,
        multi: true,
        isSearchable: false,
        placeholder: '',
        value: [],
        options: [],
        autosize: false,
        closeOnSelect: false
    }

    handleChange = (selectedOption) => {
        this.props.getSelectedData(selectedOption);
    }

    render() {
        return (
            <Select className="marTop10" value={this.state.value} onChange={(e) => this.handleChange(e)} options={this.state.options} multi />
        );
    }
}