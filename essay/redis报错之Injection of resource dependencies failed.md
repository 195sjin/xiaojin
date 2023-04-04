在跟着黑马学redis，最初的时候，进行登录校验的功能需要用到拦截器

但是拦截器是咱们手动创建的一个类，不能直接注入StringredisTemplate

就需要在拦截器类里面写入属性，通过有参构造的方式来是使用

在拦截器类里面
```
    private StringRedisTemplate stringRedisTemplate;

    public LoginInterceptor(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

```

在拦截器配置类里面，因为这个类是Spring管理的，可以直接注入
```
    @Resource
    private StringRedisTemplate redisTemplate;


    registry.addInterceptor(new LoginInterceptor(redisTemplate));

```

但是这样会报错

报错信息为：
Injection of resource dependencies failed; nested exception is org.springframework.beans.factory.BeanNotOfRequiredTypeException: Bean named 'redisTemplate' is expected to be of type 'org.springframework.data.redis.core.StringRedisTemplate' but was actually of type 'org.springframework.data.redis.core.RedisTemplate'

在网上找到的结果是：
由于在使用Spring框架集成Redis时，Spring容器中存在多个类型为RedisTemplate的Bean，但是需要注入的Bean类型是StringRedisTemplate。因此，Spring无法确定应该注入哪个Bean，抛出了BeanNotOfRequiredTypeException异常。

解决方法是：
显式地声明需要注入的Bean类型为StringRedisTemplate，或者删除其他类型为RedisTemplate的Bean，只保留StringRedisTemplate类型的Bean。

于是把配置类里面的名字改了
```
    @Resource
    private StringRedisTemplate stringRedisTemplate;

```

这样就没有报错了。。。