     // 注意：每次调用$.get(),$.post(),$.ajax()的时候，会先调用这个函数
     // 在这个函数中，可以拿到我们给AJax提供的配置对象
     $.ajaxPrefilter(function(options) {
         //在发起真正的ajax请求之前，统一拼接请求的根路径 这是为了方便维护和代码简洁，因为要发很多次请求
         options.url = 'http://ajax.frontend.itheima.net' + options.url
         console.log(options.url);
     })