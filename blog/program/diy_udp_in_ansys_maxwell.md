---
slug: diy_udps_in_ansys_maxwell
title: 如何为 Ansys Maxwell 编写 UDPs(User Defined Primitives)
date: 2023-07-18
authors: benjamin
tags: [program, python, Maxwell, Intern]
keywords: [Maxwell, Motor, UDPs ]
description: 使用 Python 语言为 Ansys Maxwell 编写 UDPs(User Defined Primitives)
# image: /img/project/kz-admin.png
---
<!-- truncate -->

## 缘起

工作中，我需要在 Ansys 体系下实现某电机的参数化建模，经过技术选型（主要是因为没有 DesignModeller  的 liscense ），我选择在 Maxwell 下使用 UDPs(User Defined Primitives) 实现。

然后我简单检索了国内外资料，偌大的一个 Ansys Maxwell，居然都没有一个能看的技术文，偌大的一个 Ansys Maxwell，除了ppt，基本上没有什么能看的技术文档。

所以只好从官方 example 入手。

## 分析官方示例

通常默认安装，UDP文件会出现在`C:\Program Files\AnsysEM\v222\Win64\syslib\UserDefinedPrimitives`下如果没有找到该文件，可以尝试在 AnsysEM 路径下搜索。

我们在这个路径下可以看到 UserDefinedPrimitives.md ，该文档介绍了如何用 C++ 编写 UDP，可惜的是，我们在目录中只可以找到编译后的dll文件，无法给我们提供足够的项目架构参考。

原文如下：

```
Following are the steps to create a user-defined-primitive on PC platform:
1.) Generate the DLL defining this new primitive
2.) Copy the DLL to install_directory/userlib/UserDefinedPrimitives directory
On UNIX platform, following the same steps as above but create a 
"shared-library" instead of a DLL.

1a.) Generating "myUDP.DLL" on PC: 
  - Create an appropriate Microsoft-Developer-Studio workspace in some
    directory (suppose "UDPDir" is the path to this directory). Use the
    sample workspaces (RectangularSpiral.dsw or Gear.dsw) as a template. Example:
     - Copy Gear.dsw/Gear.dsp to myDLL.dsw/myDLL.dsp respectively. 
     - Make sure that these files are "writable"
     - Using a text editor, replace every occurance of "Gear" with "myDLL".
       Make sure that the myDLL.dsp and myDLL.dsw are saved to the disk after edits.
  - Create a source file "myUDP.cpp" in "UDPDir/Source" directory. This source
    file defines myUDP primitive. Use the sample source files 
    (RectangularSpiral.cpp or Gear.cpp) as a template. Example:
     - Copy Gear.cpp to UDPDir/myUDP.cpp
     - If myUDP.cpp is in a different directory than Gear.cpp, make sure to copy
       the sample "Headers" directory to "UDPDir"
     - Replace all implementations of functions in myUDP.cpp to suit your needs!
     - After these steps, your directory structure should resemble as:
       UDPDir/
             myUDP.dsw
             myUDP.dsp
             Headers/
                    UserDefinedPrimitiveDLLInclude.h
                    UserDefinedPrimitiveStructures.h
             Sources/
                    myUDP.cpp
     - Open myUDP.dsw in Microsoft-Developer-Studio
     - Build using "Win32 Release" configuration. Copy the resulting 
       "UDPDir/Release/myUDP.dll" to install_directory/userlib/UserDefinedPrimitives 
       directory (as mentioned above)

1b.) Generating "myDLL.so" shared-library on UNIX workstations: TBD

2.) Now, there is second signature available to create UDP dll. This signature allows 
to user to define many more parameter types, and also associated property types and flags.
User should use either of these 2 signature. If both the signatures are present, 
old signature will be given precedence. 
```

### Python 方案
同时，我们可以在 Examples 目录下看到两个Python，也有资料指出可以使用 python 编写 UDPs，那我们就从分析python文件开始。

geodesic_sphere.py 运用面向对象的写法，Rectangular_spiral.py 则采用相对传统的函数写法，这里从两个文件的完成时间上可以看到，前者在是2021年，后者是在2012年，2012年还是 python2的时代。

