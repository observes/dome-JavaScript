
			/* 样式获取 兼容 */
		function getStyle(obj , name)
		{
			if (obj.currentStyle) 
			{
				return obj.currentStyle[name];
			} else 
			{
				return getComputedStyle(obj,"")[name];
				
			}
		}
			/* 透明度的兼容 */
		function setOpacity(elem, value) {
			if (telem.filter) {
				elem.style.filter = 'alpha(opacity:' + value + ')' ;
			} else {
				elem.style.opacity = value / 100;
			} 
		}
		/*  event的兼容*/
		var eventUtil = {
			//添加句柄
			addHandler:function (obj,type,fn){
				if (obj.addEventListener) {
					obj.addEventListener(type,fn,false)
				} else if (obj.attachEvent) {
					obj.attachEvent("on"+type,fn);
				} else {
					obj["on"+type] = fn;							
				}
			},
			//删除句柄
			removeHandler:function (obj,type,fn){
				if (obj.removeEventListener) {
					obj.removeEventListener(type,fn,false)
				} else if (obj.detachEvent) {
					obj.detachEvent("on"+type,fn);
				} else {
					obj["on"+type] = null;							
				}
			} ,
			//获取事件
			getEvent:function (event){
				return event?event:window.event;  
			},
			// 目标
			getElemnet:function(event){
				return event.target || event.srcElement;
			}, 
			// 阻止默认行为
			preventDefault:function(event){
				if (event.preventDefault) {
					event.preventDefault()
				} else {
					event.returnValue =false;
				}
			} ,
			//阻止事件冒泡
			stopPropagation:function(event){
				if (event.stopPropagation) {
					event.stopPropagation();
				} else {
					event.cancelBubble =true;
				}
			}
		}
		/*根据Class的到元素数组*/
		function getByClass( obj,sClass){
			var aResult = [];
			var aEle = obj.getElementsByTagName('*');
			for (var i = 0; i < aEle.length; i++) {
				if(aEle[i].className == sClass){
					aResult.push(aEle[i]);
				}
			}
			return aResult;
		}
		/*运动框架  当attr为opacity时候输出的iTarget为1-100的整数*/
		function startMove(obj,attr,iTarget){ 
				clearInterval(obj.timer);
			
				obj.timer = setInterval(function(){
				if (attr == "opacity") {
					 var cur = Math.round(parseFloat(getStyle(obj,attr))*100);
				} 
				else {
					 var cur = parseInt(getStyle(obj,attr));
				}
				
				var speed = (iTarget-cur)/10;
				speed = speed>0?Math.ceil(speed):Math.floor(speed);
			
				if (cur == iTarget) {
					clearInterval(obj.timer)
				} 
				else {
					if (attr == "opacity") {
						obj.style.filter = "alpha(opacity: "+(cur+speed)+")";/*IE*/
						obj.style.opacity = (cur+speed)/100;
					} 
					else {
						obj.style[attr] = cur+speed+"px";
					}
					
				}
				},30)
		}
		
		
		
		function getStyleone(el){
			if(el.currentStyle){//（IE）
				return el.currentStyle;
			}else{
				return document.defaultView.getComputedStyle(el);//w3c
			}
		}
		//缓冲运动  
		/*
		 * 运动函数：“http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm”
		 * t 当前执行的毫秒值； 
		 * b 执行属性原始值（旧值）； 
		 * c 动画运行距离； 
		 * d 持续的时间；  
		 * 返回值：当前执行的毫秒时间点，应该到达什么位置；
		*/
		function easing_1(t, b, c, d) {
			t/=d;
			return b+c*(t);
		}
		function easing_2(t, b, c, d) {
			var ts=(t/=d)*t;
			var tc=ts*t;
			return b+c*(4*tc + -9*ts + 6*t);
		}
		function  easing_3(t, b, c, d) {
			var ts=(t/=d)*t;
			var tc=ts*t;
			return b+c*(7.0525*tc*ts + -20.42*ts*ts + 6.73499999999999*tc + 12.51*ts + -4.8775*t);
		}
		
		//运动框架
		function move(obj,attr,iTarget,ainmateTime,easingFn,callbackFn) {
			
			//清楚计时器
			clearInterval(obj.timer)
			
			//获取样式
			var style =getStyleone(obj);
			
			// 旧值
			var oldValue = parseInt(style[attr]) ;
			// 目标值和原来值的差值
			var distance = iTarget -parseInt(style[attr])
			
			//计时器的运行时间和次数
			var currentTime = 0;
			var n =  0;
			
			
			//开始计时器
			obj.timer = setInterval(function  () {
				
				currentTime += 30;
				n++;
				//console.log(n)
				
				var currentpositon = easingFn(currentTime,oldValue,distance,ainmateTime );
				//console.log(currentpositon)
				obj.style[attr] = currentpositon+"px";
				
				// 动画停止条件
				if(currentTime >= ainmateTime){
					clearInterval(obj.timer)
					obj.style[attr] = iTarget +"px";
					callbackFn();
				}
			},30)
		}