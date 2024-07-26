const mutations = {
	// 更新用户名
	setUsername(state, username){
		state.username = username;
		uni.setStorageSync('username', username);
	},
	
	// 更新已标记数据
	setMarkerList(state, markerList){
		state.markerList = markerList;
		uni.setStorageSync('markerList', markerList);
	},
}
export default mutations;