// @ts-check

function createApiSidebar(name) {
  return [
    {
      type: 'category',
      label: 'Modules',
      collapsed: false,
      link: {
        type: 'generated-index',
        slug: name,
      },
      items: [{type: 'autogenerated', dirName: `${name}/modules`}],
    },
    {
      type: 'category',
      label: 'Classes',
      link: {
        type: 'generated-index',
        slug: `${name}/classes`,
      },
      items: [{type: 'autogenerated', dirName: `${name}/classes`}],
    },
    {
      type: 'category',
      label: 'Enumerations',
      link: {
        type: 'generated-index',
        slug: `${name}/enums`,
      },
      items: [{type: 'autogenerated', dirName: `${name}/enums`}],
    },
    {
      type: 'category',
      label: 'Interfaces',
      link: {
        type: 'generated-index',
        slug: `${name}/interfaces`,
      },
      items: [{type: 'autogenerated', dirName: `${name}/interfaces`}],
    },
  ];
}

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  guides: [{type: 'autogenerated', dirName: 'guides'}],
  api: [
    {
      type: 'category',
      label: 'Core',
      items: createApiSidebar('core-api'),
    },
    {
      type: 'category',
      label: 'Legacy',
      items: createApiSidebar('legacy-api'),
    },
  ],
};

module.exports = sidebars;