<template>
  <el-row v-highlight>
    <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
      <!-- <el-card v-html="content"></el-card> -->
      <el-card>
        <div id="markdown-body">
          <h2 id="%F0%9F%8E%A8-%E5%89%8D%E8%A8%80" tabindex="-1">🎨 前言 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E5%89%8D%E8%A8%80"></a></h2>
          <p>本篇文章有些概念性的东西，是结合自己的理解表达出来的，若有些理解不到位的地方。希望掘友们多多指教，谢谢大家。</p>
          <p>红包献上 🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧🧧</p>
          <p><img src="https://hhmax.oss-cn-guangzhou.aliyuncs.com/img/su7_1.jpg" alt=""></p>
          <h2 id="%F0%9F%8E%A8-%E6%9C%80%E5%B0%8F%E5%8D%95%E5%85%83%E9%85%8D%E7%BD%AE" tabindex="-1">🎨 最小单元配置 <a
              class="header-anchor" href="#%F0%9F%8E%A8-%E6%9C%80%E5%B0%8F%E5%8D%95%E5%85%83%E9%85%8D%E7%BD%AE"></a>
          </h2>
          <pre><code class="language-nginx">worker_processes 1; # 工作的进程个数

events {
    worker_connections 1024; # 一个进程可以创建多少个链接（默认 1024）
}

http {
    # 引入其他配置（返回前端的头部信息，告诉浏览器返回的数据格式）
    include mime.types;
    # 如果没有命中 mime.types 的类型，则默认返回 application/octet-stream 的数据格式
    default_type application/octet-stream;
    # 数据零拷贝 （减少了 nginx 读取文件，拷贝文件，直接将文件返回给到前端）
    sendfile on;
    # 保存连接超时时间
    keepalive_timeout 65;

    # 虚拟主机
    server {
        # 监听端口
        listen 80;
        # 域名、主机名
        server_name localhost;

        location / { # / 转发
            # 指向 nginx 目录下的 html 目录
            root html;
            # 默认展示页
            index index.html index.htm
        }

        # 错误码为 500 502 503 504 会命中 50x.html
        error_page 500 502 503 504 /50x.html
        # 访问 /50x.html 会被代理到 nginx 下的 html 目录下
        location = /50x.html {
          root html
        }
    }
}
</code></pre>
          <hr />
          <h2 id="%F0%9F%8E%A8-%E4%BA%8C%E7%BA%A7%E5%9F%9F%E5%90%8D%E8%BD%AC%E5%8F%91" tabindex="-1">🎨 二级域名转发 <a
              class="header-anchor" href="#%F0%9F%8E%A8-%E4%BA%8C%E7%BA%A7%E5%9F%9F%E5%90%8D%E8%BD%AC%E5%8F%91"></a>
          </h2>
          <blockquote>
            <p>根据不同的二级域名返回不同的站点</p>
            <p>如：</p>
            <ul>
              <li>域名 blog.hhmax.xyz 返回博客站点</li>
              <li>域名 <a href="http://www.hhmax.xyz">www.hhmax.xyz</a> 返回主站站点</li>
            </ul>
          </blockquote>
          <p>原理：将不同的二级域名都指向同一个 IP 地址，在通过 Nginx 在转发时，根据不同的二级域名，返回不同的站点</p>
          <p>下面通过俩种方式进行演示：</p>
          <h3 id="%F0%9F%8E%89-%E5%86%85%E7%BD%91%E6%A8%A1%E6%8B%9F%E7%AB%99%E7%82%B9%E6%98%A0%E5%B0%84" tabindex="-1">
            🎉 内网模拟站点映射 <a class="header-anchor"
              href="#%F0%9F%8E%89-%E5%86%85%E7%BD%91%E6%A8%A1%E6%8B%9F%E7%AB%99%E7%82%B9%E6%98%A0%E5%B0%84"></a></h3>
          <p>在 <code>C:\Windows\System32\drivers\etc\hosts</code> 文件中添加</p>
          <pre><code>39.104.61.35 blog.hhmax.xyz
39.104.61.35 www.hhmax.xyz
</code></pre>
          <p>测试是否映射成功</p>
          <pre><code class="language-nginx">ping blog.hhmax.xyz
</code></pre>
          <pre><code>ping www.hhmax.xyz
