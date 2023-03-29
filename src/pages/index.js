import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import logo from '@site/static/img/docusaurus.png';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
      <img src={logo} style={{ width: 280, borderRadius: '50%' }} />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      description="我希望我在意的人每天都能很快乐~>">
        <Head>
          <title>欢迎来到我的博客~</title>
        </Head>
      <HomepageHeader />
      <main>
        <br />
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
