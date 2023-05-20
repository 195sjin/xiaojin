## AOP（概念）

1、什么是 AOP 

（1）面向切面编程（方面），利用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得 业务逻辑各部分之间的耦合度降低，提高程序		的可重用性，同时提高了开发的效率。

 （2）通俗描述：==不通过修改源代码方式，在主干功能里面添加新功能==

![image-20230519124659511](C:/Users/%E5%AD%90%E8%A1%BF%E5%95%8A/AppData/Roaming/Typora/typora-user-images/image-20230519124659511.png)







## AOP（底层原理）

1、AOP 底层使用动态代理 

（1）有两种情况动态代理 

第一种 有接口情况，使用 JDK 动态代理： JDKProxy动态代理

 	创建接口实现类代理对象，增强类的方法

第二种 没有接口情况，使用 CGLIB 动态代理

```
创建子类的代理对象，增强类的方法
```





### AOP（JDK 动态代理）

1、使用 JDK 动态代理，使用 Proxy 类里面的方法创建代理对象

（1）调用 **newProxyInstance** 方法

方法有三个参数：

 	第一参数，类加载器
 	第二参数，增强方法所在的类，这个类实现的接口，支持多个接口 
 	第三参数，实现这个接口 InvocationHandler，创建代理对象，写增强的部分



2、编写 JDK 动态代理代码 

（1）创建接口，定义方法

```java
public interface UserDao {
 public int add(int a,int b);
 public String update(String id);
}
```

（2）创建接口实现类，实现方法

```java
public class UserDaoImpl implements UserDao {
 @Override
 public int add(int a, int b) {
 return a+b;
 }
 @Override
 public String update(String id) {
 return id;
 }
}
```

（3）使用 Proxy 类创建接口代理对象

```java
public class JDKProxy {
 public static void main(String[] args) {
 //创建接口实现类代理对象
 Class[] interfaces = {UserDao.class};
 
// Proxy.newProxyInstance(JDKProxy.class.getClassLoader(), interfaces, new InvocationHandler() {
// @Override
// public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
// return null;
// }
// });
     
 UserDaoImpl userDao = new UserDaoImpl();
 UserDao dao = (UserDao)Proxy.newProxyInstance(JDKProxy.class.getClassLoader(), interfaces, 
new UserDaoProxy(userDao));
 int result = dao.add(1, 2);
 System.out.println("result:"+result);
 }
}

//创建代理对象代码
class UserDaoProxy implements InvocationHandler {
 //1 把创建的是谁的代理对象，把谁传递过来
 //有参数构造传递
 private Object obj;
 public UserDaoProxy(Object obj) {
 this.obj = obj;
 }
 //增强的逻辑
 @Override
 public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
 //方法之前
 System.out.println("方法之前执行...."+method.getName()+" :传递的参数..."+ Arrays.toString(args));
 //被增强的方法执行
 Object res = method.invoke(obj, args);
 //方法之后
 System.out.println("方法之后执行...."+obj);
 return res;
 }
}
```





### AOP(Cglib动态代理)

- CGLIB(Code Generation Library),Code生成类库
- CGLIB动态代理不限定是否具有接口，可以对任意操作进行增强
- CGLIB动态代理无需要原始被代理对象，动态创建出新的代理对象

![image-20221217200900234](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217200900234.png)

```java
public class UserServiceCglibProxy {
    public static UserService createUserServiceCglibProxy(Class clazz) {
        Enhancer enhancer = new Enhancer();     // 创建动态字节码
        enhancer.setSuperclass(clazz);
        enhancer.setCallback(new MethodInterceptor() {
       public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
                Object ret = methodProxy.invokeSuper(o, objects);        // 调用原始方法
                if (method.getName().equals("save")) {
                    System.out.println("刮大白");      // 对原始方法做增强
                }
                return ret;
            }
        });
        return (UserService) enhancer.create();
    }
}
```

```java
public static void main(String[] args) {
    UserService userService = UserServiceCglibProxy.createUserServiceCglibProxy(UserServiceImpl.class);
    userService.save();
}
```



### 代理模式的选择

​		Spring可以通过配置的形式控制使用的代理形式

​		默认使用JDKProxy，通过配置可以修改为使用CGLib

*XML配置*

```xml
<aop:config proxy-target-class="false"></aop:config>
```

*XML注解支持*

```xml
<aop:aspectj-autoproxy proxy-target-class="false"/>
```

*注解驱动*

```java
@EnableAspectJAutoProxy(proxyTargetClass = true)
```

false（默认）：JDKProxy；

true：CGLibProxy





## AOP（术语）

1、(Joinpoint)连接点：类里面哪些方法能被增强，这些方法称为连接点

2、(Pointcut)切入点：实际被真正增强的方法，称为切入点

3、(Advice)通知（增强）：实际增强的逻辑部分称为通知（增强）

​		通知有多种类型

* 前置通知
* 后置通知
* 环绕通知
* 异常通知
* 最终通知

4、切面：是动作，把通知应用到切入点过程

