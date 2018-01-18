var stid = new Map();
stid.set(1, "connection");
stid.set(2, "connection");
stid.set(3, "connection");
stid.set(4, "connection");
stid.set(5, "connection");
stid.set(10, "sla");
stid.set(11, "sla");
stid.set(12, "adsl");
stid.set(13, "dhcp");
stid.set(14, "dns");
stid.set(15, "radius");
stid.set(20, "web_page");
stid.set(30, "web_download");
stid.set(31, "ftp");
stid.set(32, "ftp");
stid.set(40, "video");
stid.set(50, "game");

var task_handle = new Vue({
    el: '#handle',
    data: {},
    mounted: function () {
    },
    methods: {
        newTask: function () {
            status = 0;
            var forms = $('#taskform_data .form-control');
            taskform_data.atemplates = [];
            $('#taskform_data input[type=text]').prop("disabled", false);
            $('#taskform_data select').prop("disabled", false);
            $('#taskform_data input[type=text]').prop("readonly", false);
            $('#taskform_data input[type=text]').prop("unselectable", 'off');
            taskform_data.modaltitle = "新建告警模版";
            /*修改模态框标题*/
            for (var i = 0; i < 3; i++) {
                forms[i].value = ""
            }
            $(".service").addClass("service_unselected");
            taskform_data.atemplates = [];
            $('#viewfooter').attr('style', 'display:none');
            $('#newfooter').removeAttr('style', 'display:none');
            $('#myModal_edit').modal('show');
        },

    }
});

var taskform_data = new Vue({
    el: '#myModal_edit',
    data: {
        modaltitle: "", /*定义模态框标题*/
        servicetype: 0,
        schpolicies: [],
        atemplates: []
    },
    // 在 `methods` 对象中定义方法
    methods: {
        submit: function () {
            var tasknewJson = getFormJson($('#taskform_data'));
            var paramnewJson = getFormJson($('#taskform_param'));
            console.log(paramnewJson);
            tasknewJson.value = paramnewJson;
            tasknewJson.createTime = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
            tasknewJson.remark = "无";
            console.log(tasknewJson);
            var tasknew = JSON.stringify(tasknewJson);
            $.ajax({
                type: "POST", /*GET会乱码*/
                url: "../../cem/alarmtemplate/save",
                cache: false,  //禁用缓存
                data: tasknew,  //传入组装的参数
                dataType: "json",
                contentType: "application/json", /*必须要,不可少*/
                success: function (result) {
                    let code = result.code;
                    let msg = result.msg;
                    // console.log(result);
                    if (status == 0) {
                        switch (code) {
                            case 0:
                                toastr.success("新增成功!");
                                $('#myModal_edit').modal('hide');    //jQuery选定
                                break;
                            case 403:
                                toastr.error(msg);
                                break;
                            default:
                                toastr.error("未知错误");
                                break
                        }
                    } else if (status == 1) {
                        switch (code) {
                            case 0:
                                toastr.success("修改成功!");
                                $('#myModal_edit').modal('hide');
                                break;
                            case 403:
                                toastr.error(msg);
                                break;
                            default:
                                toastr.error("未知错误");
                                break
                        }
                    }
                    alert_table.currReset();
                }
            });
        },
        cancel: function () {
            $(this.$el).modal('hide');
            $(".service").addClass("service_unselected");
            $(".service").attr('disabled', 'disabled');

        },
        servicechange: function () {
            $(".service").addClass("service_unselected");
            this.servicetype = parseInt($('#serviceType').val());
            var servicetypeid = stid.get(this.servicetype);
            var selectst = "#" + servicetypeid;
            $("#" + servicetypeid).removeClass("service_unselected");
            $("#" + servicetypeid + " input[type=text]").prop("disabled", false);
            $("#" + servicetypeid + " select").prop("disabled", false);
        },
        editdata: function (service) {
            $(".service").addClass("service_unselected");
            this.servicetype = parseInt(service);
            var servicetypeid = stid.get(this.servicetype);
            var selectst = "#" + servicetypeid;
            $("#" + servicetypeid).removeClass("service_unselected");
            $("#" + servicetypeid + " input[type=text]").prop("disabled", false);
            $("#" + servicetypeid + " select").prop("disabled", false);
        },
    }
});

function getFormJson(form) {      /*将表单对象变为json对象*/
    var o = {};
    var a = $(form).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

//格式化日期
Date.prototype.Format = function (fmt) {
    var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S+": this.getMilliseconds()             //毫秒
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)){
            if(k == "y+"){
                fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
            }
            else if(k=="S+"){
                var lens = RegExp.$1.length;
                lens = lens==1?3:lens;
                fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
            }
            else{
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }
    return fmt;
};

function delete_this(obj) {
    delete_data.show_deleteModal();
    delete_data.id = parseInt(obj.id);
    /*获取当前行数据id*/
    console.log(delete_data.id);
}

