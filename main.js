// Auto.js 代码示例：钉钉随机时间段签到脚本
toast("脚本正常运行！");

// 检查是否有无障碍服务权限
auto.waitFor();

// 随机时间生成函数
function getRandomTimeInRange(startHour, startMinute, endHour, endMinute) {
    var start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    var end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    var randomTime = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomTime;
}

// 判断当前时间是否在指定时间段内
function isInTimeRange(startHour, startMinute, endHour, endMinute) {
    var now = new Date();
    var currentTime = now.getHours() * 60 + now.getMinutes();
    var startTime = startHour * 60 + startMinute;
    var endTime = endHour * 60 + endMinute;
    return currentTime >= startTime && currentTime <= endTime;
}
// 定义打卡任务
function punchIn() {
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
        .boundsInside(710, 388, 800, 441) // 精确匹配坐标范围;
        .findOne(10000);

    if (punchInButton) {
        console.log("找到目标打卡控件，尝试点击...");
        click(punchInButton.bounds().centerX(), punchInButton.bounds().centerY());
        console.log("点击打卡控件成功！");
        sleep(3000); // 等待页面加载
    } else {
        console.log("未找到目标打卡控件！");
        exit();
    }

    // 查找并点击第二个目标控件：企业 dsy
    console.log("查找目标企业控件...");
    var companyButton = id("com.alibaba.android.rimet:id/tv_org_name")
        .text("[你所要打卡的企业]")
        .findOne(10000);

    if (companyButton) {
        console.log("找到目标企业控件，尝试点击...");
        click(companyButton.bounds().centerX(), companyButton.bounds().centerY());
        console.log("点击企业控件成功！");
        sleep(10000); // 等待页面加载
    } else {
        console.log("未找到目标企业控件！");
        exit();
    }

    // 点击指定控件
    console.log("查找目标控件...");
    var targetControl = className("com.uc.aosp.android.webkit.m0")
        .clickable(true) // 确保控件是可点击的
        .findOne(10000);

    if (targetControl) {
        console.log("找到目标控件，尝试点击...");
        click(targetControl.bounds().centerX(), targetControl.bounds().centerY());
        console.log("目标控件点击成功！");
        sleep(2000);
    } else {
        console.log("未找到目标控件！");
    }

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
    console.log("打卡任务结束！");
}

// 定义随机打卡任务P
function randomPunchInTask() {
    var timeRanges = [
        { startHour: 7, startMinute: 30, endHour: 8, endMinute: 30 },
        { startHour: 12, startMinute: 0, endHour: 12, endMinute: 20 },
        { startHour: 13, startMinute: 30, endHour: 14, endMinute: 30 },
        { startHour: 18, startMinute: 0, endHour: 21, endMinute: 0 },
    ];

    while (true) {
        var now = new Date();

        // 检查当前时间段
        for (var i = 0; i < timeRanges.length; i++) {
            var range = timeRanges[i];
            if (isInTimeRange(range.startHour, range.startMinute, range.endHour, range.endMinute)) {
                var randomTime = getRandomTimeInRange(range.startHour, range.startMinute, range.endHour, range.endMinute);
                console.log(`随机选择的时间为：${randomTime}`);

                var delay = randomTime.getTime() - now.getTime();
                if (delay > 0) {
                    console.log(`将在 ${delay / 1000} 秒后执行打卡任务`);
                    sleep(delay);
                    punchIn();
                    break;
                }
            }
        }

        console.log("当前时间不在指定时间段内，等待中...");
        sleep(60000); // 每分钟检查一次
    }
}

// 启动随机打卡任务
threads.start(randomPunchInTask);
