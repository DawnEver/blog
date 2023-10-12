---
slug: cython_pyinstaller_project
title: 如何使用 Cython + PyInstaller 编译大型项目
date: 2023-10-11
authors: bennett
tags: [program, python, cython]
keywords: [cython, pyinstaller]
description: 使用 Cython 和 PyInstaller 编译一个大型项目
# image: /img/project/kz-admin.png
---
<!-- truncate -->

[PyInstaller](https://www.pyinstaller.org) 是一个 python 打包工具。允许将Python代码和所有依赖项打包到一个可执行文件中，使得应用程序可以在没有Python解释器的情况下运行。

[Cython](https://cython.org) 是一个 Python 的静态编译器。使为 Python 编写 C 扩展就像 Python 本身一样简单。
> Cython is an optimising static compiler for both the Python programming language and the extended Cython programming language (based on Pyrex). It makes writing C extensions for Python as easy as Python itself.

Cython和Python的主要区别主要有：
- 运行时解释和预先编译；
- 动态类型和静态类型；
- ...

Python代码在运行之前，会先被编译成pyc文件，然后读取里面的PyCodeObject对象，执行内部的字节码。

Cython是Python的一个超集，将python代码编译成C语言，在带来一定性能提升的同时，并实现汇编代码级别动代码加密。



## 几个问题
然而，当前这套方案的实施中存在了诸多问题。

### 不兼容若干 python 新特性
如 Python 3.10 引入的 match... case 语句。

> match...case... statement, proposed in PEP 634: Structural Pattern Matching,provides pattern matching process for users like switch statement in C/C++.
> However, this statement is not supported in current Cython.

为此，我曾在 cython github 下提出过 issue。[[BUG] Unsupport match...case... statement when compiling *.py #5755](https://github.com/cython/cython/issues/5755#event-10584951186)

但是近期似乎并没有支持这个特性的迹象。

### 在MacOS下，大型项目编译速度慢
不多说，老问题了。

### 丧失依赖关系信息
Cython 编译出的 *.pyd 并不会直接暴露 python 包的 import 依赖关系信息。Pyinstaller 直接对入口文件打包很可能会存在一些包依赖的问题。

这就需要我们手动加一个 `packages.py` 文件，在其中导入所有依赖包并在入口文件导入 packages，如 `from packages import *`。


## 代码
> Talk is cheap. Show me the code. Torvalds, Linus 2000/08/25

```python
# setup.py

import compileall
import os, shutil, time
from distutils.core import setup
from Cython.Build import cythonize
from PyInstaller.__main__ import run
import numpy

except_path_set=(__file__,)
projetc_root_path = os.path.abspath('.')
build_dir = os.path.join(projetc_root_path,"build")
build_tmp_dir = os.path.join(build_dir ,"temp")

def get_py(folder_path,except_file_path_set):
    py_files_rel_path=[]
    init_files_rel_path=[]
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".py") or file.endswith(".pyx"):
                path = os.path.join(root, file)
                if path in except_file_path_set:
                    continue
                if file == '__init__.py':
                    init_files_rel_path.append(path)
                else:
                    py_files_rel_path.append(path)   
    return py_files_rel_path,init_files_rel_path
    ######################################
    # 获取所有py文件，排除隐藏文件夹和__init__.py
    # 都是相对于项目根目录的相对路径
    # xxx_rel_path 相对路径
    # xxx_path 绝对路径

def compile(py_files_rel_path,init_files_rel_path):
    
    ######################################
    # 编译所有py文件
    try:
        setup(
            ext_modules=cythonize(py_files_rel_path, compiler_directives={'language_level': 2}),
            include_dirs=[numpy.get_include()],
            script_args=["build_ext", "-b", build_dir, "-t", build_tmp_dir],
        )
    except Exception as e:
        print(f"error! {e}")
    if os.path.exists(build_tmp_dir):
        shutil.rmtree(build_tmp_dir)


    ######################################
    # 所有 init.pyc 文件移动到 build 文件夹下对应位置
    for file in init_files_rel_path:
        compileall.compile_file(file, legacy=True)
        # 编译后的文件
        pyc_dir_rel_path=os.path.dirname(file)
        pyc_rel_path = os.path.join(pyc_dir_rel_path, "__init__.pyc")
        if os.path.exists(pyc_rel_path):
            # 应该放到的目录
            taget_dir_path = os.path.join(build_dir,pyc_dir_rel_path)
            if not os.path.exists(taget_dir_path):
                os.makedirs(taget_dir_path)
            shutil.move(pyc_rel_path, os.path.join(taget_dir_path, "__init__.pyc"))
        else:
            print("file not exists:{}".format(pyc_rel_path))

    
def remove_c(projetc_root_path="."):
    # 删除 *.c
    for root, dirs, files in os.walk(projetc_root_path):
        for file in files:
            if file.endswith(".c"):
                os.remove(os.path.join(root, file))
    print("Delete all *.c files")

def py2exe(start_file):
    # 拷贝 入口文件
    start_file_build=os.path.join(build_dir,start_file)
    shutil.copyfile(start_file,start_file_build)
    
    # 运行 PyInstaller

    attachments_list=[
        "--add-data", ".../usr;usr",
    ]
    splash_path=""
    icon_path=""

    run([
        start_file_build,
        "--name","Hi-Motor-Designer",
        # "--splash",splash_path, # 开机动画
        # "--icon",icon_path,
        "--noconfirm", # Replace output directory without confirmation
        "--onedir",
        "--windowed",

        "--workpath","build",
        "--distpath","dist",
        "--specpath",".",
        "--contents-directory","...",

        *attachments_list,
    ])

def build_flow():
    start_time = time.time()
    for source_folder in ["a","b"]:
        py_files_rel_path,init_files_rel_path=get_py(source_folder,except_path_set)
        compile(py_files_rel_path,init_files_rel_path)
        remove_c()
        print(f"Successfully compiled {source_folder} in {time.time() - start_time} seconds")
    start_time = time.time()
    py2exe(start_file="run.py")
    print(f"Successfully convert python script to exe in {time.time() - start_time} seconds")

if __name__ == "__main__":
    # 1 手动选择执行
    # 0 执行全部
    if 0: 
        # 编译
        if 0: # 0 不编译 1 编译 
            source_folder_opt=[
                ".", # 0
                "a", # 1
                "b/core", # 2
                ]
            source_folder=source_folder_opt[0]
            start_time = time.time()
            py_files_rel_path,init_files_rel_path=get_py(source_folder,except_path_set)
            compile(py_files_rel_path,init_files_rel_path)
            remove_c()
            print(f"Successfully compiled {source_folder} in {time.time() - start_time} seconds")
        
        # 打包exe
        start_time = time.time()
        py2exe(start_file="run.py")
        print(f"Successfully convert python script to exe in {time.time() - start_time} seconds")
    else: 
        build_flow()
```

## 参考
- [Cython+Pyinstaller Python编译与打包-踩坑H](https://zhuanlan.zhihu.com/p/90734129)