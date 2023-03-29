# Linux学习

## Linux用途

在免费服务器领域的应用是最强的

特点：免费、稳定、高效

## Linux与Windows对比

**文件系统是采用层级式的树状目录结构**

**在Linux世界里，一切皆文件**
![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292025728.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292025925.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292025170.png)

## 主机名解析过程

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292025506.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292025497.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292025963.png)


## Linux目录结构

![image-20230316105143148](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292026034.png)

**/bin 存放最常使用的命令**

/sbin 存放系统管理员使用的系统管理程序

**/home 存放普通用户的主目录，每一个用户都有自己的主目录，一般目录名都是以用户的账号命名**

**/root 为系统管理员，超级权限者的用户主目录**

/lib 系统开机所需要的最基本的动态连接共享库

/lost+found 一般是空的，当系统非法关机，就存放一些文件

**/etc 所有系统管理所需要的配置文件和子目录，比如安装mysql数据库my.conf**

**/usr 应用程序和文件都放在这**

**/boot 存放linux启动时使用的一些核心文件，包括一些讲解文件以及镜像文件**

/proc 不能动，是系统内存的映射

/srv 不能动，服务启动后需要提取的数据

/sys 不能动 

/tmp 存放临时文件

/dev 类似Windows的设备管理器，把硬件用文件形式存储

**/media 系统会自动识别一些设备，识别后，把设备挂载到这个目录下**

**/mnt 为了让用户临时挂载别的文件系统，把外部的存储挂载到/mnt/，然后进入该目录就可以查看**

/opt 给主机额外安装软件所存放的目录

**/usr/local  另一个给主机额外安装软件所安装的目录**

**/var 存放着不断扩充的东西，习惯把经常被修改的目录放在这个目录下，包括各种日志文件**

## Linux常用命令

![image-20230316105744690](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292026455.png)

![image-20230316110440670](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292026453.png)


## Linux技巧
![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292026482.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292026834.png)

## 关机、重启、用户登录和注销

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292026860.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292026988.png)


## ls---显示指定目录下的内容

![]("https://raw.githubusercontent.com/195sjin/myBed/master/images202303292027315.png)

## touch---创建空文件

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292027877.png)


## cd---切换目录

理解：绝对路径和相对路径

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292027324.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292027497.png)

## cat---显示文件内容

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292027520.png)

## echo---输出内容到控制台

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292027716.png)

## more---以分页的形式显示文件内容

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292027412.png)


## tail---查看文件末尾内容

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292027093.png)

## 输出重定向和追加

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028048.png)


## mkdir---创建目录

![image-20230316131446861](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028704.png)

## redir---删除空目录



![image-20230316131642483](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028907.png)

## rm---删除文件或目录

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028583.png)

## cp---复制文件或目录



![image-20230316132717111](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028893.png)

**强制覆盖不提示 \cp ,\cp -r /home/bbb/opt**



## mv---文件改名或移动



![image-20230316133244516](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028274.png)

## tar---对文件打包、压缩、解压



![image-20230316133947268](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028720.png)



![image-20230316135002257](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028240.png)


![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028438.png)



![image-20230316135426799](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028225.png)



## vi/vim---对文本进行编辑

![image-20230316135726873](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292028389.png)





![image-20230316140543763](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029339.png)

### 命令模式

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029472.png)

### 插入模式

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029366.png)

### 底行模式

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029118.png)

### 三种模式相互切换

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029275.png)


## find---在指定目录下查找文件

![image-20230316141630989](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029505.png)



## grep---在文件中查找指定文本内容

![image-20230316141848839](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029662.png)

## chmod---权限

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029882.pngv)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029484.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029421.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029754.png)


## crontab---定时任务调度

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292029104.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030556.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030951.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030038.png)

![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030164.png)


## 软件安装

![image-20230316144355095](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030273.png)

### 安装jdk



![image-20230316144818928](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030383.png)

### 安装tomcat



![image-20230316150320818](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030518.png)

![image-20230316151448558](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030704.png)

#### 防火墙设置

![image-20230316152336249](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030431.png)



查看防火墙状态(systemctl status firewalld. firewall-cmd --state)
暂时关闭防火墙(systemctl stop firewalld)
永久关闭防火墙(systemctl disable firewalld)
开启防火墙(systemctl start firewalld)
开放指定端口(firewall-cmd --zone=public --add-port=8080/tcp --permanent)
关闭指定端口(firewall-cmd --zone=public --remove- port=8080/tcp --permanent)
立即生效(firewall-cmd --reload)
杏看开放的端口(firewall-cmd --zone=public --list-ports)



![image-20230316154102239](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030522.png)



### 安装MySQL

![image-20230316154333839](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292030829.png)



![image-20230316154959053](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292031913.png)



![image-20230316155321440](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292031239.png)





![image-20230316160511882](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292031959.png)



![image-20230316161713926](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292031017.png)



![image-20230316162522361](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292031939.png)





![image-20230316164115690](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292031246.png)

### 安装lrzsz

![image-20230316164053129](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292031093.png)

## 项目部署

### 手工部署

![image-20230316170108432](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292031814.png)



![image-20230316170124920](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292024855.png)



![image-20230316170146559](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292024896.png)



![image-20230316170236771](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292024974.png)



![image-20230316170453833](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292024791.png)

![image-20230316170815209](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292024339.png)





### 自动部署

![image-20230316170922383](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292023588.png)



![image-20230316171142096](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292023747.png)



![image-20230316171314933](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292023616.png)

![image-20230316171426773](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292023232.png)



![image-20230316173217589](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292023490.png)



![image-20230316173908839](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292023186.png)



![image-20230316174311943](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292023805.png)



![image-20230316174957945](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292023648.png)