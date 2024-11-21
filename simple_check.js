// Auto.js 代码示例：钉钉签到脚本

// 检查是否有无障碍服务权限
auto.waitFor();

// 唤醒屏幕并解锁
console.log("唤醒屏幕...");
if (!device.isScreenOn()) {
    device.wakeUp(); // 唤醒屏幕
    sleep(1000); // 等待屏幕亮起

    // 向上滑动以解锁（适配无密码或简单滑动解锁的情况）
    console.log("解锁屏幕...");
    swipe(device.width / 2, device.height * 0.8, device.width / 2, device.height * 0.2, 500);
    sleep(1000);
} else {
    console.log("屏幕已点亮，无需唤醒。");
}

// 启动钉钉应用
launchApp("钉钉");
console.log("启动钉钉...");

// 等待主界面加载完成
sleep(5000);

// 查找并点击第一个目标控件：打卡
console.log("查找目标打卡控件...");
var punchInButton = id("com.alibaba.android.rimet:id/im_ding_kit_item_txt")
    .text("打卡")

    .findOne(10000)


if (punchInButton) {
    console.log("找到目标打卡控件，尝试点击...");
    click(punchInButton.bounds().centerX(), punchInButton.bounds().centerY());
    console.log("点击打卡控件成功！");
    sleep(3000); // 等待页面加载
} else {
    console.log("未找到目标打卡控件！");
    exit();
}

// 查找并点击第二个目标控件：企业 
console.log("查找目标企业控件...");
var companyButton = id("com.alibaba.android.rimet:id/tv_org_name")
    .text("【你需要修改】")
    .findOne(10000);

if (companyButton) {
    console.log("找到目标企业控件，尝试点击...");
    click(companyButton.bounds().centerX(), companyButton.bounds().centerY());
    console.log("点击企业控件成功！")
   
} else {
    console.log("未找到目标企业控件！");
    exit();
}

sleep(10000); // 等待页面加载
// 点击指定控件
console.log("查找目标控件...");


// 点击的坐标
var x = 540;
var y = 1200;

// 点击事件
click(x, y);
sleep(10000);
console.log("点击目标控件！");
// 查找并点击关闭按钮
console.log("查找关闭按钮...");
var closeButton = id("com.alibaba.android.rimet:id/close_layout")
    .desc("关闭")
    .findOne(10000);

if (closeButton) {
    console.log("找到关闭按钮，尝试点击...");
    click(closeButton.bounds().centerX(), closeButton.bounds().centerY());
    console.log("关闭按钮点击成功！");
    sleep(2000);
} else {
    console.log("未找到关闭按钮！");
}

// 退出钉钉应用
console.log("退出钉钉...");
back();
sleep(2000);
console.log("钉钉已退出。");

// 完成后退出脚本
console.log("脚本运行结束！");
exit();
