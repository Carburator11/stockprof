import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import './App.css';
const domain = 'stockprof-carb11.herokuapp.com';


class App extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };

    constructor(props) {
        super(props);
        this.state = {data: 'no data'};
    }

    getUserInfo(cb) {
        const { cookies } = this.props;
        console.log('[React-userInfo]', cookies.get(domain));
        let params = {
            method: 'GET',
            accept: 'application/json',
            credentials: 'include'
        }
        fetch('/api/', params)
            .catch(function(err){console.log('Error:', err)})   
            .then(function(data){
                console.log('[React-userInfo] Fetch ok', data);
                data.json().then(
                    json => {console.log('[React-userInfo] JSON:', json)
                    let obj = {'data': json};
                    console.log('[React-userInfo] Obj:', obj)
                    cb(obj);
                    }
                )
            })    
    }

    componentWillMount() {
        const { cookies } = this.props;
        if(!cookies.get(domain)){
            let rdm = Math.floor(Math.random() * 99999942 );
            cookies.set(domain, rdm, { path: '/' });
        }
        this.getUserInfo(  data => this.setState(data) );

    }


    render() {
        return (
            <div className="App">
                Hello !<br/>
                <p>Cookie: {JSON.stringify(this.state.data.cookie)} </p>
                <p>Session: {JSON.stringify(this.state.data.session)} </p>
                <p>DB: {JSON.stringify(this.state.data.db)} </p>
                <br/><br/><br/>
                {/*JSON.stringify(this.state.data)*/} 
            </div>
        );
    }
}

export default withCookies(App);
