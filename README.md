ringring
========

author: tulayang<br />
email: itulayangi@gmail.com iwangtongi@163.com

Markdown语法正在改变现在的网络文本编辑方式,博客,论坛,社区都在使用Markdown来作为首先编辑器. 然而对于Markdown语法不熟悉的编辑器使用者,需要为他们提供一些UI,辅助他们进入Markdown的文笔世界.

ringring帮助开发者提供文本捕捉方法,对于常用的标题格式化,引用格式化,插入代码,插入下划线...提供了现成的解决方案.

ringring依赖CodeMirror模块.

另外,如果你想编写可视化代码高亮好用的markdown编辑器,还需要借助其他几个模块.

 * [CodeMirror](https://github.com/tulayang/CodeMirror)  
   Ringring依赖的主要模块,提供编辑器基础编辑功能
 * [marked](https://github.com/chjj/marked)  
   html解析器模块,解析编辑器的文本字符串,生成HTML字符串
 * [highlight](https://github.com/isagalaev/highlight.js)  
   html代码高亮模块,程序员用户的福音
 * [font-awesome](https:http://fontawesome.io)  
   twitter出品的文字图标,简单的配置,就能获得众多的按钮图标,而只有非常低的流量消耗


Demo
====

**demo/**提供了一个演示版的markdown编辑器. 跟上次写的amarkdown编辑器不同,这次的demo版本只提供了基础的css方案,但是所有的内部功能都做了开放.

通过ringring提供的API,和自定义的css,可以编写更个性化的markdown编辑器.

如果你打算借助**ringring**写一个markdown编辑器,请一定参考**demo/index.html**.


API
===

Event Handlers
--------------

提供了多个DOM元素交互的事件处理器，帮助开发者处理Markdown编辑器的文本格式化．

**onhead(cm, cmdoc)**

'abc' => '# abc'

捕捉当前编辑器的选择文本(包括ctrl选择的多项选区),　格式化为标题文本．

示例：

```
// HTML页面，设定文本输入框textarea，和触发按钮
// 触发按钮可以是任意的HTML元素
<textarea id="textarea"></textarea>
<button id="btn-head"></button>
```

```
// 调用CodeMirror，格式化文本输入框，使其变为CodeMirror编辑器
// 这个过程只需要运行一次，请确保cm, cmdoc能够保持在需要的作用域环境，以便于引用
var cm = CodeMirror.fromTextArea(document.getElementById('textarea'), { lineWrapping : true });
var cmdoc = cm.getDoc();
// 为触发元素添加事件处理器
var btn = document.getElementById('btn-head');
btn.addEventListener('click', RingringRingring.onhead(cm, cmdoc), false);
```

**onlistitem(cm, cmdoc)**

'abc' => '- abc'

捕捉当前编辑器的选择文本(包括ctrl选择的多项选区),　格式化为列表项．

示例：

```
<button id="btn-listitem"></button>
```

```
var btn = document.getElementById('btn-listitem');
btn.addEventListener('click', Ringring.onlistitem(cm, cmdoc), false);
```

**onempha(cm, cmdoc)**

'abc' => '*abc*'

捕捉当前编辑器的选择文本(包括ctrl选择的多项选区),　格式化为强调文本．

示例：

```
<button id="btn-empha"></button>
```

```
var btn = document.getElementById('btn-empha');
btn.addEventListener('click', Ringring.onempha(cm, cmdoc), false);
```

**onblockquote(cm, cmdoc)**

'abc' => '> abc'

捕捉当前编辑器的选择文本(包括ctrl选择的多项选区),　格式化为引用文本．

示例：

```
<button id="btn-blockquote"></button>
```

```
var btn = document.getElementById('btn-blockquote');
btn.addEventListener('click', Ringring.onblockquote(cm, cmdoc), false);
```

**oncode(cm, cmdoc)**

'abc' => '```\nabc\n```'

捕捉当前编辑器的选择文本(包括ctrl选择的多项选区),　格式化为代码文本．

示例：

```
<button id="btn-code"></button>
```

```
var btn = document.getElementById('btn-code');
btn.addEventListener('click', Ringring.oncode(cm, cmdoc), false);
```

**online(cm, cmdoc)**

'abc' => '----------'

捕捉当前编辑器的选择文本(包括ctrl选择的多项选区),　格式化为水平线．

示例：

```
<button id="btn-line"></button>
```

```
var btn = document.getElementById('btn-line');
btn.addEventListener('click', Ringring.online(cm, cmdoc), false);
```

**onblock(cm, cmdoc, format)**

'abc' => '\nUUUUUU\n'

捕捉当前编辑器的选择文本(包括ctrl选择的多项选区),　格式化为块文本．
块文本在内容前后会有换行符．

示例：

```
<button id="btn-custom"></button>
```

```
var btn = document.getElementById('btn-custom');
btn.addEventListener('click', Ringring.onblock(cm, cmdoc, function () {
    return 'UUUUUU';
}), false);
```

**oninner(cm, cmdoc, format)**

'abc' => 'UUUUUU'

捕捉当前编辑器的选择文本(包括ctrl选择的多项选区),　格式化为内联文本．
这个事件处理器,可以用于处理插入超级链接,插入图片路径.

示例：


```
<button id="btn-custom"></button>
```

```
var btn = document.getElementById('btn-custom');
btn.addEventListener('click', Ringring.oninner(cm, cmdoc, function () {
    return 'UUUUUU';
}), false);
```

Methods
=======

事件处理器的方法方式．
当需要对同一个事件，进行特殊的操作时，可以使用这些方法．
每一个方法对应Events提供的事件处理器．

**head(cm, cmdoc)**

```
btn.addEventListener('click', function () {
    // do something
    Ringring.head(cm, cmdoc);
    // do something
}, false);
```

**listitem(cm, cmdoc)**

```
btn.addEventListener('click', function () {
    Ringring.listitem(cm, cmdoc);
}, false);
```

**empha(cm, cmdoc)**

```
btn.addEventListener('click', function () {
    Ringring.empha(cm, cmdoc);
}, false);
```

**blockquote(cm, cmdoc)**

```
btn.addEventListener('click', function () {
    Ringring.blockquote(cm, cmdoc);
}, false);
```

**code(cm, cmdoc)**

```
btn.addEventListener('click', function () {
    Ringring.code(cm, cmdoc);
}, false);
```

**line(cm, cmdoc)**

```
btn.addEventListener('click', function () {
    Ringring.line(cm, cmdoc);
}, false);
```

**block(cm, cmdoc, format)**

```
btn.addEventListener('click', function () {
    Ringring.block(cm, cmdoc, function () { return 'UUUUUU'; });
}, false);
```

**inner(cm, cmdoc, format)**

```
btn.addEventListener('click', function () {
    Ringring.inner(cm, cmdoc, function () { return 'UUUUUU'; });
}, false);
```

Widgets
-------

提供了一些富组件,用来处理复杂的DOM交互．

**uploader(config, callback)**

图片上传组件,提供iframe方式的上传.
支持度: IE9+, Firefox, Chrome, Opera, Safari

示例:

```
<style>
#uploader {
    position:relative;
    width:602px;
    height:202px;
}
#open {
    position:absolute;
    top:0;
    left:0;
    width:602px;
    height:202px;
}
#displayer {
    border: 1px solid rgb(245,245,245);
    width:600px;
    height:200px;
}
#loading {
    position:absolute;
    top:50%;
    left:50%;
    margin-top:-30px;
    margin-left:-60px;
}
#form {
    display:none;
}
</style>

<!--
    HTML页面设定上传元素,至少包括:
       open                   : 打开元素,打开文件夹
       displayer              : 显示图片的iframe框架
       form[target=displayer] : 上传图片的表单
       input[type=file]       : 上传图片的文件元素
-->
<div id="uploader">
    <div id="open"></div>
    <img id="loading" src="loading.gif" alt="loading"/>
    <iframe id="displayer" name="displayer" scrolling="no"></iframe>
    <form id="form" action="a.jpg" method="post" target="displayer">
        <input type="file" id="file" name="file"/>
    </form>
</div>
<input type="text" id="url" name="url"/>

<script>
Ringring.uploader({
    elemIframe: document.getElementById('displayer'),
    elemLoading: document.getElementById('loading'),
    elemForm: document.getElementById('form'),
    elemFile: document.getElementById('file'),
    elemOpen: document.getElementById('open')
}, function (src) { 
    // 当上传完毕后,服务器传回图片信息,
    // 这个回调函数可以处理传回图片路径
    document.getElementById('url').value = src;
});
</script>
```

**closer(config)**

关联打开元素,关闭元素,框体,形成一个可以打开关闭的弹出框.

示例:

```
<style>
#container {
    display:none;
    position:absolute;
    background:rgb(245,245,245);
    top:100px;
    left:100px;
    width:200px;
    height:100px;
}
</style>

<button id="opener">open</button>
<button id="closer">close</button>
<div id="container">text</div>

<script>
Ringring.closer({
    elemOpen: document.getElementById('opener'),
    elemClose: document.getElementById('closer'),
    elemContainer: document.getElementById('container'),
    touch: true // 如果为true,当点击窗口非选择区域时,也会关闭框体
});
</script> 
```

Example
=======

一个成形的Markdown编辑器示例:

```
<!Doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>a make down editor</title>

    <link type="text/css" rel="stylesheet" href="font-awesome-4.2.0/css/font-awesome.min.css"/>
    <link type="text/css" rel="stylesheet" href="codemirror/lib/codemirror.css"/>
    <link type="text/css" rel="stylesheet" href="highlight/styles/xcode.css"/>
    <link type="text/css" rel="stylesheet" href="ringring.css"/>

    <script src="codemirror/lib/codemirror.js"></script>
    <script src="codemirror/mode/markdown/markdown.js"></script>
    <script src="marked/lib/marked.js"></script>
    <script src="highlight/highlight.pack.js"></script>
    <script src="ringring.js"></script>
</head>
<body>
    <div class="rr">
        <div class="rr-container">
            <div class="rr-col">
                <menu class="rr-menu">
                    <li class="rr-head"><i class="fa fa-text-height"></i></li>
                    <li class="rr-listitem"><i class="fa fa-list"></i></li>
                    <li class="rr-empha"><i class="fa fa-italic"></i></li>
                    <li class="rr-blockquote"><i class="fa fa-indent"></i></li>
                    <li class="rr-code"><i class="fa fa-code"></i></li>
                    <li class="rr-line"><i class="fa fa-ellipsis-h"></i></li>
                </menu>
                <div class="rr-input">
                    <input type="text" name="title" placeholder="..."/>
                </div> 
                <textarea class="rr-text"></textarea>
            </div>
            <div class="rr-col">
                <div class="rr-preview"></div>
            </div>
        </div>
    </div>

    <script> 
    (function (Ringring, CodeMirror, marked, hljs) {
        var rr = document.querySelector('.rr'),
            rrText       = rr.querySelector('.rr-text'),
            rrPreview    = rr.querySelector('.rr-preview'),
            rrHead       = rr.querySelector('.rr-head'),
            rrListitem   = rr.querySelector('.rr-listitem'),
            rrEmpha      = rr.querySelector('.rr-empha'),
            rrBlockquote = rr.querySelector('.rr-blockquote'),
            rrCode       = rr.querySelector('.rr-code'),
            rrLine       = rr.querySelector('.rr-line');

            // 初始化编辑器,详情请参看CodeMirror模块说明文档
            cm = CodeMirror.fromTextArea(rrText, {
                lineWrapping: true,
                lineNumbers: true
            }),
            cmdoc = cm.getDoc();

        // 设置marked模块配置,详情请参看marked模块说明文档
        marked.setOptions({
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            sanitize: false
        });

        // 当编辑器文本内容变化时,在预览视图解析为HTML内容
        cm.on('change', function (cm, change) {
            // cmdoc.getValue() : 编辑器文本字符串
            marked(cmdoc.getValue(), function (err, content) {
                // content : 解析后的HTML文本字符串
                rrPreview.innerHTML = content;
            });
        });

        // 注册编辑器事件
        // 标准的DOM事件
        // jQuery方式: 
        //     $('.rr .rr-head').on('click', Ringring.onhead(cm, cmdoc));
        rrHead.addEventListener('click', Ringring.onhead(cm, cmdoc), false);
        rrListitem.addEventListener('click', Ringring.onlistitem(cm, cmdoc), false);
        rrEmpha.addEventListener('click', Ringring.onempha(cm, cmdoc), false);
        rrBlockquote.addEventListener('click', Ringring.onblockquote(cm, cmdoc), false);
        rrCode.addEventListener('click', Ringring.oncode(cm, cmdoc), false);
        rrLine.addEventListener('click', Ringring.online(cm, cmdoc), false);
    }(Ringring, CodeMirror, marked, hljs));
    </script>
</body>
</html>
```
