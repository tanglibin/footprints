<template>
	<uni-popup :ref="refName" :type="type" :is-mask-click="isMaskClick" @open="$emit('opened')">
		<slot></slot>
	</uni-popup>
</template>

<script>
	/**
	 * 弹出层
	 * @property {Boolean} showPopup = [true|false]，v-model:showPop="boolean" 是否显示弹框
	 * @property {String} type 弹出方式
	 * @property {Boolean} isMaskClick 蒙版点击是否关闭弹窗
	 * @event {Function} opened 弹框打开时调用
	 */
	export default {
		name:"m-popup",
		emits:['opened','update:showPopup'],
		props: {
			showPopup: {//是否显示弹框
				type: Boolean,
				default: false
			},
			type: { //是否隐藏右上角的X
				type: String,
				default: 'center'
			},
			isMaskClick: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			// uni弹框对象
			popup(){
				return this.$refs[this.refName];
			},
			// 生成随机码，做ref值使用
			refName(){
				return 'ref_' + (+new Date() + Math.floor(Math.random()*100000000));
			}
		},
		watch:{
			/*监听显示状态，切换显示*/
			showPopup(v){
				v ? this._open() : this.popup.close();
			}
		},
		mounted(){
			if(this.showPopup){
				this._open();
			}
		},
		methods: {
			/*打开弹框*/
			_open(){
				this.popup.open();
			},
			/*关闭弹框*/
			_close(){
				this.$emit('update:showPopup', false)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.center ::v-deep.content-transition{transform: scale(1) translateY(-10%)!important;}
	::v-deep .uni-popup__wrapper{background-color: #fff!important;border-radius: 20rpx;overflow: hidden;}
	.bottom ::v-deep .uni-popup__wrapper{border-radius: 20rpx 20rpx 0 0;}
</style>