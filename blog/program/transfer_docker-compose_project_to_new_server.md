---
slug: transfer_docker-compose_project_to_new_server
title: 如何迁移 docker compose 项目到一台新的服务器
date: 2023-06-29
authors: bennett
tags: [linux, docker-compose, gitea]
keywords: [docker-compose, gitea, tar, tldr]
description: 迁移 docker compose 项目到一台新的服务器
# image: /img/project/kz-admin.png
---
<!-- truncate -->

## 缘起
去年开学季促销，笔者以 72R/Year 的价格白嫖了一个腾讯云轻量服务器。

之后，笔者使用 docker-compose 部署了一个 [Gitea](https://github.com/go-gitea/gitea) 供团队使用。在之后的一年里，Gitea 逐渐成为了团队开发工作流的一部分，发挥了重要作用。

如今，服务器到期在即，我也面临迁移 Gitea 的问题。

## 如何迁移 docker-compose 项目

思路其实十分简单，由于一年前部署时，我把 volumes 全部挂在同目录下，于是我只需要把整个目录打包压缩，然后传输给新的服务器即可。

我使用 docker-compose 的 yaml 配置文件如下。

```yaml
#docker-compose.yml

version: "3"

networks:
  gitea:
    external: false

services:
  server:
    image: gitea/gitea
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - DB_TYPE=mysql
      - DB_HOST=db:3306
      - DB_NAME=gitea
      - DB_USER=gitea
      - DB_PASSWD=gitea
    restart: always
    networks:
      - gitea

    volumes:
      - ./data:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "22:22"
    depends_on:
      - db

  db:
    image: mysql
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=gitearoot
      - MYSQL_USER=gitea
      - MYSQL_PASSWORD=gitea
      - MYSQL_DATABASE=gitea
    networks:
      - gitea
    volumes:
      - ./mysql:/var/lib/mysql
```

## 打包压缩

***tar***，不多说，人生苦短，让 tldr 告诉你答案

```
$ tldr tar     

tar

Archiving utility.
Often combined with a compression method, such as gzip or bzip2.
More information: <https://www.gnu.org/software/tar>.

- [c]reate an archive and write it to a [f]ile:
    tar cf path/to/target.tar path/to/file1 path/to/file2 ...

- [c]reate a g[z]ipped archive and write it to a [f]ile:
    tar czf path/to/target.tar.gz path/to/file1 path/to/file2 ...

- [c]reate a g[z]ipped archive from a directory using relative paths:
    tar czf path/to/target.tar.gz --directory=path/to/directory .

- E[x]tract a (compressed) archive [f]ile into the current directory [v]erbosely:
    tar xvf path/to/source.tar[.gz|.bz2|.xz]

- E[x]tract a (compressed) archive [f]ile into the target directory:
    tar xf path/to/source.tar[.gz|.bz2|.xz] --directory=path/to/directory

- [c]reate a compressed archive and write it to a [f]ile, using [a]rchive suffix to determine the compression program:
    tar caf path/to/target.tar.xz path/to/file1 path/to/file2 ...

- Lis[t] the contents of a tar [f]ile [v]erbosely:
    tar tvf path/to/source.tar

- E[x]tract files matching a pattern from an archive [f]ile:
    tar xf path/to/source.tar --wildcards "*.html"
```



## 可靠的传输
一般文件不大，scp 就可以解决问题。

```
# Copy a local file to a remote host:
scp path/to/local_file remote_host:path/to/remote_file
```

OpenSSH基于安全的理由，如果用户连线到SSH Server后闲置一段时间，SSH Server会在超过特定时间后自动终止SSH连线。

### rsync
但是当文件很大，面临 ssh 连接断开导致窗口关闭，rsync 提供的断点重传就可以解决这个问题。

rsync -P --rsh=ssh a.tar 192.168.205.34:/home/home.tar

-P: 是包含了 “–partial –progress”， 部分传送和显示进度

-rsh=ssh 表示使用ssh协议传送数据

### 修改 ssh 参数
ssh 登录后闲置时间过长会自动断开连接。可以修改配置控制自动断开时间。

在 `/etc/ssh/sshd_config` 有两个关于ssh超时断开的参数：

ClientAliveInterval：服务器端向客户端发送心跳以判断客户端是否存活（即客户端是否操作服务器）的时间间隔，单位为秒，默认是0。

ClientAliveCountMax：允许心跳无响应的次数。

自行探索即可。

### 后台执行
& 加在一个命令的最后，可以把这个命令放到后台执行；如：gftp &

ctrl + z 可以将一个正在前台执行的命令放到后台，并且处于暂停状态，不可执行；

jobs 查看当前有多少在后台运行的命令；<br/>
参数：-l选项可显示所有任务的PID；

jobs的状态可以是running、stopped、Terminated；但是如果任务被终止了（kill），任务将从当前shell环境已知的列表中删除任务的进程标识；也就是说，jobs命令显示的是当前shell环境中所起的后台正在运行或被挂起的任务信息；

fg 将后台中的命令调至前台继续运行<br/>
如果后台中有多个命令，可以用fg %jobnumber将选中的命令调出，%jobnumber是通过jobs命令查到的后台正在执行的命令的序号(不是pid)

bg 将一个在后台暂停的命令，变成继续执行 （在后台执行）<br/>
如果后台中有多个命令，可以用bg %jobnumber将选中的命令调出，%jobnumber是通过jobs命令查到的后台正在执行的命令的序号(不是pid)
将任务转移到后台运行：先ctrl + z暂停；再bg，这样进程就被移到后台运行，终端还能继续接受命令。

概念：当前任务<br/>
如果后台的任务号有2个[1],[2]；如果当第一个后台任务顺利执行完毕，第二个后台任务还在执行中时，当前任务便会自动变成后台任务[2]的后台任务。所以可以得出一点，即当前任务是会变动的；当用户输入fg、bg和stop等命令时，如果不加任何序号，则所变动的均是当前任务。

nohup 该命令可以在你退出帐户/关闭终端之后继续运行相应的进程<br/>
如果你正在运行一个进程，而且你觉得在退出帐户时该进程还不会结束，那么可以使用nohup命令。
