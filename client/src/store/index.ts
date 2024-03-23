import { combineReducers, createStore } from "redux";
import User from "./reducers/user"

const reducers = combineReducers({
    user: User
})

const store = createStore(reducers)

export default store;