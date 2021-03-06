/**
 * Created by Fern on 2017/11/15.
 */
var status;
var cityNames = new Array();
var areaNames = new Array();
var probeNames = new Array();
var layers = new Map();
var citySelected=0;
var countrySelected=0;
var probeSelected=0;
var ping_list;
var quality_list;
var download_list;
var page_list;
var game_list;
var video_list;
var probedata_handle = new Vue({
    el: '#probehandle',
    data: {},
    mounted: function(){         /*动态加载测试任务组数据*/
        $.ajax({
            type: "POST",   /*GET会乱码*/
            url: "../../cem/city/list",//Todo:改成测试任务组的list方法
            cache: false,  //禁用缓存
            dataType: "json",
            /* contentType:"application/json",  /!*必须要,不可少*!/*/
            success: function (result) {
                for(var i=0;i<result.page.list.length;i++){
                    cityNames[i] = {message: result.page.list[i]}
                }
                search_data.cities = cityNames;
                setTimeout(function () {
                    $('div#city .jq22').comboSelect();
                    $('.combo-dropdown').css("z-index","3");
                    $('div#city .option-item').click(function (city) {
                        setTimeout(function () {
                            var a = $(city.currentTarget)[0].innerText;
                            clearArea(a);
                            citySelected = $($(city.currentTarget)[0]).data('value');
                            getArea(citySelected);
                            getProbeCity(citySelected);
                            $('div#city .combo-input').val(a);
                            $('div#city .combo-select select').val(a);
                        }, 50);
                    });
                    $('#city input[type=text] ').keyup(function (city) {
                        if( city.keyCode=='13'){
                            var b = $("#city .option-hover.option-selected").text();
                            clearArea(b);
                            var c=($("#city .option-hover.option-selected"));
                            var c=c[0].dataset
                            citySelected = c.value;
                            getArea(citySelected);
                            getProbeCity(citySelected);
                            $('#city .combo-input').val(b);
                            $('#city .combo-select select').val(b);
                        }
                    })
                }, 100);

            }
        });
    },
    methods: {

    }
});

var search_service = new Vue({ //Todo:完成查询条件框
    el: '#search',
    data: {
        /*name: [],
         scheduler: [],
         remark: []*/
    },
    // 在 `methods` 对象中定义方法
    methods: {
        testagentListsearch: function () {
            var searchJson = getFormJson($('#probesearch'));
            if((searchJson.startDate)>(searchJson.terminalDate)){
                //console.log("时间选择有误，请重新选择！");
                $('#nonavailable_time').modal('show');
            }else{
                var search = new Object();
                search.city_id = searchJson.city;
                search.county_id = searchJson.county;
                search.probe_id = searchJson.probe;
                if (searchJson.startDate.length != 0 && searchJson.terminalDate.length != 0 ) {
                    var ava_start = searchJson.startDate.substr(0, 10);
                    var ava_terminal = searchJson.terminalDate.substr(0, 10);
                    var startTime = searchJson.startDate.substr(11, 15);
                    var terminalTime = searchJson.terminalDate.substr(11, 15);
                    search.ava_start = ava_start;
                    search.ava_terminal = ava_terminal;
                    search.startTime = startTime+":00";
                    search.terminalTime = terminalTime+":00";
                }else{
                    search.ava_start = (new Date()).Format("yyyy-MM-dd");
                    search.ava_terminal = (new Date()).Format("yyyy-MM-dd");
                }
                let param = {};
                param.probedata = JSON.stringify(search);
                param.chartdata = JSON.stringify(search);
                sendAjax(param);
            }
        },
    }
});

