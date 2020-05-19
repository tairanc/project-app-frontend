export default function ( nextState, callback ){
    require.ensure([], (require)=> {
		require('plugin/swiper/swiper.min.js');
		require('plugin/jQueryRotate.js');
        callback(null, require('pages/activity/20181111/index').default );
    }, "luckyDraw");
}