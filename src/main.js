import { createSSRApp } from "vue";
import App from "./App.vue";
import '@js/extend.js'
import Util from '@js/util.js'
import store from "./store";

export function createApp() {
	const app = createSSRApp(App);
	app.use(store);
	
	// 扩展自定义方法到原型
	Object.assign(app.config.globalProperties, {
		Util, //工具类对象
	})
	return {
		app,
	};
}
