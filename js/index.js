/**
 *
 * 关于AUDIO的一些常用属性
 *  [属性]
 *  duration：播放的总时间(S)
 *  currentTIme：当前已经播放的时间(S)
 *  ended：是否已经播放完成
 *  paused:当前是否为暂停状态
 *  volume:控制音量(0-1)
 *
 *  [方法]
 *  pause()暂停
 *  play()播放
 *
 *
 *
 *
 *  [事件]
 *  canplay:可以正常播放(但是播放过程中可能出现卡顿)
 *  canplaythrough:资源加载完播放
 *  ended:已经播放完成
 *  loadedmetadata:资源的基础信息加载完成
 *  loadeddata:整个资源都加载完成
 *  pause:触发了暂停
 *  play:触发了播放
 *  playing:资源播放中
 *
 *
 *
 *
 *
 *
 *
 *
 */

/*LOAFING*/
let loadingRender = (function () {
    let $loadingBox = $('.loadingBox'),
        $current = $loadingBox.find('.current');

    let imgData = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];

    let n = 0,
        len = imgData.length;
    //=>RUN预加载图片
    let run = function (callback) {
        imgData.forEach(item => {
            let tempImg = new Image();
            tempImg.onload = () => {
                tempImg = null;
                $current.css('width', (++n) / len * 100 + '%');
                //=>加载完成:执行回调函数(让当前LOADING页面消失)
                if (n === len) {
                    clearTimeout(delayTimer);
                    callback && callback();
                }
            };
            tempImg.src = item;
        });
    }

    //=>MAX-DELAY:设置最长等待时间(假设10s，到达10s我们看加载多少了，如果已经达到了90%以上，我们可以正常访问内容，如果不足这个比例，直接提示用户当前网络状况不佳，稍后重试)
    let delayTimer = null;
    let maxDelay = function (callback) {
        delayTimer = setTimeout(() => {
            if (n / len > 0.9) {
                $current.css('width', '100%');
                callback && callback();
                return;
            }
            alert('非常遗憾，当前您的网络状况不佳，请稍后再试!');
            window.location.href = 'http://www.qq.com';//=>此时我没不应该继续加载页面，而是让其关掉页面或者跳转的其他页面
        }, 1000 * 1200);
    };

    //=>DONE:完成
    let done = function () {
        //=>停留一秒钟在移除进入下一个环节
        let timer = setTimeout(() => {
            $loadingBox.remove();
            clearTimeout(timer);

            phoneRender.init();
        }, 1000);

    };
    return {
        init: function () {
            $loadingBox.css('display', 'block')
            run(done);
            maxDelay(done);
        }
    }
})();

/*PHONE*/
let phoneRender = (function () {
    let $phoneBox = $('.phoneBox'),
        $time = $phoneBox.find('span'),
        $answer = $phoneBox.find('.answer'),
        $answerMarkLink = $answer.find('.markLink'),
        $hang = $phoneBox.find('.hang'),
        $hanMarkLink = $hang.find('.markLink'),
        answerBell = $('#answerBell')[0],
        introduction = $('#introduction')[0];

    //=>点击ANSWER-MARK
    let answerMarkTouch = function () {
        //1.REMOVE-ANSWER
        $answer.remove();
        answerBell.pause();
        $(answerBell).remove();//=>一定要暂停播然后再溢出，否则即使移除了浏览器还会播放着这个声音
        answerBell = null;

        //2.SHOW HANG
        $hang.css('transform', 'translateY(0rem)');
        $time.css('display', 'block');
        introduction.play();
        computedTime();
    }

    //=>计算播放时间
    let autoTimer = null;
    let computedTime = function () {
        let duration = 0;
        //=>我们让AUDIO播放，首先会去加载资源，部分资源加载完成后才会播放，才会计算出总时间DURATION等信息，所以我妈可以把获取信息放在CAN-PLAY事件中
        introduction.oncanplay = function () {
            duration = introduction.duration;
        }
        autoTimer = setInterval(function () {
            let val = introduction.currentTime;

            //=>播放完成
            if (val >= duration) {
                clearInterval(autoTimer);
                closePhone();
            }

            let minute = Math.floor(val / 60),
                second = Math.floor(val - (minute * 60));
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            $time.html(`${minute}:${second}`);
        }, 1000);

    }

    //=>关闭PHONE
    let closePhone = function () {
        clearInterval(autoTimer);
        introduction.pause();
        $(introduction).remove();
        $phoneBox.remove();

        messageRender.init();
    }

    return {
        init: function () {
            $phoneBox.css('display', 'block');

            //=>播放BELL
            $(document.body).tap(function () {
                answerBell.volume = 0.2;
                answerBell.play();
            });

            //=>点击ANSWER-MARK
            $answerMarkLink.tap(answerMarkTouch);
            $hanMarkLink.tap(closePhone);
        }
    }
})();

