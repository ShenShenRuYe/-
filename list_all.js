// 检查是否有无障碍服务权限
auto.waitFor();

// 获取当前页面的所有控件
function listAllElements() {
    console.log("开始列出页面所有控件及属性...");

    // 遍历当前页面的控件树
    let allElements = packageNameMatches(/.*/).find();
    allElements.forEach(function (element, index) {
        console.log("控件 " + index + ":");
        console.log("文本: " + element.text());
        console.log("描述: " + element.desc());
        console.log("包名: " + element.packageName());
        console.log("类名: " + element.className());
        console.log("ID: " + element.id());
        console.log("可见性: " + element.visibleToUser());
        console.log("点击状态: " + element.clickable());
        console.log("坐标范围: " + element.bounds());
        console.log("--------------------");
    });

    console.log("页面控件信息列出完成！");
}

// 调用列出控件的方法
listAllElements();
