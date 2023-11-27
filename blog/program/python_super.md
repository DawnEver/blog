---
slug: python_super
title: Use super() to Call func() of Its Parent Class
date: 2023-09-28
authors: benjamin
tags: [program, python, class]
keywords: [python, super()]
description: Use super() to Call func() of Its Parent Class
# image: /img/project/kz-admin.png
---
<!-- truncate -->


As is shown below, I wanted to call __init__() of A,B and C, but found `super(A,self).__init__()` calling `B.__init__()` and `super(C,self).__init__()` calling built-in `__init__()`.

```python
class A:
    def __init__(self) -> None:
        print("init A")

class B:
    def __init__(self) -> None:
        print("init B")


class C():
    def __init__(self) -> None:
        print("init C")

class D(A,B,C):
    def __init__(self) -> None:
        super(A,self).__init__() # call B.__init__()
        super(B,self).__init__() # call C.__init__()
        super(C,self).__init__() # call built-in __init__()

d=D()
"""
expected output:
    init A
    init B
    init C

output:
    init B
    init C
"""
```


The confusing phenomenon is due to my mistakes on `super()`.`super(A,self).func()` call the func() of next parent class in **MRO** not `A.func()`.

Following is the right code.

```python
class A:
    def __init__(self) -> None:
        print("init A")

class B:
    def __init__(self) -> None:
        print("init B")

class C():
    def __init__(self) -> None:
        print("init C")

class D(A,B,C):
    def __init__(self) -> None:
        super().__init__() # call B.__init__()
        super(A,self).__init__() # call C.__init__()
        super(B,self).__init__() # call built-in __init__()

d=D()

"""
output:
    init A
    init B
    init C
"""
```
