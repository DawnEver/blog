---
slug: Git_operations
title: Git基操
date: 2023-05-07
authors: bennett
tags: [program, shell]
keywords: [shell, git]
description: 一些git基本操作
# image: /img/project/kz-admin.png
---
# Git基本操作

## 开始
这里并不是一个严谨全面的git教程，只是一些经验分享。

1.下载[git](https://git-scm.com/download)

2.配置个人信息

`git config --global user.name  "username"  `

`git config --global user.email  "email"`

只要改一次，引号里的东西不用真实信息，在git log里面显示，让其他人知道是你就行

## 工作流程

**每次修改前**
**先把服务器代码拉到本地**

### 拉取

第一种

`git fetch` #将远程代码拉至本地

`git diff` #查看两个代码的区别

`git merge` #合并

第二种

`git pull` #将服务器的代码直接拉到本地

修改时，你的修改都在本地的工作区

### 修改

`git add .`  #将工作区所有文件添加到缓存区

`git commit -m ‘blabla’` #将缓存区内文件提交到本地版本库，引号里的东西是这一次提交的备注

`git log` #查看版本库的提交记录（我一般用这个命令和看readme.md文档的变化来确定有没有成功同步）

> 操作如`git log`之后，输入行前面是一个冒号，此时输入wq就行，vim操作

`git reset [hash]` #回到之前某个版本，[hash]是之前版本的hash值，可以在git log里查看

`git checkout .` # 清除工作区文件

### 推送

`git push` #将本地代码推向云端

## 分支管理

vscode和pycharm都集成了git工具（vscode在左下角，pycharm可以看一下）

**本地分支**
`git branch`    #显示当前分支
`git branch [分支名]`   #创建分支
`git branch -d [分支名]`    #删除分支
`git checkout [分支名]` #切换分支
> 修改之后需要提交修改之后才能切换分支

**云端分支**

`git branch -r` #查看云端分支

`git push origin [本地分支名]：[远端仓库的分支名，也就是目标仓库]`  #推送分支到云端

**仓库操作**
`git remote remove origin`  # 删除，一般不用到
`git remote add origin xxx` # 添加远程仓库
`git remote set-url origin xxx` # 设置原程仓库


## 常见问题


### ssl报错

```shell
warning: ----------------- SECURITY WARNING ----------------
warning: | TLS certificate verification has been disabled! |
warning: ---------------------------------------------------
warning: HTTPS connections may not be secure. See https://aka.ms/gcmcore-tlsverify for more information.
```

解决：

```shell
git config --global http.sslVerify false
```


---
参考阅读
[CS自学指南git](https://csdiy.wiki/%E5%BF%85%E5%AD%A6%E5%B7%A5%E5%85%B7/Git/)

