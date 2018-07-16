import React, { Component } from 'react';

export default class DropDown extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: 'select'};
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }

    getOptions(options){
        let rolesHtml = [];
        rolesHtml.push(<option selected value='select'> -- select an option -- </option>)
        options.map((item) => (rolesHtml.push(<option value={item.value} >{item.value}</option>)));
        return rolesHtml;
    }
  
    render() {
      return (        
        <select className="form-control" value={this.state.value} onChange={this.handleChange}>
            {this.getOptions(this.props.options)}
        </select>         
      );
    }
  }