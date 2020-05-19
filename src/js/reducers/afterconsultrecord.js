import createReducers from './createReducers.js';

const initialState = {
    load: true,
    data: ""
};
function consultrecord(state = initialState, action) {
    switch (action.type) {
        case 'resetData':
            return initialState;
        case 'getDataSuccess':
            return {
                ...state,
                load: false,
                data:action.result.data
            };
        case 'ctrlModal':
            return {...state, [action.modal]: action.status};
        default:
            return state;
    }
}

export default createReducers("consultrecord", consultrecord, initialState);