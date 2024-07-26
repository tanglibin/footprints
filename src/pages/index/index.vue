<template>
	<view class="index-page">
		<view class="index-wrap">
			<view class="title-box">
			  <view class="title">记录你去过的山山水水</view>
			  <view class="title">生成你的专属足迹地图，分享你走过的世界。</view>
			</view>
			<image class="earth-icon" mode="widthFix" src="@image/earth.png"></image>
			
			<button @click="startFootprints" class="btn">开启足迹</button>
		</view>
		
		<m-popup v-model:showPopup="showPopup">
			<view class="mobile-popup">
				<input class="mobile-input" type="number" v-model="username" placeholder="请输入手机号码"/>
				<view class="footer-btn-box">
					<view class="cancel" @click="showPopup=false">取消</view>
					<view class="ok" @click="submitHandler">确定</view>
				</view>
			</view>
		</m-popup>
	</view>
</template>
 
<script>
export default {
	data() {
		return {
			showPopup: false,
			username: ''
		}
	},
	methods: {
		/*开启足迹*/
		startFootprints(){
			if(this.$store.state.username){
				return this.Util.goTo('list')
			}
			this.showPopup = true;
		},
		
		submitHandler(){
			this.showPopup = false;
			let {username} = this;
			if(!/^(15889453525|17872983523)$/.test(username)){
				return uni.showToast({
					title: '系统错误',
					duration: 3000,
				    icon: 'error'
				});
			}
			this.$store.commit('setUsername', username);
			this.Util.goTo('list');
		}
	}
}
</script>

<style lang="scss" scoped>
	.index-page {height: 100%;text-align: center;background-image: linear-gradient(to bottom, #142437, #406694, #142437);}
	.index-wrap{transform: translateY(20%);}
	.title-box{padding: 40rpx 0 100rpx;}
	.title{font-size: 32rpx;color: #ff6780;line-height: 80rpx;}
	
	@keyframes turn{
	  0%{transform:rotate(0deg);}
	  50%{transform:rotate(180deg);}
	  100%{transform:rotate(360deg);}
	}
	.earth-icon{width: 70%;max-width: 1140rpx;animation:turn 15s linear infinite;}
	.btn{margin-top: 120rpx;}
	
	.mobile-popup{padding-top: 30rpx;font-size: 28rpx;}
	.mobile-input{border: 1px solid #efefef;text-align: left;padding: 0 20rpx;height: 80rpx;margin: 0 30rpx 40rpx;}
	::v-deep .input-placeholder{font-size: 24rpx;}
</style>