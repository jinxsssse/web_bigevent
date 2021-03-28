$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.filterName = function(date) {

        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = dt.getMonth() + 1;
        var d = dt.getDate()
        var hh = dt.getHours()
        var mm = dt.getMonth()
        var ss = dt.getSeconds()
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页数据
        pagesize: 4, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的id
        state: '', //文章的发布状态
    }
    initTable();
    initCate();
    // 获取文章列表数据的方法\


    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面的数据
                var htmlsr = template('tpl-table', res)
                $('tbody').html(htmlsr);
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })

    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 使用模板引擎渲染分类的可选项
                var htmlsr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlsr);
                // 因为layui加载后看到 下拉菜单没有内容 默认会添加一个空选项
                // 通过 layui 重新渲染表单区域的ui结构
                form.render();
            }
        })
    }

    // 为筛选表单绑定submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新的筛选条件，重新渲染表格的数据
        initTable();
    })
    var a = true;
    // 定义渲染分页的方法
    function renderPage(total, first) {
        a = true;
        // 调用 laypage.render方法 渲染分页的结构
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            //1. 点击页码时候，触发jump回调
            // 2.只要调用了 laypage.render()方法，就会触发jump回调
            jump: function(obj) {
                // 把最新的页码值，赋值到q
                q.pagenum = obj.curr;
                //根据最新的q获取对应的数据列表，并渲染表格

                if (a !== true) {
                    initTable();
                }
                a = false;
                /*  // 可以通过first的值，来判断是通过哪种方式，触发jump 回调
                 // 如果first 的值为true 证明是方式2
                 // 否则就是方式1触发的
                 if (!first) {
                     initTable();
                 } */
            }
        });
    }

})