文件如下：

忽然发现已经不用解释了，那就不解释了吧。

```python
## Rectangular_spiral.py

##
########################################################
#                           Imports
##############################################################
import sys 

##############################################################
#                           Constants
##############################################################
primitiveInfo = UDPPrimitiveTypeInfo(
 name = "Rectangular Spiral",
 purpose = "Create a Rectangular Spiral in XY plane",
 company = "Ansys",
 date = "12-5-2012",
    version = "2.0")
defaultPrimitiveParams = [
  "0.0", 
     "0.0",
     "5.0",
     "2",
     "2.0",
     "1.0" 
]
primitiveParamDefs = [ UDPPrimitiveParameterDefinition2(
                        "Xpos", 
                        "X Position of start point", 
                        UnitType.LengthUnit, 
                        ParamPropType.Value, 
                        ParamPropFlag.MustBeReal, 
                        UDPParam(ParamDataType.Double,defaultPrimitiveParams[0])), #1 parameter
                    
                       UDPPrimitiveParameterDefinition2(
                        "Ypos", 
                        "Y Position of start point", 
                        UnitType.LengthUnit, 
                        ParamPropType.Value, 
                        ParamPropFlag.MustBeReal, 
                        UDPParam(ParamDataType.Double, defaultPrimitiveParams[1])), #2 parameter
                                 
                       UDPPrimitiveParameterDefinition2(
                        "Dist", 
                        "Distance between turns", 
                        UnitType.LengthUnit, 
                        ParamPropType.Value, 
                        ParamPropFlag.MustBeReal, 
                        UDPParam(ParamDataType.Double,defaultPrimitiveParams[2])), #3 parameter
                                 
                       UDPPrimitiveParameterDefinition2(
                        "Turns", 
                        "Number of turns", 
                        UnitType.NoUnit, 
                        ParamPropType.Number, 
                        ParamPropFlag.MustBeInt, 
                        UDPParam(ParamDataType.Int, defaultPrimitiveParams[3])), #4 parameter
                                 
                       UDPPrimitiveParameterDefinition2(
                        "Width", 
                        "Width of the spiral", 
                        UnitType.LengthUnit, 
                        ParamPropType.Value, 
                        ParamPropFlag.MustBeReal, 
                        UDPParam(ParamDataType.Double, defaultPrimitiveParams[4])), #5 parameter
                                 
                       UDPPrimitiveParameterDefinition2(
                        "Thickness", 
                        "Thickness/height of the spiral", 
                        UnitType.LengthUnit, 
                        ParamPropType.Value, 
                        ParamPropFlag.MustBeReal, 
                        UDPParam(ParamDataType.Double, defaultPrimitiveParams[5]))] #6 parameter


numParams = 6
lengthUnits = "mm"

registeredFaceNames = [ "InnerEndFace", "OuterEndFace"]
registeredEdgeNames = [ "Inner-B", "Inner-L", "Inner-T", "Inner-R",
                        "Outer-B", "Outer-L", "Outer-T", "Outer-R"]
registeredVertexNames =  ["Inner-B-L", "Inner-L-T", "Inner-T-R", "Inner-R-B",
                          "Outer-B-L", "Outer-L-T", "Outer-T-R", "Outer-R-B"]


##############################################################
#                       Class Implementation
##############################################################
class UDPExtension(IUDPExtension):

  def __init__(self):
    m_StartPt = UDPPosition(0,0,0)
    m_EndPt = UDPPosition(0,0,0)

#----------------------------------------------
# Interface implementations
#-----------------------------------------------

  def CreatePrimitive2(self, funcLib, paramValues):
    path = self._CreatePath(funcLib, paramValues) 
    if (path < 0):
        funcLib.AddMessage(MessageSeverity.ErrorMessage, "Could not create path")
    profile = self._CreateProfile(funcLib, paramValues)
    if (profile < 0):
        funcLib.AddMessage(MessageSeverity.ErrorMessage, "Could not create profile")

    theUDPSweepOptions = UDPSweepOptions(SweepDraftType.RoundDraft, 0.0, 0.0)
    bRet = funcLib.SweepAlongPath(profile, path, theUDPSweepOptions)
    if (bRet == False):
        funcLib.AddMessage(MessageSeverity.ErrorMessage, "Could not sweep profile along path")   
    self._NameEntities(funcLib, paramValues)
    return bRet


  def GetPrimitiveTypeInfo(self):
    return primitiveInfo

  def GetLengthParameterUnits(self):
    return lengthUnits

  def GetPrimitiveParametersDefinition2(self):
    return primitiveParamDefs
    
  def GetRegisteredFaceNames(self):
    return registeredFaceNames

  def GetRegisteredEdgeNames(self):
    return registeredEdgeNames

  def GetRegisteredVertexNames(self):
    return registeredVertexNames
  
  def AreParameterValuesValid2(self, error, udpParams):
    numTurns = udpParams[3].Data
    if (numTurns < 1):
      error.Add("Number of turns cannot be less than 1.")
      return False
    dist   = udpParams[2].Data
    width  = udpParams[4].Data
    height = udpParams[5].Data
    
    if (dist <= 0):
        error.Add("Distance should be more than 0.")
        return False

    if (width <= 0):
        error.Add("Width should be more than 0.")
        return False

    if (height <= 0):
        error.Add("Height should be more than 0.")
        return False

    if (dist <= width):
        error.Add("Distance between turns should be more than the width.")
        return False
    return True
#----------------------------------------------
# Private functions creating geometry of spiral
#-----------------------------------------------
  def _CreatePath(self, funcLib, paramValues):
    xStart = paramValues[0].Data
    yStart = paramValues[1].Data
    zStart = 0.0

    dist =     paramValues[2].Data
    numTurns = paramValues[3].Data

    numPoints = 2 + 4*numTurns
    numSegments = numPoints - 1

    thePointArrayX = []
    thePointArrayY = []
    thePointArray = []
    for indexPt in xrange(0, numPoints):
        thePointArrayX.append(xStart)
        thePointArrayY.append(yStart)

    thePointArrayY[1] = yStart
    thePointArrayX[numPoints-1] = xStart

    for indexPt in xrange(0, numTurns):
        xIndex = indexPt*4 + 1
        yIndex = xIndex + 1
        coord = dist*(indexPt + 1)

        thePointArrayX[xIndex] = xStart - coord
        thePointArrayX[xIndex + 1] = xStart - coord
        thePointArrayX[xIndex + 2] = xStart + coord
        thePointArrayX[xIndex + 3] = xStart + coord

        thePointArrayY[yIndex] = yStart + coord
        thePointArrayY[yIndex + 1] = yStart + coord
        thePointArrayY[yIndex + 2] = yStart - coord
        thePointArrayY[yIndex + 3] = yStart - coord

    for indexPt in xrange(0, numPoints):
        thePointArray.append(UDPPosition(thePointArrayX[indexPt], thePointArrayY[indexPt], zStart))

    self._m_StartPt = thePointArray[0]
    self._m_EndPt = thePointArray[numPoints - 1]

    theSegArray = []
    for indexSeg in xrange(0, numSegments):
        theSegDefinition = UDPPolylineSegmentDefinition(PolylineSegmentType.LineSegment,
                                                        indexSeg,
                                                        0, 0.0, UDPPosition(0,0,0), CoordinateSystemPlane.XYPlane)
        theSegArray.append(theSegDefinition)

    thePolylineDefinition = UDPPolylineDefinition(thePointArray, theSegArray, 0, 0)
    return funcLib.CreatePolyline(thePolylineDefinition)

  def _CreateProfile(self, funcLib, paramValues):
    xStart = paramValues[0].Data
    yStart = paramValues[1].Data
    
    width =  paramValues[4].Data
    height = paramValues[5].Data

    numPoints = 5
    numSegments = numPoints - 1
    
    thePointArray = []
    thePointArray.append(UDPPosition(xStart, yStart - (width/2.0), -height/2.0))
    thePointArray.append(UDPPosition(xStart, yStart + (width/2.0), -height/2.0))
    thePointArray.append(UDPPosition(xStart, yStart + (width/2.0), height/2.0))
    thePointArray.append(UDPPosition(xStart, yStart - (width/2.0), height/2.0))
    thePointArray.append(UDPPosition(xStart, yStart - (width/2.0), -height/2.0))

    theSegArray = []
    for indexSeg in xrange(0, numSegments):
        theSegDefinition = UDPPolylineSegmentDefinition(PolylineSegmentType.LineSegment,
                                                        indexSeg,
                                                        0, 0.0, UDPPosition(0,0,0), CoordinateSystemPlane.XYPlane)
        theSegArray.append(theSegDefinition)

    thePolylineDefinition = UDPPolylineDefinition(thePointArray, theSegArray, 1, 1)
    return funcLib.CreatePolyline(thePolylineDefinition)

  def _NameEntities(self, funcLib, paramValues):
    # Name faces
    funcLib.NameAFace(self._m_StartPt, registeredFaceNames[0])
    funcLib.NameAFace(self._m_EndPt, registeredFaceNames[1])

    width =  paramValues[4].Data
    height = paramValues[5].Data

    # Inner face edges
    # Inner face edge - Bottom
    posOnEdge = []
    posOnEdge.append(UDPPosition(self._m_StartPt.X, self._m_StartPt.Y, self._m_StartPt.Z - height/2.0))
    # Inner face edge - Left
    posOnEdge.append(UDPPosition(self._m_StartPt.X, self._m_StartPt.Y - width/2.0, self._m_StartPt.Z))
    # Inner face edge - Top
    posOnEdge.append(UDPPosition(self._m_StartPt.X, self._m_StartPt.Y, self._m_StartPt.Z + height/2.0))
    # Inner face edge - Right
    posOnEdge.append(UDPPosition(self._m_StartPt.X, self._m_StartPt.Y + width/2.0, self._m_StartPt.Z))
    # Outer face edges
    # Outer face edge - Bottom
    posOnEdge.append(UDPPosition(self._m_EndPt.X, self._m_EndPt.Y, self._m_EndPt.Z - height/2.0))
    # Outer face edge - Left
    posOnEdge.append(UDPPosition(self._m_EndPt.X, self._m_EndPt.Y - width/2.0, self._m_EndPt.Z))
    # Outer face edge - Top
    posOnEdge.append(UDPPosition(self._m_EndPt.X, self._m_EndPt.Y, self._m_EndPt.Z + height/2.0))
    # Outer face edge - Right
    posOnEdge.append(UDPPosition(self._m_EndPt.X, self._m_EndPt.Y+ width/2.0, self._m_EndPt.Z))
   
    # Inner face vertexs
    # Inner face vertex - (common to Bottom & Left edge)
    posOnVertex = []
    posOnVertex.append(UDPPosition(self._m_StartPt.X, self._m_StartPt.Y - width/2.0, self._m_StartPt.Z - height/2.0))
    # Inner face vertex - (common to Left & Top edge)
    posOnVertex.append(UDPPosition(self._m_StartPt.X, self._m_StartPt.Y - width/2.0, self._m_StartPt.Z + height/2.0))
    # Inner face vertex - (common to Top & Right edge)
    posOnVertex.append(UDPPosition(self._m_StartPt.X, self._m_StartPt.Y + width/2.0, self._m_StartPt.Z + height/2.0))
    # Inner face vertex - (common to Right & Bottom edge)
    posOnVertex.append(UDPPosition(self._m_StartPt.X, self._m_StartPt.Y + width/2.0, self._m_StartPt.Z - height/2.0))

    # Outer face vertexs
    # Outer face vertex - (common to Bottom & Left edge)
    posOnVertex.append(UDPPosition(self._m_EndPt.X, self._m_EndPt.Y - width/2.0, self._m_EndPt.Z - height/2.0))
    # Outer face vertex - (common to Left & Top edge)
    posOnVertex.append(UDPPosition(self._m_EndPt.X, self._m_EndPt.Y - width/2.0, self._m_EndPt.Z + height/2.0))
    # Outer face vertex - (common to Top & Right edge)
    posOnVertex.append(UDPPosition(self._m_EndPt.X, self._m_EndPt.Y + width/2.0, self._m_EndPt.Z + height/2.0))
    # Outer face vertex - (common to Right & Bottom edge)
    posOnVertex.append(UDPPosition(self._m_EndPt.X, self._m_EndPt.Y + width/2.0, self._m_EndPt.Z - height/2.0))
    
    for i in xrange(0, 8):
        funcLib.NameAEdge(posOnEdge[i], registeredEdgeNames[i])
        funcLib.NameAVertex(posOnVertex[i], registeredVertexNames[i])

```

