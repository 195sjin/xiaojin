import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '摸鱼',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        放松一下吧~
        <a target="_blank" rel=" " href="https://www.bilibili.com/">
          Bilibili
        </a>
      </>
    ),
  },
  {
    title: '关于我',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: <>希望能一直开心快乐~</>,
  },
  {
    title: '联系我',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>Email: zijin195@163.com</>,
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">{/* <Svg className={styles.featureSvg} role="img" /> */}</div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
