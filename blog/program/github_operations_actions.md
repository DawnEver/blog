---
slug: github_operations_actions
title: Github 基本操作-Actions
date: 2023-7-7
authors: bennett
tags: [program, Github, CI/CD]
keywords: [Actions, yaml]
description: 一些 github actions 操作
# image: /img/project/kz-admin.png
---
<!-- truncate -->

当前中文互联网上关于GitHub的经验和教程往往内容比较浅薄，本系列记录一些Github的深度使用经验。

本篇涉及一些 Github Actions的使用。

## 什么是 Github Actions
> GitHub Actions 是一种持续集成和持续交付 (CI/CD) 平台，可用于自动执行生成、测试和部署管道。 您可以创建工作流程来构建和测试存储库的每个拉取请求，或将合并的拉取请求部署到生产环境。
> GitHub Actions 不仅仅是 DevOps，还允许您在存储库中发生其他事件时运行工作流程。 例如，您可以运行工作流程，以便在有人在您的存储库中创建新问题时自动添加相应的标签。
> GitHub 提供 Linux、Windows 和 macOS 虚拟机来运行工作流程，或者您可以在自己的数据中心或云基础架构中托管自己的自托管运行器。

详见[官方文档](https://docs.github.com/actions)。


## 每天自动合并 dev 到 main 分支

这个脚本的应用场景是我的个人博客。

我的博客部署在 Vercel 上，Vercel 会自动检测 main 分支的更新然后重新部署。

但是我在开发时，往往可能在短时间内 push 了很多次，造成多次重复部署。

虽然浪费的不是我的服务器，但是看到密集的部署历史还是很难受。所以我另外建立了一个 dev 分支，开发时在 dev 分支更改，每天由 Actions 定时将更改合并到 main 分支上。

这里使用了 [actions/checkout@v3](https://github.com/actions/checkout)

```yaml
name: Merge dev to main

on:
#   push:
#     branches:
#       - main
      
  schedule:
    - cron: "0 0 * * *"

jobs:
  merge:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
#         with:
#           token: ${{ secrets.ACCESS_TOKEN }}
      - name: Merge dev to main
        run: |
          git config --global user.name 'AutoMerge'
          git config --global user.email 'AutoMerge@github.com'
          git pull --unshallow
          git checkout main
          # git merge --no-edit origin/dev
          git merge --strategy-option=theirs origin/dev
          git push -f origin main
```