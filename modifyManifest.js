const fs = require('fs');

// manifest.json 文件的内容
let ManifestArr;

// 迭代 ManifestArr 时的开始下标
let startIndex = 1;


/**
 * 执行替换
 * @param {String} path 要修改的属性key
 * @param {String|Boolean|Number} value 修改后的值
 * @param {Boolean} toStr 是否需要转字符串，默认为true
 */
function replaceManifest(path, value, toStr=true) {
	const arr = path.split('.');
	const len = arr.length;
	const lastItem = arr[len - 1];
	let i = 0;
	
	value = toStr ? JSON.stringify(value) : value;

	for (let index = startIndex; index < ManifestArr.length; index++) {
		const item = ManifestArr[index];
		if (new RegExp(`"${arr[i]}"`).test(item)) ++i;
		if (i === len) {
			const hasComma = /,/.test(item);
			ManifestArr[index] = item.replace(
				new RegExp(`"${lastItem}"[\\s\\S]*:[\\s\\S]*`),
				`"${lastItem}": ${value}${hasComma ? ',' : ''}`
			);
			startIndex = index+1;
			break ;
		}
	}
}

/**
 * 初始化方法
 * @param {Object} config 配置对象
 */
function init(config){
	
	// 读取文件
	const manifestPath = './src/manifest.json';
	let Manifest = fs.readFileSync(manifestPath, {
		encoding: 'utf-8'
	})
	ManifestArr = Manifest.split(/\n/);
	
	// 这里修改的顺序从manifset源码视图里面看顺序排列, 每次查找都是从上一轮查找到的下标+1开始找，所以一定要跟源内容保持一样的前后顺序
	replaceManifest('app-plus.distribute.sdkConfigs.maps.amap.name', config.GD_USERNAME);
	replaceManifest('appkey_android', config.GD_ANDROID_KEY);
	replaceManifest('geolocation.amap.name', config.GD_USERNAME);
	replaceManifest('appkey_android', config.GD_ANDROID_KEY);
	
	Manifest = ManifestArr.join('\n');
	// 重新写入
	fs.writeFileSync(manifestPath, Manifest, {
		"flag": "w"
	})
}

module.exports = {
	init
}