/*MESSAGE*/
let messageRender = (function () {
    let $messageBox = $('.messageBox'),
        $wrapper = $messageBox.find('.wrapper'),
        $messageList = $wrapper.find('li'),
        $keyBoard = $messageBox.find('.keyBoard'),
        $textInp = $keyBoard.find('span'),
        $submit = $keyBoard.find('.submit'),
        demonMusic = $('#demonMusic')[0];

    let step = -1,//=>记录当前展示信息的所以
        total = $messageList.length + 1,//=>记录的信息的总条数(自己发一条所以加1)
        autoTimer = null,
        interval = 1500;//=>记录信息出现的间隔时间

    //=>展示信息
    let tt = 0;
    let showMessage = function () {
        ++step;
        if (step === 2) {
            //=>说明已经展示两条了,此时我们暂时先结束发送消息，让键盘出来，开始执行手动发送
            clearInterval(autoTimer);
            handleSend();
            return;
        }
        let $cur = $messageList.eq(step);
        $cur.addClass('active');
        if (step >= 3) {
            //=>说明展示的条数已经是4条或者4条以上了，此时我妈让wrapper向上移动(移动的距离就是新展示这条的高度)
            /*let curH = $cur.get(0).offsetHeight,
                wraT = parseFloat($wrapper.css('top'));
            $wrapper.css('top', wraT - curH);*/

            //=>js中基于CSS获取TRANSFORM，得到的是一个矩阵
            let curH = $cur.get(0).offsetHeight;
            tt -= curH;
            $wrapper.css('transform', `translateY(${tt}px)`)

        }
        //=>展示完成
        if (step >= total - 1) {
            clearInterval(autoTimer);
            closeMessage();
        }
    };

    //=>手动发送
    let handleSend = function () {
        $keyBoard.css('transform', 'translateY(0rem)')
            .one('transitionend', () => {
                //=>TRANSITION-END:监听当前元素TRANSITION动画结束的事件(有几个样式属性改变，并且执行了过度效果，事件就会呗触发执行几次=>用noe方法做事件绑定，指挥让其触发一次)
                let str = '好的，马上介绍！',
                    n = -1,
                    textTimer = null;
                textTimer = setInterval(() => {
                    let orginHTML = $textInp.html();
                    $textInp.html(orginHTML + str[++n]);
                    if (n >= str.length - 1) {
                        clearInterval(textTimer);
                        $submit.css('display', 'block');
                    }
                }, 100);
            });
    };

    //=>点击SUBMIT做的事情
    let handleSubmit = function () {
        //=>把新创建的LI增加到页面中的第二个LI的后面
        $(`<li class="self">
                    <i class="arrow"></i>
                    <img src="img/zf_messageStudent.png" alt="" class="pic">
                    ${$textInp.html()}
                </li>`).insertAfter($messageList.eq(1)).addClass('active');
        $messageList = $wrapper.find('li');//=>重要:把新的LI放到页面中，我妈此时应该重新获取LI，让MESSAGE-LIST和页面中的LI对应，方便控制索引
        demonMusic.play();
        demonMusic.volume = 0.3;

        //=>该消失的消失
        $textInp.html('');
        $submit.css('display', 'none');
        $keyBoard.css('transform', 'translateY(3.7rem)');

        //=>继续向下展示剩余的消息
        autoTimer = setInterval(showMessage, interval);
    };

    //=>移除操作
    let closeMessage = function () {
        let delayTimer = setTimeout(() => {
            demonMusic.pause();
            $(demonMusic).remove();
            $messageBox.remove();

            clearTimeout(delayTimer);
        }, interval);

        cubeRender.init();

    }


    return {
        init: function () {
            $messageBox.css('display', 'block');
            //=>加载模块立即展示一条消息，后期间隔INTERVAL在发送一条消息
            showMessage();
            autoTimer = setInterval(showMessage, interval)

            $submit.tap(handleSubmit);
        }
    }
})();
//=>开发过程中，由于当前项目板块众多(每一个板块都是一个单例)，我妈最好规划一种机制:通过标识判断可以让程序只执行对应板块内容，这样开发哪个板块，就标识改成谁（HASH路由控制）

