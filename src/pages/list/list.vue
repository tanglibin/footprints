<template>
	<m-main back="index" navigation="我的足迹" class="list-page">
		<map
			id="map"
			longitude="104.5" 
			latitude="25"
			:scale="3"
			:markers="marksData.markerList || []"
		/>
		<view class="footer-skin">
			<view class="text-block">
				<view>您去过</view>
			    <view class="link-high" @click="Util.goTo('info')">{{marksData.nations?.length || 0}}</view>
				<view>个国家的</view>
				<view class="link-high" @click="Util.goTo('info')">{{marksData.markerList?.length || 0}}</view>
				<view>个城市。</view>
			</view>
			<button class="btn" @click="Util.goTo('add')">新增足迹</button>
		</view>
		<m-popup type="bottom" v-model:showPopup="showPopup">
			<view class="confirm-box">定位到您在<view class="high">{{locationStr}}</view>, 是否点亮该位置？</view>
			    <view class="footer-btn-box">
			      <view class="cancel" @click="showPopup=false">取消</view>
			      <view class="ok" @click="save">点亮</view>
			    </view>
		</m-popup>
	</m-main>
</template>

<script>
	export default {
		data() {
			return {
				showPopup: false, //当前位置没有添加过时，显示是否点亮当前位置提醒
				locationAddr: null, //当前位置
			};
		},
		computed: {
			// 当前位置
			locationStr(){
				let {locationAddr} = this;
				if(!locationAddr){
					return ''
				}
				let {country, province, city} = locationAddr;
				let str = province + city;
				if(country != '中国'){
					str = country + str;
				}
				return str;
			},
			/*标记数据*/
			marksData(){
				let list = [].concat(this.$store.state.markerList || []);
				let nations = new Set();
				let markerList = [];
				list.forEach(item => {
					let obj = Object.assign({iconPath: '/static/mark.png'}, item);
					nations.add(item.country);
					markerList.push(obj);
				})
				return {
					markerList,
					nations: Array.from(nations)
				}
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			// 获取用户定位信息 & 获取用户已有记录
			init(){
				Promise.all([this.getList(), this.getLocation()]).then(res => {
					let markList = res[0];
					let localData = res[1] || {};
					let index = markList.findIndex(item => localData.country == item.country && localData.province == item.province && localData.city == item.city);
					this.showPopup = index == -1;
				})
			},
			
			// 获取已标记数据
			getList(){
				return this.$store.dispatch('getList');
			},
			
			// 获取当前位置
			getLocation(){
				return new Promise(resolve => {
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: res => {
							let {address, latitude, longitude} = res;
							let {country, province, city} = address;
							
							city = (!city || Array.isArray(city)) ? province : city;
							province = province.replace(/(壮族自治区|回族自治区|回族自治区|维吾尔自治区|自治区|特别行政区)/, '');
							
							let obj = {country, province, city, latitude, longitude};
							this.locationAddr = obj;
							resolve(obj);
						}
					})
				})
			},
			
			// 点亮当前
			save(){
				const {dispatch} = this.$store;
				const {locationAddr} = this;
				// 先获取城市坐标，不然使用的是实际精确定位
				dispatch('getCoordinate', locationAddr.city).then(res => {
					if(res){
						let [longitude, latitude] = res.location.split(',');
						this.locationAddr.longitude = longitude;
						this.locationAddr.latitude = latitude;
					}
					dispatch('addMark', this.locationAddr).then(res => {
						this.showPopup = false;
					});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-page{display: flex;flex-direction: column;}
	#map{width: 100%;flex: 1;}
	.footer-skin{padding: 20rpx 0 60rpx;}
	.text-block{display: flex;align-items: center;justify-content: center;}
	.link-high{font-size: 42rpx;color: #ff6780;padding: 0 10rpx;text-decoration: underline;}
</style>
