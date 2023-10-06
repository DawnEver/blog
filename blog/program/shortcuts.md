---
slug: shortcuts
title: 一些常用的快捷键(收藏向)
date: 2023-10-07
authors: bennett
tags: [linux, shortcuts]
keywords: [shell, Command lines]
description: 一些常用的快捷键工具
# image: /img/project/kz-admin.png
---

# 目录
- [Universal](#Universal)
    - [VSCode](#VSCode)
    - [Vimium](#Vimium)
- [MacOS](#MacOS)
- [Linux](#Linux)
- [Windows](#Windows)


# Universal
## VSCode
```
CTRL R：切换工作区
CTRL   TAB：切换选项卡
CTRL L : 选择当前行
Shift   ALT : 多行选择
Command Shift C	打开当前页面终端
```


## Vimium
[vimium 成神之路-键盘党的胜利](https://zhuanlan.zhihu.com/p/64533566)
### 当前页面操作

在浏览器当前页面的所有操作

```text
?       显示帮助对话框以获取所有可用键的列表
h       向左滚动一点
j       向下滚动一点
k       向上滚动一点
l       向右滚动一点
gg      滚动到页面顶部
G       滚动到页面底部
d       向下滚动半页
u       向上滚动半页
f       打开元素定位器，是在当前标签页打开
F       打开元素定位器，是在新标签页打开
r       刷新
gs      查看源码
i       进入插入模式 - 在您按Esc退出之前，将忽略所有命令
yy      将当前网址复制到剪贴板
yf      将链接URL复制到剪贴板
gf      循环到下一帧(尤其在选择网页内置视频的时候很管用)
gF      聚焦主/顶框架
```

### 新页面操作

```text
o   从URL、书签、历史记录中搜索地址，回车打开
O   从URL、书签、历史记录中搜索地址，回车在新标签页中打开
b   仅从书签搜索地址，回车打开
B   仅从书签搜索地址，回车新标签页中打开
T   搜索当前浏览器的所有标签
```

### 使用搜索

```text
/       进入查找模式 - 输入您的搜索查询并按Enter键进行搜索，或按Esc键取消
n       查找下一个匹配项
N       查找上一个匹配项
```

### 浏览历史记录

```text
H       回到历史，也就是回到前一页
L       在历史上前进，也就是回到后一页
```

### 标签操作

```text
J, gT   跳到左标签
K, gt   跳到右标签
g0      跳转到第一个标签(根据不同的数字跳到第几个标签)
g$      跳转到最后一个标签
^       回到上一个访问的标签
t       创建一个新的标签
yt      复制当前页面，在新标签页打开
x       关闭当前标签
X       恢复关闭的上一个标签
p       在当前标签页打开剪切板中的URL，如不是URL则默认引擎搜索
P       在新标签页打开剪切板中的URL，如不是URL则默认引擎搜索
T       在当前打开的标签中搜索
W       将当前标签移动到新窗口
<a-p>   pin/unpin current tab
```

### 标记（锚点）

```text
ma      设置本地标记 a
mA      设置全局标记 A 
`a      跳转到本地标记 a
`A      跳转到q全局标记 a
``      跳回到跳转之前的位置 (也就是说，在执行gg，G，n，N，或/ a 之前的位置）
```

### 其他高级浏览命令

```text
<<      当前标签页向左移动  
>>      当前标签页向右移动  
<a-f>   在新标签中打开多个链接
gi      聚焦页面上的第一个（或第n个）文本输入框
gu      跳转到URL层次的父类(xxx.com/yyy/zzz 跳转到 xxx.com/yyy)
gU      转到URL层次结构的根目录(也就是 xxx.com)
ge      编辑当前URL
gE      编辑当前URL并在新选项卡中打开
zH      向左滚动
zL      向右滚动
v       进入预览模式;使用p / P粘贴，然后使用y来拷贝
V       enter visual line mode
<a-m>   开/关静音 
<a-p>   固定标签栏 
```

### 预览模式（visual mode）

预览模式跟 vim 很类似

```text
先用 / 定位，找到想要选择的字符
    再按 v ,进入模式
    然后使用
        j：向下一行
        k：向上一行
        h：向左一个字符或标点（数字+h，可以移动多个字符）
        l：向右一个字符或标点（数字+l，可以移动多个字符）
        w：下一个标点符号后位置，包括看不见的换行符
        e：下一个标点符号前位置
        b：取消选中上一个字符，字符和标点算一个字符
```

# MacOS
## Mac
- **Command Shift F**: show in finder
- **Command Shift T**: new iterm2
- **Command Alt V**: show paste history
- **Command Tab**: application switch
- **Command Shift .**: 显示隐藏文件。
- **Command Shift J**: 在terminal中打开文件
- **Command-Shift-G**: 强制搜索
- **Option 左**: 缩放
- **Option 右**: 平滑
- **Option Command 3/4/5/6**: 截屏
- **Command X**：剪切所选项并拷贝到剪贴板。
- **Command C**：将所选项拷贝到剪贴板。
- **Command V**：将剪贴板的内容粘贴到当前文稿或应用中。
- **Command Z**：撤销上一个命令。
- **Shift Command Z** :重 做，
- **Command A**：全选各项。
- **Command Delete**：将所选项移到废纸篓。
- **Command S**：存储当前文稿。
- **Command T**：打开新标签页。
- **Command Q**: 关闭应用
- **Command W**：关闭最前面的窗口
- **Command 0**: 恢复刚刚关闭的窗口
- **Option Command W**: 关闭应用的所有窗口
- **Command**＋**tab**: 查看已打开应用
- **Option Command Esc**: 选择强制退出应用。
- **Command H**: 隐藏窗口
- **选定+回车**: 重命名
- **Command ,**：打开最前面的应用的偏好设置。
- **Command T**：新建标签页
- **Command L**：快速输入网址
- **Command E**：推出所选磁盘或宗卷
- **Command O:**: 打开文稿文件夹
- **Command D:**: 直接复制
- **Command +/—**: 放大/缩小页面
- **Command 0**: 恢复默认大小
- **Fn Delete**: 删除

# Linux
# Windows