<template>
	<text :class="['font-icon', type]"></text>
</template>

<script>
	/**
	 * 图标组件
	 * @property {String} type 通过名称指定字体图标
	 */
	export default {
		name: 'm-icon',
		props: {
			type: String,
		},
	}
</script>

<style lang="scss" scoped>
	.img-icon{background-size: contain;background-repeat: no-repeat;}
	
	@font-face {
		font-display: auto;
		font-family: font-icon;
		font-style: normal;
		src: url('./iconfont.ttf') format("truetype")
	}
	.font-icon {
		&{
			text-rendering: auto;
			-webkit-font-smoothing: antialiased;
			font-style: normal;
			font-variant-ligatures: normal;
			font-variant-caps: normal;
			font-variant-numeric: normal;
			font-variant-east-asian: normal;
			font-stretch: normal;
			line-height: 1;
			font-family: font-icon;
		}
		&.del:before {content: "\e84d";}
		&.back:before {content: "\e8ef";}
		&.more:before {content: "\e63f";}
	}
</style>