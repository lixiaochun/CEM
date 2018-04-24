/**
 * Created by hh on 2018/3/28.
 */
var st = new Map();//servicetype字典，可通过get方法查对应字符串。
st.set(0, "综合业务");
st.set(1, "网络连通性业务");
st.set(2, "网络层质量业务");
st.set(3, "网页浏览业务");
st.set(4, "文件下载业务");
st.set(5, "在线视频业务");
st.set(6, "网络游戏业务");
var serviceSelected=0;
var outputContent=new Array();

var today = new Date();
today.setDate(today.getDate() - 1); //显示近一天内的数据

var new_search = new Vue({
    /*监听查询事件*/
    el: '#search',
    methods: {
        search: function () {
            var searchJson = getFormJson($('#outputSearch'));
            if ((searchJson.startDate) > (searchJson.terminalDate)) {
                console.log("时间选择有误，请重新选择！");
                toastr.warning('时间选择有误，请重新选择！');
            } else {
                var search = {};
                search.service = searchJson.service;
                search.exit=searchJson.exit;
                search.ava_start = searchJson.startDate.substr(0, 10);
                search.ava_terminal = searchJson.terminalDate.substr(0, 10);
                if (search.ava_start.length != 0 && search.ava_terminal.length != 0) {
                } else {
                    search.ava_start =  new Date(new Date() - 1000 * 60 * 60 * 24 * 4).Format("yyyy-MM-dd");
                    search.ava_terminal = (new Date()).Format("yyyy-MM-dd");
                }
                console.log(search);
                probetable.probedata = search;
                probetable.redraw();
                // $.ajax({
                //     /*后台取得数据,赋值给观察者*/
                //     type: "POST",
                //     url: "../../diagnose/list",
                //     cache: false,  //禁用缓存
                //     data: param,  //传入组装的参数
                //     dataType: "json",
                //     success: function (result) {
                //         console.log(result);
                //         if (result.page.list.length !== 0) {
                //             new_data.scoredata = result.page.list;
                //         } else {
                //             new_data.scoredata = [];
                //             toastr.warning('该日期范围没有对应数据！');
                //         }
                //     }
                // });
            }
        },
        reset: function () {    /*重置*/
            document.getElementById("outputSearch").reset();
            serviceSelected=0;
        }
    }
});

function getFormJson(form) {      /*将表单对象变为json对象*/
    var o = {};
    var a = $(form).serializeArray();
    if(serviceSelected!=-1 ||serviceSelected!=''){
        a[3]={};
        a[3].name='service';
        a[3].value=serviceSelected;
    }
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value ;
        }
    });
    return o;
}

$('#start_date').flatpickr({
    dateFormat: "Y-m-d",
    time_24hr: true
});
$('#terminal_date').flatpickr({
    dateFormat: "Y-m-d",
    time_24hr: true
});

//参数para1：希望隐藏元素的id值
function toggle1(param){
    if ($("#flip").attr("class")=="glyphicon glyphicon-menu-up")
    {
        $("#flip").attr("class","glyphicon glyphicon-menu-down");
    }
    else
    {
        $("#flip").attr("class","glyphicon glyphicon-menu-up");
    }
    $("#"+param).toggle();
}
serviceSelected=0
$('#service .jq22').comboSelect();
$('.combo-dropdown').css("z-index","3");
$('#service input[type=text]').attr('placeholder','综合业务')
$('#service .option-item').click(function (service) {
    var a = $(service.currentTarget)[0].innerText;
    serviceSelected = $($(service.currentTarget)[0]).data('value');
    setTimeout(function(){
        $('#service .combo-input').val(a);
    },20);

});

$('#service input[type=text] ').keyup(function (service) {
    if( service.keyCode=='13'){
        var b = $("#service .option-hover.option-selected").text();
        var c=($("#service .option-hover.option-selected"));
        var c=c[0].dataset
        serviceSelected = c.value;
        $('#service .combo-input').val(b);
        $('#service .combo-select select').val(b);
    }

});

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

