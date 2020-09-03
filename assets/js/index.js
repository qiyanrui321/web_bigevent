$(function() {
        // 调用获取用户信息的函数
        getUserInfo()
            // 为退出按钮绑定事件
        $("#btnLogout").on('click', function() {
            //提示用户是否退出
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                // 1.清空本地存储中的token
                localStorage.removeItem('token')
                    // 2.重新跳转到登录页面
                location.href = "login.html"
                    // 关闭confirm提示框
                layer.close(index);
            });
        })
    })
    //获取用户基本信息
function getUserInfo() {
    // 发起ajax请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers就是请求头配置对象 因为访问接口需要权限
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //    调用渲染用户头像的函数
            renderAvatar(res.data)
        },
        // 无论成功还是失败，最后都会调用complete函数
        // complete: function(res) {
        //     console.log('调用了complete函数');
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //         localStorage.removeItem('token')
        //             // 2.跳转回登录页面
        //         location.href = "login.html"
        //     }
        // }
    })
}
//渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的昵称，如果没有就用用户民
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $(".welcome").html("欢迎&nbsp;&nbsp;" + name)
        //3.按需渲染用户头像
    if (user.user_pic) {
        //3.1渲染图片头像
        $('.text-avatar').hide()
        $('.layui-nav-img').attr('src', user.user_pic).show()
    } else {
        //3.2渲染文字头像
        var first = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').html(first).show()
    }
}