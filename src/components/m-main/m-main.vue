<template>
	<view class="main">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="navigation">
			<m-icon type="back" @click="backHandler"/>
			<view class="navigation-text">{{navigation}}</view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name:"m-main",
		emits: ['navBack'],
		props: {
			back: {
				type: String
			},
			navigation: {
				type: String
			},
		},
		data() {
			return {
				
			};
		},
		methods: {
			/*返回处理*/
			backHandler(){
				let {back} = this;
				this.$emit('navBack');
				back && this.Util.goBack(back);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{height: 100%;}
	.navigation{position: relative;color: #fff;height: $navigationHeight;line-height: $navigationHeight;background-color: $navigationBgColor;}
	.back{position: absolute;font-size: 46rpx;top: 22rpx;left: 20rpx;}
	.navigation-text{font-size: 32rpx;text-align: center;}
</style>