<template>
	<m-popup type="bottom" v-bind="$attrs">
		<view class="operate">
			<view class="cancel" @click="$emit('update:showPopup', false)">取消</view>
			<view class="ok" @click="okHandler">确定</view>
		</view>
		<view v-if="column.length" class="column-cell">
			<view class="column-cell--item" v-for="(item, i) in column" :key="i">{{item}}</view>
		</view>
		<picker-view :value="selIndexList" @change="handlerChange" class="picker-view" mask-class="custom-mask" indicator-class="custom-indicator">
			<picker-view-column v-for="(ele, i) in columnNum" :key="i">
				<view class="item" v-for="(item, index) in list[i]" :key="index">{{item}}</view>
			</picker-view-column>
		</picker-view>
	</m-popup>
</template>

<script>
	/**
	 * 底部弹出滚拨选择
	 * @property {Array} value 默认数据选中下标，如[0,0,0]则表示 默认选中list数组每一列中的第一条
	 * @property {Array} list 下拉备选数据，多维数组[ [], [], ... ]
	 * 
	 * @event {Function} selected 确认选中时调用。值为Array,选中的下标
	 */
	export default {
		name:"m-picker",
		emits:['selected','update:showPopup'],
		props: {
			value: {//默认数据
				type: Array,
				default(){
					return []
				}
			},
			list: {//下拉备选数据
				type: Array,
				default(){
					return []
				}
			},
			column: {//列头显示文案
				type: Array,
				default(){
					return []
				}
			}
		},
		computed: {
			columnNum(){
				return this.list.length;
			},
			selIndexList(){
				const {value, columnNum} = this;
				if(value.length){
					return value;
				}
				return Array.from({length: columnNum}, () => 0);
			}
		},
		methods: {
			/*值修改*/
			handlerChange(e){
				const val = e.detail.value
				this._sel_val_ = val;
			},
			/*弹框关闭*/
			okHandler(){
				this.$emit('update:showPopup', false);
				this.$emit('selected', this._sel_val_ || this.selIndexList);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.picker-view {height: 400rpx;background-color: #fff;color: #333;}
	.item {align-items: center;justify-content: center;text-align: center;height: 72rpx;line-height: 72rpx;}
	::v-deep.custom-indicator{
		&{height: 72rpx;line-height: 72rpx;color: #fff;border: solid #efefef;border-width: 1px 0;}
		&:before, &:after{border: none;}
	}
	
	.operate{display: flex;justify-content: space-between;align-items: center;height: 90rpx;border-bottom: 1px solid #efefef;}
	.cancel, .ok{padding: 0 30rpx;}
	.cancel{font-size: 28rpx;color: #808080;}
	.ok{font-size: 30rpx;color: #1AAD19;}
</style>