function sendAjax(param) {
    loading();
    $.ajax({
        type: "POST",
        url: "../../recordhourping/connection",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
            ping_list=result.scoreList
            removeLoading('test');
             $("#pingdata_table").dataTable().fnDestroy();
            ping_table.reset(ping_list);

            var arr=[]
            for(var i=0;i<ping_list.length;i++){
                arr.push(parseFloat(ping_list[i].score));
            }
            var Maxvalue=arrMaxNum2(arr);
            var min=arrMinNum2(arr);
            var ava=arrAverageNum2(arr);
            connection_service.connection.max=Maxvalue
            connection_service.connection.average =ava;
            connection_service.connection.min=min;
            for (let i = 0; i < options.series.length; i++) {
                options.series[i].data = [];
            }
            for (let i = 0; i < options.series.length; i++) {
                for (let j = 0; j < ping_list.length; j++) {
                    let date_token = ping_list[j].recordDate.split("-");
                    let year = parseInt(date_token[0]);
                    let month = parseInt(date_token[1]) - 1;
                    let day = parseInt(date_token[2]);
                    let hour = parseInt(ping_list[j].recordTime);
                    if (isNaN(year) || isNaN(month) || isNaN(day)) {
                        continue;
                    }
                    options.series[i].data[j] = [Date.UTC(year, month, day, hour), ping_list[j].score];
                    options.series[i].data.sort(compare("0"));
                }


            }
            var chart = new Highcharts.Chart('container_connection', options);

        }
    })
    $.ajax({
        type: "POST",
        url: "../../recordhourping/quality",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
            quality_list=result.scoreList
            removeLoading('quality');
            $("#qualitydata_table").dataTable().fnDestroy();
            quality_table.reset(quality_list);
            var arr=[]
            for(var i=0;i<quality_list.length;i++){
                arr.push(parseFloat(quality_list[i].score));
            }
            var Maxvalue=arrMaxNum2(arr);
            var min=arrMinNum2(arr);
            var ava=arrAverageNum2(arr);
            quality_service.quality.max=Maxvalue
            quality_service.quality.average =ava;
            quality_service.quality.min=min;
            for (let i = 0; i < options.series.length; i++) {
                options.series[i].data = [];
            }
            for (let i = 0; i < options.series.length; i++) {
                for (let j = 0; j < quality_list.length; j++) {
                    let date_token = quality_list[j].recordDate.split("-");
                    let year = parseInt(date_token[0]);
                    let month = parseInt(date_token[1]) - 1;
                    let day = parseInt(date_token[2]);
                    let hour = parseInt(quality_list[j].recordTime);
                    if (isNaN(year) || isNaN(month) || isNaN(day)) {
                        continue;
                    }
                    options.series[i].data[j] = [Date.UTC(year, month, day, hour), quality_list[j].score];
                    options.series[i].data.sort(compare("0"));
                }

            }
            var chart = new Highcharts.Chart('container_quality', options);
        }
    })
    $.ajax({
        type: "POST",
        url: "../../recordhourping/page",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
            //console.log(result);
            page_list=result.scoreList
            removeLoading('page');
            $("#broswerdata_table").dataTable().fnDestroy();
            broswer_table.reset(page_list);
            var arr=[]
            for(var i=0;i<page_list.length;i++){
                arr.push(parseFloat(page_list[i].score));
            }
            var Maxvalue=arrMaxNum2(arr);
            var min=arrMinNum2(arr);
            var ava=arrAverageNum2(arr);
            page_service.page.max=Maxvalue
            page_service.page.average =ava;
            page_service.page.min=min;
            for (let i = 0; i < options.series.length; i++) {
                options.series[i].data = [];
            }
            for (let i = 0; i < options.series.length; i++) {
                for (let j = 0; j < page_list.length; j++) {
                    let date_token = page_list[j].recordDate.split("-");
                    let year = parseInt(date_token[0]);
                    let month = parseInt(date_token[1]) - 1;
                    let day = parseInt(date_token[2]);
                    let hour = parseInt(page_list[j].recordTime);
                    if (isNaN(year) || isNaN(month) || isNaN(day)) {
                        continue;
                    }
                    options.series[i].data[j] = [Date.UTC(year, month, day, hour), page_list[j].score];
                    options.series[i].data.sort(compare("0"));
                }

            }
            var chart = new Highcharts.Chart('container_page', options);

        }
    })
    $.ajax({
        type: "POST",
        url: "../../recordhourping/download",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
            download_list=result.scoreList;
            removeLoading('download');
            $("#downloaddata_table").dataTable().fnDestroy();
            download_table.reset(download_list);
            for (let i = 0; i < options.series.length; i++) {
                options.series[i].data = [];
            }
            var arr=[]
            for(var i=0;i<download_list.length;i++){
                arr.push(parseFloat(download_list[i].score));
            }
            var Maxvalue=arrMaxNum2(arr);
            var min=arrMinNum2(arr);
            var ava=arrAverageNum2(arr);
            download_service.download.max=Maxvalue
            download_service.download.average =ava;
            download_service.download.min=min;
            for (let i = 0; i < options.series.length; i++) {
                for (let j = 0; j < download_list.length; j++) {
                    let date_token = download_list[j].recordDate.split("-");
                    let year = parseInt(date_token[0]);
                    let month = parseInt(date_token[1]) - 1;
                    let day = parseInt(date_token[2]);
                    let hour = parseInt(download_list[j].recordTime);
                    if (isNaN(year) || isNaN(month) || isNaN(day)) {
                        continue;
                    }
                    options.series[i].data[j] = [Date.UTC(year, month, day, hour), download_list[j].score];
                    options.series[i].data.sort(compare("0"));
                }

            }
            var chart = new Highcharts.Chart('container_download', options);
        }
    })
    $.ajax({
        type: "POST",
        url: "../../recordhourping/video",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
            video_list=result.scoreList
            removeLoading('video');
            $("#videodata_table").dataTable().fnDestroy();
            video_table.reset(video_list);
            var arr=[]
            for(var i=0;i<video_list.length;i++){
                arr.push(parseFloat(video_list[i].score));
            }
            var Maxvalue=arrMaxNum2(arr);
            var min=arrMinNum2(arr);
            var ava=arrAverageNum2(arr);
            video_service.video.max=Maxvalue
            video_service.video.average =ava;
            video_service.video.min=min;
            for (let i = 0; i < options.series.length; i++) {
                options.series[i].data = [];
            }
            for (let i = 0; i < options.series.length; i++) {
                for (let j = 0; j < video_list.length; j++) {
                    let date_token = video_list[j].recordDate.split("-");
                    let year = parseInt(date_token[0]);
                    let month = parseInt(date_token[1]) - 1;
                    let day = parseInt(date_token[2]);
                    let hour = parseInt(video_list[j].recordTime);
                    if (isNaN(year) || isNaN(month) || isNaN(day)) {
                        continue;
                    }
                    options.series[i].data[j] = [Date.UTC(year, month, day, hour), video_list[j].score];
                    options.series[i].data.sort(compare("0"));
                }

            }
            var chart = new Highcharts.Chart('container_video', options);
        }
    })
    $.ajax({
        type: "POST",
        url: "../../recordhourping/game",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (result) {
            game_list=result.scoreList;
            removeLoading('game');
            $("#gamedata_table").dataTable().fnDestroy();
            game_table.reset(game_list);
            var arr=[]
            for(var i=0;i<game_list.length;i++){
                arr.push(parseFloat(game_list[i].score));
            }
            var Maxvalue=arrMaxNum2(arr);
            var min=arrMinNum2(arr);
            var ava=arrAverageNum2(arr);
            game_service.game.max=Maxvalue
            game_service.game.average =ava;
            game_service.game.min=min;
            for (let i = 0; i < options.series.length; i++) {
                options.series[i].data = [];
            }
            for (let i = 0; i < options.series.length; i++) {
                for (let j = 0; j < game_list.length; j++) {
                    let date_token = game_list[j].recordDate.split("-");
                    let year = parseInt(date_token[0]);
                    let month = parseInt(date_token[1]) - 1;
                    let day = parseInt(date_token[2]);
                    let hour = parseInt(game_list[j].recordTime);
                    if (isNaN(year) || isNaN(month) || isNaN(day)) {
                        continue;
                    }
                    options.series[i].data[j] = [Date.UTC(year, month, day, hour), game_list[j].score];
                    options.series[i].data.sort(compare("0"));
                }

            }
            var chart = new Highcharts.Chart('container_game', options);

        }
    })

}

function getFormJson(form) {      /*将表单对象变为json对象*/
    var o = {};
    var a = $(form).serializeArray();
    if(citySelected!=0) {
        a[2] = {};
        a[2].name = "city";
        a[2].value = citySelected;
    }
    if(citySelected!=0&&countrySelected!=0){
        a[3]={};
        a[3].name="county";
        a[3].value=countrySelected;
    }
    if(probeSelected!=0){
        a[4]={};
        a[4].name="probe";
        a[4].value=probeSelected;
    }
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
}


var search_data = new Vue({
    el:'#probesearch',
    data:{
        areas:[],
        cities:[],
        probe:[],
        probegroup_names:[],
        accessLayers:[],
        types:[],
        status:[]
    },
    methods:{
        citychange: function () {
            this.areas = getArea($("#selectcity").val());
            //console.log($("#selectcity").val());
        },
        areachange: function () {
            this.probe = getProbe($("#selectarea").val());
            //console.log($("#selectarea").val());
        }
    }
});

