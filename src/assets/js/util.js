/**
 * 页面跳转
 * @param {String} pageName 页面文件名称
 */
function goTo(pageName){
	uni.navigateTo({url: `/pages/${pageName}/${pageName}`})
}

/**
 * 页面返回
 * @param {String} pageName 页面文件名称
 */
function goBack(pageName){
	let pages = getCurrentPages();
	if(pages.length == 1){
		uni.redirectTo({url: `/pages/${pageName}/${pageName}`})
	}else{
		uni.navigateBack()
	}
}
export default{
	goTo, //页面跳转
	goBack, //页面返回
}