var probetable = new Vue({
    el: '#probedata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:70px">出口名称</div>'},
            {title: '<div style="width:70px">探针名称</div>'},
            {title: '<div style="width:70px">端口</div>'},
            {title: '<div style="width:90px">业务类型</div>'},
            {title: '<div style="width:70px">综合分数</div>'},
            {title: '<div style="width:100px">网络连通性分数</div>'},
            {title: '<div style="width:100px">网络质量分数</div>'},
            {title: '<div style="width:100px">网页浏览业务</div>'},
            {title: '<div style="width:100px">文件下载业务</div>'},
            {title: '<div style="width:100px">在线视频业务</div>'},
            {title: '<div style="width:100px">在线游戏业务</div>'},
        ],
        rows: [],
        dtHandle: null,
        probedata: {ava_start:today.Format("yyyy-MM-dd"), ava_terminal:(new Date()).Format("yyyy-MM-dd"),service:'0'}

    },
    methods: {
        reset: function () {
            let vm = this;
            vm.probedata = {};
            /*清空probedata*/
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
    mounted: function() {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.
        vm.dtHandle = $(this.$el).DataTable({
            columns: vm.headers,
            data: vm.rows,
            searching: false,
            paging: true,
            serverSide: true,
            info: false,
            ordering: false, /*禁用排序功能*/
            /*bInfo: false,*/
            /*bLengthChange: false,*/    /*禁用Show entries*/
            scroll: false,
            bProcessing : true,
            oLanguage: {
                sEmptyTable: "No data available in table",
                sZeroRecords:"No data available in table",
                sLengthMenu: "每页 _MENU_ 行数据",
                sProcessing: "正在努力加载数据中...",
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
                param.probedata = JSON.stringify(vm.probedata);
                /*用于查询probe数据*/
                console.log(param);
                //ajax请求数据
                $.ajax({
                    type: "POST", /*GET会乱码*/
                    url: "../../probeexit/score",
                    cache: false,  //禁用缓存
                    data: param,  //传入组装的参数
                    dataType: "json",
                    success: function (result) {
                        console.log(result);
                        //封装返回数据
                        let returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                        returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.page.list;//返回的数据列表
                        // 重新整理返回数据以匹配表格
                        console.log(returnData);
                        let rows = [];
                        var i = param.start+1;
                        outputContent= result.page.list
                        result.page.list.forEach(function (item) {
                            let row = [];
                            row.push(i++);
                            row.push(item.exit);
                            row.push(item.probeName);
                            row.push(item.port);
                            row.push(st.get(item.serviceType));
                            row.push(fixed(item.score));
                            row.push(fixed(item.connectionScore ));
                            row.push(fixed(item.qualityScore ));
                            row.push(fixed(item.broswerScore ));
                            row.push(fixed(item.downloadScore));
                            row.push(fixed(item.videoScore));
                            row.push(fixed(item.gameScore ));
                            rows.push(row);
                        });
                        returnData.data = rows;
                        console.log(returnData);
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                        $("#probedata_table").colResizable({
                            liveDrag:true,
                            gripInnerHtml:"<div class='grip'></div>",
                            draggingClass:"dragging",
                            resizeMode:'overflow',
                        });
                    }
                });
            }
        });
    }
});

