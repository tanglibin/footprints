<template>
	<view class="m-date-picker">
		<view class="input-box" @click="showPop=true">
			<text v-if="curValue">{{curValue}}</text>
			<text v-else class="placeholder">请选择时间</text>
		</view>
		
		<m-picker 
			v-model:showPopup="showPop" 
			:value="array"
			:list="list" 
			@selected="selected"
		/>
	</view>
</template>

<script>
	/**
	 * 年月日级联选择组件
	 * @property {String} modelValue 当前组件值
	 */
	export default {
		name:"m-date-picker",
		emits:['update:modelValue'],
		props: {
			modelValue: String,
		},
		data() {
			return {
				showPop: false, //是否展示下拉数据层
				array: [0, 0, 0], //选中数据下标
				curValue: '', //文本框显示内容
			};
		},
		computed:{
			/*年份数据*/
			years(){
				const nowDate = new Date();
				const nowYear = nowDate.getFullYear();
				const start = nowYear - 90;
				let year = [];
				
				for(let i=start; i<=nowYear; i++ ){
					year.push(i);
				}
				return year;
			},
			
			/*月份数据*/
			months(){
				let month = [];
				for (let i = 1; i <= 12; i++) {
					month.push(i.toString().padStart(2, '0'));
				}
				return month;
			},
			
			/*天数据*/
			days(){
				const {years, months, array} = this;
				const tarDate = new Date(years[array[0]], months[array[1]]);
				tarDate.setDate(0);
				let val = tarDate.getDate();
				let date = [];
				for (let i = 1; i <= val; i++) {
					date.push(i.toString().padStart(2, '0'));
				}
				return date;
			},
			
			/*年月日数据汇总结合，给picker组件用*/
			list(){
				const {years, months, days} = this;
				return [years, months, days];
			}
		},
		watch: {
			modelValue(v){
				this.curValue != v && this.initData();
			},
		},
		created() {
			this.initData();
		},
		methods: {
			/*回显数据选中*/
			initData(){
				const {years, modelValue} = this;
				const lastYear = years.length-1;
				let arr = modelValue ? modelValue.match(/(\d+)/g) : false;
				// 无数据时，年份选择最后一个
				if(!arr){
					this.array = [lastYear, 0, 0];
					return ;
				}
				// 年份选中
				let yearIndex = Math.max(0, years.findIndex(item => item == arr[0]));
				this.$set(this.array, 0, yearIndex || lastYear)
				if(yearIndex == -1){
					return ;
				}
				// 月份选中
				const {months} = this;
				let monthIndex = Math.max(0, months.findIndex(item => item == arr[1]));
				this.$set(this.array, 1, monthIndex);
				
				// 日期选中
				const {days} = this;
				let dateIndex = Math.max(0, days.findIndex(item => item == arr[2]));
				this.$set(this.array, 2, dateIndex);
				
				//填充input显示内容
				this.setInputValue(years[yearIndex], months[monthIndex], days[dateIndex]);
			},
			
			/*填充input显示内容*/
			setInputValue(year, month, day){
				const val = new Date(year, +month-1, day).format();
				this.curValue = val;
				return val;
			},
			
			/*确定选择*/
			selected(arr){
				const {years, months, days} = this;
				this.array = arr;
				this.$emit('update:modelValue', this.setInputValue(years[arr[0]], months[arr[1]], days[arr[2]]));
			}
		}
	}
</script>
<style lang="scss" scoped>
	.m-date-picker, .input-box{height: 100%;}
</style>