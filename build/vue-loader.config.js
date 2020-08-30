module.exports = (isDev) => {
  return {
    preserveWhitepace: true,//删除意外空格
    extractCSS: !isDev,//单独打包css
    cssModules: {
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
      camelCase: true
    },
    // hotReload: false, // 根据环境变量生成
  }
}