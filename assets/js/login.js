$(function() {
    // 点击‘去注册账号’的链接
    $('#link_reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    // 点击‘去登录账号’的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });
    // 从layui中获取 form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个pwd的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码的款中的内容
            // 还需要拿到密码框的内容
            // 进行一次等于判断 ，如果判断失败 ，则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 先阻止表单的默认提交行为
        e.preventDefault();
        var data = {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val(),
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            };
            layer.msg('注册成功，请登录');
            // 模拟人的点击行为
            setTimeout(function() {
                $('#link_login').click();
            }, 500);
        })
    });
    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        var data = {
            username: $('.login-box [name=username]').val(),
            password: $('.login-box [name=password]').val(),
        }
        $.post('/api/login', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            };
            layer.msg('登录成功');
            // 将登录成功得到的token字符串，保存到localstorage中
            localStorage.setItem('token', res.token)
            setTimeout(function() {
                //    跳转到后台页面
                location.href = '/index.html'
            }, 500)
        })
    });

})