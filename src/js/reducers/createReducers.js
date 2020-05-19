export default function( pageName,reducers,initState ){
	return function( state=initState, action ){
		let exp = new RegExp("^"+pageName+"_","g" );
		if( !exp.test(action.type) ){
			return state;
		}
		return reducers( state, {...action,type:action.type.slice( pageName.length+1 ) });
	}
}