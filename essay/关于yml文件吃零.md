在进行项目的开展中，需要用到yml来配置一些东西

在项目运行时，它报了一个错误，具体的内容我记不太清了，大概意思是我的数据库连接出错。

下面是原先的配置文件
```
username: root
password: 060343
```
是我的用户名或者是密码输入错误了吗，我去查了一下，没有，但是为什么连不上？

在网上找了很久，最后很偶然的一眼发现了错误的来源

>yml会把0开头的作为8进制对待，主动去掉了前导零。

这就相当于最后解析到我的配置的密码是60343，这肯定就不对了

正确的配置应该是这样的
```
username: root
password: "060343"
```