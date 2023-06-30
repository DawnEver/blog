module.exports = function (context, options) {
  return {
    name: 'plugin-live2d',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            src: 'https://files.cnblogs.com/files/liuzhou1/L2Dwidget.min.js',
            innerHTML: `
                L2Dwidget.init({
                "model": {
                  jsonPath: '/live2d/chino/model.json',
                  "scale": 1
                },
                "display": {
                  "position": "right", //模型的表现位置
                  "width": 150, //模型的宽度
                  "height": 300, //模型的高度
                  "hOffset": 0,
                  "vOffset": -20
                },
                "mobile": {
                  "show": true,
                  "scale": 0.5
                },
                "react": {
                  "opacityDefault": 0.7, //模型默认透明度
                  "opacityOnHover": 0.2
                }
              });
          `,
          },
        ],
      }
    },
  }
}