</code></pre>
          <p>接下来进行 Nginx 配置，配置内容如下：</p>
          <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;
  server {
     listen: 80,
     server_name www.hhmax.xyz;
     location / {
        root html; # 转发到 nginx/html/index.html 或 index.htm
        index index.html index.htm
     }
  },
  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location / {
        root blog; # 转发到 nginx/blog/index.html 或 index.htm
        index index.html index.htm
     }
  }
}
</code></pre>
          <hr />
          <h3 id="%F0%9F%8E%89-%E5%A4%96%E7%BD%91%E6%A8%A1%E6%8B%9F%E7%AB%99%E7%82%B9%E6%98%A0%E5%B0%84" tabindex="-1">
            🎉 外网模拟站点映射 <a class="header-anchor"
              href="#%F0%9F%8E%89-%E5%A4%96%E7%BD%91%E6%A8%A1%E6%8B%9F%E7%AB%99%E7%82%B9%E6%98%A0%E5%B0%84"></a></h3>
          <blockquote>
            <p>需要购买域名以及一台服务器，并且服务器要备案成功才能映射成功</p>
          </blockquote>
          <p>选中域名解析，并添加记录</p>
          <p>需要设置的字段</p>
          <ul>
            <li>记录类型：这里选择 A - 将域名指向一个 IPV4 的地址</li>
            <li>主机记录：可以填写一个二级域名（即我们要设置的 blog 和 www）</li>
            <li>记录值：映射的地址（即我们要映射的服务器 IP 地址）</li>
          </ul>
          <blockquote>
            <p>可添加多条记录，并映射到其他 IP 或相同 IP</p>
          </blockquote>
          <p>接下来进行 Nginx 配置，配置内容如下：</p>
          <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;
  server {
     listen: 80,
     server_name www.hhmax.xyz;
     location / {
        root html; # 转发到 nginx/html/index.html 或 index.htm
        index index.html index.htm
     }
  },
  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location / {
        root blog; # 转发到 nginx/blog/index.html 或 index.htm
        index index.html index.htm
     }
  }
}
</code></pre>
          <p><strong>注意：上述 Nginx 配置监听的端口是 80 端口，服务器可能需要开启</strong></p>
          <hr />
          <h2 id="%F0%9F%8E%A8-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86" tabindex="-1">🎨 反向代理 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86"></a></h2>
          <h3 id="%F0%9F%8E%89-%E6%AD%A3%E5%90%91%E4%BB%A3%E7%90%86" tabindex="-1">🎉 正向代理 <a class="header-anchor"
              href="#%F0%9F%8E%89-%E6%AD%A3%E5%90%91%E4%BB%A3%E7%90%86"></a></h3>
          <p>
            概念：<strong>代理服务器充当客户端的中间人，代表客户端向目标服务器发送请求</strong>。在正向代理中，<strong>客户端通过代理服务器来访问互联网上的资源，而不是直接与目标服务器通信</strong>。
          </p>
          <p>好处：隐藏客户端的真实 IP 地址和身份，增加了匿名性和安全性</p>
          <h3 id="%F0%9F%8E%89-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86" tabindex="-1">🎉 反向代理 <a class="header-anchor"
              href="#%F0%9F%8E%89-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86"></a></h3>
          <p>概念：<strong>代理服务器接收客户端请求，并将请求转发给后端服务器</strong>。在反向代理中，<strong>客户端不直接与后端服务器通信，而是与代理服务器进行通信</strong>。</p>
          <p>好处：</p>
          <ul>
            <li>可以实现负载均衡，将请求分发到多个后端服务器，提高系统的性能和可靠性（<strong>负载均衡</strong>）</li>
            <li>可以缓存静态资源，减少后端服务器的负载（<strong>动静分离</strong>）</li>
          </ul>
          <br />
          <p>Nginx 与 Tomcat 形成内网，Tomcat 不能直接绕过 Nginx 通过网关，发送消息。必须通过 Nginx 来发送消息。这种模式称为 <strong>隧道式代理</strong></p>
          <p>由此，也暴露出一个问题，当数据量很大时，尽管 Tomcat 的带宽有 100M，但 Nginx 的带宽只有 10 M。由于需要借助 Nginx
            来向外传递数据，最终的传输数据没有设想的那么好。<strong>Tomcat 带宽再好，也要受限于 Nginx</strong>。</p>
          <p>为了解决上述的缺点：</p>
          <p>衍生出一种模式： <strong>Nginx 只处理进来的请求，而出去的数据不经过 Nginx 进行转发。Tomcat 直接将数据通过网关发送给到用户</strong>（中间会经过其他网关进行转发）。这种模式称为
            <strong>DR 模式</strong></p>
          <h3 id="%F0%9F%8E%89-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86%E9%85%8D%E7%BD%AE" tabindex="-1">🎉 反向代理配置 <a
              class="header-anchor" href="#%F0%9F%8E%89-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86%E9%85%8D%E7%BD%AE"></a>
          </h3>
          <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;
  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location / {
       # 当访问 blog.hhmax.xyz 是代理到 http://www.baidu.com
       proxy_pass http://www.baidu.com
     }
     location /api { # 笔记
        # 当访问 blog.hhmax.xyz/api 是代理到 内网中的 http://127.0.0.1:3200
        proxy_pass http://127.0.0.1:3200;
     }
  }
}
</code></pre>
          <p><strong>注意：上述例子中代理到后端服务 3200 端口也需要开放</strong></p>
          <hr />
          <h2 id="%F0%9F%8E%A8-%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1" tabindex="-1">🎨 负载均衡 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1"></a></h2>
          <p>
            概念：用于在多个服务器之间分配和平衡工作负载，以提高系统的性能、可靠性和可扩展性。当一个服务器无法处理所有的请求时，<strong>负载均衡将请求分发给其他可用的服务器，以确保每个服务器都能够处理适当的负载</strong>。
          </p>
          <h3 id="%F0%9F%8E%89-%E6%99%AE%E9%80%9A%E8%BD%AE%E8%AF%A2" tabindex="-1">🎉 普通轮询 <a class="header-anchor"
              href="#%F0%9F%8E%89-%E6%99%AE%E9%80%9A%E8%BD%AE%E8%AF%A2"></a></h3>
          <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  # 轮询的服务器
  upstream httpds {
     server 192.168.5.51:80;
     server 192.168.6.51:80;
     server 192.168.7.51:80;
  }

  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location / {
       proxy_pass http://httpds;
     }
  }
}
</code></pre>
          <p><code>192.168.5.51:80</code>、<code>192.168.6.51:80</code>、<code>192.168.7.51:80</code> 三台服务器提供的服务都一样。</p>
          <h3 id="%F0%9F%8E%89-%E6%9D%83%E9%87%8D%E8%BD%AE%E8%AF%A2" tabindex="-1">🎉 权重轮询 <a class="header-anchor"
              href="#%F0%9F%8E%89-%E6%9D%83%E9%87%8D%E8%BD%AE%E8%AF%A2"></a></h3>
          <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  # 权重值越大，被轮询到的可能性越大
  upstream httpds {
     server 192.168.5.51:80 weight=8;
     server 192.168.5.51:80 weight=1;
     server 192.168.5.51:80 weight=7;
  }
  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location / {
       proxy_pass http://httpds;
     }
  }
}
</code></pre>
          <blockquote>
            <p>另外一些配置</p>
            <ul>
              <li>down （若配置，则该台服务器<strong>不参与轮询</strong>）</li>
              <li>backup（若配置，则该台服务器为<strong>备用机</strong>，当其他轮询服务器不能使用时，才会使用该服务器）</li>
            </ul>
            <p>具体使用如下：</p>
            <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  upstream httpds {
     server 192.168.5.51:80 weight=8 down;
     server 192.168.5.51:80 weight=1;
     server 192.168.5.51:80 weight=7 backup;
  }
  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location / {
       proxy_pass http://httpds;
     }
  }
}
</code></pre>
          </blockquote>
          <h3 id="%F0%9F%8E%89-%E8%BD%AE%E8%AF%A2%E7%BC%BA%E7%82%B9" tabindex="-1">🎉 轮询缺点 <a class="header-anchor"
              href="#%F0%9F%8E%89-%E8%BD%AE%E8%AF%A2%E7%BC%BA%E7%82%B9"></a></h3>
          <p>由于是轮询，所以导致<strong>没法保存会话信息</strong>，如在 <code>192.168.5.51:80</code> 用户登录成功。当用户再次访问该站点时，被 Nginx
            轮询到<code>192.168.7.51:80</code> ，此时这台服务器是不知道用户已经登录了，所以需要重新在登录。</p>
          <h3 id="%F0%9F%8E%89-%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88" tabindex="-1">🎉 解决方案 <a class="header-anchor"
              href="#%F0%9F%8E%89-%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88"></a></h3>
          <p>随着技术的发展，为了解决轮询带来的会话信息无法保存，衍生出了两种方案来解决上述问题</p>
          <ul>
            <li>其一：<strong>借助 cookie、session、redis</strong></li>
          </ul>
          <p>流程：</p>
          <ol>
            <li>用户输入其登录信息</li>
            <li>服务器验证信息是否正确，并创建一个 session，并将其存入到 redis</li>
            <li>服务器为用户生成一个 sessionId，将具有 sesssionId 的 cookie 将放置在用户浏览器中</li>
            <li>在后续请求中，携带 cookie，访问服务器。哪怕是轮询到其他服务器，也可以通过 sessionId 去 redis 拿去登录信息</li>
            <li>一旦用户注销应用程序，会话将在客户端和服务器端都被销毁</li>
          </ol>
          <p><strong>Node + Koa2 代码实现</strong></p>
          <pre><code class="language-javascript">// app.js
