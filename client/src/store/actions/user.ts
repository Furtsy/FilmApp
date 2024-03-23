import { USER_DATA } from '../types';

export const SET_USER_DATA = (payload:any) => {
    return { 
        type: USER_DATA,
        payload: payload
    }
}