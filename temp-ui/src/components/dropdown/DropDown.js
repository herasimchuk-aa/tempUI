import React, { Component } from 'react';

export default class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      identity: '',
      default: '',
      disabled: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      identity: props.identity,
      value: props.default,
      disabled: props.disabled != undefined ? props.disabled : false
    }
  }

  /* componentDidMount() {
    this.setState({value: this.props.default});
  } */

  /* handleChange(event) {
    this.setState({value: event.target.value});
    this.props.getSelectedData(event.target.value);
  } */

  getSelectedData = (event, value) => {
    //this.setState({value: event.target.value});
    this.props.getSelectedData(event.target.value, this.props.identity);
  }

  getOptions(options) {
    let rolesHtml = [];
    rolesHtml.push(<option value=''> -- select an option -- </option>)
    options.map((item) => (rolesHtml.push(<option value={item.Id} >{item.Name}</option>)));
    return rolesHtml;
  }

  render() {
    return (
      <select disabled={this.state.disabled} className="form-control marTop10" id={this.props.identity} value={this.state.value} onChange={(e) => this.getSelectedData(e, this.state.value)}>
        {this.getOptions(this.props.options)}
      </select>
    );
  }
}