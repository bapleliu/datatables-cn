/**
 * Created by datatables.club on 2016/5/26.
 */


if (!window.localStorage) {
    alert('不支持 localStorage,会影响使用功能');
}

//因为功能还没有全部写完，避免弹出错误提示，每次数据都清空
var initFlag = localStorage.getItem("datatables-cn-data");
if (initFlag) {
    localStorage.removeItem("datatables-cn-data");
}
//彩蛋
localStorage.setItem("datatables-cn-noteflag", 1);
var addCount = 0, editCount = 0, delCount = 0;
var NOTEFLAG = localStorage.getItem("datatables-cn-noteflag");
NOTEFLAG = parseInt(NOTEFLAG);


//重置正在编辑的行
function restoreRow(oTable02, nRow) {
    var aData = oTable02.row(nRow).data();
    var json = {
        id: aData.id,
        name: aData.name,
        type: aData.type,
        color: aData.color,
        action: aData.action
    };
    var arr = createRowObj(json);
    oTable02.row(nRow).data(arr).draw();
}

//把当前行变为可编辑状态
function editRow(oTable02, nRow) {
    var aData = oTable02.row(nRow).data();
    var jqTds = $('>td', nRow);
    $(jqTds[0]).html(createInput(aData.name));
    $(jqTds[1]).html(createSelect(aData.type));
    $(jqTds[2]).html(createColorSelect(aData.color));
    $(jqTds[3]).html(formatDate(aData.id));
    $(jqTds[4]).html(createButton("save"));
    oTable02.draw();
    updateData(oTable02.data());
    if (NOTEFLAG == 1) {
        editCount++;
        if (editCount % 3 == 0) {
            var f = confirm("觉得这个例子怎么样？加群给个建议呗？");
            if (!f) {
                localStorage.setItem("datatables-cn-noteflag", 0);
                NOTEFLAG = 0;
            }
        }
    }
}

//添加一行
function addRow() {
    // Only allow a new row when not currently editing
    if (nEditing !== null) {
        return;
    }

    var aiNew = oTable02.row.add(createRowObj());
    var nRow = oTable02.row(aiNew[0]).node();
    editRow(oTable02, nRow);
    nEditing = nRow;

    $(aiNew).find('td:last-child').addClass('actions text-center');

    if (NOTEFLAG == 1) {
        addCount++;
        if (addCount % 3 == 0) {
            var f = confirm("觉得这个例子怎么样？加群给个建议呗？");
            if (!f) {
                localStorage.setItem("datatables-cn-noteflag", 0);
                NOTEFLAG = 0;
            }
        }
    }
}

//处理dt的内部数据，得到最简单的数据数组
function dealwithData(tmpData) {
    var arrTmp = [];
    for (var i = 0; i < tmpData.length; i++) {
        arrTmp.push(tmpData[i]);
    }
    return arrTmp;
}

//操作列的按钮创建
function createButton(type) {
    if (type === 'save') {
        return '<a class="edit save" href="#">保存</a>|<a class="delete" href="#">删除</a>';
    } else {
        return '<a class="edit" href="#">编辑</a>|<a class="delete" href="#">删除</a>';
    }
}

//input生成
function createInput(val) {
    return '<input type="text" value="' + val + '" class="form-control">';
}

/**
 * 创建select
 */
function createSelect(val) {
    var select = $("<select></select>");
    select.append("<option value=''>请选择</option>");
    select.append("<option value='0'>" + replaceValue(0) + "</option>");
    select.append("<option value='1'>" + replaceValue(1) + "</option>");
    select.append("<option value='-1'>" + replaceValue(-1) + "</option>");
    select.val(val);
    return select;
}

//创建背景颜色选择select
function createColorSelect(val) {
    var select = $("<select></select>");
    select.append("<option value=''>" + replaceColor() + "</option>");
    select.append("<option value='0' style='background-color: " + replaceColor(0) + "'></option>");
    select.append("<option value='1' style='background-color: " + replaceColor(1) + "'></option>");
    select.append("<option value='-1' style='background-color: " + replaceColor(-1) + "'></option>");
    select.val(val).css("background-color", replaceColor(val));
    return select;
}

//保存行，把数据写入dt的内部数据对象，并重绘表格
function saveRow(oTable02, nRow) {
    var jqInputs = $('input', nRow);
    var jqSelects = $('select', nRow);
    var rowObj = oTable02.row(nRow);
    var id = rowObj.data().id;
    var json = {
        id: id,
        name: $(jqInputs[0]).val(),
        type: $(jqSelects[0]).val(),
        color: $(jqSelects[1]).val(),
        action: createButton()
    };
    var tmpobj = createRowObj(json);
    rowObj.data(tmpobj).draw();
    updateData(oTable02.data());
}

