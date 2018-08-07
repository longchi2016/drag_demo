lclc.ns("lclc.grid.DataGrid");
/**
 * 表的定义
 */
lclc.grid.DataGrid = function(gridSetting) {
	if ($.isEmptyObject(gridSetting))
		return;
	// 事件类型常量
	lclc.grid.DataGrid.ONCHANGEDATA = "onchangedata";
	// 控制字段扩展前缀
	lclc.grid.DataGrid.PREFIXEXPAND = "SNAME_";
	lclc.grid.DataGrid.PREFIXEXPAND_C = "C_";
    lclc.grid.DataGrid.defaultCellColor = "bl";
	lclc.grid.DataGrid.DOWNLOADFILEURL = "commons/fileserver/downloadFile.do?tokenid="+tokenID;
	lclc.grid.DataGrid.UPLOADFILEURL = "commons/fileserver/uploadFile.do?";
	/**
	 * grid 的默认的配置
	 */
	this.setting = {
		definePath : "commponent/grid/commonGrid/getDefine.do",
		// 得到数据的的路径
		getDataPath : "commponent/grid/commonGrid/getData.do",
		// 保存数据的地址
		saveDataPath : "commponent/grid/commonGrid/saveData.do",
		// 得到默认值数据的路径
		getDefaultDataPath : "component/commonweb/getTableDefaultValue.do",
		//新增时是否新增默认值
		isInsertDefaultData : false,
		//级联关系引用url
		relatedUrl : "component/commonweb/assoc.do",
		// 是否是同步
		isAsync : true,
		// 是否在编辑状态
		editable : false,
		// 是否支持表头排序
		headsort : false,
		// 是否要自增的列。
		columnsSeq : true,
		//是否显示 全选反选按钮
		isShowSelectBtn:true,
		// 选择的风格 有 checkbox radio null 三种参数
		check_Style : "checkbox",
		check_leaf:false,
		// 加载数据时，默认让checkbox 选中
		defalutChecked : null,
		// 设置grid 的CLASS 样式
		className : 'busdttheme_ifmis',
		// 设置选中行颜色
		selectClassName : '#f8feb2',
		// 是否异步得到定义数据
		asyncGetConfig : true,
		// ajax是否异步加载数据
		asyncAutoLoad : true,
		// 是否自动加载数据
		autoLoad : true,
		// 在前台写配置，不从后台加载数据
		localConfigration : false,
		// 是否是首行合计 true,false
		headTotal : false,
		basePath : basePath,
		baseUrl : baseUrl,
		// 保存时，会取所有的数据
		getAllUpdate : false,
		// 分析物理主键(all ,iskey,isLogicKey,C_STATUS) 保存数据时，判断当前的数据是否是更新，还是插入。
		analyseKey : "C_STATUS",
		// 鼠标荧光棒的颜色
		mouselight : "#fffdd9",
		// 是否加载公式插件
		isExpression : true,
		// 是否自动高度
		autoHeight : false,
		// 列的自定义的参数key 为查询的条件，value 为列的参数
		colOptions : [],
		//字符串的正则
		stringRegexp : true,//是否做stringRegexpr2正则校验
		stringRegexpr: /^[^\']*$/,
		stringRegexpr2: /[\\\/:\*\?"\<\>\|]/,// 禁止 \/:*?"<>|
		//不符合字符串的正则时的提示
		stringRegexprMessage:"不可以输入单引号",
		stringRegexprMessage2:"禁止输入 \/:*?\"<>|特殊字符",
		// 是否自动校验。
		autoValidate : true,
		// 是否分页
		pagination : false,
		//及联选中 只有分组的一般录入表这个选项才会有效
		cascadeChecked:false,
		//只读颜色
		readOnlyColor: 'readOnlyColor',
		//是否设置只读颜色
		showReadOnlyColor:true,
		// 加载数据时提示
		loadDataTip : "加载数据中,请稍后...",
		loadDefineTip : "加载表格列信息中,请稍后...",
		saveDataTip : "保存数据中，请稍后...",
		// 是否显视边框 True表示为显示出面板body元素的边框，false则隐藏（缺省为true），
		// 影响的是四周的边框
		border : true,
		// 制定borderStyle元素的CSS样式。
		borderStyle : null,
	    //如果列不能为空，在列的标题上显视 红 * 进行提示
		nullableTip:true,
		//是否可以锁定
		allowClock:true,
		//支持锁定并且check_Style不为null时，锁定前两列
		clockColumnFlag:false,
		//点击某行，对应checkbox或radio自动勾选
		rowChecked:false,
		//点复选框后 重新计算选中行的合计
		selectRowSumCols : false,
		//在不设置分页的情况下，在表格页脚显示标题
		footShortTitleFlag :false,
		// 分页的信息
		pageInfo : {
			// 每页多少条信息
			pageSize : 20,
			// 分页参数
			optionsForRows : [10, 20, 30, 50, 100],
			callback : {
				changePage : null,
				afterChangePage : null
			}
		},
		// 是否在工具条显示快速查询框
		fastQuery : false,
		// 工具条
		tbar : [],
		// 工具条的风格
		tbarStyle : null,
		// 回调方法
		callback : {
			// 开始编辑时的回调方法
			oneditstart : null,
			// 编辑完成后的回调方法
			oneditend : null,
			//表格渲染前方法
			onbeforedraw : null,
			// 表格初始化完成后，回调方法
			completed : null,
			// 单击回调方法
			onclick : null,
			// 保存完成回调方法
			onsaveData : null,
			// 数据发生改变的方法
			onchangedata : null,
			// 从后台加载数据前
			onBeforeLoaddata : null,
			// 从后台加载数据时
			onloaddata : null,
			colFormat : {
				col : null
			},
			// 超链跳转页面
			linkJump : null,
			// 排序方法
			// 会返回二个参数。如下使用
			/*
			 * function asc(x,y) ...{ if (x > y) return 1; if (x < y) return -1; }
			 */
			Comparable : null
		},
		// 这下面的全是私有，不能修改
		// 渲染的DIVID
		renderId : null,
		// 渲染的DIVID
		gridId : "",
		gridObj : null,
		// 要加载的插件
		plugins : [],
		// 要传到后台的参数
		params : {},
		// 指向的容器
		parent : null,
		defaultData : {}
	};
	// this引用
	this.setting.me = this;
	this.setting.gridSetting = gridSetting;
	// 用来保存删除的数据
	this.delList = new Array();
	//分组信息设置窗口设置的信息
	this.groupColsInfo = null;
	/**
	 * 初始化事件，包括事件的绑定和触发
	 */
	function initEvents(setting) {
		var me = setting.me;

		/*// ------------------20160805 解决折叠展开时，浮动表，基本数字表不重画的问题---------------------
		lclc.EventManager.addEventListener({
					eventType : "ACTIVEITEM",
					handler : function(e) {
						if (e.active && e.currentItem.tableID == me.getGrid().tableID) {
							me.resizeTable(me.getWidth(),me.getHeight());
					}
					}
				});*/
		lclc.EventManager.addEventListener({
					eventType : "onclick",
					handler : me._processEvent,
					target : me
				});
		if (setting.cascadeChecked == true && me.getGrid().groupColumnsList.length > 0) {
			lclc.EventManager.addEventListener({
						eventType : "onclick",
						handler : me._cascadeChecked,
						target : me
					});
		}
		if (setting.headTotal && setting.selectRowSumCols) {
		    lclc.EventManager.addEventListener({
					eventType : "onclick",
					handler : me._selectRowSumCols,
					target : me
				});
	    }
		lclc.EventManager.addEventListener({
					eventType : "ondblclick",
					handler : me._dbClickTextarea,
					target : me
				});
	 
		// 事件绑定 
		lclc.EventManager.addEventListener({
					eventType : lclc.BaseEvent.eventType.LOADDATA,
					handler : function(e) {
						if (e.isSelf == true) {
							lclc.tools.apply({
										fn : setting.callback.onloaddata,
										param : e,
										scope : me
									})
						}
					},
					target : me
				});
		lclc.EventManager.addEventListener({
					eventType : lclc.BaseEvent.eventType.BEFORELOADDATA,
					handler : function(e) {
						if (e.isSelf == true) {
							lclc.tools.apply({
										fn : setting.callback.onBeforeLoaddata,
										param : e,
										scope : me
									})
						}
					},
					target : me
				});
		lclc.EventManager.addEventListener({
					eventType : lclc.BaseEvent.eventType.EDITSTART,
					handler : function(e) {
						if (e.isSelf == true) {
							if (e.currentRow["C_STATUS"] == "0" && e.lclcDataTable.option("canModify") == false) {
								lclc.Logger 	.info(this.id
												+ "grid停止编辑:状态为原始的，并canModify 为fale 不能修改");
								return false;
							}
							if (e.lclcDataTable.option("editable") ==  false) {
								lclc.Logger .info(this.id + "grid停止编辑:当前setting editable 为false");
								return false;
							}
							if (e.currentRow["ROWSECU"] == "2") {
								lclc.Logger .info(this.id + "grid停止编辑:当前行权限为2不能修改");
								return false;
							}
							//分组行不能编辑
							if(me.getGrid().groupColumnsList && e.currentRow["level"] < me.getGrid().groupColumnsList.length - 1){
								lclc.Logger .info(this.id + "grid停止编辑:当前行为分组行不能修改");
								return false;
							}
							//列限制
							if(me._checkColLimit(e)==false){
								return false;
							}
							if (e.isSelf == true) {
								var flag = lclc.tools.apply({
											fn : setting.callback.oneditstart,
											param : e,
											scope : me
										});
								if (flag == false) {
									lclc.Logger.info(this.id
											+ "grid停止编辑: 默认编辑前事件");

								}
								return flag;
							}
						}
					},
					target : me
				});
		lclc.EventManager.addEventListener({
					eventType : lclc.BaseEvent.eventType.EDITEND,
					handler : function(e) {
						if (e.isSelf == true) {
							lclc.tools.apply({
										fn : setting.callback.oneditend,
										param : e,
										scope : me
									});
						}
					},
					target : me
				});
		lclc.EventManager.addEventListener({
					eventType : "onclick",
					handler : function(e) {
						if (e.isSelf == true) {
							lclc.tools.apply({
										fn : setting.callback.onclick,
										param : e,
										scope : me
									})
						}
					},
					target : me
				});

		lclc.EventManager.addEventListener({
					eventType : "ondblclick",
					handler : function(e) {
						if (e.isSelf == true) {
							lclc.tools.apply({
										fn : setting.callback.ondblclick,
										param : e,
										scope : me
									})
						}
					},
					target : me
				});
		lclc.EventManager.addEventListener({
					eventType : lclc.grid.DataGrid.ONCHANGEDATA,
					handler : function(e) {
						if (e.isSelf == true) {
							lclc.tools.apply({
										fn : setting.callback.onchangedata,
										param : e,
										scope : me
									})
						}
					},
					target : me
				});

		lclc.EventManager.addEventListener({
					eventType : lclc.BaseEvent.eventType.SAVEDATA,
					handler : function(e) {
						if (e.isSelf == true) {
							lclc.tools.apply({
										fn : setting.callback.onsaveData,
										param : e,
										scope : me
									})
						}
					},
					target : me
				});

		// 处理邦定到列编辑前与编辑后事件
		if ($.type(setting.callback.oneditstart) === 'object') {
			for (var colName in setting.callback.oneditstart) {
				lclc.EventManager.addEventListener({
					eventType : colName + '@' + lclc.BaseEvent.eventType.EDITSTART,
					handler : function(e) {
						if (e.isSelf == true) {
							lclc.tools.apply({
										fn : setting.callback.oneditstart[colName],
										param : e,
										scope : me
									})
						}
					},
					target : me
				});
			}
		}
		if ($.type(setting.callback.oneditend) === 'object') {
			for (var colName in setting.callback.oneditend) {
				lclc.EventManager.addEventListener({
					eventType : colName + '@' + "oneditend",
					handler : function(e) {
						if (e.isSelf == true) {
							lclc.tools.apply({
										fn : setting.callback.oneditend[colName],
										param : e,
										scope : me
									})
						}
					},
					target : me
				});
			}
		} 
		// 事件触发
		// 转发龙图Grid onclick,ondblclick事件
		(function(events) {
			$.each(events, function(index, eventName) {
				me.setting.dataTable.onEvent(eventName, function() {
					lclc.EventManager.dispatchEvent(new lclc.grid.DataGridEvent({
						eventElement : setting.me,
						eventType : eventName,
						lclcDataTable : setting.me,
						currentValue : arguments[4][arguments[0].getCols()[arguments[3]].name],
						currentCol : arguments[0].getCols()[arguments[3]],
						currentRow : arguments[4],
						domobj : arguments[1],
						colIndex : arguments[3],
						rowIndex : arguments[2],
						srcElement : window.event == null ? null : window.event.srcElement,
						domInnerText : window.event.srcElement == null ? "" : window.event.srcElement.innerText,
						ltDataTable : arguments[0]
					}));
				});
			});
		})(['onclick', 'ondblclick']);

		// 封装并转发龙图Grid oneditend,oneditstart,afterclick事件
		var cols = setting.cols;
		$.each(cols, function(index, col) {
					col.oneditend = function() {
						//强制效验
						// 当前this引用为龙图列对象
						var col = this;
						// 自定义onchangedata事件
						var newEvent = new lclc.grid.DataGridEvent({
									eventElement : setting.me,
									eventType : lclc.BaseEvent.eventType.EDITEND,
									lclcDataTable : setting.me,
									currentValue : arguments[4][col.name],
									currentCol : col,
									currentRow : arguments[4],
									domobj : arguments[1],
									colIndex : arguments[3],
									rowIndex : arguments[2],
									lastEditRow:setting.me.lastEditRow,
									srcElement : window.event == null ? null : window.event.srcElement,
									domInnerText : window.event.srcElement == null ? "" : window.event.srcElement.innerText,
									ltDataTable : arguments[0]
								}); 
						
						if (setting.autoValidate == true) {
									if(	me.showMessage.apply(me, [newEvent]) != null){
										 return; 
									}  
						}
						// 维护状态
						setting.me._updateRowBySort({
									"C_STATUS" : arguments[4].C_STATUS
								}, arguments[4]._sortid, false);
						lclc.EventManager.dispatchEvent(newEvent);

						lclc.EventManager.dispatchEvent($.extend({}, newEvent, {
									eventType : lclc.grid.DataGrid.ONCHANGEDATA,
									changeTyep : "update"

								}));
						lclc.EventManager.dispatchEvent($.extend({}, newEvent, {
									eventType : col.name + '@' + lclc.BaseEvent.eventType.EDITEND
								}));
					};
					col.oneditstart = function() {
						var col = this;
						var newEvent = new lclc.grid.DataGridEvent({
									eventElement : setting.me,
									eventType : lclc.BaseEvent.eventType.EDITSTART,
									lclcDataTable : setting.me,
									currentValue : arguments[4][this.name],
									currentCol : col,
									async : false,
									currentRow : arguments[4],
									domobj : arguments[1],
									colIndex : arguments[3],
									rowIndex : arguments[2],
									srcElement : window.event == null ? null : window.event.srcElement,
									domInnerText : window.event.srcElement == null ? "" : window.event.srcElement.innerText,
									ltDataTable : arguments[0]
								});
						setting.me.lastEditRow=$.extend({},arguments[4]);		
						var a = lclc.EventManager.dispatchEvent(newEvent);
						if (a != null) {
							return a;
						}
						return lclc.EventManager.dispatchEvent($.extend({},
								newEvent, {
									eventType : col.name + '@' 	+ lclc.BaseEvent.eventType.EDITSTART
								}));
					};
				});
	};
	/**
	 * 初始化表
	 */
	function initGrid(setting) {
		// 创建recordset
		var recordset = null;
		recordset = new Ext.lt.recordset({
					ver : "1.3",
					compress : setting.recordset.compress,
					columns : setting.recordset.columns,
					datas : []
				});
		beginDrawTable(recordset, setting);

	};
	/**
	 * 渲染表
	 */
	function beginDrawTable(recordset, setting) {
		lclc.EventManager.dispatchEvent(new lclc.grid.DataGridEvent({
					eventElement : setting.me,
					eventType : lclc.BaseEvent.eventType.BEFOREDRAW,
					lclcDataTable : setting.me,
					gridSetting : setting.gridSetting,
					ltDataTable : recordset
				}));
		if (setting.callback.onbeforedraw
				&& $.type(setting.callback.onbeforedraw) === 'function') {
			lclc.tools.apply({
						fn : setting.callback.onbeforedraw,
						param : setting,
						scope : setting.me
					});
		}
		
		var panelConfig = setting.me._getPanelConfig();
		recordset.compress = setting.recordset.compress;
		recordset.columns = setting.recordset.columns;
		
		// 得到grid
		var grid = null;
		var config = new Object();
		config.rs = recordset;
		grid = new Ext.lt.formulasdatatable(config);
		setting.dataTable = grid;

		// 设置自增列和选择的方法
		if (setting.columnsSeq) {
			setting.cols.unshift(grid.columns.seq);
		}
		if (setting.check_Style) {
			if (setting.check_Style == "radio") {
				setting.cols.unshift(grid.columns.radio);
			} else if (setting.check_Style == "checkbox") {
				setting.cols.unshift(grid.columns.checkbox);
			}
		}
		// 增加邦定列等
		setting.me.initPlugin();
		setting.cols = setting.me.initCols(setting, grid);
		grid.setCols(setting.cols);
		grid.setMouselight(setting.mouselight);
		grid.mousedrag(setting.mousedrag);
		grid.setClassName(setting.className);
		grid.drawMultiHead(setting.drawMultiHead);
		grid.setMoveKey({//键盘按键：上下左右回车tab
			'9' : 'right',
			'13' : "down",
			'37' : 'left',
			'38' : 'up',
			'39' : 'right',
			'40' : 'down'
		});
		if ($.isNumeric(setting.width)) {
			grid.width = setting.width;
		}
		if ($.isNumeric(setting.height)) {
			grid.height = setting.height;
		}
		grid.setSelectClassName(setting.selectClassName);
		grid.setAllowClock(setting.allowClock);
		if(setting.allowClock && setting.check_Style && setting.columnsSeq && setting.clockColumnFlag){
			var clockNumber=2,flag=true;//clockNumber为锁定的列数,默认为前两列
			grid.clockColumnSize(clockNumber,flag);
		}
		grid.rowChecked(setting.rowChecked,setting.editable)
		grid.setEditSelect('all');
		if (setting.me.option("autoHeight") == true) {
				setting.me._autoSetHeight( );
		}
		if(!setting.me.getContentPanel(panelConfig)[0]){
			return;
		}
		grid.draw(setting.me.getContentPanel(panelConfig)[0]);
		//是否排序开关
		grid.headsort(setting.headsort);
		// 初始一个后台传过来的，要处理的方法
		initEvents(setting);
		// 如果传了数据就重新加载数据
		if (setting.dataTable.getRecordSet().size() < 1 && setting.autoLoad) {
			setting.me.reloadData(setting);
		}
		lclc.EventManager.dispatchEvent(new lclc.grid.DataGridEvent({
					eventElement : setting.me,
					eventType : lclc.BaseEvent.eventType.COMPLETED,
					lclcDataTable : setting.me,
					gridSetting : setting.gridSetting,
					ltDataTable : grid
				}));
	};
	// ///////////////////////////////////////////
	// ////在这才开始创建 //
	// ///////////////////////////////////////////

	// 得到适配器
	this.adapter = lclc.adapter.AdapterManager.getAdapter(this);
	this.beforeinit(gridSetting);
	if (this.setting.localConfigration == false) {
		var me = this;
		this.getConfigration(gridSetting, function(serviceConfig) {

					me._mergeSting(gridSetting, serviceConfig);
					lclc.grid.DataGrid.superclass.constructor
							.call(me, me.setting);
					me.init();
					initGrid(me.setting);

				});
	} else {
		this._mergeSting(gridSetting);
		lclc.grid.DataGrid.superclass.constructor.call(this, this.setting);
		this.init();
		initGrid(this.setting);
	}
	// 日志输出方法：debugging
	function debug($obj) {
		lclc.Logger.info($obj);
	};

};

// 继承 lclc.Grid
// 重写方法

lclc.extend(lclc.grid.DataGrid, lclc.grid.Panel, {
	xType : 'grid',
	className : 'grid',
	beforeinit : function(userSetting) {
		$.extend(this.setting, userSetting);
	},
	/**
	 * 初始化
	 */
	init : function() {
		var me = this;
		// this引用
		this.setting.me = this;
		this.setting.jqueryObj = this.jqueryObj = $("#" + this.setting.renderId);
		this.jqueryObj.empty();
		this.delList = new Array();
		//this.containerParentNode = this.jqueryObj[0].parentNode;
	    this.initSize();
		this.setting.params.pagination = this.setting.pagination;
		lclc.EventManager.removeAllEventListener(this);
		this.initFastQueryField();
		this.drawPanel();
		if(this.getstatusPanel()[0]){
			this._initToolBarAndPagination();
		}
		this.initBar();
	},
	/*
	 * 初始化快速查询框
	 */
	initFastQueryField : function(){
		var tbar = this.option("tbar");
		//显示快速查询框
		if(this.setting.fastQuery==true){
			this.queryFieldId = lclc.getUniqueId();
			tbar.push({
				float : 'l',
				sortnum : 0,
				html : '<div id="'+this.queryFieldId+'" style="width:250px;"></div>'
			});
		}
		this.option("tbar", tbar)
	},
	/*
	 * 高级查询
	 */
	advancedSearchField : function(fn){//fn为回调
		var me=this;
		var advancedSearchSetting={
				renderId:me.setting.id,
				xType: 'dialog',
				title:"高级查询界面",
				id:"advancedSearchDialog"+me.setting.id,
				content: '<div id="advancedHomeDiv_'+me.setting.id+'"></div>',
				// content : $('<iframe src="' + url + '" id="advancedHomeDiv_" style="width:99%;height:100%;" ></iframe>'),
				height: document.body.clientHeight*0.8,
				width: document.body.clientWidth*0.8,
				isDrag : true,//是否可拖动
				//dialog初始化完成后再执行
				initFn:function(){
					var advancedOptions={};
					if(fn && $.type(fn)==="function"){
						$.extend(true, advancedOptions, {
							advancedSearchLoadData : fn
						});
					}
					$("#"+advancedSearchSetting.id).advancedSearch(me,advancedOptions);
				},
				button: [{
					name: "取消",
					handler: function (e) {
						lclc.getCmp(e.id).close();
					}
				}],
				closeFn: function (obj) {
					obj.close();
				}
		}
		lclc.create(advancedSearchSetting);
	},
	/*
	 * 初始化工具条
	 */
	initBar : function() {
		var me = this;
		this.addToolbar(this.option("tbar"));
		this.addFootbar(this.option("fbar"));
		if (this.setting.fastQuery == true) {
			$("#" + this.queryFieldId).fastQueryField({
				params : me.setting.params,
				url : me.setting.definePath,
				loadData : function(e, params, col) {
					if(params){
						var queryObj = new Object();
						//var isRef =  col.refTableID==null?false:true;//是否是引用列
						var dataType = col.dataType;//列类型：N：数字；S：字符。
						if(dataType=='N'){
							queryObj["columnDbName"] = params["columnDBName"];
							queryObj["operator"] = '=';
							queryObj["queryValue"] = params["searchValue"];
						}else{
							queryObj["columnDbName"] = params["columnDBName"];
							queryObj["operator"] = 'like';
							queryObj["queryValue"] = params["searchValue"];
						}
						me.setCon(queryObj);
					}else{
						var grid = me.getGrid();
						grid.queryPanelParamList = [];
						me.setGrid(grid);
					}
					me.reloadData();
				}
			});
		}
	},
	_getShowStatusPanel : function() {
		if(this.showFootbar ==null){
			var flag= lclc.grid.DataGrid.superclass._getShowStatusPanel.call(this);
			 flag=flag==true?flag:flag== false ?this.setting.pagination:false;
			 return flag;
		}else{
			return this.showFootbar;
		}
	},
	_initToolBarAndPagination : function() {
		var config = this._getPanelConfig();
		var me = this;
		// 处理分页信息
		if (this.setting.pagination) {
			lclc.require(["tablePagination"]);
			var pageInfo = $.extend({}, this.setting.pageInfo,{shortTitle:this.setting.shortTitle});
			pageInfo.callback = pageInfo.callback || {}, pageInfo.position = "inner", pageInfo.callback.changePage = function(p) {
				me.reloadData(null, p);
			}
			this.getstatusPanel().tablePagination(pageInfo);
		}else if(this.setting.pagination==false && this.setting.footShortTitleFlag ){
			lclc.require(["tablePagination"]);
			var footTitle = {footShortTitle:this.setting.shortTitle};
			this.getstatusPanel().footTableshortTitle(footTitle);
		}

	},
	//检查列限制
	_checkColLimit : function(e) {
		var columnLimitList = e.lclcDataTable.setting.columnLimitList;
		var currentColID = e.currentCol.columnID;
		if (columnLimitList && columnLimitList.length > 0) {
			for (var i = 0; i < columnLimitList.length; i++) {
				var colLimit = columnLimitList[i];
				if (colLimit.columnid != currentColID) {
					continue;
				}
				// 当前列是被限制列
				var conditionList = colLimit.conditionList;
				if (conditionList && conditionList.length > 0) {
					var num = 0;
					for (var j = 0; j < conditionList.length; j++) {
						var conditionPO = conditionList[j];
						var columnidLimit = conditionPO.columnidLimit;// 影响被限制列的列id
						var operator = conditionPO.operator;
						var condition = conditionPO.condition || '';//1,2,3
						if(condition){
							condition = condition.split(',')||[];
						}

						var limitColValue = e.currentRow[conditionPO.dbColumnName];
						if(operator=="in" && limitColValue ){//包括
							for(var k=0;k<condition.length;k++){
								if(!isNaN(condition[k]) && !isNaN(limitColValue)){
									condition[k]=parseFloat(condition[k]);
									limitColValue=parseFloat(limitColValue);
								}
								if(condition[k]==limitColValue){
									num+=1;
									break;
								}
							}
						}else if(operator=="not in"){//不包括
							var flagT = true;
							for(var k=0;k<condition.length;k++){
								if(!isNaN(condition[k]) && !isNaN(limitColValue)){
									condition[k]=parseFloat(condition[k]);
									limitColValue=parseFloat(limitColValue);
								}
								if(condition[k]==limitColValue){
									flagT = false;
									break;
								}
							}
							if(flagT==true){
								num+=1;
							}
						}else if(operator=="is null" && (!limitColValue || limitColValue.trim()=='')){//空
							num+=1;
						}else if(operator=="is not null" && limitColValue && limitColValue.trim()!=''){//非空
							num+=1;
						}
					}
					if(num == conditionList.length){
						return false;
					}
				}
			}
		}
		return true;
	},
    getShowTitle:function(){
     if(this.setting.pagination != true){
     	return    (this.option("title") ==null?"":this.option("title"))+((this.option("shortTitle")==null|| this.option("shortTitle") == '')?"":"("+this.option("shortTitle")+")" )
     }
     return (this.option("title") ==null?"":this.option("title"));
	},
	// 把服务器的配制信息，与用户的配制信息，与默认配制信息合并，
	// 权重按重要程度依次为用户 服务器，默认
	_mergeSting : function(userConfig, serviceConfig) {
		// 后台返回的参数
		if (userConfig.gridId != null && userConfig.gridId.length > 0) {
			this.setting.renderId = this.renderId = userConfig.gridId;
		} else if (userConfig.renderId != null
				&& userConfig.renderId.length > 0) {
			this.setting.gridId = this.renderId = userConfig.renderId;
		}
		this.id = userConfig.id;
		var tempTab = lclc.getCmp(this.renderId);
		if (tempTab != null) {
			if ($.type(tempTab.destroy) === 'function') {

				tempTab.destroy();
			}
		}
		var _setting = null;
		if ($.type(serviceConfig) === "object") {
			if(userConfig.editable!=null){
				serviceConfig.readOnly = !userConfig.editable;
			}
			_setting = serviceConfig;
			this.setting.grid = lclc.JSON.stringify(serviceConfig);
		} else if ($.type(serviceConfig) === "string") {
			_setting = lclc.JSON.parse(serviceConfig);
			this.setting.grid = serviceConfig;
		} else {  //
			// 创建一个默认的grid
			if(this.setting.grid== null){
				_setting = this.adapter.parseDefine(userConfig);
			   this.setting.grid  =this.setting.grid || lclc.JSON.stringify(_setting);
			}

		}
		if (_setting != null && !$.isEmptyObject(_setting)) {
			_setting = this.adapter.getDefine(_setting);
			// 服务器的覆盖默认的
			$.extend(this.setting, _setting);
		}
		// 服务器的覆盖默认的
		$.extend( this.setting, userConfig);
		// 设置参数
		this.setting.recordset = {
			compress : this.setting.compress,
			columns : this.setting.columns,
			datas : this.setting.datas
		};
		this.setting.colOptions = this.setting.colOptions || [];
/*		if (this.setting.editable == false) {
			this.setting.colOptions.push({
						key : {},
						value : {
							edit : false
						}
					});
		}*/
		// 增加
		var options = this.setting.colOptions;
		if ($.isArray(options)) {
			for (var i = 0; i < options.length; i++) {
				// 查询col
				var cols = lclc.tools.query(options[i].key, this.setting.cols);
				for (var j = 0; j < cols.length; j++) {
					options[i].value = options[i].value || {};
					lclc.merge(cols[j], options[i].value);
				}
			}
		}
		if (this.setting.cols.length > 0) {
			if (!$.isArray(this.setting.recordset.columns)
					|| this.setting.recordset.columns.length < 1) {
				var cols = this.setting.cols;
				var tempdata = new Array();
				for (var i = 0; i < cols.length; i++) {
					tempdata.push(cols[i].name);
					if ($.type(cols[i].csId) == "string") {
						tempdata.push(lclc.grid.DataGrid.PREFIXEXPANDPREFIXEXPAND_C
								+ cols[i].name);
					} else if (cols[i].xType === "fileuploadfield"
							|| cols[i].xType === "combo"
							|| cols[i].xType === "multipleCombo"//add by xl ; bizaiyi 20160819 合入
							|| cols[i].xType === "treepanel") {
						tempdata.push(lclc.grid.DataGrid.PREFIXEXPAND
								+ cols[i].name);
					}
				}
				this.setting.recordset.columns = tempdata;
			}

		}
		this.setParent(this.setting.parent);
	},
	_cascadeChecked:function(e){
		if(e.currentCol.name != 'check'){
		  return;
		}
		var groupCols=this.getGrid().groupColumnsList;
		var fql={};
		for (var i = 0; i < e.currentRow.level  ; i++) {
			if(e.currentRow[this.getGrid().groupColumnsList[i].dbColumnName] != null){
				fql[this.getGrid().groupColumnsList[i].dbColumnName]=e.currentRow[this.getGrid().groupColumnsList[i].dbColumnName];
			}
		}
		var datas=[];
		var data=this.queryData(fql);
		for (var j = 0; j < data.length; j++) {
			if(data[j]['_sortid'] != e.currentRow['_sortid'] ){
				datas.push({
				 "_sortid":data[j]["_sortid"],
				 "_locationposition":data[j]["_locationposition"],
				"check":e.currentRow["check"]
				})
			}
		}
	     this.updateRows(datas);
	},
	//选中的行 进行合计
	_selectRowSumCols:function(e){
		if(this.setting.check_Style && this.setting.check_Style == 'checkbox'){
			var	allDatas=this.getSelectedRows();
			if(allDatas.length == 0 && !e){ //初始化
			   return;
			}
			if(this.setting.editable){ //针对表可写
				if(e && e.currentCol && !e.currentCol.readOnly && e.currentCol.name !='check'){
					return;
				}
			}
		    var numCols = this.getSumColByGrid();
			for (var key in numCols) {
				this.sumCols(key);
			}

		}
	},
	/**
	 * 得到后台的配制信息
	 */
	getConfigration : function(userSetting, fn) {
		var tempSetting = $.extend({}, this.setting, userSetting);
		var url = tempSetting.basePath + tempSetting.definePath;
		if ($.type(this.setting.loadDefineTip) === 'string'
				&& this.setting.loadDefineTip.length > 0) {
			this.showShade(this.setting.loadDefineTip);
		}
		var me=this;
		// 异步初始化
		lclc.pubAjax({
					url : url,
					type : 'post',
					cache : false,
					data : tempSetting.params,
					dataType : 'json',
					async : tempSetting.asyncGetConfig,
					success : function(serviceConfig) {
						if ($.type(me.setting.loadDefineTip) === 'string'
								&& me.setting.loadDefineTip.length > 0) {
							me.hideShade(me.setting.loadDefineTip);
						}
						if ($.type(fn) === 'function') {
							fn(serviceConfig);
						}
					}
				});
	},
	setReadCellColor : function(line, colindix, row, rowspan) {
		var color = lclc.grid.DataGrid.defaultCellColor;
		if (rowspan != null) {
			color = rowspan(line, colindix, row,this.setting.dataTable.getCols()[colindix]);
		}
		if (color == lclc.grid.DataGrid.defaultCellColor) {
			if (this.setting.editable == true) {
				// 得到当前行
				// 得到当前列
				var currentCol = this.setting.dataTable.getCols()[colindix];
				if (currentCol.readOnly == true
						&& (currentCol.fn != null && currentCol.fn.initCols == null)) {
					color = this.setting.readOnlyColor;
				}
				if (row["C_STATUS"] == "0" && this.option("canModify") == false) {
					color = this.setting.readOnlyColor;
				}
				if (row["ROWSECU"] == "2") {
					color = this.setting.readOnlyColor;
				}
				if ($.type(currentCol.forComCol) === 'boolean'
						&& currentCol.forComCol == true) {
					color = this.setting.readOnlyColor;
				}
			}
			if (this.setting.groupCols && row["DATAKEY"] != "****" 	&&  row["level"] < this.setting.groupCols.length - 1) {// 不是总合计行的分组行
				var colorlevel = row["level"] % 2;
				if (colorlevel == 0) {
					color = "groupWarmColor";
				} else if (colorlevel == 1) {
					color = "groupColdColor";
				}
				//return color;
			}
			//return lclc.grid.DataGrid.defaultCellColor;
		}
		return color;

	},
	// 初始化例。
	initCols : function(setting, table) {
		var me = this;
		if (!$.isArray(setting.cols)) {
			return setting.cols;
		}
		var cols = setting.cols;
		var issum = {};
		var colFormat = setting.callback.colFormat;
		colFormat = colFormat || {};

		for (var i = 0; i < cols.length; i++) {
			if ($.type(cols[i].width) == "number" && cols[i].width > 0) {
				cols[i].minwidth = cols[i].width;
			}
			//处理只读颜色
			if (setting.showReadOnlyColor == true) {
				var rowspan = cols[i].rowspan;
				cols[i].rowspan =function(line, colindix, tmpdata){
				   return setting.me.setReadCellColor(line, colindix, tmpdata,rowspan);
				}

			}
			//收入分类科目名称 政府预算资金来源合计
			// if(	cols[i].alias=="政府预算资金来源合计"){
			// 	cols[i].alias="收入分类科目名称科目名称科目名称目名称目名称目名称目名称";
			// 	cols[i]["alias2"]=cols[i].alias;
			// }
			if("check" == cols[i].name ){
				if(this.setting.check_Style == 'checkbox' && this.setting.isShowSelectBtn){
					cols[i]["alias"] = '<span id="s'+this.setting.dataTable.id+'_0_all" class="checkall" title="全选"></span>';
					cols[i]["alias"] += '<span id="s'+this.setting.dataTable.id+'_0_invert" class="checkinvert" title="反选"></span>';
					cols[i]["onheadclick"] = function(table,el,c,_rs,en){
						var element = en.target || en.srcElement;
						var id = element.id;
						if(id){
							var params=id.split("_");
							if(params.length>=3){
								var chkType=params[2];
								var check = element.chkflag = !element.chkflag;//第一次默认是true
								var addClassName = "";
								var removeClassName = "";
								var groupCols = me.getGrid().groupColumnsList;//分组处理
								if(chkType=='all'){//全选
									me.checkAll(check,groupCols);
									if(check==true){
										removeClassName = 'checkall';
										addClassName = 'checkall-clickdown';
									}else{
										removeClassName = 'checkall-clickdown';
										addClassName = 'checkall';
									}
								}else if(chkType=='invert'){//反选
									me.invertCheck(groupCols);
									if(check==true){
										removeClassName = 'checkinvert';
										addClassName = 'checkinvert-clickdown';
									}else{
										removeClassName = 'checkinvert-clickdown';
										addClassName = 'checkinvert';
									}
								}
								$(element).removeClass(removeClassName).addClass(addClassName);
								if (setting.headTotal && setting.selectRowSumCols) {
							     	me._selectRowSumCols(el);
								}
							}
						}
					};
				}
			}
			if ("check" != cols[i].name && "_locationposition" != cols[i].name) {
				if (!cols[i].isNullable) {
					if (cols[i].edit == true) {
						cols[i]["alias2"] = cols[i].alias; // 某些地方需要原来的文本值 lixy
						if (setting.nullableTip == true) {
							cols[i].alias = cols[i].alias + "<font style='color:red' >*</font>";
							if(cols[i].head !=null && cols[i].head.length > 0){
								for(var bi=0;bi<cols[i].head.length;bi++){
									if(cols[i].head[bi] == cols[i].alias2){
										cols[i].head[bi] =cols[i].alias;
									}
								}
							}
						}
					}
				}
			}
			if (cols[i].xType == 'datefield' || cols[i].datatype == 'D') {
				if (cols[i].width == null || cols[i].width == 0) {
					// cols[i].width = 100;
					cols[i].minwidth = cols[i].width;
				}

				cols[i].datatype = 'D';
				cols[i].oldEdit = cols[i].edit;
				// oldEdit 为原来的可编辑属性
				cols[i].edit = false;
			}
			if (cols[i].datatype == 'F' || cols[i].datatype == 'I' || cols[i].datatype == 'N') {
				cols[i].format = this.getcolFormat(cols[i]);
				cols[i].selectedType = "all";
			} else if (cols[i].xType == 'textfield') {
				cols[i].selectedType = "all";
			}
			// 公式列只读
		 if ($.type(cols[i].forComCol) === 'boolean' && cols[i].forComCol == true) {
				cols[i].oldEdit = cols[i].edit;
				// oldEdit 为原来的可编辑属性
				cols[i].edit = false;
			}
			if ($.isArray(cols[i].columns) && cols[i].columns.length > 0) {
				setting.me.treelistcolumn = setting.me.treelistcolumn || [];
				// 得到分组列的第一列
				var fql = {};
				fql["name"] = cols[i]["columns"][0];
				var first = setting.me.queryColumn(fql)
				var treeC =$.extend( new table.treelistcolumn({
							alias : cols[i].alias,
							width : cols[i].width < first[0].width
									? first[0].width
									: cols[i].width,
							columns : cols[i]["columns"],
							autolevel : true,
							treeaction : true
						}), cols[i]);
				cols[i] = treeC;
				setting.me.treelistcolumn.push(treeC);
			}

			// 设置例的回调方法
			if ($.type(colFormat) === 'function') {
				cols[i].fn = function() {
					var newEvent = new lclc.grid.DataGridEvent({
								eventElement : this,
								eventType : "colFormat",
								lclcDataTable : setting.me,
								currentValue : arguments[3],
								currentCol : this,
								currentRow : arguments[2],
								colIndex : arguments[1],
								rowIndex : arguments[0],
								ltDataTable : table
							});
					return lclc.tools.apply({
								fn : colFormat,
								param : [newEvent],
								scope : this
							});
				};
				cols[i].fn.initCols=true;

			} else {
				if (cols[i].name in colFormat) {
					var colName = cols[i].name;
					if ($.type(colFormat[colName]) === "function") {
						cols[i].fn = function() {
							var newEvent = new lclc.grid.DataGridEvent({
										eventElement : this,
										eventType : "colFormat",
										lclcDataTable : setting.me,
										currentValue : arguments[3],
										currentCol : this,
										currentRow : arguments[2],
										colIndex : arguments[1],
										rowIndex : arguments[0],
										ltDataTable : table
									});
							return lclc.tools.apply({
										fn : colFormat[this.name],
										param : [newEvent],
										scope : this
									});
						};
					    cols[i].fn.initCols=true;
					}
				}

			}
			// 超列
			if ($.type(cols[i].ishref) === 'boolean' && cols[i].ishref == true) {
				cols[i].oldEdit = cols[i].edit;
				cols[i].edit = false;
				if ($.type(cols[i].fn) != 'function') {
					cols[i]["fn"] = function() {
						var newEvent = new lclc.grid.DataGridEvent({
									eventElement : this,
									eventType : "colFormat",
									lclcDataTable : setting.me,
									currentValue : arguments[3],
									currentCol : this,
									currentRow : arguments[2],
									colIndex : arguments[1],
									rowIndex : arguments[0],
									ltDataTable : table
								});

						return lclc.tools.apply({
									fn : setting.me._hrefColFormat,
									param : [newEvent],
									scope : this
								});
					};
				}
			}
			//check_leaf
			if(setting.check_leaf == true && "check" == cols[i].name ){
					cols[i]["fn"] = function() {
						var newEvent = new lclc.grid.DataGridEvent({
									eventElement : this,
									eventType : "colFormat",
									lclcDataTable : setting.me,
									currentValue : arguments[3],
									currentCol : this,
									currentRow : arguments[2],
									colIndex : arguments[1],
									rowIndex : arguments[0],
									ltDataTable : table
								});
						return lclc.tools.apply({
									fn : setting.me._check_leaf,
									param : [newEvent],
									scope : this
								});
					};

			}
			//处理数字例
			if (cols[i].datatype == 'F' || cols[i].datatype == 'I' || cols[i].datatype == 'N') {
				if ($.type(cols[i].fn) != 'function') {
					cols[i]["fn"] = function() {
						var newEvent = new lclc.grid.DataGridEvent({
									eventElement : this,
									eventType : "colFormat",
									lclcDataTable : setting.me,
									currentValue : arguments[3],
									currentCol : this,
									currentRow : arguments[2],
									colIndex : arguments[1],
									rowIndex : arguments[0],
									ltDataTable : table
								});
						return lclc.tools.apply({
									fn : setting.me._numberFormat,
									param : [newEvent],
									scope : this
								});
					};
				}
			}
			// 文件上传
			if (cols[i].xType === "fileuploadfield") {
				cols[i].oldEdit = cols[i].edit;
				cols[i].edit = false;
				cols[i].extProp = cols[i].extProp || {};
				if ($.type(cols[i].colFormat) == 'string'
						&& cols[i].colFormat.length > 0) {
					var v = cols[i].colFormat.split("|");
					if ($.isNumeric(v[0])) {
						cols[i].extProp.limitSize = v[0];
						cols[i].extProp.limitSuffix = v[1];
					} else {
						cols[i].extProp.limitSuffix = v[0];
					}
				}
				if ($.type(cols[i].fn) != 'function') {
					cols[i]["fn"] = function() {
						var newEvent = new lclc.grid.DataGridEvent({
									eventElement : this,
									eventType : "colFormat",
									lclcDataTable : setting.me,
									currentValue : arguments[3],
									currentCol : this,
									currentRow : arguments[2],
									colIndex : arguments[1],
									rowIndex : arguments[0],
									ltDataTable : table
								});
						return lclc.tools.apply({
									fn : setting.me._fileuploadfieldFormat,
									param : [newEvent],
									scope : this
								});
					};
				}
			} else if (cols[i].xType === 'textarea') {
				cols[i].oldEdit = cols[i].edit;
				// oldEdit 为原来的可编辑属性
				cols[i].edit = false;
			} else if (cols[i].xType === "combo"
					|| cols[i].xType === "multipleCombo"//add by xl; bizaiyi 20160819 合入
					|| cols[i].xType === "treepanel") {
				cols[i].oldEdit = cols[i].edit;
				// oldEdit 为原来的可编辑属性
				cols[i].edit = false;
				if ($.type(cols[i].fn) != 'function') {
					cols[i]["fn"] = function() {
						var newEvent = new lclc.grid.DataGridEvent({
									eventElement : this,
									eventType : "colFormat",
									lclcDataTable : setting.me,
									currentValue : arguments[3],
									currentCol : this,
									currentRow : arguments[2],
									colIndex : arguments[1],
									rowIndex : arguments[0],
									ltDataTable : table
								});
						return lclc.tools.apply({
									fn : setting.me._SNAMEFormat,
									param : [newEvent],
									scope : this
								});
					};
				}
			}
		}
		return cols;
	},
	drawPanel : function() {
		lclc.grid.DataGrid.superclass.drawPanel.call(this);
		var config = this._getPanelConfig();
		this.panel = $('#' + config.panelId);
	},
	/**
	 * 对超链列进的渲染方法
	 */
	_hrefColFormat : function(event) {
		var value = event.currentValue || "";
		if (event.lclcDataTable.setting.headTotal && event.rowIndex == 0) {
			return value;
		}
		if (event.currentCol.xType === "fileuploadfield"
				|| event.currentCol.xType === "combo"
				|| event.currentCol.xType === "multipleCombo"//add by xl; bizaiyi 20160819 合入
				|| event.currentCol.xType === "treepanel") {
			var currentCol = event.currentCol;
			var text = event.currentRow[lclc.grid.DataGrid.PREFIXEXPAND
					+ currentCol.name];
			text = text || "";
			if (text.length == 0) {
				return "";
			}
			return "<a title='"+text+"'  href='javascript:void(0)' >&nbsp;" + text + "</a>";
		}
		if (value.length == 0) {
			return "";
		}
		return "<a title='"+value+"'  href='javascript:void(0)' >&nbsp;" + value + "</a>";
	},
	/**
	 * 大文本上的渲染方法
	 */
	_textareaFormat : function(event) {
		var value = event.currentValue || "";
		return '<span  >' + value
				+ ' <font  style="float: right;">...</font></span>';
	},
	/**
	 * 引用关联的渲染方法
	 */
	_SNAMEFormat : function(event) {
		var currentCol = event.currentCol;
		var text = event.currentRow[lclc.grid.DataGrid.PREFIXEXPAND
				+ currentCol.name];
		text = text || "";
		// 带 **COLOR** 的是需要处理背景颜色的
		var tempColor=event.currentRow[currentCol.name];
		if(tempColor && tempColor.substring(0,9)=="**COLOR**" ){
		 	return "<div  style='background-color:"+tempColor.substring(9,tempColor.length)+"; width:100%'>&nbsp;</div>";
		}
		return "<div title=\""+text+"\"  style='cursor: hand;width:100%'>&nbsp;" + text + "</div>";
	},
	_check_leaf:function(event){
		if (event.currentRow["_isleaf"] == true || event.currentRow["ISLEAF"] == 0)
			return "";
		else {
			return '<input type="checkbox" ' + (event.currentValue == this._checkvalue ? 'checked' 	: '') + ' style="margin-top:3px">';
		}
	 },
	_numberFormat : function(event) {
		if (event.currentRow[event.currentCol.name] == null) {
			return '<span title="" ></span>';
		}
		if (event.currentValue != "NaN") {
			return '<span title="' + event.currentValue + '" >'
					+ event.currentValue + '</span>';
		} else {
			return '<span title="" ></span>';
		}
	},
	/**
	 * 文件上传等关联的渲染方法
	 */
	_fileuploadfieldFormat : function(event) {
		var currentCol = event.currentCol; // 当前列
		var text = event.currentRow[lclc.grid.DataGrid.PREFIXEXPAND + currentCol.name];
		//var items="<img src='style/default/images/icon/upload.png' style='clear: both; display: block; margin:auto;'> ";
		var items="<a href='javascript:void(0)' style='display:block;text-align:center;'>上传</a>";
		var del = "|<a href='javascript:void(0)' >删除</a>";
		text = text || "";
		if (text.length > 0){
			if(currentCol.oldEdit==false){
				del = "";
			}
			return  "<a href='javascript:void(0)' >下载</a>"  + del + "|"+ text;
		}else{
			if(currentCol.oldEdit==true){
				return  items;
			}
		}
	},
	// /上传文件
	_dataTable_cellfileuploadfield : function(input, currentRow, currentCol,
			type) {
		var me = this;
		var extProp = currentCol.extProp || {};
		var limitColumn = currentCol.columnID;
		var uploadFileUrl = currentCol.uploadFileUrl 	|| lclc.grid.DataGrid.UPLOADFILEURL;
		function uploadFile(attachmentContainer, limitColumn, limitSize, storeFilePath) {
			var data_url=uploadFileUrl;
			if (limitColumn != null) {
				data_url += "&limitColumn=" + limitColumn;
			}
			if (limitSize != null) {
				data_url += "&limitSize=" + limitSize;
			}
			if (storeFilePath != null) {
				data_url += "&storeFilePath=" + storeFilePath;
			}
			var fileUpload = {
				tableID : 'uploadfile-dialog',
				fileName : 'uploadfile_input_form_txt',
				file : 'uploadfile-input-form',
				data_url : data_url,
				startBtn : 'lclc_grid_DataGrid_startBtn'
			};
			if($("#"+fileUpload.tableID).length  > 0){
				$("#"+fileUpload.tableID).remove();
			}
		   var render = template.compile(lclc_Modules_uploadFile_html);
		   var uploadFileDialogDivHTML = render(fileUpload);
		   lclc.create({
				xType : "dialog",
				title : "上传文件", // 标题. 默认'提示'
				id : "lclc_grid_DataGrid_FileUpload_window",
				autoOpen : true,
				content : $(uploadFileDialogDivHTML).appendTo(document.body),
				button : [{
							name : "关闭",
							handler : function(obj) {
								lclc.getCmp("lclc_grid_DataGrid_FileUpload_window").close();
								lclc.getCmp("lclc_grid_DataGrid_FileUpload_window").destroy();
								if ($("#" + fileUpload.tableID).length > 0) {
									$("#" + fileUpload.tableID).remove();
								}
							}
						}],

				width : '400px', // 宽度
				height : '200px', // 高度
				maxFlag : false,
				minFlag : false,
				showMin : true,
				isModel : true, // 是否锁屏
				isDrag : false, // 是否支持拖动
				isResize : false, // 是否支持拖动
				dragMinWidth : "300",
				dragMinHeight : "350",
				//style : "blue",
				initFn : function(obj) {

				},
				closeFn : function(dialog) {
					dialog.close();
					dialog.destroy();
					if ($("#" + fileUpload.tableID).length > 0) {
						$("#" + fileUpload.tableID).remove();
					}
				}
			});
			lclc.require("placeholder");
			$("#uploadfile_input_form_txt").placeholder().blur();
			$('#lclc_grid_DataGrid_closeBtn').click(function() {
						var dialog = lclc.getCmp("lclc_grid_DataGrid_FileUpload_window");
						dialog.close();
						dialog.destroy();
						if ($("#" + fileUpload.tableID).length > 0) {
							$("#" + fileUpload.tableID).remove();
						}
					}).focus();
			$('#uploadfile-input-form').fileupload({
				dataType : 'json',
				add : function(e, data) {
					var fileName = data.files[0].name;
					$("#uploadfile_input_form_txt").val(fileName);
					$("#lclc_grid_DataGrid_startBtn").unbind("click");
					$("#lclc_grid_DataGrid_startBtn").attr("disabled", false).click(function() {
								$(this).text('上传文件中...');
								data.submit();
								$("#lclc_grid_DataGrid_startBtn").attr("disabled", true);
							}).text('开始上传');

				},
				done : function(e, data) {
					$("#lclc_grid_DataGrid_startBtn").attr("disabled", false);
					if (data.result.success == true) {
						attachmentContainer.trigger(
								"Event.AttachmentUploadSuccess", [
										data.result.attachmentID,
										data.result.attachmentName]);
						var dialog = lclc.getCmp("lclc_grid_DataGrid_FileUpload_window");
						dialog.close();
						dialog.destroy();
						if ($("#" + fileUpload.tableID).length > 0) {
							$("#" + fileUpload.tableID).remove();
						}
						return;
					} else {
						lclc.Msg.alert(data.result.erroInfo);
						$("#lclc_grid_DataGrid_startBtn").text('请重新选择文件');
						return;
					}

				}
			});
		}
		$(input).unbind("Event.AttachmentUploadSuccess");
		$(input).bind("Event.AttachmentUploadSuccess",
				function(event, attachmentID, attachmentName) {
					var data = {};
					data[lclc.grid.DataGrid.PREFIXEXPAND + currentCol.name] = attachmentName;
					data[currentCol.name] = attachmentID;
					me.updateRow(data, currentRow._locationposition);
				});
		uploadFile($(input),limitColumn, extProp.limitSize);
	},

	toString : function() {
		return "lclc.grid.DataGrid";
	},
	// 添加事件
	addListener : function(eventName, fn, col) {
		if (col) {
			lclc.EventManager.addEventListener({
						eventType : col.name + "@" + eventName,
						handler : fn,
						target : this
					});
		} else {
			lclc.EventManager.addEventListener({
						eventType : eventName,
						handler : fn,
						target : this
					});
		}
	},
	removeListener : function(eventName, handler, col) {
		var selector = null;
		if (!col)
			selector = eventName;
		else
			selector = col + '@' + eventName;
		lclc.EventManager.removeEventListener({
					eventType : selector,
					handler : handler,
					target : this
				});
	},
	// 增加邦定列等
	initPlugin : function() {
		// 先判断是什么表
		if (this.setting.isExpression == true  &&  this.getIsExpression() == true) {
			lclc.require(["grid_ux"]);
			if (this.isGroupTable() && this.setting.plugins.length  == 0 ) {
				this.setting.plugins = [lclc.DataTableGroupColsExpression];
			} else {
				this.setting.plugins = [lclc.DataTableNormalColsExpression];
			}
		}
		var components = this.setting.plugins;
		for (var i = 0; i < components.length; i++) {
			if ($.type(components[i]) === "function") {
				var comp = new components[i]();
				if ("init" in comp) {
					comp.init(this);
				} else {
					lclc.Logger.info("插件 error " + comp.toString());
				}
			}
		}
	},
		/**
	 * 批量计算列间公式
	 */
	batchCalculateExp : function(){
		lclc.require(["grid_ux"]);
		/*
		 * formulaList（{forComCol:[colName], refColumn:[colName1,colName2,...]}）
		 * refColumn : 修改这些列的值，会触发公式，从而影响到forComCol列的值
		 */
		var url = this.setting.basePath + lclc.DataTableNormalColsExpression.BATCHCALCULATEEXP;
		var refColumn = this.setting.formulaList["refColumn"];
		var refDatas = [];//所有能触发公式的行
		var allUpdateValues = this.getChangedData().updateValues || [];
		allUpdateValues = allUpdateValues.concat( this.getChangedData().insertValues || []);
		for (var i = 0; i < allUpdateValues.length; i++) {//遍历所有行
			//当前行
			var cRow = allUpdateValues[i];
			for (var j = 0; j < refColumn.length; j++) {
				if(cRow.hasOwnProperty(refColumn[j])){//当前修改的行有能触发公式的列
					refDatas.push(cRow);
					break;
				}
			}
		}
		var params = {};
		params["tableID"] = this.setting.tableID;
		params["rows"] = lclc.JSON.stringify(refDatas);
		var me = this;
		$.ajax({
			url : url,
			type : 'post',
			cache : false,
			data : params,
			dataType : 'json',
			async : false,
			success : function(json) {
				// 后台返回的参数
				if (Object.prototype.toString.apply(json) === "[object Object]" ||
						Object.prototype.toString.apply(json) === "[object Array]") {
					if (json.successFlag == false) {
						alert(json.errMsg);
						return;
					} else if (json.successFlag == true) {
						json = json.result;
					}
					if(!json){
						alert("公式计算返回结果为空！");
						return;
					}
					var newDatas = json;
					if(!$.isArray(newDatas)){
						newDatas = [newDatas];
					}
					//非合计行公式计算
					for (var i = 0; i < newDatas.length; i++) {
						var oData = refDatas[i];
						var nData = newDatas[i];
						for(nCol in nData){
							var od = isNaN(oData[nCol]||0) ==true ? 0.0 : parseFloat(oData[nCol]||0)
							var nd = isNaN(nData[nCol]||0) ==true ? 0.0 : parseFloat(nData[nCol]||0)
							oData[nCol] = od+nd;
						}
					}
					me.updateRows(refDatas);

					//处理首行合计
					if (newDatas && newDatas.length > 0) {
						var firstData = {};
						for (var k = 0; k < newDatas.length; k++) {
							$.extend(firstData, newDatas[k]);
						}
						for (colName in firstData) {
							me.sumCols(colName);
						}
					}
				}else{
						alert("公式计算返回结果有误！");
				}
			}
		});
	},
	/**
	 * 重新计算当前列合计值
	 * @param {} colName
	 */
	sumCols : function(colName) {
		if(!colName){
			return;
		}
		var tc = new Object();
		tc["name"] = colName;
		var tempCol = this.queryColumn(tc);
		if (tempCol.length == 0) {
			return;
		}
		var col = tempCol[0];
		if (this.setting.headTotal && col.sum == true) {
			var tempRow = this.queryData({
						_sortid : 0
					});
			if (tempRow.length < 0) {
				return;
			}
			tempRow = tempRow[0];
			//记录第一次加载的合计行信息
			if(this.setting.selectRowSumCols){
				if(tempRow && !this.setting.tempflag){
					this.setting.tempheadTotal=JSON.stringify(tempRow);
					this.setting.tempheadTotal=JSON.parse(this.setting.tempheadTotal);
				    this.setting.tempflag=true;
				}
			}
			var currentValue = tempRow[col.nathis] == null
					? 0.00
					: tempRow[col.name];
			currentValue = isNaN(currentValue) == true
					? 0.00
					: parseFloat(currentValue);

			var oriSum = 0,allDatas;
			if(this.setting.selectRowSumCols){
				allDatas= this.getSelectedRows();
				//当表数据没有选中,按照第一次记录的合计信息进行对合计行赋值
				if(allDatas.length==0){
					allDatas=  [this.setting.tempheadTotal];

				}
			}else{
				allDatas= this.queryData();
			}
			for (var j = 0; j < allDatas.length; j++) {
				if(!this.setting.selectRowSumCols ){
					if(j==0){continue;}
				}
				var cRow = allDatas[j];
				if (cRow["INCREMENTFLAG"] == 3 || cRow["INCREMENTFLAG"] == 4){//如果是增量行，不计算
					continue;
				}
				oriSum = lclc.tools.accAdd(oriSum, allDatas[j][colName] || 0);
			}
			var tempData = {};
			tempData["_sortid"] = 0;
			tempData[col.name] = oriSum;
			this._updateRowBySort(tempData);
		}
		this.setting.dataTable.reflashdata();
	},
	getIsExpression : function() {
		var refForComCol = this.queryColumn({
					refForComCol : true
				});
		if (refForComCol.length > 0) {
			return true;
		}
		var sum = this.queryColumn({
					sum : true
				});
		if (sum.length > 0) {
			return true;
		}
		return false;

	},
	/*
	 * 判断是否是浮动表
	 */
	isGroupTable : function() {
		if (this.setting.cols) {
			for (var i = 0; i < this.setting.cols.length; i++) {
				if ($.isArray(this.setting.cols[i]["columns"])) {
					return true;
				}
			}
		}
		return false;
	},
	/**
	 * 分组信息显示面板
	 * groupColSetting：总分组信息（不一定是当前显示的）
	 * fn ：回调函数
	 */
	showGroupDlg : function(groupColSetting, fn) {
		if (groupColSetting) {
			if ($.type(groupColSetting) === "function") {
				fn = groupColSetting;
				groupColSetting = null;
			}
		}
		if (groupColSetting && !$.isPlainObject(groupColSetting) && !$.isArray(groupColSetting)) {
			alert("showGroupDlg()参数格式不正确！");
			return;
		}
		if (groupColSetting && $.isPlainObject(groupColSetting)) {
			groupColSetting = [groupColSetting];
		}

		if(!this.isGroupTable() && groupColSetting==null){
			alert("请先在录入页面设置进行分组设置！");
			return;
		}
		var me = this;
		var groupDiv = '<div id="groupOutDiv_' + this.id + '" style="height:98%;overflow: auto;">' +
				'<table style="border:1;border:1px solid #ccc;cellspacing="0" cellpadding="0";">' +
				'<tbody id="groupTab'+this.id+'"></tbody></table></div>';
		var h = document.body.clientHeight * 0.5;
		var w = document.body.clientWidth * 0.5;
		w = 520;
		h = 335;
		var groupDlg = {
			xType : "dialog",
			id : 'groupDiv_' + this.id,
			content : groupDiv,
			isModel : true, // 是否锁屏
			isDrag : true, // 是否支持拖动
			isResize : true,
			width : w,
			height : h,
			style : "white",
			title : "分组信息",
			closeFn : function(e) {
				e.close();
			},
			initFn : function(e){
				var dlgDiv = $("#groupOutDiv_" + me.id);
				if(groupColSetting){//如果有自定义的分组信息
					var dataGridConf = me.getGrid();
					if(!me.groupColsInfo){//如果没有上次设置过的分组信息，第一次点击按钮进来
						me.groupColsInfo = $.extend([], dataGridConf.groupColumnsList);
						me.groupColsInfoTmp = $.extend([], dataGridConf.groupColumnsList);
					}
					dataGridConf.groupColumnsList = groupColSetting;
					//给setReadCellColor方法，设置合计行颜色使用
					me.setting.groupCols = groupColSetting;
					me.setGrid(dataGridConf);
				}
				if(!me.groupColsInfo){//如果没有上次设置过的分组信息，第一次点击按钮进来
					var groupCols = me.getGrid().groupColumnsList;
					me.groupColsInfo = $.extend([], groupCols);
					me.groupColsInfoTmp = $.extend([], groupCols);
				}
				me._drawGroupTab();
			},
			button : [{
						name : "新 增",
						handler : function(e) {
							me._insertGroupInfo();
						}
					}, {
						name : "删 除",
						handler : function(e) {
							me._delGroupInfo($("input:checkbox[id*='groupChk']:checked"));
						}
					}, {
						name : "确 定",
						handler : function(e) {
							me._setGroupInfo();
							// 处理回调方法。
							if (fn && $.type(fn) === "function") {
								var params = [];
								params.push(me.groupColsInfo);
								params.push(e);
								fn.apply(me, params);
							}
							e.close();
						}
					}, {
						name : "关 闭",
						handler : function(e) {
							//不确定就关闭，则将窗口临时设置的分组信息记录为表格目前执行的分组信息
							me.groupColsInfoTmp = me.groupColsInfo;
							e.close();
						}
					}]
		}
		lclc.create(groupDlg);
	},
	_drawGroupTab : function(){
		var groupTab = $("#groupTab"+this.id);
		var groupCols = this.groupColsInfo;
		groupTab.empty();
		var titleTr = '<tr style="background:#D0E9FF; height:60px; color:#16558b; font-size:14px;\">';
		titleTr+='<th style="border-right: 1px solid #ccc;border-bottom: 1px solid #ccc; width:70px;">&nbsp;</th>';
		titleTr+='<th style="border-right: 1px solid #ccc;border-bottom: 1px solid #ccc; width:220px;">分组列</th>';
		titleTr+='<th style="border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; width:100px;">排序</th>';
		titleTr+='<th style="border-bottom: 1px solid #ccc;width:70px;">&nbsp;</th></tr>';
		groupTab.append(titleTr);
		for(var i=0;i<groupCols.length;i++){
			this._insertGroupInfoTr(groupCols[i]);
		}
	},
	_insertGroupInfoTr : function(groupPo){
		var i = groupPo["orderID"];
		var groupTab = $("#groupTab"+this.id);
		var isasc = groupPo["isasc"]==null?1:groupPo["isasc"];
		var groupSel = "<select id='groupSel_"+this.id+"_"+i+"'  style='width:200px;margin:0 10px;'>";
		groupSel+="<option value='"+groupPo["columnID"]+"'>" +groupPo["name"]+"</option>";
		groupSel+="</select>";
		var sortSel = "<select id='sortSel"+this.id+"_"+i+"'>";
		var sortSel1 = isasc==1?'selected' : '';
		var sortSel0 = isasc==0?'selected' : '';
		sortSel+="<option value='1' "+sortSel1+">升序</option>";
		sortSel+="<option value='0' "+sortSel0+">降序</option>";
		sortSel+="</select>";

		var rowHtml = '<tr id="groupTr_'+groupPo["orderID"]+'" style="background:rgb(244, 250, 249); height:40px; color:#000;">' +
				'<th sellpal style="border-right: 1px solid #ccc;border-bottom: 1px solid #ccc; width:70px;" >' +
				'<input id="groupChk_'+groupPo["orderID"]+'" type="checkbox" value="'+groupPo["orderID"]+'" style="width:15px; height:15px;"/></th>' +
				'<th style="border-right: 1px solid #ccc;border-bottom: 1px solid #ccc; width:200px; ">'+groupSel+'</th>' +
				'<th style="border-right: 1px solid #ccc; border-bottom: 1px solid #ccc; width:100px;">'+sortSel+'</th>' +
				'<th style="border-bottom: 1px solid #ccc; width:70px;">' +
				'<input id="upBtn'+this.id+'_'+i+'" type="button"  style="width:20px; height:20px; background:url(images/public/up.png) #BECBF2  center center;background-size:cover; border:0;">' +
				'<input id="downBtn'+this.id+'_'+i+'" type="button" value="" style="width:20px; height:20px; margin-left:10px; background:url(images/public/down.png) #BECBF2  center center;background-size:cover; border:0;" >' +
				'</th></tr>';
		groupTab.append(rowHtml);
		var me = this;
		$("#groupSel_"+this.id+"_"+i).on("mousedown", function(){
			me._groupSelClick(this);
		});
		$("#groupSel_"+this.id+"_"+i).on("change", function(){
			me._groupSelected(this,arguments);
		});
		$("#upBtn"+this.id+"_"+i).on("click", function(){
			me._moveGroupRow("up",this,arguments);
		});
		$("#downBtn"+this.id+"_"+i).on("click", function(){
			me._moveGroupRow("down",this,arguments);
		});
	},
	_setGroupInfo : function(){
		//先重新记录一下当前分组窗口设定的临时分组信息 ：this.groupColsInfoTmp
		this._setGroupInfoTmp();
		//将当前分组窗口设定的临时分组信息记录下来：this.groupColsInfo
		this.groupColsInfo = $.extend([],this.groupColsInfoTmp);

		//继续记录设定的分组信息
		//给setReadCellColor方法，设置合计行颜色使用
		this.setting.groupCols = $.extend([],this.groupColsInfo)

		//将分组信息设定在grid里
		var dataGridConf = this.getGrid();
		dataGridConf.groupColumnsList = this.groupColsInfo;
		this.setGrid(dataGridConf);

		//为lclc.create(setting)重新处理一下setting
		this.setting = this.adapter.getDefine(this.setting);

	},
	/**
	 * 记录当前分组窗口设定的临时分组信息 ：this.groupColsInfoTmp
	 */
	_setGroupInfoTmp : function(){
		var groupSels = $("select[id*='groupSel']");//分组窗口里显示的分组单元格集合
		var sortSels = $("select[id*='sortSel']");//分组窗口里显示的排序单元格集合
		var groupCols = this.getGrid().groupColumnsList;//表格中正在执行的分组信息
		this.groupColsInfoTmp = [];//当前分组窗口设置的分组信息
		if (groupSels && sortSels && groupSels.length > 0 && sortSels.length > 0) {
			for (var i = 0; i < groupSels.length; i++) {
				(function(groupColsInfoTmp, groupPos){
					if(groupPos && groupPos.length>1){
						alert("同一列不能定义多次分组！");
						return;
					}
					if(groupPos && groupPos[0]){
						var groupPo = groupPos[0];
						groupPo["isasc"] = sortSels[i].value;
						groupPo["orderID"] = i+1;
						groupColsInfoTmp.push(groupPo);
					}
				})(this.groupColsInfoTmp, lclc.tools.query({"columnID" : groupSels[i].value},groupCols));
			}
		}
	},
	_moveGroupRow : function(flag, btn, args) {
		var $curTr = $(btn.parentNode.parentNode);
		if (flag == "up") {
			var $prevTr = $curTr.prev();
			if (!$prevTr || $prevTr.prop("id") == "") {
				return;
			}
			$prevTr.insertAfter($curTr);
		} else if (flag == "down") {
			var $nextTr = $curTr.next()
			if (!$nextTr) {
				return;
			}
			$curTr.insertAfter($nextTr);
		}
		this._setGroupInfoTmp();
	},
	_groupSelClick : function(sel) {
		var showOptions = this._groupMinus(this.getGrid().groupColumnsList,
				this.groupColsInfoTmp);
		if (!showOptions || showOptions.length == 0) {
			return;
		}
		var currentOpt = $("#"+sel.id+" option:checked")[0];
		$(sel).empty();
		$(sel).append(currentOpt);
		for (var i = 0; i < showOptions.length; i++) {
			$(sel).append("<option value='"+showOptions[i]["columnID"]+"'>" +showOptions[i]["name"]+"</option>");
		}
	},
	_groupSelected : function(sel,args){
		this._setGroupInfoTmp();
	},
	/**
	 * 在分组窗口新增一行分组行
	 */
	_insertGroupInfo : function(){
		//判断是否还有可新增的分组行
		var showOptions = this._groupMinus(this.getGrid().groupColumnsList, this.groupColsInfoTmp);
		if(showOptions && showOptions.length==0){
			alert("没有可以新增的分组列！");
			return;
		}
		//在窗口最下新增一行分组行设置
		this._insertGroupInfoTr(showOptions[0]);
		//重新记录当前窗口分组临时设置信息 ：this.groupColsInfoTmp
		this._setGroupInfoTmp();
	},
	/**
	 * 删除分组窗口所选的分组信息行
	 * @param {} selArr : 所选的分组信息行
	 */
	_delGroupInfo : function(selArr){
		var me = this;
		if(selArr && selArr.length>0){
			$.each(selArr, function(idx, sel){
				var groupTr = $("#groupTr_"+$(sel).val());
				groupTr.empty();
				groupTr.remove();
			});
			//重新记录当前窗口分组临时设置信息 ：this.groupColsInfoTmp
			this._setGroupInfoTmp();
		}else{
			alert("请选择要删除的分组信息！");
			return;
		}
	},
	/**
	 * 计算差集
	 * @param {} a 被减集合
	 * @param {} b 减数集合
	 * @return {} 结果集
	 */
	_groupMinus : function(a, b) {
		var result = [];
		for (var i = 0; i < a.length; i++) {
			var flag = true;
			for (var j = 0; j < b.length; j++) {
				if (a[i]["columnID"] == b[j]["columnID"]){
					flag = false;
					break;
				}
			}
			if (flag){
				result.push(a[i]);
			}
		}
		return result;
	},
	/**
	 * 获取分组信息面板设置后的分组信息
	 */
	getGroupInfo : function(){
		return this.groupColsInfo;
	},
	/**
	 * 重新从后台加载数据
	 */
	reloadData : function(fn, pageInfo) {
		if ($.type(this.setting.loadDataTip) === 'string'
				&& this.setting.loadDataTip.length > 0) {
			this.showShade(this.setting.loadDataTip,this.setting.id || this.setting.gridId);
		}
		// 异步初始化
		var url = this.setting.basePath + this.setting.getDataPath;
		var setting = this.setting;
		var me = this;
		var newEvent = new lclc.grid.DataGridEvent({
					eventElement : this,
					eventType : lclc.BaseEvent.eventType.BEFORELOADDATA,
					lclcDataTable : this,
					async : false,
					ltDataTable : this.setting.dataTable
				});
		lclc.EventManager.dispatchEvent(newEvent);
		var config = this._getPanelConfig();
		var grid = this.getGrid();
		grid.extProperties = grid.extProperties || {};
		grid.extProperties = $.extend(grid.extProperties, this.setting.params);
		grid.pagination = this.setting.pagination;
		if (this.setting.pagination) {
			if (pageInfo != null) {
				grid["pageInfo"] = pageInfo;
			} else {
				grid["pageInfo"] = this.getPagination(config) .getPagination()
			}
		}
		if(this.option("collapse")== true){
        	this._collapse();
        }
		lclc.pubAjax({
					url : url,
					type : 'post',
					cache : false,
					async : this.setting.asyncAutoLoad,
					data : {
						"grid" : lclc.JSON.stringify(grid)
					},
					dataType : 'json',
					complete : function() {
						if (me.setting && $.type(me.setting.loadDataTip) === 'string'
								&& me.setting.loadDataTip.length > 0) {
							me.hideShade(me.setting.loadDataTip,me.setting.id || me.setting.gridId);
						}
					},
					success : function(_setting) {
						if (setting.pagination) {
							me.getPagination(config) .resetTotalCount(_setting.total);
						}
						_setting = me.adapter.getGridRecordData(_setting);
						if (setting == null || setting.me == null) {
							return;
						}
						if ($.type(setting.callback.Comparable) === 'function') {
							var newData = lclc.tools.toJSON(_setting.columns,
									_setting.datas);
							newData.sort(setting.callback.Comparable);
							_setting.datas = lclc.tools.toARRAY(_setting.columns, 	newData);

						}
						// 后台返回的参数 setting.recordset.datas
						var recordset = new Ext.lt.recordset({
									columns : _setting.columns,
									datas : _setting.datas,
									compress : _setting.compress
								});

						newEvent.eventType = lclc.BaseEvent.eventType.LOADDATA;

						// 处理回调方法。
						if (jQuery.type(fn) === "function") {
							fn.apply(setting.me, [recordset, _setting]);
							lclc.EventManager.dispatchEvent(newEvent);
						}
						// 处理全部默认选中
						if (setting.defalutChecked != null) {
							var rs = recordset.toArray();
							if ($.type(setting.defalutChecked) == "boolean") {
								for (var i = 0; i < rs.length; i++) {
									if (setting.defalutChecked == true) {
										rs[i].check = 1;
									} else {
										rs[i].check = 0;

									}
								}
							} else if ($.type(setting.defalutChecked) == "object") {
								for (var i = 0; i < rs.length; i++) {
									var tempData = lclc.tools.query( setting.defalutChecked, [rs[i]])
									if (tempData.length == 1) {
										rs[i].check = 1;
									} else {
										rs[i].check = 0;

									}
								}

							}
						}
						me._autoSetHeight(_setting.datas.length);
						setting.dataTable.setRecordset(recordset);
						var tableDatas = recordset.toArray();
						// 判断C_STATUS=1的数据，设置为新增数据
						if(tableDatas && tableDatas.size>0){
							for (var i = 0; i <  tableDatas.length; i++ ) {
								if (tableDatas[i]['C_STATUS'] == '1') {
									setting.dataTable.addNewData(tableDatas[i]);
								}
							}

						}
						setting.me.delList = new Array();
						newEvent.eventType = "beforDrawByLoad";
						lclc.EventManager.dispatchEvent(newEvent);
						if(!me.jqueryObj.is(':hidden')){
							setting.dataTable.redraw();
						}
						if(setting.headTotal && setting.selectRowSumCols){
							me._selectRowSumCols();
						}
						newEvent.eventType = lclc.BaseEvent.eventType.LOADDATA;
						lclc.EventManager.dispatchEvent(newEvent);
						if(setting.pageInfo && setting.pageInfo.callback && $.type(setting.pageInfo.callback.afterChangePage)==='function'){
							setting.pageInfo.callback.afterChangePage.apply(setting, [me.getPagination(config)]);
						}
					}
				});
	},
	// 查询例
	queryColumn : function(fql) {
		var element = null;
		if (this.setting.dataTable) {
			element = this.setting.dataTable.getAllCols();
			if (element == null || element.length == 0) {
				element = this.setting.cols;
			}
		} else {
			element = this.setting.cols;
		}
		if (!fql) {
			return element;
		}
		if (!$.isPlainObject(fql)) {
			return null;
		}
		if ($.isEmptyObject(fql)) {
			return element;
		}

		var list = new Array();
		for (var i = 0; i < element.length; i++) {
			var e = element[i];
			var temp_e = lclc.tools.queryContain(fql, e);
			if (temp_e) {
				list.push(temp_e);
			}
		}
		return list;
	},

	// 查询数据
	queryData : function(fql) {
		if (!fql) {
			return this.setting.dataTable.getRecordSet().query({});
		}
		if (!$.isPlainObject(fql)) {
			return null;
		}
		return this.setting.dataTable.getRecordSet().query($.extend(true, {}, fql));
	},

	drawTable : function(gridSetting) {
		if ($.isEmptyObject(gridSetting)) {
			gridSetting = this.setting;
		}
		this._mergeSting(gridSetting);
		lclc.grid.DataGrid.superclass.constructor.call(this, this.setting);
		this.init(gridSetting);
		this.initGrid(this.setting);
		/*
		 * // 创建表 if (!this.setting.localConfigration) {// 这个方法有什么卵用？啊？治国？ if
		 * (!this.setting.isAsync || !this.setting.asyncAutoLoad) {
		 * this.initGridByNotAsync(this.setting); } else {
		 * this.initGridByAsync(this.setting); } } else { // /??? }
		 */
	},


	// 重新渲染数据区
	redrawTable : function(params) {
		this.setting.dataTable.reflash();
	},

	// 重新加载数据,数据为传入的数据
	reloadTableData : function(array, columns) {
		if (!$.isArray(array)) {
			return;
		}
		var oldRecordset = null;
		if (this.setting.dataTable) {
			oldRecordset = this.setting.dataTable.getRecordSet();
		}
		var oldRecordset;

		oldRecordset = oldRecordset || {};
		var c = null;
		if (!$.isArray(columns)) {
			c = oldRecordset.getColNames();
		} else {
			c = columns;
		}
		if (!$.isArray(array[0])) {
			array = lclc.tools.toARRAY(c, array);
		}

		var recordset = Ext.lt.recordset({
					compress : oldRecordset.compress,
					columns : c,
					datas : array
				});
		this.setting.dataTable.setRecordset(recordset);
		this.redrawTable();
		debug("重新加载数据：" + array.length + " 条");
	},
	/**
	 * 自动设置高度，设置的原理，根据传来的n 计算需要的高度
	 *
	 * @param {}
	 *            n 当前一共有多少条数据
	 */
    _autoSetHeight : function(n) {
		if (this.setting.autoHeight == null || this.setting.autoHeight == false) {
			return;
		}
		if (n == null && this.isDraw ) {
			n = this.getTotalSize();
		}
		n = n || 0;
		var needHeight =(this.adapter.maxColumnLevel + n+3 + (this.option("headTotal")==true?1:0)) * 30 ;
		var config=this._getPanelConfig();
		if ( needHeight  < this.defaultHeight) {
				$(this.getContentPanel(config)).height(needHeight);
				this.setting.dataTable.resize(this.getContentWidth()-2, needHeight -2);
		}else{
			 	$(this.getContentPanel(config)).height( this.defaultHeight);
			 	this.setting.dataTable.resize(this.getContentWidth()-2,  this.defaultHeight -2);
		}

    },
	_getPrimarykey : function() {
		var k = this.queryColumn({
					"iskey" : true
				});
		return k;
	},
	_getLogicKey : function() {
		var k = this.queryColumn({
					"isLogicKey" : true
				});
		return k;
	},
	// 清空所有的编辑过元数据
	emptyChangedData : function() {
		this.delList = new Array();
		this.setting.dataTable.setRecordset(this.setting.dataTable .getRecordset());
	},
	_processNormal : function(list) {
		var temList = new Array();
		for (var index = 0; index < list.length; index++) {
			var ojb = {};
			var tempData = list[index];
			var updateOjb = {};
			for (var a in tempData) {
				if (!this.isPrefixExpand(a)) {
					updateOjb[a] = tempData[a];
				}
			}
			temList.push(updateOjb);
		}
		return temList;
	},

	// 得到所有的编辑过元数据
	getChangedData : function() {
		var update = this.getEditTableData();
		var temList = null;
		if (update) {
			temList = this._processNormal(update);
		}
		var insert = this.getInsertTableData();
		var insertValues = this._processNormal(insert);
		var del = this.getDelTableData();
		
		var deleteValues = this._processNormal(del);
		var opradata = {
			businessObj : this.setting.tableId,
			// businessObj : this.setting.params.businessID, 
			dbName : this.setting.dbName,
			dealtype : this.setting.dealtype,
			changedValues : {
				updateValues : temList,
				deleteValues : deleteValues,
				insertValues : insertValues
			}
		};

		opradata = this.analyseKey(opradata);

		return this.adapter .getSubmitByBusinessObjForm(opradata, this.getGrid());

	},
	analyseKey : function(opradata) {
		if (this.setting.analyseKey == null || this.setting.analyseKey == "") {
			return opradata;
		}
		var keys = [], il = [], ul = [], data = [];
		if (this.setting.analyseKey.toLowerCase() == "iskey") {
			data = data.concat(opradata.changedValues.insertValues);
			data = data.concat(this.getEditTableData(true));
			keys = keys.concat(this._getPrimarykey());
		} else if (this.setting.analyseKey.toLowerCase() == "islogickey") {
			data = data.concat(opradata.changedValues.insertValues);
			data = data.concat(this.getEditTableData(true));
			keys = keys.concat(this._getLogicKey());
		} else if (this.setting.analyseKey.toLowerCase() == "all") {
			data = data.concat(opradata.changedValues.insertValues);
			data = data.concat(this.getEditTableData(true));
			keys = keys.concat(this._getPrimarykey());
			keys = keys.concat(this._getLogicKey());
		} else if (this.setting.analyseKey.toLowerCase() == "c_status") {
			// 根据状态
			data = this.queryData();
			if (this.option("isExpression") == true
					&& this.option("headTotal") == true) {
				var tempList = [];
				for (var i = 0; i < data.length; i++) {
					if (data[i]["_sortid"] != 0) {
						tempList.push(data[i]);
					}
				}
				data = tempList;
				tempList = null;
			}

		} else {
			// 默认处理
			return opradata;
		}
		if (this.setting.analyseKey.toLowerCase() == "c_status") {
			if (this.setting.getAllUpdate) {
				for (var i = 0; i < data.length; i++) {
					if (data[i]["C_STATUS"] == 2) {
						ul.push(data[i]);
					}
				}
				opradata.changedValues.updateValues = this._processNormal(ul);
			} 
			return opradata;
		/*
		 * var realUpdateData = this.getEditTableData(); // 得到主键 var pk =
		 * this._getPrimarykey(); for (var i = 0; i < data.length; i++) { if
		 * (data[i]["C_STATUS"] == 1) { il.push(data[i]); } else if
		 * (data[i]["C_STATUS"] == 2 && this.setting.getAllUpdate) {
		 * ul.push(data[i]); } else if (data[i]["C_STATUS"] == 2 &&
		 * this.setting.getAllUpdate == false) {
		 *//**
						 * 如果当前状态是更新。如果是增加更新。
						 *//*
						 * var fql = {}; for (var ki = 0; ki < pk.length; ki++) {
						 * fql[pk[ki].name] = data[i][pk[ki].name]; }
						 * 
						 * var temp = lclc.tools.query(fql, realUpdateData); //
						 * 说明前台更新过 if (temp.length == 1) { ul.push(temp[0]); }
						 * else { var t_d = new Object(); for (var ki = 0; ki <
						 * pk.length; ki++) { t_d[pk[ki].name] =
						 * data[i][pk[ki].name]; } ul.push(t_d); } } }
						 */

		} else {
			for (var i = 0; i < data.length; i++) {
				if (this.setting.headTotal == true && data[i]["_sortid"] == 0) {
					continue;
				}
				// 判断主键为空表示是新增的
				var isInsert = false;
				for (var k = 0; k < keys.length; k++) {
					if (data[i][keys[k].name] == null) {
						isInsert = true;
						break;
					}
				}
				if (isInsert) {
					il.push(data[i]);
				} else {
					ul.push(data[i]);
				}
			}
		}
		opradata.changedValues.updateValues = this._processNormal(ul);
		opradata.changedValues.insertValues = this._processNormal(il);
		return opradata;
	},
	/**
	 * 修改数据
	 * 
	 * @param {}
	 *            data
	 * @param {}
	 *            line
	 */
	changData : function(data) {
		if (!data) {
			return;
		}
		if ($.isEmptyObject(data)) {
			return;
		}
		if ($.type(data) === "string") {
			data = jQuery.parseJSON(data);
		}
		if (!data.operation) {
			return;
		}
		if ($.isEmptyObject(data.operation)) {
			return;
		}
		var update = data.operation.update;
		if (update) {
			if ($.type(update) === "string") {
				update = jQuery.parseJSON(update);
			}
			if ($.isArray(update)) {
				for (var i = 0; i < update.length; i++) {
					this.updateRow(update[i]);
				}
			}
		}
		var insert = data.operation.insert;
		if (insert) {
			if ($.type(insert) === "string") {
				insert = jQuery.parseJSON(insert);
			}
			if ($.isArray(insert)) {
				for (var j = 0; j < insert.length; j++) {
					this.insertRow(insert[j]);
				}
			}
		}

		var del = data.operation["delete"];
		if (del) {
			if ($.type(del) === "string") {
				del = jQuery.parseJSON(del);
			}
			if ($.isArray(del)) {
				for (var z = 0; z < del.length; z++) {
					this.deleteRow(del[z]);
				}
			}
		}
	},

	// 刷新的方法
	refreshTable : function(params, url) {
		if (this.setting == null) {
			return;
		}
		if (params) {
			if ($.type(params) === "string") {
				url = params;
			}
		}
		if (!$.isPlainObject(params)) {
			params = {};
		}
		if (url && ($.type(url) === "string")) {
			this.setting.getDataPath = url;
		}

		if (params && $.type(params) == "object") {
			$.extend(this.setting.params, params);
		}
		// 刷新分页
		if (this.setting.pagination) {
			var config = this._getPanelConfig();
			this.getPagination(config).resetTotalCount(0);;
		}
		this.reloadData();
	},

	// 得到所有的编辑过元数据
	getEditTableData : function(flag) {
		flag = flag || false;
		var data = this.setting.dataTable.getUpdataData();
		// 得到所有的编辑后的数据
		var o = new Array();
		if (this.setting.getAllUpdate || flag) {
			for (var i = 0; i < data.length; i++) {
				o.push(data[i].nowData);
			}
			return o;
		}
		// 只得到编辑后的数据和主键
		// 得到主键
		var pk = this._getPrimarykey();
		for (var i = 0; i < data.length; i++) {
			if (this.setting.headTotal == true 	&& data[i].nowData["_sortid"] == 0) {
				continue;
			}
			var cols = data[i].cols;
			var temp = {};
			// COPY普通的属性
			for (var j = 0; j < cols.length; j++) {
				temp[cols[j]] = data[i].nowData[cols[j]];
			}
			// COPY 主键
			for (var k = 0; k < pk.length; k++) {
				temp[pk[k].name] = data[i].nowData[pk[k].name];
			}
			o.push(temp);
		}

		return o;
	},

	// 得到所有的新增的数据
	getInsertTableData : function() {
		var o = eval(this.setting.dataTable.getAddData().toJSON());
		var list = [];
		for (var i = 0; i < o.length; i++) {
			if (this.setting.headTotal == true && o[i]["_sortid"] == 0) {
				continue;
			} else {
				list.push(o[i]);
			}
		}
		return list;
	},

	// 得到所有的新增的数据
	getDelTableData : function() {
		return this.delList;
	},
	//批量插入行，最后发事件
	batchInsertRows : function(data) {
		if ($.isArray(data)) {
			for (var i = 0; i < data.length; i++) {
				if (this.setting.headTotal == true) {
					if (this.getTotalSize() == 0) {
						this._insertRow({});
					}
				}
				this._insertRow_(data[i]);
			}
			this._autoSetHeight();
			lclc.EventManager.dispatchEvent(new lclc.grid.DataGridEvent({
						eventElement : this,
						eventType : lclc.grid.DataGrid.ONCHANGEDATA,
						lclcDataTable : this,
						currentRow : data,
						ltDataTable : this.setting.dataTable,
						"changeTyep" : "insert"
					}));
			this.redrawTable();
//			//刷新合计 
//			var numCols = this.getSumColByGrid();
//			for (var key in numCols) {
//				this.sumCols(key);
//			}
		}
	},
	insertRows : function(data) {
		if ($.isArray(data)) {
			for (var i = 0; i < data.length; i++) {
				this._insertRow_(data[i]);
			}
		}
	},
	insertRow : function(data, line, isTotal) { 
		if (this.setting.headTotal == true) {
			if (this.getTotalSize() == 0) { 
				if(isTotal==true){
					this._insertRow(data, line);
					return;
				}
				this._insertRow({});
			}
		}
		var temp = this._insertRow(data, line);
		this._autoSetHeight();
		lclc.EventManager.dispatchEvent(new lclc.grid.DataGridEvent({
					eventElement : this,
					eventType : lclc.grid.DataGrid.ONCHANGEDATA,
					lclcDataTable : this,
					currentRow : data,
					ltDataTable : this.setting.dataTable,
					"changeTyep" : "insert"
				}));
	},

	// 插入新的数据,data,line 行,如果行是空，就在最后插入,要符合龙图的数据要求
	_insertRow : function(data, line) {
		this._insertRow_(data,line);
		this.redrawTable();
	},
	_insertRow_ : function(data, line) {
		if (data._locationposition) {
			if ($.isNumeric(data._locationposition)) {
				line = parseInt(data._locationposition);
			}
		} else if (line) {
			if ($.isNumeric(line)) {
				data._locationposition = line;
			}
		}
		var cols = this.queryColumn();
		var tempdata = {};
		for (var i = 0; i < cols.length; i++) {
			if (cols[i].display == true) {
				if ("defaultValue" in cols[i]) {
					tempdata[cols[i].name] = cols[i].defaultValue;
					if ($.type(cols[i].csId) == "string") {
						tempdata[lclc.grid.DataGrid.PREFIXEXPAND_C + cols[i].name] = cols[i].defaultShowValue;
					}
				} else {
					tempdata[cols[i].name] = null;
					if ($.type(cols[i].csId) == "string") {
						tempdata[lclc.grid.DataGrid.PREFIXEXPAND_C + cols[i].name] = null;
					}
				}
			}
		}
		var colNames = this.setting.dataTable.getRecordSet().getColNames();
		if (colNames.length > 0) {
			for (var i = 0; i < colNames.length; i++) {
				if (!cols[i] in tempdata) {
					tempdata[cols[i]] = null;
				}
			}
		}
		
		// 新增时需要去后台取表的默认值
		if(this.setting.isInsertDefaultData==true){
			var resultData = this.getDefaultData();
			data = $.extend(true,resultData,data);
		}
		if(this.setting.xType=='grid'){
			tempdata = $.extend(tempdata, data ,this.setting.defaultData );
		}else{
			tempdata = $.extend(tempdata, data );
		}
		tempdata["C_STATUS"] = "1";
		this.setting.dataTable.addData(tempdata, line);
	},
	/*
	 * 获取表格的合计列
	 */
	getSumColByGrid : function() {
		var columns = this.setting.cols;// 取列(不包括标题)
		var colMap = new Object();
		$.each(columns, function(i, col) {
					if (col.dataType == "N" && col.sum) {
						colMap[col.columnDBName] = col;
					}
				});
		return colMap;
	}
	,
	/**
	 * 同步获取表的默认值
	 */
	getDefaultData : function() {
		var url = this.setting.getDefaultDataPath;
		if(!url){
			return {};
		}
		var result = lclc.ajax({
					url : url,
					async : false,
					data : {
						tableID : this.setting.tableID
					}
				});
		var relustData = {};
		if (result.status == 200 && result.readyState == 4 && result.responseText) {
			relustData = lclc.JSON.parse(result.responseText);
			if (relustData && relustData.successFlag == false) {
				alert(relustData.errMsg);
				return {};
			} else if (relustData && relustData.successFlag == true) {
				relustData = relustData.result;
			}
		}
		return relustData;
	},
	/**
	 * 初始化浮动表的默认值
	 * 
	 * @param {}
	 *            _setting
	 */
	initDefaultData : function() {
		var me = this;
		if (!this.setting.isInsertDefaultData) {
			return;
		}
		if(!this.setting.tableID){
			return;
		}
		var url = this.setting.getDefaultDataPath;
		lclc.pubAjax({
					url : url,
					async : false,
					data : {
						tableID : me.setting.tableID
					},
					success : function(data) {
						if(data){
							me.setting.defaultData = $.extend(true, data, me.setting.defaultData);
						}
					}
				});
	},
	// 删除选中的数据
	deleteRow : function(data) { 
		this._deleteRow(data);
		this._autoSetHeight();
		lclc.EventManager.dispatchEvent(new lclc.grid.DataGridEvent({
					eventElement : this,
					eventType : lclc.grid.DataGrid.ONCHANGEDATA,
					lclcDataTable : this,
					lastEditRow:data,
					currentRow : null,
					ltDataTable : this.setting.dataTable,
					"changeTyep" : "delete"
				}));
		//刷新合计
//		var numCols = this.getSumColByGrid();
//		for (var key in numCols) {
//			this.sumCols(key);
//		}
	},

	_deleteRow : function(data) {
		var delDatas = [];
		if ($.isArray(data)) {
			for (var i = 0; i < data.length; i++) {
				var delD = this._privateDeleteRow(data[i]);
				if(delD!=null  && delD!=false){
					delDatas.push(delD);
				}else if(delD==false){
					return;
				}
			}
			this.setting.dataTable.removeData(delDatas);
			this.redrawTable();
		} else {
			this.privateDeleteRow(data);
			this.redrawTable();
		}
	},
	privateDeleteRow : function(line) {
		var delData = this._privateDeleteRow(line);
		if(delData!=null && delData!=false){
			this.setting.dataTable.removeData(delData);
		}
	},
	_privateDeleteRow : function(line) {
		var data = {};
		if ($.isNumeric(line)) {
			data._locationposition = line;
		} else if ($.type(line) === "string") {
			data._locationposition = parseInt(line);
		} else {
			data = line;
		}
        if(  data["ROWSECU"] == "2") {
            lclc.Msg.alert("只读行不能删除")
        	return false;
        } 
		if ($.type(data._locationposition) === "number") {
			var delData = {};
			if (data["C_STATUS"]  || data["C_STATUS"] =="0") {
				delData = data;
			}else{
				delData = this.queryData({
							_locationposition : data._locationposition
						});// setting.dataTable.getRecordSet() .getData(line);
				if (delData.length == 0) {
					return;
				} else {
					delData = delData[0];
				}
			}
			/**
			 * 行状态：原始状态（数据库中有值） 0 。 原始状态：数据库中有对应记录 。 修改状态：数据库中有对应记录且被修改 2。
			 * 新增状态：数据库中没有对应元素，新增记录 1 。 删除状态：数据库中有对于元素，直接删除或修改后删除。新增记录后删除不存在删除状态
			 * 3。
			 */
			if (delData["C_STATUS"] != "1") {
				delData["C_STATUS"] == "3";
				if (this.setting.getAllUpdate == false) {
					var pk = this._getPrimarykey();
					var tempData = {};
					for (var pi = 0; pi < pk.length; pi++) {
						tempData[pk[pi].name] = delData[pk[pi].name];
					}
					this.delList.push(tempData);
				} else {
					this.delList.push(lclc.merge({}, delData));
				}

			}
			return delData;
		}
	},
    updateRows:function(data){
    	if(!data){
    		data = this.queryData();
    	}
        var list=[];
        if($.isArray(data)){
           list=data;
        }else{
        	list.push(data);
        }
        for (var i = 0; i < list.length; i++) {
        	this._updateRowBySort(list[i],list[i]._sortid,false);
        }
      this.redrawTable();
    
    }, 
	// 修改数据
	updateRow : function(data, line, flag) {
		flag = flag == null ? true : flag;
		var sortid = parseInt(data._sortid);
		if (line != null ) {
			sortid = line;
		}
		var lastEditRow = this.getDataBySortIndex(sortid);
		var temp = this._updateRow(data, line, flag);
		lclc.EventManager.dispatchEvent(new lclc.grid.DataGridEvent({
					eventElement : this,
					eventType : lclc.grid.DataGrid.ONCHANGEDATA,
					lclcDataTable : this,
					lastEditRow:lastEditRow,
					currentRow : this.getDataBySortIndex(sortid),
					ltDataTable : this.setting.dataTable,
					"changeTyep" : "update"
				}));
	},
	// 修改数据
	_updateRow : function(data, line, flag) {
		if (line == null && $.isNumeric(data._locationposition)) {
			line = parseInt(data._locationposition);
		}
		if (!$.isNumeric(line)) {
			return;
		}
		if ($.isEmptyObject(data)) {
			return;
		}
		var olddata = this.queryData({
					_locationposition : line
				});// setting.dataTable.getRecordSet() .getData(line);
		if (olddata.length == 0) {
			return;
		} else {
			olddata = olddata[0];
		}
		if (olddata["C_STATUS"] != 1) {
			data["C_STATUS"] = "2";
		}
		if (olddata) {
			for (var ar in data) {
				this.setting.dataTable.updateDataBylocaid(line, ar, data[ar]);
			}
			if (flag) {
				this.redrawTable();
			}
		}
	},
	// 修改数据
	updateRowBySort : function(data, line, flag) {
		flag = flag == null ? true : flag;
		var lastEditRow = this.getDataBySortIndex(line);
		var temp = this._updateRowBySort(data, line, flag); 
		lclc.EventManager.dispatchEvent(new lclc.grid.DataGridEvent({
					eventElement : this,
					eventType : lclc.grid.DataGrid.ONCHANGEDATA,
					lclcDataTable : this,
					lastEditRow:lastEditRow,
					currentRow : this.getDataBySortIndex(line),
					ltDataTable : this.setting.dataTable,
					"changeTyep" : "update"
				}));
	},
	// 修改数据
	_updateRowBySort : function(data, line, flag) {
		if (line == null && $.isNumeric(data._sortid)) {
			line = parseInt(data._sortid);
		}
		if (!$.isNumeric(line)) {
			return;
		}
		if ($.isEmptyObject(data)) {
			return;
		}
		var olddata = this.getDataBySortIndex(line);
		if (olddata == null) {
			return;
		}
		if (olddata["C_STATUS"] != 1) {
			data["C_STATUS"] = "2";
		}
		if (olddata) {
			for (var ar in data) {
				this.setting.dataTable.updateData(line, ar, data[ar]);
			}
			if (flag) {
				this.redrawTable();
			}
		}
	}, 
	// 全选
	checkAll : function(flag,groupCols) {
		flag = flag == true ? 1 : 0;
    	$(this.queryData()).each(function(index, data) {
    	    data["check"] = groupCols && data["level"] < groupCols.length - 1 || data["DATAKEY"] == "****" ?0:flag;//分组和合计不选中
        });
		this.redrawTable();
	},
	// 反选
	invertCheck : function(groupCols) {
		$(this.queryData()).each(function(index, data) {
			data.check = !data.check;
			var flag = data.check == true ? 1 : 0;
			data["check"] = groupCols && data["level"] < groupCols.length - 1 || data["DATAKEY"] == "****" ?0:flag;//分组和合计不选中
		});
		this.redrawTable();	
	},
	// 得到选择的数据
	getSelectedRows : function() {
		return this.queryData({
					check : 1
				});
	},

	// 得到所有的数据大小
	getTotalSize : function() {
		return this.setting.dataTable.getRecordSet().size();
	},

	// 得到所有的数据
	getTableData : function() {
		return this.setting.dataTable.getRecordSet().toArray();
	},

	// 得到所有查询参数
	getParams : function() {
		return this.setting.params;
	},
	// 是否显视的方法
	setVisible : function(flag) {
		/*if (flag) {
			$(this.setting.jqueryObj).show();
		} else {
			$(this.setting.jqueryObj).hide();
		}*/
		this._setHidden(!flag);
		if(flag==true){
			this.resizeTable(this.parent.getWidth()-2,this.parent.getHeight()-(this.parent.getTitlePanelHeight()+8));
			this.setting.dataTable.redraw();
		}
		if (this.setting.hasToolbar) {
			this.getToolbar().setVisible(flag);
		}
	},
	// 设置列的可见
	setVisibleColumn : function(col, flag) {
		if ($.type(col) === "string") {
			if (flag) {
				this.setting.dataTable.setDisplayColumn(col);
			} else {
				this.setting.dataTable.setHiddenColumn(col);
			}
		}
	},
	// 得到得数据
	getDataBySortIndex : function(line) {
		if ($.isNumeric(line)) {

		} else if (jQuery.type(line) === "string") {
			line = parseInt(line);
		}
		if (jQuery.type(line) === "number") {
			return this.setting.dataTable.getRecordSet().getData(line);
		}
		return null;
	},
	// 得到得数据
	getDataByIndex : function(line) {
		var data = {};
		if ($.type(line) === 'number') {
			data._locationposition = line;
		} else if (jQuery.type(line) === "string") {
			data._locationposition = parseInt(line);
		}
		if (jQuery.type(data._locationposition) === "number") {
			return this.queryData({
						_locationposition : data._locationposition
					})[0];
		}
	},

	/**
	 * 保存数据到后台
	 */
	saveData : function(params, url, fn) {
		if ($.type(this.setting.saveDataTip) === 'string'
				&& this.setting.saveDataTip.length > 0) {
			this.showShade(this.setting.saveDataTip);
		}
		if (params) {
			if ($.type(params) === "string") {
				if (url) {
					if ($.type(url) === "function") {
						fn = url;
					}
				}
				url = params;
			} else if ($.type(params) === "function") {
				fn = params;
			}
		}

		if (url) {
			if ($.type(url) === "function") {
				fn = url;
			}
		}

		if (!$.isPlainObject(params)) {
			params = {};
		}
		var grid = this.getChangedData();
		params = params || {};
		params = $.extend(true, {}, this.setting.params, params);
		grid.extProperties = grid.extProperties || {};
		grid.extProperties = $.extend(grid.extProperties, params);
		grid.pagination = this.setting.pagination;
		var json = lclc.JSON.stringify(grid);
		if (!($.type(url) === "string")) {
			url = this.setting.saveDataPath;
		}
		if (!url) {
			return;
		}
		url = this.setting.basePath + url;
		var setting = this.setting;
		params["grid"] = json;
		var me = this;
		/*
		 * //return; jQuery.getJSON(url,{}); return;
		 */
		lclc.ajax({
					url : url,
					type : 'post',
					async : true,
					cache : false,
					data : params,
					dataType : 'json',
					success : function(json) {
						if ($.type(me.setting.saveDataTip) === 'string'
								&& me.setting.saveDataTip.length > 0) {
							me.hideShade(me.setting.saveDataTip);
						}
						setting.params.businessObjForm = null;
						lclc.EventManager
								.dispatchEvent(new lclc.grid.DataGridEvent({
									eventElement : setting.me,
									eventType : lclc.BaseEvent.eventType.SAVEDATA,
									lclcDataTable : setting.me,
									ltDataTable : setting.dataTable,
									resultJson : json
								}));
						if (fn) {
							fn.apply(setting.jqueryObj, arguments);
						}else{
							lclc.Msg.alert("保存成功！");
						}
					}
				});
	},
	getPagination : function(config) {
		if (this.setting.pagination == false) {
			return null; 
		}
		config = config || this._getPanelConfig();
		return this.getstatusPanel().tablePagination();
	},
	destroy : function() { 
		if (this.setting == null) {
			return;
		}  
		// 调龙图的destroy
		if (this.option("dataTable")  != null) {
			this.option("dataTable").destory();
		}
		
		var config = this._getPanelConfig();
		var fbar=this.getFootbar(config);
		if (fbar != null) {
			if ($.type(fbar.destroy) == 'function') {
				fbar.destroy();
				this.fbar=null;
			}
		}
		
		if (this.getPagination(config)  != null) {
			this.getPagination(config).destroy();

		}
		// 删除Fbar
	  	lclc.grid.DataGrid.superclass.destroy.call(this);
 
		// 删除当前对象可能会占用大内存的属性

		// me 是当前对象
		this.setting.me = null;
		delete this.setting.me;
		this.delList = null;
		delete this.delList;
		this.setting = null;
		delete this.setting;
		lclc.Logger.info("DataTable is destroy");
	},
	/**
	 * 得到引用字段
	 */
	_queryRelatedIdById : function(columnId) {
		var grid = this.getGrid();
		var relatedCoumnList = grid.relatedCoumnList || {};
		var templist = [];
		var me = this;
		if ($.isArray(relatedCoumnList[columnId])) {
			for(var k in relatedCoumnList[columnId][0]){
				//级联开关是否一对一：1 是，0 否
				if(relatedCoumnList[columnId][0][k] ==1 || arguments.callee.caller.name !="getRelatedData"){
					$([k]).each(function(index, id) {
						$(me.queryColumn({id : id})).each(function(i, col) {
							templist.push(col);
						});
					})
				}
			}
		}
		return templist;
	}
	/**
	 * 这个方法是处理树，文件上传等用的。
	 */
	,
	_processEvent : function(event) {
		if (!event.isSelf) {
			return;
		}
		var srcElement = event.srcElement;
		var me = this;
		var data = {};
		// 当前行
		var currentRow =$.extend({}, event.currentRow);
		// 判断 xType 是 treepanel ，combo 就弹出树
		var currentCol = event.currentCol;
		// 当前值
		var currentValue = event.currentValue;
		var cellobj=event.domobj;   
		// 配链接
		if (currentCol.ishref == true) { 
			if ($.type(this.setting.callback.linkJump) === 'function' && ($.type( currentCol.hrefUrl) != 'string' ||  currentCol.hrefUrl.length == 0 )) {
				
				return this.setting.callback.linkJump(currentRow, currentCol, currentValue);
			}
			return this.jump(currentRow, currentCol, currentValue);
		}
		// 如果是文件上传，如果当前是下载文件，就不做任何的控制
		if (currentCol.xType == "fileuploadfield") {
			if (srcElement.nodeName === 'A' && event.domInnerText === '下载') {
				if (currentValue != null && currentValue.length > 0) {
					var downloadFileUrl = currentCol.downloadFileUrl
							|| lclc.grid.DataGrid.DOWNLOADFILEURL;
					window.open(this.setting.basePath + downloadFileUrl + "&attachmentID=" + currentValue);
					return false;

				}
			}
		}
		// 不可编辑，就不再进行
		if (this.setting.editable == false || currentCol.readOnly == true || currentCol.oldEdit != null && currentCol.oldEdit == false) {
			return;
		}
		var params = lclc.tools.toParams(arguments);
		var newEvent = new lclc.grid.DataGridEvent({
					eventElement : me,
					eventType : lclc.BaseEvent.eventType.EDITSTART,
					lclcDataTable : me,
					currentValue : currentValue,
					currentCol : currentCol,
					currentRow : currentRow,
					domobj : event.domobj,
					ltDataTable : event.ltDataTable,
					colIndex : event.colIndex,
					// 行索引
					rowIndex : event.rowIndex
				});
		var editstartFilter = lclc.EventManager.dispatchEvent(newEvent);
		if ($.type(editstartFilter) === "boolean" && editstartFilter == false) {
		//大文本，即使返回false也弹出大文本对话框
		    if (currentCol.xType == "textarea") { 
					$(cellobj).dataTableTextarea({
								text : currentValue,
								title : currentCol.alias2 || currentCol.alias,
								renderId : currentCol.id,
								readOnly : true,
								callback : {
									finishEdit : function(text) {
										// 更新最后的数据
										data[currentCol.name] = text;
									}
								}
							});
					lclc.Logger.info(this.id + "grid停止编辑:业务控制 编辑前事件");
			}
		     return editstartFilter;
		}
		var row = lclc.JSON.stringify(currentRow);
		/*if (currentCol.needRow == true) {
			row = lclc.JSON.stringify(currentRow);
		}*/
		var url = currentCol.url;
		var reCol = this._queryRelatedIdById(currentCol.id);
		var relatedId = "";
		var value = "";
		if (reCol.length > 0) {
			for (var k = 0; k < reCol.length; k++) {
				if (currentRow[reCol[k].name] == null || currentRow[reCol[k].name] == undefined || currentRow[reCol[k].name] == '') {
					lclc.Msg.alert("请先选择" + (reCol[k].alias2 ==null?reCol[k].alias:reCol[k].alias2 ) + "数据")
					return;
				}
				relatedId += reCol[k].id+",";
				value += currentRow[reCol[k].name]+",";
			}
			
			relatedId=relatedId.substring(0,relatedId.length-1);
			value=value.substring(0,value.length-1);
				
			if (url == null) {
				url = this.setting.relatedUrl;
			}
		} else {
			relatedId = "";
			value = "";
		}
		if (currentCol.xType == "textfield") {
			return; 
		}
		
	// event.ltDataTable.gotoCell(event.rowIndex, event.colIndex, function(
	// cellobj) {
			if (currentCol.xType == "combo" 
				|| currentCol.xType == "multipleCombo"//add by xl; bizaiyi 20160819 合入
				|| currentCol.xType == "treepanel") {// 引用的处理
				//点图片不弹出
				if(srcElement.tagName =="IMG"){
					return;
				}
				// 以前的参数
				var treePnaelParams = me.setting.params.params;
				var treePnael = $(cellobj).treePanel({
					renderId : currentCol.id,
					url : url,
					queryLeaf : !currentCol.checkAll,
					showToolBar : currentCol.showToolBar,
					check_Style : currentCol.check_Style,
					chkboxType : currentCol.chkboxType,
					value : currentValue,
					row : currentRow,
					params : {
						tableID : me.setting.tableID,
						columnId : currentCol.id,
						relatedId : relatedId,
						value : value,
						format : "ztree",
						params : $.type(treePnaelParams)=='object'?lclc.encode(treePnaelParams):treePnaelParams,
						row : row
					},
					showClear : currentCol.showClear,
					callback : {
						onClick : function(event, treeId, treeNode) {
							// 只能选择叶子节点
							if (!currentCol.checkAll) {
								if (!treeNode.isParent) {
									data[lclc.grid.DataGrid.PREFIXEXPAND + currentCol.name] = treeNode.name;
									data[currentCol.name] = treeNode.id;
									me.setBindCol(currentRow, currentCol, data, treeNode);
									lclc.EventManager.dispatchEvent($.extend(
											newEvent, {
												lastEditRow : currentRow,
												currentRow : me.getDataBySortIndex(currentRow._sortid),
												eventType : 'oneditend',
												currentValue : treeNode.id
											}));
									lclc.EventManager.dispatchEvent($.extend(
											newEvent, {
												currentRow : currentRow,
												eventType : currentCol.name + '@' + 'oneditend',
												currentValue : treeNode.id
							 		}));
								} else {
									lclc.Msg.alert("只能选择子节点数据")
									return;
								}
							} else {
								data[lclc.grid.DataGrid.PREFIXEXPAND + currentCol.name] = treeNode.name;
								data[currentCol.name] = treeNode.id;
								me.setBindCol(currentRow, currentCol, data,
										treeNode);
								lclc.EventManager.dispatchEvent($.extend(
										newEvent, {
											lastEditRow : currentRow,
											currentRow : me.getDataBySortIndex(currentRow._sortid),
											eventType : 'oneditend',
											currentValue : treeNode.id
										}));
								lclc.EventManager.dispatchEvent($.extend(
										newEvent, {
											lastEditRow : currentRow,
											currentRow : me.getDataBySortIndex(currentRow._sortid),
											eventType : currentCol.name + '@' + 'oneditend',
											currentValue : treeNode.id
										}));
							}
							treePnael.close();

						},
						clear : function() {
							//清除数据
							if (currentCol.isNullable != null && !currentCol.isNullable) {
								lclc.Msg.alert(currentCol.alias2+"不能为空");
								return;
							}
							data[lclc.grid.DataGrid.PREFIXEXPAND + currentCol.name] = "";
							data[currentCol.name] = "";
							me.setBindCol(currentRow, currentCol, data, {});
							lclc.EventManager.dispatchEvent($.extend(newEvent, {
										lastEditRow : currentRow,
										currentRow : me.getDataBySortIndex(currentRow._sortid),
										eventType : 'oneditend',
										currentValue : ""
									}));
							lclc.EventManager.dispatchEvent($.extend(newEvent, {
								lastEditRow : currentRow,
								currentRow : me.getDataBySortIndex(currentRow._sortid),
								eventType : currentCol.name + '@' + 'oneditend',
								currentValue : ""
							}));
							treePnael.close();
						}
					}

				});
			} else if (currentCol.xType == "fileuploadfield") { // 上传文件
				if (srcElement.nodeName === 'A' && srcElement.innerText === '删除') {
					lclc.MessageBox.confirm("是否确定删除？",function() {
							if (!currentCol.oldEdit) {
								return;
							}
							if (!me.setting.editable) {
								return;
							}
							var a = lclc.EventManager.dispatchEvent(new lclc.grid.DataGridEvent({
												eventElement : me,
												eventType : "oneditstart",
												lclcDataTable : me,
												currentValue : currentValue,
												currentCol : currentCol,
												currentRow : currentRow,
												domobj : event.domobj,
												ltDataTable : event.ltDataTable,
												colIndex : event.colIndex,
												// 行索引
												rowIndex : event.rowIndex
											}));

							if ($.type(a) === "boolean" && a == false) {
								return a;
							}
							if (currentValue != null && currentValue.length > 0) {
								data[lclc.grid.DataGrid.PREFIXEXPAND + currentCol.name] = "";
								data[currentCol.name] = "";
								// 更新最后的数据
								me.updateRow(data, currentRow._locationposition);
								lclc.EventManager.dispatchEvent($.extend(newEvent, {
											lastEditRow : $.extend(currentRow, data),
											currentRow : $.extend( 	currentRow, me.getDataBySortIndex(currentRow._sortid)),
											eventType : 'oneditend',
											currentValue : ""
										}));
								lclc.EventManager.dispatchEvent($.extend(newEvent, {
											currentRow : currentRow,
											eventType : currentCol.name + '@' + 'oneditend',
											currentValue : ""
										}));
							}
					});
					return false;
				}
				return me._dataTable_cellfileuploadfield(cellobj, currentRow, currentCol, srcElement);
			} else if (currentCol.xType == "textarea") { // 大文本 的处理
				if (!(this.setting.editable == false || currentCol.readOnly == true ||
						currentCol.oldEdit != null && currentCol.oldEdit == false)) {
					$(cellobj).dataTableTextarea({
						text : currentValue,
						title :  currentCol.alias2 || currentCol.alias,
						renderId : currentCol.id,
						callback : {
							finishEdit : function(text,saveFlag) {
								// 更新最后的数据
						        if (currentCol.isNullable != null && !currentCol.isNullable) {
						        	if(text.trim() =="" && saveFlag==true){
										lclc.Msg.alert(currentCol.alias2+"不能为空");
										return;
									}
								}
								data[currentCol.name] = text;
								me.updateRow(data, currentRow._locationposition);
								lclc.EventManager.dispatchEvent($.extend(newEvent, {
									lastEditRow : $.extend(currentRow, data),
									currentRow : $.extend( 	currentRow, me.getDataBySortIndex(currentRow._sortid)),
									eventType : 'oneditend',
									currentValue : text
								}));
								lclc.EventManager.dispatchEvent($.extend(newEvent, {
									lastEditRow : $.extend(currentRow, data),
									currentRow : $.extend( 	currentRow, me.getDataBySortIndex(currentRow._sortid)),
									eventType : currentCol.name + '@' + 'oneditend',
									currentValue : text
								}));
							}
						}
					});
				}
			} else if (currentCol.xType == "datefield") { // 日期的处理
				$(cellobj).dataTableDatefield({
					text : currentValue,
					title : currentCol.alias,
					renderId : currentCol.id,
					colFormat : currentCol.colFormat,
					callback : {
						finishEdit : function(text) {
							// 更新最后的数据
							data[currentCol.name] = text;
							me.updateRow(data, currentRow._locationposition);
							lclc.EventManager.dispatchEvent($.extend(newEvent, {
										lastEditRow : $.extend(currentRow, data),
										currentRow : $.extend( 	currentRow, me.getDataBySortIndex(currentRow._sortid)),
										eventType : 'oneditend',
										currentValue : text
									}));
							lclc.EventManager.dispatchEvent($.extend(newEvent, {
								lastEditRow : $.extend(currentRow, data),
								currentRow : $.extend( 	currentRow, me.getDataBySortIndex(currentRow._sortid)),
								eventType : currentCol.name + '@' + 'oneditend',
								currentValue : text
							}));
						}
					}
				});
			}

	// })

	},
	/*
	 * 双击打开”只读“大文本
	 */
	_dbClickTextarea :function(event){
			if (!event.isSelf) {return;}
			var cellobj=event.domobj;
			var currentCol = event.currentCol;
			// 当前值
			var currentValue = event.currentValue;
			if (currentCol.xType == "textarea") {
		       	if (this.setting.editable == false || currentCol.readOnly == true || currentCol.oldEdit != null && currentCol.oldEdit == false) {
				 // 大文本 的处理
					$(cellobj).dataTableTextarea({
								text : currentValue,
								title : currentCol.alias2 || currentCol.alias,
								renderId : currentCol.id,
								readOnly : true,
								callback : {
									finishEdit : function(text) {
										// 更新最后的数据
										data[currentCol.name] = text;
									}
								}
							});
				}
				return;
			}
	},
	getRelatedData:function (currentRow, currentCol, data,relaColArray) {
		var columnIds="",relatedIds="",values="", data_bak=data;
		for(var i=0;i<relaColArray.length;i++){
			columnIds =relaColArray[i].id;
			var reCol = this._queryRelatedIdById(columnIds);//关系父列
			if(reCol.length > 0){//存在级联关系
				if(reCol[0].id !=null && data_bak[reCol[0].name] !=null){
					relatedIds=reCol[0].id;
					values =data_bak[reCol[0].name];
				}else{
					return data_bak
				}
				var me =this;
				this.paramsRateOneToOne = {
					tableID : me.setting.tableID,
					columnId : columnIds,
					relatedId : relatedIds,
					value : values,
					format : "ztree",
					row : currentRow
				}
				lclc.pubAjax({
					url : me.setting.relatedUrl,
					type : 'post',
					async:false,//为异步
					data : me.paramsRateOneToOne,
					dataType : 'json',
					success : function(json) {
						if(json.length > 0){
							var tempLeafCount=0,LeafIndex;//叶子的总数以及是叶子节点的索引
							for(var j=0;j<json.length;j++){
								if(json[j].isleaf){
									tempLeafCount+=1;
									if(tempLeafCount> 1){//两条或以上就不是一对一
										return;
									}
									LeafIndex=j;//记录叶子节点索引
								}
							}
							//只能有一个叶子节点
							if(tempLeafCount  === 1){
								data_bak[lclc.grid.DataGrid.PREFIXEXPAND + relaColArray[i].name] = json[LeafIndex].name;
								data_bak[relaColArray[i].name] =  json[LeafIndex].id;
							}
						}
					}
				});
			}
		}
		return data_bak;
	},
	// 设置邦定列
	/**
	 *
	 * @param {}
	 *            currentRow 当前没有修改的行
	 * @param {}
	 *            currentCol 当前列
	 * @param {}
	 *            data 当前要修改的数据
	 */
	setBindCol : function(currentRow, currentCol, data, currentNode) {
		var me = this;
		// 删除关联影响的列
		var relaColArray = this.clearRelateds(currentCol, currentRow);
		//处理级联关系一对一的情况
		if(!$.isEmptyObject(currentNode)  && relaColArray.length > 0){
			var getShowVal =this.getRelatedData(currentRow, currentCol, data,relaColArray);
		}
		//查询到哪些列会受到当前列的影响
		//修改当前列对应的绑定列
          var fields = this.queryColumn({
		 			bandrefcolid : currentCol.id
				});

		for (var i = 0; i < fields.length; i++) {
			if ($.type(fields[i].bandrefdwcol) === 'string') {
				data[fields[i].name] = currentNode[fields[i].bandrefdwcol] == null? currentNode[fields[i].bandrefdwcol .toUpperCase()] || currentNode[fields[i].bandrefdwcol.toLowerCase()]:currentNode[fields[i].bandrefdwcol]
			}
		}

		//修改级联的绑定列

		fields = [];
		if (relaColArray != null && relaColArray.length > 0) {
			$(relaColArray).each(function(k, relaCol) {
						field = me.queryColumn({
									bandrefcolid : relaCol.id
								});
						if (field != null && field.length > 0) {
							fields = fields.concat(field);
						}
					});
		}
		for (var i = 0; i < fields.length; i++) {
			if ($.type(fields[i].bandrefdwcol) === 'string') {
				data[fields[i].name] = "";
			}
		}
		// 更新最后的数据
		this.updateRow(data, currentRow._locationposition);

	},
	_getShowTitle : function() {
		if ($.type(this.option("title"))  == 'string'  ) {
			var le=  this.option("title")==null?0:this.option("title").length ;
			if( le >0){
			  return true;
			}
		}
		if ($.type(this.option("collapsePosition")) == 'string') {
			if( this.option("collapsePosition").length > 0){return true;}

		}
		if ($.type(this.option("icon")) == 'string') {
			if(this.option("icon").length > 0){return true;}

		} 
		if (this.option("tbarStyle") != null && this.option("tbarStyle").position == "t") {
			return true;
		}
		return false;
	},
	clearRelateds : function(currentCol, currentRow) {
		var relaColArray = [];
		var curCondArray = [currentCol];
		// 记录条件列，用来判断级联引用的环路， 判断逻辑为，如果有一列为条件列的同也是数据列即出现环路
		var condColumnMap = new Object();
		
		while (curCondArray.length > 0) {
			var newCondArray = [];
			for (var i = 0; i < curCondArray.length; i++) {
				if (condColumnMap[curCondArray[i]["id"]]) {
					lclc.Msg.alert("级联引用出现环路，请检查定义！");
					return;
				}
				condColumnMap[curCondArray[i]["id"]] = curCondArray[i];
				var tempRelaColArray = this._queryMyRelatedById(curCondArray[i]);
				relaColArray = relaColArray.concat(tempRelaColArray);
				newCondArray = newCondArray.concat(tempRelaColArray);
			}
			curCondArray = newCondArray;
		}
		
		if (relaColArray.length == 0) {
			return relaColArray;
		}
		
		
		var data = {};
		for (var i = 0; i < relaColArray.length; i++) {
			data[relaColArray[i]["name"]] = "";
			data["SNAME_" + relaColArray[i]["name"]] = "";
		}
		
		this._updateRow(data, currentRow._locationposition);

		return relaColArray;
	},
	/**
	 * 得到要影响字段
	 * 
	 * @return {}
	 */
	_queryMyRelatedById : function(currentCol) {
		var relatedIds = this.getGrid()["relatedCoumnList"];
		var list=[];
		for (var v in relatedIds) {
			for (var j = 0; j < relatedIds[v].length; j++) {
				for(var k in relatedIds[v][j]){
					if (k == currentCol.id) {
						list.push(v);
						continue;
					}
				}
			}
		}
		
		var tempList = new Array(); 
		for (var j = 0; j < list.length; j++) {
				var col = this.queryColumn({
							id : list[j]
						});
				if (col.length > 0) {
					tempList = tempList.concat(col)
				}
			}
		 
		return tempList;

	},
	jump : function(currentRow, currentCol, currentValue) {
		var re = /^\$.*\$$/;// 已$开头$结尾（至少头尾各有一个$）
		var reHead = /^\$/;// 替换首$
		var reEnd = /\$$/;// 替换尾$
		var str = "";
		var params = {};
		var currentHrefParams = currentCol.hrefParms;
		if ($.isArray(currentHrefParams)) {// 曹坤说目前没有这种情况--bizy : 2015.12.22
			$(currentHrefParams).each(function(index, parms) {
						$.extend(params, parms);
					})
		} else {
			if (currentHrefParams != null) {
				var p={};
				for(var v in  currentHrefParams){
					var cParamValue = currentHrefParams[v];
					if(re.test(cParamValue)){// 已$开头$结尾，取当前行特定列的值作为参数值
						var paramColName = cParamValue.replace(reHead,"").replace(reEnd,"");
						if(paramColName=='cUserGuid' && window["cUserGuid"] && cUserGuid!=""){
							p[v] = cUserGuid;
						}else{
				    		p[v]=currentRow[paramColName] || '';
						}
					}else{
				    	p[v]=cParamValue;
					}
				}
				params = $.extend({}, p);
			} else {
				params = currentRow;
			}
		}
		var url = "", preUrl = currentCol.hrefUrl.substring(0, 1), lastUrl = currentCol.hrefUrl.substring(1, currentCol.hrefUrl.length);
		var flag="?";

		var str = $.param(params);
		if(preUrl!='!'){
			if(str){
				str=str+"&tokenid="+tokenID;
			}else{
				str="tokenid="+tokenID;
			}
		}

		if(lastUrl.indexOf("?")>0){
			flag="&";
		} 
		if (preUrl == ":") {//冒号:配项目路径
			url = pathPrefix + ":" + lastUrl + flag + str;
		}else if(preUrl=='#'){ //#号:自定义项目名称
		    //var strUrl=this.setting.basePath;this.setting.baseUrl=strUrl.substring(0,strUrl.lastIndexOf('/', strUrl.lastIndexOf('/') - 1) + 1);
			url =  this.setting.baseUrl + lastUrl + flag + str;
		}else if(preUrl=='!' || preUrl=='*'){ //!感叹号:配啥就是啥。*星号: 配啥就是啥+tokenid
			url=lastUrl + flag + str;
		}else{
			url = this.setting.basePath + currentCol.hrefUrl + flag + str;
		}
		if (currentCol.openWindow == true) {
			var div_id = this.setting.renderId + currentCol.columnDBName;
			if ($("#" + div_id).length > 0) {
				$("#" + div_id).remove();
			}
			var projTypeTreeDiv = $("<div  id='"
					+ div_id
					+ "' style='margin:0px;padding:0px;overflow-y:hidden;'></div>")
					.append("<iframe id='iframe_"
							+ div_id
							+ "' style='margin:0px,padding:0px' frameborder='no'  id='subFrame' height='100%' width='100%' src='"
							+ url + "'/>");

			var daultCss = currentCol.css == null ? {} : currentCol.css;
			var css = $.extend({}, daultCss, {
						width : daultCss.width == null ? 800 : daultCss.width,
						height : daultCss.height == null
								? 600
								: daultCss.height

					});

			$(projTypeTreeDiv).css(css).dialog({
						resizable : false,
						height : css.height,
						width : css.width,
						modal : true,
						position : 'center'
					});

			return;
		}
		window.open(url)
	},
	showMessage : function(event) {
		var currentRow = event.currentRow;
		var currentCol = event.currentCol;
		var currentValue = event.currentValue;
		
		var vdata=null; 
		if(currentCol.dataType == "N" || currentCol.dataType == "P"|| currentCol.dataType == "I"	 ){
			if(currentRow[currentCol.name]  != null && currentRow[currentCol.name].length > 15){
				vdata={};
				vdata.error='超过计算范围'; 
			}
		} 
		if(currentCol.dataType == "S"){ 
			if (!this.setting.stringRegexpr.test(currentValue)) {
				vdata={};
				vdata.error=this.setting.stringRegexprMessage; 
			}else if(this.setting.stringRegexp==true  && this.setting.stringRegexpr2.test(currentValue)) {
				vdata={};
				vdata.error=this.setting.stringRegexprMessage2; 
			}
		}
		if(vdata == null){
			vdata = this.validateData(currentCol, currentRow, currentValue);
		}
		if (vdata) {
			lclc.Msg.alert(vdata.error);
			var data = {};
			data._sortid = currentRow._sortid;
			// 本来不能为空。如果默认值依然为空。就不要更新默认值
			if (!currentCol.isNullable) {
				if (currentCol.defaultValue == null) {
					return;
				}
			}
			data[currentCol.name] = currentCol.defaultValue;
			if (currentCol.csId != null) {
				if (currentCol.csId.length > 0) {
					data[lclc.grid.DataGrid.PREFIXEXPAND_C + currentCol.name] = currentCol.defaultShowValue;
				}
			} 
			// var lastEditRow=$.extend(true,{},currentRow);
			var currentRow=$.extend(true,{},currentRow,data);
			var newEvent=$.extend({},event); 
			this.updateRowBySort(data, currentRow._sortid);
			lclc.EventManager.dispatchEvent($.extend(newEvent, { 
						currentRow : currentRow,
						eventType : 'oneditend',
						currentValue : currentCol.defaultValue
					}));
			lclc.EventManager.dispatchEvent($.extend(newEvent, { 
						currentRow : currentRow,
						eventType : currentCol.name + '@' + 'oneditend',
						currentValue : currentCol.defaultValue
					})); 
			return  false;
		}
		
		
	},  
	/**
	 * 数据校验
	 */
	_validateData : function(fn) {
		var data = new Array();
		var editData = this.getEditTableData();
		// 遍历所有编辑过的数据
		for (var i = 0; i < editData.length; i++) {
			var row = this.queryData(editData[i]);
			for (var v in editData[i]) {
				var currentCols = this.queryColumn({
							name : v
						});
				if (currentCols.length > 0) {
					var tempV = this.validateData(currentCols[0], row[0],
							editData[i][v]);
					if (tempV) {
						data.push(tempV);
					}
				}
			}

		} // 处理所有新增的数据
		var editData = this.getInsertTableData();
		// 遍历所有编辑过的数据
		for (var i = 0; i < editData.length; i++) {
			var row = this.queryData(editData[i]);
			for (var v in editData[i]) {
				var currentCols = this.queryColumn({
							name : v
						});
				if (currentCols.length > 0) {
					var tempV = this.validateData(currentCols[0], row[0],
							editData[i][v]);
					if (tempV) {
						data.push(tempV);
					}
				}
			}
		}
		if (data.length == 0) {
			return data;
		}
		if ($.type(fn) === "function") {
			return fn.call(this, data);
		}
		return data;
	},
	/**
	 * 如果有分页条。就要让TootBar 画在分页条上
	 */
	_getFootBarPanel:function(config){
		config = config ||this._getPanelConfig();
	   if (this.setting.pagination) {
			return this.getPagination(config).getMiniToolPanel().attr("id") 
	   }
	   //把TootBar画在 显示标题的状态栏上
	   if (this.setting.pagination==false &&  this.setting.footShortTitleFlag) {
			return this.getstatusPanel().attr("id")+"_panel_mini_tool"; 
	   }
	   return  lclc.grid.DataGrid.superclass._getFootBarPanel.call(this); 
	},
	addFootButton:function(fbar){
	   this.fbar=lclc.grid.DataGrid.superclass.addFootButton(fbar);
	},
	getFootbar : function(config) {
	    return this.fbar || this.Footbar;
	},
	setEditable:function(flag){ 
	   this.setting.editable = flag; 
	},
	// 数据校验
	validateData : function() {
		if (arguments.length <= 1 || $.type(arguments[0]) === 'function') {
			return this._validateData(arguments[0]);
		} else {
			var currentCol = arguments[0], currentRow = arguments[1], currentValue = arguments[2];
		}

		if (currentCol.display == false) {
			return null;
		}
		var lab = currentCol.alias2;
		if (lab == "" || lab == null || lab == undefined) {
			lab = currentCol.isNullable ? currentCol.alias2 : currentCol.alias;
			lab = lab || currentCol.alias;
		}
		if (currentCol.isNullable != null && !currentCol.isNullable) {
			if (currentValue == "" || currentValue == null
					|| currentValue == undefined) {
				return $.extend({}, currentRow, this.currentCol, {
							error : lab + "不能为空"
						});
			}
		}
		if (currentCol.regexpr) {// 正则： /^(?:(?!0\.0+$)(?!0+)(\S+))[\d\D]*/  非空非零时提示（包括0.0，0.00，0.0...）
			var regex = new RegExp(currentCol.regexpr);
			if (!regex.test(currentValue)) {
				return $.extend({}, currentRow, this.currentCol, {
							error : currentCol.regexprinfo
						});
			}
		}
		if (currentCol.dataLength != null && $.isNumeric(currentCol.dataLength)) {
			currentValue = currentValue || "";
			var length = currentValue.length;
			if (length > parseInt(currentCol.dataLength)) {
				return $.extend({}, currentRow, this.currentCol, {
							error : lab + "长度不能超过" + currentCol.dataLength
									+ "个字符"
						});
			}
		}
	},
	// 重新设置大小
	resizeTable : function(width, height) {
		if ($.isNumeric(width) && $.isNumeric(height)) {

		} else {
			return;
		}
		this.setWidth(width);
		this.setHeight(height);

	},
	setWidth : function(w) { 
		if ($.type(w) == 'number') {
			if (w == null) {
			w = this.getWidth();
		}
		this.width = this.setting.width = w;
		var config = this._getPanelConfig();
		
		// 标题区
		/* */
		// 工具条区
		// 渲染区
		if(this.option("autoWidth") == false){ 
			// 整体
			$(this.jqueryObj).width(w);
			$("#" + config.panelId).width(w);
			if(this.getToolbar(config) != null){ 
			   this.getToolbar(config).setWidth(w);
			}  
			if(this.getPagination(config) != null){ 
			 	 this.getPagination(config).setWidth(w);
			}else if(this.getFootbar(config) != null){ 
				// 有分页，就不要设置footbar
			   this.getFootbar().setWidth(w);
			}
			this.getContentPanel(config).width(this.getContentWidth());
			
			this.setting.dataTable.resize(this.getContentWidth()-2, this.getContentHeight()-2);
		} 
		// 状态栏区
		var newEvent = new lclc.Panel.PanelEvent({
					panel : this,
					async : true,
					width : w,
					type : "width",
					container : this,
					async : true,
					eventElement : this,
					eventType : lclc.BaseEvent.eventType.RESIZE
				});
		lclc.EventManager.dispatchEvent(newEvent); 
		}
	},
	setHeight : function(h) {
		if ($.type(h) == 'number') {
			var config = this._getPanelConfig();
			lclc.grid.DataGrid.superclass.setHeight.call(this, h);
			this.setting.dataTable.resize(this.getContentWidth()-2, this.getContentHeight()-2);
		} 
	},
	/**
	 * 重设置渲染区的高度 这个方法应是每个组件自己实现
	 */
	resetContentHeight : function() {
		lclc.grid.DataGrid.superclass.resetContentHeight.call(this);
		// 修改当前渲染区的DIV 的高度
		this.setting.dataTable.resize(this.getContentWidth(), this.getContentHeight());
	}
});
	
	lclc.override(lclc.grid.DataGrid, {
				isPrefixExpand : function(fieldName) {
					var regex = new RegExp("^" + lclc.grid.DataGrid.PREFIXEXPAND);
					return regex.test(fieldName);
				},
				isPrefixExpand_C : function(fieldName) {
					var regex = new RegExp("^" + lclc.grid.DataGrid.PREFIXEXPAND_C);
					return regex.test(fieldName);
				}
			});

// 注册到xType 管理器
lclc.reg(lclc.grid.DataGrid);
