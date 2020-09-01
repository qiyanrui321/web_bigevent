$(function() {
    // 点击去注册账号
    $("#link_reg").on('click', function() {
            $(".login").hide()
            $(".reg").show()
        })
        // 点击去登录
    $("#link_login").on("click", function() {
            $(".login").show()
            $(".reg").hide()
        })
        //从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
        //通过form.verify()函数自定义校验规则
    form.verify({
            //自定义了一个叫ped的校验规则
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            //校验两次密码是否一致的规则
            repwd: function(value) {
                //  通过形参value 拿到的是确认密码框中的内容     还需要拿到密码框中的内容
                // 然后进行一次相等判断 失败则return一个提示
                var pwd = $('.reg [type=password]').val()
                if (value !== pwd) {
                    return '两次密码不一致'
                }
            }
        })
        // 监听表单注册事件
    $("#form_reg").on('submit', function(e) {
            //阻止表单的默认提交事件
            e.preventDefault()
                // 2.发起ajax POST请求
            var data = {
                username: $("#form_reg [name=username]").val(),
                password: $("#form_reg [name=password]").val(),
            }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                layer.msg('注册成功，请登录!')
                    //调用点击事件
                $("#link_login").click()
            })
        })
        //监测表单登录事件
    $("#form_login").submit(function(e) {
        // 阻止表单默认提交事件
        e.preventDefault()
            // 发起POST请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功')
                console.log(res);
                // 将登录得到的token字符串保存到本地存储中
                localStorage.setItem('token', res.token)
                    //跳转到主页
                location.href = 'index.html'
            }
        })
    })
})