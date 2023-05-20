## IOC（概念和原理）

1、什么是 IOC
（1）控制反转，把对象创建和对象之间的调用过程，交给 Spring 进行管理
（2）使用 IOC 目的：为了耦合度降低
（3）做入门案例就是 IOC 实现

2、IOC 底层原理
（1）xml 解析、工厂模式、反射





## IOC（BeanFactory 接口）

1、IOC 思想基于 IOC 容器完成，IOC 容器底层就是对象工厂 

2、Spring 提供 IOC 容器实现两种方式：（两个接口） 

（1）BeanFactory：IOC 容器基本实现，是 Spring 内部的使用接口，不提供开发人员进行使用 * 加载配置文件时候不会创建对象，在获取对象（使用）才去创建对象 

（2）ApplicationContext：BeanFactory 接口的子接口，提供更多更强大的功能，一般由开发人 员进行使用 * 加载配置文件时候就会把在配置文件对象进行创建

3、ApplicationContext 接口有实现类

![image-20221217200449694](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217200449694.png)







## IOC 操作 Bean 管理（概念）

### 1、什么是 Bean 管理 

（0）Bean 管理指的是两个操作 

（1）Spring 创建对象 

（2）Spirng 注入属性 

需要明白==注入==是什么意思

<u>通过Spring⼯⼚及配置⽂件，==为==所创建对象的==成员变量赋值==</u>



### 2、Bean 管理操作有两种方式 

（1）基于 xml 配置文件方式实现 

（2）基于注解方式实现





## IOC 操作 Bean 管理（基于 xml 方式）

### **<u>1、基于 xml 方式创建对象</u>**

![image-20221217200527324](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217200527324.png)

（1）在 spring 配置文件中，使用 bean 标签，标签里面添加对应属性，就可以实现对象创建 

（2）在 bean 标签有很多属性，介绍常用的属性 

* id 属性：唯一标识 
* class 属性：类全路径（包类路径） 

（3）创建对象时候，默认也是执行无参数构造方法完成对象创建



### **2、基于 xml 方式注入属性** （DI）

（1）DI：依赖注入，就是注入属性 



### **3、第一种注入方式：使用 set 方法进行注入** 

（1）创建类，定义属性和对应的 set 方法

```java
/**
* 演示使用 set 方法进行注入属性
*/
public class Book {
 //创建属性
 private String bname;
 private String bauthor;
 //创建属性对应的 set 方法
 public void setBname(String bname) {
 this.bname = bname;
 }
 public void setBauthor(String bauthor) {
 this.bauthor = bauthor;
 }
}
```

 （2）在 spring 配置文件配置对象创建，配置属性注入    

```xml
<!--2 set 方法注入属性-->
<bean id="book" class="com.atguigu.spring5.Book">
 <!--使用 property 完成属性注入
 name：类里面属性名称
 value：向属性注入的值
 -->
 <property name="bname" value="易筋经"></property>
 <property name="bauthor" value="达摩老祖"></property>
</bean>

```



### **4、第二种注入方式：使用有参数构造进行注入** 

（1）创建类，定义属性，创建属性对应有参数构造方法

```java
/**
* 使用有参数构造注入
*/
public class Orders {
 //属性
 private String oname;
 private String address;
 //有参数构造
 public Orders(String oname,String address) {
 this.oname = oname;
 this.address = address;
 }
}

```

（2）在 spring 配置文件中进行配置

```xml
<!--3 有参数构造注入属性-->
<bean id="orders" class="com.atguigu.spring5.Orders">
 <constructor-arg name="oname" value="电脑"></constructor-arg>
 <constructor-arg name="address" value="China"></constructor-arg>
</bean>
```



### 5、p 名称空间注入（了解）

（1）使用 p 名称空间注入，可以简化基于 xml 配置方式

 第一步 添加 p 名称空间在配置文件中

![image-20221217200555123](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217200555123.png)

第二步 进行属性注入，在 bean 标签里面进行操作

```xml
<!--2 set 方法注入属性-->
<bean id="book" class="com.atguigu.spring5.Book" p:bname="九阳神功" 
p:bauthor="无名氏"></bean>
```





## IOC 操作 Bean 管理（xml 注入其他类型属性）

### **注入属性-外部 bean**   （为了从一个类中调用另一个类的方法）

（1）创建两个类 service 类和 dao 类 

（2）在 service 调用 dao 里面的方法 

（3）在 spring 配置文件中进行配置

```java
public class UserService {
 //创建 UserDao 类型属性，生成 set 方法
 private UserDao userDao;
 public void setUserDao(UserDao userDao) {
 this.userDao = userDao;
 }
 public void add() {
 System.out.println("service add...............");
 userDao.update();
 }
}
```

