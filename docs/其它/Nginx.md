# Nginx

## Nginx是什么

Nginx是-款轻量级的Web服务器/反向代理服务器及电子邮件(IMAP/POP3) 代理服务器。

其特点是占有内存少,并发能力强，事实上nginx的并发能力在同类型的网页服务器中表现较好。

能支持高达50000个并发连接数的响应。

中国大陆使用nginx的网站有:百度、京东、新浪、网易、腾讯、淘宝等。

## Nginx动静分离

Nginx可以作为静态web服务器来部署静态资源。

静态资源指在服务端真实存在并且能够直接展示的一些文件,比如常见的htm页面、Css文件、js文件、图片、视频等资源。

相对于Tomcat, Nginx处理静态资源的能力更加高效，所以在生产环境下，-般都会将静态资源部署到Nginx中。

将静态资源部署到Nginx非常简单，只需要将文件复制到Nginx安装目录下的html目录中即可。

```
serve{
  listen 80;      #监听窗口
  server_name localhost;     #服务器名称
  location / {     #匹配客户端请求url
     root dir;     #指定静态资源根目录
     index index.html;     #指定默认客户端
  }
}
```

![image-20230427115717271](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271157309.png)

## Nginx反向代理

区分正向代理与反向代理

正向：客户端到服务器；帮助客户端访问服务器

反向：服务器到客户端；帮助服务器提供服务

### 正向代理

是一个位于客户端和原始服务器(origin server)之间的服务器。

为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标(原始服务器),然后代理向原始服务器转交请求并将获得的内容返回给客户端。

正向代理的典型用途是为在防火墙内的局域网客户端提供访问Internet的途径。

正向代理一般是在客户端设置代理服务器，通过代理服务器转发请求，最终访问到目标服务器。



![image-20230427111756188](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271118295.png)

### 反向代理

反向代理服务器位于用户与目标服务器之间。

但是对于用户而言，反向代理服务器就相当于目标服务器，即用户直接访问反向代理服务器就可以获得目标服务器的资源，反向代理服务器负责将请求转发给目标服务器。

用户不需要知道目标服务器的地址，也无须在用户端作任何设定。

![image-20230427112007480](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271120520.png)



## Nginx负载均衡

将用户的请求根据对应的负载均衡算法分发到应用集群中的一台服务器进行处理

![image-20230427115425922](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271154963.png)

### 策略

**轮询     默认方法**

**weight     权重方式**

**ip_hash     依据IP分配方式**

least_conn     依据最少连接方式

url_hash     依据url分配方式

fair     依据响应时间方式

## 使用

**安装好之后会有四个目录**

conf/nginx.conf     nginx配置文件

html     存放静态文件(html、CSS、Js等)

logs     日志目录，存放日志文件

sbin/nginx     二进制文件，用于启动、停止Nginx服务



**常用命令**

启动Nginx     ./nginx

停止Nginx     ./nginx - s stop

查看Nginx进程     ps -ef | grep nginx

更改完之后需要     ./nginx -s reload



**配置文件**

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

#### 全局块

从配置文件开始到 events 块之间的内容，主要会**设置一些影响nginx 服务器整体运行的配置指令**，主要包括配 置运行 Nginx 服务器的用户（组）、允许生成的 worker process 数，进程 PID 存放路径、日志存放路径和类型以 及配置文件的引入等。
比如上面第一行配置的：

```
  worker_processes  1;
```

这是 Nginx 服务器并发处理服务的关键配置，worker_processes 值越大，可以支持的**并发处理量**也越多，但是 会受到硬件、软件等设备的制约。

#### events块

比如上面的配置：

```
events {
    worker_connections  1024;
}
```

events 块涉及的指令**主要影响 Nginx 服务器与用户的网络连接，常用的设置包括是否开启对多 work process 下的网络连接进行序列化，是否 允许同时接收多个网络连接，选取哪种事件驱动模型来处理连接请求，每个 word process 可以同时支持的最大连接数等。**
上述例子就表示每个 work process 支持的最大连接数为 1024.
这部分的配置对 Nginx 的性能影响较大，在实际中应该灵活配置。

#### http块

```
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

http 块也可以包括 http全局块、server 块。

**http全局块**
http全局块配置的指令包括文件引入、MIME-TYPE 定义、日志自定义、连接超时时间、单链接请求数上限等。
**server 块**
这块和虚拟主机有密切关系，虚拟主机从用户角度看，和一台独立的硬件主机是完全一样的，该技术的产生是为了 节省互联网服务器硬件成本。
每个 http 块可以包括多个 server 块，而每个 **server 块就相当于一个虚拟主机**。
而每个 server 块也分为全局 server 块，以及可以同时包含多个 locaton 块。

**1、全局 server 块**
最常见的配置是本虚拟机主机的监听配置和本虚拟**主机的名称或IP配置**。

**2、location 块**
一个 server 块可以配置多个 location 块。
这块的主要作用是基于 Nginx 服务器接收到的请求字符串（例如 server_name/uri-string），对虚拟主机名称 （也可以是IP 别名）之外的字符串（例如 前面的 /uri-string）进行匹配，对特定的请求进行处理。 地址定向、数据缓 存和应答控制等功能，还有许多第三方模块的配置也在这里进行。


![image-20230427123200939](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271232996.png)
