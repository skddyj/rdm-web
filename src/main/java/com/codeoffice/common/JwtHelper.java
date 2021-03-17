package com.codeoffice.common;

import com.alibaba.fastjson.JSON;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.time.DateUtils;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

public class JwtHelper {

  private static  final  String RSA_PRIVATE_KEY =

          "-----BEGIN RSA PRIVATE KEY-----\n"  +


                  "MIIJKgIBAAKCAgEArrGzztq8tDH43gk9qqvlNuUPZJAc2lHq5pCmYaQGoSRfq0VE\n"  +


                  "5DkoYyHs+tdxC0o3fjOkJnhz3CM5+3nKwqREUFcMb2Pg0kVktFjApd8B0Qa6LKnE\n"  +


                  "8uX815XOwS9K7JXLAem5gaAZBVUs73Q+UsNkif1ImiYM415A2PPMeT3rnOWcZ62b\n"  +


                  "qUjAr8LgTt1Lli9s6aDZ070/LFpJVhk45sZK90KalpEy+8q7U+QiXX8LAq/K+nkZ\n"  +


                  "hXqmZ5R3OPabmM2e5kcvg8HtJs+DVYsfGTS8di/3bh2DjTId/H7NNhV2B4XtcNR7\n"  +


                  "mq8bQocseOGLbQBQekrVPOwjJCgd6EByzVbZojGE5juMb+OFTmFqHJlsfY64EalL\n"  +


                  "G0eZfNqDc/6O38oTSunAIlMwYtEA9YD2VT8DecWaNKsMX/vPo/ON4dWqltKrQyp7\n"  +


                  "nkITIpqbL8dzujaMMyVXqoLGtSF6XDNOd1ayQj/B2r6xZKxmYm9I05vV3MQpxi6X\n"  +


                  "kN+r09jLsS4FaCBgNVZ7qBS2TEXfYdPXHrcRAM2piRqiIIcr6vp3p6J5Y5D9dEhO\n"  +


                  "bIFw1a0bp/gSLcAr9Ds+9cHv5Ov1fRRhZDeZNX4xztrKgsqSTJNCLeZOYtvp2zAk\n"  +


                  "08Fnn484ZWRimuJOgYKx0LubR0107PwAvih22JEbA3AfD7iWYpAXVYkNtl0CAwEA\n"  +


                  "AQKCAgAe4XjYiyAqdl742QdWoTZOouU6sKL5ENwGT/GpdvZZC/YBb6hC87uo8nlS\n"  +


                  "yjzIcyEmJPjSeB56/pskUh4+lA0jao/fLPe0E+I+YyYC7E4E5jyI4qXXDkLI1UmM\n"  +


                  "KtECy2PsfaV2PZfOsoTT+2d8999Q6T4pSaqjkqjB8S7nC8QXoxsn1K+cmCi/qSI/\n"  +


                  "rqzK6q1FC1MWM/Dz5S3rk1/Uo57i4Jo1HYu2qNq+dKiCgI+wtOSbrEaPquO5kawV\n"  +


                  "nLpao5aAPHswvlouryYXPBWOPh1GgyopA/yaPA7C8KNT+S05HTqg5F7JNEUMWJrK\n"  +


                  "74vXA+Q2Cf5x24hGvvSydpoUpFKqJ3O33jPchKZkkUk6XSdp4HG4Sn727ovVruVu\n"  +


                  "Oy18w9MvzKCEm3fPH/ySmXJGLLuISEi8p0iVrHuuyD10bNw41EnkYbxC2fy/tzw/\n"  +


                  "gj47G9wCc2c4Sq8hxmBvTppzeHKVQddc1cLtm+CCyPVzFknIZx1dP5GC3te9aqky\n"  +


                  "3v5li2RfzeuxsFt8zItk2HLAU7m4nB6ubu3g6dA9Oy8pW2/7Vv9GgvUTGUoPvB2m\n"  +


                  "vAqTrdmvjbSCV3402jaFVqjSe8nSob7m/32+6DXu70QZZ7gPi54GH9uhEMKHLsx5\n"  +


                  "OYalCHyV50fnlco8Fr5bxARxAKEyLjoaBATKEA0NEQ+UOT7uPQKCAQEA1Y4SktpU\n"  +