```xml
<!--1 service 和 dao 对象创建-->
<bean id="userService" class="com.atguigu.spring5.service.UserService">
 <!--注入 userDao 对象
 name 属性：类里面属性名称
 ref 属性：创建 userDao 对象 bean 标签 id 值
 -->
 <property name="userDao" ref="userDaoImpl"></property>
</bean>
<bean id="userDaoImpl" class="com.atguigu.spring5.dao.UserDaoImpl"></bean>
```



### **注入属性-内部 bean**（一个类中的一个成员变量是另一个类的对象实例）

（1）一对多关系：部门和员工 一个部门有多个员工，一个员工属于一个部门 部门是一，员工是多 

（2）在实体类之间表示一对多关系，员工表示所属部门，使用对象类型属性进行表示

```java
//部门类
public class Dept {
 private String dname;
 public void setDname(String dname) {
 this.dname = dname;
 }
}
//员工类
public class Emp {
 private String ename;
 private String gender;
 //员工属于某一个部门，使用对象形式表示
 private Dept dept;
 public void setDept(Dept dept) {
 this.dept = dept;
 }
 public void setEname(String ename) {
 this.ename = ename;
 }
 public void setGender(String gender) {
 this.gender = gender;
 }
}
```

（3）在 spring 配置文件中进行配置

```xml
<!--内部 bean-->
<bean id="emp" class="com.atguigu.spring5.bean.Emp">
 <!--设置两个普通属性-->
 <property name="ename" value="lucy"></property>
 <property name="gender" value="女"></property>
    
 <!--设置对象类型属性-->
 <property name="dept">
 <bean id="dept" class="com.atguigu.spring5.bean.Dept">
    <property name="dname" value="安保部"></property>
 </bean>
 </property>
    
</bean>

```



### **注入属性-级联赋值** 

```xml
<!--级联赋值-->
<bean id="emp" class="com.atguigu.spring5.bean.Emp">
 <!--设置两个普通属性-->
 <property name="ename" value="lucy"></property>
 <property name="gender" value="女"></property>
 <!--级联赋值-->
 <property name="dept" ref="dept"></property>
</bean>

<bean id="dept" class="com.atguigu.spring5.bean.Dept">
 <property name="dname" value="财务部"></property>
</bean>

```





## IOC 操作 Bean 管理（xml 注入集合属性）

1、注入数组类型属性 

2、注入 List 集合类型属性 

3、注入 Map 集合类型属性 

（1）创建类，定义数组、list、map、set 类型属性，生成对应 set 方法

```java
public class Stu {
 //1 数组类型属性
 private String[] courses;
 //2 list 集合类型属性
 private List<String> list;
 //3 map 集合类型属性
 private Map<String,String> maps;
 //4 set 集合类型属性
 private Set<String> sets;
    
 public void setSets(Set<String> sets) {
 this.sets = sets;
 }
    
 public void setCourses(String[] courses) {
 this.courses = courses;
 }
    
 public void setList(List<String> list) {
 this.list = list;
 }
    
 public void setMaps(Map<String, String> maps) {
 this.maps = maps;
 }
    
}

```

（2）在 spring 配置文件进行配置

```xml
<!--1 集合类型属性注入-->
<bean id="stu" class="com.atguigu.spring5.collectiontype.Stu">
 <!--数组类型属性注入-->
 <property name="courses">
 <array>
 <value>java 课程</value>
 <value>数据库课程</value>
 </array>
 </property>
    
 <!--list 类型属性注入-->
 <property name="list">
 <list>
 <value>张三</value>
 <value>小三</value>
 </list>
 </property>
    
 <!--map 类型属性注入-->
 <property name="maps">
 <map>
 <entry key="JAVA" value="java"></entry>
 <entry key="PHP" value="php"></entry>
 </map>
 </property>
    
 <!--set 类型属性注入-->
 <property name="sets">
 <set>
 <value>MySQL</value>
 <value>Redis</value>
 </set>
 </property>
    
</bean>

```

4、在集合里面设置对象类型值

```xml
<!--创建多个 course 对象-->
<bean id="course1" class="com.atguigu.spring5.collectiontype.Course">
 <property name="cname" value="Spring5 框架"></property>
</bean>
<bean id="course2" class="com.atguigu.spring5.collectiontype.Course">
 <property name="cname" value="MyBatis 框架"></property>
</bean>
<!--注入 list 集合类型，值是对象-->
<property name="courseList">
 <list>
 <ref bean="course1"></ref>
 <ref bean="course2"></ref>
 </list>
</property>
```

5、把集合注入部分提取出来 