const app = new Koa();
const Koa = require(&quot;koa&quot;);
const redisStore = require(&quot;koa-redis&quot;);
const session = require(&quot;koa-generic-session&quot;);
//session 与  redis
app.keys = [&quot;dfhQWE_123#ewr&quot;];
app.use(
  session({
    key: &quot;token.sid&quot;, //cookie name 默认是 `koa.sid`
    prefix: &quot;token:sess:&quot;, // redis key 的前缀，默认是 `koa:sess:`
    //配置cookie
    cookie: {
      path: &quot;/&quot;,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
    //配置redis
    store: redisStore({
      all: `127.0.0.1:6379`,
    }),
  })
);

// router
router.post(&quot;/login&quot;, async (ctx, next) =&gt; {
  const { account = &quot;-&quot;, password = &quot;-&quot; } = ctx.request.body;
  if (config.account == account &amp;&amp; config.password == password) {
    // TODO 将账号信息（id）保存到 session 中
    ctx.session.user = {
      account: config.account,
    };
    ctx.body = {
      errorno: 0,
      message: &quot;登录成功&quot;,
    };
    return;
  }
  ctx.body = {
    errorno: 4001,
    message: &quot;账号或密码错误&quot;,
  };
});

// 中间件校验 loginCheck
module.exports = async (ctx, next) =&gt; {
  // // TODO：判断用户是否已经登录
  if (ctx.session.user) {
    await next();
    return;
  } else {
    ctx.body = {
      errorno: 4000,
      message: &quot;用户未登录&quot;,
    };
  }
};

// 判断是否已经登录成功
router.post(&quot;/getNotes&quot;, loginCheck, async (ctx, next) =&gt; {
  const data = await searchData();
  ctx.body = {
    errorno: 0,
    message: &quot;&quot;,
    data,
  };
});
</code></pre>
          <ul>
            <li>其二：<strong>无状态的会话通信 （JWT）</strong></li>
          </ul>
          <p>流程：</p>
          <ol>
            <li>用户输入其登录信息</li>
            <li>服务器验证信息是否正确，并返回已签名的 Token</li>
            <li>Token 存储在客户端</li>
            <li>之后的 HTTP 请求都将 Token 添加到请求头里</li>
            <li>服务器解码 JWT，并且如果令牌有效，则接受请求</li>
            <li>一旦用户注销，令牌将在客户端被销毁，不需要与服务器进行交互一个关键是，令牌是无状态的。后端服务器不需要保存令牌或当前 session 的记录</li>
          </ol>
          <p><strong>Node + Koa2 代码实现</strong></p>
          <pre><code class="language-javascript">// app.js
const app = new Koa();
const Koa = require(&quot;koa&quot;);
const jwtKoa = require(&quot;koa-jwt&quot;);
app.use(
  jwtKoa({
    secret: &quot;1Hrj$_enferk&quot;, //密钥
  }).unless({
    path: [/^\/users\/login/], //自定义哪些目录忽略 JWT 验证
  })
);

//登录成功对信息进行加密
const jwt = require(&quot;jsonwebtoken&quot;);
token = jwt.sign(userInfo, &quot;1Hrj$_enferk&quot;, { expiresIn: &quot;1h&quot; });

// router
const until = require(&quot;util&quot;);
const verify = until.promisify(jwt.verify);
router.get(&quot;/getUserInfo&quot;, async (ctx, next) =&gt; {
  const token = ctx.header.authorization;
  try {
    const payload = await verify(token.split(&quot; &quot;)[1], &quot;1Hrj$_enferk&quot;);
    ctx.body = {
      errno: 0,
      userInfo: payload,
    };
  } catch (ex) {
    ctx.body = {
      errno: -1,
      msg: &quot;失败&quot;,
    };
  }
});
</code></pre>
          <h3 id="%F0%9F%8E%89-%E6%96%B9%E6%A1%88%E5%AF%B9%E6%AF%94" tabindex="-1">🎉 方案对比 <a class="header-anchor"
              href="#%F0%9F%8E%89-%E6%96%B9%E6%A1%88%E5%AF%B9%E6%AF%94"></a></h3>
          <p>共同点：为了解决：登录和存储登录用户信息
            不同点：</p>
          <ul>
            <li>JWT 用户信息加密存储在<strong>客户端</strong>，不依赖 cookie ，<strong>可跨域</strong>。</li>
            <li>session 用户信息存储在<strong>服务端</strong>，依赖于 cookie，默认<strong>不可跨域</strong></li>
          </ul>
          <hr />
          <p>JWT 的优点：</p>
          <ul>
            <li>将加密信息存放在客户端，减少服务端的内存压力。</li>
            <li>不依赖于 cookie 可以将信息进行跨域分享。</li>
          </ul>
          <p>JWT 的不足：</p>
          <ul>
            <li>服务端无法控制信息，一旦用户修改信息后，服务端无法第一时间修改加密信息。</li>
          </ul>
          <hr />
          <p>Session 的优点：</p>
          <ul>
            <li>可以对用户信息进行控制。</li>
          </ul>
          <p>Session 的不足：</p>
          <ul>
            <li>存储要依赖于 redis 和 cookie ，并且不能跨域。</li>
            <li>一旦上线启动多进程，而不依赖 redis 是无法实现多进程之间的信息共享。</li>
          </ul>
          <hr />
          <h2 id="%F0%9F%8E%A8-%E5%8A%A8%E9%9D%99%E5%88%86%E7%A6%BB" tabindex="-1">🎨 动静分离 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E5%8A%A8%E9%9D%99%E5%88%86%E7%A6%BB"></a></h2>
          <p>在还没有前后端分离的开发模式的情况下（MVC），一些静态资源都是集中和后端代码放在 Tomcat 。而这些静态资源大多数情况下都是不变的，如：图片，JavaScript 代码。</p>
          <p>并且 Nginx 可以缓存静态资源，减少后端服务器的负载。因此，可以将一些静态资源放到 Nginx 中，从而使一些静态资源与业务逻辑进行抽离。</p>
          <p>具体配置如下：</p>
          <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location / {
       proxy_pass http://192.168.6.52
     }
     location ~*/(css|img|js) {
       # 路径中有 /css /img /js 使会指向 nginx/html 中的 css、img、js
       root html;
       index index.html index.htm
     }
  }
}
</code></pre>
          <p>随着技术的发展，特别是前后端分离的开发模式，上述情况也不复存在，后端也不用考虑到静态资源该怎么处理，都转移给到前端了</p>
          <hr />
          <h2 id="%F0%9F%8E%A8-%E8%B5%84%E6%BA%90%E9%98%B2%E7%9B%97%E9%93%BE" tabindex="-1">🎨 资源防盗链 <a
              class="header-anchor" href="#%F0%9F%8E%A8-%E8%B5%84%E6%BA%90%E9%98%B2%E7%9B%97%E9%93%BE"></a></h2>
          <p>保护网站资源不被其他网站盗用的技术措施</p>
          <p>防盗链的实现原理：</p>
          <ul>
            <li>服务器收到请求后，获取请求头中的<code>referer</code>字段</li>
            <li>验证<code>referer</code>字段是否符合预设的规则，例如是否在允许的域名列表中</li>
            <li>如果<code>referer</code>验证通过，则允许访问资源；否则，拒绝访问或返回特定的错误页面</li>
          </ul>
          <p>情况一：页面引用图片请求头中会携带 <code>referer</code> 头，值就是引用该资源的这个地址</p>
          <p>情况二：单独复制该图片地址，重新打开窗口访问时，请求该图片时，<code>referer</code> 头就不会携带给到后端</p>
          <p>配置一：两种情况都不能访问资源（图片）</p>
          <pre><code class="language-nginx"> http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location /img {
       valid_referers blog.hhmax.xyz;
       if ($invalid_referer) {
          return 403;
       }

       # 路径中有 /nginx/img
       root img;
       index index.html index.htm
     }
  }
}
</code></pre>
          <blockquote>
            <p><code>valid_referers</code>：配置的值得跟<code> server_name</code> 一样</p>
          </blockquote>
          <p>配置二：仅第二种情况可以访问资源</p>
          <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location /img {
       valid_referers none blog.hhmax.xyz;
       if ($invalid_referer) {
          return 403;
       }

       # 路径中有 /nginx/img
       root img;
       index index.html index.htm
     }
  }
}
</code></pre>
          <blockquote>
            <p><code>valid_referers</code>：配置的值得跟 <code>server_name</code> 一样</p>
          </blockquote>
          <p>配置后：</p>
          <p>没有权限访问图片，也可以配置返回一个错误页面，或者一个错误图片</p>
          <ul>
            <li>错误页面</li>
          </ul>
          <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location /img) {
       valid_referers blog.hhmax.xyz;
       if ($invalid_referer) {
          return 401;
       }
       root img;
       index index.html index.htm
     }
     error_page 401 /401.html
     location = /401.html {
        root html;
     }
  }
}
</code></pre>
          <ul>
            <li>错误图片</li>
          </ul>
          <pre><code class="language-nginx">http {
  include mime.types;
  default_type application/octet-stream;
  sendfile on;
  keepalive_timeout 65;

  server {
     listen: 80,
     server_name blog.hhmax.xyz;
     location /img {
       valid_referers blog.hhmax.xyz;
       if ($invalid_referer) {
          return ^/ /img/x.png break;
       }
       root html;
       index index.html index.htm
     }
  }
}
</code></pre>
          <pre><code class="language-typescript">function add(num1: Number, num2: Number) {
    return num1 + num2
}
</code></pre>
        </div>
        <div><a href="#%F0%9F%8E%A8-%E5%89%8D%E8%A8%80">🎨 前言 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E5%89%8D%E8%A8%80"></a></a><br><a
            href="#%F0%9F%8E%A8-%E6%9C%80%E5%B0%8F%E5%8D%95%E5%85%83%E9%85%8D%E7%BD%AE">🎨 最小单元配置 <a
              class="header-anchor"
              href="#%F0%9F%8E%A8-%E6%9C%80%E5%B0%8F%E5%8D%95%E5%85%83%E9%85%8D%E7%BD%AE"></a></a><br><a
            href="#%F0%9F%8E%A8-%E4%BA%8C%E7%BA%A7%E5%9F%9F%E5%90%8D%E8%BD%AC%E5%8F%91">🎨 二级域名转发 <a
              class="header-anchor"
              href="#%F0%9F%8E%A8-%E4%BA%8C%E7%BA%A7%E5%9F%9F%E5%90%8D%E8%BD%AC%E5%8F%91"></a></a><br><a
            href="#%F0%9F%8E%A8-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86">🎨 反向代理 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86"></a></a><br><a
            href="#%F0%9F%8E%A8-%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1">🎨 负载均衡 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1"></a></a><br><a
            href="#%F0%9F%8E%A8-%E5%8A%A8%E9%9D%99%E5%88%86%E7%A6%BB">🎨 动静分离 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E5%8A%A8%E9%9D%99%E5%88%86%E7%A6%BB"></a></a><br><a
            href="#%F0%9F%8E%A8-%E8%B5%84%E6%BA%90%E9%98%B2%E7%9B%97%E9%93%BE">🎨 资源防盗链 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E8%B5%84%E6%BA%90%E9%98%B2%E7%9B%97%E9%93%BE"></a></a><br></div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
      <!-- <el-card v-html="toc"></el-card> -->
      <el-card>
        <div><a href="#%F0%9F%8E%A8-%E5%89%8D%E8%A8%80">🎨 前言 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E5%89%8D%E8%A8%80"></a></a><br><a
            href="#%F0%9F%8E%A8-%E6%9C%80%E5%B0%8F%E5%8D%95%E5%85%83%E9%85%8D%E7%BD%AE">🎨 最小单元配置 <a
              class="header-anchor"
              href="#%F0%9F%8E%A8-%E6%9C%80%E5%B0%8F%E5%8D%95%E5%85%83%E9%85%8D%E7%BD%AE"></a></a><br><a
            href="#%F0%9F%8E%A8-%E4%BA%8C%E7%BA%A7%E5%9F%9F%E5%90%8D%E8%BD%AC%E5%8F%91">🎨 二级域名转发 <a
              class="header-anchor"
              href="#%F0%9F%8E%A8-%E4%BA%8C%E7%BA%A7%E5%9F%9F%E5%90%8D%E8%BD%AC%E5%8F%91"></a></a><br><a
            href="#%F0%9F%8E%A8-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86">🎨 反向代理 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86"></a></a><br><a
            href="#%F0%9F%8E%A8-%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1">🎨 负载均衡 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1"></a></a><br><a
            href="#%F0%9F%8E%A8-%E5%8A%A8%E9%9D%99%E5%88%86%E7%A6%BB">🎨 动静分离 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E5%8A%A8%E9%9D%99%E5%88%86%E7%A6%BB"></a></a><br><a
            href="#%F0%9F%8E%A8-%E8%B5%84%E6%BA%90%E9%98%B2%E7%9B%97%E9%93%BE">🎨 资源防盗链 <a class="header-anchor"
              href="#%F0%9F%8E%A8-%E8%B5%84%E6%BA%90%E9%98%B2%E7%9B%97%E9%93%BE"></a></a><br></div>

      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
