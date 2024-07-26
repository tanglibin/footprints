<template>
	<uni-drawer ref="drawer" class="region-drawer" mode="right">
		<view class="region-box">
			<!-- 左侧省 -->
			<view class="province">
				<scroll-view 
					class="scroll-view" 
					scroll-y 
					:scroll-into-view="'p_'+provinceActive" 
					:scroll-with-animation="true" 
				>
					<view 
						v-for="(item, index) in region"
						:key="'p_'+index" 
						:id="'p_'+index" 
						:class="['province-item', index == provinceActive ? 'active' : '']" 
						@click="provinceActive = index"
					>
						{{item.province}}
					</view>
				</scroll-view>
			</view>
			<!-- 右侧市 -->
			<view class="city">
				<scroll-view 
					class="scroll-view" 
					scroll-y="true" 
					:scroll-into-view="'c_' + provinceActive" 
					:scroll-with-animation="true" 
				>
					<view v-for="(item, index) in region" class="city-skin" :key="'c_' + index" :id="'c_' + index">
						<text class="province-txt">{{item.province}}</text>
						<view class="city-box">
							<view 
								v-for="(city, idx) in item.city" :key="'i_' + index"
								:class="['city-item', index==provinceActive && idx===cityActive ? 'active' : '']" 
								@click="chooseCity(index, idx)"
							>
								{{city}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- 下方按钮 -->
		<view class="foot-btn">
			<button class="btn okbtn" @click="select">确定</button>
		</view>
	</uni-drawer>
</template>

<script>
	import Region from '@js/region.js'
	export default {
		emits: ['update:modelValue', 'select'],
		props: {
			modelValue: Boolean,
		},
		data() {
			return {
				region: Region,
				provinceActive: 0, //省选择下标
				cityActive: '', //市选择下标
			};
		},
		watch: {
			// 监听v-model的值，处理抽屉打开与关闭
			modelValue: {
				handler: 'switchOpen',
				immediate: true
			},
		},
		methods: {
			/*抽屉开启关闭处理*/
			switchOpen(open){
				const {drawer} = this.$refs;
				if(!drawer) return ;
				if(!open) return drawer.close();
				
				drawer.open();
			},
			
			/**市选择 */
			chooseCity(pIndex, cIndex){
				this.provinceActive = pIndex;
				this.cityActive = cIndex;
			},
			
			/*选中处理*/
			select(){
				const {provinceActive, cityActive} = this;
				if(!Number.isInteger(cityActive)){
					return this.$emit('update:modelValue', false);
				}
				let country = '中国';
				let province = '';
				let city = '';
				let latitude = '';
				let longitude = '';
				
				if(!provinceActive){
					city = province = Region[0]['city'][cityActive];
				}else{
					let selData = Region[provinceActive];
					province = selData.province;
					city = selData.city[cityActive];
				}
				
				let cacheMarkList = this.$store.state.markerList;
				let index = cacheMarkList.findIndex(item => item.country == country && item.province.startsWith(province) && item.city.startsWith(city));
				
				if(index != -1){
					uni.showToast({
						title: '地点已存在标记',
						duration: 3000,
					    icon: 'error'
					});
					return ;
				}
				
				this.$store.dispatch('getCoordinate', city+'市').then(res => {
					if(!res){
						uni.showToast({
							title: '系统错误-1',
							duration: 3000,
						    icon: 'error'
						});
						return ;
					}
					let zb = res.location.split(',');
					
					city = (!res.city || Array.isArray(res.city)) ? res.province : res.city;
					province = res.province.replace(/(壮族自治区|回族自治区|回族自治区|维吾尔自治区|自治区|特别行政区)/, '');
					
					latitude = zb[1];
					longitude = zb[0];
					
					this.$emit('update:modelValue', false);
					this.$emit('select', {country, province, city, latitude, longitude});
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-drawer{top: calc($navigationHeight + var(--status-bar-height));}
	::v-deep .uni-drawer__content{width: 100%!important;}
	.region-box{
		height: 100%;background-image: linear-gradient(to bottom, #142437, #406694, #142437);box-sizing: border-box;
		border-top: 2rpx solid #666;display: flex;color: #fff;overflow: hidden;
	}
	.scroll-view{height: 100%;}
	.province{width: 160rpx;text-align: center;background-color: #102f56;padding-bottom: 140rpx;}
	.province-item{line-height: 80rpx;}
	.province-item.active{background-color: #142437;color: #ff6780;}
	
	.city{flex: 1;padding-left: 30rpx;padding-bottom: 140rpx;}
	.province-txt{color: #ff6780;padding: 30rpx 0 20rpx;display: block;}
	.city-item{
		border: 2rpx solid #fff;border-radius: 8rpx;display: inline-block;
		line-height: 70rpx;padding: 0 16rpx;min-width: 84rpx;text-align: center;margin: 0 24rpx 24rpx 0;
	}
	.city-item.active{border-color: #ff6780;color: #ff6780;}
	
	.foot-btn{background: rgba(0,0,0,0.3);position: fixed;bottom: 0;left: 0;right: 0;}
</style>
