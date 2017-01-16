/* 样式获取 兼容 */
function getStyle(obj, name) {
	if (obj.currentStyle) {
		return obj.currentStyle[name];
	} else {
		return getComputedStyle(obj, "")[name];
		console.log(obj.currentStyle[name])
	}
}
/* 透明度的兼容 */
function setOpacity(elem, value) {
	if (telem.filter) {
		elem.style.filter = 'alpha(opacity:' + value + ')';
	} else {
		elem.style.opacity = value / 100;
	}
}
/*  event的兼容*/
var eventUtil = {
		//添加句柄
		addHandler: function(obj, type, fn) {
			if (obj.addEventListener) {
				obj.addEventListener(type, fn, false)
			} else if (obj.attachEvent) {
				obj.attachEvent("on" + type, fn);
			} else {
				obj["on" + type] = fn;
			}
		},
		//删除句柄
		removeHandler: function(obj, type, fn) {
			if (obj.removeEventListener) {
				obj.removeEventListener(type, fn, false)
			} else if (obj.detachEvent) {
				obj.detachEvent("on" + type, fn);
			} else {
				obj["on" + type] = null;
			}
		},
		//获取事件
		getEvent: function(event) {
			return event ? event : window.event;
		},
		// 目标
		getElemnet: function(event) {
			return event.target || event.srcElement;
		},
		// 阻止默认行为
		preventDefault: function(event) {
			if (event.preventDefault) {
				event.preventDefault()
			} else {
				event.returnValue = false;
			}
		},
		//阻止事件冒泡
		stopPropagation: function(event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		}
	}
	/*根据Class的到元素数组*/