                  "JGgG+ZFwC9SXG+SNy235uek0LbR/2OR0toHLaPGNDBY/mpcZHFQMogmHrKDQd91P\n"  +


                  "fKvBlhGErL4lgu6AEaVI6rI3ztAlDmVu01kMmmGAtv9wXfbF6S28Rp4BFzpdVB0S\n"  +


                  "X4xhaOdYhjTBELkChAqp1wdEZOZ9NMJx/VPJ7Dfyp8kw56hk1vm0IOcsuGvB8qbI\n"  +


                  "9xPxGKfTl3QS9cPBKmWzItU7gQLV2GseURA8EiVUFT18GNyvuftJE1rN0YlDvtMl\n"  +


                  "he3ZDGdW0OCvo5GoKkWU27gd4VT4RkIRjuvbykCgOd/OX2FO+m4S12n4KpDnR8N6\n"  +


                  "C5egFlBiqchUXwKCAQEA0WpYfTEQnsP6W87INfWdfFCjIUFxx0IDGIgKNYm3Fcd3\n"  +


                  "8y1EEdDTsCIp3d0jRKixVW7AuM1qljlmwNTC7yV2DRjqhvqxZOk+UzrRIDaBFSBn\n"  +


                  "rV/tx/2Hr5l4eqjORI9BhkwqSFsDrnQp9hb3hYMVoFp1uswizL631pHAPp6tLO2L\n"  +


                  "hCyD0Lykv2roqVhZlUGevjb7VkqWWUnTwSSaxmwpZ+ETydZLI5TtoXh2VlZMyhkP\n"  +


                  "ChiMN8RHXBI/xSutTaXVkzZZVj4+k1t7Y5vH826k+WuVpZk4ZFXm/T+M5NpomKtn\n"  +


                  "6qbpXAQLGw6tnuzIVEADs/wxuOFF4pRE3uzn8A/OwwKCAQEAv3cfg/anlfSGvF7+\n"  +


                  "/DxgNqvVzVwOl/ZTx96a+VTqp277dl2LPhj8cZei9dkNcoHk2IteHPmY+IftiqSu\n"  +


                  "NUpNy3QV8rwkAfhDPPM1JhEfKfIe8JMWmfuvPS+xBXzx3sZu5+p2HqHqBSyRcUJq\n"  +


                  "BflqV5nofYYp/BYR5f0YqKLlHGFxGo6WyoQBitFZh7xdGVrqp3ZFb07Fw3Bnqtld\n"  +


                  "Rd7V2O7nUyHXWBWhwetO2zg++CL8GLDLEDgN+SRzkOWRAP9apNDSolYgwFEdVpeY\n"  +


                  "KLIqBxbilPPJoK0UbSCHcEZwA5nHdzA1922HU9CkxLbHwcbKry83jQnfdGE/MIJl\n"  +


                  "0x8/NQKCAQEA0Bev1L9Dt7AggMgq1Mu7cYOjhnFEwW7MKr1L/8VYJBExFXjekiGD\n"  +


                  "qRtZpPiQijJi/PTwFvMwPhTOEUGabw83jm465mQIkLDhWM0yb6MZg8fOnk6btsYs\n"  +


                  "5YZIXQKO7Tu5Ld1TitC+CMWvyLUrwwTuIYiiQjuFPRUrEtGESfVdOi7WG0Isvegm\n"  +


                  "gXuXtGdxpUoulu+Fs0qsug8Nl3hrQE7MmkfjZQZHZhUgSPquBL7+0TgzZKHd+7BU\n"  +


                  "BJ6xtZjgPi9S2lUAUx3JCp62LtXmy/QfhSWt738gtTtTLEXRGLwbgdGZkmfHrcLq\n"  +


                  "0jk0t56stmNiCqDJO+DGlA8nnKmnFDpxBwKCAQEAmV7d77sNH85vG1qEDT+RWyfv\n"  +


                  "NOZDofZMZSHbH5kLgfMJMccsrIGTAsvu0doceZukAJVv0wjjdTL/JOk8AzK9wo9F\n"  +


                  "RebHNoLKpGXpoD8LC4wO1PIYPdc3jzOgmtyNPQsp83sIasUzJpKrV9sAdEvBllgt\n"  +


