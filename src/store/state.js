const state = {
	username: uni.getStorageSync('username'), //用户名
	markerList: uni.getStorageSync('markerList'), //已标记数据
}
export default state;