//区域
var getArea = function (cityid) {
    countrySeleted=0;
    $.ajax({
        url: "../../cem/county/info/" + cityid,
        type: "POST",
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            search_data.areas = [];
            areaNames = [];
            for (let i = 0; i < result.county.length; i++) {
                areaNames[i] = {message: result.county[i]}
            }
            search_data.areas = areaNames;
            setTimeout(function () {
                $('#country .jq22').comboSelect();
                $('.combo-dropdown').css("z-index","3");
                $('#country .option-item').click(function (areas) {
                    setTimeout(function () {
                        var a = $(areas.currentTarget)[0].innerText;
                        countrySelected = $($(areas.currentTarget)[0]).data('value');
                        $('#country .combo-input').val(a);
                        $('#country .combo-select select').val(a);
                        getProbe(countrySelected);
                    },20)

                });
                $('#country input[type=text] ').keyup(function (areas) {
                    if( areas.keyCode=='13'){
                        var b = $("#country .option-hover.option-selected").text();
                        countrySelected=$("#country .option-hover.option-selected")[0].dataset.value;
                        $('#country .combo-input').val(b);
                        $('#country .combo-select select').val(b);
                        getProbe(countrySelected);
                    }
                })
            }, 50);

        }
    });
};
//城市探针
var getProbeCity = function (cityid) {
    probeSelected = 0;
    if (cityid != "" && cityid != null){
        $.ajax({//探针信息
            url: "../../cem/probe/infoByCity/" + cityid,
            type: "POST",
            cache: false,  //禁用缓存
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                var probes = [];
                for (var i = 0; i < result.probe.length; i++) {
                    probes[i] = {message: result.probe[i]}
                }
                search_data.probe = probes;
                setTimeout(function () {
                    $('#probe .jq22').comboSelect();
                    $('#probe .option-item').click(function (probe) {
                        setTimeout(function () {
                            var a = $(probe.currentTarget)[0].innerText;
                            probeSelected = $($(probe.currentTarget)[0]).data('value');
                            $('#probe .combo-input').val(a);
                            $('#probe .combo-select select').val(a);
                        }, 30);
                    });
                    $('#probe input[type=text] ').keyup(function (probe) {
                        if( probe.keyCode=='13'){
                            var b = $("#probe .option-hover.option-selected").text();
                            probeSelected=$("#probe .option-hover.option-selected")[0].dataset.value;
                            $('#probe .combo-input').val(b);
                            $('#probe .combo-select select').val(b);
                        }

                    })
                }, 50);
            }
        });
    }

};
//探针
var getProbe = function (countyid) {
    probeSelected = 0;
    $.ajax({//探针信息
        url: "../../cem/probe/info/" + countyid,
        type: "POST",
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var probes = [];
            for (var i = 0; i < result.probe.length; i++) {
                probes[i] = {message: result.probe[i]}
            }
            search_data.probe = probes;
            setTimeout(function () {
                $('#probe .jq22').comboSelect();
                $('.combo-dropdown').css("z-index","3");
                $('#probe .option-item').click(function (probe) {
                    setTimeout(function () {
                        var a = $(probe.currentTarget)[0].innerText;
                        probeSelected = $($(probe.currentTarget)[0]).data('value');
                        $('#probe .combo-input').val(a);
                        $('#probe .combo-select select').val(a);
                    }, 30);
                });
                $('#probe input[type=text] ').keyup(function (probe) {
                    if( probe.keyCode=='13'){
                        var b = $("#probe .option-hover.option-selected").text();
                        probeSelected=$("#probe .option-hover.option-selected")[0].dataset.value;
                        $('#probe .combo-input').val(b);
                        $('#probe .combo-select select').val(b);
                    }

                })
            }, 50);
        }
    });
};

$(function () {
    loading();
});

//最大值
function arrMaxNum2(arr){
    if(arr.length==0){
        return 0
    }else {
        return Math.max.apply(null,arr);
    }

}
//最小值
function arrMinNum2(arr){
    if(arr.length==0){
        return 0
    }else {
        return Math.min.apply(null, arr);
    }
}
//平均值
function arrAverageNum2(arr){
    if(arr.length==0){
        return 0
    }else {
        var sum = eval(arr.join("+"));
        return ~~(sum / arr.length * 100) / 100;
    }
}
var connection_service = new Vue({
    el: '#v-for-connection',
    data: {
        connection: {
            max: 0,
            average: 0,
            min: 0
        },
        probedata: {ava_start:(new Date()).Format("yyyy-MM-dd"), ava_terminal:(new Date()).Format("yyyy-MM-dd")},

    },

});

var connection=new Vue({
    el:'#container_connection',
    data:{
        probedata: {ava_start:(new Date()).Format("yyyy-MM-dd"), ava_terminal:(new Date()).Format("yyyy-MM-dd")}
    },
    mounted:function () {
        let param={};
        param.chartdata = JSON.stringify(this.probedata);
        $.ajax({
            type: "POST",
            url: "../../recordhourping/connection",
            cache: false,  //禁用缓存
            data: param,  //传入组装的参数
            dataType: "json",
            success: function (result) {
                ping_list = result.scoreList
                ping_table.reset(ping_list);
                removeLoading('test');
                var arr=[]
                for(var i=0;i<ping_list.length;i++){
                    arr.push(parseFloat(ping_list[i].score));
                }
                var Maxvalue=arrMaxNum2(arr);
                var min=arrMinNum2(arr);
                var ava=arrAverageNum2(arr);
                connection_service.connection.max=Maxvalue
                connection_service.connection.average =ava;
                connection_service.connection.min=min;
                for (let i = 0; i < options.series.length; i++) {
                    options.series[i].data = [];
                }
                for (let i = 0; i < options.series.length; i++) {
                    for (let j = 0; j < ping_list.length; j++) {
                            let date_token = ping_list[j].recordDate.split("-");
                            let year = parseInt(date_token[0]);
                            let month = parseInt(date_token[1]) - 1;
                            let day = parseInt(date_token[2]);
                            let hour = parseInt(ping_list[j].recordTime);
                            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                                continue;
                            }
                            options.series[i].data[j] = [Date.UTC(year, month, day, hour), ping_list[j].score];
                            options.series[i].data.sort(compare("0"));
                    }


                }
                var chart = new Highcharts.Chart('container_connection', options);
            }
        })
    }

})

