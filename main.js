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
        //.boundsInside(710, 388, 800, 441) // 精确匹配坐标范围;
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
        .text("[你需要修改]")
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
    // 点击的坐标
    var x = 350;
    var y = 800;
    
    // 点击事件
    click(x, y);
    

    sleep(10000);

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

// 定义全局变量记录时间段的打卡状态
var punchInStatus = {};

// 初始化时间段打卡状态
function initPunchInStatus(timeRanges) {
    punchInStatus = {};
    for (var i = 0; i < timeRanges.length; i++) {
        var range = timeRanges[i];
        var key = `${range.startHour}:${range.startMinute}-${range.endHour}:${range.endMinute}`;
        punchInStatus[key] = false; // 初始状态为未打卡
    }
}

// 判断当前时间段是否已打卡
function isAlreadyPunchedIn(range) {
    var key = `${range.startHour}:${range.startMinute}-${range.endHour}:${range.endMinute}`;
    return punchInStatus[key] === true;
}

// 设置当前时间段为已打卡
function setPunchedIn(range) {
    var key = `${range.startHour}:${range.startMinute}-${range.endHour}:${range.endMinute}`;
    punchInStatus[key] = true;
}

// 定义随机打卡任务
function randomPunchInTask() {
    console.log('正在进入循环...');

    var timeRanges = [
        { startHour: 7, startMinute: 30, endHour: 8, endMinute: 30 },
        { startHour: 12, startMinute: 0, endHour: 12, endMinute: 20 },
        { startHour: 13, startMinute: 30, endHour: 14, endMinute: 30 },
        { startHour: 20, startMinute: 17, endHour: 20, endMinute: 17 },
    ];

    // 初始化打卡状态
    initPunchInStatus(timeRanges);

    var lastCheckedDate = new Date().toDateString(); // 记录上次检查的日期

    while (true) {
        var now = new Date();
        var currentDate = now.toDateString();

        // 检测是否进入新的一天
        if (currentDate !== lastCheckedDate) {
            console.log("检测到新的一天，正在重置打卡记录...");
            initPunchInStatus(timeRanges);
            lastCheckedDate = currentDate;
            console.log("新一天的打卡记录已重置！");
        }

        // 检查当前时间段
        var inTimeRange = false;
        for (var i = 0; i < timeRanges.length; i++) {
            var range = timeRanges[i];
            if (isInTimeRange(range.startHour, range.startMinute, range.endHour, range.endMinute)) {
                inTimeRange = true;
                if (!isAlreadyPunchedIn(range)) {
                    var randomTime = getRandomTimeInRange(range.startHour, range.startMinute, range.endHour, range.endMinute);
                    console.log(`随机选择的时间为：${randomTime}`);

                    var delay = randomTime.getTime() - now.getTime();
                    if (delay > 0) {
                        console.log(`将在 ${Math.round(delay / 1000)} 秒后执行打卡任务`);
                        sleep(delay);
                        punchIn();
                        setPunchedIn(range); // 设置为已打卡
                        break; // 打卡后跳出循环
                    } else {
                        console.log("生成的随机时间已过期，重新检查...");
                    }
                } else {
                    console.log(`当前时间段 ${range.startHour}:${range.startMinute}-${range.endHour}:${range.endMinute} 已打卡，跳过...`);
                    sleep(600000); // 跳过一个小时检查一次
                }
            }
        }

        if (!inTimeRange) {
            console.log("当前时间不在指定时间段内，等待中...");
            sleep(60000); // 每分钟检查一次
        }
    }
}

// 启动随机打卡任务
threads.start(randomPunchInTask);