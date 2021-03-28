$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initCate()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('加载文章分类失败')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var srhtml = template('tpl-Cate', res)
                $('#initCate').html(srhtml);
                // 一定要记得调用 form.render()方法
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件方法
    $('#btnChooseImage').on('click', function() {
        $('#overfile').click();
    });

    // 监听covefile的change事件 获取用户选择的文件列表
    $('#overfile').on('change', function(e) {
        // 先判断 用户有没有选择文件
        if (e.target.files.length == 0) {
            return layer.msg('请选择文件')
        }
        //  更换裁剪的图片
        // 1. 拿到用户选择的图片
        var file = e.target.files[0];

        // 2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)

        // 3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布';

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
            e.preventDefault();
            // 2.基于form表单 快速创建一个formdata对象
            var fd = new FormData($(this)[0]);

            // 3.将文章发布状态，存到fd中
            fd.append('state', art_state)

            // 4.将封面裁剪过后的图片，输出为一个文件对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) {
                    //此时blob即为 图片文件
                    // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作

                    // 5.将文件对象追加到fd中
                    fd.append('cover_img', blob)

                    // 6.发起ajax请求
                    publishArt(fd);
                })
        })
        // 定义一个发布文章方法
    function publishArt(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是formdata 格式的数据
            // 必须添加一下两个配置项
            // 不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
            contentType:  false,
            // 不对 FormData 中的数据进行 url 编码，而是将 FormData 数据原样发送到服务器
            processData:  false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功 ');

                // 发布文章成功后跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        })
    }
})