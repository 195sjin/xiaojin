## Spring5 框架概述

### 1、Spring 是轻量级的开源的 JavaEE 框架

### 2、Spring 可以解决企业应用开发的复杂性

### 3、Spring 有两个核心部分：IOC 和 Aop

（1）IOC：控制反转，把创建对象过程交给 Spring 进行管理
（2）Aop：面向切面，不修改源代码进行功能增强

### 4、Spring 特点

（1）方便解耦，简化开发
（2）Aop 编程支持
（3）方便程序测试
（4）方便和其他框架进行整合
（5）方便进行事务操作
（6）降低 API 开发难度

> spring是一个用来管对象的技术
>
> AOP 教你程序应该怎么做 Aspects是AOP的实现

## 入门案例

1. 创建普通类，在这个类创建普通方法

   #### 怎么实现这个类的具体方法？

   之前都是创建一个测试类，通过new对象的方式来调用里面的方法

   ```java
   public class User { 
   
   public void add() { 
   
       System.out.println("add......");
   
    } 
   
   }
   ```

2. 创建 Spring 配置文件，在配置文件配置创建的对象

   创建一个文件以xml为后缀。例如 bean.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
 xsi:schemaLocation="http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans.xsd">
 <!--配置 User 对象创建--> 
 <bean id="user" class="com.atguigu.spring5.User"></bean>
</beans>
```

3. 进行测试

   ```java
   @Test
   public void testAdd() {
    //1 加载 spring 配置文件
    ApplicationContext context =
    new ClassPathXmlApplicationContext("bean1.xml");
    //2 获取配置创建的对象
    User user = context.getBean("user", User.class);
    System.out.println(user);
    user.add();
   } 
   ```
