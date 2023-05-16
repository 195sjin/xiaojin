# RabbitMQ消息队列

## 消息队列

### 什么是MQ

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

![image-20230427153123181](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271531219.png)

- 应用解耦：不同组件之间通过消息队列进行通信，从而避免了直接依赖，提高了系统的可维护性和可扩展性。

![image-20230427152958182](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271529224.png)

- 日志处理：将日志消息发送到消息队列中，由专门的日志处理组件进行处理和存储。
- 分布式系统集成：在分布式系统中，通过消息队列进行数据共享和通信，提高系统的可靠性和弹性。

流量消峰

![image-20230427152732425](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271527539.png)







使用消息队列时需要**注意**以下几点：

- 队列长度：消息队列可能会变得非常长，需要定期清理过期消息。
- 消息格式：消息格式应该是可扩展的，以便在未来添加新的特性。
- 异常处理：需要考虑各种异常情况的处理，如网络故障、消息超时等。
- 安全性：消息队列中的数据可能会非常敏感，需要采取相应的安全措施来保护数据的安全性。



在互联网架构中，MQ 是一种非常常 见的上下游“逻辑解耦+物理解耦”的消息通信服务。使用了 MQ 之后，消息发送上游只需要依赖 MQ，不 用依赖其他服务。



### MQ的分类

ActiveMQ 

优点：单机吞吐量万级，时效性 ms 级，可用性高，基于主从架构实现高可用性，消息可靠性较 低的概率丢失数据 缺点:官方社区现在对 ActiveMQ 5.x 维护越来越少，高吞吐量场景较少使用。



Kafka

 大数据的杀手锏，谈到大数据领域内的消息传输，则绕不开 Kafka，这款**为大数据而生的消息中间件**， 以其百万级 TPS 的吞吐量名声大噪，迅速成为大数据领域的宠儿，在数据采集、传输、存储的过程中发挥 着举足轻重的作用。目前已经被 LinkedIn，Uber, Twitter, Netflix 等大公司所采纳。 

优点: 性能卓越，单机写入 TPS 约在百万条/秒，**最大的优点，就是吞吐量高**。时效性 ms 级可用性非常高，kafka 是分布式的，一个数据多个副本，少数机器宕机，不会丢失数据，不会导致不可用,消费者采 用 Pull 方式获取消息, 消息有序, 通过控制能够保证所有消息被消费且仅被消费一次;有优秀的第三方Kafka Web 管理界面 Kafka-Manager；在日志领域比较成熟，被多家公司和多个开源项目使用；功能支持： 功能 较为简单，主要支持简单的 MQ 功能，在大数据领域的实时计算以及日志采集被大规模使用 

缺点：Kafka 单机超过 64 个队列/分区，Load 会发生明显的飙高现象，队列越多，load 越高，发送消 息响应时间变长，使用短轮询方式，实时性取决于轮询间隔时间，消费失败不支持重试；支持消息顺序， 但是一台代理宕机后，就会产生消息乱序，社区更新较慢



RocketMQ 

RocketMQ 出自阿里巴巴的开源产品，用 Java 语言实现，在设计时参考了 Kafka，并做出了自己的一 些改进。被阿里巴巴广泛应用在订单，交易，充值，流计算，消息推送，日志流式处理，binglog 分发等场景。 

优点:单机吞吐量十万级,可用性非常高，分布式架构,消息可以做到 0 丢失,MQ 功能较为完善，还是分布式的，扩展性好,支持 10 亿级别的消息堆积，不会因为堆积导致性能下降,源码是 java 我们可以自己阅 读源码，定制自己公司的 MQ 

缺点：支持的客户端语言不多，目前是 java 及 c++，其中 c++不成熟；社区活跃度一般,没有在MQ 核心中去实现 JMS 等接口,有些系统要迁移需要修改大量代码



RabbitMQ 

2007 年发布，是一个在AMQP(高级消息队列协议)基础上完成的，可复用的企业消息系统，是当前最 主流的消息中间件之一。

 优点:由于 erlang 语言的高并发特性，性能较好；吞吐量到万级，MQ 功能比较完备,健壮、稳定、易 用、跨平台、支持多种语言 如：Python、Ruby、.NET、Java、JMS、C、PHP、ActionScript、XMPP、STOMP 等，支持 AJAX 文档齐全；开源提供的管理界面非常棒，用起来很好用,社区活跃度高；更新频率相当高 https://www.rabbitmq.com/news.html 

缺点：商业版需要收费,学习成本较高



### MQ的选择

Kafka 

Kafka 主要特点是基于Pull 的模式来处理消息消费，追求高吞吐量，一开始的目的就是用于日志收集 和传输，适合产生大量数据的互联网服务的数据收集业务。大型公司建议可以选用，如果有日志采集功能， 肯定是首选 kafka 了。

RocketMQ 

天生为金融互联网领域而生，对于可靠性要求很高的场景，尤其是电商里面的订单扣款，以及业务削 峰，在大量交易涌入时，后端可能无法及时处理的情况。RoketMQ 在稳定性上可能更值得信赖，这些业务 场景在阿里双 11 已经经历了多次考验，如果你的业务有上述并发场景，建议可以选择 RocketMQ。 

RabbitMQ 

结合 erlang 语言本身的并发优势，性能好时效性微秒级，社区活跃度也比较高，管理界面用起来十分 方便，如果你的数据量没有那么大，中小型公司优先选择功能比较完备的 RabbitMQ。

### RabbitMQ四大核心概念

RabbitMQ 是一个消息中间件：它接受并转发消息

RabbitMQ 与快递站的主要区别在于，它不处理快件而是接收， 存储和转发消息数据。

![image-20230427155313311](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271553357.png)



![image-20230427155430038](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271554083.png)

**生产者** 

产生数据发送消息的程序是生产者 

**交换机** 

交换机是 RabbitMQ 非常重要的一个部件，一方面它**接收**来自生产者的消息，另一方面它将消息**推送**到队列中。交换机必须确切知道如何处理它接收到的消息，是将这些消息推送到特定队列还是推送到多个队列，亦或者是把消息丢弃，这个得有交换机类型决定 

**队列**

队列是 RabbitMQ 内部使用的一种数据结构，尽管消息流经 RabbitMQ 和应用程序，但它们只能存 储在队列中。队列仅受主机的内存和磁盘限制的约束，**本质上是一个大的消息缓冲区**。许多生产者可以将消息发送到一个队列，许多消费者可以尝试从一个队列接收数据。这就是我们使用队列的方式 

**消费者** 

消费与接收具有相似的含义。消费者大多时候是一个等待接收消息的程序。请注意生产者，消费 者和消息中间件很多时候并不在同一机器上。同一个应用程序既可以是生产者又是可以是消费者。



### RabbitMQ核心部分

![image-20230427155838755](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271558831.png)

