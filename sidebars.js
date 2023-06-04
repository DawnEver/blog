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
  ],
}

module.exports = sidebars