//初始化数据，展示例子
function getInfo() {
    /* 属性	描述	IE	F	O
     appCodeName	返回浏览器的代码名。	4	1	9
     appMinorVersion	返回浏览器的次级版本。	4	No	No
     appName	返回浏览器的名称。	4	1	9
     appVersion	返回浏览器的平台和版本信息。	4	1	9
     browserLanguage	返回当前浏览器的语言。	4	No	9
     cookieEnabled	返回指明浏览器中是否启用 cookie 的布尔值。	4	1	9
     cpuClass	返回浏览器系统的 CPU 等级。	4	No	No
     onLine	返回指明系统是否处于脱机模式的布尔值。	4	No	No
     platform	返回运行浏览器的操作系统平台。	4	1	9
     systemLanguage	返回 OS 使用的默认语言。	4	No	No
     userAgent	返回由客户机发送服务器的 user-agent 头部的值。	4	1	9
     userLanguage	返回 OS 的自然语言设置。*/
    var appCodeName = {};
    appCodeName.id = null;
    appCodeName.type = null;
    appCodeName.color = null;
    appCodeName.action = null;
    appCodeName.name = "appCodeName: " + navigator.appCodeName;
    var infos = [];
    infos.push(createRowObj(appCodeName));

    var appName = {};
    appName.id = null;
    appName.type = null;
    appName.color = null;
    appName.action = null;
    appName.name = "appName: " + navigator.appName;
    infos.push(createRowObj(appName));

    var appVersion = {};
    appVersion.id = null;
    appVersion.type = null;
    appVersion.color = null;
    appVersion.action = null;
    appVersion.name = "appVersion: " + navigator.appVersion;
    infos.push(createRowObj(appVersion));

    var javaEnabled = {};
    javaEnabled.id = null;
    javaEnabled.type = null;
    javaEnabled.color = null;
    javaEnabled.action = null;
    javaEnabled.name = "javaEnabled: " + navigator.javaEnabled();
    infos.push(createRowObj(javaEnabled));

    var cookieEnabled = {};
    cookieEnabled.id = null;
    cookieEnabled.type = null;
    cookieEnabled.color = null;
    cookieEnabled.action = null;
    cookieEnabled.name = "cookieEnabled: " + navigator.cookieEnabled;
    infos.push(createRowObj(cookieEnabled));

    var onLine = {};
    onLine.id = null;
    onLine.type = null;
    onLine.color = null;
    onLine.action = null;
    onLine.name = "onLine: " + navigator.onLine;
    infos.push(createRowObj(onLine));

    var platform = {};
    platform.id = null;
    platform.type = null;
    platform.color = null;
    platform.action = null;
    platform.name = "platform: " + navigator.platform;
    infos.push(createRowObj(platform));

    var systemLanguage = {};
    systemLanguage.id = null;
    systemLanguage.type = null;
    systemLanguage.color = null;
    systemLanguage.action = null;
    systemLanguage.name = "systemLanguage: " + navigator.systemLanguage;
    infos.push(createRowObj(systemLanguage));

    var userAgent = {};
    userAgent.id = null;
    userAgent.type = null;
    userAgent.color = null;
    userAgent.action = null;
    userAgent.name = "userAgent: " + navigator.userAgent;
    infos.push(createRowObj(userAgent));

    var userLanguage = {};
    userLanguage.id = null;
    userLanguage.type = null;
    userLanguage.color = null;
    userLanguage.action = null;
    userLanguage.name = "userLanguage: " + navigator.userLanguage;
    infos.push(createRowObj(userLanguage));
    return infos;
}

//重新初始化数据
function reInitData() {
    localStorage.removeItem("datatables-cn-data");
    getData();
    alert("请按F5");
}

//从浏览器本地缓存获取dt的所有相关数据
function getData() {
    var loaclData = localStorage.getItem("datatables-cn-data");
    if (!loaclData) {
        loaclData = {
            "data": {
                "data": getInfo()
            }
        };
        loaclData = JSON.stringify(loaclData);
        localStorage.setItem("datatables-cn-data", loaclData);
    }
    return JSON.parse(loaclData);
}

//把dt的相关数据设置到浏览器本地缓存
function setData(data) {
    var parseData = JSON.stringify(data);
    localStorage.setItem("datatables-cn-data", parseData);
}

//更新浏览器本地缓存里dt的相关数据
function updateData(data) {
    var loaclData = getData();
    loaclData.data.data = dealwithData(data);
    setData(loaclData);
}

