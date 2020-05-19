export const ownAjax =function( options,data ){
	return new Promise(function(resolve,reject){
		$.ajax({
			url:options.url,
			type:options.type,
			data:{...data,t: 333},
			/*beforeSend(xhr){
				xhr.setRequestHeader('x-User-Agent','1 TrMall/0.0.0 1')
			},*/
			success:function( result ){resolve( result );},
			error:function(xhr){ reject( xhr );}
		})
	});
};