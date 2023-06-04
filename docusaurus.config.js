const path = require('path')
// const beian = '闽ICP备2020017848号-2'

const announcementBarContent = ''

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Bennett的小站',
  titleDelimiter: '-',
  url: 'https://bennett.hi-motor.site',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'bennett',
  projectName: 'blog',
  tagline: '是如盛夏一般热烈的火焰，燃起了蒲公英的花海……',
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  themeConfig: {
    image: 'img/logo.png',
    // announcementBar: {
    //   id: 'announcementBar-3',
    //   content: announcementBarContent,
    // },
    metadata: [
      {
        name: 'keywords',
        content: 'Bennett',
      },
      {
        name: 'keywords',
        content: 'blog',
      },
      {
        name: 'keywords',
        content: '博客',
      },
    ],
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'Bennett',
      logo: {
        alt: 'Bennett',
        src: 'img/logo.webp',
        srcDark: 'img/logo.webp',
      },
      hideOnScroll: true,
      items: [
        {
          label: '学习',
          position: 'right',
          items: [
            {
              label: '标签',
              to: 'tags',
            },
            {
              label: '归档',
              to: 'archive',
            },
          ],
        },
        {
          label: '工具',
          position: 'right',
          items: [
            {
              label: 'Hi-Motor Bot',
              to: 'https://bot.hi-motor.site',
            },
            {
              label: 'ChatGPT',
              to: 'https://chat.hi-motor.site',
            },
            {
              label: 'Team Gitea',
              to: 'https://gitea.hi-motor.site',
            },
          ],
        },
        {
          label: '导航',
          position: 'right',
          to: 'resource',
        },
        {
          label: '项目',
          position: 'right',
          to: 'project',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '学习',
          items: [
            {
              label: '标签',
              to: 'tags',
            },
            {
              label: '归档',
              to: 'archive',
            },
            {
              label: '项目',
              to: 'project',
            },
          ],
        },
        {
          title: '社交媒体',
          items: [
            {
              label: '关于我',
              to: '/about',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/DawnEver',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '导航',
              position: 'right',
              to: 'resource',
            },
            {
              label: '友链',
              position: 'right',
              to: 'friends',
            },
             {
              html: `<a href="https://docusaurus.io/zh-CN/" target="_blank"><img style="height:50px;margin-top:0.5rem" src="/img/buildwith.png" /><a/>`,
            },
          ],
        },  
      ],
      // copyright: `<p><a href="http://beian.miit.gov.cn/" >${beian}</a></p><p>Copyright © 2023 - PRESENT Bennett Built with Docusaurus.</p>`,
      copyright: `<p>Copyright © 2023 - PRESENT Bennett Built with Docusaurus.</p>`,
    },
    prism: {
      theme: require('prism-react-renderer/themes/vsLight'),
      darkTheme: require('prism-react-renderer/themes/vsDark'),
      additionalLanguages: ['java', 'php', 'rust', 'toml'],
      defaultLanguage: 'javascript',
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    algolia: {
      appId: 'GV6YN1ODMO',
      apiKey: '50303937b0e4630bec4a20a14e3b7872',
      indexName: 'bennett',
    },
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
      config: {},
    },
    matomo: {
      matomoUrl: 'https://matomo.bennett.cn/',
      siteId: '1',
      phpLoader: 'matomo.php',
      jsLoader: 'matomo.js',
    },
    giscus: {
      repo: 'bennett/blog',
      repoId: 'MDEwOlJlcG9zaXRvcnkzOTc2MjU2MTI=',
      category: 'General',
      categoryId: 'DIC_kwDOF7NJDM4CPK95',
      theme: 'light',
      darkTheme: 'dark',
    },
    liveCodeBlock: {
      playgroundPosition: 'top',
    },
    socials: {
      github: 'https://github.com/DawnEver',
      wexin: '17834720317',
      zhihu: 'https://www.zhihu.com/people/ming-ji-zhao-yang',
    },
  },
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'Bennett的个人博客',
      },
    },
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          sidebarPath: 'sidebars.js',
        },
        blog: false,
        theme: {
          customCss: [require.resolve('./src/css/custom.scss')],
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.5,
        },
        gtag: {
          trackingID: 'G-S4SD5NXWXF',
          anonymizeIP: true,
        },
        // debug: true,
      }),
    ],
  ],
  // themes: ['@docusaurus/theme-live-codeblock'],
  plugins: [
    'docusaurus-plugin-matomo',
    'docusaurus-plugin-image-zoom',
    'docusaurus-plugin-sass',
    path.resolve(__dirname, './src/plugin/plugin-baidu-tongji'),
    path.resolve(__dirname, './src/plugin/plugin-baidu-push'),
    [
      path.resolve(__dirname, './src/plugin/plugin-content-blog'),
      {
        path: 'blog',
        routeBasePath: '/',
        editUrl: ({ locale, blogDirPath, blogPath, permalink }) =>
          `https://github.com/DawnEver/blog/edit/main/${blogDirPath}/${blogPath}`,
        editLocalizedFiles: false,
        blogDescription: 'Bennett的个人博客',
        blogSidebarCount: 10,
        blogSidebarTitle: '最近更新',
        postsPerPage: 10,
        showReadingTime: true,
        readingTime: ({ content, frontMatter, defaultReadingTime }) =>
          defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
        feedOptions: {
          type: 'all',
          title: 'Bennett',
          // copyright: `Copyright © ${new Date().getFullYear()} Bennett Built with Docusaurus.<p><a href="http://beian.miit.gov.cn/" class="footer_lin">${beian}</a></p>`,
          copyright: `Copyright © ${new Date().getFullYear()} Bennett Built with Docusaurus.`,

        },
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        disableInDev: false,
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/logo.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(51 139 255)',
          },
        ],
      },
    ],
  ],
  stylesheets: [],
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['en', 'zh-CN'],
    localeConfigs: {
      en: {
        htmlLang: 'en-GB',
      },
    },
  },
}

module.exports = config
