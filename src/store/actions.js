/*新增标记*/
export function addMark({state, commit, dispatch}, data){
	return new Promise(reslove => {
		let {markerList} = state;
		
		if(!data.date){
			let now = new Date();
			data.id = +now;
			data.date = now.format();
		}
		
		markerList.push(data);
		commit('setMarkerList', markerList);
		dispatch('sendMesage');
		reslove(data, markerList);
	})
}

/*删除标记*/
export function delMark({state, commit, dispatch}, id){
	return new Promise(reslove => {
		let {markerList} = state;
		let index = markerList.findIndex(item => item.id === id);
		if(index != -1){
			markerList.splice(index,1);
			commit('setMarkerList', markerList);
			dispatch('sendMesage');
		}
		reslove();
	})
}

/*获取已标记数据*/
export function getList({state, commit}){
	return new Promise(reslove => {
		if(state.markerList){
			return reslove(state.markerList);
		}
		uni.showLoading({
			title: '请稍等...'
		});
		new Promise(res => {
			uni.request({
				url: VITE_CONFIG.DATA_FILE_URL + `${state.username}.json`
			}).then(({data}) => {
				res(Array.isArray(data) ? data : []);
			}).catch(e=>{
				res([])
			})
		}).then(data => {
			uni.hideLoading();
			commit('setMarkerList', data);
			reslove(data);
		})
	})
}

/*获取指定城市的坐标*/
export function getCoordinate(x, name){
	return new Promise(reslove => {
		uni.showLoading({
			title: '请稍等...'
		});
		new Promise(res => {
			uni.request({
                url: `https://restapi.amap.com/v3/geocode/geo?address=${name}&key=${VITE_CONFIG.GD_WEB_KEY}`
			}).then(respn => {
				res(respn.data.geocodes)
			}).catch(e=>{
				res()
			})
		}).then(data => {
			uni.hideLoading();
			reslove(data ? data[0] : null);
		})
	})
}

/*发送消息至钉钉*/
export function sendMesage({state}){
	let message = `========${state.username}最新数据========\n`;
	message += JSON.stringify(state.markerList);
	message = message.replace('[', '[\n').replace(']', '\n]').replace(/},{/g, '},\n{');
	uni.request({
		url: VITE_CONFIG.DD_WEBHOOK_URL,
		method: 'POST',
		header: {'Content-Type': 'application/json'},
		data: {
			"msgtype": "text",
			"text": {
				"content": message
			}
		}
	})
}