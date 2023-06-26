module.exports = function (context, options) {
  return {
    name: 'plugin-dynamic-title',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
            var OriginTitile = document.title,titleTime;
            document.addEventListener("visibilitychange",function(){if(document.hidden)
            {    
                document.title ="糟糕,网页已崩溃! っ °Д °;)っ";
                clearTimeout(titleTime)
            }else{
                document.title ="(/≧▽≦/)嘻嘻，骗你的！";
                titleTime =setTimeout(
                  function(){
                    document.title = OriginTitile
                  },2000)
            }});
          `,
          },
        ],
      }
    },
  }
}
