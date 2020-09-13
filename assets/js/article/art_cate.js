$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
        // 初始化文章列表
    function initArtCateList() {
        //发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tplForm', res)
                $("tbody").html(htmlStr)
            }
        })
    }

    //为添加类别的按钮绑定事件
    var indexAdd = null
    $("#btnAddCate").on('click', function() {
        // 点击后弹出模态框
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });

    })

    // form-add表单是动态添加到页面上，不能直接绑定，所以要用代理的形式
    $("body").on('submit', '#form-add', function(e) {
        //阻止表单的默认提交事件
        e.preventDefault()
            //发起ajax请求添加类别
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $("#form-add").serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类列表失败')
                }
                initArtCateList()
                layer.msg('新增文章分类列表成功')
                    //根据索引删除对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 用代理的方式为编辑类别绑定点击事件
    var indexEdit = null
    $("tbody").on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        var id = $(this).attr('data-id')
            // 根据id获取文章列表
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的方式为编辑表单绑定提交事件
    $("body").on('submit', '#form-edit', function(e) {
            //阻止表单的默认提交
            e.preventDefault()
                // 发起ajax请求
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败')
                    }
                    layer.msg('更新分类数据成功')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })
        //通过代理的方式为删除按钮绑定删除事件
    $("tbody").on("click", "#btn-del", function() {
        var id = $(this).attr('data-id')
            // 先弹出确认框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // 发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg("删除失败")
                    }
                    layer.msg("删除成功")
                    layer.close(index);
                    initArtCateList()
                }
            })

        });
    })
})