（1）在 spring 配置文件中引入名称空间 util

![image-20221217200633404](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217200633404.png)

（2）使用 util 标签完成 list 集合注入提取

```xml
<!--1 提取 list 集合类型属性注入-->
<util:list id="bookList">
 <value>易筋经</value>
 <value>九阴真经</value>
 <value>九阳神功</value>
</util:list>
<!--2 提取 list 集合类型属性注入使用-->
<bean id="book" class="com.atguigu.spring5.collectiontype.Book">
 <property name="list" ref="bookList"></property>
</bean>

```





## IOC 操作 Bean 管理（FactoryBean）

1、==Spring 有两种类型 bean，一种普通 bean，另外一种工厂 bean（FactoryBean）==

 2、普通 bean：在配置文件中定义 bean 类型就是返回类型 

3、工厂 bean：在配置文件定义 bean 类型可以和返回类型不一样

第一步 创建类，让这个类作为工厂 bean，实现接口 FactoryBean 

第二步 实现接口里面的方法，在实现的方法中定义返回的 bean 类型

(配置文件里面是创建MyBean对象，但是在测试时，却是创建了Course对象)

```java
public class MyBean implements FactoryBean<Course> {
 //定义返回 bean
 @Override
 public Course getObject() throws Exception {
 Course course = new Course();
 course.setCname("abc");
 return course;
 }
 @Override
 public Class<?> getObjectType() {
 return null;
 }
 @Override
 public boolean isSingleton() {
 return false;
 }
}

```

```xml
<bean id="myBean" class="com.atguigu.spring5.factorybean.MyBean">
</bean>
```

```java
@Test
public void test3() {
 ApplicationContext context =
 new ClassPathXmlApplicationContext("bean3.xml");
 Course course = context.getBean("myBean", Course.class);
 System.out.println(course);
}
```





## IOC 操作 Bean 管理（bean 作用域）

1、在 Spring 里面，设置创建 bean 实例是单实例还是多实例

 2、在 Spring 里面，默认情况下，bean 是单实例对象

![image-20221217200707295](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217200707295.png)

3、如何设置单实例还是多实例 

（1）在 spring 配置文件 bean 标签里面有属性（scope）用于设置单实例还是多实例 

（2）scope 属性值 

第一个值 默认值，singleton，表示是单实例对象，**核心文件加载时创建对象**

第二个值 prototype，表示是多实例对象，在调用getbean方法时创建对象





## IOC 操作 Bean 管理（bean 生命周期）

### 1、生命周期 

（1）从对象创建到对象销毁的过程



### 2、bean 生命周期 

（1）通过构造器创建 bean 实例（无参数构造） 

（2）为 bean 的属性设置值和对其他 bean 引用（调用 set 方法） 

（3）调用 bean 的初始化的方法（需要进行配置初始化的方法） 

（4）bean 可以使用了（对象获取到了） 

（5）当容器关闭时候，调用 bean 的销毁的方法（需要进行配置销毁的方法）

- 注意事项
  - 当`scope="singleton"`时，spring容器中有且仅有一个对象，init方法在创建容器时仅执行一次
  - 当`scope="prototype"`时，spring容器要创建同一类型的多个对象，init方法在每个对象创建时均执行一次
  - 当`scope="singleton"`时，关闭容器会导致bean实例的销毁，调用destroy方法一次
  - 当`scope="prototype"`时，对象的销毁由垃圾回收机制gc()控制，destroy方法将不会被执行

> 当scope为非单例模式时，销毁不归spring管理



### 3、演示 bean 生命周期 

```java
public class Orders {
 //无参数构造
 public Orders() {
 System.out.println("第一步 执行无参数构造创建 bean 实例");
 }
 private String oname;
 public void setOname(String oname) {
 this.oname = oname;
 System.out.println("第二步 调用 set 方法设置属性值");
 }
 //创建执行的初始化的方法
 public void initMethod() {
 System.out.println("第三步 执行初始化的方法");
 }
 //创建执行的销毁的方法
 public void destroyMethod() {
 System.out.println("第五步 执行销毁的方法");
 }
}
```

```xml
<bean id="orders" class="com.atguigu.spring5.bean.Orders" init-method="initMethod" destroy-method="destroyMethod">
 <property name="oname" value="手机"></property>
</bean>

```

```java
@Test
 public void testBean3() {
// ApplicationContext context =
// new ClassPathXmlApplicationContext("bean4.xml");
 ClassPathXmlApplicationContext context =
 new ClassPathXmlApplicationContext("bean4.xml");
 Orders orders = context.getBean("orders", Orders.class);
 System.out.println("第四步 获取创建 bean 实例对象");
 System.out.println(orders);
 //手动让 bean 实例销毁
 context.close();
 }
```



