export default (nextState, callback)=>{
	require.ensure([], (require) => {
		require('plugin/swiper/swiper.min.js');
		window.echo = require('plugin/echo.js');
		callback(null, require('pages/groupMall/home.jsx').default);
	}, "GroupMallHome")
}