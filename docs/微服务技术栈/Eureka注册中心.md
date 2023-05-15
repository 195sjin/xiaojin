# Eureka

## Eureka注册中心

![image-20230505084948860](https://raw.githubusercontent.com/195sjin/myBed/master/images202305050849018.png)





## Eureka的结构和作用

![image-20230505085716819](https://raw.githubusercontent.com/195sjin/myBed/master/images202305050857941.png)

> 假设这三个服务都没挂，order拉取到了它们的信息，负载到8081，但是在那三个服务发送注册信息之后，心跳三十秒之内8081挂了，这个时候order已经负载到8081，但是它挂了，order会重试，然后会负载到其它



问题1：**order-service如何得知user-service实例地址？**

获取地址信息的流程如下：

- user-service服务实例启动后，将自己的信息注册到eureka-server（Eureka服务端）。这个叫服务注册
- eureka-server保存服务名称到服务实例地址列表的映射关系
- order-service根据服务名称，拉取实例地址列表。这个叫服务发现或服务拉取



问题2：**order-service如何从多个user-service实例中选择具体的实例？**

- order-service从实例列表中利用**负载均衡**算法选中一个实例地址
- 向该实例地址发起远程调用



问题3：**order-service如何得知某个user-service实例是否依然健康，是不是已经宕机？**

- user-service会每隔一段时间（默认30秒）向eureka-server发起请求，报告自己状态，称为心跳
- 当超过一定时间没有发送心跳时，eureka-server会认为微服务实例故障，将该实例从服务列表中剔除
- order-service拉取服务时，就能将故障实例排除了



![image-20230505090356412](https://raw.githubusercontent.com/195sjin/myBed/master/images202305050903612.png)

> 注意：一个微服务，既可以是服务提供者，又可以是服务消费者，因此eureka将服务注册、服务发现等功能统一封装到了eureka-client端





## 搭建eureka-server



### 创建eureka-server服务

注册中心服务端：eureka-server，这必须是一个独立的微服务

在cloud-demo父工程下，创建一个子模块：

![image-20230505121053604](https://raw.githubusercontent.com/195sjin/myBed/master/images202305051211700.png)



### 引入eureka依赖

引入SpringCloud为eureka提供的starter依赖：

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```



### 编写启动类

给eureka-server服务编写一个启动类，一定要添加一个**@EnableEurekaServer**注解，开启eureka的注册中心功能：

```
@SpringBootApplication
@EnableEurekaServer
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class,args);
    }
}
```



### 编写配置文件

编写一个application.yml文件，内容如下：

```
server:
  port: 10086
spring:
  application:
    name: eureka-server
eureka:
  client:
    service-url: 
      defaultZone: http://127.0.0.1:10086/eureka
```



### 启动服务

启动微服务，然后在浏览器访问：http://127.0.0.1:10086

![image-20230515161408089](https://raw.githubusercontent.com/195sjin/myBed/master/images202305151614139.png)



## 服务注册

将user-service注册到eureka-server中去

### 引入依赖

在user-service的pom文件中，引入下面的eureka-client依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```



### 配置文件

在user-service中，修改application.yml文件，添加服务名称、eureka地址：

```yaml
spring:
  application:
    name: userservice #可以是随便的名称，代表着这个服务
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
```



### 启动多个user-service实例

![image-20230505122427803](https://raw.githubusercontent.com/195sjin/myBed/master/images202305051224867.png)

更改服务端口

```
-Dserver.port=8082
```

![image-20230505122725009](https://raw.githubusercontent.com/195sjin/myBed/master/images202305051227051.png)



## 服务发现

将order-service的逻辑修改：向eureka-server拉取user-service的信息，实现服务发现。



### 引入依赖

服务发现、服务注册统一都封装在eureka-client依赖，因此这一步与服务注册时一致

在order-service的pom文件中，引入下面的eureka-client依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```



### 配置文件

服务发现也需要知道eureka地址，因此第二步与服务注册一致，都是配置eureka信息：

在order-service中，修改application.yml文件，添加服务名称、eureka地址：

```yaml
spring:
  application:
    name: orderservice
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:10086/eureka
```



### 服务拉取和负载均衡

我们要去eureka-server中拉取user-service服务的实例列表，并且**实现负载均衡**。

不过这些动作不用我们去做，只需要添加一些注解即可。

在order-service的OrderApplication中，给RestTemplate这个Bean添加一个**@LoadBalanced**注解：

![image-20230505123413732](https://raw.githubusercontent.com/195sjin/myBed/master/images202305051234771.png)



修改order-service服务中的cn.itcast.order.service包下的OrderService类中的queryOrderById方法。修改访问的url路径，用服务名代替ip、端口：

![image-20230505123605031](https://raw.githubusercontent.com/195sjin/myBed/master/images202305051236062.png)

spring会自动帮助我们从eureka-server端，根据userservice这个服务名称，获取实例列表，而后完成负载均衡。



## 总结

![image-20230505124036684](https://raw.githubusercontent.com/195sjin/myBed/master/images202305051240737.png)