</script>
<style lang="scss" scoped>
@keyframes h3AnimationBefore {
  0% {
    width: 28px;
  }

  25% {
    width: 100%
  }

  50% {
    width: 100%
  }

  75% {
    width: 100%
  }

  100% {
    width: 100%
  }
}

@keyframes h3AnimationAfter {
  0% {
    transform: rotate(0);
  }

  10% {
    transform: rotate(0);
  }

  50% {
    transform: rotate(-1turn);
  }

  100% {
    transform: rotate(-1turn);
  }
}

.markdowm {
  position: relative;
  justify-content: space-between;
  width: 1200px;
  margin: auto;
}

.toC {
  width: 300px;
  position: fixed;
  top: 0;
  right: 0;
}

.markdowm .content-container {
  border-radius: 4px 4px 0 0;
  background-color: #fff;
  width: 800px;
  padding: 20px;
  box-sizing: border-box;
  word-break: break-word;
  line-height: 1.75;
  font-weight: 400;
  font-size: 15px;
  overflow-x: hidden;
  color: #2b2b2b;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  background-image: linear-gradient(90deg, rgba(159, 219, 252, .15) 3%, transparent 0), linear-gradient(1turn, rgba(159, 219, 252, .15) 3%, transparent 0);
  background-size: 20px 20px;
  background-position: 50%;
}

