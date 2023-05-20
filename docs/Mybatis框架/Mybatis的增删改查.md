# Mybatis的增删改查

## 1、增加

```
   <!--int insertUser();-->
    <insert id="insertUser">
        insert into t_user values(null,'张三','123',23,'女','12345@qq.com')
    </insert>
```





## 2、删除

```
    <!--void deleteUser();-->
    <delete id="deleteUser">
        delete from t_user where id=5
    </delete>
```





## 3、修改

```
    <!--void updateUser();-->
    <update id="updateUser">
        update t_user set username='李四' where id=3
    </update>
```





## 4、查询一个实体类对象

```
    <!--User getUserById();-->
    <select id="getUserById" resultType="user">
        select * from t_user where id=3
    </select>
```





## 5、查询集合

```
    <!--List<User> getAllUser();-->
    <select id="getAllUser" resultType="com.jin.mybatis.pojo.User">
            select * from t_user
    </select>
```





## **注意**

> 查询功能必须设置resultMap或者resultType
> resultType：设置默认的映射关系，字段名与实体类中的属性名对应
> resultMap：设置自定义的映射关系，字段名与实体类中的属性名有些不同时使用
>
> 当查询的数据为多条时，不能使用实体类作为返回值，只能使用集合，否则会抛出异常TooManyResultsException；但是若查询的数据只有一条，可以使用实体类或集合作为返回值