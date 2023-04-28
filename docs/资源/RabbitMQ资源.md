最近这一段时间在学习RabbitMQ，在跟着尚硅谷学习的时候，他自动就下载了RabbitMQ，我愣住了。

于是，我在网上找到了资源，里面是rpm包
```
https://www.aliyundrive.com/s/1WMfvXo23fq
```
很离谱的是，我按照尚硅谷的视频在Linux里面敲命令，运行
```
yum install -y socat
```
它会给我报错，具体内容是
```
Error downloading packages:
socat-1.7.3.2-2.el7.x86_64: [Errno 256] No more mirrors to try.
```
这个问题现在还是没找到，它的内容大概意思就是说我的镜像出毛病了，真是离谱了。
于是我就弃用了yum命令来安装socat，使用了rpm命令
```
rpm -ivh socat-1.7.3.2-2.el7.x86_64.rpm
```
最后成了，linux安装上了RabbitMQ