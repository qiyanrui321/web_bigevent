$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)

            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())

            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm +
                ':' + ss
        }
        //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据，默认每页显示2条
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }
    initArtList()
    initCate()
        // 初始化文章列表
    function initArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                //渲染模板引擎
                console.log(res);
                var htmlStr = template("form-table", res)
                $("tbody").html(htmlStr)
                    //获取文章列表后，调用分页方法，并将数据总条数渲染出来
                renderPage(res.total)
            }
        })
    }
    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项 
                var htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)
                    //通知layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    // 为筛选表单绑定提交事件
    $("#form-search").on('submit', function(e) {
            e.preventDefault()
                //拿到表单中的值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                //为查询对象q中对应的属性赋值
            q.cate_id = cate_id
            q.state = state
                //根据最新筛选的数据，重新渲染表格中的数据
            initArtList()
        })
        // 定义分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用layui的laypage.render()方法初始化分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //只要分页发生改变，就可以触发jump回调
            // 如果直接在jump中调用渲染文章列表的方法会产生死循环，原因如下
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候，会触发jump回调
            // 2.只要调用了laypage.render()方法，就会触发jump回调   所以不断触发，成为死循环  通过first解决
            jump: function(obj, first) {
                // 把最新的页码值，赋值到q查询参数对象中
                q.pagenum = obj.curr
                    //把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                    //可以通过first值，判断是通过哪一种方式，触发的jump回调
                    // 如果first值为true,证明是方式2触发的
                    // 否则就是方式1触发的
                if (!first) {
                    // 根据最新的q 获取对应的数据列表，并渲染表格
                    initArtList()
                }
            }
        })
    }
    // 通过代理的方式为删除按钮绑定点击事件
    $("tbody").on('click', ".btn-delete", function() {
            // console.log(1);
            //获取本页删除按钮的个数
            var len = $(".btn-delete").length
                // 获取到文章的id
            var id = $(this).attr('data-id')
                //询问用户是否删除数据
            layer.confirm('是否删除?', { icon: 3, title: '提示' }, function(index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            layer.msg('删除失败')
                        }
                        layer.msg('删除成功')
                            //当数据删除完成之后，需要判断当前这一页中，是否还有剩余的数据
                            // 如果没有剩余的数据了，则让页码值-1之后再初始化文章列表
                        if (len === 1) {
                            // 如果len的值等于1，证明删除完毕之后，页面上就没有任何数据了
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initArtList()
                    }
                })

                layer.close(index);
            });
        })
        // 通过代理的方式为编辑按钮绑定点击事件
    $("tbody").on('click', '.btn-edit', function() {
        //1.点击编辑跳转到发布文章按钮
        location.href = '../article/art_pub.html'
            // 2.跳转的同时将文章的数据渲染到文章发布里
        var id = $(this).attr('data-id')
        console.log(id);
        //     // 根据id获取文章列表
        $.ajax({
                method: 'GET',
                url: '/my/article/' + id,
                success: function(res) {
                    console.log(res);
                    // form.val('form-pub', res.data)
                }
            })
            // 3.提交文章后，更新文章内容
    })
})