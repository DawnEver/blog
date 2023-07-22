module.exports = function (context, options) {
  return {
    name: 'plugin-mousemove-contaner',
    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'script',
            innerHTML: `
            document.addEventListener('mousemove', parallax);
            function parallax(e) {
                this.querySelectorAll('.mousemove_contaner').forEach(mousemove_contaner => {
                    const speed = mousemove_contaner.getAttribute('data-speed')

                    const x = (window.innerWidth - e.pageX * speed) / 75
                    const y = (window.innerHeight - e.pageY * speed) / 75

                    mousemove_contaner.style.transform = 'translateX'+x+'px) translateY('+y+'px)'
                })
            }
          `,
          },
        ],
      }
    },
  }
}
