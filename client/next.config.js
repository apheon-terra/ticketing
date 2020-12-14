module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
//loaded autmatically when project starts up
//default webpack config , poll all files once every 300 ms, next mighnt not load all changes in all files so this is a 2nd contingecy mecanism to be sure that they reload indeended of next
// event docker pull container might not be 100 proof
