<template>
	<m-main back="list" navigation="足迹详情" class="info-page">
		<m-icon type="more" @click="showPopup=true"/>
		
		<template v-if="cityData && dateData">
			<scroll-view class="scroll-view" scroll-y scroll-with-animation>
				<!-- 以城市分组展示 -->
				<view v-if="tabIndex === 0" class="wrap">
					<view class="city-skin" v-for="([title, list], index1) in cityData.entries()" :key="'c'+index1">
						<view class="left-block">{{title}}</view>
						<view class="city-box">
							<view class="city-item" v-for="(item, index) in list" :key="'cn_'+index" >
								<text class="city-text">{{item.city || item.province}}</text>
								<text class="city-date-text">({{item.date}})</text>
								<m-icon type="del" class="del-icon" v-if="showDelBtn" @click="delConfirm(item)"/>
							</view>
						</view>
					</view>
				</view>
			
				<!-- 以时间线展示 -->
				<view v-if="tabIndex === 1" class="wrap">
					<view :class="['skin', 'skin_'+index2]" v-for="([title, list], index2) in dateData.entries()" :key="'d'+index2">
						<view class="skin-item left-year">
							<view class="year-block">
								<text class="year-text">{{title}}</text>
							</view>
						</view>
						<view class="skin-item right-box">
							<view class="datelist-item" v-for="(item, index) in list" :key="'dn'+index">
								<text class="date-text">({{formatDate(item.date)}})</text>
								<text class="city-text">{{item.country == '中国' ? '' : (item.country+'-')}}{{item.city || item.province}}</text>
								<m-icon type="del" class="del-icon" v-if="showDelBtn" @click="delConfirm(item)"/>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 下方按钮 -->
			<view class="foot-btn">
				<button class="btn" @click="Util.goBack('list')">返回地图</button>
			</view>
		</template>
		
		<!-- 操作sheet页 -->
		<m-popup v-model:showPopup="showPopup" type="bottom">
			<view class="sheet" @click="showPopup=false">
				<view class="row" @click="tabIndex=0">按城市分组展示</view>
				<view class="row" @click="tabIndex=1">按年份时间线展示</view>
				<view class="row" @click="showDelBtn=!showDelBtn">{{showDelBtn ? '取消编辑' : '编辑'}}</view>
				<view class="row cancel-row">取消</view>
			</view>
		</m-popup>
		
		<!-- 删除确认框 -->
		<m-popup type="bottom" v-model:showPopup="showPopup2">
			<view class="confirm-box">
				<text>是否确认在数据中删除</text>
				<text class="high">【{{delTitle}}】</text>
				<text>?</text>
			</view>
			<view class="footer-btn-box">
			  <view class="cancel" @click="showPopup2=false">取消</view>
			  <view class="ok" @click="delSubmit">确认</view>
			</view>
		</m-popup>
	</m-main>
</template>

<script>
	export default {
		data() {
			return {
				count: 0, //原始数据数量
				cityData: null,//以城市分组数据
				dateData: null,//以年份分组数据
				tabIndex: 0, //0: 展示 cityList， 1：展示 dateList
				
				showPopup: false, //展示操作弹框
				showDelBtn: false, //是否显示删除按钮
				
				delId: null,//删除数据对象id
				delTitle: '',//删除提示
				showPopup2: false, //删除确认框
			};
		},
		created() {
			this.getList();
		},
		methods: {
			/*获取数据*/
			getList(){
				this.$store.dispatch('getList').then(list => {
					let markList = JSON.parse(JSON.stringify(list));
					this.count = list.length;
					
					// 按时间排序
					markList.sort((a, b) => b.id - a.id);
					
					let obj_city = new Map();//以城市分组数据
					let obj_date = new Map();//以年份分组数据
					
					markList.forEach(item => {
						item.province = item.province.replace(/省$/, '');
						item.city = item.city.replace(/市$/, '');

						// 按城市分组
						let key = item.country == '中国' ? item.province : item.country;
						let ctiyArr = obj_city.get(key);
						ctiyArr ? ctiyArr.push(item) : obj_city.set(key, [item]);
						

						// 按年份分组
						let year = item.date.substr(0, 4);
						let dateArr = obj_date.get(year);
						dateArr ? dateArr.push(item) : obj_date.set(year, [item]);
					});
					
					this.cityData = obj_city;
					this.dateData = obj_date;
				})
			},
			
			/*格式化时间*/
			formatDate(date){
				return new Date(date).format('MM.dd');
			},
			
			/*删除确认*/
			delConfirm(item){
				let {country, city, id} = item;
				let title = city;
				if(this.tabIndex){
					title = (country == '中国' ? '' : `${country}-`) + title;
				}
				this.delTitle = title;
				this.delId = id;
				this.showPopup2 = true;
			},
			
			/*删除执行*/
			delSubmit(){
				this.showPopup2 = false;
				this.$store.dispatch('delMark', this.delId).then(res => {
					this.count --;
					if(this.count <= 0){
						this.Util.goBack('list');
					}else{
						this.getList();
					}
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.info-page{display: flex;flex-direction: column;font-size: 28rpx;color: #333;}
	.more{position: fixed;top: calc($navigationHeight + var(--status-bar-height));right: 0;z-index: 2;color: #ccc;font-size: 40rpx;padding: 20rpx;}
	.scroll-view{flex: 1;overflow: hidden;}
	.skin{display: flex;}
	.skin_0 .skin-item{padding-top: 60rpx;}
	.left-year{width: 160rpx;text-align: right;border-right: 2rpx solid #999;line-height: 50rpx;}
	.right-box{margin-bottom: 50rpx;}
	
	.year-block, .datelist-item{display: flex;align-items: center;}
	.year-block:after, .datelist-item:before{content:'';border-top: 2rpx solid #999;width: 20rpx;}
	.year-block{justify-content: flex-end;}
	.year-text{padding-right: 20rpx;}
	.datelist-item{line-height: 50rpx;}
	.datelist-item:before{content:'';border-top: 2rpx solid #999;width: 20rpx;}
	.date-text{font-size: 24rpx;color: #666;margin-right: 12rpx;padding-left: 20rpx;}
	
	.city-skin{padding-top: 40rpx;}
	.left-block{padding-left: 30rpx;color: #ff6780;}
	.city-box{padding-left: 80rpx;}
	.city-date-text{font-size: 24rpx;color: #999;margin-left: 12rpx;}
	.city-item{line-height: 46rpx;display: flex;align-items: center;}
	.del-icon{width: 32rpx;margin-left: 24rpx;}
	
	.row{text-align: center;line-height: 90rpx;border-bottom: 1px solid #efefef;}
	.cancel-row{border-top: 15rpx solid #efefef;border-bottom: none;}
</style>