var quality_service = new Vue({
    el: '#v-for-quality',
    data: {
        quality: {
            max: 0,
            average: 0,
            min: 0
        },
        probedata: {ava_start:(new Date()).Format("yyyy-MM-dd"), ava_terminal:(new Date()).Format("yyyy-MM-dd")}
    },
    methods:{
    },
    mounted:function () {
        let param={};
        let vm=this
        param.chartdata = JSON.stringify(this.probedata);
        $.ajax({
            type: "POST",
            url: "../../recordhourping/quality",
            cache: false,  //禁用缓存
            data: param,  //传入组装的参数
            dataType: "json",
            success: function (result) {
                quality_list=result.scoreList
                    removeLoading('quality');
               quality_table.reset(quality_list);
                var arr=[]
                for(var i=0;i<quality_list.length;i++){
                    arr.push(parseFloat(quality_list[i].score));
                }
                var Maxvalue=arrMaxNum2(arr);
                var min=arrMinNum2(arr);
                var ava=arrAverageNum2(arr);
                vm.quality.max=Maxvalue
                vm.quality.average =ava;
                vm.quality.min=min;
                for (let i = 0; i < options.series.length; i++) {
                    options.series[i].data = [];
                }
                for (let i = 0; i < options.series.length; i++) {
                    for (let j = 0; j < quality_list.length; j++) {
                        let date_token = quality_list[j].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(quality_list[j].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        options.series[i].data[j] = [Date.UTC(year, month, day, hour), quality_list[j].score];
                        options.series[i].data.sort(compare("0"));
                    }

                }
                var chart = new Highcharts.Chart('container_quality', options);

            }
        })
    }
});

var download_service = new Vue({
    el: '#v-for-download',
    data: {
        download: {
            max: 0,
            average: 0,
            min: 0
        },
        probedata: {ava_start:(new Date()).Format("yyyy-MM-dd"), ava_terminal:(new Date()).Format("yyyy-MM-dd")}
    },
    methods:{
    },
    mounted:function () {
        let param={};
        let vm=this
        param.chartdata = JSON.stringify(this.probedata);
        $.ajax({
            type: "POST",
            url: "../../recordhourping/download",
            cache: false,  //禁用缓存
            data: param,  //传入组装的参数
            dataType: "json",
            success: function (result) {
                download_list=result.scoreList
                removeLoading('download');
                download_table.reset(download_list);
                var arr=[]
                for(var i=0;i<download_list.length;i++){
                    arr.push(parseFloat(download_list[i].score));
                }
                var Maxvalue=arrMaxNum2(arr);
                var min=arrMinNum2(arr);
                var ava=arrAverageNum2(arr);
                vm.download.max=Maxvalue
                vm.download.average =ava;
                vm.download.min=min;
                for (let i = 0; i < options.series.length; i++) {
                    options.series[i].data = [];
                }
                for (let i = 0; i < options.series.length; i++) {
                    for (let j = 0; j < download_list.length; j++) {
                        let date_token = download_list[j].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(download_list[j].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        options.series[i].data[j] = [Date.UTC(year, month, day, hour), download_list[j].score];
                        options.series[i].data.sort(compare("0"));
                    }

                }
                var chart = new Highcharts.Chart('container_download', options);
            }
        })
    }
});

var page_service = new Vue({
    el: '#v-for-page',
    data: {
        page: {
            max: 0,
            average: 0,
            min: 0
        },
        probedata: {ava_start:(new Date()).Format("yyyy-MM-dd"), ava_terminal:(new Date()).Format("yyyy-MM-dd")}
    },
    methods:{
    },
    mounted:function () {
        let param={};
        let vm=this
        param.chartdata = JSON.stringify(this.probedata);
        $.ajax({
            type: "POST",
            url: "../../recordhourping/page",
            cache: false,  //禁用缓存
            data: param,  //传入组装的参数
            dataType: "json",
            success: function (result) {
                page_list=result.scoreList
                    removeLoading('page');
                broswer_table.reset(page_list);
                var arr=[]
                for(var i=0;i<page_list.length;i++){
                    arr.push(parseFloat(page_list[i].score));
                }
                var Maxvalue=arrMaxNum2(arr);
                var min=arrMinNum2(arr);
                var ava=arrAverageNum2(arr);
                vm.page.max=Maxvalue
                vm.page.average =ava;
                vm.page.min=min;
                for (let i = 0; i < options.series.length; i++) {
                    options.series[i].data = [];
                }
                for (let i = 0; i < options.series.length; i++) {
                    for (let j = 0; j < page_list.length; j++) {
                        let date_token = page_list[j].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(page_list[j].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        options.series[i].data[j] = [Date.UTC(year, month, day, hour), page_list[j].score];
                        options.series[i].data.sort(compare("0"));
                    }

                }
                var chart = new Highcharts.Chart('container_page', options);
            }
        })
    }
});

var video_service = new Vue({
    el: '#v-for-video',
    data: {
        video: {
            max: 0,
            average: 0,
            min: 0
        },
        probedata: {ava_start:(new Date()).Format("yyyy-MM-dd"), ava_terminal:(new Date()).Format("yyyy-MM-dd")}
    },
    methods:{
    },
    mounted:function () {
        let param={};
        let vm=this;
        param.chartdata = JSON.stringify(this.probedata);
        $.ajax({
            type: "POST",
            url: "../../recordhourping/video",
            cache: false,  //禁用缓存
            data: param,  //传入组装的参数
            dataType: "json",
            success: function (result) {
                video_list=result.scoreList
                 removeLoading('video');
                video_table.reset(video_list);
                var arr=[]
                for(var i=0;i<video_list.length;i++){
                    arr.push(parseFloat(video_list[i].score));
                }
                var Maxvalue=arrMaxNum2(arr);
                var min=arrMinNum2(arr);
                var ava=arrAverageNum2(arr);
                vm.video.max=Maxvalue
                vm.video.average =ava;
                vm.video.min=min;
                for (let i = 0; i < options.series.length; i++) {
                    options.series[i].data = [];
                }
                for (let i = 0; i < options.series.length; i++) {
                    for (let j = 0; j < video_list.length; j++) {
                        let date_token = video_list[j].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(video_list[j].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        options.series[i].data[j] = [Date.UTC(year, month, day, hour), video_list[j].score];
                        options.series[i].data.sort(compare("0"));
                    }

                }
                var chart = new Highcharts.Chart('container_video', options);

            }
        })
    }
});

var game_service = new Vue({
    el: '#v-for-game',
    data: {
        game: {
            max: 0,
            average: 0,
            min: 0
        },
        probedata: {ava_start:(new Date()).Format("yyyy-MM-dd"), ava_terminal:(new Date()).Format("yyyy-MM-dd")}
    },
    methods:{
    },
    mounted:function () {
        let param={};
        let vm=this
        param.chartdata = JSON.stringify(this.probedata);
        $.ajax({
            type: "POST",
            url: "../../recordhourping/game",
            cache: false,  //禁用缓存
            data: param,  //传入组装的参数
            dataType: "json",
            success: function (result) {
                game_list=result.scoreList
                    removeLoading('video');
                game_table.reset(game_list);
                var arr=[]
                for(var i=0;i<game_list.length;i++){
                    arr.push(parseFloat(game_list[i].score));
                }
                var Maxvalue=arrMaxNum2(arr);
                var min=arrMinNum2(arr);
                var ava=arrAverageNum2(arr);
                vm.game.max=Maxvalue
                vm.game.average =ava;
                vm.game.min=min;
                for (let i = 0; i < options.series.length; i++) {
                    options.series[i].data = [];
                }
                for (let i = 0; i < options.series.length; i++) {
                    for (let j = 0; j < game_list.length; j++) {
                        let date_token = game_list[j].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(game_list[j].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        options.series[i].data[j] = [Date.UTC(year, month, day, hour), game_list[j].score];
                        options.series[i].data.sort(compare("0"));
                    }

                }
                var chart = new Highcharts.Chart('container_game', options);

            }
        })
    }
});

var options = {
    chart: {
        type: 'spline',
        // events: {
        //     load: function () {
        //         $('.highcharts-tooltip').hide();
        //     }
        // }
    },
    title: {
        text: ''
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            day: '%Y-%m-%d',
            week: '%Y-%m-%d',
            month: '%Y-%m-%d',
            year: '%Y-%m-%d'
        },
        title: {
            text: ''
        }
    },
    yAxis: {
        title: {
            text: '结果(分)'
        },
        min: 0,
        max: 100
    },
    legend: {
        enabled: false
    },
    tooltip: {
        crosshairs: true,
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '日期:{point.x:%Y-%m-%d %H:00:00} 分数:{point.y:.2f}分',
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: false
            }
        },
        series: {
            stickyTracking: false,
            events: {
                mouseOver: function () {
                    $('.highcharts-tooltip').show();
                },
                mouseOut: function () {
                    $('.highcharts-tooltip').hide();
                }
            }
        }
    },
    series: [{
        name:'分数',
        data:[]
    }]
};


function   connection_info() {     /*监听修改触发事件*/
   $("#myModal_connection").modal('show')
}


function   quality_info() {     /*监听修改触发事件*/
    $("#myModal_quality").modal('show')
}


function   broswer_info() {     /*监听修改触发事件*/
    $("#myModal_broswer").modal('show')
}


function   download_info() {     /*监听修改触发事件*/
    $("#myModal_download").modal('show')
}


function   video_info() {     /*监听修改触发事件*/
    $("#myModal_video").modal('show')
}


function   game_info() {     /*监听修改触发事件*/
    $("#myModal_game").modal('show')
}



var ping_table=new Vue({
    el:'#pingdata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
            {title: '<div style="width:130px">时间</div>'},
            {title: '<div style="width:70px">综合分数</div>'},
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
            {title: '<div style="width:100px">往返时延(ms)</div>'},
            {title: '<div style="width:100px">时延标准差(ms)</div>'},
            {title: '<div style="width:100px">时延方差(ms)</div>'},
            {title: '<div style="width:100px">抖动</div>'},
            {title: '<div style="width:100px">抖动标准差(ms)</div>'},
            {title: '<div style="width:100px">抖动方差(ms)</div>'},
            {title: '<div style="width:100px">丢包率(%)</div>'},
        ],
        rows: [],
        dtHandle: null,
    },
    methods: {
        reset: function (probeContent) {
            let vm = this;
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                // serverSide: true,
                info: false,
                scrollY:  300,
                scrollX:  true,
                scrollCollapse: true,
                // fixedColumns:   {
                //     leftColumns:4
                // },
                oLanguage: {
                    sEmptyTable: "No data available in table",
                    sZeroRecords:"No data available in table",
                },
                sDom: 'Rfrtlip', /*显示在左下角*/
                createdRow: function ( row, data, index ) {

                    var trs=$("#pingdata_table_wrapper>.dataTables_scroll>.dataTables_scrollHead>.dataTables_scrollHeadInner>table>thead>tr");

                    if(trs.length>1){
                        return
                    } else if (index == 0) { //生成了行之后，开始生成表头>>>
                        var innerTh = '<tr><th rowspan="1"></th>';
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
                        var $tr = trs.eq(0);
                        $tr.before(innerTh);
                    }
                },
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = probeContent;//返回的数据列表
                    if(probeContent.length==0){
                        return
                    }
                    // // 重新整理返回数据以匹配表格
                    var temp = cloneObj(probeContent);
                    for (let i = 0; i < temp.length; i++) {
                        let date_token = probeContent[i].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(probeContent[i].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        temp[i].datetime = Date.UTC(year, month, day, hour)
                    }
                    var sortTemp = temp.sort(compare("datetime"));
                    let rows = [];
                    var i = 1;

                    sortTemp.forEach(function (item) {
                        let row = [];
                        row.push(i++);
                        row.push(item.probeName);
                        row.push(item.recordDate.substr(0,10)+"   "+item.recordTime.substr(0,10)+':00');
                        row.push(fixed(item.score));
                        row.push(fixed(item.pingIcmpDelay));
                        row.push(fixed(item.pingIcmpDelayStd));
                        row.push(fixed(item.pingIcmpDelayVar));
                        row.push(fixed(item.pingIcmpJitter));
                        row.push(fixed(item.pingIcmpJitterStd));
                        row.push(fixed(item.pingIcmpJitterVar));
                        row.push(fixedRate(item.pingIcmpLossRate));
                        row.push(fixed(item.pingTcpDelay));
                        row.push(fixed(item.pingTcpDelayStd));
                        row.push(fixed(item.pingTcpDelayVar));
                        row.push(fixed(item.pingTcpJitter));
                        row.push(fixed(item.pingTcpJitterStd));
                        row.push(fixed(item.pingTcpJitterVar));
                        row.push(fixedRate(item.pingTcpLossRate));
                        row.push(fixed(item.pingUdpDelay));
                        row.push(fixed(item.pingUdpDelayStd));
                        row.push(fixed(item.pingUdpDelayVar));
                        row.push(fixed(item.pingUdpJitter));
                        row.push(fixed(item.pingUdpJitterStd));
                        row.push(fixed(item.pingUdpJitterVar));
                        row.push(fixedRate(item.pingUdpLossRate));
                        row.push(fixed(item.tracertIcmpDelay));
                        row.push(fixed(item.tracertIcmpDelayStd));
                        row.push(fixed(item.tracertIcmpDelayVar));
                        row.push(fixed(item.tracertIcmpJitter));
                        row.push(fixed(item.tracertIcmpJitterStd));
                        row.push(fixed(item.tracertIcmpJitterVar));
                        row.push(fixedRate(item.tracertIcmpLossRate));
                        row.push(fixed(item.tracertTcpDelay));
                        row.push(fixed(item.tracertTcpDelayStd));
                        row.push(fixed(item.tracertTcpDelayVar));
                        row.push(fixed(item.tracertTcpJitter));
                        row.push(fixed(item.tracertTcpJitterStd));
                        row.push(fixed(item.tracertTcpJitterVar));
                        row.push(fixedRate(item.tracertTcpLossRate));
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
        },
        currReset: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("当前页面重绘");
            vm.dtHandle.draw(false);
            /*当前页面重绘*/
        },
        redraw: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("页面重绘");
            vm.dtHandle.draw();
            /*重绘*/
        }
    },
    mounted: function(obj) {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }

});

var quality_table=new Vue({
    el:'#qualitydata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
            {title: '<div style="width:130px">时间</div>'},
            {title: '<div style="width:70px">综合分数</div>'},
            {title: '<div style="width:100px">解析时延(ms)</div>'},
            {title: '<div style="width:100px">成功率(%)</div>'},
            {title: '<div style="width:100px">时延(ms)</div>'},
            {title: '<div style="width:100px">往向时延(ms)</div>'},
            {title: '<div style="width:100px">返向时延(ms)</div>'},
            {title: '<div style="width:100px">抖动</div>'},
            {title: '<div style="width:100px">往向抖动</div>'},
            {title: '<div style="width:100px">返向抖动</div>'},
            {title: '<div style="width:100px">丢包率</div>'},
            {title: '<div style="width:100px">时延(ms)</div>'},
            {title: '<div style="width:100px">往向时延(ms)</div>'},
            {title: '<div style="width:100px">返向时延(ms)</div>'},
            {title: '<div style="width:100px">抖动(ms)</div>'},
            {title: '<div style="width:100px">往向抖动(ms)</div>'},
            {title: '<div style="width:100px">返向抖动(ms)</div>'},
            {title: '<div style="width:100px">丢包率(%)</div>'},



            {title: '<div style="width:100px">分配时延(ms)</div>'},
            {title: '<div style="width:100px">成功率(%)</div>'},

            {title: '<div style="width:100px">解析时延(ms)</div>'},
            {title: '<div style="width:100px">掉线率(%)</div>'},
            {title: '<div style="width:100px">成功率(%)</div>'},

            {title: '<div style="width:100px">认证时延(ms)</div>'},
            {title: '<div style="width:100px">认证成功率(%)</div>'},

        ],
        rows: [],
        dtHandle: null,
    },
    methods: {
        reset: function (probeContent) {
            let vm = this;
            // vm.probedata = {};
            // /*清空probedata*/
            // vm.dtHandle.clear();
            // //console.log("重置");
            // vm.dtHandle.draw();
            /*重置*/
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function ( row, data, index ) {
                    var trs=$("#qualitydata_table_wrapper>.dataTables_scroll>.dataTables_scrollHead>.dataTables_scrollHeadInner>table>thead>tr");

                    if(trs.length>1){
                        return
                    }else if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        var columnsCount = 25;//具体情况
                        innerTh +='<th colspan="2 " style="text-align: center">DNS</th>';
                        innerTh +='<th colspan="7" style="text-align: center">Sla(TCP)</th>';
                        innerTh +='<th colspan="7" style="text-align: center">Sla(UDP)</th>';

                        innerTh +='<th colspan="2" style="text-align: center">DHCP</th>';
                        innerTh +='<th colspan="3" style="text-align: center">ADSL</th>';
                        innerTh +='<th colspan="2"style="text-align: center">Radius</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('qualitydata_table').insertRow(0);
                        var $tr = trs.eq(0);
                        $tr.before(innerTh);
                    }
                },
                searching: false,
                paging: false,
                // serverSide: true,
                info: false,
                // ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,
                scrollY:  300,
                scrollX:  true,
                scrollCollapse: true,
                oLanguage: {
                    sEmptyTable: "No data available in table",
                    sZeroRecords:"No data available in table",
                },
                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = probeContent;//返回的数据列表
                    if(probeContent.length==0){
                        return
                    }
                    // // 重新整理返回数据以匹配表格
                    var temp = cloneObj(probeContent);
                    for (let i = 0; i < temp.length; i++) {
                        let date_token = probeContent[i].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(probeContent[i].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        temp[i].datetime = Date.UTC(year, month, day, hour)
                    }
                    var sortTemp = temp.sort(compare("datetime"));
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    sortTemp.forEach(function (item) {
                        let row = [];
                        row.push(i++);
                        row.push(item.probeName);
                        row.push(item.recordDate.substr(0,10)+"   "+item.recordTime.substr(0,10)+':00');
                        row.push(fixed(item.score));
                        row.push(fixed(item.dnsDelay));
                        row.push(fixedRate(item.dnsSuccessRate));
                        row.push(fixed(item.slaTcpDelay));
                        row.push(fixed(item.slaTcpGDelay));
                        row.push(fixed(item.slaTcpRDelay));
                        row.push(fixed(item.slaTcpJitter));
                        row.push(fixed(item.slaTcpGJitter));
                        row.push(fixed(item.slaTcpRJitter));
                        row.push(fixedRate(item.slaTcpLossRate));
                        row.push(fixed(item.slaUdpDelay));
                        row.push(fixed(item.slaUdpGDelay));
                        row.push(fixed(item.slaUdpRDelay));
                        row.push(fixed(item.slaUdpJitter));
                        row.push(fixed(item.slaUdpGJitter));
                        row.push(fixed(item.slaUdpRJitter));
                        row.push(fixedRate(item.slaUdpLossRate));

                        row.push(fixed(item.dhcpDelay));
                        row.push(fixed(item.dhcpSuccessRate));
                        row.push(fixed(item.pppoeDelay));
                        row.push(fixedRate(item.pppoeDropRate));
                        row.push(fixedRate(item.pppoeSuccessRate));
                        row.push(fixed(item.radiusDelay));
                        row.push(fixedRate(item.radiusSuccessRate));
                        rows.push(row);
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
        },
        currReset: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("当前页面重绘");
            vm.dtHandle.draw(false);
            /*当前页面重绘*/
        },
        redraw: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("页面重绘");
            vm.dtHandle.draw();
            /*重绘*/
        }
    },
    mounted: function(obj) {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }

});

