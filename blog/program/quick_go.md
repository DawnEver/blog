---
slug: quick_go
title: Quick Go：Go 语言特种兵式入门
date: 2023-09-28
authors: bennett
tags: [program, go, mongodb]
keywords: [go, https]
description: Quick Go：Go 语言特种兵式入门
# image: /img/project/kz-admin.png
---
<!-- truncate -->



Go 是什么
...
Go 的好处
...


想尝试一下 go，但是缺乏一个动力或者说具体的目的。
忽然想起来，某个网站项目后端原先是flask简单搭了个架子就直接付诸生产环境了，这回就用 go 重构一下。

## 配置 Go 开发环境

## 初次见面
初次见面（以前是用 go 是写过什么其它东西的，但是应该最后咕了，没有啥印象），从一个http服务器开始，这时候，go是相当优雅。

```go
package main

import (
	"fmt"
	"net/http"
)

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World")
}

func main() {
	http.HandleFunc("/", HelloHandler)
	http.ListenAndServe(":8000", nil)
}
```


- 重写网页后端
	go 连接 mongoDB
	go 搭建 https 服务器
	go 自签名 ssl 证书
	go web api
	[深入学习用 Go 编写 HTTP 服务器](https://blog.csdn.net/kevin_tech/article/details/104100835)
	https://zhuanlan.zhihu.com/p/299585136

	https://protobuf.dev/programming-guides/proto3/