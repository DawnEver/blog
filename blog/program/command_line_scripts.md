---
slug: command-line-scripts
title: 一些常用的命令行脚本(收藏向)
date: 2023-10-07
authors: benjamin
tags: [linux, shell]
keywords: [shell, command lines]
description: 一些常用的命令行脚本
# image: /img/project/kz-admin.png
---
<!-- truncate -->

# 目录
- [Universal](#Universal)
    - [screen](#screen)
    - [ffmpeg](#ffmpeg)
- [MacOS](#MacOS)
- [Linux](#Linux)
- [Windows](#Windows)

# Universal
## screen
- 终止所有已有 sessions
    ```sh
    screen -ls | awk '{print substr($0, 1, index($0, ".pts-") - 1)}'| xargs -I {} screen - {} -X quit
    ```
- tldr
    ```markdown
    - Start a new screen session:
    screen
    - Start a new named screen session:
        screen -S session_name
    - Start a new daemon and log the output to `screenlog.x`:
        screen -dmLS session_name command
    - Show open screen sessions:
        screen -ls
    - Reattach to an open screen:
        screen -r session_name
    - Detach from inside a screen:
        Ctrl + A, D
    - Kill the current screen session:
        Ctrl + A, K
    - Kill a detached screen:
        screen -X -S session_name quit
    ```

## ffmpeg

```shell
# 视频两倍速
ffmpeg -i test.mp4 -filter:v "setpts=0.5*PTS" out.mp4

# 音频两倍速
ffmpeg -i test.mp4 -filter:a  "atempo=2.0" -vn out.mp4
# 都两倍速
ffmpeg -i test.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" -map "[v]" -map "[a]" out.mp4

# 生成gif动图
ffmpeg -i input.mp4 -vf "scale=1080:-1" -r 15 output.gif
# -r 帧率
# -vf 画幅

```


# MacOS

- IOS Bundle Identifier
    给予权限
    ```sh
    sudo sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db "INSERT or REPLACE INTO access VALUES('kTCCServiceMicrophone','com.apple.Terminal',0,0,4,1,NULL,NULL,0,'UNUSED',NULL,0,1622199671);"
    ```
- quarantine
    ```sh
    sudo spctl --master-disable
    sudo xattr -r -d com.apple.quarantine xxx.dmg
    ```
# Linux
## Compress
```sh
# 压缩
tar -czvf archive.tar.gz folder_name
# 解压缩
## 解压缩.tar.gz或.tgz文件：
tar -xzvf archive.tar.gz
```
- -c表示创建新的归档文件。
- -x表示提取文件
- -v表示显示详细输出
- -f表示指定文件名
- -z表示使用gzip进行解压缩

## Add User
Take user **git** as example:
```sh
apt install git
groupadd git
useradd git -g git
passwd git
cd home
mkdir -p git/repos
cd git/repos
git init --bare minifemm.git
chown -R git:git /home/git

```
# Windows