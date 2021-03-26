$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }
    });
    // 获取用户信息
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                form.val("form_userinfo", res.data);
            }
        })
    };

    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
            e.preventDefault();
            $('.layui-form-item [name=nickname]').val('');
            $('.layui-form-item [name=email]').val('');
        })
        // 提交用户信息表单
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户成功')
                    // 调用父页面的方法，重新渲染用户头像和用户信息
                window.parent.getUserInfo();
            }
        })
    })
})