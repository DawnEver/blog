---
slug: vscode_ssh_virtural_window
title: VSCode + ssh--在 Mac 下获得丝滑的 Window 开发体验
date: 2023-10-07
authors: bennett
tags: [vscode, ssh]
keywords: [vscode, ssh]
description: VSCode + ssh--在 Mac 下获得丝滑的 Window 开发体验
# image: /img/project/kz-admin.png
---
<!-- truncate -->

Mac 选手，习惯 mac 下的流畅开发，但是常常需要在 windows 虚拟机中调试。不免需要在两套文件系统中重复拷贝文件。

此前尝试过将宿主机磁盘对虚拟机虚拟成网盘，虚拟机中直接在网盘中调试，但是面临诸多权限问题。

也尝试过直接在宿主机中打开虚拟机磁盘中的文件开发，但是也需要频繁切屏。

于是探索了一下，在虚拟机的局域网内，使用 vscode + ssh 连接 windows 虚拟机。希望获得近乎 Mac 的丝滑开发体验+winodws 开发环境。

## Windows 10 开启ssh服务

默认只有 ssh客户端，需要 Windows设置–>应用–>应用和功能-可选功能(optional features) 下载 ssh服务端

**Tip：下载完后需要重启windows系统**

重启 sshd
```sh
net stop sshd
net start sshd
```

参考 [Microsoft 适用于 Windows 的 OpenSSH 入门](https://learn.microsoft.com/zh-cn/windows-server/administration/openssh/openssh_install_firstuse?tabs=powershell)

## Debug

使用 vscode ssh 扩展时遇到了问题。

```log
...
[14:47:47.663] Running script with connection command: ssh -T -D 49345 -o ConnectTimeout=15 '10.211.55.3' powershell
[14:47:49.676] "install" terminal received data: "Windows PowerShell

Copyright (C) Microsoft Corporation. All rights reserved.

Try the new cross-platform PowerShell https://aka.ms/pscore6

PS C:\Users\username> "
[14:47:49.676] Got some output, clearing connection timeout
[14:47:49.920] "install" terminal command done
[14:47:49.921] Install terminal quit with output: PS C:\Users\username> 
[14:47:49.921] Received install output: PS C:\Users\username> 
[14:47:49.922] Stopped parsing output early. Remaining text: PS C:\Users\username>
[14:47:49.922] Failed to parse remote port from server output
```

顺藤摸瓜，发现问题不在 vscode, 而在于ssh。

可以使用ssh连接到 windows终端，在 cmd 下可以正常使用。但是，执行 `powershell` 打开 powershell后，在执行任何一条指令就无报错地断开 ssh 连接。

这条脚本可以复现这个问题。
```sh
echo 'echo 1' | ssh username@address powershell
```

于是开始漫长的dubug。

由于在终端中没有报错信息，我们首先是找到 sshd 的日志。

### 捕获 sshd DEBUG日志

参考 [开启 sshd DEBUG日志](https://github.com/PowerShell/Win32-OpenSSH/wiki/Logging-Facilities#File-based-logging)
> The event log may miss some extra lines that would otherwise be shown in a log file (e.g. the reason why authorized_keys is ignored). To see them, edit `C:\ProgramData\ssh\sshd_config` (e.g. with notepad.exe run as an administrator), then set:

> `SyslogFacility LOCAL0`
> `LogLevel Debug3`
> Restart the OpenSSH SSH Server service and expect logs to appear in `C:\ProgramData\ssh\logs\sshd.log`

先清空 log.txt，然后执行上述脚本，再分析日志。发现了一句很可疑的日志。
```log
...
3332 2023-10-12 14:57:47.086 debug1: Executing command: "c:\\windows\\system32\\cmd.exe" /c "powershell" with no pty
...
```

> pty 是伪终端（pseudo terminal）的缩写，是一种虚拟的字符设备，提供双向通信。在 SSH 连接中，pty 用于模拟一个物理终端，使得用户可以在远程主机上执行命令并查看输出。当使用 ssh -t 命令时，SSH 客户端会强制分配一个 pty 给远程主机，以便用户可以在远程主机上使用交互式 shell。如果不使用 -t 选项，则不会分配 pty，这意味着用户无法在远程主机上使用交互式 shell 1.
> 当使用 ssh -t 命令时，SSH 客户端会强制分配一个 pty 给远程主机，以便用户可以在远程主机上使用交互式 shell。如果不使用 -t 选项，则不会分配 pty，这意味着用户无法在远程主机上使用交互式 shell 1.
> 当使用 ssh -T 命令时，SSH 客户端会禁用伪终端分配。这意味着用户无法在远程主机上使用交互式 shell，并且不能执行需要终端的命令 

但是经过验证，正常响应到指令 `echo 1 | ssh username@address`也有如下日志。
说明 pty 并不是问题的关键。

```log
14324 2023-10-12 16:15:00.936 debug1: Executing command: "c:\\windows\\system32\\cmd.exe" with no pty
```
### 逆向 extension.js
顺着报错路径，找到 vscode-ssh 的源码 ～/.vscode/extensions/ms-vscode-remote.remote-ssh-0.107.2023100615/out/extension.js:2:641083

在项目目录下，进行简单的全局搜索、整理一下被压扁成一坨的 javascript...

### TO BE CONTINUE

### Refferences
- [vscode Remote-ssh 远程控制windows主机](https://zhuanlan.zhihu.com/p/122999157)
- **推荐->** [vscode使用ssh远程连接失败（及其他问题合集）](https://blog.csdn.net/Castlehe/article/details/124196344)