h2 {
  display: block;
  border-bottom: 4px solid #4dd0e1;
  position: relative;
  font-size: 24px;
  padding: 12px 32px;
  margin: 30px 0;
  color: #4dd0e1;
}

h2::before {
  width: 24px;
  height: 24px;
  left: 0;
  top: 0;
  margin: auto;
  background-size: 24px 24px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADGklEQVRYR81X32vTYBQ999s6mFjQgQ+DrbHiVFZYU4cDcQ/6pGhTFVYFEXGi82H+Bz448UnEF1Fx9ccEEcXpZE3d5tP2ooKiTacTHaLNpigMHDgnU9tcSbrWrkwWR0sbyEOSe885ObnfvV8IRT6oyPwoLQHBx+OVM5WJvSyEVAhnBOjt7yU/+/rr6r6l8TMO+F/EN0JQhICqQpD/xaRpcpAc9tS+M+9lBCia/oqBamK+zeDuQogQZaKJk3wcQjxSva7tGQGB2Ke1zIk3DNyMyNL+QpCnMQOaPsDAVuGAp9cjvbYc8Ec/bCYSg0zoiHilk1tHxqsqEsYlML4kjIpT/eurJxRNPweQU5VdrWaOEo1fgKAVbBgXIz73kF3R/ph+ghgdzMYWM29eAWlBJqgZaFlFYtC6nhWpaDqnSGlIlV1WjJ3DloDNgyNLncudqgX//Ucg3LxuStHGuhi8pqKCW3rqV342rwFjRznKm+/LNaN2yC237ThgF2wxcfMLeP6+ncrKzoPoKTGeLQbYbg4TNoC5iZPJY5HGVRdSNZAWYBclD3FzBQzrR8hACAKdzBzKA/4/IYioDQaOskBbpEG6PO8qKKSAEi3CnEb0Pw4oMf0OmKbTDWqh3Lw6EIiNBZi5lxh3wz4puBD5ovqAMvxhHSdFKxE1CQe3m/07TeTX4lcJdAhE+1Sv65Z5P/ByvIGTRowIZ9igbtXnmrOsbTvgj+kHBNMuBu9OdVw8EeU4nC1A0cYmAHZOTRrLhra4Z8ywnSN6vZHAFTA2WnnMfQB3qz73ddsOZM8CACFDIPSgQXqebXEgqgeZcAeEe6pXasm1f8ew3igMtAHWac0Uc/jYdyAaP0xEBwFsmgUPqbJ0NE2UKj4EGcahiOzuyhagaHpnmtgcVgTcCMuua7YdyAHbA3ArQNscVFbb4635aD6fnYaTvxxi9UNP7ddMXaRWVBdAcaLk6bDXPZCNZ9uBXEsDUX1T2Cc9yjig6Z0EHg3LK8/aqf6MwJKchkXfks1+0+JtSq3qLPa23BRR1B+T/6nkfMaW1r9hPt/MLtYfTLEpP+T9FNoAAAAASUVORK5CYII=);
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
}

