## 安装细节
在看尚硅谷的课的时候，那个老师直接就把防火墙给关了，这个是极其不理智的行为，我们应该做的就是打开相对应的端口，而不是直接关防火墙

打开RabbitMQ的管理界面端口
```
firewall-cmd --zone=public --add-port=15672/tcp --permanent
立即生效
firewall-cmd --reload
查看开放的端口
firewall-cmd --zone=public --list-ports
```
## 连接超时

报错TimeoutException

但是这还不够，老师在进行java连接的时候他做测试就能成功，但是我们会报一个连接超时

这个就是需要开放另外一个端口了，是开放5672端口，这是因为 Java 客户端需要连接的是 AMQP 协议的通信端口。
```
firewall-cmd --zone=public --add-port=5672/tcp --permanent
立即生效
firewall-cmd --reload
查看开放的端口
firewall-cmd --zone=public --list-ports
```
这样就不会有异常了，直接就能运行了