//生成一个行对象
function createRowObj(json) {
    var actionTem = createButton();
    var id = json ? json.id || new Date().getTime() : new Date().getTime();
    var name = json ? json.name || "DataTable 中文网" : "DataTable 中文网";
    var type = json ? json.type || "1" : "1";
    var color = json ? json.color || replaceColor() : replaceColor();
    var action = json ? json.action || actionTem : actionTem;
    return {
        "id": id,
        "name": name,
        "type": type,
        "color": color,
        "action": action
    };
}

//颜色替换
function replaceColor(i) {
    switch (parseInt(i)) {
        case 0:
            return "yellow";
        case 1:
            return "blue";
        case -1:
            return "green";
        default:
            return "white";
    }
}

//类型替换
function replaceValue(i) {
    switch (parseInt(i)) {
        case 0:
            return "List";
        case 1:
            return "None";
        case -1:
            return "Today";
        default:
            return "None";
    }
}

//格式化时间显示
function formatDate(now) {
    now = new Date(now);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
}

//设置DataTable全局默认值
$.extend(true, $.fn.dataTable.defaults, {
    "language": {
        "url": "/assets/Chinese.txt"
    },
    "dom": "BR<'row'<'col-md-6'l><'col-md-6'f>r>" +
    "t" +
    "<'row'<'col-md-4 sm-center'i><'col-md-4'><'col-md-4 text-right sm-center'p>>"
});

//是用bootstrap渲染dt
$.fn.dataTable.defaults.renderer = 'bootstrap';
$.fn.dataTable.ext.renderer.pageButton.bootstrap = function (settings, host, idx, buttons, page, pages) {
    var api = new $.fn.dataTable.Api(settings);
    var classes = settings.oClasses;
    var lang = settings.oLanguage.oPaginate;
    var btnDisplay, btnClass;

    var attach = function (container, buttons) {
        var i, ien, node, button;
        var clickHandler = function (e) {
            e.preventDefault();
            if (e.data.action !== 'ellipsis') {
                api.page(e.data.action).draw(false);
            }
        };

        for (i = 0, ien = buttons.length; i < ien; i++) {
            button = buttons[i];

            if ($.isArray(button)) {
                attach(container, button);
            }
            else {
                btnDisplay = '';
                btnClass = '';

                switch (button) {
                    case 'ellipsis':
                        btnDisplay = '&hellip;';
                        btnClass = 'disabled';
                        break;

                    case 'first':
                        btnDisplay = lang.sFirst;
                        btnClass = button + (page > 0 ?
                                '' : ' disabled');
                        break;

                    case 'previous':
                        btnDisplay = lang.sPrevious;
                        btnClass = button + (page > 0 ?
                                '' : ' disabled');
                        break;

                    case 'next':
                        btnDisplay = lang.sNext;
                        btnClass = button + (page < pages - 1 ?
                                '' : ' disabled');
                        break;

                    case 'last':
                        btnDisplay = lang.sLast;
                        btnClass = button + (page < pages - 1 ?
                                '' : ' disabled');
                        break;

                    default:
                        btnDisplay = button + 1;
                        btnClass = page === button ?
                            'active' : '';
                        break;
                }

                if (btnDisplay) {
                    node = $('<li>', {
                        'class': classes.sPageButton + ' ' + btnClass,
                        'aria-controls': settings.sTableId,
                        'tabindex': settings.iTabIndex,
                        'id': idx === 0 && typeof button === 'string' ?
                        settings.sTableId + '_' + button :
                            null
                    })
                        .append($('<a>', {
                                'href': '#'
                            })
                                .html(btnDisplay)
                        )
                        .appendTo(container);

                    settings.oApi._fnBindAction(
                        node, {action: button}, clickHandler
                    );
                }
            }
        }
    };
    attach(
        $(host).empty().html('<ul class="pagination"/>').children('ul'),
        buttons
    );
};

//表格初始化
//包含以下功能：
/**
 * dom的应用
 * render的应用
 * 是用本地静态数据，而非ajax取数
 * 国际化
 * buttons的应用
 * 行内编辑保存
 * 表格的增删改查
 *
 */
