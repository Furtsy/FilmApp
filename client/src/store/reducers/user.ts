import { USER_DATA } from "../types";

const data = {}

const reducer = (state = data, action) => {
    switch (action.type) {
        case USER_DATA:
            return state = action.payload;
        default:
            return state;
    }
}

export default reducer;