import React from 'react'

import { useTrail, animated } from '@react-spring/web'
import Translate from '@docusaurus/Translate'
import { useThemeConfig} from '@docusaurus/theme-common'
import { ThemeConfig } from '@docusaurus/preset-classic'

import Link from '@docusaurus/Link'

import HeroMain from './img/hero_main.svg'


import { Icon } from '@iconify/react'

import styles from './styles.module.scss'


function Hero() {
  const trails = useTrail(4, {
    from: { opacity: 0, transform: 'translate3d(0px, 2em, 0px)' },
    to: { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' },
    config: {
      mass: 3,
      tension: 460,
      friction: 45,
    },
  })

  return (
    <animated.div className={styles.hero}>
      <div className={styles.bloghome__intro}>
        <animated.div style={trails[0]} className={styles.hero_text}>
          <Translate id="homepage.hero.greet">你好! 我是</Translate>
          <span className={styles.intro__name}>
            <Translate id="homepage.hero.name">Bennett</Translate>
          </span>
        </animated.div>
        <animated.p style={trails[1]}>
          <Translate id="homepage.hero.text">
            {`欢迎来到我的思想自留地。`}
          </Translate>

        </animated.p>
        <SocialLinks style={trails[2]} />
        <animated.div style={trails[3]}>
          <a className={styles.intro} href={'./about'}>
            <Translate id="hompage.hero.introduce">自我介绍</Translate>
          </a>
        </animated.div>
      </div>

      <div className={styles.bloghome__image}>
        {/* <HeroMain /> */}
      </div>
      
    </animated.div>
  )
}

export function SocialLinks({ ...prop }) {
  const themeConfig = useThemeConfig() as ThemeConfig

  const socials = themeConfig.socials as {
    github: string
    twitter: string
    juejin: string
    csdn: string
    qq: string
    wx: string
    cloudmusic: string
    zhihu: string
  }

  return (
    <animated.div className={styles.social__links} {...prop}>
      <a href="/rss.xml" target="_blank">
        <Icon icon="ri:rss-line" />
      </a>
      <a href={socials.github} target="_blank">
        <Icon icon="ri:github-line" />
      </a>
      <a href={socials.zhihu} target="_blank">
        <Icon icon="ri:zhihu-line" />
      </a>
      <a href="/img/qrcode/wechat.jpeg">
        <Icon icon="ri:wechat-line" target="_blank" />
      </a>
      <a href="/img/qrcode/qq.png">
        <Icon icon="ri:qq-line" target="_blank"/>
      </a>
      <a href="mailto:mingyangbao@hust.edu.cn">
        <Icon icon="ri:mail-open-line" target="_blank" />
      </a>


    </animated.div>
  )
}

export default Hero