var oTable02 = $('#inlineEditDataTable').DataTable({
    "columnDefs": [
        {'title': "名称", 'targets': 0},
        {'title': "类型", 'targets': 1},
        {'title': "颜色", 'targets': 2},
        {'title': "创建时间", 'targets': 3},
        {'title': "操作", 'targets': 4}
    ],
    "order": [[1, "asc"]],
    "columns": [
        {"data": "name"},
        {
            "data": "type",
            "render": function (data, type, row, meta) {
                if (type == "display") {
                    return replaceValue(data);
                }
                if (type == "sort") {
                    return data;
                }
                return data;
            }
        },
        {
            "data": "color",
            "render": function (data, type, row, meta) {
                if (type == "display") {
                    return replaceColor(data);
                }
                if (type == "sort") {
                    return data;
                }
                return data;
            }
        },
        {
            "data": null,
            "render": function (data, type, row, meta) {
                return formatDate(row.id);
            }
        },
        {"data": "action"}
    ],
    "data": getData().data.data,
    "createdRow": function (row, data, dataIndex) {
        $(row).css('background-color', replaceColor(data.color));
    },
    "rowCallback": function (row, data, index) {
        $(row).css('background-color', replaceColor(data.color));
    },
    "buttons": [
        {
            extend: 'copy',
            text: '复制到剪贴板'
        },
        {
            extend: 'csv',
            text: '导出csv'
        },
        {
            extend: 'excel',
            text: '导出excel'
        },
        {
            extend: 'pdf',
            text: '导出pdf'
        },
        {
            extend: 'print',
            text: '打印'
        },
        {
            text: "选择需要隐藏的列",
            extend: "colvis"
        },
        {
            text: '添加一行',
            action: function (e, dt, node, config) {
                e.preventDefault();
                addRow();
            }
        },
        {
            text: '从弹窗表单中添加一行',
            action: function (e, dt, node, config) {
                e.preventDefault();
                $('#oftenModal').modal("show");
            }
        },
        {
            text: "重新初始化数据",
            action: function (e, dt, node, config) {
                e.preventDefault();
                reInitData();
            }
        },
        {
            text: "本例子说明",
            action: function (e, dt, node, config) {
                e.preventDefault();
                $('#myModal').modal("show");
            }
        }
    ]
});

var oftenData = [
    {
        "name": "吃饭",
        "DT_RowAttr": {
            "id": new Date().getTime(),
            "name": "吃饭"
        }
    }, {
        "name": "睡觉",
        "DT_RowAttr": {
            "id": new Date().getTime(),
            "name": "睡觉"
        }
    }, {
        "name": "打豆豆",
        "DT_RowAttr": {
            "id": new Date().getTime(),
            "name": "打豆豆"
        }
    }
];

//表格二
var oftenTable = $("#oftenDataTable").DataTable({
    "dom": "r<'row'<'col-md-6'l><'col-md-6'f>r>" +
    "t" +
    "<'row'<'col-md-6 sm-center'i><'col-md-6 text-right sm-center'p>>",
    "data": oftenData,
    "columns": [
        {"data": "name", "title": "名称"},
        {
            "data": null, "title": "操作",
            "defaultContent": '<a href="javascript:void(0)" class="view-detail">添加到表格中</a>'
        }
    ]
});

$('#oftenDataTable').on('click', 'a', function () {
    //如果有多个按钮，根据class名称区分
    if ($(this).hasClass("view-detail")) {
        // a标签在td，td 在tr
        // 这里要获取tr的对象，所以是 a标签的父级的父级
        var trObjData = $(this).parent().parent();
        var name = trObjData.attr("name");
        // Only allow a new row when not currently editing
        if (nEditing !== null) {
            return;
        }
        var json = {
            "name": name,
            "type": -1
        };
        oTable02.row.add(createRowObj(json)).draw();
        nEditing = null;
    }
});

var nEditing = null;

// 删除行初始化
$(document).on("click", "#inlineEditDataTable a.delete", function (e) {
    e.preventDefault();
    var nRow = $(this).parents('tr')[0];
    var id = oTable02.row(nRow).data().id;
    var dtData = dealwithData(oTable02.data());
    var finalData = $.grep(dtData, function (n, i) {
        return n.id != id;
    });
    oTable02.row(nRow).remove().draw(false);
    updateData(finalData);
    if (NOTEFLAG == 1) {
        delCount++;
        if (delCount % 3 == 0) {
            var f = confirm("觉得这个例子怎么样？加群给个建议呗？");
            if (!f) {
                localStorage.setItem("datatables-cn-noteflag", 0);
                NOTEFLAG = 0;
            }
        }
    }
});

// 编辑行初始化
$(document).on("click", "#inlineEditDataTable a.edit", function (e) {
    e.preventDefault();

    /* Get the row as a parent of the link that was clicked on */
    var nRow = $(this).parents('tr')[0];

    if (nEditing !== null && nEditing != nRow) {
        /* A different row is being edited - the edit should be cancelled and this row edited */
        restoreRow(oTable02, nEditing);
        editRow(oTable02, nRow);
        nEditing = nRow;
    }
    else if (nEditing == nRow && this.innerHTML == "保存") {
        /* This row is being edited and should be saved */
        saveRow(oTable02, nEditing);
        nEditing = null;
    }
    else {
        /* No row currently being edited */
        editRow(oTable02, nRow);
        nEditing = nRow;
    }
});
