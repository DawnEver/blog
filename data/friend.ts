export const Friends: Friend[] = [
  {
    title: 'Bennett',
    description: '我',
    website: 'https://bennett.hi-motor.site/',
    avatar: '/img/favicon.ico',
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
