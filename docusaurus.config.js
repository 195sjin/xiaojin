// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '小衿',
  tagline: '看见我在玩，请让我去学习~~',
  favicon: 'https://raw.githubusercontent.com/195sjin/myBed/master/imagesnull6123db53828f200b.jpg',
  url: 'https://www.xiaojin.space/',
  baseUrl: '/',
  plugins: [
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'second-blog',
        blogSidebarTitle: '一些小细节',
        blogTitle: '记录小细节',
        routeBasePath: 'essay',
        path: './essay',
      },
    ]
  ],
  
  
  
  organizationName: '195sjin', // Usually your GitHub org/user name.
  projectName: 'xiaojin', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateAuthor: true,
          editUrl:
            'https://github.com/195sjin/xiaojin/tree/main/',
        },
        blog: {
          blogTitle: '博客',
          blogSidebarTitle: '全部博文',
          blogSidebarCount: 'ALL',
          showReadingTime: true,
   
          editUrl:
            'https://github.com/195sjin/xiaojin/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
    
      // Replace with your project's social card
      colorMode: {
        respectPrefersColorScheme: true
      },
      image: 'https://raw.githubusercontent.com/195sjin/myBed/master/images202303261751113.jpg',
      navbar: {
        title: '小衿的博客',
        logo: {
          alt: 'Logo',
          src: 'https://raw.githubusercontent.com/195sjin/myBed/master/images763051812fbd4568.jpg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '生活',
          },
          {
            to: '/blog', 
            label: '学习', 
            position: 'left'},
          {
            to: '/essay',
            label: '小细节',
            position: 'left'
          },
          {
            href: 'https://github.com/195sjin',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        defaultLanguage: 'javascript',
      },
    }),
    
};

module.exports = config;