                  "X7SAvAUyrh7PkOJDFOR1IAY8DGhxNmMZzuC3gMDsTCGasg0VWS5YBym9dI83CsL6\n"  +


                  "mdORAxOVsMVhxkkCnCFisxp1ufruqg7y0/18zeM2mhkOmWGmZ+t4SWaBcp41GAZb\n"  +


                  "cPytKQu2RD6optpJL8U2pQrZZJDYy/qNNGH2tOeXN/6wQBzd3gf19qxWJMpwfg==\n"  +


                  "-----END RSA PRIVATE KEY-----" ;

  // PKSC8 格式的私钥
  private static  final  String PKSC8_RSA_PRIVATE_KEY =
          "-----BEGIN PRIVATE KEY-----\n"  +


                  "MIIJRAIBADANBgkqhkiG9w0BAQEFAASCCS4wggkqAgEAAoICAQCusbPO2ry0Mfje\n"  +


                  "CT2qq+U25Q9kkBzaUermkKZhpAahJF+rRUTkOShjIez613ELSjd+M6QmeHPcIzn7\n"  +


                  "ecrCpERQVwxvY+DSRWS0WMCl3wHRBrosqcTy5fzXlc7BL0rslcsB6bmBoBkFVSzv\n"  +


                  "dD5Sw2SJ/UiaJgzjXkDY88x5Peuc5ZxnrZupSMCvwuBO3UuWL2zpoNnTvT8sWklW\n"  +


                  "GTjmxkr3QpqWkTL7yrtT5CJdfwsCr8r6eRmFeqZnlHc49puYzZ7mRy+Dwe0mz4NV\n"  +


                  "ix8ZNLx2L/duHYONMh38fs02FXYHhe1w1HuarxtChyx44YttAFB6StU87CMkKB3o\n"  +


                  "QHLNVtmiMYTmO4xv44VOYWocmWx9jrgRqUsbR5l82oNz/o7fyhNK6cAiUzBi0QD1\n"  +


                  "gPZVPwN5xZo0qwxf+8+j843h1aqW0qtDKnueQhMimpsvx3O6NowzJVeqgsa1IXpc\n"  +


                  "M053VrJCP8HavrFkrGZib0jTm9XcxCnGLpeQ36vT2MuxLgVoIGA1VnuoFLZMRd9h\n"  +


                  "09cetxEAzamJGqIghyvq+nenonljkP10SE5sgXDVrRun+BItwCv0Oz71we/k6/V9\n"  +


                  "FGFkN5k1fjHO2sqCypJMk0It5k5i2+nbMCTTwWefjzhlZGKa4k6BgrHQu5tHTXTs\n"  +


                  "/AC+KHbYkRsDcB8PuJZikBdViQ22XQIDAQABAoICAB7heNiLICp2XvjZB1ahNk6i\n"  +


                  "5TqwovkQ3AZP8al29lkL9gFvqELzu6jyeVLKPMhzISYk+NJ4Hnr+myRSHj6UDSNq\n"  +


                  "j98s97QT4j5jJgLsTgTmPIjipdcOQsjVSYwq0QLLY+x9pXY9l86yhNP7Z3z331Dp\n"  +


                  "PilJqqOSqMHxLucLxBejGyfUr5yYKL+pIj+urMrqrUULUxYz8PPlLeuTX9SjnuLg\n"  +


                  "mjUdi7ao2r50qIKAj7C05JusRo+q47mRrBWculqjloA8ezC+Wi6vJhc8FY4+HUaD\n"  +


                  "KikD/Jo8DsLwo1P5LTkdOqDkXsk0RQxYmsrvi9cD5DYJ/nHbiEa+9LJ2mhSkUqon\n"  +


                  "c7feM9yEpmSRSTpdJ2ngcbhKfvbui9Wu5W47LXzD0y/MoISbd88f/JKZckYsu4hI\n"  +


                  "SLynSJWse67IPXRs3DjUSeRhvELZ/L+3PD+CPjsb3AJzZzhKryHGYG9OmnN4cpVB\n"  +


