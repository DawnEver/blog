---
slug: command-line-scripts
title: 一些常用的命令行脚本(收藏向)
date: 2023-10-07
authors: bennett
tags: [linux, shell]
keywords: [shell, command lines]
description: 一些常用的命令行脚本
# image: /img/project/kz-admin.png
---

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
...

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