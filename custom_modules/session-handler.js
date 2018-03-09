const fs = require("fs");
import Cookies from 'universal-cookie';
import {domain}  from '../config/domain';
const bodyParser = require('body-parser');


export const session = {

    handle: function(req, res, data, cb){

        let path = process.cwd() + "/session/" + data.cookie;

        fs.readFile(path, (err, result)=>{
            if (err || result === {} ) {
                // create default session file
                data.session =  {
                    'visitCount': 1,
                    'visitLast': (new Date() ).getTime(),
                    '_id': false,
                    'isLogged': false,
                    'role': 0,
                    'ip': [req.ip]
                }
                console.log("[Session] New file.");  

                fs.writeFile(path, JSON.stringify(data.session), (err) =>{
                    if(err){
                        data.session = '[Session-handler] Write File error'+ err;
                        console.error( data.session );
                        res.json(data)
                    }
                    if(cb){
                        console.log("[Session-handler] Passing CB on:", data);
                        cb(data);
                    }
                });
            }

            else {
                // update existing file
                data.session = JSON.parse(result);
                data.session.visitCount++;
                data.session.visitLast = (new Date() ).getTime();
                if(!data.session.ip){ data.session.ip = [] }
                if(req.ip !== data.session['ip'][ (data.session['ip'].length - 1) ]){
                    data.session['ip'].push(req.ip); 
                }

                console.log("[Session] Update file.");

                fs.writeFile(path, JSON.stringify(data.session), (err) =>{
                    if(err){
                        data.error = '[Session-handler] Write File error'+ error
                        console.error( data.error );
                        res.json(data)
                    }
                    if(cb){
                        console.log("[Session-handler] Passing CB on:", data);
                        cb( data );
                    }
                });
            } 
        })
    },
    login: function(req, res, data, cb){
        // Prevent multiple logins
        if(data.session.isLogged){
            data.error = 'You are already logged in, please disconnect first';
            console.error( '[accountDB-register]' + data.account );
            res.json(data);
        } else {
            this.register(req, res, data, cb)
        }
    },

    register: function(req, res, data, cb){

        let path = process.cwd() + "/session/" + data.cookie;

        fs.readFile(path, (err, result)=>{
            if (err || result === {} ) {
                // create default session file
                data.session =  {
                    'visitCount': 1,
                    'visitLast': (new Date() ).getTime(),
                    'isLogged': true,
                    '_id': data.account['_id'],
                    'role': 1,
                    'ip': [req.ip]
                }

                if(data.account){
                    data.session['_id'] = data.account['_id']
                } else {
                    data.session['_id'] = 'No ID...'
                }

                console.log("[Session] New file.");  

                fs.writeFile(path, JSON.stringify(data.session), (err) =>{
                    if(err){
                        data.session = '[Session-handler] Write File error'+ error
                        data.error = data.session;
                        console.error( data.session );
                        res.json(data);
                    }
                    else{
                        if(cb){
                            console.log("[Session-handler] Passing CB on:", data);
                            cb(data);
                        } else {
                            console.log("[Session-handler] Response:", data);
                            res.json(data)
                        }
                    }
                });
            }

            else {
                // update existing file
                data.session = JSON.parse(result);
                data.session.visitCount++;
                data.session.visitLast = (new Date() ).getTime();
                data.session.isLogged = true;
                data.session.role = 1;
                data.session['_id'] = data.account['_id'];
                if(!data.session.ip){ data.session.ip = [] }
                if(req.ip !== data.session['ip'][ (data.session['ip'].length - 1) ]){
                    data.session['ip'].push(req.ip); 
                }

                console.log("[Session-handler] Update file.");

                fs.writeFile(path, JSON.stringify(data.session), (err) => {
                    if(err){
                        data.session = '[Session-handler] Write File error'+ error
                        data.error = data.session;
                        console.error( data.session );
                        res.json(data);
                    }
                    if(cb){
                        console.log("[Session-handler] Passing CB on:", data);
                        cb(data);
                    } else {
                        console.log("[Session-handler] Response:", data);
                        res.json(data);
                    }
                });
            } 
        })
    },

    disconnect: function(req, res, data, cb){

        let path = process.cwd() + "/session/" + data.cookie;
        data.cookie += ' (expired)';

        fs.readFile( path, (err, result) => {
            data.session = JSON.parse(result);

            if(err){
                data.session = '[Session-disconnect] Unlink File error '+ err;
                data.error = data.session;
                console.error( data.session );
                res.json(data);
            }
            else{
                console.log("[Session-disconnect]");
                data.session = JSON.parse(result);
                data.session.isLogged = false;
                data.session.status = 'Session Disconnected -' + (new Date() ).getTime();
                data.session.visitLast = (new Date() ).getTime();
                if(!data.session.ip){ data.session.ip = [] }
                if(req.ip !== data.session['ip'][ (data.session['ip'].length - 1) ]){
                    data.session['ip'].push(req.ip); 
                }

                fs.writeFile(path, JSON.stringify(data.session), (err) =>{

                    if(err){
                        data.error = '[Session-disconnect] Write File error'+ error
                        console.error( data.error );
                        res.json(data)
                    }
                    if(cb){
                        console.log("[Session-disconnect] Passing CB on:", data);
                        cb( data );
                    } 
                    else{
                        res.json(data)
                    }
                });
            }
        });
    }
}