                  "11zVwu2b4ILI9XMWSchnHV0/kYLe171qqTLe/mWLZF/N67GwW3zMi2TYcsBTubic\n"  +


                  "Hq5u7eDp0D07Lylbb/tW/0aC9RMZSg+8Haa8CpOt2a+NtIJXfjTaNoVWqNJ7ydKh\n"  +


                  "vub/fb7oNe7vRBlnuA+LngYf26EQwocuzHk5hqUIfJXnR+eVyjwWvlvEBHEAoTIu\n"  +


                  "OhoEBMoQDQ0RD5Q5Pu49AoIBAQDVjhKS2lQkaAb5kXAL1Jcb5I3Lbfm56TQttH/Y\n"  +


                  "5HS2gcto8Y0MFj+alxkcVAyiCYesoNB33U98q8GWEYSsviWC7oARpUjqsjfO0CUO\n"  +


                  "ZW7TWQyaYYC2/3Bd9sXpLbxGngEXOl1UHRJfjGFo51iGNMEQuQKECqnXB0Rk5n00\n"  +


                  "wnH9U8nsN/KnyTDnqGTW+bQg5yy4a8Hypsj3E/EYp9OXdBL1w8EqZbMi1TuBAtXY\n"  +


                  "ax5REDwSJVQVPXwY3K+5+0kTWs3RiUO+0yWF7dkMZ1bQ4K+jkagqRZTbuB3hVPhG\n"  +


                  "QhGO69vKQKA5385fYU76bhLXafgqkOdHw3oLl6AWUGKpyFRfAoIBAQDRalh9MRCe\n"  +


                  "w/pbzsg19Z18UKMhQXHHQgMYiAo1ibcVx3fzLUQR0NOwIind3SNEqLFVbsC4zWqW\n"  +


                  "OWbA1MLvJXYNGOqG+rFk6T5TOtEgNoEVIGetX+3H/YevmXh6qM5Ej0GGTCpIWwOu\n"  +


                  "dCn2FveFgxWgWnW6zCLMvrfWkcA+nq0s7YuELIPQvKS/auipWFmVQZ6+NvtWSpZZ\n"  +


                  "SdPBJJrGbCln4RPJ1ksjlO2heHZWVkzKGQ8KGIw3xEdcEj/FK61NpdWTNllWPj6T\n"  +


                  "W3tjm8fzbqT5a5WlmThkVeb9P4zk2miYq2fqpulcBAsbDq2e7MhUQAOz/DG44UXi\n"  +


                  "lETe7OfwD87DAoIBAQC/dx+D9qeV9Ia8Xv78PGA2q9XNXA6X9lPH3pr5VOqnbvt2\n"  +


                  "XYs+GPxxl6L12Q1ygeTYi14c+Zj4h+2KpK41Sk3LdBXyvCQB+EM88zUmER8p8h7w\n"  +


                  "kxaZ+689L7EFfPHexm7n6nYeoeoFLJFxQmoF+WpXmeh9hin8FhHl/RioouUcYXEa\n"  +


                  "jpbKhAGK0VmHvF0ZWuqndkVvTsXDcGeq2V1F3tXY7udTIddYFaHB607bOD74IvwY\n"  +


                  "sMsQOA35JHOQ5ZEA/1qk0NKiViDAUR1Wl5gosioHFuKU88mgrRRtIIdwRnADmcd3\n"  +


                  "MDX3bYdT0KTEtsfBxsqvLzeNCd90YT8wgmXTHz81AoIBAQDQF6/Uv0O3sCCAyCrU\n"  +


                  "y7txg6OGcUTBbswqvUv/xVgkETEVeN6SIYOpG1mk+JCKMmL89PAW8zA+FM4RQZpv\n"  +


                  "DzeObjrmZAiQsOFYzTJvoxmDx86eTpu2xizlhkhdAo7tO7kt3VOK0L4Ixa/ItSvD\n"  +


                  "BO4hiKJCO4U9FSsS0YRJ9V06LtYbQiy96CaBe5e0Z3GlSi6W74WzSqy6Dw2XeGtA\n"  +


                  "TsyaR+NlBkdmFSBI+q4Evv7RODNkod37sFQEnrG1mOA+L1LaVQBTHckKnrYu1ebL\n"  +