var broswer_table=new Vue({
    el:'#broswerdata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
            {title: '<div style="width:130px">时间</div>'},
            {title: '<div style="width:70px">综合分数</div>'},
            {title: '<div style="width:100px">DNS时延(ms)</div>'},
            {title: '<div style="width:100px">连接时延(ms)</div>'},
            {title: '<div style="width:100px">首字节时延(ms)</div>'},
            {title: '<div style="width:120px">页面文件时延(ms)</div>'},
            {title: '<div style="width:100px">重定向时延(ms)</div>'},
            {title: '<div style="width:100px">首屏时延(ms)</div>'},
            {title: '<div style="width:115px">页面加载时延(ms)</div>'},
            {title: '<div style="width:100px">下载速率(KB/s)</div>'},
            {title: '<div style="width:100px">失败率(KB/s)</div>'},
        ],
        rows: [],
        dtHandle: null,
    },
    methods: {
        reset: function (probeContent) {
            let vm = this;
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                // serverSide: true,
                info: false,
                scrollY:  300,
                scrollX:  true,
                scrollCollapse: true,
                // ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,
                oLanguage: {
                    sEmptyTable: "No data available in table",
                    sZeroRecords:"No data available in table",
                },
                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = probeContent;//返回的数据列表
                    if(probeContent.length==0){
                        return
                    }
                    // // 重新整理返回数据以匹配表格
                    var temp = cloneObj(probeContent);
                    for (let i = 0; i < temp.length; i++) {
                        let date_token = probeContent[i].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(probeContent[i].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        temp[i].datetime = Date.UTC(year, month, day, hour)
                    }
                    var sortTemp = temp.sort(compare("datetime"));


                    let rows = [];
                    var i = 1;
                    sortTemp.forEach(function (item) {
                        let row = [];
                        row.push(i++);
                        row.push(item.probeName);
                        row.push(item.recordDate.substr(0,10)+"   "+item.recordTime.substr(0,10)+':00');
                        row.push(fixed(item.score));
                        row.push(fixed(item.webpageDnsDelay));
                        row.push(fixed(item.webpageConnDelay));
                        row.push(fixed(item.webpageHeadbyteDelay));
                        row.push(fixed(item.webpagePageFileDelay));
                        row.push(fixed(item.webpageRedirectDelay));
                        row.push(fixed(item.webpageAboveFoldDelay));
                        row.push(fixed(item.webpageLoadDelay));
                        row.push(fixed(item.webpageDownloadRate));
                        row.push(fixed(item.fail/item.total));
                        rows.push(row);

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
            /*重置*/
        },
        currReset: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("当前页面重绘");
            vm.dtHandle.draw(false);
            /*当前页面重绘*/
        },
        redraw: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("页面重绘");
            vm.dtHandle.draw();
            /*重绘*/
        }
    },
    mounted: function(obj) {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }
});