h2::after {
  right: 0;
  width: 400px;
  height: 10px;
  border-top-right-radius: 24px;
  background: linear-gradient(90deg, #fff, #4dd0e1);
  max-width: 50vw;
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
}

h3 {
  margin: 30px 0;
  font-size: 18px;
  position: relative;
  padding: 4px 32px;
  width: max-content;
  color: #4dd0e1;
}

h3::before {
  border-bottom: 2px solid #4dd0e1;
  width: 100%;
  content: "";
  display: block;
  height: 28px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: -2px;
  margin: auto;
  background-size: 28px 28px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABRklEQVRYR2NkGGDAOMD2M4w6YDQERkNg+ITAppcfY/8zMv3wF+NdTUrZQpUQ2PT6cz8Dw/8CkMWMDIwNvqK8jcQ6gmIHNN19EaXPx1XPyMCghrCUKcpPlGc5MY6gyAE+Fx52MjL8j3cU5a1UYWXtZGBkEAVb+p8hxU+Mby5NHQCxnKEMaskzJ37uFmUetkmMjAzrfUX4woixHBJlZAA0y2EmPPYU4enLkhGeQIqRJDsAh+UgO7duNpD3IcVykkOA2paT5ABaWE60A2hlOdEO8D3/4CMDIyMfWvySFefoaYSoROh74eFXBgYGLiTNVLGc+BC48PAnAwMDG9QBVLOcaAd8P5ox+x/jf5AjGLgYfnwnKqv9/8/PwPO/kFF/MSj0cAKiouD/0bgYoixFU8RovWgJIX1EOYCQIZTIjzpgNARGQ2DAQwAAvHBaIdB7zxsAAAAASUVORK5CYII=);
  background-repeat: no-repeat;
  animation: h3AnimationBefore 2s infinite alternate
}