var delete_data = new Vue({
    el: '#myModal_delete',
    data: {
        id: null
    },
    methods: {
        show_deleteModal: function () {
            $(this.$el).modal('show');
            /*弹出确认模态框*/
        },
        close_modal: function (obj) {
            $(this.$el).modal('hide');

        },
        cancel_delete: function (obj) {
            $(this.$el).modal('hide');
        },
        delete_task: function () {
            idArray = [];
            /*清空id数组*/
            idArray[0] = this.id;
            delete_ajax();
            /*ajax传输*/

        }
    }
});

//列表删除功能
function delete_ajax() {
    var ids = JSON.stringify(idArray);
    /*对象数组字符串*/
    $.ajax({
        type: "POST", /*GET会乱码*/
        url: "../../cem/alarmtemplate/delete",
        cache: false,  //禁用缓存
        data: ids,  //传入组装的参数
        dataType: "json",
        contentType: "application/json", /*必须要,不可少*/
        success: function (result) {
            toastr.success("告警模版删除成功!");
            alert_table.currReset();
            idArray = [];
            /*清空id数组*/
            delete_data.close_modal();
            /*关闭模态框*/
        }
    });
}

/*列表详情功能*/
function update_this (obj) {     /*监听修改触发事件*/
    update_data_id = parseInt(obj.id);
    /*获取当前行探针数据id*/
    console.log(update_data_id);
    status = 1;      /*状态1表示修改*/
    var forms = $('#taskform_data .form-control');
    var formparam = $('#taskform_param .form-control');
    /*去除只读状态*/
    //$('#probeform_data input[type=text]').prop("readonly", false);

    $.ajax({
        type: "POST", /*GET会乱码*/
        url: "../../cem/alarmtemplate/info/"+update_data_id,
        cache: false,  //禁用缓存
        dataType: "json",
        // contentType: "application/json", /*必须要,不可少*/
        success: function (result) {
            console.log(result.atList);
            console.log("I'm here!!!!"+result.atList[0].serviceType);
            var service=parseInt(result.atList[0].serviceType);
            var param=JSON.parse(result.atList[0].value);
            taskform_data.editdata(result.atList[0].serviceType);
            forms[0].value = result.atList[0].id;
            forms[1].value = result.atList[0].atName;
            forms[2].value = result.atList[0].serviceType;

            if(service==1||service==2||service==3||service==4||service==5){
                formparam[0].value = param.delay;
                formparam[1].value = param.delay_std;
                formparam[2].value = param.delay_var;
                formparam[3].value = param.jitter;
                formparam[4].value = param.jitter_std;
                formparam[5].value = param.jitter_var;
                formparam[6].value = param.loss_rate;
            }else if(service==10||service==11){
                formparam[7].value = param.delay;
                formparam[8].value = param.g_delay;
                formparam[9].value = param.r_delay;
                formparam[10].value = param.delay_std;
                formparam[11].value = param.g_delay_std;
                formparam[12].value = param.r_delay_std;
                formparam[13].value = param.delay_var;
                formparam[14].value = param.g_delay_var;
                formparam[15].value = param.r_delay_var;
                formparam[16].value = param.jitter;
                formparam[17].value = param.g_jitter;
                formparam[18].value = param.r_jitter;
                formparam[19].value = param.jitter_std;
                formparam[20].value = param.g_jitter_std;
                formparam[21].value = param.r_jitter_std;
                formparam[22].value = param.jitter_var;
                formparam[23].value = param.g_jitter_var;
                formparam[24].value = param.r_jitter_var;
                formparam[25].value = param.loss_rate;
            }else if(service==14){
                formparam[26].value = param.delay;
                formparam[27].value = param.success_rate;
            }else if(service==13){
                formparam[28].value = param.delay;
                formparam[29].value = param.success_rate;
            }else if(service==12){
                formparam[30].value = param.delay;
                formparam[31].value = param.drop_rate;
                formparam[32].value = param.success_rate;
            }else if(service==15){
                formparam[33].value = param.delay;
                formparam[34].value = param.success_rate;
            }else if(service==20){
                formparam[35].value = param.dns_delay;
                formparam[36].value = param.conn_delay;
                formparam[37].value = param.redirect_delay;
                formparam[38].value = param.headbyte_delay;
                formparam[39].value = param.page_file_delay;
                formparam[40].value = param.page_element_delay;
                formparam[41].value = param.above_fold_delay;
                formparam[42].value = param.download_speed;
            }else if(service==30){
                formparam[43].value = param.dns_delay;
                formparam[44].value = param.conn_delay;
                formparam[45].value = param.download_speed;
                formparam[46].value = param.headbyte_delay;
            }else if(service==31||service==32){
                formparam[47].value = param.dns_delay;
                formparam[48].value = param.conn_delay;
                formparam[49].value = param.login_delay;
                formparam[50].value = param.download_rate;
                formparam[51].value = param.headbyte_delay;
                formparam[52].value = param.upload_rate;
            }else if(service==40){
                formparam[53].value = param.dns_delay;
                formparam[54].value = param.ws_conn_delay;
                formparam[55].value = param.web_page_delay;
                formparam[56].value = param.ss_conn_delay;
                formparam[57].value = param.address_delay;
                formparam[58].value = param.ms_conn_delay;
                formparam[59].value = param.head_frame_delay;
                formparam[60].value = param.init_buffer_delay;
                formparam[61].value = param.load_delay;
                formparam[62].value = param.total_buffer_delay;
                formparam[63].value = param.download_rate;
                formparam[64].value = param.buffer_time;
            }else if(service==50) {
                formparam[65].value = param.dns_delay;
                formparam[66].value = param.conn_delay;
                formparam[67].value = param.packet_delay;
                formparam[68].value = param.packet_jitter;
                formparam[69].value = param.loss_rate;
            }else{}


        }
    });
   // probeform_data.modaltitle = "详细信息";
    /*修改模态框标题*/
    $('#myModal_edit').modal('show');
}


