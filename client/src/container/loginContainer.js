import { connect } from 'react-redux';
import { requestBody } from '../actions/'
import { apiPost } from '../actions/'
import Login from '../component/login'


function mapStateToProps(state){
    return {data: state}
}

function mapDispatchToProps(dispatch) {
    return { 
        onChange: (field, content) => { dispatch( requestBody(field, content) ) },
        onSubmit: (body, url) => { dispatch( apiPost(body, url) ) },
    }
}
const LoginContainer =  connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default LoginContainer