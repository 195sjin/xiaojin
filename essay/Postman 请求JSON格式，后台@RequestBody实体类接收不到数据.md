最近遇见了一个很小很小的细节问题，但是比较让人很容易忽略与破防

## 问题

有实体类如下

```java
public class Testing{
    private Integer id;
    private Integer AQIDetectionStaffId;
    private Integer ExMessageId;
    private Integer AQILevel;
    private Integer PM;
    private Integer SO2;
    private Integer CO;
    private Date updateTime;
}
```

我们需要前端传JSON过来，后端使用该实体类来进行封装

在PostMan里模拟前端发送过来的数据

```
{
	"PM": 2,
	"SO2": 2,
	"CO": 2,
	"updateTime": "2023-07-02 21:52:32"
}
```

但是在后端我们使用@RequestBody Testing testing 进行接收的时候，会发现，实体类里面的PM、SO2、CO全都为null

也就是没有封装进来，而且updateTime也会报格式错误

## 解决

### 方法一

在实体类的属性加上@JsonProperty(value = "")注解

在日期类型的属性上加@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")

```java 
public class Testing{
    private Integer id;
    @JsonProperty(value = "AQIDetectionStaffId")
    private Integer AQIDetectionStaffId;
    private Integer ExMessageId;
    private Integer AQILevel;
    @JsonProperty(value = "PM")
    private Integer PM;
    @JsonProperty(value = "SO2")
    private Integer SO2;
    @JsonProperty(value = "CO")
    private Integer CO;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date updateTime;

}
```

这样就会发现有数据了

### 方法二

修改实体类的属性名，这个问题产生的主要原因是因为我们的驼峰模式出现问题了，当驼峰前只有一个小写字母，然后后面是大写字母如xXxx，或者全是大写字母如PM,就会出现接收不到数据的情况

把xXxx修改成xxxXxxx,也就是说要把前面的小写字母加长一点