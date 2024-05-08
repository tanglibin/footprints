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

export default defineConfig({
	plugins: [
		uni(),
	],
	resolve: {
		alias: {
			'@image': resolve('./src/assets/image'),
			'@js': resolve('./src/assets/js'),
		}
	},
})
