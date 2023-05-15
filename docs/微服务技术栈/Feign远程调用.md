# Feign

## Feign远程调用

以前利用RestTemplate发起远程调用的代码：

![image-20230505201037125](https://raw.githubusercontent.com/195sjin/myBed/master/images202305052010171.png)

存在下面的问题：

•代码可读性差，编程体验不统一

•参数复杂URL难以维护



Feign是一个**声明式的http客户端**，官方地址：https://github.com/OpenFeign/feign

其作用就是**帮助我们优雅的实现http请求的发送**，解决上面提到的问题。



## Feign替代RestTemplate



### 引入依赖

在order-service服务的pom文件中引入feign的依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```



### 添加注解

在order-service的**启动类添加注解**开启Feign的功能

**@EnableFeignClients**

![image-20230505201240392](https://raw.githubusercontent.com/195sjin/myBed/master/images202305052012457.png)



### 编写Feign的客户端

在order-service中新建一个接口，内容如下

```
@FeignClient("userservice")
public interface UserClient {
    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);
}
```

**这个接口里将来封装的都是所有对userservice发起的远程调用**

这个客户端主要是基于SpringMVC的注解来声明远程调用的信息，比如：

- 服务名称：userservice
- 请求方式：GET
- 请求路径：/user/{id}
- 请求参数：Long id
- 返回值类型：User

这样，Feign就可以帮助我们发送http请求，无需自己使用RestTemplate来发送了。



### 测试

修改order-service中的OrderService类中的queryOrderById方法，使用Feign客户端代替RestTemplate：

![image-20230505201404224](https://raw.githubusercontent.com/195sjin/myBed/master/images202305052014290.png)



### 总结

使用Feign的步骤：

① 引入依赖

② 添加@EnableFeignClients注解

③ 编写FeignClient接口

④ 使用FeignClient中定义的方法代替RestTemplate



## 自定义配置

**Feign可以支持很多的自定义配置**，如下表所示：

| 类型                   | 作用             | 说明                                                   |
| ---------------------- | ---------------- | ------------------------------------------------------ |
| **feign.Logger.Level** | 修改日志级别     | 包含四种不同的级别：NONE、BASIC、HEADERS、FULL         |
| feign.codec.Decoder    | 响应结果的解析器 | http远程调用的结果做解析，例如解析json字符串为java对象 |
| feign.codec.Encoder    | 请求参数编码     | 将请求参数编码，便于通过http请求发送                   |
| feign. Contract        | 支持的注解格式   | 默认是SpringMVC的注解                                  |
| feign. Retryer         | 失败重试机制     | 请求失败的重试机制，默认是没有，不过会使用Ribbon的重试 |

一般情况下，默认值就能满足我们使用，如果要自定义时，只需要创建自定义的@Bean覆盖默认Bean即可。



下面以日志为例来演示如何自定义配置。



### 配置文件方式

基于配置文件修改feign的日志级别可以**针对单个服务**：

```yaml
feign:  
  client:
    config: 
      userservice: # 针对某个微服务的配置
        loggerLevel: FULL #  日志级别 
```

也可以**针对所有服务**：

```yaml
feign:  
  client:
    config: 
      default: # 这里用default就是全局配置，如果是写服务名称，则是针对某个微服务的配置
        loggerLevel: FULL #  日志级别 