![image-20230427160227592](https://raw.githubusercontent.com/195sjin/myBed/master/images202304271602647.png)



## Work Queues（工作模式）

工作队列(又称任务队列)的主要思想是**避免立即执行资源密集型任务，而不得不等待它完成**。 相反我们安排任务在之后执行。我们把任务封装为消息并将其发送到队列。在后台运行的工作进 程将弹出任务并最终执行作业。当有多个工作线程时，这些工作线程将一起处理这些任务。

在工作队列中，任务由一个或多个生产者（Producer）发送到队列中，而一个或多个消费者（Consumer）从队列中获取任务并进行处理。多个消费者可以同时从队列中获取任务，每个任务只会被一个消费者处理。

工作队列通常用于处理耗时的任务，比如图像处理、PDF生成、数据分析等。生产者可以将任务消息发送到队列中，然后立即返回，而不必等待任务处理完成。消费者则可以异步地从队列中获取任务并进行处理，从而提高任务处理的效率和可用性。

![image-20230427200319425](https://raw.githubusercontent.com/195sjin/myBed/master/images202304272003505.png)

三者是通过轮询的方式获得消息，类似于nginx中的负载均衡

**消息应答机制**

为了保证消息在发送过程中不丢失，rabbitmq 引入消息应答机制，消息应答就是:  消费者在接收 到消息并且处理该消息之后，告诉 rabbitmq 它已经处理了，rabbitmq 可以把该消息删除了。

### 消息自动应答

消息**发送后立即被认为已经传送成功**，这种模式**需要在高吞吐量和数据传输安全性方面做权衡**,因为这种模式如果消息在接收到之前，消费者那边出现连接或者 channel 关闭，那么消息就丢失 了,当然另一方面这种模式消费者那边可以传递过载的消息，**没有对传递的消息数量进行限制**，当然这样有可能使得消费者这边由于接收太多还来不及处理的消息，导致这些消息的积压，最终使 得内存耗尽，最终这些消费者线程被操作系统杀死，所以**这种模式仅适用在消费者可以高效并以 某种速率能够处理这些消息的情况下使用**

不是很靠谱，需要一个良好的环境，不能发生一些极端的情况下才能使用自动应答

（只要接到消息就返回说已经解决，但是实际上有没有解决也不太确定）



### 消息手动应答

A.Channel.basicAck(用于肯定确认)  

​		RabbitMQ 已知道该消息并且成功的处理消息，可以将其丢弃了 

B.Channel.basicNack(用于否定确认)  

C.Channel.basicReject(用于否定确认)  

​		与 Channel.basicNack 相比少一个参数 ，少了一个批量处理的参数

​		也就是说不处理该消息了直接拒绝，可以将其丢弃了

**批量应答**

手动应答的好处是**可以批量应答并且减少网络拥堵**

![image-20230427203455823](https://raw.githubusercontent.com/195sjin/myBed/master/images202304272034867.png)

multiple 的 true 和 false 代表不同意思 

​	true 代表批量应答 channel 上未应答的消息 

​		比如说 channel 上有传送 tag 的消息 5,6,7,8 当前 tag 是8 那么此时 5-8 的这些还未应答的消息都会被确认收到消息应答 

​	false 同上面相比 只会应答 tag=8 的消息 5,6,7 这三个消息依然不会被确认收到消息应答

![image-20230427203610374](https://raw.githubusercontent.com/195sjin/myBed/master/images202304272036422.png)

**消息在手动应答时是不丢失的，会放回队列中重新消费**

### 消息自动重新入队

如果消费者由于某些原因失去连接(其通道已关闭，连接已关闭或 TCP 连接丢失)，导致消息**未发送 ACK 确认**，RabbitMQ 将了解到消息未完全处理，并**将对其重新排队**。如果此时其他消费者可以处理，它将很快将其重新分发给另一个消费者。这样，即使某个消费者偶尔死亡，也可以确保不会丢失任何消息。

**保证消息不丢失**

![image-20230427203950734](https://raw.githubusercontent.com/195sjin/myBed/master/images202304272039776.png)

### RabbitMQ持久化

**概念**

保障当 RabbitMQ 服务停掉以后消 息生产者发送过来的消息不丢失。

默认情况下 RabbitMQ 退出或由于某种原因崩溃时，它忽视队列和消息，除非告知它不要这样做。确保消息不会丢失需要做两件事：我们需要将**队列和消息都标记为持久化**。



**队列持久化**

需要在声明队列的时候把 durable 参数设置为持久化

> 但是需要注意的就是如果之前声明的队列不是持久化的，需要把原先队列先删除，或者重新创建一个持久化的队列，不然就会出现错误

![image-20230503115106028](https://raw.githubusercontent.com/195sjin/myBed/master/images202305031151115.png)

**消息持久化**

消息实现持久化需要在消息生产者修改代码，MessageProperties.PERSISTENT_TEXT_PLAIN 添加这个属性。

将消息标记为持久化并不能完全保证不会丢失消息。

尽管它告诉 RabbitMQ 将消息保存到磁盘，但是这里依然存在当消息刚准备存储在磁盘的时候，但是还没有存储完，消息还在缓存的一个间隔点。此时并没有真正写入磁盘。持久性保证并不强，但是对于我们的简单任务队列而言，这已经绰绰有余了。



**不公平分发**

也就是**能者多劳**

RabbitMQ 分发消息采用的轮训分发，但是在某种场景下这种策略并不是很好

>比方说有两个消费者在处理任务，其中有个消费者 1 处理任务的速度非常快，而另外一个消费者 2 处理速度却很慢，这个时候我们还是采用轮训分发的话就会到这处理速度快的这个消费者很大一部分时间 处于空闲状态，而处理慢的那个消费者一直在干活，这种分配方式在这种情况下其实就不太好，但是 RabbitMQ 并不知道这种情况它依然很公平的进行分发。

为了避免这种情况，我们可以**设置参数 channel.basicQos(1)**;

在消费者端设置

![image-20230503121203560](https://raw.githubusercontent.com/195sjin/myBed/master/images202305031212605.png)



意思就是如果这个任务我还没有处理完或者我还没有应答你，你先别分配给我，我目前只能处理一个任务，然后 rabbitmq 就会把该任务分配给没有那么忙的那个空闲消费者

当然如果所有的消费者都没有完 成手上任务，队列还在不停的添加新任务，队列有可能就会遇到队列被撑满的情况，这个时候就只能添加 新的 worker 或者改变其他存储任务的策略。



**预取值**

本身消息的发送就是异步发送的，所以在任何时候，channel 上肯定不止只有一个消息，另外来自消费者的手动确认本质上也是异步的。

因此这里就存在一个未确认的消息缓冲区，因此希望开发人员能**限制此缓冲区的大小**，以**避免缓冲区里面无限制的未确认消息问题**。

可以通过使用 **basic.qos** 方法设 置“预取计数”值来完成的，**该值定义通道上允许的未确认消息的最大数量**

一旦数量达到配置的数量， RabbitMQ 将停止在通道上传递更多消息，除非至少有一个未处理的消息被确认。

> 假设在通道上有 未确认的消息 5、6、7，8，并且通道的预取计数设置为 4，此时RabbitMQ 将不会在该通道上再传递任何消息，除非至少有一个未应答的消息被 ack。比方说 tag=6 这个消息刚刚被确认 ACK，RabbitMQ 将会感知这个情况到并再发送一条消息。

![image-20230503122034282](https://raw.githubusercontent.com/195sjin/myBed/master/images202305031220326.png)

消息应答和 QoS 预取值**对用户吞吐量有重大影响**,通常，增加预取将**提高向消费者传递消息的速度**。

虽然自动应答传输消息速率是最佳的，但是，在这种情况下已传递但尚未处理的消息的数量也会增加，从而增加了消费者的 RAM 消耗(随机存取存储器)，应该小心使用具有无限预处理的自动确认模式或手动确认模式

消费者消费了大量的消息如果没有确认的话，会导致消费者连接节点的内存消耗变大，所以**找到合适的预取值是一个反复试验的过程**，不同的负载该值取值也不同 100 到 300 范围内的值通常可提供最佳的吞吐量，并且不会给消费者带来太大的风险。

预取值为 1 是最保守的。当然这将使吞吐量变得很低，特别是消费者连接延迟很严重的情况下，特别是在消费者连接等待时间较长的环境 中。对于大多数应用来说，稍微高一点的值将是最佳的。



## 发布确认

### 原理

![image-20230503123535646](https://raw.githubusercontent.com/195sjin/myBed/master/images202305031235701.png)

生产者将信道设置成 confirm 模式，一旦信道进入 confirm 模式，**所有在该信道上面发布的消息都将会被指派一个唯一的 ID**(从 1 开始)

一旦消息被投递到所有匹配的队列之后，broker 就会发送一个确认给生产者(包含消息的唯一 ID)，这就使得生产者知道消息已经正确到达目的队列了， **如果消息和队列是可持久化的，那么确认消息会在将消息写入磁盘之后发出**，broker 回传给生产者的确认消息中 delivery-tag 域包含了确认消息的序列号，此外 broker 也可以设置basic.ack 的 multiple 域，表示到这个序列号之前的所有消息都已经得到了处理。 

confirm 模式**最大的好处在于他是异步的**，一旦发布一条消息，生产者应用程序就可以在等信道返回确认的同时继续发送下一条消息，当消息最终得到确认之后，生产者应用便可以通过回调方法来处理该确认消息，如果 RabbitMQ 因为自身内部错误导致消息丢失，就会发送一条 nack 消息， 生产者应用程序同样可以在回调方法中处理该 nack 消息。



### 开启发布确认的方法

发布确认**默认是没有开启的**，如果要开启需要调用方法 **confirmSelect**，每当你要想使用发布确认，都需要在 channel 上调用该方法，在生产者代码中使用

![image-20230503123721922](https://raw.githubusercontent.com/195sjin/myBed/master/images202305031237955.png)



### 单个确认发布

它是一种**同步确认发布的方式**，也就是发布一个消息之后只有它被确认发布，后续的消息才能继续发布。

**waitForConfirmsOrDie(long)**这个方法只有在消息被确认的时候才返回，如果在指定时间范围内这个消息没有被确认那么它将抛出异常。

 这种确认方式有一个最大的缺点就是:**发布速度特别的慢**，因为如果没有确认发布的消息就会**阻塞**所有后续消息的发布，这种方式最多提供每秒不超过数百条发布消息的吞吐量。当然对于某些应用程序来说这可能已经足够了。



### 批量确认发布

上面那种方式非常慢，与单个等待确认消息相比，**先发布一批消息然后一起确认**可以极大地**提高吞吐量**，当然这种方式的**缺点就是:当发生故障导致发布出现问题时，不知道是哪个消息出现问题了**，我们必须将整个批处理保存在内存中，以记录重要的信息而后重新发布消息。当然这种方案**仍然是同步**的，也一样**阻塞**消息的发布。



### 异步确认发布 

异步确认虽然编程逻辑比上两个要复杂，但是**性价比最高**，无论是可靠性还是效率都没得说， 他是**利用回调函数来达到消息可靠性传递**的，这个中间件也是通过函数回调来保证是否投递成功。

![image-20230503130031952](https://raw.githubusercontent.com/195sjin/myBed/master/images202305031300999.png)

```
public static void publishMessageAsync() throws Exception {
	try (Channel channel = RabbitMqUtils.getChannel()) {
		String queueName = UUID.randomUUID().toString();
		channel.queueDeclare(queueName, false, false, false, null);
		//开启发布确认
 		channel.confirmSelect();

/**
* 线程安全有序的一个哈希表，适用于高并发的情况
 * 1.轻松的将序号与消息进行关联
 * 2.轻松批量删除条目 只要给到序列号
 * 3.支持并发访问
 */
 
		ConcurrentSkipListMap<Long, String> outstandingConfirms = new ConcurrentSkipListMap<>();

/**
* 确认收到消息的一个回调
 * 1.消息序列号
 * 2.true 可以确认小于等于当前序列号的消息
 * false 确认当前序列号消息
 */
 
		ConfirmCallback ackCallback = (sequenceNumber, multiple) -> {
			if (multiple) {
				//返回的是小于等于当前序列号的未确认消息 是一个 map
				ConcurrentNavigableMap<Long, String> confirmed = 
				outstandingConfirms.headMap(sequenceNumber, true);
				//清除该部分未确认消息
 				confirmed.clear();
			}else{
				//只清除当前序列号的消息
 				outstandingConfirms.remove(sequenceNumber);
			}
		};
		
			ConfirmCallback nackCallback = (sequenceNumber, multiple) -> {
				String message = outstandingConfirms.get(sequenceNumber);
				System.out.println("发布的消息"+message+"未被确认，序列号"+sequenceNumber);
			};
			
/**
* 添加一个异步确认的监听器
 * 1.确认收到消息的回调
 * 2.未收到消息的回调
 */
 
			channel.addConfirmListener(ackCallback, null);
			
			long begin = System.currentTimeMillis();
			
			for (int i = 0; i < MESSAGE_COUNT; i++) {
				String message = "消息" + i;
/**
* channel.getNextPublishSeqNo()获取下一个消息的序列号
 * 通过序列号与消息体进行一个关联
 * 全部都是未确认的消息体
 */
				outstandingConfirms.put(channel.getNextPublishSeqNo(), message);
				channel.basicPublish("", queueName, null, message.getBytes());		
		}
		long end = System.currentTimeMillis();
		System.out.println("发布" + MESSAGE_COUNT + "个异步确认消息,耗时" + (end - begin) +"ms");
	}
}
```



### 如何处理异步未确认消息 

最好的解决的解决方案就是**把未确认的消息放到一个基于内存的能被发布线程访问的队列**， 比如说用 ConcurrentLinkedQueue 这个队列在 confirm callbacks 与发布线程之间进行消息的传 递。



### 3 种发布确认速度对比 

**单独发布消息** 

​		同步等待确认，简单，但吞吐量非常有限。 

**批量发布消息** 

​		批量同步等待确认，简单，合理的吞吐量，一旦出现问题但很难推断出是那条消息出现了问题。 

**异步处理**

​		最佳性能和资源使用，在出现错误的情况下可以很好地控制，但是实现起来稍微难些



## 交换机

我们将做一些完全不同的事情-我们将消息传达给多个消费者。这种模式称为 ”**发布/订阅**”

![image-20230504100942318](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041009393.png)

### Exchanges

RabbitMQ **消息传递模型的核心思想**是: **生产者生产的消息从不会直接发送到队列**。

实际上，通常生产者甚至都不知道这些消息传递传递到了哪些队列中。 相反，**生产者只能将消息发送到交换机(exchange)**，

交换机工作的内容非常简单，**一方面它接收来 自生产者的消息，另一方面将它们推入队列**。交换机必须确切知道如何处理收到的消息。是应该把这些消息放到特定队列还是说把他们到许多队列中还是说应该丢弃它们。这就的由交换机的类型来决定。



**Exchanges 的类型**

直接(direct), 主题(topic) ,标题(headers) , 扇出(fanout)



**无名Exchange**

> 之前我们对 exchange 一无所知，但仍然能够将消息发送到队列。之前能实现的原因是因为我们使用的是默认交换，我们通过空字符串(“”)进行标识。

![image-20230504095900571](https://raw.githubusercontent.com/195sjin/myBed/master/images202305040959682.png)

第一个参数是交换机的名称。空字符串表示默认或无名称交换机：消息能路由发送到队列中其实是由 routingKey(bindingkey)绑定 key 指定的，如果它存在的话



### 临时队列

队列的名称对我们来说至关重要-我们需要指定我们的消费者去消费哪个队列的消息。

每当我们连接到 Rabbit 时，我们都需要一个全新的空队列，为此我们可以创建一个具有**随机名称**的队列，或者能让服务器为我们选择一个随机队列名称那就更好了。其次**一旦我们断开了消费者的连接，队列将被自动删除**。 

创建临时队列的方式如下: 

```
String queueName = channel.queueDeclare().getQueue();
```



### 绑定(bindings)

什么是 bingding 呢，binding 其实是 exchange 和 queue 之间的**桥梁**，它告诉我们 exchange 和那个队列进行了绑定关系。

**队列只对它绑定的交换机的消息感兴趣**。

绑定用参数：routingKey 来表示也可称该参数为 binding key

创建绑定我们用代码:channel.queueBind(queueName, EXCHANGE_NAME, "routingKey");

**绑定之后的意义由其交换类型决定。**



### Fanout（发布订阅模式）

Fanout 这种类型非常简单。它是将接收到的所有消息广播到它知道的所有队列中。

![image-20230504103357172](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041033225.png)



### Direct exchange

**Fanout** 这种交换类型**并不能给我们带来很大的灵活性**-它只能进行无意识的广播

在这里我们将使用 direct 这种类型来进行替换，这种类型的工作方式是，**消息只去到它绑定的 routingKey 队列中去**。

![image-20230504103338675](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041033722.png)

X 绑定了两个队列，绑定类型是 direct。

队列Q1 绑定键为 orange， 队列 Q2 绑定键有两个:一个绑定键为 black，另一个绑定键为 green. 

在这种绑定情况下，生产者发布消息到 exchange 上，绑定键为 orange 的消息会被发布到队列 Q1。绑定键为 black green 和的消息会被发布到队列 Q2，**其他消息类型的消息将被丢弃**。



### 多重绑定 

如果 exchange 的绑定类型是direct，但是它**绑定的多个队列的 key 如果都相同**，在这种情况下虽然绑定类型是 direct **但是它表现的就和 fanout 有点类似了**，就跟广播差不多

![image-20230504103631691](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041036735.png)



### Topics（主题模式）

direct存在局限性-比方说我们想接收的日志类型有 info.base 和 info.advantage，某个队列只想 info.base 的消息，那这个时候direct 就办不到了。这个时候 就只能使用 topic 类型



**Topics的要求**

发送到类型是 topic 交换机的消息的 routing_key不能随意写，必须满足一定的要求，它**必须是一个单词列表，以点号分隔开**。

这些单词可以是任意单词，比如说："stock.usd.nyse", "nyse.vmw", "quick.orange.rabbit".这种类型的。当然这个单词列表最多不能超过 255 个字节。

> 在这个规则列表中，其中有两个替换符是大家需要注意的
>
> ***(星号)可以代替一个单词** 
>
> **(井号)可以替代零个或多个单词**



**案例**

Q1-->绑定的是 中间带 orange 带 3 个单词的字符串(*.orange.*) 

Q2-->绑定的是 最后一个单词是 rabbit 的 3 个单词(*.*.rabbit) 	第一个单词是 lazy 的多个单词(lazy.#)

![image-20230504104239458](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041042501.png)

> 当一个队列绑定键是#,那么这个队列将接收所有数据，就有点像 fanout 了 
>
> 如果队列绑定键当中没有#和*出现，那么该队列绑定类型就是 direct 了



## 死信队列

死信，顾名思义就是无法被消费的消息

一般来说，producer 将消息投递到 broker 或者直接到queue 里了，consumer 从 queue 取出消息 进行消费，但某些时候由于特定的原因导致 **queue 中的某些消息无法被消费**，这样的消息如果没有 后续的处理，就变成了死信，有死信自然就有了死信队列。



应用场景:

为了**保证订单业务的消息数据不丢失**，需要使用到 RabbitMQ 的死信队列机制，当消息消费发生异常时，将消息投入死信队列中.

还有比如说: 用户在商城下单成功并点击去支付后在指定时间未支付时自动失效



**死信的来源**

消息 TTL 过期 

队列达到最大长度(队列满了，无法再添加数据到 mq 中) 

消息被拒绝(basic.reject 或 basic.nack)并且 requeue=false.



**实战**

![image-20230504113008366](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041130413.png)

主要就是如何把正常队列的消息转发到死信交换机

```
//正常队列绑定死信队列信息
Map<String, Object> params = new HashMap<>();
//正常队列设置死信交换机 参数 key 是固定值
params.put("x-dead-letter-exchange", DEAD_EXCHANGE);
//正常队列设置死信 routing-key 参数 key 是固定值
params.put("x-dead-letter-routing-key", "lisi");
String normalQueue = "normal-queue";
channel.queueDeclare(normalQueue, false, false, false, params);
```

如果要是模拟队列达到最大长度需要添加设置

```
//设置正常队列长度的限制
parmas.put("x-max-length",6);
```



## 延迟队列

**基于死信队列**

队列内部是有序的，最重要的特性就体现在它的延时属性上，延时队列中的元素是希望在指定时间到了以后或之前取出和处理，简单来说，**延时队列就是用来存放需要在指定时间被处理的元素的队列。**



### 使用场景

1.订单在十分钟之内未支付则自动取消

2.新创建的店铺，如果在十天内都没有上传过商品，则自动发送消息提醒。 

3.用户注册成功后，如果三天内没有登陆则进行短信提醒。 

4.用户发起退款，如果三天内没有得到处理则通知相关运营人员。 

5.预定会议后，需要在预定的时间点前十分钟通知各个与会人员参加会议



**需要在某个事件发生之后或者之前的指定时间点完成某一项任务**

> 发生订单生成事件，在十分钟之后检查该订单支付状态，然后将未支付的订单进行关闭；看起来似乎 **使用定时任务**，一直轮询数据，每秒查一次，取出需要被处理的数据，然后处理不就完事了吗？**如果数据量比较少，确实可以这样做**，比如：对于“如果账单一周内未支付则进行自动结算”这样的需求， 如果对于时间不是严格限制，而是宽松意义上的一周，那么每天晚上跑个定时任务检查一下所有未支 付的账单，确实也是一个可行的方案。但对于**数据量比较大**，并且时效性较强的场景，如：“订单十 分钟内未支付则关闭“，短期内未支付的订单数据可能会有很多，活动期间甚至会达到百万甚至千万级别，对这么**庞大的数据量仍旧使用轮询的方式显然是不可取的**，很可能在一秒内无法完成所有订单的检查，同时会给数据库带来很大压力，无法满足业务要求而且性能低下。

![image-20230504120545934](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041205004.png)



### RabbitMQ中的TTL

TTL 是 RabbitMQ 中一个**消息或者队列的属性**，表明一条消息或者该队列中的所有 消息的最大存活时间，单位是毫秒

如果一条消息设置了 TTL 属性或者进入了设置TTL 属性的队列，那么这 条消息如果在TTL 设置的时间内没有被消费，则会成为"死信"。如果同时配置了队列的TTL 和消息的 TTL，那么较小的那个值将会被使用，有两种方式设置 TTL。



**消息设置TTL**

![image-20230504120900078](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041209109.png)



**队列设置TTL**

在创建队列的时候设置队列的“x-message-ttl”属性

![image-20230504120938734](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041209778.png)



**区别**

如果设置了队列的 TTL 属性，那么一旦消息过期，就会被队列丢弃(如果配置了死信队列被丢到死信队 列中)

消息的TTL，消息即使过期，也不一定会被马上丢弃，因为**消息是否过期是在即将投递到消费者之前判定的**，如果当前队列有严重的消息积压情况，则已过期的消息也许还能存活较长时间

> 另外，还需 要注意的一点是，如果不设置 TTL，表示消息永远不会过期，如果将 TTL 设置为 0，则表示除非此时可以直接投递该消息到消费者，否则该消息将会被丢弃。



此利用 RabbitMQ 实现延时队列的两大要素已经集齐，死信队列，TTL



延时队列，不就是想要消息延迟多久被处理吗，TTL 则刚好能让消息在延迟多久之后成为死信，另一方面， 成为死信的消息都会被投递到死信队列里，这样只需要消费者一直消费死信队列里的消息就完事了，因为里面的消息都是希望被立即处理的消息



### 队列TTL

创建两个队列 QA 和 QB，两者队列 TTL 分别设置为 10S 和 40S，然后在创建一个交换机 X 和死信交 换机 Y，它们的类型都是direct，创建一个死信队列 QD

![image-20230504140317208](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041403293.png)



与SpringBoot整合之后，使用配置类来声明交换机与队列以及它们之间的关系

**配置类**

```
@Configuration
public class TtlQueueConfig {
	public static final String X_EXCHANGE = "X";
	public static final String QUEUE_A = "QA";
	public static final String QUEUE_B = "QB";
	public static final String Y_DEAD_LETTER_EXCHANGE = "Y";
	public static final String DEAD_LETTER_QUEUE = "QD";
	
	// 声明 xExchange
	@Bean("xExchange")
	public DirectExchange xExchange(){
		return new DirectExchange(X_EXCHANGE);
	}
	// 声明 yExchange
	@Bean("yExchange")
	public DirectExchange yExchange(){
		return new DirectExchange(Y_DEAD_LETTER_EXCHANGE);
	}
	//声明队列 A ttl 为 10s 并绑定到对应的死信交换机
	@Bean("queueA")
	public Queue queueA(){
		Map<String, Object> args = new HashMap<>(3);
		//声明当前队列绑定的死信交换机
		args.put("x-dead-letter-exchange", Y_DEAD_LETTER_EXCHANGE);
		//声明当前队列的死信路由 key
		args.put("x-dead-letter-routing-key", "YD");
		//声明队列的 TTL
		args.put("x-message-ttl", 10000);
		return QueueBuilder.durable(QUEUE_A).withArguments(args).build();
	}
	// 声明队列 A 绑定 X 交换机
	@Bean
	public Binding queueaBindingX(@Qualifier("queueA") Queue queueA,
								@Qualifier("xExchange") DirectExchange xExchange){
		return BindingBuilder.bind(queueA).to(xExchange).with("XA");
	}
	//声明队列 B ttl 为 40s 并绑定到对应的死信交换机
	@Bean("queueB")
	public Queue queueB(){
		Map<String, Object> args = new HashMap<>(3);
		//声明当前队列绑定的死信交换机
		args.put("x-dead-letter-exchange", Y_DEAD_LETTER_EXCHANGE);
		//声明当前队列的死信路由 key
		args.put("x-dead-letter-routing-key", "YD");
		//声明队列的 TTL
		args.put("x-message-ttl", 40000);
		return QueueBuilder.durable(QUEUE_B).withArguments(args).build();
	}
	//声明队列 B 绑定 X 交换机
	@Bean
	public Binding queuebBindingX(@Qualifier("queueB") Queue queue1B,
							@Qualifier("xExchange") DirectExchange xExchange){
		return BindingBuilder.bind(queue1B).to(xExchange).with("XB");
	}
	//声明死信队列 QD
	@Bean("queueD")
	public Queue queueD(){
		return new Queue(DEAD_LETTER_QUEUE);
	}
	//声明死信队列 QD 绑定关系
	@Bean
	public Binding deadLetterBindingQAD(@Qualifier("queueD") Queue queueD,
								@Qualifier("yExchange") DirectExchange yExchange){
		return BindingBuilder.bind(queueD).to(yExchange).with("YD");
	}
}
```



### 优化

如果这样使用的话，岂不是每增加一个新的时间需求，就要新增一个队列，这里只有 10S 和 40S 两个时间选项，如果需要一个小时后处理，那么就需要增加TTL 为一个小时的队列，如果是预定会议室然 后提前通知这样的场景，岂不是要增加无数个队列才能满足需求？



里新增了一个队列 QC,绑定关系如下,该队列不设置TTL 时间

![image-20230504141357142](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041413186.png)



配置文件类

```
@Component
public class MsgTtlQueueConfig {
	public static final String Y_DEAD_LETTER_EXCHANGE = "Y";
	public static final String QUEUE_C = "QC";
	//声明队列 C 死信交换机
	@Bean("queueC")
	public Queue queueB(){
		Map<String, Object> args = new HashMap<>(3);
		//声明当前队列绑定的死信交换机
		args.put("x-dead-letter-exchange", Y_DEAD_LETTER_EXCHANGE);
		//声明当前队列的死信路由 key
		args.put("x-dead-letter-routing-key", "YD");
		//没有声明 TTL 属性
		return QueueBuilder.durable(QUEUE_C).withArguments(args).build();
	}
	//声明队列 C 绑定 X 交换机
	@Bean
	public Binding queuecBindingX(@Qualifier("queueC") Queue queueC,
							@Qualifier("xExchange") DirectExchange xExchange){
			return BindingBuilder.bind(queueC).to(xExchange).with("XC");
	}
}
```

![image-20230504142512020](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041425060.png)

看起来似乎没什么问题，但是在最开始的时候，就介绍过如果使用在消息属性上设置 TTL 的方式，消 息可能并不会按时“死亡“，因为 **RabbitMQ 只会检查第一个消息是否过期**，如果过期则丢到死信队列， **如果第一个消息的延时时长很长，而第二个消息的延时时长很短，第二个消息并不会优先得到执行**。



### RabbitMQ插件实现延迟队列

rabbitmq_delayed_message_exchange插件的安装，**对版本是有要求**的

需要添加在plugins目录下

添加之后执行以下三条命令

```
cd /usr/lib/rabbitmq/lib/rabbitmq_server-3.8.8/plugins
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
systemctl restart rabbitmq-server
```

再次登录之后，如果exchange的类型中出现：x-delayed-message，说明该插件安装成功！

![image-20230504144138333](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041442841.png)



新增了一个队列delayed.queue,一个自定义交换机 delayed.exchange，绑定关系如下

![image-20230504144657337](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041446376.png)



**配置文件类**

在我们自定义的交换机中，这是一种**新的交换类型**，该类型消息支持**延迟投递机制** 消息传递后并 不会立即投递到目标队列中，而是存储在 mnesia(一个分布式数据系统)表中，当达到投递时间时，才 投递到目标队列中。

```
@Configuration
public class DelayedQueueConfig {
	public static final String DELAYED_QUEUE_NAME = "delayed.queue";
	public static final String DELAYED_EXCHANGE_NAME = "delayed.exchange";
	public static final String DELAYED_ROUTING_KEY = "delayed.routingkey";
	@Bean
	public Queue delayedQueue() {
		return new Queue(DELAYED_QUEUE_NAME);
	}
	//自定义交换机 我们在这里定义的是一个延迟交换机
	@Bean
	public CustomExchange delayedExchange() { 
		Map<String, Object> args = new HashMap<>();
		//自定义交换机的类型
		args.put("x-delayed-type", "direct");
		return new CustomExchange(DELAYED_EXCHANGE_NAME, "x-delayed-message", true, false,args);
	}
	@Bean
	public Binding bindingDelayedQueue(@Qualifier("delayedQueue") Queue queue,
							@Qualifier("delayedExchange") CustomExchange delayedExchange) {
		return BindingBuilder.bind(queue).to(delayedExchange).with(DELAYED_ROUTING_KEY).noargs();
	}
}
```



### 总结

延时队列在需要延时处理的场景下非常有用，使用 RabbitMQ 来实现延时队列可以很好的利用 RabbitMQ 的特性，如：**消息可靠发送**、**消息可靠投递**、**死信队列**来**保障消息至少被消费一次以及未被正确处理的消息不会被丢弃**。另外，通过 RabbitMQ 集群的特性，可以很好的解决单点故障问题，不会因为单个节点挂掉导致延时队列不可用或者消息丢失。 

当然，延时队列还有很多其它选择，比如利用 Java 的 DelayQueue，利用 Redis 的 zset，利用 Quartz 或者利用 kafka 的时间轮，这些方式各有特点,看需要适用的场景



## 发布确认高级

在生产环境中由于一些**不明原因，导致 rabbitmq 重启，在 RabbitMQ 重启期间生产者消息投递失败， 导致消息丢失，需要手动处理和恢复**。于是，我们开始思考，如何才能进行 RabbitMQ 的消息可靠投递呢？ 特 别是在这样比较极端的情况，RabbitMQ 集群不可用的时候，无法投递的消息该如何处理呢



### SpringBoot版本

**方案**

![image-20230504150359951](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041504006.png)



**架构**

![image-20230504150453654](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041504694.png)



**配置文件**

在配置文件当中需要添加

```
 spring.rabbitmq.publisher-confirm-type=correlated
```

NONE 禁用发布确认模式，是默认值 

CORRELATED 发布消息成功到交换器后会触发回调方法  

SIMPLE 经测试有两种效果

其一效果和 CORRELATED 值一样会触发回调方法 

其二在发布消息成功后使用 rabbitTemplate 调用 waitForConfirms 或 waitForConfirmsOrDie 方法 等待 broker 节点返回发送结果，根据返回结果来判定下一步的逻辑

> 要注意的点是 waitForConfirmsOrDie 方法如果返回 false 则会关闭 channel，则接下来无法发送消息到 broker



**配置类**

```
@Configuration
public class ConfirmConfig {
	public static final String CONFIRM_EXCHANGE_NAME = "confirm.exchange";
	public static final String CONFIRM_QUEUE_NAME = "confirm.queue";
	//声明业务 Exchange
	@Bean("confirmExchange")
	public DirectExchange confirmExchange(){
		return new DirectExchange(CONFIRM_EXCHANGE_NAME);
	}
	// 声明确认队列
	@Bean("confirmQueue")
	public Queue confirmQueue(){
		return QueueBuilder.durable(CONFIRM_QUEUE_NAME).build();
	}
	// 声明确认队列绑定关系
	@Bean
	public Binding queueBinding(@Qualifier("confirmQueue") Queue queue,
						@Qualifier("confirmExchange") DirectExchange exchange){
		return BindingBuilder.bind(queue).to(exchange).with("key1");
	}
}
```



**回调实现类**

```
@Component
@Slf4j
public class MyCallBack implements RabbitTemplate.ConfirmCallback {

@Autowired
private RabbitTemplate rabbitTemplate;

@PostConstruct
public void init(){
//注入
rabbitTemplate.setConfirmCallback(this);
}

/**
* 交换机不管是否收到消息的一个回调方法
发消息 交换机收到了 回调
 * CorrelationData 保存回调信息的id及相关信息
 * 交换机收到消息 ack = true
 * cause null
发消息 交换机接收失败 回调
*CorrelationData 保存回调信息的id及相关信息
*交换机收到消息 ack = false
*cause 失败的原因
 */
@Override
public void confirm(CorrelationData correlationData, boolean ack, String cause) {
	String id=correlationData!=null?correlationData.getId():"";
	if(ack){
		log.info("交换机已经收到 id 为:{}的消息",id);
	}else{
		log.info("交换机还未收到 id 为:{}消息,由于原因:{}",id,cause);
		}
	}	
}
```



### 回退消息

**Mandatory 参数** 

**在仅开启了生产者确认机制的情况下，交换机接收到消息后，会直接给消息生产者发送确认消息，如果发现该消息不可路由，那么消息会被直接丢弃，此时生产者是不知道消息被丢弃这个事件的。**

那么如何 让无法被路由的消息帮我想办法处理一下？最起码通知我一声，我好自己处理啊。通过设置 mandatory 参数可以在当消息传递过程中不可达目的地时将消息返回给生产者。



需要在配置文件中添加

```
spring.rabbitmq.publisher-returns=true
```



```
/**
* true：
* 交换机无法将消息进行路由时，会将该消息返回给生产者
* false：
* 如果发现消息无法进行路由，则直接丢弃
*/
rabbitTemplate.setMandatory(true);
```



### 备份交换机

有了 mandatory 参数和回退消息，我们获得了对无法投递消息的感知能力，有机会在生产者的消息无法被投递时发现并处理。

但有时候，我们并不知道该如何处理这些无法路由的消息，最多打个日志，然后触发报警，再来手动处理。而通过日志来处理这些无法路由的消息是很不优雅的做法，特别是当生产者所在的服务有多台机器的时候，手动复制日志会更加麻烦而且容易出错。而且设置 mandatory 参数会增 加生产者的复杂性，需要添加处理这些被退回的消息的逻辑。

如果既不想丢失消息，又不想增加生产者的 复杂性，该怎么做呢？前面在设置死信队列的文章中，我们提到，可以为队列设置死信交换机来存储那些处理失败的消息，可是这些不可路由消息根本没有机会进入到队列，因此无法使用死信队列来保存消息。 

在 RabbitMQ 中，有一种**备份交换机的机制**存在，可以很好的应对这个问题。什么是备份交换机呢？

备份交换机可以理解为 RabbitMQ 中交换机的“备胎”，当我们为某一个交换机声明一个对应的备份交换机时，就是为它创建一个备胎，当**交换机接收到一条不可路由消息时，将会把这条消息转发到备份交换机中，由备份交换机来进行转发和处理**，通常备份交换机的类型为 Fanout ，这样就能把所有消息都投递到与其绑定的队列中，然后我们在备份交换机下绑定一个队列，这样所有那些原交换机无法被路由的消息，就会都进入这个队列了。当然，我们**还可以建立一个报警队列，用独立的消费者来进行监测和报警。**



**架构**

![image-20230504154857789](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041548838.png)



```
//声明确认 Exchange 交换机的备份交换机
@Bean("confirmExchange")
public DirectExchange confirmExchange(){
	ExchangeBuilder exchangeBuilder = ExchangeBuilder
	.directExchange(CONFIRM_EXCHANGE_NAME)
	.durable(true)
    //设置该交换机的备份交换机
    .withArgument("alternate-exchange", BACKUP_EXCHANGE_NAME);
  return (DirectExchange)exchangeBuilder.build();
}
```



mandatory 参数与备份交换机可以一起使用的时候，如果两者同时开启，消息究竟何去何从？谁优先级高，经过上面结果显示答案是**备份交换机优先级高。**



## 其他知识点

### 幂等性

**用户对于同一操作发起的一次请求或者多次请求的结果是一致的，不会因为多次点击而产生了副作用。**

>举个最简单的例子，那就是支付，用户购买商品后支付，支付扣款成功，但是返回结果的时候网络异常， 此时钱已经扣了，用户再次点击按钮，此时会进行第二次扣款，返回结果成功，用户查询余额发现多扣钱 了，流水记录也变成了两条。
>
>在以前的单应用系统中，我们只需要把数据操作放入事务中即可，发生错误立即回滚，但是再响应客户端的时候也有可能出现网络中断或者异常等等



**消息重复消费**

消费者在消费 MQ 中的消息时，MQ 已把消息发送给消费者，消费者在给MQ 返回 ack 时网络中断， 故 MQ 未收到确认信息，该条消息会重新发给其他的消费者，或者在网络重连后再次发送给该消费者，但实际上该消费者已成功消费了该条消息，造成消费者消费了重复的消息。



**解决思路**

MQ 消费者的幂等性的解决一般使用**全局 ID** 或者写个**唯一标识**比如时间戳或者 UUID 或者**订单消费者消费 MQ 中的消息也可利用 MQ 的该 id 来判断**，或者可**按自己的规则生成一个全局唯一 id**，每次消费消息时用该 id 先判断该消息是否已消费过。



**消费端的幂等性保障**

在海量订单生成的业务高峰期，生产端有可能就会重复发送了消息，这时候消费端就要实现幂等性， 这就意味着我们的消息永远不会被消费多次，即使我们收到了一样的消息。

业界主流的幂等性有两种操作:

a. 唯一 ID+指纹码机制,利用数据库主键去重

b.利用 redis 的原子性去实现



**唯一ID+指纹码机制**

指纹码:我们的一些规则或者时间戳加别的服务给到的唯一信息码,它并**不一定是我们系统生成的**，基本都是由我们的业务规则拼接而来，但是**一定要保证唯一性**，然后就利用查询语句进行判断这个 id 是否存 在数据库中

**优势就是实现简单就一个拼接，然后查询判断是否重复**；

**劣势就是在高并发时，如果是单个数据库就会有写入性能瓶颈**

当然也可以采用分库分表提升性能，但也不是我们最推荐的方式。



**Redis 原子性** 

利用 redis 执行 **setnx 命令**，**天然具有幂等性**。从而实现不重复消费



### 优先级队列

>在我们系统中有一个**订单催付**的场景，我们的客户在天猫下的订单,淘宝会及时将订单推送给我们，如果在用户设定的时间内未付款那么就会给用户推送一条短信提醒，很简单的一个功能对吧，但是，tmall 商家对我们来说，肯定是要分大客户和小客户的对吧，比如像苹果，小米这样大商家一年起码能给我们创造很大的利润，所以理应当然，他们的订单必须得到优先处理
>
>而曾经我们的后端系统是使用 redis 来存放的定时轮询，大家都知道 redis 只能用 List 做一个简简单单的消息队列，并不能实现一个优先级的场景，所以订单量大了后采用 RabbitMQ 进行改造和优化,如果发现是大客户的订单给一个相对比较高的优先级， 否则就是默认优先级。

![image-20230504170352712](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041703774.png)



**控制台页面添加**

![image-20230504170741944](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041707990.png)



**队列中代码添加优先级**

![image-20230504170806607](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041708654.png)



**消息中代码添加优先级**

```
AMQP.BasicProperties properties = new AMQP.BasicProperties().builder().priority(5).build();
```



> 要让队列实现优先级需要做的事情有如下事情:
>
> **队列需要设置为优先级队列**，**消息需要设置消息的优先级**，**消费者需要等待消息已经发送到队列中才去消费**因为，这样才有机会对消息进行排序



### 惰性队列

![image-20230504171351914](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041713983.png)

RabbitMQ 从 3.6.0 版本开始引入了惰性队列的概念.

惰性队列会尽可能的**将消息存入磁盘中**，而**在消费者消费到相应的消息时才会被加载到内存中**

它的一个重要的设计目标是能够**支持更长的队列，即支持更多的消息存储**。当消费者由于各种各样的原因(比如消费者下线、宕机亦或者是由于维护而关闭等)而致使**长时间内不能消费消息造成堆积时，惰性队列就很有必要了**。 

> 默认情况下，当生产者将消息发送到 RabbitMQ 的时候，队列中的消息会尽可能的存储在内存之中， 这样可以更加快速的将消息发送给消费者。即使是持久化的消息，在被写入磁盘的同时也会在内存中驻留 一份备份。
>
> 当 RabbitMQ 需要释放内存的时候，会将内存中的消息换页至磁盘中，这个操作会耗费较长的时间，也会阻塞队列的操作，进而无法接收新的消息。虽然 RabbitMQ 的开发者们一直在升级相关的算法， 但是效果始终不太理想，尤其是在消息量特别大的时候。





**两种模式**

**队列具备两种模式：default 和 lazy**。

**默认的为default 模式**，在3.6.0 之前的版本无需做任何变更。

lazy 模式即为惰性队列的模式，可以通过调用 channel.queueDeclare 方法的时候在参数中设置，也可以通过 Policy 的方式设置

如果一个队列同时使用这两种方式设置的话，那么 **Policy 的方式具备更高的优先级**

> 如果要通过声明的方式改变已有队列的模式的话，那么只能先删除队列，然后再重新声明一个新的。 



在队列声明的时候可以通过“x-queue-mode”参数来设置队列的模式，取值为“default”和“lazy”。

下面示例中演示了一个惰性队列的声明细节： 

```
Map args = new HashMap(); 

args.put("x-queue-mode", "lazy"); 

channel.queueDeclare("myqueue", false, false, false, args);
```



**内存开销对比** 

![image-20230504165813973](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041658037.png)



**在发送 1 百万条消息，每条消息大概占 1KB 的情况下，普通队列占用内存是 1.2GB，而惰性队列仅仅占用 1.5MB**

为什么差距这么大，在惰性队列中的消息丢失了吗？不是的，因为惰性队列把消息放到磁盘里，**在内存里面存放的就只是消息的索引**



## RabbitMQ集群

![image-20230504172147621](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041721684.png)



### clustering

**搭建步骤**

```
1.修改 3 台机器的主机名称
vim /etc/hostname

2.配置各个节点的 hosts 文件，让各个节点都能互相识别对方
vim /etc/hosts
10.211.55.74 node1
10.211.55.75 node2
10.211.55.76 node3

3.以确保各个节点的 cookie 文件使用的是同一个值
在 node1 上执行远程操作命令
scp /var/lib/rabbitmq/.erlang.cookie root@node2:/var/lib/rabbitmq/.erlang.cookie
scp /var/lib/rabbitmq/.erlang.cookie root@node3:/var/lib/rabbitmq/.erlang.cookie

4.启动 RabbitMQ 服务,顺带启动 Erlang 虚拟机和 RbbitMQ 应用服务(在三台节点上分别执行以下命令)
rabbitmq-server -detached

5.在节点 2 执行
rabbitmqctl stop_app
(rabbitmqctl stop 会将Erlang 虚拟机关闭，rabbitmqctl stop_app 只关闭 RabbitMQ 服务)
rabbitmqctl reset
rabbitmqctl join_cluster rabbit@node1
rabbitmqctl start_app(只启动应用服务)

6.在节点 3 执行
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl join_cluster rabbit@node2
rabbitmqctl start_app

7.集群状态
rabbitmqctl cluster_status

8.需要重新设置用户
创建账号
rabbitmqctl add_user admin 123
设置用户角色
rabbitmqctl set_user_tags admin administrator
设置用户权限
rabbitmqctl set_permissions -p "/" admin ".*" ".*" ".*"

9.解除集群节点(node2 和 node3 机器分别执行)
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl start_app
rabbitmqctl cluster_status
rabbitmqctl forget_cluster_node rabbit@node2(node1 机器上执行)
```



### 镜像队列

如果 RabbitMQ 集群中只有一个 Broker 节点，那么该节点的失效将导致整体服务的临时性不可用，并 且也可能会导致消息的丢失。

可以将所有消息都设置为持久化，并且对应队列的durable属性也设置为true，但是这样仍然无法避免由于缓存导致的问题：因为消息在发送之后和被写入磁盘井执行刷盘动作之间存在一 个短暂却会产生问题的时间窗。通过 publisherconfirm 机制能够确保客户端知道哪些消息己经存入磁盘，尽管如此，一般不希望遇到因单点故障导致的服务不可用。

引入镜像队列(Mirror Queue)的机制，可以**将队列镜像到集群中的其他 Broker 节点之上**，如果集群中的一个节点失效了，队列能自动地切换到镜像中的另一个节点上以保证服务的可用性。



**搭建步骤**

1.启动三台集群节点
2.随便找一个节点添加 policy

![image-20230504173553224](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041735279.png)

3.在 node1 上创建一个队列发送一条消息，队列存在镜像队列

![image-20230504173623893](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041736943.png)

4.停掉 node1 之后发现 node2 成为镜像队列

![image-20230504173706655](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041737710.png)

5.就算整个集群只剩下一台机器了 依然能消费队列里面的消息 

说明队列里面的消息被镜像队列传递到相应机器里面了



### Haproxy+Keepalive 实现高可用负载均衡

![image-20230504174421850](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041744911.png)



**Haproxy 实现负载均衡** 

HAProxy 提供高可用性、负载均衡及基于TCP、HTTP 应用的代理，支持虚拟主机，它是免费、快速并 且可靠的一种解决方案，包括 Twitter,Reddit,StackOverflow,GitHub 在内的多家知名互联网公司在使用。

HAProxy 实现了一种事件驱动、单一进程模型，此模型支持非常大的井发连接数。



> 扩展 nginx,lvs,haproxy 之间的区别: http://www.ha97.com/5646.html



**搭建步骤**

1.下载 haproxy(在 node1 和 node2) 

​		yum -y install haproxy 

2.修改 node1 和 node2 的 haproxy.cfg

​		vim /etc/haproxy/haproxy.cfg

需要修改红色 IP 为当前机器 IP

![image-20230504174857728](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041748774.png)

3.在两台节点启动 haproxy

​		haproxy -f /etc/haproxy/haproxy.cfg

​		ps -ef | grep haproxy

4.访问地址

​		http://10.211.55.71:8888/stats



**Keepalived 实现双机(主备)热备**

如果前面配置的 HAProxy 主机突然宕机或者网卡失效，那么虽然 RbbitMQ 集群没有任何故障，但是对于外界的客户端来说**所有的连接都会被断开**，结果将是灾难性的，为了确保负载均衡服务的可靠性同样显得十分重要，这里就要引入 Keepalived **它能够通过自身健康检查、资源接管功能做高可用(双机热备)，实现故障转移**.



**搭建步骤**

```
1.下载 keepalived
yum -y install keepalived

2.节点 node1 配置文件
vim /etc/keepalived/keepalived.conf
把资料里面的 keepalived.conf 修改之后替换

3.节点 node2 配置文件
需要修改global_defs 的 router_id,如:nodeB
其次要修改 vrrp_instance_VI 中 state 为"BACKUP"；
最后要将priority 设置为小于 100 的值

4.添加 haproxy_chk.sh
(为了防止 HAProxy 服务挂掉之后 Keepalived 还在正常工作而没有切换到 Backup 上，所以这里需要编写一个脚本来检测 HAProxy 务的状态,当 HAProxy 服务挂掉之后该脚本会自动重启HAProxy 的服务，如果不成功则关闭 Keepalived 服务，这样便可以切换到 Backup 继续工作)
vim /etc/keepalived/haproxy_chk.sh(可以直接上传文件)
修改权限 chmod 777 /etc/keepalived/haproxy_chk.sh

5.启动 keepalive 命令(node1 和 node2 启动)
systemctl start keepalived

6. 观察 Keepalived 的日志
tail -f /var/log/messages -n 200

7.观察最新添加的 vip
ip add show

8. node1 模拟 keepalived 关闭状态
systemctl stop keepalived

9. 使用 vip 地址来访问 rabbitmq 集群
```



### Federation Exchange

(broker 北京)，(broker 深圳)彼此之间相距甚远，网络延迟是一个不得不面对的问题。

有一个在北京的业务(Client 北京) 需要连接(broker 北京)，向其中的交换器 exchangeA 发送消息，此时的网络延迟很小， (Client 北京)可以迅速将消息发送至 exchangeA 中，就算在开启了 publisherconfirm 机制或者事务机制的情况下，也可以迅速收到确认信息。

此时又有个在深圳的业务(Client 深圳)需要向 exchangeA 发送消息，那么(Client 深圳) (broker 北京)之间有很大的网络延迟，(Client 深圳) 将发送消息至 exchangeA 会经历一定 的延迟，尤其是在开启了 publisherconfirm 机制或者事务机制的情况下，(Client 深圳) 会等待很长的延迟 时间来接收(broker 北京)的确认信息，进而必然造成这条发送线程的性能降低，甚至造成一定程度上的阻塞。 

将业务(Client 深圳)部署到北京的机房可以解决这个问题，但是如果(Client 深圳)调用的另些服务都部署在深圳，那么又会引发新的时延问题，总不见得将所有业务全部部署在一个机房，那么容灾又何以实现？ 这里使用 Federation 插件就可以很好地解决这个问题.







### Federation Queue

联邦队列可以在多个 Broker 节点(或者集群)之间为单个队列提供均衡负载的功能。一个联邦队列可以 连接一个或者多个上游队列(upstream queue)，并从这些上游队列中获取消息以满足本地消费者消费消息 的需求。

![image-20230504175635451](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041756502.png)



### Shovel

Federation 具备的数据转发功能类似，Shovel 够可靠、持续地从一个 Broker 中的队列(作为源端，即 source)**拉取数据**并**转发**至另一个 Broker 中的交换器(作为目的端，即 destination)。

作为源端的队列和作为目的端的交换器可以同时位于同一个 Broker，也可以位于不同的 Broker 上。

Shovel 可以翻译为"铲子"，是 一种比较形象的比喻，这个"铲子"可以将消息从一方"铲子"另一方。Shovel 行为就像优秀的客户端应用程 序能够负责连接源和目的地、负责消息的读写及负责连接失败问题的处理。

![image-20230504175809996](https://raw.githubusercontent.com/195sjin/myBed/master/images202305041758047.png)