function update_this(obj) {
    $('#myModal_update').modal('show');
    if(obj.type=='综合业务'){
        information(obj);
        $('#myModal_update .modal-body').css('height','110px');
        $('#connnection').css('display','none');
        $('#quality').css('display','none');
        $('#broswer').css('display','none');
        $('#download').css('display','none');
        $('#video').css('display','none');
        $('#game').css('display','none');
    }else if(obj.type=='网络连通性业务'){
        ping(obj)
        $('#myModal_update .modal-body').css('height','160px');
        $('#information').css('display','none');
        $('#connnection').removeAttr('style');
        $('#quality').css('display','none');
        $('#broswer').css('display','none');
        $('#download').css('display','none');
        $('#video').css('display','none');
        $('#game').css('display','none');

    }else if(obj.type=='网络层质量业务'){
        quality(obj)
        $('#myModal_update .modal-body').css('height','160px');
        $('#quality').removeAttr('style');
        $('#information').css('display','none');
        $('#connnection').css('display','none');
        $('#broswer').css('display','none');
        $('#download').css('display','none');
        $('#video').css('display','none');
        $('#game').css('display','none');
    }else if(obj.type=='网页浏览业务'){
        broswer(obj)
        $('#myModal_update  .modal-body').css('height','130px');
        $('#broswer').removeAttr('style');
        $('#quality').css('display','none');
        $('#information').css('display','none');
        $('#connnection').css('display','none');
        $('#download').css('display','none');
        $('#video').css('display','none');
        $('#game').css('display','none');
    }else if(obj.type=='文件下载业务'){
        download(obj);
        $('#myModal_update .modal-body').css('height','160px');
        $('#download').removeAttr('style');
        $('#information').css('display','none');
        $('#connnection').css('display','none');
        $('#quality').css('display','none');
        $('#broswer').css('display','none');
        $('#video').css('display','none');
        $('#game').css('display','none');
    }else if(obj.type=='在线视频业务'){
        video(obj);
        $('#myModal_update .modal-body').css('height','160px');
        $('#video').removeAttr('style');
        $('#download').css('display','none');
        $('#quality').css('display','none');
        $('#information').css('display','none');
        $('#connnection').css('display','none');
        $('#broswer').css('display','none');
        $('#game').css('display','none');
    }else  if(obj.type=='网络游戏业务'){
        game(obj);
        $('#myModal_update .modal-body').css('height','160px');
        $('#game').removeAttr('style');
        $('#video').css('display','none');
        $('#quality').css('display','none');
        $('#information').css('display','none');
        $('#connnection').css('display','none');
        $('#broswer').css('display','none');
        $('#download').css('display','none');

    }

}
//综合性表格
function information(obj) {
    var id=obj.id;
    var information_table=new Vue({
        el:'#information_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
                {title: '<div style="width:70px">综合分数</div>'},
                {title: '<div style="width:100px">网络连通性分数</div>'},
                {title: '<div style="width:100px">网络质量分数</div>'},
                {title: '<div style="width:100px">网页浏览分数</div>'},
                {title: '<div style="width:100px">文件下载分数</div>'},
                {title: '<div style="width:100px">在线视频分数</div>'},
                {title: '<div style="width:100px">网络游戏分数</div>'},

            ],
            rows: [],
            dtHandle: null,
        },
        methods: {
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
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
        mounted: function(obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                serverSide: true,
                info: false,
                ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,

                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数

                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = outputContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    console.log(returnData);
                    let rows = [];
                    var i = 1;
                    outputContent.forEach(function (item) {

                        if(id==item.port){
                            debugger
                            let row = [];
                            row.push(i);
                            row.push(item.probeName);
                            row.push(item.score );
                            if(item.connectionScore!=undefined){
                                row.push(item.connectionScore.toFixed(2) );
                            }else{
                                row.push(item.connectionScore);
                            }
                            if(item.qualityScore!=undefined){
                                row.push(item.qualityScore .toFixed(2));
                            }else{
                                row.push(item.qualityScore);
                            }if(item.broswerScore!=undefined){
                                row.push(item.broswerScore .toFixed(2));
                            }else{
                                row.push(item.broswerScore);
                            }if(item.downloadScore!=undefined){
                                row.push(item.downloadScore .toFixed(2));
                            }else{
                                row.push(item.downloadScore);
                            }if(item.videoScore!=undefined){
                                row.push(item.videoScore .toFixed(2));
                            }else{
                                row.push(item.videoScore);
                            }if(item.gameScore!=undefined){
                                row.push(item.gameScore .toFixed(2));
                            }else{
                                row.push(item.gameScore);
                            }
                            rows.push(row);
                        }


                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#information_table").colResizable({
                        liveDrag:true,
                        gripInnerHtml:"<div class='grip'></div>",
                        draggingClass:"dragging",
                        resizeMode:'overflow',
                    });
                }
            });
        }
    })
}
//网络连通性表格
function ping(obj) {
    var id=obj.id;
    var ping_table=new Vue({
        el:'#pingdata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:70px">出口名称</div>'},
                {title: '<div style="width:70px">探针名称</div>'},
                {title: '<div style="width:70px">端口</div>'},
                {title: '<div style="width:90px">业务类型</div>'},
                {title: '<div style="width:70px">分数</div>'},
                {title: '<div style="width:100px">往返时延(ms)</div>'},
                {title: '<div style="width:100px">时延标准差(ms)</div>'},
                {title: '<div style="width:100px">时延方差(ms)</div>'},
                {title: '<div style="width:100px">抖动(ms)</div>'},
                {title: '<div style="width:100px">抖动标准差(ms)</div>'},
                {title: '<div style="width:100px">抖动方差(ms)</div>'},
                {title: '<div style="width:100px">丢包率(%)</div>'},
                {title: '<div style="width:100px">往返时延(ms)</div>'},
                {title: '<div style="width:100px">时延标准差(ms)</div>'},
                {title: '<div style="width:100px">时延方差(ms)</div>'},
                {title: '<div style="width:100px">抖动(ms)</div>'},
                {title: '<div style="width:100px">抖动标准差(ms)</div>'},
                {title: '<div style="width:100px">抖动方差(ms)</div>'},
                {title: '<div style="width:100px">丢包率(%)</div>'},
                {title: '<div style="width:100px">往返时延(ms)</div>'},
                {title: '<div style="width:100px">时延标准差(ms)</div>'},
                {title: '<div style="width:100px">时延方差(ms)</div>'},
                {title: '<div style="width:100px">抖动(ms)</div>'},
                {title: '<div style="width:100px">抖动标准差(ms)</div>'},
                {title: '<div style="width:100px">抖动方差(ms)</div>'},
                {title: '<div style="width:100px">丢包率(%)</div>'},
                {title: '<div style="width:100px">往返时延(ms)</div>'},
                {title: '<div style="width:100px">时延标准差(ms)</div>'},
                {title: '<div style="width:100px">时延方差(ms)</div>'},
                {title: '<div style="width:100px">抖动(ms)</div>'},
                {title: '<div style="width:100px">抖动标准差(ms)</div>'},
                {title: '<div style="width:100px">抖动方差(ms)</div>'},
                {title: '<div style="width:100px">丢包率(%)</div>'},
                {title: '<div style="width:100px">时延平均值(ms)</div>'},
                {title: '<div style="width:100px">时延标准差(ms)</div>'},
                {title: '<div style="width:100px">时延方差(ms)</div>'},
                {title: '<div style="width:100px">抖动平均值(ms)</div>'},
                {title: '<div style="width:100px">抖动标准差(ms)</div>'},
                {title: '<div style="width:100px">抖动方差(ms)</div>'},
                {title: '<div style="width:100px">丢包率(%)</div>'},
            ],
            rows: [],
            dtHandle: null,
        },
        methods: {
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
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
        mounted: function(obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function ( row, data, index ) {
                    var trs=$("#pingdata_table>thead tr");
                    if(trs.length>1){
                        return
                    }else if (index == 0) { //生成了行之后，开始生成表头>>>
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="7" style="text-align: center">ping(ICMP)</th>';
                        innerTh +='<th colspan="7" style="text-align: center">ping(TCP)</th>';
                        innerTh +='<th colspan="7" style="text-align: center">ping(UDP)</th>';
                        innerTh +='<th colspan="7" style="text-align: center">Trace Route(ICMP)</th>';
                        innerTh +='<th colspan="7" style="text-align: center">Trace Route(UDP)</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('pingdata_table').insertRow(0);
                        var $tr = $("#pingdata_table tr").eq(0);
                        $tr.after(innerTh);
                    }
                },
                searching: false,
                paging: false,
                serverSide: true,
                info: false,
                ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,

                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = outputContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    console.log(returnData);
                    let rows = [];
                    var i = 1;
                    outputContent.forEach(function (item) {
                            let row = [];
                            row.push(i);
                            row.push(item.exit);
                            row.push(item.probeName);
                            row.push(item.port);
                            row.push(st.get(item.serviceType));
                            row.push(fixed(item.score ));
                            row.push(fixed(item.pingIcmpDelay) );
                            row.push(fixed(item.pingIcmpDelaySRtd ));
                            row.push(fixed(item.pingIcmpDelayVar ));
                            row.push(fixed(item.pingIcmpJitter ));
                            row.push(fixed(item.pingIcmpJitterStd ));
                            row.push(fixed(item.pingIcmpJitterVar ));
                            row.push(fixed(item.pingIcmpLossRate ));
                            row.push(fixed(item.pingTcpDelay ));
                            row.push(fixed(item.pingTcpDelayStd) );
                            row.push(fixed(item.pingTcpDelayVar ));
                            row.push(fixed(item.pingTcpJitter ));
                            row.push(fixed(item.pingTcpJitterStd ));
                            row.push(fixed(item.pingTcpJitterVar ));
                            row.push(fixed(item.pingTcpLossRate ));
                            row.push(fixed(item.pingUdpDelay));
                            row.push(fixed(item.pingUdpDelayStd));
                            row.push(fixed(item.pingUdpDelayVar));
                            row.push(fixed(item.pingUdpJitter));
                            row.push(fixed(item.pingUdpJitterStd));
                            row.push(fixed(item.pingUdpJitterVar));
                            row.push(fixed(item.pingUdpLossRate));
                            row.push(fixed(item.tracertIcmpDelay));
                            row.push(fixed(item.tracertIcmpDelayStd));
                            row.push(fixed(item.tracertIcmpDelayVar));
                            row.push(fixed(item.tracertIcmpJitter));
                            row.push(fixed(item.tracertIcmpJitterStd));
                            row.push(fixed(item.tracertIcmpJitterVar));
                            row.push(fixed(item.tracertIcmpLossRate));
                            row.push(fixed(item.tracertTcpDelay));
                            row.push(fixed(item.tracertTcpDelayStd));
                            row.push(fixed(item.tracertTcpDelayVar));
                            row.push(fixed(item.tracertTcpJitter));
                            row.push(fixed(item.tracertTcpJitterStd));
                            row.push(fixed(item.tracertTcpJitterVar));
                            row.push(fixed(item.tracertTcpLossRate));
                            rows.push(row);

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#pingdata_table").colResizable({
                        liveDrag:true,
                        gripInnerHtml:"<div class='grip'></div>",
                        draggingClass:"dragging",
                        resizeMode:'overflow',
                    });
                }
            });
        }

    });
}
//网络质量表格
function quality(obj) {
    var id=obj.id;
    var quality_table=new Vue({
        el:'#qualitydata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
                {title: '<div style="width:70px">综合分数</div>'},
                {title: '<div style="width:100px">时延平均值(ms)</div>'},
                {title: '<div style="width:100px">往向时延(ms)</div>'},
                {title: '<div style="width:100px">返向时延(ms)</div>'},
                {title: '<div style="width:100px">抖动平均值</div>'},
                {title: '<div style="width:100px">往向抖动</div>'},
                {title: '<div style="width:100px">返向抖动</div>'},
                {title: '<div style="width:100px">丢包率</div>'},
                {title: '<div style="width:100px">时延平均值(ms)</div>'},
                {title: '<div style="width:100px">往向时延(ms)</div>'},
                {title: '<div style="width:100px">返向时延(ms)</div>'},
                {title: '<div style="width:100px">抖动平均值(ms)</div>'},
                {title: '<div style="width:100px">往向抖动(ms)</div>'},
                {title: '<div style="width:100px">返向抖动(ms)</div>'},
                {title: '<div style="width:100px">丢包率(%)</div>'},
                {title: '<div style="width:100px">时延平均值(ms)</div>'},
                {title: '<div style="width:100px">查询成功率(%)</div>'},
                {title: '<div style="width:100px">时延平均值(ms)</div>'},
                {title: '<div style="width:100px">查询成功率(%)</div>'},
                {title: '<div style="width:100px">时延平均值(ms)</div>'},
                {title: '<div style="width:100px">掉线率(%)</div>'},
                {title: '<div style="width:100px">查询成功率(%)</div>'},
                {title: '<div style="width:100px">时延平均值(ms)</div>'},
                {title: '<div style="width:100px">认证成功率(%)</div>'},

            ],
            rows: [],
            dtHandle: null,
        },
        methods: {
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
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
        mounted: function(obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function ( row, data, index ) {
                    var trs=$("#qualitydata_table>thead tr");
                    if(trs.length>1){
                        return
                    }else if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        var columnsCount = 25;//具体情况
                        innerTh +='<th colspan="7" style="text-align: center">Sla(TCP)</th>';
                        innerTh +='<th colspan="7" style="text-align: center">Sla(UDP)</th>';
                        innerTh +='<th colspan="2 " style="text-align: center">DNS</th>';
                        innerTh +='<th colspan="2" style="text-align: center">DHCP</th>';
                        innerTh +='<th colspan="3" style="text-align: center">ADSL</th>';
                        innerTh +='<th colspan="2"style="text-align: center">Radius</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('qualitydata_table').insertRow(0);
                        var $tr = $("#qualitydata_table tr").eq(0);
                        $tr.after(innerTh);
                    }
                },
                searching: false,
                paging: false,
                serverSide: true,
                info: false,
                ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,

                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = outputContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    console.log(returnData);
                    let rows = [];
                    var i = 1;
                    outputContent.forEach(function (item) {
                        if(id==item.port){
                            let row = [];
                            row.push(i);
                            row.push(item.probeName);
                            row.push(fixed(item.score ));
                            row.push(fixed(item.slaTcpDelay));
                            row.push(fixed(item.slaTcpGDelay));
                            row.push(fixed(item.slaTcpRDelay));
                            row.push(fixed(item.slaTcpJitter));
                            row.push(fixed(item.slaTcpGJitter));
                            row.push(fixed(item.slaTcpRJitter));
                            row.push(fixed(item.slaTcpLossRate));
                            row.push(fixed(item.slaUdpDelay));
                            row.push(fixed(item.slaUdpGDelay));
                            row.push(fixed(item.slaUdpRDelay));
                            row.push(fixed(item.slaUdpJitter));
                            row.push(fixed(item.slaUdpGJitter));
                            row.push(fixed(item.slaUdpRJitter));
                            row.push(fixed(item.slaUdpLossRate));
                            row.push(fixed(item.dnsDelay));
                            row.push(fixed(item.dnsSuccessRate));
                            row.push(fixed(item.dhcpDelay));
                            row.push(fixed(item.dhcpSuccessRate));
                            row.push(fixed(item.pppoeDelay));
                            row.push(fixed(item.pppoeDropRate));
                            row.push(fixed(item.pppoeSuccessRate));
                            row.push(fixed(item.radiusDelay));
                            row.push(fixed(item.radiusSuccessRate));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#qualitydata_table").colResizable({
                        liveDrag:true,
                        gripInnerHtml:"<div class='grip'></div>",
                        draggingClass:"dragging",
                        resizeMode:'overflow',
                    });
                }
            });
        }

    });
}

