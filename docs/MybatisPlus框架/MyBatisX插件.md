# MyBatisX插件

> MyBatis-Plus为我们提供了强大的mapper和service模板，能够大大的提高开发效率。
>
> 但是在真正开发过程中，MyBatis-Plus并不能为我们解决所有问题，例如一些复杂的SQL，多表联查，我们就需要自己去编写代码和SQL语句，我们该如何快速的解决这个问题呢，这个时候可以使用MyBatisX插件。
>
> MyBatisX一款基于 IDEA 的快速开发插件，为效率而生。

## 1.安装MyBatisX插件

> **打开IDEA，File-> Setteings->Plugins->MyBatisX，搜索栏搜索MyBatisX然后安装。**



## 2.快速生成代码

- 新建一个Spring Boot项目引入依赖（创建工程时记得勾选lombok及mysql驱动）

  ```xml
  <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-boot-starter</artifactId>
      <version>3.5.1</version>
  </dependency>
  
  <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
      <version>3.5.0</version>
  </dependency>
  ```

- 配置数据源信息

  ```yml
  spring:
    datasource:
      type: com.zaxxer.hikari.HikariDataSource
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/mybatis_plus?characterEncoding=utf-8&useSSL=false
      username: root
      password: 132537
  ```

- 在IDEA中与数据库建立链接

  ![image-20230519205500178](https://raw.githubusercontent.com/195sjin/myBed/master/images202305192103802.png)

- 填写数据库信息并保存

  ![image-20230519205515330](https://raw.githubusercontent.com/195sjin/myBed/master/images202305192103552.png)

- 找到我们需要生成的表点击右键

  ![image-20230519205524265](https://raw.githubusercontent.com/195sjin/myBed/master/images202305192103877.png)

- 填写完信息以后下一步

  ![image-20230519205534078](https://raw.githubusercontent.com/195sjin/myBed/master/images202305192104613.png)

- 继续填写信息

  ![image-20230519205543116](https://raw.githubusercontent.com/195sjin/myBed/master/images202305192104407.png)

- **大功告成（真特么好用yyds）**

  ![image-20230519205553700](https://raw.githubusercontent.com/195sjin/myBed/master/images202305192104536.png)



## 3.快速生成CRUD

> MyBaitsX可以根据我们在Mapper接口中输入的方法名快速帮我们生成对应的sql语句





