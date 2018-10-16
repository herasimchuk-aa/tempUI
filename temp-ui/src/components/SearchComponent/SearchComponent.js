import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Input, InputGroup, InputGroupAddon } from 'reactstrap'

class SearchComponent extends Component {

    render() {
        return (
            // <Card className="borRad">
            //      <CardHeader>Search</CardHeader>
            //      <CardBody>
            //         <InputGroup >

            //             <InputGroupAddon addonType="append" className="borRadRight"></InputGroupAddon>
            //         </InputGroup>
            //  </CardBody>
            // </Card> 

            <Input placeholder="search" onChange={(e) => this.onInputChange(e)} style={{ width: '400px', marginRight: '-15px', borderRadius: '6px' }} />
        );
    }

    onInputChange = (e) => {
        let { data } = this.props
        let searchVal = e.target.value
        if (searchVal.length > 1) {
            searchVal = searchVal.toLowerCase()
            data = data.filter(function (datum) {
                let values = Object.values(datum)
                for (let i in values) {
                    let val = values[i]

                    if (typeof val === "string" && val) {
                        val = val.toLowerCase()
                        if (val.indexOf(searchVal) > -1) {
                            return true
                        }
                    } else if (Array.isArray(val) && val.length) {
                        for (let j in val) {
                            let arrayVal = val[j]
                            if (typeof arrayVal === "string" && arrayVal) {
                                arrayVal = arrayVal.toLowerCase()
                                if (arrayVal.indexOf(searchVal) > -1) {
                                    return true
                                }
                            }
                            else if (typeof arrayVal === "object" && arrayVal && arrayVal.Name) {
                                arrayVal = arrayVal.Name.toLowerCase()
                                if (arrayVal.indexOf(searchVal) > -1)
                                    return true
                            }
                        }

                    }
                }
                return false
            })
        }
        this.props.getFilteredData(data)
    }
}

export default SearchComponent;