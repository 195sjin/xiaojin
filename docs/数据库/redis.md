# Redis

## NoSQL

**NoSQL不仅仅是数据库，指的是非关系型数据库，NoSQL并不是要取代关系型数据库，而是对关系型数据库进行补充**



![image-20230330182607642](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301826701.png)



![image-20230330182643305](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301826384.png)

## 什么是Redis

![image-20230330182715805](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301827900.png)

![image-20230330182801406](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301828476.png)



## Redis数据类型

![image-20230317113134993](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301638328.png)



![image-20230326155328303](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301637823.png)



![image-20230317113217351](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301637476.png)



## 通用命令

![image-20230330182837155](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301828204.png)

![image-20230330182907817](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301829848.png)

> **keys** 是模糊查询，会给服务器带来负担，redis是单线程的，在搜索的这段时间内，会进行阻塞，在集群的时候，可以在从服务器使用，不能再主结点使用
>
> **ttl** 的时候，返回的是-1，则表明永久有效

## Redis命令

### String类型

都是字节数组形式进行存储

字符串类型的最大存储空间不能超过512m

数值类型（整型、浮点型）的字符串，把数字转化为二进制形式作为字节进行存储，一个字节就能表示很大的数字，更节省空间。

![image-20230330152408605](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301524675.png)

**redis的key的格式：[项目名]:[业务名]:[类型]:[id]**

### Hash类型

![image-20230330165612949](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301656016.png)

![image-20230330181556868](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301815902.png)



![image-20230330165705326](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301657387.png)



### List类型

![image-20230330173000225](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301730159.png)

![image-20230330181459056](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301814086.png)

![image-20230330173056088](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301730139.png)

BLPOP与BRPOP相当于阻塞了，没有这个元素，就阻塞设置的时间，当添加了这个元素，就通行

### Set类型

**插入元素会经过hash算法计算角标，所以无序**

![image-20230330174728899](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301747943.png)



![image-20230330174923502](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301749585.png)

### SortedSet类型

![image-20230330181224190](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301812233.png)

![image-20230330180321698](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301803747.png)

