import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { auth } from "../auth";
import { SET_USER_DATA } from "../store/actions/user";

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const dispatch = useDispatch();
    const [isFetch, setFetch] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const data = await auth();
                    if (data.message === 'success') {
                        dispatch(SET_USER_DATA(data));
                        setFetch(true);
                    } else {
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    localStorage.removeItem("token");
                }
            } else {
                setFetch(true);
            }
        };

        checkAuth();
    }, []);
    
    if (!isFetch) {
        return <></>;
    } else {
        return (
            <Route
                {...rest}
                render={props =>
                    localStorage.getItem("token") ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to="/login" />
                    )}
            />
        );
    }
};