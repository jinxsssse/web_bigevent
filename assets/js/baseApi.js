$(function() {
    // 注意：每次调用$.get()或$.post,$.ajax时
    // 会先调用   ajaxPrefilter 这个函数
    // 在这个函数中我们可以拿到 ajax 提供的配置对象
    $.ajaxPrefilter(function(options) {
        // 在发起 真正的ajax请求之前,统一拼接请求的根路径 相当于覆盖了
        options.url = 'http://ajax.frontend.itheima.net' + options.url;
        // 同一为有权限的接口，设置headers请求头
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }
    })
})