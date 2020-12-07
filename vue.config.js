module.exports = {
  configureWebpack: {
    resolve: {
      alias: { //别名的配置
        // '@' : 'src', //默认的配置
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}