# IOC 操作 Bean 管理(基于==注解方式==)

## **什么是注解驱动**

注解驱动是使用注解的形式替代xml配置，将繁杂的spring配置文件从工程中彻底消除掉，简化书写

​			注解是代码特殊标记，格式：@注解名称(属性名称=属性值, 属性名称=属性值..) 

​			使用注解，注解作用在类上面，方法上面，属性上面 

​			使用注解目的：简化 xml 配置





## **bean的定义**

（1）@Component （2）@Service （3）@Controller （4）@Repository

* 上面四个注解功能是一样的，都可以用来==创建 bean 实例==

- 位置：==类定义上方==
  - `@Controller`、`@Service`、`@Repository`是`@Component`的衍生注解，功能同`@Component`

==@Component(value = "userService")  //<bean id="userService" class=".."/>==





## **bean的作用域**

- 名称：`@Scope`
- 位置：类定义上方
- 作用：设置该类作为bean对应的scope属性
- value（默认）：定义bean的作用域，默认为singleton





## **生命周期**

- 名称：`@PostConstruct`、`PreDestroy`
- 位置：方法定义上方
- 作用：设置该类作为bean对应的生命周期方法





## **第三方资源**

- 名称：`@Bean`
- 类型：*方法注解*
- 位置：方法定义上方
- 作用：设置该方法的返回值以指定名称存储到Spring容器中
- 范例

```java
@Bean("dataSource")
public DruidDataSource createDataSource(){
    return ...;
}
```

- 说明

  - 因为第三方bean无法在其源码上进行修改，使用@Bean解决第三方bean的引入问题
  - 该注解用于替代xml配置中的静态工厂与实例工厂创建bean，不区分方法是否为静态或非静态
  - @Bean所在的类必须按spring扫描加载，否则该注解无法生效

- 相关属性

  - value（默认）：定义bean的访问id

  



## **基于注解方式实现对象创建** 

第一步 引入依赖

![image-20230519123919637](https://raw.githubusercontent.com/195sjin/myBed/master/images202305191239726.png)

第二步 开启组件扫描

```xml
<!--开启组件扫描
 1 如果扫描多个包，多个包使用逗号隔开
 2 扫描包上层目录
-->
<context:component-scan base-package="packageName" />
```

第三步 创建类，在类上面添加创建对象注解

```java
//在注解里面 value 属性值可以省略不写，
//默认值是类名称，首字母小写
//UserService -- userService
@Component(value = "userService") //<bean id="userService" class=".."/>
public class UserService {
 public void add() {
 System.out.println("service add.......");
 }
}
```





## **开启组件扫描细节配置**

```xml
<!--示例 1
 use-default-filters="false" 表示现在不使用默认 filter，自己配置 filter
 context:include-filter ，设置扫描哪些内容
-->
<context:component-scan base-package="com.atguigu" use-defaultfilters="false">
 <context:include-filter type="annotation" 
 
expression="org.springframework.stereotype.Controller"/>
</context:component-scan>
<!--示例 2
 下面配置扫描包所有内容
 context:exclude-filter： 设置哪些内容不进行扫描
-->
<context:component-scan base-package="com.atguigu">
 <context:exclude-filter type="annotation" 
 
expression="org.springframework.stereotype.Controller"/>
</context:component-scan>
```





## **基于注解方式实现属性注入**

### （1）==@Autowired==

**根据属性类型进行自动装配** 

第一步 把 service 和 dao 对象创建，在 service 和 dao 类添加创建对象注解 

第二步 在 service 注入 dao 对象，在 service 类添加 dao 类型属性，在属性上面使用注解

```java
@Service
public class UserService {
 //定义 dao 类型属性
 //不需要添加 set 方法
 //添加注入属性注解
 @Autowired 
 private UserDao userDao;
 public void add() {
 System.out.println("service add.......");
 userDao.add();
 }
}
```

### （2）==@Qualifier==

**根据名称进行注入**

 这个@Qualifier 注解的使用，和上面@Autowired 一起使用

```JAVA
//定义 dao 类型属性
//不需要添加 set 方法
//添加注入属性注解
@Autowired //根据类型进行注入
@Qualifier(value = "userDaoImpl1") //根据名称进行注入
private UserDao userDao;
```

### （3）==@Resource==

**可以根据类型注入，可以根据名称注入**

```java
//@Resource //根据类型进行注入
@Resource(name = "userDaoImpl1") //根据名称进行注入
private UserDao userDao;
```

### （4）==@Value==

**注入普通类型属性**

```java
@Value(value = "abc")
private String name;
```

- value值支持读取properties文件中的属性值，通过类属性将properties中数据传入类中

- @value注解如果添加在属性上方，可以省略set方法（set方法的目的是为属性赋值）

- value值仅支持非引用类型数据，赋值时对方法的所有参数全部赋值



### （5）==@Primary==

- 类型：*类注解*
- 位置：类定义上方
- 作用：设置类对应的bean按类型装配时优先装配

```java
@Primary
public class ClassName{}
```

- 说明
  - @Autowired默认按类型装配，当出现相同类型的bean，使用@Primary提高按类型自动装配的优先级，多个@Primary会导致优先级设置无效



### **注解驱动**

- 名称：`@Configuration`、`@ComponentScan`

- 类型：*类注解*

- 位置：类定义上方

- 作用：设置当前类为spring核心配置加载类

- 范例

  ```java
  @Configuration
  @ComponentScan("scanPackageName")
  public class SpringConfigClassName{
  }
  ```

  - 说明
    - 核心配置类用于替换spring核心配置文件，此类可以设置为空，不设置变量与属性
    - bean扫描工作使用注解`@ComponentScan`替代





### **==完全注解开发==** 

### （1）创建配置类，替代 xml 配置文件

```java
@Configuration //作为配置类，替代 xml 配置文件
@ComponentScan(basePackages = {"com.atguigu"})
public class SpringConfig {
}
```



### （2）编写测试类

```java
@Test
public void testService2() {
 //加载配置类
 ApplicationContext context = new AnnotationConfigApplicationContext(SpringConfig.class);
 UserService userService = context.getBean("userService", UserService.class);
 System.out.println(userService);
 userService.add();
}
```

