/**
 * @Name : tool liberary
 * @Author : l.w.kampfer@gmail.com || liaowei@58.com
 * @LastModified : 20110716
 */

(function() {
	var kampfer = {};
	kampfer.extend = function() {
		var src, target, name, len, i, deep, copyFrom, copyTo, clone;
		i = 1;
		len = arguments.length;
		deep = false;
		target = arguments[0];
		//如果第一个参数为布尔型
		if( typeof target === 'boolean' ) {
			deep = target;
			i = 2;
			target = arguments[1];
		}	
		for( ; i < len; i++ ) {
			src = arguments[i];
			if( src != null ) { 
				for( name in src ) {
					copyFrom = src[name];
					copyTo = target[name];
					//如果目标对象已经拥有和当前待拷贝的对象属性 值 相同的属性
					if( copyTo === copyFrom ) {
						continue;
					}
					//如果deep为true，并且当前待拷贝的对象属性是数组或者对象
					if( deep && copyFrom && ( kampfer.isArray(copyFrom) || kampfer.isObject(copyFrom) ) ) {
						if( kampfer.isArray(copyFrom) ) {
							clone = copyTo && kampfer.isArray(copyTo) ? copyTo : [];
						} else if( kampfer.isObject(copyFrom) ) {
							clone =	copyTo && kampfer.isObject(copyTo) ? copyTo : {};
						}
						target[name] = arguments.callee(deep,clone,copyFrom);
					//如果当前的拷贝模式为浅拷贝（deep=false），或者当前待拷贝的对象属性是基本数据类型，并且已赋值
					} else if( copyFrom != undefined ){
						target[name] = copyFrom;
					}
				}
			}
		}
		return target;
	}
	kampfer.extend( kampfer, {
		isObject : function( obj ) {
			return Object.prototype.toString.call(obj)==='[object Object]' && 'isPrototypeOf' in obj;
		},
		isArray : function( obj ) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		},
		isWindow : function( obj ) {
			return obj && typeof obj === "object" && "setInterval" in obj;
		}	
	});
/******************************************* event ******************************************/
	var eventIndex = 1;
	//当传递匿名函数为handler时，removeEvent无法正常工作，W3C的addEventListener也有类似问题
	kampfer.extend( kampfer, {
		addEvent : function( element, type, handler ) {
			if( !element._events ) element._events = {};
			var handlers = element._events[type];
			if( !handlers ) {
				//离散数组  （Dean Edwards 使用的是对象）
				handlers = element._events[type] = [];
				//handlers不存在，意味着没有使用修正后的函数绑定函数
				//此时要检查是否已经使用传统模式定义了监听函数，如果有就保存
				if( element['on'+type] ) {
					handlers[0] = element['on'+type];
				}
			}
			//为监听函数附加唯一的标识，方便在以后查找删除监听函数
			handler._id = eventIndex++;
			handlers[handler._id] = handler;
			element['on'+type] = function(event) {
				event = event || window.event;
				//重新定义handlers并读取已经附加在对象上的事件属性_evnet 
				//而不直接使用外部函数的参数handlers，避免不必要的闭包的形成，提高性能
				var handlers = this._events[event.type];
				for(var i = 0, len = handlers.length; i < len; i++) {
					if( handlers[i] ) handlers[i].call(this,event);
				}
			}
		},
		removeEvent : function( element, type, handler ) {
			if( element._events && element._events[type] ) {
				delete element._events[type][handler._id];
			}
		}
	});
/***************************************** dimension ****************************************/	
	kampfer.extend( kampfer, {
		getScrollTop : function( obj ) {
			if( kampfer.isWindow( obj) ) {
				return document.documentElement.scrollTop || document.body.scrollTop;
			}
			return obj.scrollTop;
		},
		getScrollLeft : function( obj ) {
			if( kampfer.isWindow( obj) ) {
				return document.documentElement.scrollLeft || document.body.scrollLeft;
			}
			return obj.scrollLeft;
		},
		getHeight : function ( obj ) {
			var value,cssShow,swap;
			if( kampfer.isWindow(obj) ) {
				return document.documentElement.clientHeight;
			}
			if( obj.nodeType === 9 ) {
				return document.documentElement.scrollHeight;
			}
			if( obj.offsetHeight != 0 ) {
				return obj.offsetHeight;
			} else {
				swap = function (element, options, callback) {
					var old = {};
					for( var name in options ) {
						old[name] = element.style[name];
						element.style[name] = options[name];
					}
					callback.call(element);
					for( name in old ) {
						element.style[name] = old[name];
					}	
				};
				cssShow = {
					position : "absolute", 
					visibility : "hidden", 
			 		display : "block" 
				};
				swap(obj,cssShow,function() {
					value = obj.offsetHeight;	
				});
				return value;	
			}
		},
		getWidth : function( obj ) {
			if( kampfer.isWindow(obj) ) {
				return document.documentElement.clientWidth;
			}
			if( obj.nodeType === 9 ) {
				return document.documentElement.scrollWidth;
			}
			if( obj.offsetWidth != 0 ) {
				return obj.offsetWidth;
			} else {
				swap = function (element, options, callback) {
					var old = {};
					for( var name in options ) {
						old[name] = element.style[name];
						element.style[name] = options[name];
					}
					callback.call(element);
					for( name in old ) {
						element.style[name] = old[name];
					}	
				};
				cssShow = {
					position : "absolute", 
					visibility : "hidden", 
			 		display : "block" 
				};
				swap(obj,cssShow,function() {
					value = obj.offsetWidth;	
				});
				return value;	
			}
		}
	});
	if( window.kampfer && window.k ) {
		alert('命名空间冲突！');
		return false;
	}
	window.kampfer = window.k = kampfer;
})();
