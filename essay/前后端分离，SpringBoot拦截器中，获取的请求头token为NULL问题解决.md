## 背景

因为近期要去东软参加比赛，需要做出来一个项目，前后端分离

总体逻辑就是登录之后后端返回给一个token，登录之后的一切都需要验证这个token

## 问题

验证token是使用拦截器，也就是除了登录的所有请求都需要验证请求头里面有没有token

后端也设置了跨域，前端也能得到token

### 拦截器代码

```java
 @Override
 public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("Token");
        log.debug(token);
        log.debug(request.getRequestURI() + "需要验证" + token);

        if (token != null){
            try {
                jwtUtil.parseToken(token);
                log.debug(request.getRequestURI() + "验证通过");
                return true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        log.debug(request.getRequestURI() + "验证失败");

        response.setContentType("application/json;charset=utf-8");
        Result<Object> fail = Result.fail(20003, "jwt无效，请重新登录");
        response.getWriter().write(JSON.toJSONString(fail));
        return false;//拦截
    }
```

### 拦截器配置

```java
   @Override
    public void addInterceptors(InterceptorRegistry registry) {
        InterceptorRegistration registration = registry.addInterceptor(jwtValidateInterceptor);
        registration.addPathPatterns("/**").excludePathPatterns(
                "/supervisor/login",
                "/admin/login",
                "/admin/info",
                "/supervisor/info",
                "/staff/login",
                "/staff/info",
                "/supervisor/register"
        );
    }
```

在请求中的请求头也发现了有token，但是后端拦截到这个请求，去请求头里面找不到token，检查控制台就是token为null

这就是很费解

逻辑都没出现问题

## 原因

在请求某一资源的时候，浏览器发送了两个请求，第一个是OPTIONS请求，第二个才是真正的GET/POST...请求

在OPTIONS请求中，不会有请求头的参数，所以在拦截器上获取请求头为null，更别说request.getHeader("Token")了，我们的第一次请求不能通过，就不会获取第二次的请求GET/POSt...

**第一次请求不带参数，第二次请求才会带参数**

### OPTIONS请求是什么？

预检请求（Preflight Request）用于检查实际请求是否可以被服务器所接受。当发生跨域请求时，浏览器会自动发起一个预检请求（OPTIONS请求），询问服务器是否允许实际请求（例如GET、POST）的发起。预检请求中携带了一些预检信息（Preflight Information），用于告知服务器实际请求的详细信息，例如请求的方法、请求头、请求体等等。

预检请求的主要目的是为了安全，因为跨域请求涉及到多个域名，而不同域名的安全策略可能不同。预检请求可以让服务器在实际请求发起前进行安全检查，以避免安全风险的出现。

预检请求的流程如下：

发起预检请求（OPTIONS请求）
服务器返回预检响应，告知浏览器是否允许实际请求的发起
如果服务器允许实际请求的发起，则浏览器发起实际请求（例如GET、POST请求）
预检请求中的预检信息包括以下内容：

请求方法：例如GET、POST等
请求头：例如Content-Type、Authorization等
请求体：例如发送的数据内容
跨域源：例如请求的目标域名和端口号
预检请求中的预检信息不包括cookie，因为cookie可能包含敏感信息。如果需要在跨域请求中携带cookie，需要在服务器端设置相应的响应头（例如Access-Control-Allow-Credentials）和请求头（例如withCredentials）来进行配置。

## 解决

在拦截器中，如果请求为OPTIONS请求，就立刻放行，表示可以正常访问，也就是可以让它可以正常发送GET/POST...

也就是在自己拦截器中添加以下代码即可解决问题

```java
if(HttpMethod.OPTIONS.toString().equals(request.getMethod())){
            log.debug("OPTIONS请求，放行");
            return true;
        }
```