var download_table=new Vue({
    el:'#downloaddata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
            {title: '<div style="width:130px">时间</div>'},
            {title: '<div style="width:70px">综合分数</div>'},
            {title: '<div style="width:100px">DNS时延(ms)</div>'},
            {title: '<div style="width:100px">连接时延(ms)</div>'},
            {title: '<div style="width:100px">首字节时延(ms)</div>'},
            {title: '<div style="width:100px">下载速率(KB/s)</div>'},
            {title: '<div style="width:100px">DNS时延(ms)</div>'},
            {title: '<div style="width:100px">连接时延(ms)</div>'},
            {title: '<div style="width:100px">登录时延(ms)</div>'},
            {title: '<div style="width:100px">首字节时延(ms)</div>'},
            {title: '<div style="width:100px">下载速率(KB/s)</div>'},
            {title: '<div style="width:100px">DNS时延(ms)</div>'},
            {title: '<div style="width:100px">连接时延(ms)</div>'},
            {title: '<div style="width:100px">登录时延(ms)</div>'},
            {title: '<div style="width:100px">首字节时延(ms)</div>'},
            {title: '<div style="width:100px">上传速率(KB/s)</div>'},
        ],
        rows: [],
        dtHandle: null,
    },
    methods: {
        reset: function (probeContent) {
            let vm = this;
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function ( row, data, index ) {
                    //生成了行之后，开始生成表头>>>
                    var trs=$("#downloaddata_table_wrapper>.dataTables_scroll>.dataTables_scrollHead>.dataTables_scrollHeadInner>table>thead>tr");

                    if(trs.length>1){
                        return
                    }if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';
                        innerTh +='<th colspan="1"></th>';

                        var columnsCount = 17;//具体情况
                        innerTh +='<th colspan="4" style="text-align: center">WEB下载</th>';
                        innerTh +='<th colspan="5" style="text-align: center">FTP下载</th>';
                        innerTh +='<th colspan="5" style="text-align: center">FTP上传</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('downloaddata_table').insertRow(0);
                        var $tr = trs.eq(0);
                        $tr.before(innerTh);
                    }
                },
                searching: false,
                paging: false,
                // serverSide: true,
                info: false,
                scrollY:  300,
                scrollX:  true,
                scrollCollapse: true,
                // ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,
                oLanguage: {
                    sEmptyTable: "No data available in table",
                    sZeroRecords:"No data available in table",
                },
                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = probeContent;//返回的数据列表
                    if(probeContent.length==0){
                        return
                    }
                    // // 重新整理返回数据以匹配表格
                    var temp = cloneObj(probeContent);
                    for (let i = 0; i < temp.length; i++) {
                        let date_token = probeContent[i].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(probeContent[i].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        temp[i].datetime = Date.UTC(year, month, day, hour)
                    }
                    var sortTemp = temp.sort(compare("datetime"));
                    if(probeContent==undefined){
                        return
                    }
                    let rows = [];
                    var i = 1;
                    sortTemp.forEach(function (item) {
                        let row = [];
                        row.push(i++);
                        row.push(item.probeName);
                        row.push(item.recordDate.substr(0,10)+"   "+item.recordTime.substr(0,10)+':00');
                        row.push(fixed(item.score));
                        row.push(fixed(item.webDownloadDnsDelay));
                        row.push(fixed(item.webDownloadConnDelay));
                        row.push(fixed(item.webDownloadHeadbyteDelay));
                        row.push(fixed(item.webDownloadDownloadRate));
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
        },
        currReset: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("当前页面重绘");
            vm.dtHandle.draw(false);
            /*当前页面重绘*/
        },
        redraw: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("页面重绘");
            vm.dtHandle.draw();
            /*重绘*/
        }
    },
    mounted: function(obj) {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }

});

