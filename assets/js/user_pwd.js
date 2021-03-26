$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        newPwd: function(value) {
            if ($('.layui-form-item [name=oldPwd]').val() == $('#newPwd').val()) {
                return '新密码不能和原密码不能相同';
            }
        },
        newPwds: function(value) {
            if ($('#newPwd').val() !== $('#surePwd').val()) {
                return '两次输入的新密码不相同';
            }
        },
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ]
    })
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('重置密码失败')
                }
                layer.msg('修改密码成功');
                // 重置表单值
                $('.layui-form')[0].reset();
            }
        })
    })
})