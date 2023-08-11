---
slug: retired_code_python
title: 那些退休但不忍丢弃的代码- Python
date: 2023-08-12
authors: bennett
tags: [retired_code, python]
keywords: [python]
description: 那些退休但不忍丢弃的代码- Python
# image: /img/project/kz-admin.png
---
<!-- truncate -->



```python
# test_all.py
import os
import sys

script_path = os.path.abspath(__file__)
root_path = re.search(r".*(hi-motor-designer)", script_path).group(0)
sys.path.append(root_path)

def test_demo(file_path=root_path+'/tests') -> None:
    for path,folder_names,file_names in os.walk(file_path):
        for file_name in file_names:
            if file_name.startswith("test_"):
                f= f'python {path}/{file_name} --test true'
                os.system(f)
        for folder_name in folder_names:
            test_demo(f"{path}/{folder_name}/")

if __name__ == "__main__":
    test_demo()
```