### 4、bean 的后置处理器，bean 生命周期有七步 

（1）通过构造器创建 bean 实例（无参数构造） 

（2）为 bean 的属性设置值和对其他 bean 引用（调用 set 方法） 

（3）把 bean 实例传递 bean 后置处理器的方法 postProcessBeforeInitialization  

（4）调用 bean 的初始化的方法（需要进行配置初始化的方法） 

（5）把 bean 实例传递 bean 后置处理器的方法 postProcessAfterInitialization 

（6）bean 可以使用了（对象获取到了）

 （7）当容器关闭时候，调用 bean 的销毁的方法（需要进行配置销毁的方法）



### 5、演示添加后置处理器效果

（1）创建类，实现接口 BeanPostProcessor，创建后置处理器

```java
public class MyBeanPost implements BeanPostProcessor {
 @Override
 public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
 System.out.println("在初始化之前执行的方法");
 return bean;
 }
 @Override
 public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
 System.out.println("在初始化之后执行的方法");
 return bean;
 }
}
```

```xml
<!--配置后置处理器-->
<bean id="myBeanPost" class="com.atguigu.spring5.bean.MyBeanPost"></bean>
```





## IOC 操作 Bean 管理（xml 自动装配）

### 1、什么是自动装配 

（1）根据指定装配规则（属性名称或者属性类型），Spring 自动将匹配的属性值进行注入 



### 2、演示自动装配过程 

需要bean标签里面的属性值 ==autowire==

（1）根据属性名称自动注入

```xml
<!--实现自动装配
 bean 标签属性 autowire，配置自动装配
 autowire 属性常用两个值：
 byName 根据属性名称注入 ，注入值 bean 的 id 值和类属性名称一样
 byType 根据属性类型注入
-->
<bean id="emp" class="com.atguigu.spring5.autowire.Emp" autowire="byName">
 <!--<property name="dept" ref="dept"></property>-->
</bean>
<bean id="dept" class="com.atguigu.spring5.autowire.Dept"></bean>

```

（2）根据属性类型自动注入

 ```xml
<!--实现自动装配
 bean 标签属性 autowire，配置自动装配
 autowire 属性常用两个值：
 byName 根据属性名称注入 ，注入值 bean 的 id 值和类属性名称一样
 byType 根据属性类型注入
-->
<bean id="emp" class="com.atguigu.spring5.autowire.Emp" autowire="byType">
 <!--<property name="dept" ref="dept"></property>-->
</bean>
<bean id="dept" class="com.atguigu.spring5.autowire.Dept"></bean>

 ```





## IOC 操作 Bean 管理(外部属性文件)

==以配置数据库举例==

### 1.直接配置数据库连接池

```xml
<!--直接配置连接池-->
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
 <property name="driverClassName" value="com.mysql.jdbc.Driver"></property>
 <property name="url" 
value="jdbc:mysql://localhost:3306/userDb"></property>
 <property name="username" value="root"></property>
 <property name="password" value="root"></property>
</bean>
```

### 2、==引入外部属性文件==配置数据库连接池

（1）创建外部属性文件，properties 格式文件，写数据库信息

![image-20221217200750184](https://raw.githubusercontent.com/195sjin/myBed/master/imagesimage-20221217200750184.png)

(2) 引入 context 名称空间

```xml
xmlns:context="http://www.springframework.org/schema/context"
```

(3) 在 spring 配置文件使用标签引入外部属性文件   (加载指定的properties文件)

```xml
<!--引入外部属性文件-->
<context:property-placeholder location="classpath:jdbc.properties"/>
```

(4)使用加载的数据

```xml
<!--配置连接池-->
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
 <property name="driverClassName" value="${prop.driverClass}"></property>
 <property name="url" value="${prop.url}"></property>
 <property name="username" value="${prop.userName}"></property>
 <property name="password" value="${prop.password}"></property>
</bean>

```





## ApplicationContext

- ApplicationContext是一个接口，提供了访问spring容器的API
- ClassPathXmlApplicationContext是一个类，实现了上述功能
- ApplicationContext的顶层接口是BeanFactory
- BeanFactory定义了bean相关的最基本操作
- ApplicationContext在BeanFactory基础上追加了若干新功能

**对比BeanFactory**

- BeanFactory创建的bean采用延迟加载形式，使用才创建
- ApplicationContext创建的bean默认采用立即加载形式

**FileSystemXmlApplicationContext**

- 可以加载文件系统中任意位置的配置文件，而ClassPathXmlApplicationContext只能加载类路径下的配置文件