import React, { Component } from 'react';

export default class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      identity: '',
      default: ''
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      identity: props.identity,
      value: props.default
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
    options.map((item) => (rolesHtml.push(<option value={item.value} >{item.value}</option>)));
    return rolesHtml;
  }

  render() {
    return (
      <select className="form-control marTop10" id={this.props.identity} value={this.state.value} onChange={(e) => this.getSelectedData(e, this.state.value)}>
        {this.getOptions(this.props.options)}
      </select>
    );
  }
}