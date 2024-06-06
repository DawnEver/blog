---
slug: CTF
title: CTF
date: 2023-7-7
authors: benjamin
tags: [CTF]
keywords: [CTF]
description: CTF
# image: /img/project/kz-admin.png
---
<!-- truncate -->

PWN、Reverse：偏重对汇编、逆向及底层核心的理解

Crypto：偏重对数学、算法的学习，密码学要深入学习

Web：偏重对技巧沉淀、快速搜索能力的挑战、发散性思维，对底层、代码原理只需要了解，相关漏洞知识的积累

Misc：偏重则更复杂，所有与计算机安全挑战有关的都在其中，隐写、图片数据分析还原、流量分析、大数据、游戏逆向分析等等

常规操作
A方向：PWN+Reverse+Crypto 随机搭配

B方向：Web+Misc组合

Misc所有人都可以做

入门知识
团队要学的内容：linux基础、计算机组成原理、操作系统原理、网络协议分析

A方向：IDA工具使用（fs插件）、逆向工程、密码学、缓冲区溢出等

B方向：Web安全、网络安全、内网渗透、数据库安全、top10的安全漏洞等

推荐书籍
A方向：

RE for Beginners
IDA Pro权威指南
揭秘家庭路由器0day漏洞挖掘技术
自己定操作系统
黑客攻防技术宝典：系统实战篇 有各种系统的逆向讲解

B方向：

Web应用安全权威指南 最推荐小白，宏观web安全
Web前端黑客技术揭秘
黑客秘籍—渗透测试实用指南
黑客攻防技术宝典 web实战篇 web安全的所有核心基础点，有挑战性，最常规，最全，学好会直线上升
代码审计：企业级web代码安全架构

入门----从基础题目出发（推荐资源）
https://www.freebuf.com/ 网安社区
http://ctf.idf.cn 首推 idf实验室：题目非常基础，单个知识点
https://www.ichunqiu.com i春秋，有线下决赛题目复现
http://oj.xctf.org.cn/xctf 题库网站，历年题，练习场，比较难
http://www.wechall.net/challs !!!!!!非常入门的国外ctf题库，很多国内都是从这里刷题成长起来的
http://canyouhack.it/ 国外，入门，有移动安全
https://microcorruption.com/login A方向 密码，逆向酷炫游戏代
http://smashthestack.org A方向，简洁，国外，wargames，过关
http://overthewire.ofg/wargames/ !!!!推荐A方向 国内资料多，老牌wargame
https://exploit-exercises.com A方向 老牌wargame，国内资料多
http://pawnable.kr/play.php pwn类游乐场，不到100题
http://ctf.moonsoscom/pentest/index.php B方向 米安的Web漏洞靶场，基础，核心知识点
http://prompt.ml/0 B方向 国外的xss测试
http://redtiger.labs.overthewire.org/ B方向 国外sql注入挑战网站，10关，循序渐近地练习

github工具
https://github.com/truongkma/ctf-tools
https://github.com/Plkachu/v0lt
https://github.com/zardus/ctf-tools
https://github.com/TUCTF/Tools


Learning
http://ctfs.github.io/resources/ - Introduction to common CTF techniques such as cryptography, steganography, web exploits (Incomplete)
https://trailofbits.github.io/ctf/forensics/ - Tips and tricks relating to typical CTF challenges/scenarios
https://ctftime.org/writeups - Explanations of solutions to past CTF challenges
Resources
https://ctftime.org - CTF event tracker
https://github.com/apsdehal/awesome-ctf - Comprehensive list of tools and further reading
Tools (That I use often)
binwalk - Analyze and extract files
burp suite - Feature packed web penetration testing framework
stegsolve - Pass various filters over images to look for hidden text
GDB - Binary debugger



中国国家信息安全漏洞库https://www.cnnvd.org.cn/home/childHome
CVE（Common Vulnerabilities & Exposures，通用漏洞披露） https://cve.mitre.org/
美国国家漏洞数据库（NVD）
丹麦安全公司Secunia
Security Focus Bugtraq
美国IBM公司的ISS X-Force