var video_table=new Vue({
    el:'#videodata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
            {title: '<div style="width:130px">时间</div>'},
            {title: '<div style="width:70px">综合分数</div>'},
            {title: '<div style="width:100px">DNS时延(ms)</div>'},
            {title: '<div style="width:150px">连接WEB服务器时延(ms)</div>'},
            {title: '<div style="width:120px">web页面时延(ms)</div>'},
            {title: '<div style="width:110px">首帧到达时延(ms)</div>'},
            {title: '<div style="width:120px">首次缓冲时延(ms)</div>'},
            {title: '<div style="width:120px">视频加载时延(ms)</div>'},
            {title: '<div style="width:120px">总体缓冲时间(ms)</div>'},
            {title: '<div style="width:105px">下载速率(KB/s)</div>'},
            {title: '<div style="width:100px">缓冲次数</div>'},
        ],
        rows: [],
        dtHandle: null,
    },
    methods: {
        reset: function (probeContent) {
            let vm = this;
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                // serverSide: true,
                info: false,
                scrollY:  300,
                scrollX:  true,
                scrollCollapse: true,
                // ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,
                oLanguage: {
                    sEmptyTable: "No data available in table",
                    sZeroRecords:"No data available in table",
                },
                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = probeContent;//返回的数据列表
                    if(probeContent.length==0){
                        return
                    }
                    // // 重新整理返回数据以匹配表格
                    var temp = cloneObj(probeContent);
                    for (let i = 0; i < temp.length; i++) {
                        let date_token = probeContent[i].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(probeContent[i].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        temp[i].datetime = Date.UTC(year, month, day, hour)
                    }
                    var sortTemp = temp.sort(compare("datetime"));
                    let rows = [];
                    var i = 1;
                    sortTemp.forEach(function (item) {
                        let row = [];
                        row.push(i++);
                        row.push(item.probeName);
                        row.push(item.recordDate.substr(0,10)+"   "+item.recordTime.substr(0,10)+':00');
                        row.push(fixed(item.score));
                        row.push(fixed(item.webVideoDnsDelay));
                        row.push(fixed(item.webVideoWsConnDelay));
                        row.push(fixed(item.webVideoWebPageDelay));
                        row.push(fixed(item.webVideoHeadFrameDelay));
                        row.push(fixed(item.webVideoInitBufferDelay));
                        row.push(fixed(item.webVideoLoadDelay));
                        row.push(fixed(item.webVideoTotalBufferDelay));
                        row.push(fixedRate(item.webVideoDownloadRate));
                        row.push(fixed(item.webVideoBufferTime));
                        rows.push(row);

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
        },
        currReset: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("当前页面重绘");
            vm.dtHandle.draw(false);
            /*当前页面重绘*/
        },
        redraw: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("页面重绘");
            vm.dtHandle.draw();
            /*重绘*/
        }
    },
    mounted: function() {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }

});

var game_table=new Vue({
    el:'#gamedata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
            {title: '<div style="width:130px">时间</div>'},
            {title: '<div style="width:70px">综合分数</div>'},
            {title: '<div style="width:100px">DNS时延(ms)</div>'},
            {title: '<div style="width:100px">网络时延(ms)</div>'},
            {title: '<div style="width:100px">网络抖动(ms)</div>'},
            {title: '<div style="width:100px">丢包率(%)</div>'},
        ],
        rows: [],
        dtHandle: null,
    },
    methods: {
        reset: function (probeContent) {
            let vm = this;
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                // serverSide: true,
                info: false,
                // ordering: false, /*禁用排序功能*/
                /*bInfo: false,*/
                /*bLengthChange: false,*/    /*禁用Show entries*/
                scroll: false,
                scrollY:  300,
                scrollX:  true,
                scrollCollapse: true,
                oLanguage: {
                    sEmptyTable: "No data available in table",
                    sZeroRecords:"No data available in table",
                },
                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = probeContent;//返回的数据列表
                    if(probeContent.length==0){
                        return
                    }
                    // // 重新整理返回数据以匹配表格
                    var temp = cloneObj(probeContent);
                    for (let i = 0; i < temp.length; i++) {
                        let date_token = probeContent[i].recordDate.split("-");
                        let year = parseInt(date_token[0]);
                        let month = parseInt(date_token[1]) - 1;
                        let day = parseInt(date_token[2]);
                        let hour = parseInt(probeContent[i].recordTime);
                        if (isNaN(year) || isNaN(month) || isNaN(day)) {
                            continue;
                        }
                        temp[i].datetime = Date.UTC(year, month, day, hour)
                    }
                    var sortTemp = temp.sort(compare("datetime"));
                    let rows = [];
                    var i = 1;
                    sortTemp.forEach(function (item) {
                        let row = [];
                        row.push(i++);
                        row.push(item.probeName);
                        row.push(item.recordDate.substr(0,10)+"   "+item.recordTime.substr(0,10)+':00');
                        row.push(fixed(item.score));
                        row.push(fixed(item.gameDnsDelay));
                        row.push(fixed(item.gamePacketDelay));
                        row.push(fixed(item.gamePacketJitter));
                        row.push(fixedRate(item.gameLossRate));
                        rows.push(row);
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
        },
        currReset: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("当前页面重绘");
            vm.dtHandle.draw(false);
            /*当前页面重绘*/
        },
        redraw: function () {
            let vm = this;
            vm.dtHandle.clear();
            //console.log("页面重绘");
            vm.dtHandle.draw();
            /*重绘*/
        }
    },
    mounted: function(obj) {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }
});
// //网络质量表格
// function quality(val) {
//     var probeContent=val
//
// }
//
// //网页浏览表格
// function broswer(val) {
//     var probeContent=val
//
// }
// //下载
// function download(val) {
//     var probeContent=val
//     //网页下载
//
// }
// // /在线视频
// function video(val) {
//     var probeContent=val
//
// }
// //在线游戏
// function game(val) {
//     var probeContent=val
//
// }


