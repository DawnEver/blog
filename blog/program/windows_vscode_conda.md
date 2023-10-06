---
slug: windows_vscode_conda
title: 在 Windows 下，如何为你的 VSCode 配置 conda 环境
date: 2023-09-27
authors: bennett
tags: [vscode, windows, python]
keywords: [miniconda]
description: 在 Windows 下，如何为你的 VSCode 配置 conda 环境，踩坑
# image: /img/project/kz-admin.png
---
<!-- truncate -->

## 安装 Conda

推荐采用简洁而同样强大的 MiniConda(https://docs.conda.io/projects/miniconda)：只是比Anaconda少了一些预装的模块.

> Miniconda is a free minimal installer for conda. It is a small bootstrap version of Anaconda that includes only conda, Python, the packages they both depend on, and a small number of other useful packages (like pip, zlib, and a few others). 

### 添加环境变量

参考 [小白教程 | Miniconda安装及添加环境变量 原创](https://blog.51cto.com/u_15310860/3194409)

## VSCode
下载参考 [VScode——下载、安装、配置中文环境（windows）](https://zhuanlan.zhihu.com/p/342467129)

vscode 选择 select python interpretor

可能需要 vscode 管理员权限

## 常用脚本
下载 requirements.txt 中的内容
```sh
while read requirement; do conda install --yes $requirement || pip install $requirement; done < requirements.txt
```