/*CUBE*/
let cubeRender = (function () {
    let $cubeBox = $('.cubeBox'),
        $cube = $('.cube'),
        $cubeList = $cube.find('li');

    //=>手指控制旋转
    let start = function (ev) {
        //=>记录手指按在位置的起始坐标
        let point = ev.changedTouches[0];
        this.startX = point.clientX;
        this.startY = point.clientY;
        this.changeX = 0;
        this.changeY = 0;
    };

    let move = function (ev) {
        //=>用最新手指的位置-起始的位置，记录X/Y的偏移
        let point = ev.changedTouches[0];
        this.changeX = point.clientX - this.startX;
        this.changeY = point.clientY - this.startY;
    };

    let end = function (ev) {
        //=>获取CHANGE/ROTATE值
        let {changeX, changeY, rotateX, rotateY} = this,
            isMove = false;
        // =>验证是否发生移动
        Math.abs(changeX) > 10 || Math.abs(changeY) > 10 ? isMove = true : null;

        //=>只有发生移动才做处理
        if (isMove) {
            //=>1.左右滑动=>CHANGE-X=>ROTATE-Y(正比:CHANGE越大ROTATE越大)
            //=>2.上下滑动=>CHANGE-Y=>ROTATE-X(反比:CHANGE越大ROTATE越小)
            //=>3.为了让移动角度小一点，我们可以把移动距离/3
            rotateX = rotateX - changeY;
            rotateY = rotateY + changeX;
            //=>赋值给魔方盒子
            $(this).css('transform', `scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
            //=>让当前旋转角度成为下一次起始角度
            this.rotateX = rotateX;
            this.rotateY = rotateY;
        }
        //=>清空其他记录的自定义属性值
        ['startX', 'startY', 'changeY', 'changeX'].forEach(item => this[item] = null);
    };
    return {
        init: function () {
            $cubeBox.css('display', 'block');

            //=>手指操作CUBE，让CUBE跟着旋转
            let cube = $cube[0];
            cube.rotateX = -35;
            cube.rotateY = 35;//=>记录初始的旋转角度(存储到自定义属性上)
            $cube.on('touchstart', start)
                .on('touchmove', move)
                .on('touchend', end);

            //=>点击每一个面跳转到详情区域对应的页面
            $cubeList.tap(function () {
                $cubeBox.css('display', 'none');
                //=>转转到详情区域，通过传递点击LI的索引，让其定位到具体的SLIDE
                let index = $(this).index();
                detailRender.init(index);
            });
        }
    }
})();

/*DETAIL*/
let detailRender = (function () {
    let $detail = $('.detailBox'),
        swiper = null,
        $dl = $('.page1>dl');

    let swiperInit = function () {
        swiper = new Swiper('.swiper-container', {
            // initialSlide:1 //=>初始SLIDE所有
            // direction:'horizontal/vertical' //=>控制滑动方向
            effect: 'coverflow',
            // loop:true //=>SWIPER有一个BUG:3D切换设置LOOP设置为TRUE的时候偶尔会出现无法切换的情况(但是2D没问题)   无缝切换的原理：把真实第一张克隆一份到末尾，把正式最后一张也克隆一张放到开始(真实SLIDE有五个，WRAPPER中会有7个SLIDE)
            onInit: move,// =>SWIPER初始化完成(参数时当前初始化的实例),
            onTransitionEnd: move//=>动画切换完成执行的回调函数
        });

        //=>实例的私有属性
        // 1.activeIndex:当前战死SLIDE块的索引
        // 2.slides:获取所有的SLIDE(数组)
        // ...
        // 实例的共有方法
        // 1.slideTo:切换到指定索引的SLIDE
        // ...
    };

    let move = function (swiper) {
        //=>SWIPER:当前创建的实例
        //1.判断当前是否为第一个SLID：如果时让3D菜单展开，不是收起3D菜单
        let activeIndex = swiper.activeIndex,
            slideAry = swiper.slides;
        if (activeIndex === 0) {
            //=>实现折叠效果
            $dl.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $dl.makisu('open');
        } else {
            //=>OTHER PAGE
            $dl.makisu({
                selector: 'dd',
                speed: 0
            });
            $dl.makisu('close');
        }

        //2.滑动到哪一个页面，把当前页面设置对应的ID，其余页面移除ID即可
        slideAry.forEach((item, index) => {
            if (activeIndex === index) {
                item.id = `page${index + 1}`;
                return;
            }
            item.id = null;
        });
    };

    return {
        init: function (index = 0) {
            $detail.css("display", 'block');
            if (!swiper) {
                //=>防止重复初始化
                swiperInit();
            }
            swiper.slideTo(index,0);//=>直接运动到具体的SLIDE页面即可(第二个参数时切换速度;0立即切换没有动画效果)
        }
    }
})()

let hash = window.location.hash.substr(1);/*,//=>获取当前页面的URL地址location.href='XXX'这种写法是让其跳转到某一个页面
    well = url.indexOf('#');
hash = well === -1 ? null : url.substr(well + 1);*/

switch (hash) {
    case 'loading':
        loadingRender.init();
        break;
    case 'phone':
        phoneRender.init();
        break;
    case'message':
        messageRender.init();
        break;
    case'cube':
        cubeRender.init();
        break;
    case'detail':
        detailRender.init();
        break;
    default:
        loadingRender.init();

}