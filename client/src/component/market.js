import React from 'react';
import Currency from './currency';
import { connect } from 'react-redux'



const Market = props => {
    
    return (
        <div>
            <h2>Realtime Market Value (via CEX.io)</h2>
            {props.prices.map( el => <Currency {...el} key={el.symbol1} />)}
        </div>
    )
}

const mapStateToProps = state => state.dataReducer
    

export default connect(
    mapStateToProps
)(Market);