```



而日志的级别分为四种：

- NONE：不记录任何日志信息，这是默认值。
- BASIC：仅记录请求的方法，URL以及响应状态码和执行时间
- HEADERS：在BASIC的基础上，额外记录了请求和响应的头信息
- FULL：记录所有请求和响应的明细，包括头信息、请求体、元数据。



### Java代码方式

也可以基于Java代码来修改日志级别，先声明一个类，然后声明一个Logger.Level的对象

```java
public class DefaultFeignConfiguration  {
    @Bean
    public Logger.Level feignLogLevel(){
        return Logger.Level.BASIC; // 日志级别为BASIC
    }
}
```



如果要**全局生效**，将其放到启动类的@EnableFeignClients这个注解中：

```java
@EnableFeignClients(defaultConfiguration = DefaultFeignConfiguration .class) 
```



如果是**局部生效**，则把它放到对应的@FeignClient这个注解中：

```java
@FeignClient(value = "userservice", configuration = DefaultFeignConfiguration .class) 
```



![image-20230505204356447](https://raw.githubusercontent.com/195sjin/myBed/master/images202305052043527.png)

## Feign使用优化

**Feign底层发起http请求，依赖于其它的框架**。其底层客户端实现包括：

•URLConnection：默认实现，不支持连接池

•Apache HttpClient ：支持连接池

•OKHttp：支持连接池



因此提高Feign的性能主要手段就是使用**连接池**代替默认的URLConnection。



这里我们用Apache的HttpClient来演示。

1）引入依赖

在order-service的pom文件中引入Apache的HttpClient依赖：

```xml
<!--httpClient的依赖 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```



2）配置连接池

在order-service的application.yml中添加配置：

```yaml
feign:
  client:
    config:
      default: # default全局的配置
        loggerLevel: BASIC # 日志级别，BASIC就是基本的请求和响应信息
  httpclient:
    enabled: true # 开启feign对HttpClient的支持
    max-connections: 200 # 最大的连接数
    max-connections-per-route: 50 # 每个路径的最大连接数
```



接下来，在FeignClientFactoryBean中的loadBalance方法中打断点：

![image-20230505204620682](https://raw.githubusercontent.com/195sjin/myBed/master/images202305052046763.png)



总结，Feign的优化：

1.日志级别尽量用basic

2.使用HttpClient或OKHttp代替URLConnection

①  引入feign-httpClient依赖

②  配置文件开启httpClient功能，设置连接池参数



## 最佳实践

Feign的客户端与服务提供者的controller代码非常相似

有没有一种办法简化这种重复的代码编写呢？



### 继承方式

一样的代码可以通过继承来共享：

1）定义一个API接口，利用定义方法，并基于SpringMVC注解做声明。

2）Feign客户端和Controller都集成改接口

![image-20230505204833299](https://raw.githubusercontent.com/195sjin/myBed/master/images202305052048356.png)

优点：

- 简单
- 实现了代码共享

缺点：

- 服务提供方、服务消费方**紧耦合**

- 参数列表中的注解映射并不会继承，因此Controller中必须再次声明方法、参数列表、注解



### 抽取方式

将Feign的Client抽取为独立模块，并且把接口有关的POJO、默认的Feign配置都放到这个模块中，提供给所有消费者使用。

例如，将UserClient、User、Feign的默认配置都抽取到一个feign-api包中，所有微服务引用该依赖包，即可直接使用。

![image-20230505205031424](https://raw.githubusercontent.com/195sjin/myBed/master/images202305052050484.png)

**1、抽取**

创建一个module，命名为feign-api



在feign-api中然后引入feign的starter依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```



然后，order-service中编写的UserClient、User、DefaultFeignConfiguration都复制到feign-api项目中

![image-20230505205251090](https://raw.githubusercontent.com/195sjin/myBed/master/images202305052052158.png)

**2、在order-service中使用feign-api**

首先，删除order-service中的UserClient、User、DefaultFeignConfiguration等类或接口。



在order-service的pom文件中中引入feign-api的依赖：

```xml
<dependency>
    <groupId>cn.itcast.demo</groupId>
    <artifactId>feign-api</artifactId>
    <version>1.0</version>
</dependency>
```



修改order-service中的所有与上述三个组件有关的导包部分，改成导入feign-api中的包



**3、重启测试**

重启后，发现服务报错了：

这是因为UserClient现在在cn.itcast.feign.clients包下，

而order-service的@EnableFeignClients注解是在cn.itcast.order包下，不在同一个包，无法扫描到UserClient。



**4、解决扫描包问题**

方式一：

指定Feign应该扫描的包：

```java
@EnableFeignClients(basePackages = "cn.itcast.feign.clients")
```



方式二：

指定需要加载的Client接口：

```java
@EnableFeignClients(clients = {UserClient.class})
```

