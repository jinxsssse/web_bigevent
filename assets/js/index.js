$(function() {
    // 调用getUserInfo获取用户基本信息
    var layer = layui.layer
    getUserInfo();
    $('#close').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确认退出吗?', { icon: 3, title: '提示' }, function(index) {
            // 1.清空本地存储的 token 
            localStorage.removeItem('token');
            // 2.重新跳转到登录页面
            location.href = '/login.html'
                // 关闭 confirm 询问框
            layer.close(index);
        });
    })
});
// 获取用户基本信息

function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
                // return location.href = '/login.html';
            };
            // 调用renderAvatar渲染用户头像
            renderAvatar(res.data);
        },
        // 无论成功还是失败，最终都会调用complete回调函数
        complete: function(res) {
            console.log(res);
            // 在complete回调函数中   可以使用 res.responseJSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
                // 1.强制清空 token
                localStorage.removeItem('token')
                    // 2.强制跳转到登录页面
                location.href = '/login.html';
            };
        }
    });
};

function renderAvatar(data) {
    // 获取用户名称  
    var name = data.nickname || data.username;
    // var name = data.nickname ? data.nickname : data.username;
    // 设置用户名称文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户的头像
    if (data.user_pic !== null) {
        $('.layui-nav-img').prop('src', data.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        // toUpperCase()方法可以将英文小写改为大写，字符串数组序列号 可得到想要指定字符
        var firstName = name[0].toUpperCase();
        $('.text-avatar').html(firstName).show();
    }

}