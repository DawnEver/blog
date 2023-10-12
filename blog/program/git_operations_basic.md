---
slug: Git_operations_basic
title: Git 基本操作-基础篇
date: 2023-05-07
authors: bennett
tags: [program, shell]
keywords: [shell, git]
description: 一些git基本操作
# image: /img/project/kz-admin.png
---

<!-- truncate -->

## 开始

这里并不是一个严谨全面的git教程，只是一些经验分享。

1.下载[git](https://git-scm.com/download)

2.配置个人信息

`git config --global user.name  "username"`

`git config --global user.email  "email"`

这里信息由于使用了`--global`全局参数，所以只要改一次。

注意，引号里的东西可以不采用真实信息。

## 工作流程

- fork项目到自己账户
- 克隆仓库到本地
- 及时拉取服务器代码更新
- 本地修改、提交
- 推送代码到云端
- 提交 Pull Request 合并代码到源仓库

### 克隆

`git clone [仓库url]`

这里推荐使用ssl链接，速度更快。

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

`git reset HEAD^` 回到一个版本以前 `git reset HEAD^n` 回到n个版本以前

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

### 1.ssl报错

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

### 2.切换远程仓库

方法1.修改命令

`git remote set-url origin <url>`

方法2.先删后加

```bash
git remote rm origin
git remote add origin [url]
```

方法3.直接修改config文件

```bash
#.git/config
[core]
 repositoryformatversion = 0
 filemode = false
 bare = false
 logallrefupdates = true
 symlinks = false
 ignorecase = true
 hideDotFiles = dotGitOnly
[remote "origin"]
 url = https://github.com/ZhangDi-d/SpringBootSample.git
 fetch = +refs/heads/*:refs/remotes/origin/*

```

原文链接：<https://blog.csdn.net/ShelleyLittlehero/article/details/95980669>

**注意**

如果有多个分支，需要通过对每个分支分别设置上游分支
`git branch --set-upstream-to=origin/branch_name branch_name`

### 3.怎么在本地分支之间同步部分文件

要将本地分支A的更改同步到分支B，可以使用以下步骤：

确保你当前位于分支A上。如果不是，请切换到分支A：

`git checkout A`
确保分支A的本地更改已经提交并推送到远程仓库。

切换到分支B：

`git checkout B`
合并分支A到分支B：

`git merge A`
这将把分支A的更改合并到分支B中。如果存在冲突，你需要解决冲突并提交更改。

推送分支B到远程仓库：

`git push origin B`
现在，分支B将包含来自分支A的最新更改。

请注意，以上步骤假设你的分支A和分支B都已经与远程仓库进行了关联，并且你有相应的推送权限。如果你的分支B还没有与远程仓库关联，你可以使用以下命令将其推送到远程仓库：

`git push -u origin B`
这将在推送分支B的同时，将其与远程仓库进行关联，以便今后的推送操作。

如果只是需要同步部分文件，如`a`和`b`：

```shell
git checkout B   // 首先切换到 B 分支
git checkout A a b  // 然后从 A 中抽取 a、b 两个选定的文件
```

### 4.git pull 报警告怎么办？

在使用`git pull`合并时候，有时会有如下警告（有可能是中文版）：

```shell
int: Pulling without specifying how to reconcile divergent branches is
hint: discouraged. You can squelch this message by running one of the following
hint: commands sometime before your next pull:
hint:
hint:   git config pull.rebase false  # merge (the default strategy)
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
```

若无特殊需求或不想深究，执行：`git config --global pull.rebase false`。

然后，我们就要开始深究了。

首先，`git pull` 等价于`git fetch && git merge`

但是，`git pull`有一些常见的选项搭配：

- 不带任何选项的`git pull`命令：先尝试快进合并，如果不行再进行正常合并生成一个新的提交。
- `git pull --rebase`命令：先尝试快进合并，如果不行再进行变基合并。
- `git pull --ff-only`命令：只尝试快进合并，如果不行则终止当前合并操作。
- `git pull --no-ff`命令：禁止快进合并，即不管能不能快进合并，最后都会进行正常合并生成一个新的提交。

关于变基和快进合并，详见官方文档：[3.6 Git 分支 - 变基](https://git-scm.com/book/zh/v2/Git-%E5%88%86%E6%94%AF-%E5%8F%98%E5%9F%BA#_rebasing)

注意，只对尚未推送或分享给别人的本地修改执行变基操作清理历史， 不对已推送至别处的提交执行变基操作，这样，你才能享受到两种方式（变基 、 合并）带来的便利。

这里引用Git Book的“金科玉律”（The Perils of Rebasing）：

> Ahh, but the bliss of rebasing isn’t without its drawbacks, which can be summed up in a single line:
> Do not rebase commits that exist outside your repository and that people may have based work on.
> If you follow that guideline, you’ll be fine. If you don’t, people will hate you, and you’ll be scorned by friends and family.

### 5 报错 You have not concluded your merge (MERGE_HEAD exists)
导致报错:error: You have not concluded your merge (MERGE_HEAD exists).的原因可能是在以前pull下来的代码自动合并失败。

- 解决方案一：保留本地的更改，中止合并->重新合并->重新拉取
```sh
git merge --abort
git reset --merge
git pull
```
git pull之后然后重新解决冲突，再push，（记得需要稍微跟自己push的要有一点区别，要不然又会造成这样的情况）

- 解决方案二：舍弃本地代码，远端版本覆盖本地版本（慎重）

```sh
git fetch --all
git reset --hard origin/master
git fetch
```

---

参考阅读、观看

- [CS自学指南git](https://csdiy.wiki/%E5%BF%85%E5%AD%A6%E5%B7%A5%E5%85%B7/Git/)
- [Git官方文档](https://git-scm.com/doc)
- [bilibili-码农高天-十分钟学会正确的github工作流，和开源作者们使用同一套流程](https://www.bilibili.com/video/BV19e4y1q7JJ)
