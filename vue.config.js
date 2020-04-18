module.exports = {
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.(fs|vs)$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
      .rule('worker')
      .test(/\.worker\.ts$/)
      .use('worker-loader')
      .loader('worker-loader')
      .end();
  }
};
