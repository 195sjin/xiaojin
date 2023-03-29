

# Maven管理

## 简单了解一下什么是Maven

如今我们构建一个项目需要用到很多第三方的类库，如写一个使用Spring的Web项目就需要引入大量的jar包。一个项目Jar包的数量之多往往让我们瞠目结舌，并且Jar包之间的关系错综复杂，一个Jar包往往又会引用其他Jar包，缺少任何一个Jar包都会导致项目编译失败。

以往开发项目时，程序员往往需要花较多的精力在引用Jar包搭建项目环境上，而这一项工作尤为艰难，少一个Jar包、多一个Jar包往往会报一些让人摸不着头脑的异常。

**而Maven就是一款帮助程序员构建项目的工具，我们只需要告诉Maven需要哪些Jar 包，它会帮助我们下载所有的Jar，极大提升开发效率。**

## 一.官网下载

Maven官网下载地址：http://maven.apache.org/download.cgi

![image-20221217201611366](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217201611366.png)

![image-20221217201620652](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217201620652.png)

## 二、环境变量配置

在path中新建

新建值为
```
%MAVEN_HOME%\bin
```

## 三、配置maven仓库下载镜像

下载jar包需要翻墙出去，下载速度慢，所以需要配置一下

打开Maven的安装目录>conf文件夹>setting.xml用记事本或者notepad++打开

![image-20221217201647746](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217201647746.png)

```
 <mirror>
		 <id>nexus-aliyun</id>
		 <mirrorOf>*</mirrorOf>
		 <name>Nexus aliyun</name>
		 <url>http://maven.aliyun.com/nexus/content/groups/public</url>
	</mirror>
```


## 四、修改默认Maven的仓库位置

在开发Maven项目过程中会下载非常多的jar包，而Maven默认的下载位置在C盘

1）.默认的Maven仓库位置为：`C:\Users\.m2\repository`

2）仓库位置还是放在其他盘比较好，我把它放在D盘了

![image-20221217201741125](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217201741125.png)

 打开Maven的安装目录>conf文件夹>setting.xml用记事本或者notepad++打开

![image-20221217201804149](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217201804149.png)

## 五、 IDEA集成Maven

idea中内置了一个maven，但一般不适用内置的，因为用内置的maven修改maven的配置不方便。使用自己安装的maven，需要覆盖idea中的默认的设置。让idea知道maven安装的信息。

有两个地方需要配置：File-settings和File-other settings

在settings中配置是为了当前打开的工程，而other settings是之后新建的工程设置的。所以两个地方都要配置。
![image-20221217201833697](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217201833697.png)

如果没有`File-other settings`，那么在`File - New Project Settings`中可以找到。

![image-20221217201849122](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217201849122.png)

### settings的设置

![image-20221217201928639](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217201928639.png)

Maven home path：是你maven下载在哪

setings.file：选择你conf目录下的setting.xml文件，并且勾选

下面的repository自动就出来了



**然后我们在Maven-Runner下进行两项的修改：**

- `-DarchetypeCatalog=internal`：maven创建项目时，会联网下载模板文件，比较大，使用这个选项就不用下载了，创建maven项目块。

![image-20221217202006056](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217202006056.png)

- 对于new project settings，设置的方法和步骤基本和上述的settings一致，这里不再赘述。

## 六、 IDEA创建Maven版Java工程

![image-20221217202034672](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217202034672.png)

![image-20221217202053058](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217202053058.png)

补全完整web项目的目录：

![image-20221217202117008](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217202117008.png)

然后我们在pom文件中加入相关依赖：

```
    <!--jsp的依赖（jsp相关的jar加进来）-->
    <dependency>
      <groupId>javax.servlet.jsp</groupId>
      <artifactId>javax.servlet.jsp-api</artifactId>
      <version>2.2.1</version>
      <scope>provided</scope>
    </dependency>
          <!-- 日志 -->
      <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.2.3</version>
      </dependency>

      <!-- ServletAPI -->
      <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
      </dependency>
```

## 小技巧

![image-20221217202133156](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217202133156.png)

每次传入依赖的时候会有错，刷新一下就没有了

**导入已有模块**

按住`Ctrl+Alt+Shift+S`，打开项目结构设置

或者是界面右上角的带有三个蓝色小方形的文件夹图标，进入设置

![image-20221217202151543](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217202151543.png)

- 点击弹出界面中的加号：`Add`，选择Import Module导入模块
- 选择要导入的模块，进行进一步的JDK等设置即可。