function loading() {
    $('#container_connection').loading({
        loadingWidth:240,
        title:'正在努力的加载中',
        name:'test',
        discription:'这是一个描述...',
        direction:'row',
        type:'origin',
        originBg:'#B0E2FF',
        originDivWidth:30,
        originDivHeight:30,
        originWidth:4,
        originHeight:4,
        smallLoading:false,
        titleColor:'#ADD8E6',
        loadingBg:'#312923',
        loadingMaskBg:'rgba(22,22,22,0.2)'
    });
    $('#container_quality').loading({
        loadingWidth:240,
        title:'正在努力的加载中~',
        name:'quality',
        discription:'这是一个描述...',
        direction:'row',
        type:'origin',
        originBg:'#B0E2FF',
        originDivWidth:30,
        originDivHeight:30,
        originWidth:4,
        originHeight:4,
        smallLoading:false,
        titleColor:'#ADD8E6',
        loadingBg:'#312923',
        loadingMaskBg:'rgba(22,22,22,0.2)'
    });
    $('#container_download').loading({
        loadingWidth:240,
        title:'正在努力的加载中~',
        name:'download',
        discription:'这是一个描述...',
        direction:'row',
        type:'origin',
        originBg:'#B0E2FF',
        originDivWidth:30,
        originDivHeight:30,
        originWidth:4,
        originHeight:4,
        smallLoading:false,
        titleColor:'#ADD8E6',
        loadingBg:'#312923',
        loadingMaskBg:'rgba(22,22,22,0.2)'
    });
    $('#container_page').loading({
        loadingWidth:240,
        title:'正在努力的加载中~',
        name:'page',
        discription:'这是一个描述...',
        direction:'row',
        type:'origin',
        originBg:'#B0E2FF',
        originDivWidth:30,
        originDivHeight:30,
        originWidth:4,
        originHeight:4,
        smallLoading:false,
        titleColor:'#ADD8E6',
        loadingBg:'#312923',
        loadingMaskBg:'rgba(22,22,22,0.2)'
    });
    $('#container_video').loading({
        loadingWidth:240,
        title:'正在努力的加载中~',
        name:'video',
        discription:'这是一个描述...',
        direction:'row',
        type:'origin',
        originBg:'#B0E2FF',
        originDivWidth:30,
        originDivHeight:30,
        originWidth:4,
        originHeight:4,
        smallLoading:false,
        titleColor:'#ADD8E6',
        loadingBg:'#312923',
        loadingMaskBg:'rgba(22,22,22,0.2)'
    });
    $('#container_game').loading({
        loadingWidth:240,
        title:'正在努力的加载中~',
        name:'game',
        discription:'这是一个描述...',
        direction:'row',
        type:'origin',
        originBg:'#B0E2FF',
        originDivWidth:30,
        originDivHeight:30,
        originWidth:4,
        originHeight:4,
        smallLoading:false,
        titleColor:'#ADD8E6',
        loadingBg:'#312923',
        loadingMaskBg:'rgba(22,22,22,0.2)'
    });
}


function probe() {
    probeSelected=0;
    $.ajax({
        url: "../../cem/probe/showlist",//探针列表
        type: "POST",
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var probes = [];
            for (var i = 0; i < result.probe.length; i++) {
                probes[i] = {message: result.probe[i]}
            }
            search_data.probe = probes;
            setTimeout(function () {
                $('#probe .jq22').comboSelect();
                $('.combo-dropdown').css("z-index","3");
                $('#probe .option-item').click(function (probe) {
                    setTimeout(function () {
                        var a = $(probe.currentTarget)[0].innerText;
                        probeSelected = $($(probe.currentTarget)[0]).data('value');
                        $('#probe .combo-input').val(a);
                        $('#probe .combo-select select').val(a);
                    }, 30);
                });
                $('#probe input[type=text] ').keyup(function (probe) {
                    if( probe.keyCode=='13'){
                        var b = $("#probe .option-hover.option-selected").text();
                        probeSelected=$("#probe .option-hover.option-selected")[0].dataset.value;
                        $('#probe .combo-input').val(b);
                        $('#probe .combo-select select').val(b);
                    }
                })
            },50);
        }
    });
}
$(document).ready(function () {
    $('#country .jq22').comboSelect();
    $('#probe .jq22').comboSelect();
    $('#city .jq22').comboSelect();
    citySelected=0;
    $.ajax({
        type: "POST", /*GET会乱码*/
        url: "../../cem/city/list",//c城市列表
        cache: false,  //禁用缓存
        dataType: "json",
        success: function (result) {
            var cities = [];
            for (var i = 0; i < result.page.list.length; i++) {
                cities[i] = {message: result.page.list[i]}
            }
            search_data.city = cities;
            setTimeout(function () {
                $('div#city .jq22').comboSelect();
                $('.combo-dropdown').css("z-index","3");
                $('div#city .option-item').click(function (city) {
                    setTimeout(function () {
                        var a = $(city.currentTarget)[0].innerText;
                        clearArea(a);
                        citySelected = $($(city.currentTarget)[0]).data('value');
                        getArea(citySelected);
                        getProbeCity(citySelected);
                        $('div#city .combo-input').val(a);
                        $('div#city .combo-select select').val(a);
                    }, 50);
                });
                $('#city input[type=text] ').keyup(function (city) {
                    if( city.keyCode=='13'){
                        var b = $("#city .option-hover.option-selected").text();
                        clearArea(b);
                        var c=($("#city .option-hover.option-selected"));
                        var c=c[0].dataset
                        citySelected = c.value;
                        getArea(citySelected);
                        getProbeCity(citySelected);
                        $('#city .combo-input').val(b);
                        $('#city .combo-select select').val(b);
                    }
                })
            }, 100);
        }
    });

    function clearArea(a) {
        if(a=="所有地市"){
            $('#country .combo-input').val("所有区县");
            $('#country .combo-select select').val("所有区县");
            search_data.areas = [];
            $('#country ul').html("");
            $("#country ul").append("<li class='option-item option-hover option-selected' data-index=='0' data-value=''>"+"所有区县"+"</li>");
            probe()
        }
        if(a=="所有区县"){
            probe()
        }
    }
    probe()
});



function fixed(value) {
    if(value==''||value==null){
        return ''
    }else{
        return value.toFixed(2)
    }
}

function fixedRate(value) {
    if(value==null){
        return ''
    } else{
        return (value*100).toFixed(2)
    }
}

var cloneObj = function (obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};


function compare(property) {
    return function (obj1, obj2) {
        let value1 = obj1[property];
        let value2 = obj2[property];
        return value1 - value2;     // 升序
    }
}


