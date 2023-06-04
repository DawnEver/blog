/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  skill: [
    'skill/introduction',
    {
      label: 'Docusaurus 主题魔改',
      type: 'category',
      link: {
        type: 'doc',
        id: 'skill/docusaurus/docusaurus-guides'
      },
      items: [
        'skill/docusaurus/docusaurus-config',
      ],
    },
    {
      label: '代码规范',
      type: 'category',
      link: {
        type: 'doc',
        id: 'skill/code-specification/code-specification-guides'
      },
      items: [
        'skill/code-specification/eslint',
      ],
    },
  ],
  tools: [
    'tools/introduction',
  ]
}

module.exports = sidebars