function getByClass(obj, sClass) {
	var aResult = [];
	var aEle = obj.getElementsByTagName('*');
	for (var i = 0; i < aEle.length; i++) {
		if (aEle[i].className == sClass) {
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}
/*运动框架  当attr为opacity时候输出的iTarget为1-100的整数*/
function startMove(obj, attr, iTarget) {
	clearInterval(obj.timer);

	obj.timer = setInterval(function() {
		if (attr == "opacity") {
			var cur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
		} else {
			var cur = parseInt(getStyle(obj, attr));
		}

		var speed = (iTarget - cur) / 10;
		speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

		if (cur == iTarget) {
			clearInterval(obj.timer)
		} else {
			if (attr == "opacity") {
				obj.style.filter = "alpha(opacity: " + (cur + speed) + ")"; /*IE*/
				obj.style.opacity = (cur + speed) / 100;
			} else {
				obj.style[attr] = cur + speed + "px";
			}

		}
	}, 30)
}
//缓冲运动  
/*
 * t 当前执行的毫秒值； 
 * b 执行属性原始值（旧值）； 
 * c 动画运行距离； 
 * d 持续的时间；  
 * 返回值：当前执行的毫秒时间点，应该到达什么位置；
 */
function easing_1(t, b, c, d) {
	t /= d;
	return b + c * (t);
}

function easing_2(t, b, c, d) {
	var ts = (t /= d) * t;
	var tc = ts * t;
	return b + c * (4 * tc + -9 * ts + 6 * t);
}

//运动框架
function move(obj, attr, iTarget, ainmateTime, easingFn) {

	//清楚计时器
	clearInterval(obj.timer)

	//获取样式
	var style = getStyle(obj);

	// 旧值
	var oldValue = parseInt(style[attr]);
	// 目标值和原来值的差值
	var distance = iTarget - parseInt(style[attr])

	//计时器的运行时间和次数
	var currentTime = 0;
	var n = 0;


	//开始计时器
	obj.timer = setInterval(function() {

		currentTime += 30;
		n++;
		//console.log(n)

		var currentpositon = easingFn(currentTime, oldValue, distance, ainmateTime);
		console.log(currentpositon)
		obj.style[attr] = currentpositon + "px";

		// 动画停止条件
		if (currentTime >= ainmateTime) {
			clearInterval(obj.timer)
			obj.style[attr] = iTarget + "px";
		}
	}, 30)
}
// Dom Ready
function myReady(Fn) {
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", Fn, false)
	} else {
		IeContentLoaded(Fn)
	}

	//IE模拟DOMContentLoaded
	function IeContentLoaded(Fn) {
		var done = false;
		var d = window.document;
		//只执行一次回调函数
		var init = function() {
			if (!done) {
				done = true;
				Fn()
			}
		};

		// 判断  document
		(function() {
			try {
				d.documentElement.doScroll("left");
			} catch (e) {
				setTimeout(arguments.callee, 30);
				return;
			}

			init();
		})();


		// document 加载状态监听
		d.onreadystatechange = function() {
			if (d.readyState == "complete") {
				d.onreadystatechange = null;
				init();
			}
		}
	}
}

/*转驼峰函数法   如：border-left-color*/
/*非正则*/
function touppercasrStr(str) {
	var arrStr = str.split("-");
	for (var i = 1, len = arrStr.length; i < len; i++) {
		arrStr[i] = arrStr[i].charAt(0).toUpperCase() + arrStr[i].substring(1);
	}
	return arrStr.join("");
}
/*正则*/
function touppercasrStr1(str) {
	var re = /-([a-zA-Z])/g;
	return str.replace(re, function($0, $1) {
		return $1.toUpperCase();
	})
}
/*查找字符串最多   sjjjsjjjjsljjjjlssjjjjs*/
// 非正则方式
function findMIxStr(str) {
	var obj = {};
	//出现最多的个数和最多的是那个；
	var num = 0;
	var strVaule = "";
	var arrStr = str.split("");
	/*遍历数组 没有给对象创建属性，有推进对应属性数组*/
	for (var i = 0, len = arrStr.length; i < len; i++) {
		if (!obj[arrStr[i]]) {
			obj[arrStr[i]] = [];
		}
		obj[arrStr[i]].push(arrStr[i]);
	}
	/*遍历对象，找出对象中长度最大数组*/
	for (var attr in obj) {
		if (num < obj[attr].length) {
			num = obj[attr].length;
			strVaule = obj[attr][0];
		}
	}
	return "出现最多字母是" + strVaule + "出现次数为" + num;
}
// 正则方式
function findMIxStr2(str) {
	var strArr = str.split("");
	// 对数组排序 
	strArr.sort();
	var str = strArr.join("");
	// 匹配相同的字符 
	var re = /(\w)\1+/g;
	//出现最多的个数和最多的是那个；
	var num = 0;
	var strVaule = "";
	// replace 回调  $0为全局匹配的字符   $1正则的子串
	str.replace(re, function($0, $1) {
		if (num < $0.length) {
			num = $0.length;
			strVaule = $1;
		}
	})
	return "出现最多字母是" + strVaule + "出现次数为" + num;
}
/*千分符号  545555454*/
//  str 匹配的字符串   scroce  要求几位分割
function testnum(str, scroce) {
	var newArrar = [];
	var isNum = str.length % scroce;
	var count = 0;
	var temp = "";
	/*拿到开头前面没有除尽的字符，加入数组*/
	if (isNum) {
		newArrar.push(str.substring(0, isNum))
	}
	/*分割剩下的字符*/
	var newStr = str.substring(isNum);
	var newStrArr = newStr.split("");
	/* 根据所需位数，进行组合，添加到数组*/
	for (var i = 0; i < newStrArr.length; i++) {
		count++;
		temp += newStrArr[i];
		if (count === scroce) {
			newArrar.push(temp)
			count = 0;
			temp = "";
		}
	}
	return newArrar.join(",")
}
//快速排序（递归）
function quickSort(arr) {
	if (arr.length <= 1) {
		return arr
	}
	var num = Math.floor(arr.length / 2);
	var numValue = arr.splice(num, 1);
	var left = [];
	var right = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] < numValue) {
			left.push(arr[i]);
		} else {
			right.push(arr[i]);
		}
	}
	return quicksort(left).concat([numValue], quicksort(right));
}
/*选择排序*/
function choiceSort(myArray) {
	for (var i = 0; i < myArray.length - 1; i++) {
		/*每次拿循环跟后面的比较*/
		for (var j = i; j < myArray.length - 1; j++) {
			if (myArray[i] > myArray[j + 1]) {
				var tepm = myArray[i];
				myArray[i] = myArray[j + 1];
				myArray[j + 1] = tepm;
			}
		}
	}
	return myArray;
}
/*冒泡排序*/
function bubbleSort(myArray) {
	for (var k = 0; k < mgArray.length - 1; k++) {
		//每相邻的元素进行比较，最有一个元素都就满足条件了
		for (var i = 0; i < mgArray.length - 1 - (k); i++) {
			if (mgArray[i] > mgArray[i + 1]) {
				var tmpe = mgArray[i];
				mgArray[i] = mgArray[i + 1];
				mgArray[i + 1] = tmpe;
			}
		}
	}
	return myArray;
}