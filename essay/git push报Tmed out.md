

## 背景

我需要把一个项目推送到GitHub上面，也按照之前的做法做过了

![image-20230704214646763](https://raw.githubusercontent.com/195sjin/myBed/master/images202307042146864.png)

一切都正常，但就是在最后的push总是说失败，提示超时

使用git真的让人蒙圈，比如我一直不理解为什么总是会出现

failed: unable to access: failed to connect to github.com port 443: Tmed out



## 解决

![image-20230704214831748](https://raw.githubusercontent.com/195sjin/myBed/master/images202307042148788.png)

把圈出来的地方随便在改成其他的，最后在选这个就可以了，我上面就把这个改成了ssh-git，选择ssh-git后，然后就成功了

它这里的Name是随便定义都行的