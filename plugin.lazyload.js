/**
 * @Name : plugin.lazyload for Iamge
 * @Author : l.w.kampfer@gmail.com || liaowei@58.com
 * @LastModified : 20110718
 * @version : 1.0
 */

(function lazyload() {
	var d = window.document,
		targets = [], 
		init = function() {
			var imgs = d.images,
				targets = []
			for( var i = 0, l = imgs.length; i < l; i++ ) {
				if( imgs[i].getAttribute('lazyload') ) {
					targets.push( imgs[i] );
				}
			}
			return targets;
		},
		getWinRec = function() {
			var l, t, w, h;
			l = k.getScrollLeft( window );
			t = k.getScrollTop( window );
			w = k.getWidth( window );
			h = k.getHeight( window );
			return {
				left : l,
				top : t,
				width : w,
				height : h
			};
		},
		getClientRec = function( obj ) {
			var l = 0, t = 0, w, h;
			w = getWidth( obj );
			h = getHeight( obj );
			while( obj.offsetParent ) {
				l += obj.offsetLeft;
				t += obj.offsetTop;
				obj = obj.offsetParent;
			};
			return {
				left : l,
				top : t,
				width : w,
				height : h
			};
		},
		intersected = function( rec1, rec2 ) {
			var lc1,lc2,tc1,tc2,w1,h1;
	  　　　　 lc1 = rec1.left + rec1.width / 2;
	 　　　　  lc2 = rec2.left + rec2.width / 2;
	   　　　　tc1 = rec1.top + rec1.height / 2 ;
	  　　　　 tc2 = rec2.top + rec2.height / 2 ;
	  　　　　 w1 = (rec1.width + rec2.width) / 2 ;
	　　　　   h1 = (rec1.height + rec2.height) / 2;
	  　　　　 return Math.abs(lc1 - lc2) < w1 && Math.abs(tc1 - tc2) < h1 ;
		},
		show = function( obj ) {
			var src = obj.getAttribute('lazyload');
			obj.removeAttribute('lazyload');
			var newImage = new Image();
			newImage.owner = obj;
			newImage.onload = function() {
				this.owner.src = this.src;
				this.onload = null;
			};
			newImage.src = src;
		},
		// 思考：将检测目标由数组改成对象，性能会得到提升吗，明显吗，值得吗？
		check = function( targets ) {
			var win = getWinRec();
			for( var i = 0, l = targets.length; i < l; i++ ) {
				if( targets[i] ) {
					var client = getClientRec( targets[i] );
					if( intersected( win, client ) ) {
						show( targets[i] );
						delete targets[i];
					} else {
						break;
					}	
				}
			}
		};
	targets = init();
	check( targets );
	k.addEvent( window, 'scroll', function(){
		check( targets );
	});
	k.addEvent( window, 'resize', function(){
		check( targets );
	});
})();	
