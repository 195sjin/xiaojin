# 了解Git

## 学完git能干啥

**git是一个分布式版本控制工具，主要用于管理开发过程中的源代码文件（java类、xml文件、HTML页面）**

代码回溯---------快速回到历史版本

版本切换---------框架版本多，可以来回切换

多人协作

远程备份---------类似maven，自己一个仓库，远程还有一个仓库

## git概述

commit：提交  本地文件和版本信息---------->本地仓库

push：推送   本地仓库文件和版本信息---------->远程仓库

pull：拉取    远程仓库文件和版本信息---------->本地仓库

## git常用命令

**设置用户名与邮件**

git config --global user.name "xiaojin"

git config --global user.name "zijin195@163.com"



**从远程仓库克隆**

git clone git仓库的https

![image-20230315194900992](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292013769.png)



![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292013738.png)



![image-20230315195630441](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292014074.png)



![image-20230315200446215](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292014362.png)



![image-20230315204926945](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292014482.png)

小技巧

fatal: cannot do a partial commit during a merge

在输入的时候在句末加上   -i


![](https://raw.githubusercontent.com/195sjin/myBed/master/images202303292014483.png)