![image-20230330181252353](https://raw.githubusercontent.com/195sjin/myBed/master/images202303311334584.png)



**TreeSet底层是红黑树**

**跳表：可以用来排序，也可以增加查询速度**



![image-20230330180849780](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301808856.png)



## Redis的java客户端

![image-20230330182530371](https://raw.githubusercontent.com/195sjin/myBed/master/images202303301825440.png)



### Jedis

怎么使用？

引入依赖、创建对象，建立连接（IP、端口），使用jedis、释放资源

#### Jedis连接池

Jedis不安全，多线程的时候，并发访问会出问题，给每个线程创建单独的对象，这个时候就需要使用连接池

![image-20230331164710965](https://raw.githubusercontent.com/195sjin/myBed/master/images202303311647096.png)

### SpringDataRedis

![image-20230331165625210](https://raw.githubusercontent.com/195sjin/myBed/master/images202303311656273.png)



![image-20230331165812826](https://raw.githubusercontent.com/195sjin/myBed/master/images202303311658889.png)



![image-20230331191244522](https://raw.githubusercontent.com/195sjin/myBed/master/images202303311912602.png)

#### 序列化与反序列化

我们可以自定义RedisTemplate的序列化方式

```
@Configuration
public class RedisConfig {

    @Resource
    private RedisConnectionFactory connectionFactory;

    @Bean
    public RedisTemplate<String,Object> redisTemplate(){
        //创建redisTemplate对象
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        //设置连接工厂
        template.setConnectionFactory(connectionFactory);
        //创建JSON序列化工具
        GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        //设置key的序列化
        template.setKeySerializer(RedisSerializer.string());
        template.setHashKeySerializer(RedisSerializer.string());
        //设置value的序列化
        template.setValueSerializer(jsonRedisSerializer);
        template.setHashValueSerializer(jsonRedisSerializer);
        //返回
        return template;
    }

}
```

存的时候把对象转化为json，取的时候把JSON反序列化为对象

但是为了在反序列化的时候知道对象的类型，JSON序列化器会把类的class类型写入JSON结果中，存入了redis，他存的这个数据比较大，会带来额外的内存开销。

![image-20230331200413382](https://raw.githubusercontent.com/195sjin/myBed/master/images202303312004458.png)

spring默认提供了一个StringRedistemplate类，key和value的序列化方式默认就是String方式，省去了我们定义RedisTemplate过程

```
   @Autowired
    private StringRedisTemplate stringRedisTemplate;
    private static final ObjectMapper mapper = new ObjectMapper();
    
    @Test
    void testStringRedisTemplate() throws JsonProcessingException {
        //准备对象
        User lisi = new User("lisi", 27);
        //手动序列化
        String json = mapper.writeValueAsString(lisi);
        System.out.println(json);
        //写入数据
        stringRedisTemplate.opsForValue().set("zijin:user:111",json);

        //读取数据
        String val = stringRedisTemplate.opsForValue().get("zijin:user:111");
        //反序列化
        User user = mapper.readValue(val, User.class);
        System.out.println(user);
    }
```

## Redis实战（黑马点评）

![image-20230403113729433](https://raw.githubusercontent.com/195sjin/myBed/master/images202304031137569.png)

### 表的数据

![image-20230403115709469](https://raw.githubusercontent.com/195sjin/myBed/master/images202304031157508.png)

### 项目架构

![image-20230403115830270](https://raw.githubusercontent.com/195sjin/myBed/master/images202304031158329.png)

### 短信登录

#### 基于session登录

![image-20230404104145989](https://raw.githubusercontent.com/195sjin/myBed/master/images202304041041125.png)



##### 拦截器

越来越多的业务都需要去校验用户的登录，每个controller里面都需要写校验逻辑吗？**不是**

把校验这块的逻辑放在拦截器里面进行，然后需要拦截器把拦截到的信息传递到controller里面去，需要注意线程的安全



##### 集群的session共享问题

session共享：多台Tomcat并不共享session存储空间，当请求切换到不同的Tomcat服务器时导致数据丢失

![image-20230404173224614](https://raw.githubusercontent.com/195sjin/myBed/master/images202304041732684.png)



#### 基于redis实现登录



![image-20230404180245297](https://raw.githubusercontent.com/195sjin/myBed/master/images202304041802377.png)





![image-20230404195442969](https://raw.githubusercontent.com/195sjin/myBed/master/images202304041954102.png)

### 商户查询缓存

**读写性能较高**

#### 缓存

一句话:因为**速度快,好用**

缓存数据存储于代码中,而代码运行在内存中,内存的读写性能远高于磁盘,缓存可以大大降低**用户访问并发量带来的**服务器读写压力

![image-20230404214421413](https://raw.githubusercontent.com/195sjin/myBed/master/images202304042144517.png)

#### 缓存作用模型

![image-20230405094820758](https://raw.githubusercontent.com/195sjin/myBed/master/images202304050948860.png)

#### 根据id查询商铺缓存的流程

![image-20230405095056720](https://raw.githubusercontent.com/195sjin/myBed/master/images202304050950768.png)

#### 缓存更新策略

缓存更新是redis为了节约内存而设计出来的一个东西，主要是因为内存数据宝贵，当我们向redis插入太多数据，此时就可能会导致缓存中的数据过多，所以redis会对部分数据进行更新，或者把他叫为淘汰更合适。

 ![image-20230405105055235](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051050333.png)



##### 数据库缓存不一致解决方案

由于我们的**缓存的数据源来自于数据库**,而数据库的**数据是会发生变化的**,因此,如果当数据库中**数据发生变化,而缓存却没有同步**,此时就会有**一致性问题存在**,其后果是:

用户使用缓存中的过时数据,就会产生类似多线程数据安全问题,从而影响业务,产品口碑等

![image-20230405105558851](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051055910.png)



 假设我们每次操作数据库后，都操作缓存，但是中间如果没有人查询，那么这个更新动作实际上只有最后一次生效，中间的更新动作意义并不大，我们可以把缓存删除，等待再次查询时，将缓存中的数据加载出来



![image-20230405111025198](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051110266.png)

###### 先删缓存，再操作数据库

**正常情况下**

![image-20230405111520040](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051115090.png)

**异常情况**

缓存的查询与写入比数据库的操作更快

![image-20230405111838357](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051118407.png)



###### 先操作数据库，再删除缓存

**正常情况下**

![image-20230405111956852](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051119901.png)



**异常情况下**

恰好缓存失效；查完数据库，在微秒级别内写缓存，另一个线程进来；这是不太容易发生的

![image-20230405112159766](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051121817.png)



**一般采用第二种**

##### 最佳方案

![image-20230405113005467](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051130523.png)

**查询数据时**：先查询缓存；如果缓存命中，直接返回；缓存没有命中，则查询数据库；将数据库数据写入缓存；返回结果

**修改数据时**：先修改数据库；然后再删除缓存；确保两者的一致性

#### 实现商铺缓存与数据库的双写一致



![image-20230405113256172](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051132222.png)



#### 缓存穿透

**缓存穿透**是指客户端请求的数据在缓存中和在数据库中都不存在，这样缓存永远不会生效，这些请求都会打到数据库

**无数线程并发的来向不存在的数据发起请求，所有请求都到数据库，数据库就垮了**

![image-20230405115808962](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051158032.png)

###### 缓存空对象

缓存空对象思路分析

![image-20230405194102672](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051941709.png)

###### 布隆过滤器



布隆过滤器（Bloom Filter）是一种空间效率很高的数据结构，用于**判断一个元素是否属于一个集合**。它利用位数组和哈希函数实现，可以快速地判断一个元素是否在集合中，但是在某些情况下可能会出现误判的情况。

误判原因在于：布隆过滤器走的是哈希思想，只要哈希思想，就可能存在哈希冲突

布隆过滤器主要用于大规模数据的去重和判重，例如网页爬虫中的URL去重、邮件服务器中的垃圾邮件过滤等场景。它的优点是**空间效率高、查询速度快**，但缺点是**可能会出现误判**，因此不能完全替代传统的哈希表等数据结构。

![image-20230405194029262](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051940324.png)



###### 其它

如使用bitmap来解决缓存穿透的方案，解决方案：

* 判断id<0

* 如果数据库是空，那么就可以直接往redis里边把这个空数据缓存起来

第一种解决方案：遇到的问题是如果用户访问的是id不存在的数据，则此时就无法生效

第二种解决方案：遇到的问题是：如果是不同的id那就可以防止下次过来直击数据

所以我们如何解决呢？

我们可以将数据库的数据，所对应的id写入到一个list集合中，当用户过来访问的时候，我们直接去判断list中是否包含当前的要查询的数据，如果说用户要查询的id数据并不在list集合中，则直接返回，如果list中包含对应查询的id数据，则说明不是一次缓存穿透数据，则直接放行。

![image-20230423131457681](https://raw.githubusercontent.com/195sjin/myBed/master/images202304231315799.png)

现在的问题是这个主键其实并没有那么短，而是很长的一个 主键

哪怕你单独去提取这个主键，但是在11年左右，淘宝的商品总量就已经超过10亿个

所以如果采用以上方案，这个list也会很大，所以我们可以使用bitmap来减少list的存储空间

我们可以把list数据抽象成一个非常大的bitmap，我们不再使用list，而是将db中的id数据利用哈希思想，比如：

id % bitmap.size  = 算出当前这个id对应应该落在bitmap的哪个索引上，然后将这个值从0变成1，然后当用户来查询数据时，此时已经没有了list，让用户用他查询的id去用相同的哈希算法， 算出来当前这个id应当落在bitmap的哪一位，然后判断这一位是0，还是1，如果是0则表明这一位上的数据一定不存在，  采用这种方式来处理，需要重点考虑一个事情，就是误差率，所谓的误差率就是指当发生哈希冲突的时候，产生的误差。

![image-20230423131527191](https://raw.githubusercontent.com/195sjin/myBed/master/images202304231315256.png)



![image-20230405194327400](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051943431.png)

###### 解决方案

![image-20230405120251549](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051202629.png)



###### 总结

![image-20230405121856366](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051218412.png)



#### 缓存雪崩

**缓存雪崩**是指在同一时段大量的缓存**key同时失效**或者Redis**服务宕机**，导致大量请求到数据库，带来巨大压力。

![image-20230405140353735](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051403823.png)



#### 缓存击穿

缓存击穿问题也叫**热点Key问题**，就是一个被高并发访问并且缓存重建业务较复杂的key突然失效了，无数的请求访问会在瞬间给数据库带来巨大的冲击

常见的解决方案有两种：

* 互斥锁
* 逻辑过期

![image-20230426200546157](https://raw.githubusercontent.com/195sjin/myBed/master/images202304262005309.png)



![image-20230405141830144](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051418240.png)

**互斥锁方案：**由于保证了互斥性，所以数据一致，且实现简单，因为仅仅只需要加一把锁而已，也没其他的事情需要操心，所以没有额外的内存消耗，缺点在于有锁就有死锁问题的发生，且只能串行执行性能肯定受到影响

**逻辑过期方案：** 线程读取过程中不需要等待，性能好，有一个额外的线程持有锁去进行重构数据，但是在重构数据完成前，其他的线程只能返回之前的数据，且实现起来麻烦

![image-20230405142605437](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051426495.png)



##### 互斥锁方式解决缓存击穿

**思路：在缓存重建过程加锁，确保重建过程只有一个线程执行，其它线程等待。**

![image-20230405143809347](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051438417.png)

核心思路就是利用redis的setnx方法来表示获取锁，该方法含义是redis中如果没有这个key，则插入成功，返回1，在stringRedisTemplate中返回true，  如果有这个key则插入失败，则返回0，在stringRedisTemplate返回false，我们可以通过true，或者是false，来表示是否有线程成功插入key，成功插入的key的线程我们认为他就是获得到锁的线程。



##### 逻辑过期方式解决缓存击穿

**思路：热点key缓存永不过期，而是设置一个逻辑过期时间，查询到数据时通过对逻辑过期时间判断，来决定是否需要重建缓存；**

**重建缓存也需要通过互斥锁保证单线程执行；重建缓存利用独立线程异步执行；其它线程无需等待，直接查询到旧数据即可**

![image-20230405161942252](https://raw.githubusercontent.com/195sjin/myBed/master/images202304051619331.png)



#### 封装Redis工具类

基于StringRedisTemplate封装一个缓存工具类，满足下列需求：

* 方法1：将任意Java对象序列化为json并存储在string类型的key中，并且可以设置TTL过期时间
* 方法2：将任意Java对象序列化为json并存储在string类型的key中，并且可以设置逻辑过期时间，用于处理缓

存击穿问题

* 方法3：根据指定的key查询缓存，并反序列化为指定类型，利用缓存空值的方式解决缓存穿透问题
* 方法4：根据指定的key查询缓存，并反序列化为指定类型，需要利用逻辑过期解决缓存击穿问题

```
@Slf4j
@Component
public class CacheClient {

    private final StringRedisTemplate stringRedisTemplate;

    private static final ExecutorService CACHE_REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);

    public CacheClient(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    public void set(String key, Object value, Long time, TimeUnit unit) {
        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(value), time, unit);
    }

    public void setWithLogicalExpire(String key, Object value, Long time, TimeUnit unit) {
        // 设置逻辑过期
        RedisData redisData = new RedisData();
        redisData.setData(value);
        redisData.setExpireTime(LocalDateTime.now().plusSeconds(unit.toSeconds(time)));
        // 写入Redis
        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(redisData));
    }

    public <R,ID> R queryWithPassThrough(
            String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit){
        String key = keyPrefix + id;
        // 1.从redis查询商铺缓存
        String json = stringRedisTemplate.opsForValue().get(key);
        // 2.判断是否存在
        if (StrUtil.isNotBlank(json)) {
            // 3.存在，直接返回
            return JSONUtil.toBean(json, type);
        }
        // 判断命中的是否是空值
        if (json != null) {
            // 返回一个错误信息
            return null;
        }

        // 4.不存在，根据id查询数据库
        R r = dbFallback.apply(id);
        // 5.不存在，返回错误
        if (r == null) {
            // 将空值写入redis
            stringRedisTemplate.opsForValue().set(key, "", CACHE_NULL_TTL, TimeUnit.MINUTES);
            // 返回错误信息
            return null;
        }
        // 6.存在，写入redis
        this.set(key, r, time, unit);
        return r;
    }

    public <R, ID> R queryWithLogicalExpire(
            String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) {
        String key = keyPrefix + id;
        // 1.从redis查询商铺缓存
        String json = stringRedisTemplate.opsForValue().get(key);
        // 2.判断是否存在
        if (StrUtil.isBlank(json)) {
            // 3.存在，直接返回
            return null;
        }
        // 4.命中，需要先把json反序列化为对象
        RedisData redisData = JSONUtil.toBean(json, RedisData.class);
        R r = JSONUtil.toBean((JSONObject) redisData.getData(), type);
        LocalDateTime expireTime = redisData.getExpireTime();
        // 5.判断是否过期
        if(expireTime.isAfter(LocalDateTime.now())) {
            // 5.1.未过期，直接返回店铺信息
            return r;
        }
        // 5.2.已过期，需要缓存重建
        // 6.缓存重建
        // 6.1.获取互斥锁
        String lockKey = LOCK_SHOP_KEY + id;
        boolean isLock = tryLock(lockKey);
        // 6.2.判断是否获取锁成功
        if (isLock){
            // 6.3.成功，开启独立线程，实现缓存重建
            CACHE_REBUILD_EXECUTOR.submit(() -> {
                try {
                    // 查询数据库
                    R newR = dbFallback.apply(id);
                    // 重建缓存
                    this.setWithLogicalExpire(key, newR, time, unit);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }finally {
                    // 释放锁
                    unlock(lockKey);
                }
            });
        }
        // 6.4.返回过期的商铺信息
        return r;
    }

    public <R, ID> R queryWithMutex(
            String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) {
        String key = keyPrefix + id;
        // 1.从redis查询商铺缓存
        String shopJson = stringRedisTemplate.opsForValue().get(key);
        // 2.判断是否存在
        if (StrUtil.isNotBlank(shopJson)) {
            // 3.存在，直接返回
            return JSONUtil.toBean(shopJson, type);
        }
        // 判断命中的是否是空值
        if (shopJson != null) {
            // 返回一个错误信息
            return null;
        }

        // 4.实现缓存重建
        // 4.1.获取互斥锁
        String lockKey = LOCK_SHOP_KEY + id;
        R r = null;
        try {
            boolean isLock = tryLock(lockKey);
            // 4.2.判断是否获取成功
            if (!isLock) {
                // 4.3.获取锁失败，休眠并重试
                Thread.sleep(50);
                return queryWithMutex(keyPrefix, id, type, dbFallback, time, unit);
            }
            // 4.4.获取锁成功，根据id查询数据库
            r = dbFallback.apply(id);
            // 5.不存在，返回错误
            if (r == null) {
                // 将空值写入redis
                stringRedisTemplate.opsForValue().set(key, "", CACHE_NULL_TTL, TimeUnit.MINUTES);
                // 返回错误信息
                return null;
            }
            // 6.存在，写入redis
            this.set(key, r, time, unit);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }finally {
            // 7.释放锁
            unlock(lockKey);
        }
        // 8.返回
        return r;
    }

    private boolean tryLock(String key) {
        Boolean flag = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
        return BooleanUtil.isTrue(flag);
    }

    private void unlock(String key) {
        stringRedisTemplate.delete(key);
    }
}
```

在ShopServiceImpl 中

```
@Resource
private CacheClient cacheClient;

 @Override
    public Result queryById(Long id) {
        // 解决缓存穿透
        Shop shop = cacheClient
                .queryWithPassThrough(CACHE_SHOP_KEY, id, Shop.class, this::getById, CACHE_SHOP_TTL, TimeUnit.MINUTES);

        // 互斥锁解决缓存击穿
        // Shop shop = cacheClient
        //         .queryWithMutex(CACHE_SHOP_KEY, id, Shop.class, this::getById, CACHE_SHOP_TTL, TimeUnit.MINUTES);

        // 逻辑过期解决缓存击穿
        // Shop shop = cacheClient
        //         .queryWithLogicalExpire(CACHE_SHOP_KEY, id, Shop.class, this::getById, 20L, TimeUnit.SECONDS);

        if (shop == null) {
            return Result.fail("店铺不存在！");
        }
        // 7.返回
        return Result.ok(shop);
    }
```



### 优惠券秒杀

#### Redis自增实现全局唯一ID

全局ID生成器**，是一种在分布式系统下用来生成全局唯一ID的工具，一般要满足下列特性

![image-20230426200923384](https://raw.githubusercontent.com/195sjin/myBed/master/images202304262009444.png)

![image-20230407120649922](https://raw.githubusercontent.com/195sjin/myBed/master/images202304071206993.png)

知识小贴士：关于countdownlatch

countdownlatch名为信号枪：主要的作用是同步协调在多线程的等待于唤醒问题

我们如果没有CountDownLatch ，那么由于程序是异步的，当异步程序没有执行完时，主线程就已经执行完了，然后我们期望的是分线程全部走完之后，主线程再走，所以我们此时需要使用到CountDownLatch

CountDownLatch 中有两个最重要的方法

1、countDown

2、await

await 方法 是阻塞方法，我们担心分线程没有执行完时，main线程就先执行，所以使用await可以让main线程阻塞，那么什么时候main线程不再阻塞呢？当CountDownLatch  内部维护的 变量变为0时，就不再阻塞，直接放行，那么什么时候CountDownLatch   维护的变量变为0 呢，我们只需要调用一次countDown ，内部变量就减少1，我们让分线程和变量绑定， 执行完一个分线程就减少一个变量，当分线程全部走完，CountDownLatch 维护的变量就是0，此时await就不再阻塞，统计出来的时间也就是所有分线程执行完后的时间。



#### 优惠券秒杀

![image-20230407173528112](https://raw.githubusercontent.com/195sjin/myBed/master/images202304071735209.png)



#### 超卖问题

![image-20230408082629737](https://raw.githubusercontent.com/195sjin/myBed/master/images202304080826825.png)

解决超卖问题就可以**加锁**

超卖问题是典型的多线程安全问题，针对这一问题的常见解决方案就是加锁：而对于加锁，我们通常有两种解决方案

![image-20230408083124506](https://raw.githubusercontent.com/195sjin/myBed/master/images202304080831626.png)

**悲观锁**

悲观锁的核心思想是“先锁住资源，再进行操作”，因此它的性能相对较低，适用于并发度不高的场景。

##### 乐观锁

乐观锁的关键是判断**之前查询到的数据是否有被修改**过

![image-20230408083606959](https://raw.githubusercontent.com/195sjin/myBed/master/images202304080836029.png)

**其实stock与version每次都要做相同的查询与更改，于是我们用数据本身有没有变化来判断线程是不是安全**

![image-20230408084023599](https://raw.githubusercontent.com/195sjin/myBed/master/images202304080840674.png)

##### 解决方案

使用CAS法

如果使用and stock = 100；当一个线程成功后，其他线程都失败，大家都不符合stock= 100，全部失败，因此会出现失败率高的问题

他们认为已经更改过数据，在进行更改会出现线程安全问题，其实没有，确实是产生了并发修改，但是没有业务上的问题。

对于库存来说，只需要库存大于0就行。

```
//扣减库存
        boolean success = seckillVoucherService.update()
                .setSql("stock = stock - 1")
                .eq("voucher_id", voucherId)
                .gt("stock",0)
                .update();
```

##### 总结

![image-20230408090842311](https://raw.githubusercontent.com/195sjin/myBed/master/images202304080908367.png)

**乐观锁也会访问数据库，会给数据库造成压力**



#### 一人一单

一个优惠券，一个用户只能一单

![image-20230408092312936](https://raw.githubusercontent.com/195sjin/myBed/master/images202304080923002.png)

做了业务判断，但是还是会有问题，why？

多线程并发操作，会出现多个线程穿插执行；大家都来进行查询，都是count= 0，于是大家都进行插入数据

加锁，但是不能加乐观锁，只能加悲观锁，因为没有进行数据的更新了

给谁加锁？从查到订单，一直到新增订单都需要加锁，把逻辑（创建订单）进行封装成一个方法

不建议把synchronize加在方法上，锁的对象是this（不管任何一个用户来了都要加锁，大家都是同一把锁，意味着这个方法都是串行执行了，性能不好）这样添加锁，锁的粒度太粗了，在使用锁过程中，控制**锁粒度** 是一个非常重要的事情，因为如果锁的粒度太大，会导致每个线程进来都会锁住

一人一单就是同一个用户来了，我们才判断并发安全问题，所以在方法内部给用户id加锁（id**值**一样的作为一把锁）

但是到最后我们是先释放锁，在去提交事务（方法执行完之后，由spring进行提交事务）也就是说，已经释放完锁，但是还没有提交事务这一段时间，其他线程也能进来，还可能出现线程并发安全问题

因此，锁的范围有点小，我们需要把获取锁加在方法执行之前（事务提交之前），释放锁放在方法执行完（事务提交之后）

但是，在执行封装方法的时候，有事务的问题，外面的函数调用里面的封装的函数的时候，用的是this调用，不是代理对象，用代理对象调用才会执行事务（事务失效）

当前对象的代理对象 

```
IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
```

并且引入aspectj依赖，启动类加上注解@EnableAspectJAutoProxy(exposeProxy = true)暴露代理对象

##### 集群模式下的并发问题

![image-20230408103155797](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081031903.png)

**并发安全问题**

在集群模式下，部署了多个tomcat，每个tomcat都有一个属于自己的jvm，有多个jvm存在，每个jvm中有自己的锁，导致每一个锁都有一个线程获取，出现并行运行，会出现安全问题

![image-20230408104947808](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081049917.png)



#### 秒杀优化

将耗时比较短的逻辑判断放入到redis中，比如是否库存足够，比如是否一人一单，这样的操作，只要这种逻辑可以完成，就意味着我们是一定可以下单完成的

![image-20230410083709201](https://raw.githubusercontent.com/195sjin/myBed/master/images202304100837293.png)





![image-20230410084745034](https://raw.githubusercontent.com/195sjin/myBed/master/images202304100847124.png)



**把数据库的操作进行异步操作，从而大大缩短了秒杀业务的流程，从而提高了秒杀业务的并发，并且减轻了数据库的压力**

因为已经返回了订单的id，所以用户可以拿着id去付款，什么时候将数据写入数据库，完成操作就没有这么重要了，时效性要求就没有这么高。，可以按照数据库能够承受的频率将数据写入数据库（想提高数据库的写入性能，可以多开几个线程，批量的写）

![image-20230410085521599](https://raw.githubusercontent.com/195sjin/myBed/master/images202304100855667.png)

定义阻塞队列可以用   BlockingQueue  当一个线程尝试从里面获取元素，里面没有元素，就会进行阻塞，直到里面有元素才会被唤醒

异步下单 ，开启独立线程，不断执行线程任务（从阻塞队列取出订单下单），需要准备线程池，线程任务

什么时候执行任务，在用户秒杀抢购之前开始，用户一旦开始秒杀，就会向阻塞队列添加新的订单，任务就应该取出订单信息，项目只要一启动，用户随时都会开始秒杀，所以，任务应该在类初始化完的时候就该执行

spring提供注解@PostConstruct注解，当前类初始化完成之后执行



阻塞队列有内存限制

jvm内存限制问题，jvm内存不是无限的，在高并发情况下，大量的订单需要创建，可能超出jvm阻塞队列的上限

数据安全问题，jvm内存没有持久化机制，每当服务重启或者宕机，阻塞队列中的所有订单任务就都会丢失，

或者当从阻塞队列中拿到一个订单任务，去处理时发生异常，这个订单任务再也没有被处理了，数据就丢失了



![image-20230410101543834](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101015925.png)



#### 秒杀优化--redis实现消息队列，进行异步秒杀

![image-20230410212948240](https://raw.githubusercontent.com/195sjin/myBed/master/images202304102129312.png)





### 分布式锁

分布式锁：满足分布式系统或集群模式下多进程可见并且互斥的锁。

**需要多个jvm进程都能看到同一个锁监视器（多进程可见），互斥（只有一个线程能够拿到线程锁）**

![image-20230408110247100](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081102221.png)

可见性：多个线程都能看到相同的结果，注意：这个地方说的可见性并不是并发编程中指的内存可见性，只是说多个进程之间都能感知到变化的意思

互斥：互斥是分布式锁的最基本的条件，使得程序串行执行

高可用：程序不易崩溃，时时刻刻都保证较高的可用性

高性能：由于加锁本身就让性能降低，所有对于分布式锁本身需要他就较高的加锁性能和释放锁性能

安全性：安全也是程序中必不可少的一环

![image-20230408110555984](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081105045.png)

#### 分布式锁的实现

Mysql：mysql本身就带有锁机制，但是由于mysql性能本身一般，所以采用分布式锁的情况下，其实使用mysql作为分布式锁比较少见

Redis：redis作为分布式锁是非常常见的一种使用方式，现在企业级开发中基本都使用redis或者zookeeper作为分布式锁，利用setnx这个方法，如果插入key成功，则表示获得到了锁，如果有人插入成功，其他人插入失败则表示无法获得到锁，利用这套逻辑来实现分布式锁

Zookeeper：zookeeper也是企业级开发中较好的一个实现分布式锁的方案

![image-20230408111621730](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081116817.png)

#### Redis实现分布式锁

![image-20230408143053037](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081439941.png)

##### 出现问题

由于阻塞，把别人的锁释放了

![image-20230408152752576](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081527664.png)

##### 解决

![image-20230408152938780](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081529868.png)

![image-20230408153026518](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081530587.png)

![image-20230408154904428](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081549506.png)

##### 又出现问题

**判断锁标识**和**释放锁**之间产生了阻塞，避免这种事发生，必须确保这两个动作成**原子性**

![image-20230408155754414](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081557496.png)

##### 解决

redis事务能保证原子性，**不能保证一致性**，而且事务里面的多个操作是批处理，是最终一次性处理；推荐使用**lua脚本**

###### lua脚本

Redis提供了Lua脚本功能

![image-20230408160911835](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081609946.png)



![image-20230408163600136](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081636333.png)



###### 解决流程

![image-20230408164903703](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081649794.png)

我们的RedisTemplate中，可以利用execute方法去执行lua脚本，参数对应关系就如下图

![image-20230408165122855](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081651978.png)

##### 总结

![image-20230408171752518](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081717586.png)

我们一路走来，利用添加过期时间，防止死锁问题的发生，但是有了过期时间之后，可能出现误删别人锁的问题，这个问题我们开始是利用删之前通过拿锁，比锁，删锁这个逻辑来解决的，也就是删之前判断一下当前这把锁是否是属于自己的，但是现在还有原子性问题，也就是我们没法保证拿锁比锁删锁是一个原子性的动作，最后通过lua表达式来解决这个问题

但是目前还剩下一个问题锁不住，什么是锁不住呢，你想一想，如果当过期时间到了之后，我们可以给他续期一下，比如续个30s，就好像是网吧上网， 网费到了之后，然后说，来，网管，再给我来10块的，是不是后边的问题都不会发生了，那么续期问题怎么解决呢，可以依赖于我们接下来要学习redission



![image-20230408173151704](https://raw.githubusercontent.com/195sjin/myBed/master/images202304081731804.png)

**重入问题**：重入问题是指 获得锁的线程可以再次进入到相同的锁的代码块中，可重入锁的意义在于**防止死锁**，比如HashTable这样的代码中，他的方法都是使用synchronized修饰的，假如他在一个方法内，调用另一个方法，那么此时如果是不可重入的，不就死锁了吗？所以可重入锁他的主要意义是防止死锁，我们的synchronized和Lock锁都是可重入的。

**不可重试**：是指目前的分布式只能尝试一次，我们认为合理的情况是：当线程在获得锁失败后，他应该能再次尝试获得锁。

**超时释放：**我们在加锁时增加了过期时间，这样的我们可以防止死锁，但是如果卡顿的时间超长，虽然我们采用了lua表达式防止删锁的时候，误删别人的锁，但是毕竟没有锁住，有安全隐患

**主从一致性：** 如果Redis提供了主从集群，当我们向集群写数据时，主机需要异步的将数据同步给从机，而万一在同步过去之前，主机宕机了，就会出现死锁问题。



#### Redisson

Redisson是一个在Redis的基础上实现的Java驻内存数据网格（In-Memory Data Grid）。它不仅提供了一系列的分布式的Java常用对象，还提供了许多分布式服务，其中就包含了各种分布式锁的实现。

Redission提供了分布式锁的多种多样的功能

![image-20230426201806330](https://raw.githubusercontent.com/195sjin/myBed/master/images202304262018396.png)

![image-20230408201603328](https://raw.githubusercontent.com/195sjin/myBed/master/images202304082016456.png)



![image-20230408201634676](https://raw.githubusercontent.com/195sjin/myBed/master/images202304082016773.png)



##### Redisson可重入锁原理

**可重入：一个线程连续两次获取锁**

因为在redis自定义分布式锁的时候，当获取锁的时候，执行 set lock thread1 nx ex 10，当该线程继续调用获取锁的方法的时候，不能执行该语句

![image-20230408203339995](https://raw.githubusercontent.com/195sjin/myBed/master/images202304082033129.png)

**逻辑太复杂，代码有多个步骤，使用java语言可能会出现问题，于是使用lua脚本来保证获取锁和释放锁的原子性**

![image-20230408204030036](https://raw.githubusercontent.com/195sjin/myBed/master/images202304082040187.png)



![image-20230408204247705](https://raw.githubusercontent.com/195sjin/myBed/master/images202304082042865.png)

##### Redisson的锁重试与WatchDog机制

**锁重试：获取锁失败，就等待**

定时更新锁有效期     **看门狗**：获取锁成功之后，开启一个定时任务，每过一段时间重置锁有效期，自己设置leaseTime，则leaseTime！=-1，就不走看门狗这个逻辑

![image-20230409093311852](https://raw.githubusercontent.com/195sjin/myBed/master/images202304090933000.png)

##### Redisson分布式锁原理

![image-20230409093758982](https://raw.githubusercontent.com/195sjin/myBed/master/images202304090937036.png)

##### Redisson分布式锁主从一致性(multiLock)

此时我们去写命令，写在主机上， 主机会将数据同步给从机，但是假设在主机还没有来得及把数据写入到从机去的时候，此时主机宕机，哨兵会发现主机宕机，并且选举一个slave变成master，而此时新的master中实际上并没有锁信息，此时锁信息就已经丢掉了。



为了解决这个问题，redission提出来了MutiLock锁，使用这把锁咱们就不使用主从了，每个节点的地位都是一样的， 这把锁加锁的逻辑需要写入到每一个主丛节点上，只有所有的服务器都写入成功，此时才是加锁成功，假设现在某个节点挂了，那么他去获得锁的时候，只要有一个节点拿不到，都不能算是加锁成功，就保证了加锁的可靠性

![image-20230409094655605](https://raw.githubusercontent.com/195sjin/myBed/master/images202304090946701.png)

那么MutiLock 加锁原理是什么呢？

当我们去设置了多个锁时，redission会将多个锁添加到一个集合中，然后用while循环去不停去尝试拿锁，但是会有一个总共的加锁时间，这个时间是用需要加锁的个数 * 1500ms ，假设有3个锁，那么时间就是4500ms，假设在这4500ms内，所有的锁都加锁成功， 那么此时才算是加锁成功，如果在4500ms有线程加锁失败，则会再次去进行重试.

#### 总结

![image-20230409110718136](https://raw.githubusercontent.com/195sjin/myBed/master/images202304091107205.png)



### Redis消息队列实现异步秒杀

#### 消息队列

消息队列是一种**通信协议**，用于**将消息从一个应用程序传递到另一个应用程序或组件**。通常，消息队列被用来实现异步处理或解耦不同组件之间的通信。在消息队列中，**发送方将消息发送到队列中，接收方从队列中接收消息，并处理它们**。这种模式允许发送方和接收方在时间上分离，从而提高系统的可扩展性、可靠性和弹性。

一些常见的消息队列实现包括 RabbitMQ、Apache Kafka、Amazon SQS、ActiveMQ 等。这些消息队列实现通常支持多种消息传递模式，如点对点、发布/订阅、请求/响应等。

消息队列的**工作原理**可以概括为以下几个步骤：

- 发送者将消息发送到消息队列中。
- 消息队列将消息保存在内存或磁盘中，等待接收者来获取它。
- 接收者从消息队列中获取消息，并进行处理。
- 接收者处理完消息后，可以将处理结果发送回消息队列，或直接返回给发送者。

消息队列的**优点**包括：

- 解耦：消息队列可以将发送者和接收者解耦，从而避免了直接依赖的问题。
- 异步：消息队列提供了异步处理的能力，从而提高了系统的响应速度和吞吐量。
- 可靠性：消息队列可以确保消息的可靠传递，即使某些组件出现故障，也可以保证消息不会丢失。
- 可扩展性：通过消息队列，可以轻松地扩展系统的吞吐量和处理能力。
- 顺序性：某些消息队列实现可以保证消息的顺序性，从而确保消息的处理顺序正确。

在实际应用中，消息队列的**应用场景**非常广泛，例如：

- 异步任务处理：将任务放入消息队列中，由后台工作线程异步处理任务，提高系统的响应速度和吞吐量。
- 应用解耦：不同组件之间通过消息队列进行通信，从而避免了直接依赖，提高了系统的可维护性和可扩展性。
- 日志处理：将日志消息发送到消息队列中，由专门的日志处理组件进行处理和存储。
- 分布式系统集成：在分布式系统中，通过消息队列进行数据共享和通信，提高系统的可靠性和弹性。

使用消息队列时需要**注意**以下几点：

- 队列长度：消息队列可能会变得非常长，需要定期清理过期消息。
- 消息格式：消息格式应该是可扩展的，以便在未来添加新的特性。
- 异常处理：需要考虑各种异常情况的处理，如网络故障、消息超时等。
- 安全性：消息队列中的数据可能会非常敏感，需要采取相应的安全措施来保护数据的安全性。



![image-20230410103721427](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101037512.png)



#### 基于List结构模拟消息队列

![image-20230410104626935](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101046008.png)



基于List的消息队列有哪些优缺点？
优点：

* 利用Redis存储，不受限于JVM内存上限
* 基于Redis的持久化机制，数据安全性有保证
* 可以满足消息有序性

缺点：

* 无法避免消息丢失(redis挂了)
* 只支持单消费者



#### 基于PubSub的消息队列

![image-20230410105536692](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101055781.png)



**消费者有消息缓冲区，正在处理的时候有点慢，此时消息队列又发送了消息，越来越多的消息来到消费者的缓冲区，就会造成消息堆积**

数据持久化只适用于存储数据的那几种数据类型，List可以，但是PubSub就是Redis专门用来做消息队列的，不会把里面的信息进行持久化



基于PubSub的消息队列有哪些优缺点？
优点：

* 采用发布订阅模型，支持多生产、多消费

缺点：

* 不支持数据持久化
* 无法避免消息丢失
* 消息堆积有上限，超出时数据丢失



#### 基于Stream的消息队列

##### 单消费模式

**是数据类型**

Stream 是 Redis 5.0 引入的一种新数据类型，可以实现一个功能非常完善的消息队列。

![image-20230410124445809](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101244918.png)



![image-20230410124941270](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101249384.png)



![image-20230410125302072](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101253157.png)



STREAM类型消息队列的XREAD命令特点：

* 消息可回溯
* 一个消息可以被多个消费者读取
* 可以阻塞读取
* 有消息漏读的风险



##### 消费者组模式

消费者组（Consumer Group）：将多个消费者划分到一个组中，监听同一个队列。具备下列特点：

![image-20230410125948592](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101259675.png)



![image-20230410130505230](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101305318.png)



![image-20230410130940594](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101309678.png)

获取消息后，消息会存在于一个pending-list中，处理完需要用xack来确定消息已被处理，把消息从pending-list里移除

操作如下，key：队列名称             group：组名称      id：确认哪一条消息

![image-20230410131630060](https://raw.githubusercontent.com/195sjin/myBed/master/images202304101316152.png)

处理一条消息的时候挂了，这条消息没有执行ack，该消息就会进入pending-list中，怎么去查看pending-list？

xpending可以查看

**处理消息流程**

在正常情况下，先利用 > 来获取所有未消费的消息，拿到之后我们去处理消息，处理完去确认，在确认的时候出现异常，这条消息进入pending-list中（在java中类似于出现异常，给它catch到）我们把那个 > 改成 0 （不是取未消费消息，而是取出现异常的消息），相当于就是处理的pending-list里的消息，拿出该消息，给它处理了，给它确认掉（pending-list清空），然后再改成 > 获取未消费消息

![image-20230410212209406](https://raw.githubusercontent.com/195sjin/myBed/master/images202304102122509.png)



![image-20230410212355791](https://raw.githubusercontent.com/195sjin/myBed/master/images202304102123850.png)

#### 总结

在stream中，只支持消费者的消息确认，不支持生产者的消息确认

![image-20230410212714694](https://raw.githubusercontent.com/195sjin/myBed/master/images202304102127768.png)



### 达人探店

![image-20230411173655797](https://raw.githubusercontent.com/195sjin/myBed/master/images202304111737929.png)

### 好友关注

对于传统的模式的内容解锁：我们是需要用户去通过搜索引擎或者是其他的方式去解锁想要看的内容

对于新型的Feed流的的效果：不需要我们用户再去推送信息，而是系统分析用户到底想要什么，然后直接把内容推送给用户，从而使用户能够更加的节约时间，不用主动去寻找。

![image-20230412083021465](https://raw.githubusercontent.com/195sjin/myBed/master/images202304121154595.png)

Feed流产品有两种常见模式：
Timeline：不做内容筛选，简单的按照内容发布时间排序，常用于好友或关注。例如朋友圈

* 优点：信息全面，不会有缺失。并且实现也相对简单
* 缺点：信息噪音较多，用户不一定感兴趣，内容获取效率低

智能排序：利用智能算法屏蔽掉违规的、用户不感兴趣的内容。推送用户感兴趣信息来吸引用户

* 优点：投喂用户感兴趣信息，用户粘度很高，容易沉迷
* 缺点：如果算法不精准，可能起到反作用



采用Timeline的模式。该模式的实现方案有三种：

* 拉模式
* 推模式
* 推拉结合



**拉模式**：也叫做读扩散

该模式的核心含义就是：当张三和李四和王五发了消息后，都会保存在自己的邮箱中，假设赵六要读取信息，那么他会从读取他自己的收件箱，此时系统会从他关注的人群中，把他关注人的信息全部都进行拉取，然后在进行排序

优点：比较节约空间，因为赵六在读信息时，并没有重复读取，而且读取完之后可以把他的收件箱进行清除。

缺点：比较延迟，当用户读取数据时才去关注的人里边去读取数据，假设用户关注了大量的用户，那么此时就会拉取海量的内容，对服务器压力巨大。

![image-20230412084005657](https://raw.githubusercontent.com/195sjin/myBed/master/images202304121154231.png)



**推模式**：也叫做写扩散。

推模式是没有写邮箱的，当张三写了一个内容，此时会主动的把张三写的内容发送到他的粉丝收件箱中去，假设此时李四再来读取，就不用再去临时拉取了

优点：时效快，不用临时拉取

缺点：内存压力大，假设一个大V写信息，很多人关注他， 就会写很多分数据到粉丝那边去

![image-20230412084252858](https://raw.githubusercontent.com/195sjin/myBed/master/images202304121155753.png)

**推拉结合模式**：也叫做读写混合，兼具推和拉两种模式的优点。

推拉模式是一个折中的方案，站在发件人这一段，如果是个普通的人，那么我们采用写扩散的方式，直接把数据写入到他的粉丝中去，因为普通的人他的粉丝关注量比较小，所以这样做没有压力，如果是大V，那么他是直接将数据先写入到一份到发件箱里边去，然后再直接写一份到活跃粉丝收件箱里边去，现在站在收件人这端来看，如果是活跃粉丝，那么大V和普通的人发的都会直接写入到自己收件箱里边来，而如果是普通的粉丝，由于他们上线不是很频繁，所以等他们上线时，再从发件箱里边去拉信息。

![image-20230412115638539](https://raw.githubusercontent.com/195sjin/myBed/master/images202304121156637.png)

![image-20230412115654299](https://raw.githubusercontent.com/195sjin/myBed/master/images202304121156365.png)

#### 问题

![image-20230412120524490](https://raw.githubusercontent.com/195sjin/myBed/master/images202304121205574.png)

#### 滚动分页

我们需要记录每次操作的最后一条，然后从这个位置开始去读取数据

我们这个地方可以采用sortedSet来做，可以进行范围查询，并且还可以记录当前获取数据时间戳最小值，就可以实现滚动分页了

![image-20230412120701105](https://raw.githubusercontent.com/195sjin/myBed/master/images202304121207186.png)

滚动分页四个参数

最大值 分数的最大值、分数的最小值（固定不变，为0）、偏移量、查的数量（固定值）

最大值为上一次查询的分数的最小值，第一次没有最大值，给时间戳最大值（当前时间）就行

偏移量，第一次给0（没有偏移量），其他情况下，在上一次的结果中，与最小值一样的元素的个数为几，它就为几



### 附近商铺

#### GEO数据结构

GEO就是Geolocation的简写形式，代表地理坐标。Redis在3.2版本中加入了对GEO的支持，允许存储地理坐标信息，帮助我们根据经纬度来检索数据。常见的命令有：

* GEOADD：添加一个地理空间信息，包含：经度（longitude）、纬度（latitude）、值（member）
* GEODIST：计算指定的两个点之间的距离并返回
* GEOHASH：将指定member的坐标转为hash字符串形式并返回
* GEOPOS：返回指定member的坐标
* GEORADIUS：指定圆心、半径，找到该圆内包含的所有member，并按照与圆心之间的距离排序后返回。6.2以后已废弃
* GEOSEARCH：在指定范围内搜索member，并按照与指定点之间的距离排序后返回。范围可以是圆形或矩形。6.2.新功能
* GEOSEARCHSTORE：与GEOSEARCH功能一致，不过可以把结果存储到一个指定的key。 6.2.新功能



**注意：SpringDataRedis的2.3.9版本并不支持Redis6.2提供的GEOSEARCH命令，因此我们需要修改版本**



### 用户签到

#### BitMap

![image-20230412203513170](https://raw.githubusercontent.com/195sjin/myBed/master/images202304122035265.png)

咱们准备一张小小的卡片，你只要签到就打上一个勾，我最后判断你是否签到，其实只需要到小卡片上看一看就知道了

我们可以采用类似这样的方案来实现我们的签到需求。

![image-20230412203824447](https://raw.githubusercontent.com/195sjin/myBed/master/images202304122038514.png)



Redis中是利用string类型数据结构实现BitMap，因此最大上限是512M，转换为bit则是 2^32个bit位。

BitMap的操作命令有：

* SETBIT：向指定位置（offset）存入一个0或1
* GETBIT ：获取指定位置（offset）的bit值
* BITCOUNT ：统计BitMap中值为1的bit位的数量
* BITFIELD ：操作（查询、修改、自增）BitMap中bit数组中的指定位置（offset）的值
* BITFIELD_RO ：获取BitMap中bit数组，并以十进制形式返回
* BITOP ：将多个BitMap的结果做位运算（与 、或、异或）
* BITPOS ：查找bit数组中指定范围内第一个0或1出现的位置



#### 统计连续签到

![image-20230412212504731](https://raw.githubusercontent.com/195sjin/myBed/master/images202304122125835.png)

bitMap返回的数据是10进制，哪假如说返回一个数字8，那么我哪儿知道到底哪些是0，哪些是1呢？我们只需要让得到的10进制数字和1做与运算就可以了，因为1只有遇见1 才是1，其他数字都是0 ，我们把签到结果和1进行与操作，每与一次，就把签到结果向右移动一位，依次内推，我们就能完成逐个遍历的效果了

![image-20230412212934675](https://raw.githubusercontent.com/195sjin/myBed/master/images202304122129766.png)



### UV统计

#### HyperLogLog

相当于概率统计



![image-20230412214243844](https://raw.githubusercontent.com/195sjin/myBed/master/images202304122142915.png)



**插入元素唯一**

![image-20230412214341710](https://raw.githubusercontent.com/195sjin/myBed/master/images202304122143822.png)



## 分布式缓存

redis集群，解决redis单节点问题

### 单节点问题

1 **数据丢失问题**，redis是内存存储，服务重启可能会丢失数据

2 **并发能力问题** ，单节点redis并发虽然不错，但是无法满足618这个样的高并发场景

3 **故障恢复问题**，如果redis宕机，则服务不可用，需要一种自动的故障恢复手段

4 **存储能力问题**，基于内存，单节点能存储的数据量难以满足海量数据需求

![image-20230413103148717](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131031844.png)

### Redis持久化

#### RDB持久化

**保存相当于Linux里面的快照，RDB默认就是开启的**

**RDB记录的是内容的值**

![image-20230413103622134](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131036228.png)

save命令会导致主进程执行RDB，这个过程中其它所有命令都会被阻塞。只有在数据迁移时可能用到。

**时间太长，没来得及保存，数据丢失；时间太短，要保存的数据太多，会忙不过来**



![image-20230413104120740](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131041823.png)



##### 原理

是开一个子进程来进行RDB，但是子进程是fork主进程来的，fork的过程是阻塞的，此时主进程只能干这件事，不能接受用户请求，因此必须加快fork速度，才能让主进程尽快去处理用户请求，避免阻塞时间过久

**fork底层**

主进程操作虚拟内存，虚拟内存基于页表的映射关系到物理内存

![image-20230413110232850](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131102934.png)



子进程在写RDB的时候，主进程可以接受用户的请求，来去修改内存中的数据

主进程在修改数据，子进程在读数据，就会冲突

copy-on-write：当我要写的时候，去做一次拷贝，对拷贝的数据进行写操作，读操作（但是拷贝数据，会造成**内存的翻倍**）

把共享数据标记为read-only 只读模式

redis一般都会预留一些空间（将来做RDB内存可能不够，内存溢出）



![image-20230413110907577](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131109683.png)



##### 总结

![image-20230413111144123](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131111187.png)



#### AOF持久化

append only file（追加文件）

**AOF记录的是命令**（操作）

提高数据的安全性，弥补RDB的缺陷

把Redis接收到的所有的写的命令记到一个文件中，该文件就叫做AOF文件，**默认是关闭的**

![image-20230413111647907](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131116990.png)



第一种：当Redis接收到一个命令时，立即把数据写到内存，同时把命令写入AOF文件，这个操作都是由主进程完成（接收到命令，先操作内存，再写入磁盘，必须一起完成），数据安全性好，但是性能最差

第二种：不会把命令立即写入磁盘，先处理完内存，放入缓冲区，每隔一秒把缓冲区数据写到AOF文件，完成一次磁盘的写，性能更好，但是可能会丢失1秒钟内的数据操作

第三种：主进程只负责处理内存数据，放入缓冲区，由操作系统决定何时把缓冲区数据写入磁盘，写磁盘的频率低，效率就高，性能最好，安全性最差



**一般都是会用第二种**

![image-20230413112902901](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131129003.png)



AOF文件会记录每一次的命令 包括每次对相同数据的更改（对num操作n次就会记录n次）

**AOF文件会比RDB文件大很多**



![image-20230413114508316](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131145427.png)



#### 两者对比

![image-20230413114544711](https://raw.githubusercontent.com/195sjin/myBed/master/images202304131145811.png)



### Redis主从

**解决并发能力问题**

#### 主从集群

为什么要主从？因为redis大多数都是读多写少的操作，可以通过读写分离

必须要保证不管到哪个读结点，都会拿到相同的结果------把master上面的数据同步到从节点

![image-20230414074932990](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140749136.png)



![image-20230414080618568](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140806613.png)

要配置主从可以使用replicaof 或者slaveof（5.0以前）命令。

有临时和永久两种模式：

- 修改配置文件（永久生效）

  - 在redis.conf中添加一行配置：```slaveof <masterip> <masterport>```

- 使用redis-cli客户端连接到redis服务，执行slaveof命令（重启后失效）：

  ```sh
  slaveof <masterip> <masterport>
  ```

<strong><font color='red'>注意</font></strong>：在5.0以后新增命令replicaof，与salveof效果一致。



#### 数据同步原理

##### 全量同步

主从第一次建立连接时，会执行**全量同步**，将master节点的所有数据都拷贝给slave节点

有一个RDB过程，把内存形成快照，整体发给从节点------全量同步；比较消耗性能（生成RDB文件比较慢）

![image-20230414081433905](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140814996.png)



![image-20230414082109114](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140821203.png)

因为slave原本也是一个master，有自己的replid和offset，当第一次变成slave，与master建立连接时，发送的replid和offset是自己的replid和offset。

master判断发现slave发送来的replid与自己的不一致，说明这是一个全新的slave，就知道要做全量同步了。

master会将自己的replid和offset都发送给这个slave，slave保存这些信息。以后slave的replid就与master一致了。

因此，**master判断一个节点是否是第一次同步的依据，就是看replid是否一致**。

![image-20230414082223993](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140822080.png)



完整流程描述：

- slave节点请求增量同步
- master节点判断replid，发现不一致，拒绝增量同步
- master将完整内存数据生成RDB，发送RDB到slave
- slave清空本地数据，加载master的RDB
- master将RDB期间的命令记录在repl_baklog，并持续将log中的命令发送给slave
- slave执行接收到的命令，保持与master之间的同步



##### 增量同步

全量同步需要先做RDB，然后将RDB文件通过网络传输个slave，成本太高了。因此除了第一次做全量同步，其它大多数时候slave与master都是做**增量同步**。

什么是增量同步？就是只更新slave与master存在差异的部分数据。



repl-baklog本质是一个数组，大小固定，当数据记满了，就会从头开始覆盖之前的数据（环形记录方式）

repl-baklog是主从数据差异的缓冲区，只要主从之间的差异不超过环的上限，永远能从环里找到想要的数据

![image-20230414084254051](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140842152.png)

避免不了上述问题，只能减小概率



##### 优化

**提高全量同步的性能**

无磁盘复制：写RDB文件时，不写到磁盘的IO流，而是写到网络，直接发给slave；减少磁盘读写，性能提高（使用场景：磁盘慢，网络快）

控制单节点的内存上限，上限比较小，RDB传输的数据量也比较小，减少IO，性能会提升

**应该尽可能减少全量同步**

从节点太多，都来找主节点做数据同步，就会给主节点造成太大压力

![image-20230414085316378](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140853491.png)



##### 总结

![image-20230414085446700](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140854766.png)



### Redis哨兵

slave结点宕机，它会自动找到master结点，完成数据同步

但是master结点挂了。。。。就需要哨兵了

在master宕机和重启恢复这一段时间，用户无法执行写操作，集群可用性下降

监控集群中结点的状态，发现master宕机那一刻选一个新的slave当master，挂掉的master等它起来了让它当slave就行了

#### 哨兵的作用和原理

![image-20230414090807344](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140908472.png)



![image-20230414091049302](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140910412.png)



![image-20230414091345438](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140913511.png)



![image-20230414091603777](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140916877.png)



![image-20230414091728193](https://raw.githubusercontent.com/195sjin/myBed/master/images202304140917255.png)



#### RedisTemplate的哨兵模式

在Sentinel集群监管下的Redis主从集群，其节点会因为自动故障转移而发生变化，Redis的客户端必须感知这种变化，及时更新连接信息。Spring的RedisTemplate底层利用了lettuce实现了节点的感知和自动切换

![image-20230414120638797](https://raw.githubusercontent.com/195sjin/myBed/master/images202304141206941.png)



![image-20230414120722417](https://raw.githubusercontent.com/195sjin/myBed/master/images202304141207499.png)



### Redis分片集群

提高主从同步的性能，单节点内存设置不要太高，做RDB会导致大量的IO性能会下降

内存降低了，但是**要存的数据太多**，怎么办；应对了高并发读的问题，**写的并发也很高**，怎么办---------Redis的**分片集群**

![image-20230414121732719](https://raw.githubusercontent.com/195sjin/myBed/master/images202304141217818.png)



我们需要执行命令来创建集群，在Redis5.0之前创建集群比较麻烦，5.0之后集群管理命令都集成到了redis-cli中。

1）Redis5.0之前

Redis5.0之前集群命令都是用redis安装包下的src/redis-trib.rb来实现的。因为redis-trib.rb是有ruby语言编写的所以需要安装ruby环境。

 ```sh
# 安装依赖
yum -y install zlib ruby rubygems
gem install redis
 ```

然后通过命令来管理集群：

```sh
# 进入redis的src目录
cd /tmp/redis-6.2.4/src
# 创建集群
./redis-trib.rb create --replicas 1 192.168.150.101:7001 192.168.150.101:7002 192.168.150.101:7003 192.168.150.101:8001 192.168.150.101:8002 192.168.150.101:8003
```



2）Redis5.0以后

我们使用的是Redis6.2.4版本，集群管理以及集成到了redis-cli中，格式如下：

```sh
redis-cli --cluster create --cluster-replicas 1 192.168.150.101:7001 192.168.150.101:7002 192.168.150.101:7003 192.168.150.101:8001 192.168.150.101:8002 192.168.150.101:8003
```

命令说明：

- `redis-cli --cluster`或者`./redis-trib.rb`：代表集群操作命令
- `create`：代表是创建集群
- `--replicas 1`或者`--cluster-replicas 1` ：指定集群中每个master的副本个数为1，此时`节点总数 ÷ (replicas + 1)` 得到的就是master的数量。因此节点列表中的前n个就是master，其它节点都是slave节点，随机分配到不同master

通过命令可以查看集群状态：

```sh
redis-cli -p 7001 cluster nodes
```

集群操作时，需要给`redis-cli`加上`-c`参数才可以：

```
redis-cli -c -p 7001
```



#### 散列插槽

每一个master结点上都有一个散列插槽（hash slot）

为什么要做插槽

要存储数据，但是该数据要存到哪一个master？假设存到随便一个master，你下次取的时候，怎么知道在该master？

**数据key不是跟节点绑定的，而是跟插槽绑定的**

![image-20230414132342738](https://raw.githubusercontent.com/195sjin/myBed/master/images202304141323896.png)

如图，在7001这个节点执行set a 1时，对a做hash运算，对16384取余，得到的结果是15495，因此要存储到103节点。

到了7003后，执行`get num`时，对num做hash运算，对16384取余，得到的结果是2765，因此需要切换到7001节点

![image-20230414132646747](https://raw.githubusercontent.com/195sjin/myBed/master/images202304141326813.png)

#### 集群伸缩

能动态增加和删除结点

![image-20230414132814787](https://raw.githubusercontent.com/195sjin/myBed/master/images202304141328890.png)

执行命令：

```
redis-cli --cluster add-node  192.168.150.101:7004 192.168.150.101:7001
```



#### 故障转移

**自动故障转移**

当集群中有一个master宕机会发生什么呢？

直接停止一个redis实例，例如7002：

```sh
redis-cli -p 7002 shutdown
```

![image-20230424115329664](https://raw.githubusercontent.com/195sjin/myBed/master/images202304241153769.png)



#### **手动故障转移**

master机器老旧，需要维护，可以去启动一个新节点，让新节点替换旧节点

![image-20230414134535756](https://raw.githubusercontent.com/195sjin/myBed/master/images202304141345856.png)



#### RedisTemplate访问分片集群

![image-20230414134816027](https://raw.githubusercontent.com/195sjin/myBed/master/images202304141348106.png)



## 多级缓存

缓存的作用：减轻数据库的压力，缩短响应的时间，从而提高服务的并发能力

多级缓存：应对亿级流量的缓存方案

![image-20230415090430361](https://raw.githubusercontent.com/195sjin/myBed/master/images202304150904449.png)

**多级缓存**就是充分利用请求处理的每个环节，分别添加缓存，减轻Tomcat压力，提升服务性能：

- 浏览器访问静态资源时，优先读取浏览器本地缓存
- 访问非静态资源（ajax查询数据）时，访问服务端
- 请求到达Nginx后，优先读取Nginx本地缓存
- 如果Nginx本地缓存未命中，则去直接查询Redis（不经过Tomcat）
- 如果Redis查询未命中，则查询Tomcat
- 请求进入Tomcat后，优先查询JVM进程缓存
- 如果JVM进程缓存未命中，则查询数据库



在多级缓存架构中，Nginx内部需要编写本地缓存查询、Redis查询、Tomcat查询的业务逻辑，因此这样的nginx服务不再是一个**反向代理服务器**，而是一个编写**业务的Web服务器了**。



![image-20230415090627228](https://raw.githubusercontent.com/195sjin/myBed/master/images202304150906329.png)

可见，多级缓存的关键有两个：

- 一个是在nginx中编写业务，实现nginx本地缓存、Redis、Tomcat的查询

- 另一个就是在Tomcat中实现JVM进程缓存

其中Nginx编程则会用到OpenResty框架结合Lua这样的语言。





### JVM进程缓存

在Tomcat内部添加进程缓存

#### Caffeine

进程本地缓存是当Redis缓存的补充来使用，当Redis缓存未命中再去看进程本地缓存；两者结合使用



缓存在日常开发中启动至关重要的作用，由于是存储在内存中，数据的读取速度是非常快的，能大量减少对数据库的访问，减少数据库的压力。我们把缓存分为两类：

- 分布式缓存，例如Redis：
  - 优点：存储容量更大、可靠性更好、可以在集群间共享
  - 缺点：访问缓存有网络开销
  - 场景：缓存数据量较大、可靠性要求较高、需要在集群间共享
- 进程本地缓存，例如HashMap、GuavaCache：
  - 优点：读取本地内存，没有网络开销，速度更快
  - 缺点：存储容量有限、可靠性较低、无法共享
  - 场景：性能要求较高，缓存数据量较小

会利用Caffeine框架来实现JVM进程缓存。



![image-20230415093553969](https://raw.githubusercontent.com/195sjin/myBed/master/images202304150935061.png)

##### Caffeine示例

![image-20230415093648767](https://raw.githubusercontent.com/195sjin/myBed/master/images202304150936850.png)



直接调用get方法（第二种）第一个参数传一个key，根据key去缓存取，如果缓存未命中需要查数据库，需要第二个参数，是一个函数，里面写的是查询数据库的业务逻辑，把数据库的结果返回

总的来说就是，先根据key去查缓存，缓存未命中就去数据库查，把结果给我，之后把结果存入缓存，并且把结果返回给用户



![image-20230415094345760](https://raw.githubusercontent.com/195sjin/myBed/master/images202304150943854.png)



驱逐需要时间，程序运行完直接JVM退出，还没机会驱逐，稍微休眠一下（给他一定空闲时间）就会被清除



### Lua语法

Nginx编程需要用到Lua语言

![image-20230415100805380](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151008472.png)

**经常被用于游戏里面，centos里面自带了lua**

![image-20230415100858137](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151008275.png)

Lua经常嵌入到C语言开发的程序中，例如游戏开发、游戏插件等。

Nginx本身也是C语言开发，因此也允许基于Lua做拓展。

#### Lua快速入门



![image-20230415101331406](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151013480.png)



#### 变量和循环

![image-20230415101939799](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151019913.png)



字符串拼接是用 .. 拼接

![image-20230415102316367](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151023470.png)



![image-20230415102721190](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151027276.png)



#### 条件控制、函数

![image-20230415103058225](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151030349.png)



![image-20230415103413887](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151034024.png)



### 多级缓存

#### OpenResty

OpenResty

![image-20230415141512179](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151415273.png)

##### 入门

![image-20230415142639566](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151426658.png)



![image-20230415142814012](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151428097.png)

这个监听，就类似于SpringMVC中的`@GetMapping("/api/item")`做路径映射。

而`content_by_lua_file lua/item.lua`则相当于调用item.lua这个文件，执行其中的业务，把结果返回给用户。相当于java中调用service

![image-20230415143213780](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151432881.png)



##### 获取参数

![image-20230415143625720](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151436848.png)

~ 代表后面是正则表达式 

() 是对正则表达式进行分组  

\ 是转义字符（\d代表是数字）

+代表至少一个字符

![image-20230415144332407](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151443504.png)

![image-20230415144726785](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151447835.png)

#### 查询Tomcat

**Linux访问Windows细节**

IP前三位，把最后一位替换成1，一定得到的就是Windows电脑的地址，前提是防火墙需要关闭

![image-20230415145140624](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151451719.png)



![image-20230415145542070](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151455182.png)



##### 封装http查询的函数

**lualib目录默认就会被OpenResty读取，common.lua默认就被加载到OpenResty的函数库里**

![image-20230415145905708](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151459788.png)



##### 向Tomcat发送http请求

![image-20230415152016433](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151520523.png)



![image-20230415151937579](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151519690.png)



![image-20230415151644575](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151516682.png)



##### Tomcat集群的负载均衡

进程缓存不是共享的，于是同一个id的商品，永远指向同一台服务器，这样保证缓存永远命中，这样JVM进程缓存才有意义

但是我们是采用轮询的方式，不能保证，于是我们需要修改负载均衡的算法

如果能让同一个商品，每次查询时都访问同一个tomcat服务，那么JVM缓存就一定能生效了。

也就是说，我们需要根据商品id做负载均衡，而不是轮询。

nginx提供了基于请求路径做负载均衡的算法：

nginx根据请求路径做hash运算，把得到的数值对tomcat服务的数量取余，余数是几，就访问第几个服务，实现负载均衡。

例如：

- 我们的请求路径是 /item/10001
- tomcat总数为2台（8081、8082）
- 对请求路径/item/1001做hash运算求余的结果为1
- 则访问第一个tomcat服务，也就是8081

只要id不变，每次hash运算结果也不会变，那就可以保证同一个商品，一直访问同一个tomcat服务，确保JVM缓存生效。

![image-20230415153034059](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151530199.png)



#### Redis缓存预热

![image-20230415155337215](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151553325.png)

Redis缓存会面临冷启动问题：

**冷启动**：服务刚刚启动时，Redis中并没有缓存，如果所有商品数据都在第一次查询时添加缓存，可能会给数据库带来较大压力。

**缓存预热**：在实际开发中，我们可以利用大数据统计用户访问的热点数据，在项目启动时将这些热点数据提前查询并保存到Redis中



![image-20230415154010367](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151540477.png)

这个方法会在Bean创建完，Autowired注入成功以后执行，可以在项目启动的时候执行

ObjectMapper是Spring里面默认的JSON处理的类，做JSON序列化使用writeValueAsString来处理

![image-20230415154758228](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151547607.png)



#### 查询Redis

当请求进入OpenResty之后：

- 优先查询Redis缓存
- 如果Redis缓存未命中，再查询Tomcat

![image-20230415155414828](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151554946.png)

![image-20230415155757861](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151557965.png)



![image-20230415160246591](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151602848.png)



#### Nginx本地缓存

![image-20230415161008275](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151610382.png)



![image-20230415161235648](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151612918.png)



![image-20230415161449714](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151614795.png)

![image-20230415162341318](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151623411.png)



### 缓存同步

大多数情况下，浏览器查询到的都是缓存数据，如果缓存数据与数据库数据存在较大差异，可能会产生比较严重的后果。

所以我们必须保证数据库数据、缓存数据的一致性，这就是缓存与数据库的同步。

#### 缓存同步策略

缓存数据同步的常见方式有三种：

**设置有效期**：给缓存设置有效期，到期后自动删除。再次查询时更新

- 优势：简单、方便
- 缺点：时效性差，缓存过期之前可能不一致
- 场景：更新频率较低，时效性要求低的业务

**同步双写**：在修改数据库的同时，直接修改缓存

- 优势：时效性强，缓存与数据库强一致
- 缺点：有代码侵入，耦合度高；
- 场景：对一致性、时效性要求较高的缓存数据

**异步通知：**修改数据库时发送事件通知，相关服务监听到通知后修改缓存数据

- 优势：低耦合，可以同时通知多个缓存服务
- 缺点：时效性一般，可能存在中间不一致状态
- 场景：时效性要求一般，有多个服务需要同步



异步实现又可以基于MQ或者Canal来实现：

![image-20230415170908279](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151709392.png)



![image-20230415170935087](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151709192.png)



#### Canal

![image-20230415171249301](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151712424.png)



![image-20230415171330856](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151713951.png)



![image-20230415172358315](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151723454.png)



![image-20230415172416386](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151724511.png)



![image-20230415172816002](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151728105.png)

**实现数据库数据与实体类中数据的转换**

![image-20230415172933037](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151729163.png)

通过实现`EntryHandler<T>`接口编写监听器，监听Canal消息。注意两点：

- 实现类通过`@CanalTable("tb_item")`指定监听的表信息
- EntryHandler的泛型是与表对应的实体类

```
@CanalTable("tb_item")
@Component
public class ItemHandler implements EntryHandler<Item> {

    @Autowired
    private RedisHandler redisHandler;
    @Autowired
    private Cache<Long, Item> itemCache;

    @Override
    public void insert(Item item) {
        // 写数据到JVM进程缓存
        itemCache.put(item.getId(), item);
        // 写数据到redis
        redisHandler.saveItem(item);
    }

    @Override
    public void update(Item before, Item after) {
        // 写数据到JVM进程缓存
        itemCache.put(after.getId(), after);
        // 写数据到redis
        redisHandler.saveItem(after);
    }

    @Override
    public void delete(Item item) {
        // 删除数据到JVM进程缓存
        itemCache.invalidate(item.getId());
        // 删除数据到redis
        redisHandler.deleteItemById(item.getId());
    }
}
```



### 总结

![image-20230415174243390](https://raw.githubusercontent.com/195sjin/myBed/master/images202304151742532.png)

## Redis最佳实践

### Redis键值设计

#### 优雅的key结构

key的长度越小，key占用的空间就越小

![image-20230416111456963](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161115124.png)

当字节数大于44字节时，会转为raw模式存储，在raw模式下，内存空间不是连续的，而是采用一个指针指向了另外一段内存空间，在这段空间里存储SDS内容，这样空间不连续，访问的时候性能也就会收到影响，还有可能产生内存碎片

#### BigKey

BigKey通常以Key的大小和Key中成员的数量来综合判定，例如：

- Key本身的数据量过大：一个String类型的Key，它的值为5 MB
- Key中的成员数过多：一个ZSET类型的Key，它的成员数量为10,000个
- Key中成员的数据量过大：一个Hash类型的Key，它的成员数量虽然只有1,000个但这些成员的Value（值）总大小为100 MB



推荐值：

- 单个key的value小于10KB
- 对于集合类型的key，建议元素数量小于1000



![image-20230424140022215](https://raw.githubusercontent.com/195sjin/myBed/master/images202304241400281.png)

##### 危害

- 网络阻塞
  - 对BigKey执行读请求时，少量的QPS就可能导致带宽使用率被占满，导致Redis实例，乃至所在物理机变慢
- 数据倾斜
  - BigKey所在的Redis实例内存使用率远超其他实例，无法使数据分片的内存资源达到均衡
- Redis阻塞
  - 对元素较多的hash、list、zset等做运算会耗时较旧，使主线程被阻塞
- CPU压力
  - 对BigKey的数据序列化和反序列化会导致CPU的使用率飙升，影响Redis实例和本机其它应用



![image-20230416114852561](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161148648.png)

命令：`redis-cli -a 密码 --bigkeys`



![image-20230416120452686](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161204777.png)



#### 合适的数据类型

光是删除BigKey是不够的，我们需要找到它产生的原因

![image-20230416121028775](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161210866.png)



**一组field、value的键值对就叫做一个entry**

![image-20230416121522832](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161215947.png)



![image-20230416121730783](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161217899.png)



![image-20230416122131250](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161221394.png)



#### 总结

![image-20230416122438063](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161224129.png)

### 批处理优化

![image-20230416133905713](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161339800.png)

![image-20230416133941518](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161339602.png)

**执行命令的时间很短，所以大量的时间都浪费在了网络传输上了**



![image-20230416134236400](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161342484.png)



#### Pipeline和mset

大数据量的导入

这些命令都有局限性

**mset只能处理String类型的数据**

**hmset只能处理hash，而且key是不能变的，变的是filed**

**sadd也是key不能变，只能处理set集合**

![image-20230416134741164](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161347258.png)



**管道方案** 把很多的命令塞到管道里，一次性传过去

**能传任意命令**

![image-20230416135412533](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161354621.png)



m操作为什么比Pipeline要快？

m操作是redis内部的操作，多组key和value会做一个原子性的操作（一次性全执行完，中间不会有其他命令来插队）

Pipeline在执行的时候，一组命令是一起发到redis，命令是不是一起执行就不一定了（命令传输是有先后的，在传输给redis过程中，其他客户端也会有命令，到达redis是有先后顺序的，到达redis后会进入一个队列，排队，redis线程依次执行命令）

##### 总结

![image-20230416140500554](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161405617.png)



#### 集群下的批处理

**为什么必须在同一个插槽里？**

插槽分配到不同的redis节点，set任意一个key时，会根据key计算在哪个插槽值，放到对应的节点里面

批处理时一次带了上千条命令，计算出来的插槽值可能不一样，保存到不同的节点上，批处理是在一次连接把所有命令全干掉，但是现在要保存到不同的节点上，就需要建立不同的连接，就不是批处理了，就会报错

![image-20230416142154978](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161421087.png)

第一种方案：串行执行，所以这种方式没有什么意义，当然，执行起来就很简单了，缺点就是耗时过久。

第二种方案：串行slot，简单来说，就是执行前，客户端先计算一下对应的key的slot，一样slot的key就放到一个组里边，不同的，就放到不同的组里边，然后对每个组执行pipeline的批处理，他就能串行执行各个组的命令，这种做法比第一种方法耗时要少，但是缺点呢，相对来说复杂一点，所以这种方案还需要优化一下

第三种方案：并行slot，相较于第二种方案，在分组完成后串行执行，第三种方案，就变成了并行执行各个命令，所以他的耗时就非常短，但是实现呢，也更加复杂。

第四种：hash_tag，redis计算key的slot的时候，其实是根据key的有效部分来计算的，通过这种方式就能一次处理所有的key，这种方式耗时最短，实现也简单，但是如果通过操作key的有效部分，那么就会导致所有的key都落在一个节点上，产生数据倾斜的问题，所以我们推荐使用第三种方式。





**spring实现集群批处理**

![image-20230416142736987](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161427102.png)



### 服务端优化

#### 持久化配置

持久化跟当前服务器也有关系，不管是RDB还是AOF对于CPU和内存和磁盘都有较高的占用



Redis的持久化虽然可以保证数据安全，但也会带来很多额外的开销，因此持久化请遵循下列建议：

* 用来做缓存的Redis实例尽量不要开启持久化功能
* 建议关闭RDB持久化功能，使用AOF持久化
* 利用脚本定期在slave节点做RDB，实现数据备份
* 设置合理的rewrite阈值，避免频繁的bgrewrite
* 配置no-appendfsync-on-rewrite = yes，禁止在rewrite期间做aof，避免因AOF引起的阻塞
* 部署有关建议：
  * Redis实例的物理机要预留足够内存，应对fork和rewrite
  * 单个Redis实例内存上限不要太大，例如4G或8G。可以加快fork的速度、减少主从同步、数据迁移压力
  * 不要与CPU密集型应用部署在一起
  * 不要与高硬盘负载应用一起部署。例如：数据库、消息队列





![image-20230416143822152](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161438261.png)



#### 慢查询问题

慢查询的危害：由于Redis是单线程的，所以当客户端发出指令后，他们都会进入到redis底层的queue来执行，如果此时有一些慢查询的数据，就会导致大量请求阻塞，从而引起报错，所以我们需要解决慢查询问题。

![image-20230416145019666](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161450752.png)



![image-20230416145233675](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161452788.png)



![image-20230416145741092](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161457188.png)



#### 命令及安全配置

为什么会出现不需要密码也能够登录呢，主要是Redis考虑到每次登录都比较麻烦，所以Redis就有一种ssh免秘钥登录的方式，生成一对公钥和私钥，私钥放在本地，公钥放在redis端，当我们登录时服务器，再登录时候，他会去解析公钥和私钥，如果没有问题，则不需要利用redis的登录也能访问，这种做法本身也很常见，但是这里有一个前提，前提就是公钥必须保存在服务器上，才行，但是Redis的漏洞在于在不登录的情况下，也能把秘钥送到Linux服务器，从而产生漏洞



Redis会绑定在0.0.0.0:6379，这样将会将Redis服务暴露到公网上，而Redis如果没有做身份认证，会出现严重的安全漏洞.
漏洞重现方式：https://cloud.tencent.com/developer/article/1039000



漏洞出现的核心的原因有以下几点：

* Redis未设置密码
* 利用了Redis的config set命令动态修改Redis配置
* 使用了Root账号权限启动Redis

所以：如何解决呢？我们可以采用如下几种方案

为了避免这样的漏洞，这里给出一些建议：

* Redis一定要设置密码
* 禁止线上使用下面命令：keys、flushall、flushdb、config set等命令。可以利用rename-command禁用。
* bind：限制网卡，禁止外网网卡访问
* 开启防火墙
* 不要使用Root账户启动Redis
* 尽量不是有默认的端口



#### 内存安全和配置

**有关碎片问题分析**

Redis底层分配并不是这个key有多大，他就会分配多大，而是有他自己的分配策略，比如8,16,20等等，假定当前key只需要10个字节，此时分配8肯定不够，那么他就会分配16个字节，多出来的6个字节就不能被使用，这就是我们常说的 碎片问题

**进程内存问题分析：**

这片内存，通常我们都可以忽略不计

**缓冲区内存问题分析：**

一般包括客户端缓冲区、AOF缓冲区、复制缓冲区等。客户端缓冲区又包括输入缓冲区和输出缓冲区两种。这部分内存占用波动较大，所以这片内存也是我们需要重点分析的内存问题。

![image-20230416151835162](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161518257.png)



info memory：查看内存分配的情况

memory xxx：查看key的主要占用情况

![image-20230416151936216](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161519374.png)



**尽可能避免出现BigKey，适当增加redis物理机的带宽**

![image-20230416153212838](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161532956.png)

以上复制缓冲区和AOF缓冲区 不会有问题，最关键就是客户端缓冲区的问题

客户端缓冲区：指的就是我们发送命令时，客户端用来缓存命令的一个缓冲区，也就是我们向redis输入数据的输入端缓冲区和redis向客户端返回数据的响应缓存区，输入缓冲区最大1G且不能设置，所以这一块我们根本不用担心，如果超过了这个空间，redis会直接断开，因为本来此时此刻就代表着redis处理不过来了，我们需要担心的就是输出端缓冲区



我们在使用redis过程中，处理大量的big value，那么会导致我们的输出结果过多，如果输出缓存区过大，会导致redis直接断开，而默认配置的情况下， 其实他是没有大小的，这就比较坑了，内存可能一下子被占满，会直接导致咱们的redis断开，所以解决方案有两个

1、设置一个大小

2、增加我们带宽的大小，避免我们出现大量数据从而直接超过了redis的承受能力

### 集群最佳实践

集群虽然具备高可用特性，能实现自动故障恢复，但是如果使用不当，也会存在一些问题：

* 集群完整性问题
* 集群带宽问题
* 数据倾斜问题
* 客户端性能问题
* 命令的集群兼容性问题
* lua和事务问题



![image-20230416153924829](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161539967.png)

我们在开发中，其实最重要的是可用性，所以需要把如下配置修改成no，即有slot不能使用时，我们的redis集群还是可以对外提供服务



**集群带宽问题**

集群节点之间会不断的互相Ping来确定集群中其它节点的状态。每次Ping携带的信息至少包括：

* 插槽信息
* 集群状态信息

集群中节点越多，集群状态信息数据量也越大，10个节点的相关信息可能达到1kb，此时每次集群互通需要的带宽会非常高，这样会导致集群中大量的带宽都会被ping信息所占用，这是一个非常可怕的问题，所以我们需要去解决这样的问题

**解决途径：**

* 避免大集群，集群节点数不要太多，最好少于1000，如果业务庞大，则建立多个集群。
* 避免在单个物理机中运行太多Redis实例
* 配置合适的cluster-node-timeout值



**那我们到底是集群还是主从**

![image-20230416155145232](https://raw.githubusercontent.com/195sjin/myBed/master/images202304161551298.png)



**命令的集群兼容性问题**

当我们使用批处理的命令时，redis要求我们的key必须落在相同的slot上，然后大量的key同时操作时，是无法完成的，所以客户端必须要对这样的数据进行处理，这些方案我们之前已经探讨过了，所以不再这个地方赘述了。



**lua和事务的问题**

lua和事务都是要保证原子性问题，如果你的key不在一个节点，那么是无法保证lua的执行和事务的特性的，所以在集群模式是没有办法执行lua和事务的







## Redis原理

### 数据结构

前六个是redis底层的数据结构

#### 动态字符串SDS

保存单个字符串

String类型的键值都是字符串，List是列表，里面存的也都是一个一个字符串

\0是结束标识

![image-20230417171446386](https://raw.githubusercontent.com/195sjin/myBed/master/images202304171714544.png)



buf是数据体，前三个是描述sds的

![image-20230417172616673](https://raw.githubusercontent.com/195sjin/myBed/master/images202304171726781.png)

为什么叫预分配

因为实际上使用的内存数量比真正申请的内存数量小（也就是多申请一些）

为什么进行预分配

内存分配的性能消耗问题，linux分为用户空间和内存空间，申请内存时，用户空间无法直接操作硬件，申请内存去跟linux的内核进行交互，就会从用户态切换到内核态，然后去申请内存



总之，申请内存的动作非常消耗资源，我们提前申请多一点，为了减少内存分配次数，提升效率。



不用计算字符串长度，len就是长度，所以时间复杂度就是O(1)

遍历字符串时，不是以结束标识而结束，而是以长度，长度是几就读几个，中间的不管，所以说是二进制安全

其实可以保存任意字节数据，可以把照片、音频、视频转化为字节存储到sds空间里面去，但是不推荐（这些数据太大了，redis是基于内存的数据库）



![image-20230417174455639](https://raw.githubusercontent.com/195sjin/myBed/master/images202304171744736.png)



#### IntSet

基于c语言本身数组的基础上进行封装，有了其他的强大功能

![image-20230417175703265](https://raw.githubusercontent.com/195sjin/myBed/master/images202304171757399.png)



为什么要强调编码？为什么要统一编码格式

为了方便intset方便基于数组角标寻址，快速定位对应元素，C语言操作内存中的数据都是使用指针去寻址，指针是8字节的无符号整数，这个整数会映射到物理内存的一片空间（把指针看做是一个指向内存的地址，根据它我们就能寻找到对应的内存空间上存储的数据），所以contents就是一个指针，指向数组首元素的地址，**大小固定能方便寻址**，角标不是代表是第几个元素，而是代表距离起始地址的间隔



contents里面存的是什么，是由encoding决定的，决定里面每一个整数的大小范围，整数占据字节的大小

contents就是一个指针，指向数组首元素的地址，遍历数组都应该由intset自己控制

为了提高intset的增删改查的效率，它会把数组里面的元素进行排序进行存储

![image-20230417181026203](https://raw.githubusercontent.com/195sjin/myBed/master/images202304171810292.png)



![image-20230417181559295](https://raw.githubusercontent.com/195sjin/myBed/master/images202304171815420.png)



**存储少量元素比较合适**



Intset可以看做是特殊的整数数组，具备一些特点：

* Redis会确保Intset中的元素唯一、有序
* 具备类型升级机制，可以节省内存空间
* 底层采用二分查找方式来查询



#### Dict

保存键值对的映射关系，就不能用整数集合

字典，把键值对的映射关系保存起来，方便我们查找，类似于Java中的HashMap（底层是数组，在数组里面，保存的是键值对，根据key进行哈希运算，计算出在数组中的角标，找到相应的值，效率非常高）

![image-20230418122945196](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181229317.png)

![image-20230418124037410](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181240486.png)

![image-20230418124133377](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181241451.png)

![image-20230418123754772](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181237882.png)



##### Dict的渐进式rehash

后台进程对CPU的使用非常高，而且还有大量的IO读写，会影响性能，如果正在做后台进程，又进行rehash，很有可能导致命令阻塞，主进程阻塞。

![image-20230418125219835](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181252973.png)



![image-20230418125538650](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181255788.png)



**Dict的rehash**

![image-20230418131958291](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181319390.png)



![image-20230418132843994](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181328114.png)



##### 总结

Dict的结构：

* 类似java的HashTable，底层是数组加链表来解决哈希冲突
* Dict包含两个哈希表，ht[0]平常用，ht[1]用来rehash

Dict的伸缩：

* 当LoadFactor大于5或者LoadFactor大于1并且没有子进程任务时，Dict扩容
* 当LoadFactor小于0.1时，Dict收缩
* 扩容大小为第一个大于等于used + 1的2^n
* 收缩大小为第一个大于等于used 的2^n
* Dict采用渐进式rehash，每次访问Dict时执行一次rehash
* rehash时ht[0]只减不增，新增操作只在ht[1]执行，其它操作在两个哈希表





#### ZipList

在Dict内部大量使用了指针，分配的内存是不连续的；造成了内存的浪费，容易产生内存碎片

双端链表里面的节点都还是通过指针联系的，一个节点里要保存俩指针（一个向前，一个向后），浪费更多了

ZipList是一块连续的内存空间，不需要指针来寻址，所以节省内存

![image-20230418163435413](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181643496.png)



| **属性** | **类型** | **长度** | **用途**                                                     |
| -------- | -------- | -------- | ------------------------------------------------------------ |
| zlbytes  | uint32_t | 4 字节   | 记录整个压缩列表占用的内存字节数                             |
| zltail   | uint32_t | 4 字节   | 记录压缩列表表尾节点距离压缩列表的起始地址有多少字节，通过这个偏移量，可以确定表尾节点的地址。 |
| zllen    | uint16_t | 2 字节   | 记录了压缩列表包含的节点数量。 最大值为UINT16_MAX （65534），如果超过这个值，此处会记录为65535，但节点的真实数量需要遍历整个压缩列表才能计算得出。 |
| entry    | 列表节点 | 不定     | 压缩列表包含的各个节点，节点的长度由节点保存的内容决定。     |
| zlend    | uint8_t  | 1 字节   | 特殊值 0xFF （十进制 255 ），用于标记压缩列表的末端。        |



**entry可以进行动态调整，值越大占用的字节数也就越多，entry的长度不固定，这也就是压缩链表节省内存的原因之一**



![image-20230418165642831](https://raw.githubusercontent.com/195sjin/myBed/master/images202304181656935.png)



![image-20230419125725183](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191257372.png)



![image-20230419130731909](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191307025.png)



**在遍历的时候只能从前向后或者从后向前**，遍历的时间太长



该问题发生的概率较低

![image-20230419131633447](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191316562.png)



![image-20230419131730688](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191317757.png)



#### QuickList

**兼具链表（内存不用连续，可以申请很多很多，劣势是占用内存过多内存碎片比较多）和ZipList（内存占用少，内存碎片少，劣势是能存的数据量有限）的优点**

ZipList申请的是连续内存空间，申请的小还行，申请的空间要是太大，就会很麻烦（内存是碎片化的）

![image-20230419183042895](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191830062.png)





![image-20230419183451993](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191834089.png)



![image-20230419183426918](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191834008.png)



![image-20230419183753207](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191837343.png)



![image-20230419184017901](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191840981.png)

QuickList的特点：

* 是一个节点为ZipList的双端链表
* 节点采用ZipList，解决了传统链表的内存占用问题
* 控制了ZipList大小，解决连续内存空间申请效率问题
* 中间节点可以压缩，进一步节省了内存



#### SkipList

**能存储的量很多，查询速率也快**

上面两种数据结构都很节省内存，但是在遍历的时候要么从头要么从尾，查找首尾性能不错，但是从中间随机查询，性能就不咋样了。

为什么链表查询慢，因为它的指针跨度是1，依次遍历，性能就差了

最多允许32级指针，假设每一级指针的跨度是成倍数递增的（一级为2，二级为4，那么32级就是2的31次方，跨度非常大，也就意味着能存储的元素的数量最多就是2的32次方）

![image-20230419185641271](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191856359.png)



不同的节点，层级可能不一样，所以多级指针是一个数组

![image-20230419190208785](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191902877.png)



![image-20230419190359937](https://raw.githubusercontent.com/195sjin/myBed/master/images202304191904028.png)



SkipList的特点：

* 跳跃表是一个双向链表，每个节点都包含score和ele值
* 节点按照score值排序，score值一样则按照ele字典排序
* 每个节点都可以包含多层指针，层数是1到32之间的随机数
* 不同层指针到下一个节点的跨度不同，层级越高，跨度越大
* 增删改查效率与红黑树基本一致，实现却更简单



#### RedisObject

前面六种不同的数据结构都是底层的实现，最终都会被封装成Redisobject

头部就要占据16字节，有大量的数据需要存储的时候，不建议使用string，因为每一个string都需要一个redis的头，会有大量的内存浪费在记录头信息这块，建议使用集合



什么是redisObject：
从Redis的使用者的角度来看，⼀个Redis节点包含多个database（非cluster模式下默认是16个，cluster模式下只能是1个），而一个database维护了从key space到object space的映射关系。这个映射关系的key是string类型，⽽value可以是多种数据类型，比如：
string, list, hash、set、sorted set等。我们可以看到，key的类型固定是string，而value可能的类型是多个。
⽽从Redis内部实现的角度来看，database内的这个映射关系是用⼀个dict来维护的。dict的key固定用⼀种数据结构来表达就够了，这就是动态字符串sds。而value则比较复杂，**为了在同⼀个dict内能够存储不同类型的value，这就需要⼀个通⽤的数据结构**，这个通用的数据结构就是robj，全名是redisObject。

![image-20230420095737428](https://raw.githubusercontent.com/195sjin/myBed/master/images202304200957617.png)



![image-20230420100234863](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201002950.png)



ZipList大量使用的原因是：内存占用比较小，所以很多数据类型的底层都用到了ZipList



![image-20230420100530145](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201005222.png)

其他的数据类型底层都是这五种中的，其实就是进行了拓展



#### 五种数据结构

##### String

底层实现⽅式：动态字符串sds 或者 long
String的内部存储结构⼀般是sds（Simple Dynamic String，可以动态扩展内存），但是如果⼀个String类型的value的值是数字，那么Redis内部会把它转成long类型来存储，从⽽减少内存的使用。

![image-20230420101221920](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201012998.png)



连续内存空间表示

![image-20230420102449994](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201024055.png)



为什么以44作为内存限制？

长度小于44字节，那么sds的头一共会占3字节，尾占1字节，加起来是48字节，再加上Redisobject的头是16个字节，一共是64个字节，

redis的内存分配算法，在分配内存的时候，会以2的n次方的形式分配内存，而64刚好是一个内存分片大小，因此不会产生内存碎片



在使用string的时候，尽量不让字符串超过44字节，一旦超过就会转为raw，效率会下降



数字相对于普通字符串的特殊之处

数字能直接转成二进制位来表示，一个字节就能表示字符串255，若是255个字符串，就是3个字节，所以说数值转化为比特位去存，更加节省内存



指针位置刚好用来存数据，为什么？

Java或c的数值大小就是1字节、2字节、4字节等等，不会超过8字节，指针位置刚好是8字节



![image-20230420102940283](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201029340.png)



![image-20230420103236511](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201032593.png)

确切地说，String在Redis中是⽤⼀个robj来表示的。

用来表示String的robj可能编码成3种内部表⽰：OBJ_ENCODING_RAW，OBJ_ENCODING_EMBSTR，OBJ_ENCODING_INT。
其中前两种编码使⽤的是sds来存储，最后⼀种OBJ_ENCODING_INT编码直接把string存成了long型。

在对string进行incr, decr等操作的时候，如果它内部是OBJ_ENCODING_INT编码，那么可以直接行加减操作；如果它内部是OBJ_ENCODING_RAW或OBJ_ENCODING_EMBSTR编码，那么Redis会先试图把sds存储的字符串转成long型，如果能转成功，再进行加减操作。

对⼀个内部表示成long型的string执行append, setbit, getrange这些命令，针对的仍然是string的值（即⼗进制表示的字符串），而不是针对内部表⽰的long型进⾏操作。

比如字符串”32”，如果按照字符数组来解释，它包含两个字符，它们的ASCII码分别是0x33和0x32。当我们执行命令setbit key 7 0的时候，相当于把字符0x33变成了0x32，这样字符串的值就变成了”22”。⽽如果将字符串”32”按照内部的64位long型来解释，那么它是0x0000000000000020，在这个基础上执⾏setbit位操作，结果就完全不对了。

在这些命令的实现中，会把long型先转成字符串再进行相应的操作。

##### List

list

![image-20230420103700799](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201037892.png)



![image-20230420105209136](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201052250.png)



就是在quicklist基础上，包了一层Redisobject头



![image-20230420105241420](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201052496.png)





##### Set

set

![image-20230420110132904](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201101994.png)



用Dict来可以满足，但是也有一定的弊端，Dict里面是数组加链表，而且数组里面保存的是指向DictEntry的指针，每一个DictEntry都是一个独立的内存空间，所以内存空间是碎片化的，不连续的，而且有大量的指针，内存占用比较多



![image-20230420111230360](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201112495.png)

编码转换

![image-20230420144413568](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201444668.png)



![image-20230420111432620](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201114673.png)



![image-20230420111528659](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201115759.png)



##### ZSet

zset

![image-20230420142430450](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201424652.png)

**性能很好，又能查找又能排序，但是，占据内存太高了，指针太多了**

![image-20230420142723385](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201427484.png)



![image-20230420143447238](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201434371.png)



编码转换

![image-20230420143927339](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201439437.png)



![image-20230420144324068](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201443141.png)



##### Hash

![image-20230420151607464](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201516561.png)

底层实现方式：压缩列表ziplist 或者 字典dict
当Hash中数据项比较少的情况下，Hash底层才⽤压缩列表ziplist进⾏存储数据，随着数据的增加，底层的ziplist就可能会转成dict

![image-20230420151825443](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201518530.png)

当满足上面两个条件其中之⼀的时候，Redis就使⽤dict字典来实现hash。



edis的hash之所以这样设计，是因为当ziplist变得很⼤的时候，它有如下几个缺点：

* 每次插⼊或修改引发的realloc操作会有更⼤的概率造成内存拷贝，从而降低性能。
* ⼀旦发生内存拷贝，内存拷贝的成本也相应增加，因为要拷贝更⼤的⼀块数据。
* 当ziplist数据项过多的时候，在它上⾯查找指定的数据项就会性能变得很低，因为ziplist上的查找需要进行遍历。

总之，ziplist本来就设计为各个数据项挨在⼀起组成连续的内存空间，这种结构并不擅长做修改操作。⼀旦数据发⽣改动，就会引发内存realloc，可能导致内存拷贝。



数据量较大时

![image-20230420151906529](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201519592.png)



![image-20230420153413393](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201534498.png)

![image-20230420153432001](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201534082.png)



![image-20230420153457464](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201534585.png)



![image-20230420153526850](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201535920.png)



### 网络模型

#### 用户空间和内核空间

用户的应用，比如redis，mysql等其实是没有办法去执行访问我们操作系统的硬件的，所以我们可以通过发行版的这个壳子去访问内核，再通过内核去访问计算机硬件

计算机硬件包括，如cpu，内存，网卡等等，内核（通过寻址空间）可以操作硬件的，但是内核需要不同设备的驱动，有了这些驱动之后，内核就可以去对计算机硬件去进行 内存管理，文件系统的管理，进程的管理等等

![image-20230420154332386](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201543495.png)



![image-20230420160921054](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201609119.png)



系统本身要消耗资源，用户应用也要消耗资源，有可能产生冲突，所以把用户应用跟内核隔离开，避免冲突，导致内核崩溃

寻址空间：内核、用户应用都无法直接访问物理内存，是通过虚拟内存空间，映射到不同的物理内存。应用或内核在访问虚拟内存空间就需要一个虚拟的地址，该虚拟地址是无符号整数，最大数取决于CPU的地址总线和寄存器的带宽（一个32位的系统的带宽是32，因此地址的最大值是2的32次方）也就是寻址的范围就是0-2的32次方

内存地址的每一个值代表的就是一个存储单元（一个字节），寻址空间最多的字节就是2的32次方，也就是4GB，这也就是一个32位的系统它的寻址空间最大就是4GB，这4GB又会被分为内核空间和用户空间



在linux中，把用户应用与内核应用在内核上进行划分还不够，还需要在系统权限上进行划分（在CPU运行的命令中，有些风险高，有些风险低），所以CPU会把命令划分为2个不同的等级r0-r3（风险等级最低，任何用户应用都能访问）

进程可能会执行普通命令，也可能会执行特权命令，因此进程会在用户空间（用户态）与内核空间（内核态）切换



![image-20230420164424427](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201644532.png)



读写流程：

假设要写出到磁盘就需要调用内核

写的时候先写进缓冲区，切换到内核（里面没有要写的数据，无法写），因此需要先把用户空间的数据拷贝到内核空间，然后把缓冲区的数据写入到磁盘

读的时候用户空间发起读的请求，请求到达内核空间（判断有无数据，如果要读的是磁盘，磁盘要先去寻址，在这个过程中需要等待；如果读的不是磁盘，是网卡，别人从网络传的数据，别人没传，也要等待），读取到缓冲区里去，把缓冲区的数据拷贝回用户空间，然后在用户空间执行对数据的操作



把整台linux服务当成服务器，上面的读写流程就相当于服务器跟客户端交互的流程

已经建立连接了，准备发请求，read就是读取请求，请求在发送的过程中我们就需要等待，等请求到达网卡，去网卡读取数据，先读到内核的缓冲区，然后读到用户空间的缓冲区，然后在用户空间进行业务处理，处理完业务需要把数据写回去（先写到缓冲区，在拷贝到内核缓冲区，再写到网卡）



影响IO效率最主要的就是等待的过程与拷贝

提高IO效率就是想办法减少等待时间与减少数据拷贝



#### 阻塞IO

等待数据就绪就是等待硬件设备上的数据到达内存缓冲区

![image-20230420165031020](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201650091.png)

数据读取的流程能分为两部分，一部分是用户等待数据就绪，第二部分就是将内核中的数据拷贝到用户缓冲区

![image-20230420165043317](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201650377.png)

不同的IO模型的差别就是在这两两个阶段处理上的差别

在《UNIX网络编程》一书中，总结归纳了5种IO模型：

* 阻塞IO（Blocking IO）
* 非阻塞IO（Nonblocking IO）
* IO多路复用（IO Multiplexing）
* 信号驱动IO（Signal Driven IO）
* 异步IO（Asynchronous IO）





是用户阻塞等待，下图是用户进程和内核在干什么、处于什么状态

如果是阻塞IO，那么整个过程中，用户从发起读请求开始，一直到读取到数据，都是一个阻塞状态。

![image-20230420170225880](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201702958.png)

用户应用调用内核函数尝试去读数据，只有这个函数返回结果才算结束，否则进程一直阻塞，内核发现没有需要被调用的数据，一种处理方法是直接返回失败，告诉没有数据，另一种方案是等一会，等到有数据为止，内核处理数据跟IO模型有关



#### 非阻塞IO

在一阶段并没有阻塞，而是立即返回失败信息，在二阶段的时候调用数据，它需要拷贝数据，这个时候用户应用进程是阻塞的

非阻塞IO在一阶段等待数据就绪的时候是非阻塞的，在二阶段数据拷贝时依然是阻塞状态

非阻塞IO在等待数据就绪的时候除了“问”，并没有干什么事，没用，其实并没有提升进程的性能，相反，在不停的问，让CPU不停的执行一些命令，会使CPU的使用率暴增

![image-20230420171444536](https://raw.githubusercontent.com/195sjin/myBed/master/images202304201714626.png)



#### IO多路复用

多线程确实会增加效率，但是开销也会变大，cpu会来回切换，性能可能不增反降；

用一个线程监听多个socket

![image-20230421164004612](https://raw.githubusercontent.com/195sjin/myBed/master/images202304211640745.png)



文件描述符：每一个数字代表一个文件描述符

Io多路复用，复用的是线程，用一个线程监听多个socket

 

在第一阶段也会进行阻塞，但是io多路复用的第一阶段与阻塞io的第一阶段阻塞又有些不同

 

阻塞io模式调用的是recvfrom函数产生的阻塞，该函数只能监听某一个fd，直到这个fd就绪才能往下，这个fd没有就绪并不代表其他fd没有就绪

 

Select是一次性传多个fd，只要谁就绪，就去处理谁

![image-20230421164108253](https://raw.githubusercontent.com/195sjin/myBed/master/images202304211641365.png)

阶段一：

* 用户进程调用select，指定要监听的FD集合
* 核监听FD对应的多个socket
* 任意一个或多个socket数据就绪则返回readable
* 此过程中用户进程阻塞

阶段二：

* 用户进程找到就绪的socket
* 依次调用recvfrom读取数据
* 内核将数据拷贝到用户空间
* 用户进程处理数据



select函数会将需要监听的数据交给内核，由内核去检查这些数据是否就绪了，如果说这个数据就绪了，就会通知应用程序数据就绪，然后来读取数据，再从内核中把数据拷贝给用户态，完成数据处理，如果N多个FD一个都没处理完，此时就进行等待。

用IO复用模式，可以确保去读数据的时候，数据是一定存在的，他的效率比原来的阻塞IO和非阻塞IO性能都要高

Select与poll的机制就是数据就绪了，通知监听者，但是监听者不知道哪个就绪，所以会遍历找到就绪者

![image-20230421164315741](https://raw.githubusercontent.com/195sjin/myBed/master/images202304211643851.png)

select和pool相当于是当被监听的数据准备好之后，他会把你监听的FD整个数据都发给你，你需要到整个FD中去找，哪些是处理好了的，需要通过遍历的方式，所以性能也并不是那么好

而epoll，则相当于内核准备好了之后，他会把准备好的数据，直接发给你，咱们就省去了遍历的动作



##### select

Fd set保存fd的时候是按照bit位保存的

在执行select的那一刻就会把rfds集合拷贝到内核空间

 

在内核空间等待数据就绪的时候，几个就绪就返回几，但是select只是返回了几个就绪了，并没有把结果告诉用户，其实它会把fd的结果拷贝回用户空间，覆盖原本空间的fd集合

 

Fdset这个设计虽然节省了内存，但是没有办法直观地告诉用户进程谁就绪了，不得不在每次读数据的时候遍历集合，找到fd

![image-20230421164451077](https://raw.githubusercontent.com/195sjin/myBed/master/images202304211644245.png)



##### poll

在调用poll函数的时候，需要创建多个pollfd结构体，把他们形成数组传进去（指定fd与events），传到内核中后，内核需要监听，如果发现事件有就绪的情况，就会把就绪的事件的类型放到revents里，如果等到超时时间过了，还没有就绪事件，就会把revents置为0

![image-20230421164553434](https://raw.githubusercontent.com/195sjin/myBed/master/images202304211645594.png)



##### epoll

红黑树里面记录的是所有的fd，链表里面记录的是就绪的fd，epoll_ctl只添加fd，并不会等待

当我们去执行epoll_wait的时候，我们的内核会去检查就绪列表list_head，因为一旦就绪callback就会把就绪的fd添加到就绪列表里（所以不需要检查红黑树，只需要检查列表就行了），如果列表里没有数据，就会等待一会，如果还没有就绪的，就返回0，有的话就返回就绪的数量

就绪的fd在链表里面了，把链表里的数据拷贝到用户空间的events数组里

在select与poll的时候，拷贝的是所有的fd，不管是就绪的与没有就绪的全拷贝，在epoll就是拷贝的已经就绪的fd

![image-20230421170923520](https://raw.githubusercontent.com/195sjin/myBed/master/images202304211709735.png)

在epoll模式下，相当于把select功能（把fd拷贝到内核、等待fd就绪）拆分了，epoll_ctl是监听fd，也就是把fd拷贝到内核，epoll_wait是等待fd就绪

在循环执行的过程中，要监听一个新的fd时，epoll_ctl只需要执行一次，在以后的循环过程中，就不需要在进行ctl添加，循环的事件处理循环的是wait，只需要去等待就行了，不需要进行fd的拷贝



从内核拷贝回用户空间的数量更少，只需要拷贝已经就绪的



所以，epoll大大减少了拷贝的次数，减少了拷贝的数量



在select，返回回去的是fd的数量，还要在遍历才能找到。在epoll，虽然也返回的是数量，但是返回的都是已经就绪的fd，能直接用



在epoll模式，从用户空间添加的每一个fd，都会放到红黑树上，红黑树能支持的数量是无限的，红黑树的查询性能是稳定的

![image-20230421172751464](https://raw.githubusercontent.com/195sjin/myBed/master/images202304211727551.png)



###### 事件通知机制

**事件通知**

在把列表里面的fd拷贝到用户空间之前，内核中的列表里指向就绪的fd的指针会断开（但是数据还在内核中，还能找到），如果用lt模式，fd不会被删除，还会被添加会就绪队列，数据没读完还想在读能读到，但是用的是et的话，它不会被添加回就绪队列，它直接就拷贝完就删除了

lt的重复通知对于效率是有影响的

lt也可能会出现惊群现象（假设有n个进程都监听到了同一个fd，并且都在调用wait，尝试获取就绪的fd，结果这个fd真的就绪了，就会去通知进程，lt模式中任何一个进程通知完成以后这个fd还会存在在列表当中，导致所有监听这个fd的进程都会通知到，也就是一个fd就绪，所有进程都会被唤醒）没有用到的进程其实没有必要被唤醒

![image-20230421175115771](https://raw.githubusercontent.com/195sjin/myBed/master/images202304211751909.png)



###### 基于epoll的服务端流程

epoll的服务器端流程

web服务都是基于TCP协议的，在TCP协议里，服务端就是一个serverSocket（唯一目的就是接受客户端请求）

作为serverSocket来讲，只有一种情况是fd就绪，就是有客户端向他申请连接

![image-20230421224712752](https://raw.githubusercontent.com/195sjin/myBed/master/images202304212247911.png)



#### 信号驱动IO

信号驱动IO

一阶段是非阻塞的，可以去干其他事；

![image-20230422124436820](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221244972.png)



#### 异步IO

这种方式，不仅仅是用户态在试图读取数据后，不阻塞，而且当内核的数据准备完成后，也不会阻塞

他会由内核将所有数据处理完成后，由内核将数据写入到用户态中，然后才算完成，所以性能极高，不会有任何阻塞，全部都由内核完成，可以看到，异步IO模型中，用户进程在两个阶段都是非阻塞状态。

没有调用数据拷贝的函数，用的是aio_read:通知内核我想读哪个fd，然后读到哪里去，然后不管了，返回0

![image-20230422124955240](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221249327.png)



![image-20230422125203544](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221252644.png)





#### Redis网络模型



##### Redis是单线程还是多线程

Redis是单线程还是多线程

网络模型上引入了多线程，但是在命令处理的时候还是单线程

一旦引入多线程，对于命令的操作，就需要考虑线程安全问题，代码复杂度就会高，性能下降，可能跟老的版本还会出现兼容性问题



![image-20230422125742635](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221257705.png)





![image-20230422130059112](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221300191.png)



##### Redis单线程及多线程网络模型变更

不同的操作系统，对io多路复用的实现方案不一样

![image-20230422131559242](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221315360.png)



Redis单线程网络模型的流程



一旦监听了以后，将来真的发生了事件，将来怎么处理不用管，因为设置了一个处理器acceptTCPHandler（接受TCP请求的处理器），因此将来一旦有事件，自然有对应的函数进行处理（以前仅仅是注册上去，等将来发生事件再去写处理的代码），处理的是两部分，一部分是接收客户端请求，得到socket，得到fd，第二部分是把fd注册上去，再一次进行监听

![image-20230422134449392](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221344517.png)

![image-20230422135737973](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221357053.png)



![image-20230422134309790](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221343854.png)



![image-20230422134745106](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221347277.png)



![image-20230422140248557](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221402679.png)

当我们的客户端想要去连接我们服务器，会去先到IO多路复用模型去进行排队，会有一个连接应答处理器，他会去接受读请求，然后又把读请求注册到具体模型中去，此时这些建立起来的连接

如果是客户端请求处理器去进行执行命令时，他会去把数据读取出来，然后把数据放入到client中， clinet去解析当前的命令转化为redis认识的命令，接下来就开始处理这些命令，从redis中的command中找到这些命令，然后就真正的去操作对应的数据了，当数据操作完成后，会去找到命令回复处理器，再由他将数据写出。

![image-20230422140308430](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221403539.png)



出现性能瓶颈的是哪里？

**影响性能的主要原因是IO**	

IO多路复用就是接受请求，注册事件而已，速度快，效率高

命令请求处理这块需要读socket，读出对应的请求，读完之后解析，把它变成redis命令，这就牵扯到了IO的读，读的速度收到网络、带宽的影响等等效率会低一点

执行命令是纯内存操作，速度很快

命令回复处理这块又会受到网络、带宽的影响

![image-20230422141221454](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221412592.png)



### 通信协议

Redis是一个CS架构的软件，通信一般分两步（不包括pipeline和PubSub）：

客户端（client）向服务端（server）发送一条命令

服务端解析并执行命令，返回响应结果给客户端

因此客户端发送命令的格式、服务端响应结果的格式必须有一个规范，这个规范就是通信协议。



而在Redis中采用的是RESP（Redis Serialization Protocol）协议：

Redis 1.2版本引入了RESP协议

Redis 2.0版本中成为与Redis服务端通信的标准，称为RESP2

Redis 6.0版本中，从RESP2升级到了RESP3协议，增加了更多数据类型并且支持6.0的新特性--客户端缓存

但目前，默认使用的依然是RESP2协议，也是我们要学习的协议版本（以下简称RESP）。





![image-20230422143044253](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221430368.png)



### 内存策略

内存策略

![image-20230422153122661](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221531741.png)



#### 过期策略

过期策略

![image-20230422153321676](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221533774.png)



**两个问题**

**1、Redis如何知道一个key是否过期**

**2、是不是TTL到期了就立即删除**



![image-20230422154057546](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221540597.png)

![image-20230422153825675](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221538799.png)

![image-20230422153959774](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221539869.png)





![image-20230422154147957](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221541012.png)



![image-20230422154411512](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221544630.png)



slow：低频高时长，大量清理

fast：高频低时长，少量清理

![image-20230422155321673](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221553812.png)

SLOW模式规则：

* 执行频率受server.hz影响，默认为10，即每秒执行10次，每个执行周期100ms。
* 执行清理耗时不超过一次执行周期的25%.默认slow模式耗时不超过25ms
* 逐个遍历db，逐个遍历db中的bucket，抽取20个key判断是否过期
* 如果没达到时间上限（25ms）并且过期key比例大于10%，再进行一次抽样，否则结束



FAST模式规则（过期key比例小于10%不执行 ）：

* 执行频率受beforeSleep()调用频率影响，但两次FAST模式间隔不低于2ms
* 执行清理耗时不超过1ms
* 逐个遍历db，逐个遍历db中的bucket，抽取20个key判断是否过期
  如果没达到时间上限（1ms）并且过期key比例大于10%，再进行一次抽样，否则结束



小总结：

RedisKey的TTL记录方式：

在RedisDB中通过一个Dict记录每个Key的TTL时间

过期key的删除策略：

惰性清理：每次查找key时判断是否过期，如果过期则删除

定期清理：定期抽样部分key，判断是否过期，如果过期则删除。
定期清理的两种模式：

SLOW模式执行频率默认为10，每次不超过25ms

FAST模式执行频率不固定，但两次间隔不低于2ms，每次耗时不超过1ms





#### 淘汰策略

淘汰策略

**Redis是在什么时候检查内存够不够的？**是在任何的命令执行之前去做检查，或者说去淘汰一部分内存

![image-20230422160542415](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221605510.png)

**淘汰内存的时候应该去淘汰哪一部分？**

![image-20230422161111959](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221611057.png)



![image-20230422161759477](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221617582.png)







![image-20230422162045990](https://raw.githubusercontent.com/195sjin/myBed/master/images202304221620095.png)

