import axios from 'axios';

export function concatPageAndType( pageName ){
	return function( type,options ){
		return {
			type:pageName+"_"+type,
			...options
		}
	}
}

//单个请求
export function actionAxios( pageName ){
	let createActions = concatPageAndType( pageName );
	return function( name, options, cbData ){
		return function ( dispatch ){
			dispatch( createActions( name+"Load",{ cbData } ) );
			return axios.request({ ...options })
				.then( result => {
					dispatch( createActions( name + 'Success',{
						result:result.data ,
						cbData:cbData
					}) );
				}).catch( error =>{
				 dispatch( createActions( name +"Error",{ error:error }) );
				 console.error( error );
			 });
		}
	}
}

//多个请求
export function actionAxiosAll( pageName ){
	let createActions = concatPageAndType( pageName );
	return function( name,options,cbData ){
		return function (dispatch){
			dispatch( createActions( name+"Load", cbData ));
			let requestArr = options.map( (item,i)=>{
				return axios.request( item );
			});
			return axios.all( requestArr )
				.then( result => {
					dispatch( createActions( name+'Success',{ result:result,cbData:cbData }) );
				})
				.catch( error =>{
					dispatch( createActions(name+"Error",{ error:error }) );
					console.error( error );
				});
		}
	}
}

export const popupActions = concatPageAndType("popup");