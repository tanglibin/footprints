import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

/**
 * url处理
 * @param {String} dir 相对路径
 * @returns String
 */
function resolve(dir){
    return path.resolve(__dirname, dir)
}

/**
 * 修改manifest.json文件
 */
function modifyManifest(config){
	const modifyManifest = require('./modifyManifest.js');
	modifyManifest.init(...arguments);
}

export default ({ mode }) => {
	
	const VITE_CONFIG = require('./src/config.js');
	modifyManifest(VITE_CONFIG);
	
	return defineConfig({
		plugins: [
			uni(),
		],
		define: {
			VITE_CONFIG
		},
		resolve: {
			alias: {
				'@image': resolve('./src/assets/image'),
				'@js': resolve('./src/assets/js'),
			}
		},
	})
	
}