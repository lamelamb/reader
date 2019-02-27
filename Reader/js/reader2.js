/*   阅读器部分js 代码
 *   优化代码： 事件冒泡代替重复绑定
 *    className 添加的优化
 */
 $(function(){
			     //  全局变量
			      var Chapter_id =1;
			      var Chapters ='';
			      var ScreenWidth = window.screen.width ;
			      var ScreenHeight = window.screen.height ;
			  // 工具类 和 函数
			   var Doms = (function(){
				        var oBox = document.querySelectorAll('.box')[0];
				        var oHeader = document.querySelector('#header');
				        var oClickMask = document.querySelector('#clickMask');
				        var oContent = document.querySelector('#content');
				        var oControles = document.querySelector('#controles');
				        var oActionName = document.querySelectorAll('.actionName')[0];
				        var oAction = document.querySelectorAll('.action')[0];
				        var ofBox = document.querySelectorAll('.fBox')[0];
				        var oCategory = document.querySelectorAll('.category')[0];
				        var oFont = document.querySelectorAll('.font')[0];
				        var oNightOrday = document.querySelectorAll('.nightOrday')[0];
				        var oPage = document.getElementById('page');
				        var oNextPage  = document.getElementById('nextPage');
				        var oPrevPage  = document.getElementById('prevPage');
				        var oWords = document.getElementById('words');
				        var oChapters = document.getElementById('chapters');
				        var oChapterBox = document.getElementById('oChapterBox');
				        var oMaskOfchapterBox = document.getElementById('maskOfchapterBox');
				        var oupNdown = document.getElementById('upNdown');
				       
                      return {
				            	'oHeader':oHeader ,
				            	'oBox':oBox ,
				            	'oClickMask':oClickMask ,
				            	'oContent':oContent ,
				            	'oControles':oControles ,
				            	'oActionName':oActionName,
				            	'oAction':oAction ,
				            	'oCategory':oCategory ,
				            	'oFont':oFont ,
				            	'oNightOrday':oNightOrday ,
				            	'ofBox':ofBox ,
				            	'oPage':oPage ,
				            	'oNextPage':oNextPage,
				            	'oPrevPage':oPrevPage,
				            	'oWords':oWords,
				            	'oChapters':oChapters,
				            	'oChapterBox':oChapterBox,
				            	'oMaskOfchapterBox':oMaskOfchapterBox,
				            	'oupNdown':oupNdown,

				            };
			                  })();
			      
			      
			   var utils =(function(){
			   	
			   	 //数据解密
						function getBSONP(url, callback) {
							       console.log(  url.substr(7))
									return $.jsonp({
										url : 'http://'+ url.substr(7),
										cache : true,
										callback : "duokan_fiction_chapter",  
										success : function(result) {
											
											var data = $.base64.decode(result);
											var json = decodeURIComponent(escape(data));
											
											callback(json);
										}
									});
                            
										
                             
						      }
				            
				        function myLocalstorage(key , value){
				        	 var prefix = 'h5_reader_';
				        	 if(arguments.length==1){
				        	 	return localStorage.getItem(prefix+key);
				        	 }else{
				        	 	localStorage.setItem(prefix+key,value);
				        	 }
				        }
			   	
			   	
			   	         return {
			   	         	'getBSONP':getBSONP,
				            'myLocalstorage':myLocalstorage,
			   	         }
			   	
			   })();
			    
				// 更改 dom 显示，隐藏
			  function clickToggle(obj){
				     	 if(getComputedStyle(obj,null)['display']=='none'){ 
			                 obj.style.display ='block';
			             }else{
			       	         obj.style.display ='none';
			             }
				     }
			 
			  // 当前激活的点击按钮
			  function clickActive(obj,activeName){
			  	       // 我做了复杂了，系统有自己提供的添加和移出class 的方法
			          	var parent = obj.parentNode ;
			            for(var i =0 ; i<  parent.children.length ;i++){		            	 
				          	  var oldClass =  parent.children[i].className  ;			          	 
				          	   if(oldClass.indexOf(activeName)!=-1){
				          	   	  var arr = oldClass.split(' ');
				          	   	  var arr2 =[];
					          	   	   for(var j=0;j<arr.length ;j++){
					          	   	   	    if(arr[j] == activeName){
					          	   	   	    	continue ;
					          	   	   	    }
					          	   	   	   arr2[j] = arr[j];   
					          	   	   }
					          	   oldClass = arr2.join(' '); 
					          	 parent.children[i].className= oldClass ; 
				          	   }			          	   
			           }
			            
			            obj.className +=' '+ activeName;
         
			          }
		
		
			   //章节页面的显示和隐藏，动画效果，移入移出
			   function ChaptersToggle(){
	                            if(Doms.oChapters.style.transform == 'translateX(-100%)'|| Doms.oChapters.style.transform == ''){
	                         	
			            		Doms.oChapters.style.transform = 'translateX(0%)';
			            		Doms.oChapters.style.height  ='auto';
			            		
			            	   }else{
			            	   	console.log('位移2'+Doms.oChapters.style.transform);
			            		Doms.oChapters.style.transform = 'translateX(-100%)';
			            	 	Doms.oChapters.style.height =ScreenHeight + 'px';
			            	 }		
                          }
			   
			    // 初始化函数
		      function init(){
		      	 //  保存用户设置后的背景颜色和文字大小
			 	 if(utils.myLocalstorage('contentBgColor')){
			 	 	 Doms.oContent.style.backgroundColor = utils.myLocalstorage('contentBgColor');
			 	 	 var oBgColor = Doms.ofBox.children[1];
			 	          // 在当前背景颜色的span上加上阴影
			 	 	 for(var i =0 ; i<oBgColor.children.length ;i++ ){
			 	 	 	  if(oBgColor.children[i].style.backgroundColor!= Doms.oContent.style.backgroundColor)
			 	 	 	     continue ;
			 	 	 	     clickActive(oBgColor.children[i],'bgColorActive');
			 	 	 }
			 	 
			 	 }
			 	 if(utils.myLocalstorage('contentfontsize')){
			 	 	 Doms.oContent.style.fontSize = utils.myLocalstorage('contentfontsize');
			 	 }
			 	 
			 	  // 保存用户看到的章节 ,默认从第一章开始
			 	  if(utils.myLocalstorage('Chapter_id')){			    
			    
			     	  Chapter_id =  parseInt( utils.myLocalstorage('Chapter_id'),10)  ;
			      }
		      }
			 // 入口函数,main 
			 var main= (
			 	   function (){
			 	   	        // 初始化
			 	            init();
			 	            dataNview();
			 	          
			             })();
			 // 数据交互
			  function ReaderModel1(){
			  	       
			  	       var init = function(UIcallback){
			  	       	         getChapters(function(){
			  	       	         	getChapterContent(Chapter_id,  function(data){
			  	       	         		UIcallback && UIcallback(data);
			  	       	         	});
			  	       	         });
			  	       }
			 	       var getChapters = function(callback){
			 	       	   $.get('data/chapter.json',function(data){
			 	       	   	       
			 	       	   	        // 第一次的时候讲章节内容存在全局变量里面并且渲染章节页
			 	       	   	        if(Chapters==''){
			 	       	   	        	  Chapters = data;
			 	       	   	        	  RenderBaseChapters(Doms.oChapters);
			 	       	   	        }
			 	       	   	       // 更新全局的 Chapter_id
			 	       	   	        Chapter_id = data.chapters[ Chapter_id ].chapter_id ;
			 	       	   	     
			 	       	   	        callback && callback();
			 	       	   	       
			 	       	   	        
			 	       	   },'json');
			 	       }
			 	  
			 	       var getChapterContent = function(chapter_id,callback){
			 	       	   $.get('data/data'+ chapter_id +'.json',function(data){
			 	       	   	     // 如果服务器状态为0 
			 	       	   	     if (data.result == 0) {
										// var url = data.jsonp; // 拿到真正的网址
										var content = data.content;
										var data2 = $.base64.decode(content);
										var json = decodeURIComponent(escape(data2));
										console.log(json)
										callback(json)
// 										utils.getBSONP(url, function(data) {
// 											// 通过这种包一层的函数方式将真正的json 转码后的数据传给UI渲染层
// 											callback && callback(data);
// 									     
// 								          });
			 	       	   	      }
			 	       	   	     
			 	       	   },'json');
			 	       }
			 	       	   
			 	       	 return {
			 	       	 	 init:init ,
			 	       	 };
			    }
			 
			   
			   function dataNview(){
			   	 var ReaderModel = ReaderModel1();                 // 拿到暴露内部的init 接口
			     var ReaderUI = RenderBaseFrame(Doms.oWords);     // 拿到处理数据的函数
			 	    
					ReaderModel.init(function(data){               // 在取回的数据中使用UI渲染函数
			 	                	ReaderUI(data);
			 	                }) ;
			 	             // 将整个网页滚动到顶部
		             	 window.scrollTo(0, 0);
			   }
			   
			 // 业务逻辑,事件绑定
			  var eventBind =(
			  	    function(){
			  		  
			  		  // 点击唤出上下控制层
			  		  Doms.oClickMask.addEventListener('click',function(){			    	 			    	
			    	       clickToggle(Doms.oHeader);
			    	       clickToggle(Doms.oControles);
			       },false);
			  
			       
			  	    
			  	      
			  	      // 滚动的时候隐藏控制台和头部
			  	     window.addEventListener('scroll',function(){
			  	     	     
			  	     	 	Doms.oHeader.style.display ='none';
			  	     	    Doms.oControles.style.display ='none';
                                                     
			  	     },false);
		         
		         
		             //  上下 章节翻页
		             Doms.oPrevPage.addEventListener('click',function(){
		             	    if(Chapter_id>1){
		             	    	Chapter_id -- ;
		             	    	  // 存储当前页
		             	    	utils.myLocalstorage('Chapter_id',Chapter_id);
		             	    }
		             	   dataNview();
		             	        
		             },false);
		             Doms.oNextPage.addEventListener('click',function(){
		             	    if(Chapter_id < 4){
		             	    	Chapter_id ++  ;
		             	    	utils.myLocalstorage('Chapter_id',Chapter_id);
		             	    }
		             	    
		             	  dataNview();
		             	
		             },false);
		             
		            
		             
		             //章节页面的遮罩层点击事件
		             Doms.oMaskOfchapterBox.addEventListener('click',function(){
			       	                
			       	                ChaptersToggle();
			       	        	
			       	        	      //  头尾控制器消失
                                clickToggle(Doms.oHeader);
			    	            clickToggle(Doms.oControles);
			       	        },false);
			  	    
			  	  // 快速到顶部或者底部
			  	   Doms.oupNdown.addEventListener('click',function(){
			  	   	     
			  	   	      if(this.className=='down'){
			  	   	      	this.className='up';
			  	   	      	window.scrollTo(0, (Doms.oContent.clientHeight+Doms.oPage.clientHeight) - ScreenHeight);		  	   	      	
			  	   	      }else{
			  	   	      	this.className='down' ;
			  	   	      	window.scrollTo(0, 0);
			  	   	      }
			  	   },false);
			  	   
			  	   
			  	   
			  	   
			  	   //底边控制器部分，用了事件代理
			  	   Doms.oActionName.addEventListener('click',function(ev){
			  	   	    var ev = ev || window.event ,
			  	   	        eTarget = ev.target || sv.srcElement ,
			  	   	        eTargetClassName =eTarget.parentNode.className ,
			  	   	        eTargetBox = eTarget.parentNode ;
			  	   	   
			  	   	   
			  	   	     // 字号和背景颜色调节
			  	   	     if(eTargetClassName.indexOf('font')!=-1){
			  	   	      	   clickToggle(Doms.ofBox);						         					        					          				          			          					   
			  	   	      }
			  	   	     
			  	   	     //目录按钮
			  	   	     if(eTargetClassName.indexOf('category')!=-1){
                              ChaptersToggle();
			  	   	     }
			  	   	     
			  	   	     // 夜间模式
			  	   	     if(eTargetClassName.indexOf('nightOrday')!=-1){
			  	   	     	var oIcon = eTargetBox.children[0];
			  	  	        var oSpan = eTargetBox.children[1];
				  	  	     if(oIcon.className=='night'){
				  	  	     	oIcon.className = 'day';
				  	  	     	oSpan.innerHTML = '白天' ;
				  	  	     	Doms.oContent.style.backgroundColor = 'rgba(0,0,0,0.9)';
				  	  	     	Doms.oContent.style.color ='rgba(255,240,240,.9)';
				  	  	     }else{
				  	  	     	oIcon.className = 'night';
				  	  	     	oSpan.innerHTML = '夜间' ;
				  	  	     	// 这里即使第一次没有本地存储，返回null ,也没事，还是默认的背景颜色
				  	  	     	Doms.oContent.style.backgroundColor = utils.myLocalstorage('contentBgColor');
				  	  	     	Doms.oContent.style.color ='black';
				  	  	     }
			  	   	     }
			  	   	        
			  	   	        // 显示当前在哪个功能上
			  	   	       clickActive(eTargetBox,'controlesActive');
			  	   	   
			  	   },false);
			  	   
			  	   
			  	   Doms.oAction.addEventListener('click',function(ev){
			  	   	       var ev = ev || window.event ,
			  	   	        eTarget = ev.target || sv.srcElement ;
			  	   	        
			  	   	        // 字体调节
			  	   	         if(eTarget.innerHTML!=''){
                                     Doms.oContent.style.fontSize= getComputedStyle( Doms.oContent, null)['fontSize'] ;		              	  	 
				              	  	  var fontsize = parseInt(Doms.oContent.style.fontSize);
				              	  	  if( eTarget.innerHTML =='大号'){
				              	  	  	    if(fontsize > 75) alert('已经最大字号了！')   return ;
				              	  	  	 Doms.oContent.style.fontSize =(fontsize+1)  +'px' ;
				              	  	  }
				              	  	  if(eTarget.innerHTML =='小号'){
				              	  	  	    if(fontsize < 16) alert('已经最小字号了！')  return ;
				              	  	  	 Doms.oContent.style.fontSize =(fontsize-1)  +'px' ;
				              	  	  }
				              	  	 if(Doms.oContent.style.fontSize){
				              	  	 	utils.myLocalstorage('contentfontsize',Doms.oContent.style.fontSize);
				              	  	 }
			  	   	         }
			  	   	         //背景色调节
			  	   	         if(eTarget.style.backgroundColor){
			  	   	         	
			  	   	         	Doms.oContent.style.backgroundColor =  eTarget.style.backgroundColor;
		              	  	   	    clickActive( eTarget,'bgColorActive');
		              	  	   	    
		              	  	   	    if(Doms.oContent.style.backgroundColor){
		              	  	   	    	utils.myLocalstorage('contentBgColor',Doms.oContent.style.backgroundColor);
		              	  	   	    }
			  	   	         }
			  	   	         
			  	   },false);
			  	   
	
			  	 }
			  )();
			  
			 
			// UI渲染
			          //内容渲染
					  function RenderBaseFrame(container) {
							function parseChapterData(jsonData) {
								var jsonObj = JSON.parse(jsonData);
								var html = "<h4>" + jsonObj.t + "</h4>";
								for (var i = 0; i < jsonObj.p.length; i++) {
									html += "<p>" + jsonObj.p[i] + "</p>";
								}
								return html;
							}
		
							return function(data) {
								container.innerHTML = parseChapterData(data);
							};
						}
			       // 标题章节页渲染
			       function  RenderBaseChapters(container){
			       	    console.log(Chapters);
			       	    container.children[0].innerHTML = Chapters.title;
			       	    var chaptersLength = Chapters.chapters.length ;
			       	    var chaptersHtml ;
			       	    
			       	    
			       	    for(var i =0 ;i<chaptersLength ;i++){
			       	    	  Chapters.chapters[i].title
			       	    	  chaptersHtml +=        '<span price=' + Chapters.chapters[i].price 
			       	    	                          + ' id='+Chapters.chapters[i].chapter_id 
			       	    	                          + ' wordcount='+Chapters.chapters[i].word_count
			       	    	                          +' free='+Chapters.chapters[i].free			       	   	                      
			       	    	                          +'>' + Chapters.chapters[i].title 			       	    	                          
			       	    	                          +'</span>' ;
			       	    }
			       	    container.children[1].innerHTML += chaptersHtml ;			       	  
			     
			       	    
			       	       // // 通过当前的身上的id 属性就可以去任何一章 
			       	   for(var j =0 ;j< container.children[1].children.length ;j++){
			       	   	    container.children[1].children[j].addEventListener('click',function(){
			       	   	    				       	   	    	     
			       	   	    	       if((parseInt(this.id)+1) < 5){
			       	   	    	       	 // 每次改动Chapter_id 都别忘了存储当前Chapter_id
			       	   	    	       	  Chapter_id = parseInt(this.id)+1 ;
			       	   	    	       	  utils.myLocalstorage('Chapter_id',Chapter_id);
			       	   	    	       	  dataNview();
			       	   	    	         ChaptersToggle();
			       	   	    	       }else{
			       	   	    	       	  alert('sorry 此章节暂时没有更新') ;
			       	   	    	       }
			       	   	    	       
			       	   	    	       //  头尾控制器消失
			       	   	    	      Doms.oHeader.style.display = 'none';
			    	                  Doms.oControles.style.display = 'none';
			       	   	    },false);
			       	   }
			       	   
			       	   
			       }
			       
		});
