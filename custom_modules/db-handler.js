import { uri } from '../config/connect';
import { accountSchema } from '../model/account';
import Cookies from 'universal-cookie';
const chalk = require('chalk');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(uri);
const database = mongoose.connection;


export const db = {

    init: function(){
        const Account = mongoose.model('Account', accountSchema)
        database.on('error', console.error.bind(console, 'connection error:'));
        database.once('open', () => {
            console.log("[accountDB-init] we're connected !")
        });
    },

    // return user Account info from DB
    // or error if the user is undefined
    handle: function(req, res, data, cb){
        
        const Account = mongoose.model('Account', accountSchema)
        console.log('[accountDB-handler] Starting: ', data)
        if(data.session.isLogged){
            Account.findOne({'_id': data.session['_id']}, (err, result) => {              
                if(err){
                    data.account = '[accountDB-handler] DB error'+ err;
                    console.log( data.account );
                    res.json( data );
                }

                
                if(result !== null){
                    data.account = result;
                    console.log('[accountDB-handler] ok', result);
                    console.log('[accountDB-handler] Return', data);
                    res.json( data );
                }
            })
        }

        else{
            data.account = '[accountDB-handler] User not logged or Error';
            console.log( data.account );
            console.log('[accountDB-handler] Return', data)
            res.json( data ); 
        }
            
    },

    register: function(req, res, data, cb){

        const Account = mongoose.model('Account', accountSchema)

        console.log('[accountDB-register] Request:', req.body);

        // Check the request #1
        if(!req || req === ''){
            data.account = '[accountDB-register] Error: request is undefined'
            data.status = {'error': data.account}
            console.error( data.account );
            res.json(data);
        }

        // Check the request #2
        if( req.body.name === '' || req.body.email === '' || req.body.password === '' || !req.body.name  || !req.body.email || !req.body.password 
            ) {
                data.account = '[accountDB-register] Error : Please fill in all fields'
                console.error( data.account );
                data.status = {'error': data.account}
                console.error( data.account );
                res.json(data);  
        }
        else{
            Account.findOne({email: req.body.email}, (error, result) => {

                if (error){
                    data.account ='[accountDB-register] Error fetching DB: '+ error;
                    console.error( data.account );
                    data.status = {'error': data.account}
                    res.json(data); 
 
                }

                if (result) {
                    data.account ='[accountDB-register] Error:  Email already used';
                    data.status = {'error': data.account}
                    console.error( data.account );
                    res.json(data);       
                }

                else {
                    let newAccount = new Account();
                    newAccount.name = req.body.name;
                    newAccount.email = req.body.email;
                    newAccount.password = req.body.password;
                    data.account = newAccount
                    newAccount.save(
                        () => {
                            console.log('[accountDB-register] New account saved', newAccount);
                            if(cb){
                                console.log("[accountDB-register] Passing CB on:", data);
                                cb(data);
                            }
                        }
                    
                    );

                }
            })
        }
    },

    login: function(req, res, data, cb){
        console.log('[accountDB-login] starting', data)
        const Account = mongoose.model('Account', accountSchema)

        // Check the request #1
        if(!req || req === ''){
            data.account = '[accountDB-login] Error: request is undefined'
            data.status = {'error': data.account}
            console.error( data.account );
            res.json(data);
        }

        // Check the request #2
        if( req.body.name === '' || typeof(req.body.email) === '' || req.body.password === ''
            ) {
                data.account = '[accountDB-login] Error : Please fill in all fields'
                data.status = {'error': data.account}
                console.error( data.account );
                res.json(data);  
        }

        Account.findOne({email: req.body.email, password: req.body.password }, (error, result) => {
            console.log('[accountDB-login] Checking DB')
            if (error){
                data.account ='[accountDB-login] Error fetching DB: '+ error;
                data.status = {'error': data.account}
                console.error( data.account );
                res.json(data); 
            }

            if (result) {
                console.log('[accountDB-login] Result:', result);
                data.account = result;
                if(cb){
                    console.log("[accountDB-login] Passing CB on: ", data);
                    cb( data );
                } else {
                    res.json(data);
                }      
            }

            else {
                data.account ='[accountDB-login] Invalid login/pwd... ';
                data.status = {'error': data.account}
                console.error( data.account );
                res.json(data); 
            }
        })

    },

    // called by ws-handler.js 
    getUsers(cb){
        const Account = mongoose.model('Account', accountSchema);
        Account.find().lean().exec( function(err, list){
            if(err){return err}
            console.log(chalk.blue('[accountDB] get: '+ JSON.stringify(list).substr(0, 30)));
            cb(list)
        } )

    }
}