5、（Proxy）代理：目标对象无法直接完成工作，需要对其进行功能回填，通过创建原始对象的代理对象实现





## AOP 操作（准备工作）

### **1、Spring 框架一般都是基于 ==AspectJ== 实现 AOP 操作** 

（1）AspectJ 不是 Spring 组成部分，独立 AOP 框架，一般把 AspectJ 和 Spirng 框架一起使 用，进行 AOP 操作 



### **2、基于 AspectJ 实现 AOP 操作** 

（1）基于 xml 配置文件实现 

（2）基于注解方式实现（使用）





### **3、在项目工程里面引入 AOP 相关依赖**



### **4、切入点表达式** 

（1）切入点表达式作用：知道对哪个类里面的哪个方法进行增强 

（2）语法结构： execution([权限修饰符] [返回类型] [类全路径] [方法名称]([参数列表]) ) 

举例 1：对 com.atguigu.dao.BookDao 类里面的 add 进行增强 execution(* com.atguigu.dao.BookDao.add(..))

举例 2：对 com.atguigu.dao.BookDao 类里面的所有的方法进行增强 execution(* com.atguigu.dao.BookDao.* (..)) 

举例 3：对 com.atguigu.dao 包里面所有类，类里面所有方法进行增强 execution(* com.atguigu.dao.*.* (..))





## AOP 操作（AspectJ 注解）

### **1、创建类，在类里面定义方法**

```java
public class User {
 public void add() {
 System.out.println("add.......");
 }
}
```



### **2、创建增强类（编写增强逻辑）** 

（1）在增强类里面，创建方法，让不同方法代表不同通知类型

```java
//增强的类
public class UserProxy {
 public void before() {//前置通知
 System.out.println("before......");
 }
}
```



### **3、进行通知的配置**

（1）在 spring 配置文件中，开启注解扫描

```xml
 <!-- 开启注解扫描 -->
 <context:component-scan basepackage="com.atguigu.spring5.aopanno"></context:component-scan>
```

（2）使用注解创建 User 和 UserProxy 对象

```java
//被增强的类
@Componnet
public class User{}
//增强的类
@Componnet
public class UserProxy{}
```

（3）在增强类上面添加注解 @Aspect

```java
//增强的类
@Component
@Aspect //生成代理对象
public class UserProxy {
```

（4）在 spring 配置文件中开启生成代理对象

```xml
<!-- 开启 Aspect 生成代理对象-->
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```



### **4、配置不同类型的通知** 

（1）在增强类的里面，在作为通知方法上面添加通知类型注解，使用切入点表达式配置

```java
//增强的类
@Component
@Aspect //生成代理对象
public class UserProxy {
 //前置通知
 //@Before 注解表示作为前置通知
 @Before(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
 public void before() {
 System.out.println("before.........");
 }
 //后置通知（返回通知）
 @AfterReturning(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
 public void afterReturning() {
 System.out.println("afterReturning.........");
 }
 //最终通知
 @After(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
 public void after() {
 System.out.println("after.........");
 }
 //异常通知
 @AfterThrowing(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
 public void afterThrowing() {
 System.out.println("afterThrowing.........");
 }
 //环绕通知
 @Around(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
 public void around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
 System.out.println("环绕之前.........");
 //被增强的方法执行
 proceedingJoinPoint.proceed();
 System.out.println("环绕之后.........");
 }
}
```



### **5、相同的切入点抽取**

```java
//相同切入点抽取
@Pointcut(value = "execution(* com.atguigu.spring5.aopanno.User.add(..))")
public void pointdemo() {
    
}

//前置通知
//@Before 注解表示作为前置通知
@Before(value = "pointdemo()")
public void before() {
 System.out.println("before.........");
}
```



### **6、有多个增强类多同一个方法进行增强，设置增强类优先级** 

（1）在增强类上面添加注解 @Order(数字类型值)，数字类型**值越小优先级越高**

```java
@Component
@Aspect
@Order(1)
public class PersonProxy
```



### **7、完全使用注解开发**  

（1）创建配置类，不需要创建 xml 配置文件 

```java
@Configuration
@ComponentScan(basePackages = {"com.atguigu"})
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class ConfigAop {
}
```





## AOP 操作（AspectJ 配置文件）

### **1、创建两个类，增强类和被增强类，创建方法** 



### **2、在 spring 配置文件中创建两个类对象**

```xml
<!--创建对象-->
<bean id="book" class="com.atguigu.spring5.aopxml.Book"></bean>
<bean id="bookProxy" class="com.atguigu.spring5.aopxml.BookProxy"></bean>
```



### **3、在 spring 配置文件中配置切入点**

```xml
<!--配置 aop 增强-->
<aop:config>
 <!--切入点-->
 <aop:pointcut id="p" expression="execution(* 
com.atguigu.spring5.aopxml.Book.buy(..))"/>
 <!--配置切面-->
 <aop:aspect ref="bookProxy">
 <!--增强作用在具体的方法上-->
 <aop:before method="before" pointcut-ref="p"/>
 </aop:aspect>
</aop:config>
```

