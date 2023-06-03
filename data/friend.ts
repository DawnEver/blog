export const Friends: Friend[] = [
  {
    title: '卢仙',
    description: 'Shuyu Lu@Huazhong University of Science and Technology',
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
