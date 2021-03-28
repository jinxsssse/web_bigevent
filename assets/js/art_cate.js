$(function() {
    //获取文章分类的列表
    initArtCateList()
    var layer = layui.layer;
    var form = layui.form;

    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // 4. 调用 template 函数
                var srhtml = template('getDate', res);
                $('tbody').html(srhtml);
            }
        })
    };


    // 为添加类别按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            title: '添加文章分类 ',
            type: 1,
            area: ['500px', '300px'],
            content: $('#dialog-add').html()
        });
    });


    // 因为还没点击添加事件 
    // 弹出层并没有渲染出来 此时只能通过代理的形式绑定submit事件
    // 即事件委托 可以代理 body 元素
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功');
                // 添加完毕后自动关闭弹出层
                layer.close(indexAdd);
            }
        })
    });


    var indexEdit = null;
    // 通过事件委托 给编辑按钮绑定点击事件
    $('tbody').on('click', '#btn_edit', function() {
        // 弹出一个文章修改信息的层
        indexEdit = layer.open({
            title: '修改文章分类 ',
            type: 1,
            area: ['500px', '300px'],
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        //    发起请求 获取对应分类的数据 
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val("form-edit", res.data)
            }
        })
    })

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: "/my/article/updatecate",
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

    // 通过代理的形式，为删除按钮绑定 点击 事件
    $('tbody').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类数据成功')
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })

})