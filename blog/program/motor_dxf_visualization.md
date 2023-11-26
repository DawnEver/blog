---
slug: motor_dxf_visualization
title: 当电机模型不只是一张图纸
date: 2023-10-19
authors: benjamin
tags: [program, javascript, motor]
keywords: [motor, dxf]
description: Motor model visualization based on threejs and dxf
# image: /img/project/kz-admin.png
---
<!-- truncate --> -->


## 背景技术
### Three.js
[Three.js](https://threejs.org) 是一个基于 WebGL 的轻量 JavaScript 库，用于在Web浏览器中使用WebGL创建和显示动画3D计算机图形。
> Three.js is a lightweight cross-browser JavaScript library/API used to create and display animated 3D computer graphics on a Web browser. Three.js scripts may be used in conjunction with the HTML5 canvas element, SVG or WebGL.

### DXF
DXF 是AutoCAD DXF（Drawing Interchange Format或者Drawing Exchange Format）的简称，它是Autodesk公司开发的用于AutoCAD与其它软件之间进行CAD数据交换的CAD数据文件格式。

链接-> [Autodesk从Release 13到最新版本的DXF文档。](https://archive.ph/20121206003818/http://www.autodesk.com/dxf)

## 一拍即合
我们在电机设计中常常会使用 dxf 文件格式保存电机截面模型，但是二维的模型略有点单薄。

仅考虑轴向磁通电机时，我们可以轻易地由二维模型拉伸成三维立体模型。

正好最近学完了 GAMES101，对图形学热情正盛，想用 Three.js 搞点事情玩玩。

## 几个关键的坑
### 解析 dxf
以明文储存时，dxf的解析工作相当容易。

可以使用已有的 JavaScript 库 dxf-parser，也可以自己实现一下。

另一个项目中解析 dxf 的 python 代码可以说明一下原理：
```python
## 读取 dxf 文件, 建模
with open(dxf_temp_path, mode='r') as f:
    base_index=0
    commands=f.readlines()
    i=0
    while i <len(commands):
        line=commands[i]
        if line.startswith("LINE"):
            base_index=i
            start_x=float(commands[base_index+4][0:-1])
            start_y=float(commands[base_index+6][0:-1])
            stop_x=float(commands[base_index+10][0:-1])
            stop_y=float(commands[base_index+12][0:-1])
            draw_segment(start_x,start_y,stop_x,stop_y)
            i+=16

        elif line.startswith("ARC"):
            base_index=i
            center_x=float(commands[base_index+4][0:-1])
            center_y=float(commands[base_index+6][0:-1])
            radius=float(commands[base_index+10][0:-1])
            start_angle=float(commands[base_index+12][0:-1])
            stop_angle=float(commands[base_index+14][0:-1])
            draw_arc(center_x,center_y,radius,start_angle,stop_angle)
            i+=16
        else:
            i+=1
```

chaifuling 同学给出了基于 dxf-parser 将 CAD 文件渲染到网页中的解决方案。
参考[Dxf-parser:网页渲染CAD文件的解决方案](https://github.com/chaifuling/note/blob/main/Dxf-parser%20网页渲染CAD文件的解决方案.md)。
（虽然笔者在分析阶段也得出了类似的结论，但可惜的是笔者直到写本文才看到这篇报告...）

### 获取闭合路径
dxf 文件记录着一个电机模型是如何线性地画出的信息，但是我们不总能保证这只画笔不会抬起（如两个相邻的线段出现 头碰头 或 尾碰尾的情况）；

另一方面，由于模型往往是有“洞”的，我们往往需要从一个完整的文件中提取若干独立的闭合子路径。

于是我们需要对 dxf 文件中记录的所有实体（Entitiy） 重新排序并分组。

算法思路也很简单。

```
新建 Array temp_entity_groups，
遍历所有 Entities{
    遍历所有 temp_entity_groups{
        如果 entity 可以接在任何一个 group 的前面或后面{
            entity 放进 group 中
        }
        反之{
            在 temp_entity_groups 中新建一个只有 entity 的 group
        }
    }
}

此时，temp_entity_groups 中记录了若干段分立的路径。
在 dxf 文件中顺序记录各闭合路径时，temp_entity_groups 中的各路径就已经是所要的闭合路径了。
然后，我们对 temp_entity_groups 中的各个 group 重复上面循环的操作，不过是把 entity 的拼接换成 group 的拼接罢了。

```

### 数值相等
下面以 python 代码演示一下经典的 `0.1+0.2 != 0.3`:

```python
>>> 0.1+0.2
0.30000000000000004
```

在计算 ARC Entity 时，需要由 起始角度 和 终止角度 计算 起始点 和 终止点。

由于计算机数值计算的精度问题，这里就不免有了误差。

既然无法做到绝对相等，我们只要让绝对值小于一定误差即可。

```javascript
function valueEqual(a,b){
    return Math.abs(a-b)< 10e-5;
}
```

详细解释可以参考 [在js中0.1+0.2!=0.3的原因和解决方法](https://juejin.cn/post/7081649134800748574)。

### 其它
- ARC Entity 在交换 起始角度 和 终止角度 后需要修改时针方向
- ...

## 源码解析
```javascript
import { DxfParser } from "dxf-parser";
import { getEntityGroups } from "./entity-group";
...
// 解析 dxf
function updateModel(content) {
  try {
    dxf = parser.parse(content);
  } catch (err) {
    return console.error(err.stack);
  }

  var entity_groups = getEntityGroups(dxf);

  obj_list.forEach((obj) => scene.remove(obj));

  var options = {
    amount: 5,
    bevelThickness: 10,
    bevelSize: 0,
    bevelSegments: 0,
    bevelEnabled: true,
    depth: 5,
    depthWrite: false,
    // curveSegments: 1,
    // steps: 5,
  };
  var z_delta = 0.05;
  entity_groups.forEach((group) => {
    var shape = new THREE.Shape();
    group.entities.forEach((entity) => {
      if (entity.type == "LINE") {
        shape.moveTo(entity.vertices[0]["x"], entity.vertices[0]["y"]);
        shape.lineTo(entity.vertices[1]["x"], entity.vertices[1]["y"]);
      } else if (entity.type == "ARC") {
        shape.absarc(
          entity.center["x"],
          entity.center["y"],
          entity.radius,
          entity.startAngle,
          entity.endAngle,
          entity.rotateDir
        );
    ...
      }
    });
    // var geometry = new THREE.ShapeGeometry(shape);
    var geometry = new THREE.ExtrudeGeometry(shape, options);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff * Math.random(),
      transparent: true,
      opacity: 0.6,
    });
    var model = new THREE.Mesh(geometry, material);
    // var model = new THREE.LineSegments( geometry, material );
    // var model = new THREE.Points( geometry, material );
    model.position.z = z_delta;
    z_delta += z_delta;
    obj_list.push(model);
    scene.add(model);
  });
  render();
}
...

```

```javascript
// entity-group.js
class EntityGroup{
    constructor(entity,entity_start_x,entity_start_y,entity_stop_x,entity_stop_y){
        this.start_x=entity_start_x;
        this.start_y=entity_start_y;
        this.stop_x=entity_stop_x;
        this.stop_y=entity_stop_y;
        this.entities=[entity];
    }
    push_entity(entity,entity_stop_x,entity_stop_y){
        this.stop_x=entity_stop_x;
        this.stop_y=entity_stop_y;
        
        this.entities.push(entity);
    }
    unshift_entity(entity,entity_start_x,entity_start_y){
        this.start_x=entity_start_x;
        this.start_y=entity_start_y;
        this.entities.unshift(entity);
    }

    // 合并两个 entity_group
    push_group(another_group){
        this.entities=this.entities.concat(another_group.entities)
        this.stop_x=another_group.stop_x;
        this.stop_y=another_group.stop_y;
    }

    unshift_group(another_group){
        this.entities=[].concat(another_group.entities,this.entities);
        this.start_x=another_group.start_x;
        this.start_y=another_group.start_y;
    }

    push_reversed_group(another_group){
        var that_entities=[];
        for (var entity of another_group.entities){
            that_entities.unshift(reverseEntity(entity));
        }
        this.entities=this.entities.concat(that_entities)
        this.stop_x=another_group.start_x;
        this.stop_y=another_group.start_y;
    }

    unshift_reversed_group(another_group){
        var that_entities=[];
        for (var entity of another_group.entities){
            that_entities.unshift(reverseEntity(entity));
        }
        this.entities=[].concat(that_entities,this.entities);
        this.start_x=another_group.stop_x;
        this.start_y=another_group.stop_y;
    }
}

function valueEqual(a,b){
    return Math.abs(a-b)< 10e-5;
}


function reverseEntity(entity){
    // 实际需要，目前仅仅支持 ARC和 LINE
    let temp;
    if (entity.type=="ARC"){
        temp=entity.startAngle;
        entity.startAngle=entity.endAngle;
        entity.endAngle=temp;
        entity.rotateDir=!entity.rotateDir;

    }else if (entity.type=="LINE"){
        temp=entity.vertices[0]["x"];
        entity.vertices[0]["x"]=entity.vertices[1]["x"];
        entity.vertices[1]["x"]=temp;
        temp=entity.vertices[0]["y"];
        entity.vertices[0]["y"]=entity.vertices[1]["y"];
        entity.vertices[1]["y"]=temp;
    }else{
        throw("Unsupport Entity Type: ",entity.type);
    }
    return entity;
}

export function getEntityGroups(dxf){
    var temp_entity_groups=[];
    dxf.entities.forEach(entity => {
        let entity_start_x,entity_start_y,entity_stop_x,entity_stop_y;
        
        // 鱼咬尾
        if (entity.type=="ARC"){
            let center_x,center_y,radius,start_angle,stop_angle;
            center_x=entity.center["x"];
            center_y=entity.center["y"];
            radius=entity.radius;
            start_angle=entity.startAngle;
            stop_angle=entity.endAngle;
            // 计算 entity_start_x,entity_start_y,entity_stop_x,entity_stop_y
            entity_start_x=center_x+radius*Math.cos(start_angle);
            entity_start_y=center_y+radius*Math.sin(start_angle);
            entity_stop_x=center_x+radius*Math.cos(stop_angle);
            entity_stop_y=center_y+radius*Math.sin(stop_angle);
            entity.rotateDir=false;

        }else if (entity.type=="LINE"){
            entity_start_x=entity.vertices[0]["x"];
            entity_start_y=entity.vertices[0]["y"];
            entity_stop_x=entity.vertices[1]["x"];
            entity_stop_y=entity.vertices[1]["y"];
        }else{
            throw("Unsupport Entity Type: ",entity.type);
        }

        // 默认 entity 无家可归
        var homeless = true;
        // 进入 丑小鸭找妈妈 环节
        for (var i=0;i <temp_entity_groups.length;i++){
            var group=temp_entity_groups[i]
            if (valueEqual(group.start_x,entity_stop_x) &&valueEqual(group.start_y,entity_stop_y)){
                // group 头碰 entity 尾
                // start -> stop
                // [<-<-<-][<-]
                group.unshift_entity(entity,entity_start_x,entity_start_y);
                homeless = false;
                break;
            }else if (valueEqual(group.stop_x,entity_start_x) && valueEqual(group.stop_y,entity_start_y)){
                // 尾碰头
                //[<-][<-<-<-]
                group.push_entity(entity,entity_stop_x,entity_stop_y);
                homeless = false;
                break;
            }else if (valueEqual(group.start_x,entity_start_x) &&valueEqual(group.start_y,entity_start_y)){
                // group 头碰头
                //[<-<-<-][->]
                group.unshift_entity(reverseEntity(entity),entity_stop_x,entity_stop_y);
                homeless = false;
                break;
            }else if (valueEqual(group.stop_x,entity_stop_x) && valueEqual(group.stop_y,entity_stop_y)){
                // 尾碰尾
                //[->][<-<-<-]
                group.push_entity(reverseEntity(entity),entity_start_x,entity_start_y);
                homeless = false;
                break;
            }
        }

        // 自立门户
        if (homeless){
            temp_entity_groups.push(new EntityGroup(entity,entity_start_x,entity_start_y,entity_stop_x,entity_stop_y));
            return;
        }

    });

    var merged_entity_groups=[];
    temp_entity_groups.forEach(group => {
        // 默认 group 无家可归
        var homeless = true;
        merged_entity_groups.forEach(merged_group =>{
            if (valueEqual(merged_group.stop_x,group.start_x) && valueEqual(merged_group.stop_y,group.start_y)){
                // 头碰尾
                // start -> stop
                // m: merged_group g: group
                // [<-<-g<-<-][<-<-m<-<-]
                merged_group.push_group(group);
                homeless = false;
            }else if (valueEqual(merged_group.start_x,group.stop_x) && valueEqual(merged_group.start_y,group.stop_y)){
                // 尾碰头
                // m: merged_group g: group
                // [<-<-m<-<-][<-<-g<-<-]
                merged_group.unshift_group(group);
                homeless = false;
            }else if (valueEqual(merged_group.stop_x,group.stop_x) && valueEqual(merged_group.stop_y,group.stop_y)){
                // 尾碰尾
                // m: merged_group g: group
                // [->->m->->][<-<-g<-<-]
                merged_group.push_reversed_group(group);
                homeless = false;
            }else if (valueEqual(merged_group.start_x,group.start_x) && valueEqual(merged_group.start_y,group.start_y)){
                
                // 头碰头
                // m: merged_group g: group
                // [<-<-g<-<-][->->m->->]
                merged_group.unshift_reversed_group(group);
                homeless = false;
            }
        })
        // 开宗立派
        if (homeless){
            merged_entity_groups.push(group);
        }
        
    })
    return merged_entity_groups;
}
```

- [试玩链接](https://dxf.hi-motor.site)
- [项目链接](https://github.com/DawnEver/motor-dxf-visualization)

## TO-DO
- [ ] 在线 dxf 文件参数测量和标注