h3:after {
  content: "";
  display: block;
  width: 28px;
  height: 28px;
  position: absolute;
  border: 2px solid #4dd0e1;
  border-radius: 50%;
  right: -15px;
  top: 0;
  bottom: 0;
  margin: auto;
  background-size: 28px 28px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABRklEQVRYR2NkGGDAOMD2M4w6YDQERkNg+ITAppcfY/8zMv3wF+NdTUrZQpUQ2PT6cz8Dw/8CkMWMDIwNvqK8jcQ6gmIHNN19EaXPx1XPyMCghrCUKcpPlGc5MY6gyAE+Fx52MjL8j3cU5a1UYWXtZGBkEAVb+p8hxU+Mby5NHQCxnKEMaskzJ37uFmUetkmMjAzrfUX4woixHBJlZAA0y2EmPPYU4enLkhGeQIqRJDsAh+UgO7duNpD3IcVykkOA2paT5ABaWE60A2hlOdEO8D3/4CMDIyMfWvySFefoaYSoROh74eFXBgYGLiTNVLGc+BC48PAnAwMDG9QBVLOcaAd8P5ox+x/jf5AjGLgYfnwnKqv9/8/PwPO/kFF/MSj0cAKiouD/0bgYoixFU8RovWgJIX1EOYCQIZTIjzpgNARGQ2DAQwAAvHBaIdB7zxsAAAAASUVORK5CYII=);
  animation: h3AnimationAfter 2s infinite alternate;
}

p {
  line-height: inherit;
  margin: 22px 0;
  letter-spacing: 2px;
  font-size: 14px;
  word-spacing: 2px;
}

code:not([class*="language-"]) {
  word-break: break-word;
  border-radius: 2px;
  overflow-x: auto;
  background-color: rgba(77, 208, 225, .08);
  color: #26c6da;
  padding: .195em .4em;
}

strong:before {
  content: "「";
  color: #26c6da;
}

strong {
  font-weight: 700;
  color: #26c6da;
}

strong::after {
  content: "」";
  color: #26c6da;
}

a {
  color: #4dd0e1;
  border-bottom: 1px solid #4dd0e1;
  font-weight: 400;
  text-decoration: none;
  margin: 0 4px;
  letter-spacing: 2px;
  font-size: 14px;
  word-spacing: 2px;
}

ul {
  color: #595959;
  padding-left: 28px;
}

ul li {
  margin-bottom: 0;
  list-style: inherit;
}
</style>
