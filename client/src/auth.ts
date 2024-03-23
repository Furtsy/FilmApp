import axios from "axios"
import { config } from "./utils/config"

var configauth = {
    method: 'get',
    url: `${config.api}/api/auth/me`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'Authorization': localStorage.getItem('token') 
    },
}

export async function auth() {
    let data = new Promise((resolve, reject) => {
        axios(configauth).then(res => {
            resolve(res.data)
        })
    })

    let result = await data 
    
    return result
}