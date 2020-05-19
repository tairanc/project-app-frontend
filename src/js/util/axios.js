import axios from 'axios';

//request拦截器全局加channel_type
axios.interceptors.request.use(config => {
    let {headers} = config;
    headers = Object.assign(headers,{"X-Channel":"TrMall", "X-Platform-Type":"APP", "X-Platform-From":"TrMall"});
    config = {...config,headers};
    return config;
}, error => {
	Promise.reject(error);
});

//对返回的状态进行判断
axios.interceptors.response.use(response => {
	if (response.data.code === 401) {
		window.location.href = 'trmall://to_login'
	}
	return response
}, error => {
	if (error.response && error.response.data.code === 401) {
        window.location.href = 'trmall://to_login'
	}
	return Promise.reject(error);
});

export default axios;
