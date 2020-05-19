export default ( nextState, callback )=> {
	require.ensure([], (require) => {
		callback(null, require('pages/member/trade/logisticDetail').default);
	}, "logisticDetail");
}