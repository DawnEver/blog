export const Friends: Friend[] = [
  {
    title: 'Benjamin',
    description: '我',
    website: 'https://bmy.asia/',
    avatar: '/img/icons/icon-color.svg',
  },  
  {
    title: 'Lu Shuyu',
    description: '卢仙',
    website: 'https://lushuyu.site/',
    avatar: 'https://lushuyu.site/resource/icon.jpg',
  },  
]

export type Friend = {
  title: string
  description: string
  website: string
  avatar?: any
}
