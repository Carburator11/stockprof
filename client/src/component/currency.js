import React from 'react';

class Currency extends React.Component{
    constructor(props){
        super(props);
        // local state only 
        this.state = {price: 0}
    }


    componentDidMount(){
        this.setState({
            price: this.props.price
        })
    }


    render(){
        return(
            <div className = 'currency'>
                <div className = 'currency-name'>
                    {this.props.symbol1}
                </div>
                
                <div className = 'currency-price'>
                    {this.props.price}  $
                
                    {(this.props.price >= this.state.price)?
                        (<span className = "currency-diffprice-sign" style={{color: 'green'}}>  &#9650;</span>):
                        (<span className = "currency-diffprice-sign" style={{color: 'red'}}>  &#9660;</span>)
                    }

                </div>


                <div className = 'currency-open24'>
                    open24: {this.props.open24}$
                </div>


                <div className = 'currency-open24-diff'
                     style = {(this.props.price >= this.props.open24)?{color: 'green'}:{color:'red'} }
                >
                    {(this.props.price >= this.props.open24)?'+':'-'}
                    {Math.round(100*(this.props.price - this.props.open24) / this.props.open24)}%
                </div>

                <div className = 'currency-timestamp' >
                    timestamp: {new Date(this.props.timestamp).toLocaleString()}
                </div>



            </div>
        )
    }
}

export default Currency
