<template>
	<m-main navigation="新增足迹" class="add-page" @navBack="navBack">
		<view class="add-form">
			<view class="row">
				<view class="label">到达时间:</view>
				<view class="cell">
					<m-date-picker v-model="date"/>
				</view>
			</view>
			<view class="row">
				<view class="label">地点:</view>
				<view class="cell" @click="showRegion=true">
					<text v-if="address">{{address}}</text>
					<text v-else class="placeholder">请选择地点</text>
				</view>
			</view>
			
			<button class="btn savebtn" @click="save">保存</button>
		</view>
		
		<region v-model="showRegion" @select="selectRegion"/>
	</m-main>
</template>

<script>
	import Region from './components/region.vue'
	export default {
		components: {
			Region
		},
		data() {
			return {
				showRegion: false, //是否显示城市选择浮层
				date: '', //时间
				address: '', 
				regionData: null,
			};
		},
		methods: {
			/*页面返回按钮处理*/
			navBack(){
				if(this.showRegion){
					this.showRegion = false;
					return ;
				}
				this.Util.goBack('list');
			},
			
			/*地点选中*/
			selectRegion(data){
				this.regionData = data;
				let {province, city} = data;
				this.address = (city.startsWith(province) ? '' : province) + city;
			},
			
			/*保存*/
			save(){
				let {date, regionData} = this;
				if(!date || !regionData){
					uni.showToast({
						title: '内容填写不完整',
						duration: 3000,
					    icon: 'error'
					});
					return ;
				}
				let id = +new Date(date);
				let obj = Object.assign({id}, regionData, {date});
				this.$store.dispatch('addMark', obj).then(res => {
					this.navBack();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-form{padding-top: 20rpx;}
	.row{display: flex;height: 80rpx;line-height: 80rpx;border-bottom: 1px solid #ccc;font-size: 28rpx;padding: 0 20rpx;}
	.label{text-align: right;width: 140rpx;margin-right: 12rpx;color: #808080;}
	.cell{color: #333;height: 100%;flex: 1;}
	.savebtn{margin-top: 120rpx;}
</style>
