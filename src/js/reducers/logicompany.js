import createReducers from './createReducers.js';

const initialState = {
    load: true,
    data: "",
    companyname:"",
    companycode:"",
    corpid:""
};
function logicompany(state = initialState, action) {
    switch (action.type) {
        case 'resetData':
            return initialState;
        case 'getDataSuccess':
            let dealData = action.result.data;
            let $Data={};
            for(let key in dealData){
                if(key=="#"){
                    $Data = dealData[key];
                    delete dealData[key];
                }
            };
            dealData['#']=$Data;
            return {
                ...state,
                load: false,
                data:dealData
            };
        case 'ctrlModal':
            return {...state, [action.modal]: action.status};
        case 'changeCompany':
            return {...state,companyname:action.name,companycode:action.code,corpid:action.id};
        default:
            return state;
    }
}

export default createReducers("logicompany", logicompany, initialState);