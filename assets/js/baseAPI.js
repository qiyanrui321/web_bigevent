     // 注意：每次调用$.get(),$.post(),$.ajax()的时候，会先调用这个函数
     // 在这个函数中，可以拿到我们给AJax提供的配置对象
     $.ajaxPrefilter(function(options) {
         //在发起真正的ajax请求之前，统一拼接请求的根路径 这是为了方便维护和代码简洁，因为要发很多次请求
         options.url = 'http://ajax.frontend.itheima.net' + options.url
             //统一为有权限的接口设置请求头
         if (options.url.indexOf('/my/' !== -1)) {
             options.headers = {
                 Authorization: localStorage.getItem('token') || ''
             }
         }
         //  全局统一挂载 complete函数
         options.complete = function(res) {
             // console.log('调用了complete函数');
             // console.log(res);
             if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                 // 1.强制清空token
                 localStorage.removeItem('token')
                     // 2.跳转回登录页面
                 location.href = "login.html"
             }
         }
     })