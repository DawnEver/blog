export const projects: Project[] = [
  {
    title: 'Bennett的小站',
    description: '魔改自愧怍的个人博客（https://kuizuo.cn）',
    // preview: '/img/project/blog.png',
    website: 'https://bennett.hi-motor.site',
    source: 'https://github.com/DawnEver/blog',
    tags: ['opensource', 'design', 'favorite'],
    type: 'personal',
  },
  {
    title: 'No Hand',
    description: 'pyqt5 实现的随机数点名器',
    preview: '/img/project/personal/no_hand.jpg',
    website: 'https://github.com/DawnEver/NoHand',
    tags: ['opensource'],
    type: 'personal',
  },
  {
    title: 'Desktop Here',
    description: '让桌面显示任意一个文件夹',
    website: 'https://github.com/DawnEver/DesktopHere',
    tags: ['opensource'],
    type: 'personal',
  },
  {
    title: 'Mac Scripts',
    description: 'MacOS 的一些常用脚本',
    website: 'https://github.com/DawnEver/MacScrips',
    tags: ['opensource'],
    type: 'personal',
  },


  {
    title: 'Hi-Motor Designer',
    description: '同步磁阻电机设计优化平台',
    website: 'https://designer.hi-motor.site',
    tags: ['favorite','product','large','team'],
    type: 'product',
  },
  {
    title: 'Hi-Motor Hub',
    description: '高效电机选型设计平台',
    website: 'https://designer.hi-motor.site',
    tags: ['product','team'],
    type: 'product',
  },
]

export type Tag = {
  label: string
  description: string
  color: string
}

export type TagType =
  | 'favorite'
  | 'opensource'
  | 'product'
  | 'design'
  | 'large'
  | 'personal'
  | 'team'

export type ProjectType = 'personal' | 'product' | 'toy' | 'other'

export type Project = {
  title: string
  description: string
  preview?: any
  website: string
  source?: string | null
  tags: TagType[]
  type: ProjectType
}

export const Tags: Record<TagType, Tag> = {
  favorite: {
    label: '喜爱',
    description: '情有所钟！',
    color: '#e9669e',
  },
  opensource: {
    label: '开源',
    description: '开源项目！',
    color: '#39ca30',
  },
  product: {
    label: '产品',
    description: '与产品相关的项目!',
    color: '#dfd545',
  },
  design: {
    label: '设计',
    description: '优秀的设计!',
    color: '#a44fb7',
  },
  large: {
    label: '大型',
    description: '大型项目',
    color: '#8c2f00',
  },
  personal: {
    label: '个人',
    description: '个人项目',
    color: '#12affa',
  },
  team: {
    label: '团队',
    description: '团队项目',
    color: '#edaffa',
  },
}

export const TagList = Object.keys(Tags) as TagType[]

export const groupByProjects = projects.reduce((group, project) => {
  const { type } = project
  group[type] = group[type] ?? []
  group[type].push(project)
  return group
}, {} as Record<ProjectType, Project[]>)
