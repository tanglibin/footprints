<script>
export default {
	onLaunch: function () {
		// #ifdef APP-PLUS
		plus.screen.lockOrientation("portrait-primary"); // 锁定竖屏
		// #endif
	},
}
</script>

<style lang="scss">
	@import "@/assets/sass/main.scss";
</style>