                  "9B+FJa3vfyC1O1MsRdEYvBuB0ZmSZ8etwurSOTS3nqy2Y2IKoMk74MaUDyecqacU\n"  +


                  "OnEHAoIBAQCZXt3vuw0fzm8bWoQNP5FbJ+805kOh9kxlIdsfmQuB8wkxxyysgZMC\n"  +


                  "y+7R2hx5m6QAlW/TCON1Mv8k6TwDMr3Cj0VF5sc2gsqkZemgPwsLjA7U8hg91zeP\n"  +


                  "M6Ca3I09CynzewhqxTMmkqtX2wB0S8GWWC1ftIC8BTKuHs+Q4kMU5HUgBjwMaHE2\n"  +


                  "YxnO4LeAwOxMIZqyDRVZLlgHKb10jzcKwvqZ05EDE5WwxWHGSQKcIWKzGnW5+u6q\n"  +


                  "DvLT/XzN4zaaGQ6ZYaZn63hJZoFynjUYBltw/K0pC7ZEPqim2kkvxTalCtlkkNjL\n"  +


                  "+o00Yfa055c3/rBAHN3eB/X2rFYkynB+\n"  +


                  "-----END PRIVATE KEY-----" ;

  // jwt 三部分：

  // header:  算法和token类型 对称解密
  // {
  //  "alg": "HS256",
  //  "typ": "JWT"
  // }

  // payload:
  // {
  //  "sub": "1234567890",
  //  "name": "John Doe",
  //  "iat": 1516239022
  // }
  //
  // jwt标准中注册的声明
  // iss: jwt签发者
  // sub: jwt所面向的用户
  // aud: 接收jwt的一方
  // exp: jwt的过期时间，这个过期时间必须要大于签发时间
  // nbf: 定义在什么时间之前，该jwt都是不可用的.
  // iat: jwt的签发时间
  // jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。
  //
  // 公共的声明 ：
  // 公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不建议添加敏感信息，因为该部分在客户端可解密.
  // 私有的声明 ：
  // 私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为base64是对称解密的，意味着该部分信息可以归类为明文信息。

  // signature: 签名信息
  // 由header(base64后)和payload(base64后)用.连接，然后使用header中加密方式加盐secret组合加密，构成了第三部分

  // 加密算法 RSA、DES、AES
  // RSA 非对称加密 公钥加密，私钥解密 长度有512bit、1024bit、2048bit、4096bit，长度越长越安全 实质是大数质数分解
  // DES 对称加密 密钥56bit，一般使用独立密钥的三级DES即 3DES
  // AES 对称加密 密钥128bit、196bit、256bit，通常先传输RSA加密过的密钥给对方，再使用AES加密通讯

  // 可逆加密算法：
  // 对称加密算法：加密解密使用同一个密钥，AES、DES、3DES、Blowfish、IDEA、RC4、RC5、RC6、HS256
  // 非对称加密算法：加密和解密使用两个密钥 ，RSA、DSA（数字签名用）、ECC（移动设备用）、RS256 (采用SHA-256 的 RSA 签名)
  // 不可逆加密算法：
  // 加密后不能得到原文， 散列算法(md5), 摘要算法等
  // MD5（能够撞库）、SHA、HMAC、bcrypt

  // 数字签名：目的是验证数据是否被篡改，防止伪造。对数据进行hash摘要（SHA1、SHA256、SHA512），再使用非对称加密进行加密（私钥），这样就得到了原始数据的一个签名
  // 验证签名时，只需要使用公钥进行解密，然后自己对数据进行一个同样摘要，对比两个摘要即可签证
  // 签名算法：
  // HS256: 使用同一个「secret_key」进行签名与验证（对称加密）。一旦 secret_key 泄漏，就毫无安全性可言了。
  // RS256: 是使用 RSA 私钥进行签名，使用 RSA 公钥进行验证。公钥即使泄漏也毫无影响，只要确保私钥安全就行。
  //        RS256 可以将验证委托给其他应用，只要将公钥给他们就行。
  // ES256: 和RS256 一样，都使用私钥签名，公钥验证。算法速度上差距也不大，但是它的签名长度相对短很多（省流量），并且算法强度和 RS256 差不多。

