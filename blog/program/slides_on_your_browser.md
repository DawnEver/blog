---
slug: slides_on_your_browser
title: 如何在浏览器上展示ppt
date: 2023-09-22
authors: benjamin
tags: [reveal.js, markdown]
keywords: [slides]
description: 基于 revealjs-md 和 protocol handler 搭建 slides 工作流。
# image: /img/project/kz-admin.png
---
<!-- truncate -->

## 世人苦ppt久矣！
在组会中常常需要做ppt。

但是传统的ppt面临几大痛点：

- 非结构化数据，不便于回顾和查找；
- 排版耗时且无价值，很多时候我们只需要一个文档就可以解决战斗；
- 图片、视频等资源让slides动辄几十 MB；
- 常常需要在 ppt 中直接打开源链接或打开其他应用实机展示；
- ...

## Overview

针对上述问题，我在日常工作中逐渐形成了自己的工作流。

### Feature 1
基于 [reveal-md](https://github.com/webpro/reveal-md) 做了一些魔改，

使用 markdown 编写内容，实现在浏览器中播放 slides。

其中 markdown 源文件即可成为会议大纲; [reveal.js](https://revealjs.com/) 实现的 slides 也足够酷炫。

### Feature 2
基于 Github 和国内的 cdn 白嫖免费图床、视频床。

### Feature 3
使用 protocol handler，通过url执行终端命令。

而有了终端就有了一切。

## Reveal.js

### Intro
Reveal.js 是一个开源的 html slides 框架。

项目 reveal-md 支持将 markdown 文稿转换成 revealjs 文档。

事实上，如果只是要把markdown转换成revealjs，开源社区里已经有很多比较成熟的项目，甚至我自己还写过一个。

但是这类项目始终面临这样一个问题：如何添加 slides 分页符。

选择 reveal-md 也是因为它在这一个问题上的简洁和自由。并未给原生 markdown 中引入一些不够优雅的元素。

> The Markdown feature of reveal.js is awesome, and has an easy (and configurable) syntax to separate slides. Use three dashes surrounded by two blank lines (\n---\n). Example:

```markdown
# Title

- Point 1
- Point 2

---

## Second slide

> Best quote ever.

Note: speaker notes FTW!
```

详细配置可以参考 [reveal-md](https://github.com/webpro/reveal-md) 官方教程，这里不再赘述。

值得一提的是，revealjs允许修改 css 文件，甚至 html 文件，来定义自己的模版。

### Scrollable

由于原生 markdown 中并无样式信息，所以当我们想在 slides 添加一些新的布局就很复杂；此外，如果我们分页时在一页中塞入了太多元素，超过的部分往往不可见。

面对这些问题，我们往往需要采取在 markdown 中内嵌 html 代码的方式。

这样固然也可以解决问题，但是着实不够优雅。

既然已经在网页上放映 slides 了，何不直接允许每一页滚动浏览？

在html中，这也很容易操作，我们只要修改样式文件,将对应元素的 overflow 参数设为 auto 即可；当然，也可以选择像我一样，只允许 y 方向（纵向）滚动。

```
.reveal .slides {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  pointer-events: none;
  /* 
  overflow: hiden; 禁止滚动
  overflow: auto; 允许滚动
  */
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
  text-align: center;
  perspective: 600px;
  perspective-origin: 50% 40%
}
```

在展示中，滚动条也很突兀。于是我们可以将宽度设成 0 来隐藏。

```
::-webkit-scrollbar {
  width: 0px; /* Set the width of the scrollbar */
}
```

## Image Host

搜索引擎上取关键词 **CDN**、**图床**、**Github**，其实就已经有很多相当成熟的解决方案。

但是我讨厌那些臃肿的大而全的项目--我只需要一个图床。

于是自己用shell脚本和文件夹实现了一个极简的图床。[<指路>](https://github.com/DawnEver/ImageHost)

直接利用 git 操作上传图片和视频；按照上传时间划分文件夹；然后根据不同操作系统的接口。将生成的链接扔回剪切板中。

```shell
script_dir=$(cd $(dirname $0);pwd)
cd $script_dir

currentTime=$( date "+%Y-%m-%d" )
folderName=$currentTime

if [ -d $folderName ]
then
	echo folder $currentTime existed
else
	mkdir $folderName
fi
```

```shell
# gitPush
script_dir=$(cd $(dirname $0);pwd)
cd $script_dir

# git operations
if true
then
	git pull
	git add .
	git commit -m '$currentTime'
	git push
fi

# get time as identify
currentTime=$( date "+%Y-%m-%d" )
echo '========================'
echo 'today:' $currentTime

# get OS
uNames=`uname -s`
osName=${uNames: 0: 4}

# print urls
repo='DawnEver/ImageHost'
images=$( ls -d */* |grep $currentTime )
for image in $images
do
	fullURL='https://cdn.jsdelivr.net/gh/'$repo'@main/'$image
	echo $fullURL
done

# redirect to clipboard
if [ "$osName" == "Darw" ] # Darwin
then
	echo $fullURL | pbcopy
elif [ "$osName" == "Linu" ] # Linux
then
	echo $fullURL | xsel
elif [ "$osName" == "MING" ] # MINGW, windows, git-bash
then 
    echo $fullURL | clip
else
	echo "Error:Unknown OS"
fi

echo 'url ->> Clipboard'

echo '========================'
read -p 'press any key to exit' -n 1 -s
exit

```

## URL Handler
### Intro
简述一下，我们常用 http/https 协议浏览网页，实际上，浏览器支持的远远不止这些协议。

例如，MongoDB 就支持使用 mongodb 协议，如 `mongodb://path/to/database` 跳到外部软件访问对应的数据库。

于是，有没有那么一种可能，我们在浏览器点开链接 `local://code ~/foo.py` 就可以执行终端命令`code ~/foo.py`，使用 vscode 打开文件。

上面只是一个具体案例，当我们搭起浏览器和终端的桥梁，想象空间无限。

### MacOS,启动!
由于我目前的主力设备是 MacOS，所以这里只讲 MacOS 下的操作。

实际上，互联网上已经有很多解决方案，但是往往都是在 window 系统下，如 [How do I register a custom URL protocol in Windows?](https://stackoverflow.com/questions/80650/how-do-i-register-a-custom-url-protocol-in-windows)。

主要参考 [Launching Applications Using Custom Browser Protocols](https://developer.shotgridsoftware.com/af0c94ce) 和 [OSX : Defining a new URL handler that points straight at a Python script](https://stackoverflow.com/questions/2418910/osx-defining-a-new-url-handler-that-points-straight-at-a-python-script)。

1. 在 AppleScript Script Editor 中写如下代码，保存为应用。
```AppleScript
# URLHandler.scpt
on open location this_URL
	try
		do shell script "python /Applications/URLHandler.app/Contents/Resources/Scripts/UrlHandler.py '" & this_URL & "'"
	on error errStr
		display dialog "error" & errStr
	end try
end open location
```

2. 修改 `URLHandler.app/Contents/Info.plist`,点击应用。

> Find the saved Application Bundle, and Open Contents. Find the Info.plist file, and open it. Add the following:

```xml
<key>CFBundleIdentifier</key>
<string>com.mycompany.AppleScript.LocalCommand</string>
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>LocalCommand</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>local</string>
    </array>
  </dict>
</array>
```

3. 找个地方放你想执行的 python 代码，我是在 `/Applications/URLHandler.app/Contents/Resources/Scripts/UrlHandler.py` 这里。Python代码如下，也可以根据需要修改。

在我这里，在路径中使用`%20`代替空格。

如 `local://echo%20hello` 即 `echo hello`

```python
import sys
import os
arg = sys.argv[1]
handler, fullPath = arg.split("://", 1)
args=fullPath.split("%20")
command=' '.join(args)
os.system(command)
```

### 此外

虽然上面的方案可以解决问题，但是在探索过程中，还同时发现了其他理论上同样可行的解决方案，这里提供一些思路或关键词。

1. Web API 层面的 navigator.registerProtocolHandler()

2. 开启一个本地服务器通讯，在 node 或其他后端中执行终端命令。

3. [xterm.js](https://xtermjs.org/)

4. [SwiftDefaultApps](https://github.com/Lord-Kamina/SwiftDefaultApps)
