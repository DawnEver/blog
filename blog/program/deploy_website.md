---
slug: deploy_website
title: 如何部署一个自己的网站
date: 2024-01-23
authors: benjamin
tags: [linux, shell]
keywords: [shell, acem.sh]
description: 
# image: /img/project/kz-admin.png
---


## acem.sh 自动生成 SSL
```sh
# 生成
acme.sh --issue --dns dns_ali -d voltworks.cn -d www.voltworks.cn --debug
# 部署
acme.sh --install-cert -d voltworks.cn \
--key-file       /etc/nginx/cert/voltworks.cn.key  \
--fullchain-file /etc/nginx/cert/voltworks.cn.pem \
--reloadcmd     "service nginx force-reload"
```

- [阿里云+acme.sh通配符ssl证书](https://blog.csdn.net/yedajiang44/article/details/121173526)
- [正确使用 acme.sh， 让你的网站永久免费使用 ssl 证书](https://zhuanlan.zhihu.com/p/670418258)