  // 摘要算法：
  // SHA1、SHA256、SHA512、HMAC（使用密钥对数据进行摘要）

  // jwt的签名算法JWT 的签名算法有三种：
  //1.对称加密HMAC【哈希消息验证码】  HS256/HS384/HS512 加密解密使用同一个密钥
  //2.非对称加密RSA【RSA签名算法】RS256/RS384/RS512 需要一个公钥和私钥
  //3.ECDSA【椭圆曲线数据签名算法】 ES256/ES384/ES512，RSA签名

  // urlsafe的base64加密字符串
  // 标准的Base64并不适合直接放在URL里传输，因为URL编码器会把标准Base64中的“/”和“+”字符变为形如“%XX”的形式，
  // 而这些“%”号在存入数据库时还需要再进行转换，因为ANSI SQL中已将“%”号用作通配符。为解决此问题，可采用一种用于URL的改进Base64编码，
  // 它去除了在末尾填充'='号，并将标准Base64中的“+”和“/”分别改成了“-”和“_”，这样就免去了在URL编解码和数据库存储时所要作的转换，
  // 避免了编码信息长度在此过程中的增加，并统一了数据库、表单等处对象标识符的格式。


  private static final String  SECRET = "token_secret";

  private static final String  ISSUER = "code_office_user";

  public static final String KEY_ALGORITHM = "RSA";

  private static final String PUBLIC_KEY = "RSAPublicKey";

  private static final String PRIVATE_KEY = "RSAPrivateKey";

//  public static Map<String, Object> initKey() throws Exception {
//    KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(KEY_ALGORITHM);
//    keyPairGen.initialize(1024);
//    KeyPair keyPair = keyPairGen.generateKeyPair();
//    RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
//    RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
//    Map<String, Object> keyMap = new HashMap<String, Object>(2);
//    keyMap.put(PUBLIC_KEY, publicKey);
//    keyMap.put(PRIVATE_KEY, privateKey);
//    return keyMap;
//
//  }


  public static String genToken(Map<String, String> claims){
    try {
      Algorithm algorithm = Algorithm.HMAC256(SECRET);
      JWTCreator.Builder builder = JWT.create().withIssuer(ISSUER).withExpiresAt(DateUtils.addDays(new Date(), 365));
      // 自定义声明
      claims.forEach((k,v) -> builder.withClaim(k, v));
      return builder.sign(algorithm).toString();
    } catch (IllegalArgumentException  e) {
      throw new RuntimeException(e);
    }
  }

  public static String genTokenWithRSA(Map<String, String> claims){
    try {
      KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
      keyPairGen.initialize(1024);
      KeyPair keyPair = keyPairGen.generateKeyPair();
      RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
      RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();

      Algorithm algorithm = Algorithm.RSA256(new RSAKey() {
        @Override
        public BigInteger getModulus() {
          return null;
        }
      });
      JWTCreator.Builder builder = JWT.create().withIssuer(ISSUER).withExpiresAt(DateUtils.addDays(new Date(), 365));
      // 自定义声明
      claims.forEach((k,v) -> builder.withClaim(k, v));
      return builder.sign(algorithm);
    } catch (IllegalArgumentException | NoSuchAlgorithmException e) {
      throw new RuntimeException(e);
    }
  }

  public static Map<String, String> verifyToken(String token)  {
    Algorithm algorithm = null;
    try {
      algorithm = Algorithm.HMAC256(SECRET);
    } catch (IllegalArgumentException  e) {
      throw new RuntimeException(e);
    }
    JWTVerifier verifier = JWT.require(algorithm).withIssuer(ISSUER).build();
    DecodedJWT jwt =  verifier.verify(token);
    Map<String, Claim> map = jwt.getClaims();
    Map<String, String> resultMap = Maps.newHashMap();
    map.forEach((k,v) -> resultMap.put(k, v.asString()));
    return resultMap;
  }

  public static void main(String[] args) {
    String token = JwtHelper.genToken(ImmutableMap.of("id", "1000", "mobile", "13589298690", "ts", String.valueOf(Instant.now().getEpochSecond())));
    System.out.println(token);
    Map map=JwtHelper.verifyToken(token);
    System.out.println(JSON.toJSONString(map));
  }
}