```python
## geodesic_sphere.py
import math

__author__ = "maksim.beliaev@ansys.com"

primitive_info = UDPPrimitiveTypeInfo(
    name="Geodesic Sphere",
    purpose="A geodesic polyhedron has straight edges and flat faces that approximate a sphere",
    company="Ansys",
    date="21-12-2021",
    version="1.0",
)


primitive_param_definitions = [
    UDPPrimitiveParameterDefinition2(
        "radius",
        "Radius of sphere",
        UnitType.LengthUnit,
        ParamPropType.Value,
        ParamPropFlag.MustBeReal,
        UDPParam(ParamDataType.Double, 15),
    ),
    UDPPrimitiveParameterDefinition2(
        "frequency",
        "Indicates how many times each side of the base triangle is subdivided",
        UnitType.NoUnit,
        ParamPropType.Value,
        ParamPropFlag.MustBeReal,
        UDPParam(ParamDataType.Int, 4),
    ),
]


length_units = "mm"

##############################################################
#                       Class Implementation
##############################################################
class UDPExtension(IUDPExtension):
    def CreatePrimitive2(self, func_lib, param_values):
        """
        Inbuilt function that is called to generate a UDP after successful validation
        :param func_lib: drawing inbuilt class, see in Help: UDMFunctionLibrary
        :param param_values: list of udp parameter values (user input) generated by UDP Core
        :return: None
        """
        param_dict = self.get_param_dict(param_values)
        sphere = GeodesicSphere(func_lib, param_dict)
        sphere.draw()

    def GetPrimitiveTypeInfo(self):
        """
        Inbuilt function that returns information about UDP to be shown in UI dialog
        :return: primitive_info
        """
        return primitive_info

    def GetLengthParameterUnits(self):
        """
        Inbuilt function that rescales all input parameter values of UnitType.LengthUnit and code operations
        from length_units to 3D modeler units (in UI: Modeler -> Units)
        Example: length_units are "meter" and default parameter value is 0.126
            1. If modeler units are "mm" then user will see in UDP dialog default value as 126mm
            2. if you specify radius as 'param_dict["radius"] + 0.2' (where radius parameter is 17.8mm) will
            produce a circle with radius 0.2178m. Because user input is 17.8mm and then in code you add 2 length_units
            which are 'meter's. After rescaling we get 0.0178m+0.2m which results 0.2178m or 217.8mm
        :return: length_units
        """
        return length_units

    def GetPrimitiveParametersDefinition2(self):
        return primitive_param_definitions

    def AreParameterValuesValid2(self, error, param_values):
        """
        Inbuilt function that is called before generating a UDP
        :param error: error class, will be passed by UDP Core
        :param param_values: list of udp parameter values (user input) generated by UDP Core
        :return: True if no issue, False (and error message box) if face some issue
        """
        param_dict = self.get_param_dict(param_values)
        if param_dict["radius"] <= 0:
            error.Add("Radius must be positive")
            return False

        if param_dict["frequency"] < 2:
            error.Add("Frequency cannot be less than 2")
            return False

        return True

    # Custom Functions
    def get_param_value_by_name(self, param_values, param_name):
        """
        Function to get a value of a single parameter accessing it by name
        :param param_values: list of udp parameter values (user input) generated by UDP Core
        :param param_name: name of the parameter as specified in definition list
        :return: Value of the parameter or None if parameter does not exist
        """
        param_dict = self.get_param_dict(param_values)
        value = param_dict.get(param_name, None)
        return value

    def get_param_dict(self, param_values):
        """
        Function to return a dictionary of UDP parameter name and value (key: value) pairs
        :param param_values: list of udp parameter values (user input) generated by UDP Core
        :return: dict of parameter name and values
        """
        udm_param_def = self.GetPrimitiveParametersDefinition2()
        param_dict = {}
        for i, param in enumerate(udm_param_def):
            param_value = param_values[i].Data
            if str(param.PropType) != "Menu":
                param_dict[param.Name] = param_value
            else:
                param_dict[param.Name] = param_value.replace('"', "").split(",")[0]
        return param_dict


class Vector(object):
    def __init__(self, *args):
        """Create a vector, example: v = Vector(1,2)"""
        self.values = args

    def inner(self, vector):
        """Returns the dot product (inner product) of self and another vector"""
        if not isinstance(vector, Vector):
            raise ValueError("The dot product requires another vector")
        return sum(a * b for a, b in zip(self, vector))

    def __mul__(self, other):
        """Returns the dot product of self and other if multiplied
        by another Vector.  If multiplied by an int or float,
        multiplies each component by other.
        """
        if isinstance(other, Vector):
            return self.inner(other)
        elif isinstance(other, (int, float)):
            product = tuple(a * other for a in self)
            return self.__class__(*product)
        else:
            raise ValueError("Multiplication with type {} not supported".format(type(other)))

    def __rmul__(self, other):
        """Called if 4 * self for instance"""
        return self.__mul__(other)

    def __truediv__(self, other):
        if isinstance(other, Vector):
            divided = tuple(self[i] / other[i] for i in range(len(self)))
        elif isinstance(other, (int, float)):
            divided = tuple(a / other for a in self)
        else:
            raise ValueError("Division with type {} not supported".format(type(other)))

        return self.__class__(*divided)

    def __add__(self, other):
        """Returns the vector addition of self and other"""
        if isinstance(other, Vector):
            added = tuple(a + b for a, b in zip(self, other))
        elif isinstance(other, (int, float)):
            added = tuple(a + other for a in self)
        else:
            raise ValueError("Addition with type {} not supported".format(type(other)))

        return self.__class__(*added)

    def __radd__(self, other):
        """Called if 4 + self for instance"""
        return self.__add__(other)

    def __sub__(self, other):
        """Returns the vector difference of self and other"""
        if isinstance(other, Vector):
            subbed = tuple(a - b for a, b in zip(self, other))
        elif isinstance(other, (int, float)):
            subbed = tuple(a - other for a in self)
        else:
            raise ValueError("Subtraction with type {} not supported".format(type(other)))

        return self.__class__(*subbed)

    def __rsub__(self, other):
        """Called if 4 - self for instance"""
        return self.__sub__(other)

    def __iter__(self):
        return self.values.__iter__()

    def __len__(self):
        return len(self.values)

    def __getitem__(self, key):
        return self.values[key]

    def __repr__(self):
        return str(self.values)


class GeodesicSphere:
    def __init__(self, func_lib, param_dict):
        self.func_lib = func_lib
        self.param_dict = param_dict
        self._edge_length_norm = 1
        self._created_triangles = []

    def draw(self):
        all_points = self.icosahedron_vertices()

        for point in all_points:
            self.create_icosahedron_face(point, all_points)

    def create_icosahedron_face(self, point, all_points):
        """
        Find 5 nearest points for 'point' in 'all_points' and create icosahedron face
        :return:
        """
        freq = self.param_dict["frequency"]
        closest = []
        for p in all_points:
            if abs(dist(point, p) - self._edge_length_norm) < 0.1:
                # take only points on distance of self._edge_length_norm
                closest.append(p)

        # now we need to identify which points from 'closest' could be connected to triangle for icosahedron face
        for p in closest:
            for p2 in closest:
                if abs(dist(p, p2) - self._edge_length_norm) < 0.1:
                    triangle = tuple(sorted([point, p, p2]))
                    if triangle not in self._created_triangles:
                        self._created_triangles.append(triangle)
                        self.subdivide(point, p, p2, freq)

    def subdivide(self, pg1, pg2, pg3, freq):
        """
        Take each triangle defined by three points pg1, pg2, pg3 and divide it into smaller triangles.
        Each edge is divided by 'freq'

        Assumes that icosahedron face vertices are ABC and loop over i and j:
             C
         i /  \
         /     \
        A-------B
            j
        """
        a = Vector(*pg1)
        b = Vector(*pg2)
        c = Vector(*pg3)

        ac = (c - a) / freq
        ab = (b - a) / freq

        radius = self.param_dict["radius"]
        # create triangles with peak towards C
        for i in range(freq):
            for j in range(freq - i):
                p1 = a + i * ac + j * ab
                p2 = a + i * ac + (j + 1) * ab
                p3 = a + (i + 1) * ac + j * ab
                self.create_triangle(
                    rescale(p1, radius),
                    rescale(p2, radius),
                    rescale(p3, radius),
                )

        # create triangles with peak towards AB
        for i in range(freq - 1):
            for j in range(freq - i - 1):
                p1 = a + (i + 1) * ac + (j + 1) * ab
                p2 = a + i * ac + (j + 1) * ab
                p3 = a + (i + 1) * ac + j * ab
                self.create_triangle(
                    rescale(p1, radius),
                    rescale(p2, radius),
                    rescale(p3, radius),
                )

    def create_triangle(self, *coord_list):
        """
        Create a triangle from 3 points
        :param coord_list: list with 3 coordinates
        """
        points_list = [UDPPosition(coord[0], coord[1], coord[2]) for coord in coord_list]

        segments_list = []
        for i in range(3):
            segments_list.append(self.add_line_segment(i))

        # UDPPolylineDefinition(list of UDPPosition, list of UDPPolylineSegmentDefinition, int closed, int covered)
        polyline_def = UDPPolylineDefinition(points_list, segments_list, 1, 1)
        self.func_lib.CreatePolyline(polyline_def)

    @staticmethod
    def add_line_segment(index):
        # UDPPolylineSegmentDefinition(PolylineSegmentType, int segmentStartIndex, int numberOfPoints, double angle,
        #     UDPPosition centerPoint, CoordinateSystemPlane)
        segments_def = UDPPolylineSegmentDefinition(
            PolylineSegmentType.LineSegment, index, 0, 0.0, UDPPosition(0, 0, 0), CoordinateSystemPlane.XYPlane
        )
        return segments_def

    def icosahedron_vertices(self):
        """
        Generate vertices for normalized icosahedron with edge length of 1
        :return: list of generated points
        """
        t2 = math.pi / 10.0
        t4 = math.pi / 5.0
        r = (self._edge_length_norm / 2.0) / math.sin(t4)
        h = math.cos(t4) * r
        c_x = r * math.sin(t2)
        c_z = r * math.cos(t2)
        h1 = math.sqrt(1 - r ** 2)
        h2 = math.sqrt((h + r) * (h + r) - h * h)
        y2 = (h2 - h1) / 2.0
        y1 = y2 + h1
        all_points = [
            (0, y1, 0),
            (r, y2, 0),
            (c_x, y2, c_z),
            (-h, y2, self._edge_length_norm / 2),
            (-h, y2, -self._edge_length_norm / 2),
            (c_x, y2, -c_z),
            (-r, -y2, 0),
            (-c_x, -y2, -c_z),
            (h, -y2, -self._edge_length_norm / 2),
            (h, -y2, self._edge_length_norm / 2),
            (-c_x, -y2, c_z),
            (0, -y1, 0),
        ]
        return all_points


def dist(p1, p2):
    """
    Distance between two points p1 and p2
    :return: float, distance
    """
    length = math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2)
    return length


def rescale(vector, radius):
    """
    Project "vector" points to the sphere of radius "radius"
    :return: rescaled "vector"
    """
    vector *= radius / math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2)
    return vector
```