var alert_table = new Vue({
    el: '#alert_table',
    data: {
        headers: [
            {title: '<div style="width:17px"></div>'},
            {title: '<div style="width:97px">模版名称</div>'},
            {title: '<div style="width:77px">子业务类型</div>'},
            {title: '<div style="width:67px">创建时间</div>'},
            {title: '<div style="width:67px">备注</div>'},
            {title: '<div style="width:67px">操作</div>'}
        ],
        rows: [],
        dtHandle: null,
        taskdata: {}
    },

    methods: {
        reset: function () {
            let vm = this;
            vm.taskdata = {};
            /*清空taskdata*/
            vm.dtHandle.clear();
            console.log("重置");
            vm.dtHandle.draw();
            /*重置*/
        },
        currReset: function () {
            let vm = this;
            vm.dtHandle.clear();
            console.log("当前页面重绘");
            vm.dtHandle.draw(false);
            /*当前页面重绘*/
        },
        redraw: function () {
            let vm = this;
            vm.dtHandle.clear();
            console.log("页面重绘");
            vm.dtHandle.draw();
            /*重绘*/
        }
    },
    mounted: function () {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.
        vm.dtHandle = $(this.$el).DataTable({
            // Specify whatever options you want, at a minimum these:
            columns: vm.headers,
            data: vm.rows,
            searching: false,
            paging: true,
            serverSide: true,
            info: false,
            ordering: false, /*禁用排序功能*/
            /*bInfo: false,*/
            /*bLengthChange: false,*/    /*禁用Show entries*/
            /*scrollY: 432,    /!*表格高度固定*!/*/
            scroll: false,
            oLanguage: {
                sLengthMenu: "每页 _MENU_ 行数据",
                oPaginate: {
                    sNext: '<i class="fa fa-chevron-right" ></i>', /*图标替换上一页,下一页*/
                    sPrevious: '<i class="fa fa-chevron-left" ></i>'
                }
            },
            sDom: 'Rfrtlip', /*显示在左下角*/
            ajax: function (data, callback, settings) {
                //封装请求参数
                let param = {};
                param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
                param.start = data.start;//开始的记录序号
                param.page = (data.start / data.length) + 1;//当前页码
                param.taskdata = JSON.stringify(vm.taskdata);
                // console.log(param);
                //ajax请求数据
                $.ajax({
                    type: "POST", /*GET会乱码*/
                    url: "../../cem/alarmtemplate/list",
                    cache: false,  //禁用缓存
                    data: param,  //传入组装的参数
                    dataType: "json",
                    success: function (result) {
                        //封装返回数据
                        let returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                        returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                        // returnData.data = result.page.list;//返回的数据列表
                        // 重新整理返回数据以匹配表格
                        let rows = [];
                        var i = param.start + 1;
                        result.page.list.forEach(function (item) {
                            let row = [];
                            row.push(i++);
                            row.push(item.atName);
                            row.push(item.serviceName);
                            row.push(item.createTime);
                            row.push(item.remark);
                            row.push('<a class="fontcolor" onclick="delete_this(this)" id=' + item.id + '>删除</a>&nbsp;' +
                                '<a class="fontcolor" onclick="update_this(this)" id=' + item.id + '>编辑</a>');
                            rows.push(row);
                        });
                        returnData.data = rows;
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                        $("#alert_table").colResizable({
                            liveDrag: true,
                            gripInnerHtml: "<div class='grip'></div>",
                            draggingClass: "dragging",
                            resizeMode: 'overflow',
                        });
                    }
                });
            }
        });
    }
});

$(document).ready(function () {
    $("#myModal_delete").draggable();//为模态对话框添加拖拽
})

$(document).ready(function () {
    $("#myModal_edit").draggable();//为模态对话框添加拖拽
})