//网页浏览表格
function broswer(obj) {
    var id=obj.id;
    var broswer_table=new Vue({
        el:'#broswerdata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
                {title: '<div style="width:70px">综合分数</div>'},
                {title: '<div style="width:100px">DNS时延(ms)</div>'},
                {title: '<div style="width:100px">连接时延(ms)</div>'},
                {title: '<div style="width:100px">首字节时延(ms)</div>'},
                {title: '<div style="width:120px">页面文件时延(ms)</div>'},
                {title: '<div style="width:100px">重定向时延(ms)</div>'},
                {title: '<div style="width:100px">首屏时延(ms)</div>'},
                {title: '<div style="width:115px">页面元素时延(ms)</div>'},
                {title: '<div style="width:100px">下载速率(KB/S)</div>'},
            ],
            rows: [],
            dtHandle: null,
        },
        methods: {
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
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
        mounted: function(obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                serverSide: true,
                info: false,
                ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,

                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = outputContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    console.log(returnData);
                    let rows = [];
                    var i = 1;
                    outputContent.forEach(function (item) {
                        if(id==item.port){
                            let row = [];
                            row.push(i);
                            row.push(item.probeName);
                            row.push(item.score );
                            row.push(fixed(item.webpageDnsDelay) );
                            row.push(fixed(item.webpageConnDelay ));
                            row.push(fixed(item.webpageHeadbyteDelay));
                            row.push(fixed(item.webpagePageFileDelay ));
                            row.push(fixed(item.webpageRedirectDelay ));
                            row.push(fixed(item.webpageAboveFoldDelay ));
                            row.push(fixed(item.webpagePageElementDelay) );
                            row.push(fixed(item.webpageDownloadRate )*100);
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#broswerdata_table").colResizable({
                        liveDrag:true,
                        gripInnerHtml:"<div class='grip'></div>",
                        draggingClass:"dragging",
                        resizeMode:'overflow',
                    });
                }
            });
        }
    });
}
//下载
function download(obj) {
    var id=obj.id;
    //网页下载
    var download_table=new Vue({
        el:'#downloaddata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
                {title: '<div style="width:70px">综合分数</div>'},
                {title: '<div style="width:100px">DNS时延(ms)</div>'},
                {title: '<div style="width:100px">连接时延(ms)</div>'},
                {title: '<div style="width:100px">首字节时延(ms)</div>'},
                {title: '<div style="width:100px">下载速率(KB/S)</div>'},
                {title: '<div style="width:100px">DNS时延(ms)</div>'},
                {title: '<div style="width:100px">连接时延(ms)</div>'},
                {title: '<div style="width:100px">登录时延(ms)</div>'},
                {title: '<div style="width:100px">首字节时延(ms)</div>'},
                {title: '<div style="width:100px">下载速率(KB/S)</div>'},
                {title: '<div style="width:100px">DNS时延(ms)</div>'},
                {title: '<div style="width:100px">连接时延(ms)</div>'},
                {title: '<div style="width:100px">登录时延(ms)</div>'},
                {title: '<div style="width:100px">首字节时延(ms)</div>'},
                {title: '<div style="width:100px">下载速率(KB/S)</div>'},
            ],
            rows: [],
            dtHandle: null,
        },
        methods: {
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
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
        mounted: function(obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function ( row, data, index ) {
                    //生成了行之后，开始生成表头>>>
                    var trs=$("#downloaddata_table>thead tr");
                    if(trs.length>1){
                        return
                    }if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';

                        var columnsCount = 17;//具体情况
                        innerTh +='<th colspan="4" style="text-align: center">WEB下载</th>';
                        innerTh +='<th colspan="5" style="text-align: center">FTP下载</th>';
                        innerTh +='<th colspan="5" style="text-align: center">FTP上传</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('downloaddata_table').insertRow(0);
                        var $tr = $("#downloaddata_table tr").eq(0);
                        $tr.after(innerTh);
                    }
                },
                searching: false,
                paging: false,
                serverSide: true,
                info: false,
                ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,

                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = outputContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    console.log(returnData);
                    let rows = [];
                    var i = 1;
                    outputContent.forEach(function (item) {
                        if(id==item.port){
                            let row = [];
                            row.push(i);
                            row.push(item.probeName);
                            row.push(fixed(item.score) );
                            row.push(fixed(item.webDownloadDnsDelay ));
                            row.push(fixed(item.webDownloadConnDelay ));
                            row.push(fixed(item.webDownloadHeadbyteDelay ));
                            row.push(fixed(item.webDownloadDownloadRate ));
                            row.push(fixed(item.ftpDownloadDnsDelay));
                            row.push(fixed(item.ftpDownloadConnDelay));
                            row.push(fixed(item.ftpDownloadLoginDelay));
                            row.push(fixed(item.ftpDownloadHeadbyteDelay));
                            row.push(fixed(item.ftpDownloadDownloadRate));
                            row.push(fixed(item.ftpUploadDnsDelay));
                            row.push(fixed(item.ftpUploadConnDelay));
                            row.push(fixed(item.ftpUploadLoginDelay));
                            row.push(fixed(item.ftpUploadHeadbyteDelay));
                            row.push(fixed(item.ftpUploadUploadRate));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#downloaddata_table").colResizable({
                        liveDrag:true,
                        gripInnerHtml:"<div class='grip'></div>",
                        draggingClass:"dragging",
                        resizeMode:'overflow',
                    });
                }
            });
        }

    })
}
// /在线视频
function video(obj) {
    var id=obj.id;
    var video_table=new Vue({
        el:'#videodata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
                {title: '<div style="width:70px">综合分数</div>'},
                {title: '<div style="width:100px">DNS时延(ms)</div>'},
                {title: '<div style="width:100px">连接WEB服务器时延(ms)</div>'},
                {title: '<div style="width:120px">web页面时延(ms)</div>'},
                {title: '<div style="width:149px">连接调度服务器时延(ms)</div>'},
                {title: '<div style="width:135px">获取视频地址时延(ms)</div>'},
                {title: '<div style="width:147px">连接媒体服务器时延(ms)</div>'},
                {title: '<div style="width:110px">首帧时延(ms)</div>'},
                {title: '<div style="width:120px">首次缓冲时延(ms)</div>'},
                {title: '<div style="width:120px">视频加载时延(ms)</div>'},
                {title: '<div style="width:120px">总体缓冲时间(ms)</div>'},
                {title: '<div style="width:105px">下载速率(KB/S)</div>'},
                {title: '<div style="width:100px">缓冲次数</div>'},
            ],
            rows: [],
            dtHandle: null,
        },
        methods: {
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
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
        mounted: function(obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                serverSide: true,
                info: false,
                ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,

                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = outputContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    console.log(returnData);
                    let rows = [];
                    var i = 1;
                    outputContent.forEach(function (item) {
                        if(id==item.port){
                            let row = [];
                            row.push(i);
                            row.push(item.probeName);
                            row.push(fixed(item.score ));
                            row.push(fixed(item.webVideoDnsDelay ));
                            row.push(fixed(item.webVideoWsConnDelay ));
                            row.push(fixed(item.webVideoWebPageDelay ));
                            row.push(fixed(item.webVideoSsConnDelay));
                            row.push(fixed(item.webVideoAddressDelay));
                            row.push(fixed(item.webVideoMsConnDelay));
                            row.push(fixed(item.webVideoHeadFrameDelay ));
                            row.push(fixed(item.webVideoInitBufferDelay ));
                            row.push(fixed(item.webVideoLoadDelay ));
                            row.push(fixed(item.webVideoTotalBufferDelay ));
                            row.push(fixed(item.webVideoDownloadRate ));
                            row.push(fixed(item.webVideoBufferTime ));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#videodata_table").colResizable({
                        liveDrag:true,
                        gripInnerHtml:"<div class='grip'></div>",
                        draggingClass:"dragging",
                        resizeMode:'overflow',
                    });
                }
            });
        }

    })
}
//在线游戏
function game(obj) {
    var id=obj.id;
    var download_table=new Vue({
        el:'#gamedata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
                {title: '<div style="width:70px">综合分数</div>'},
                {title: '<div style="width:100px">DNS时延(ms)</div>'},
                {title: '<div style="width:100px">连接时延(ms)</div>'},
                {title: '<div style="width:100px">游戏数据包时延(ms)</div>'},
                {title: '<div style="width:100px">游戏数据包抖动(ms)</div>'},
                {title: '<div style="width:100px">游戏数据包丢包率(%)</div>'},
            ],
            rows: [],
            dtHandle: null,
        },
        methods: {
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
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
        mounted: function(obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                serverSide: true,
                info: false,
                ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,

                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = outputContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    console.log(returnData);
                    let rows = [];
                    var i = 1;
                    outputContent.forEach(function (item) {
                        if(id==item.port){
                            let row = [];
                            row.push(i);
                            row.push(item.probeName);
                            row.push(fixed(item.score ));
                            row.push(fixed(item.gameDnsDelay));
                            row.push(fixed(item.gameConnDelay ));
                            row.push(fixed(item.gamePacketDelay ));
                            row.push(fixed(item.gamePacketJitter ));
                            row.push(fixed(item.gameLossRate ));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#gamedata_table").colResizable({
                        liveDrag:true,
                        gripInnerHtml:"<div class='grip'></div>",
                        draggingClass:"dragging",
                        resizeMode:'overflow',
                    });
                }
            });
        }
    })
}

function fixed(value) {
    if(value==null){
        return ''
    }else if(value==0){
        return value
    } else{
        return value.toFixed(2)
    }
}