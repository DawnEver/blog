---
slug: quick_go
title: Quick Go：特种兵式入门Go 语言
date: 2023-10-21
authors: benjamin
tags: [program, go, mongodb]
keywords: [go, https]
description: Quick Go：特种兵式入门Go 语言
# image: /img/project/kz-admin.png
---
<!-- truncate -->



### Go 是什么
Go（又称Golang）是Google开发的一种静态强类型、编译型、并发型，并具有垃圾回收功能的编程语言。

> The Go programming language is an open source project to make programmers more productive.

> Go is expressive, concise, clean, and efficient. Its concurrency mechanisms make it easy to write programs that get the most out of multicore and networked machines, while its novel type system enables flexible and modular program construction. Go compiles quickly to machine code yet has the convenience of garbage collection and the power of run-time reflection. It's a fast, statically typed, compiled language that feels like a dynamically typed, interpreted language.


想尝试一下 go，但是缺乏一个动力或者说具体的目的。
忽然想起来，某个网站项目后端原先是flask简单搭了个架子就直接付诸生产环境了，这回就用 go 重构一下。

## 配置 Go 开发环境
VSCode + Go Extension 不多说，网上一搜一大把。

[VsCode Go插件配置最佳实践指南](https://zhuanlan.zhihu.com/p/320343679)

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

## 自签名 ssl 证书
- [如何制作和使用自签名证书](https://zhuanlan.zhihu.com/p/349646806)

## ...
花了大半天时间写并调试完了 api，整体体验下来 Go 是相当优雅，是一款相当适合强迫症选手的语言。我很愿意在之后的工作中尝试 Go。

## 部分参考
- [Effectove Go](https://golang.google.cn/doc/effective_go)
- [深入学习用 Go 编写 HTTP 服务器](https://blog.csdn.net/kevin_tech/article/details/104100835)
- [用go搭建高效rest api服务（使用postgresql，redis，gin，gorm...）](https://zhuanlan.zhihu.com/p/299585136)
- [用 Golang 实现百万级 Websocket 服务](https://learnku.com/articles/23560/using-golang-to-achieve-million-level-websocket-service)
- [慢聊Go之GoLang中使用Gorilla Websocket｜Go主题月](https://juejin.cn/post/6946952376825675812)
