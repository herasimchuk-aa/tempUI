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
        let options = this.state.options
        if (options && options.length) {
            options.map((item) => {
                item.label = item.Name
                item.value = item.Name
            })
        }
        let values = this.state.value
        if (values && values.length) {
            values.map((item) => {
                item.label = item.Name
                item.value = item.Name
            })
        }

        return (
            <Select className="marTop10" value={this.state.value} onChange={(e) => this.handleChange(e)} options={this.state.options} multi />
        );
    }
}