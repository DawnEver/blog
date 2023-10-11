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
# Content
- [Run All Tests](#run-all-tests)
- [Excel to Dataframe](#excel-to-dataframe)
- [Resolve ModuleNotFoundError](#resolve-modulenotfounderror)
- [Import all *.py files as module](#import-all-*.py-files-as-module)

## Run All Tests
Take folder *hi-motor-designer* as example, below codes will add *hi-motor-designer* to python system path.

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

## Excel to Dataframe
```python
import csv
import pandas as pd

def mock_func(x1,x2,x3,x4,x5,x6):
    x1=["var_name"]+x1.tolist()
    return (x1,x1,x1,x1,x1,x1,x1,x1)

source_path="source.xlsx"

df_cc_condition_names=[]

T_index_list=[]

def sheet2dfs(sheet_name):
    df_dict={name:None for name in df_cc_condition_names}
    usecols=list(range(len(T_index_list)))
    df = pd.read_excel(io=source_path, sheet_name=sheet_name,index_col=0,usecols=usecols,header=3)

    for index,name in enumerate(df_cc_condition_names):
        df_temp=df[index*8+1:index*8+1+6]
        df_dict[name]=df_temp.T
    return df_dict

for sheet_name in []:
    df_dict=sheet2dfs(sheet_name)
    output_path=f"output_{sheet_name}.csv"
    with open(output_path, 'w') as file:
        mywriter = csv.writer(file, delimiter=',')

        mywriter.writerow(T_index_list)
        for name in df_dict.keys():
            mywriter.writerow([])
            mywriter.writerow([name])
            df_temp=df_dict[name]
            index_names=df_temp.index.values
            res=mock_func(df_temp[index_names[0]],
                    df_temp[index_names[1]],
                    df_temp[index_names[2]],
                    df_temp[index_names[3]],
                    df_temp[index_names[4]],
                    df_temp[index_names[5]])
            mywriter.writerows(res)
```

## Resolve ModuleNotFoundError
```python
try:
    import PyQt5
except ModuleNotFoundError:
    os.system("pip install PyQt5")
    from PyQt5.Qt import *
else:
    from PyQt5.QtWidgets import QApplication, QWidget, QPushButton, QLabel, QLineEdit, QFrame, QMessageBox, QComboBox
    from PyQt5.QtGui import QIcon, QFont
    from PyQt5.QtCore import Qt
```


## Import all *.py files as module
```python
# __init__.py
import os

__all__=[]
dir=os.path.split(os.path.realpath(__file__))[0]
for file in os.listdir(dir):
    if file.endswith(".py"):
        if file=="__init__.py":
            continue
        __all__.append(file[:-3])
```