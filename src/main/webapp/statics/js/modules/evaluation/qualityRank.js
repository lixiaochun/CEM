/**
 * Created by Fern on 2017/11/28.
 */
var status;
var idArray = new Array();
var probeGroupNames = new Array();
var cityNames = new Array();
var areaNames = new Array();
var serviceArray = new Array();
var targetNames = new Array();
var probeNames = new Array();
var typeNames = new Array();
var statusNames = new Array();
var probeContent = new Array();
var doorContent = new Array();
var probeId;
var targetId;
var cityId=0;
var probeName;
var cityName;
var countyName;
var countyId;
var diagnosetargetSelected;
var citySelected = 0;
var countrySelected = 0;
var serviceSelected = 0;
var area_Selected = 0;
var probeSelected = 0;
var targetSelected = 0;

var today = new Date();
today.setDate(today.getDate()); //显示近一天内的数据
var recordtype = new Map();
recordtype.set(0,"info");
recordtype.set(1,"ping1");
recordtype.set(2,"sla");
recordtype.set(3,"webpage");
recordtype.set(4,"webdownload");
recordtype.set(5,"webvideo");
recordtype.set(6,"game1");



var st = new Map();//servicetype字典，可通过get方法查对应字符串。
st.set(0, "综合业务");
st.set(1, "网络连通性业务");
st.set(2, "网络层质量业务");
st.set(3, "网页浏览业务");
st.set(4, "文件下载业务");
st.set(5, "在线视频业务");
st.set(6, "网络游戏业务");

var probedata_handle = new Vue({
    el: '#probehandle',
    data: {},
    mounted: function () {         /*动态加载测试任务组数据*/
        $.ajax({
            type: "POST", /*GET会乱码*/
            url: "../../cem/city/list",
            cache: false,  //禁用缓存
            dataType: "json",
            /* contentType:"application/json",  /!*必须要,不可少*!/*/
            success: function (result) {
                for (var i = 0; i < result.page.list.length; i++) {
                    cityNames[i] = {message: result.page.list[i]}
                }
                search_data.cities = cityNames;
            }
        });
    },
    methods: {}
});

var areadata_handle = new Vue({
    el: '#areahandle',
    data: {},
    mounted: function () {         /*动态加载测试任务组数据*/
        $.ajax({
            type: "POST", /*GET会乱码*/
            url: "../../cem/city/list",
            cache: false,  //禁用缓存
            dataType: "json",
            /* contentType:"application/json",  /!*必须要,不可少*!/*/
            success: function (result) {
                for (var i = 0; i < result.page.list.length; i++) {
                    cityNames[i] = {message: result.page.list[i]}
                }
                area_data.cities = cityNames;
            }
        });
    },
    methods: {}
});

var Doordata_handle = new Vue({
    el: '#doorprobehandle',
    data: {},
    mounted: function () {         /*动态加载测试任务组数据*/
        $.ajax({
            type: "POST", /*GET会乱码*/
            url: "../../cem/city/list",
            cache: false,  //禁用缓存
            dataType: "json",
            /* contentType:"application/json",  /!*必须要,不可少*!/!*/
            success: function (result) {
                var cities = [];
                for (var i = 0; i < result.page.list.length; i++) {
                    cities[i] = {message: result.page.list[i]}
                }
                Doorsearch_data.cities = cities;
            }
        });
    },
    methods: {}
});

var search_data = new Vue({
    el: '#probesearch',
    data: {
        areas: [],
        cities: [],
        probe: [],
        probegroup_names: [],
        accessLayers: [],
        types: [],
        status: [],
        target: [],
    },
    methods: {
        citychange: function () {
            this.areas = getArea($("#selectcity").val());
            //console.log($("#selectcity").val());
        },
        servicechange: function () {
            this.target = getService($("#selectservice").val());
            //console.log($("#selectservice").val())
        }
    }
});

var Doorsearch_data = new Vue({
    el: '#door_search',
    data: {
        areas: [],
        cities: [],
        probe: [],
        probegroup_names: [],
        accessLayers: [],
        types: [],
        status: [],
        target: [],
    },
    methods: {
        citychange: function () {
            this.areas = getArea($("#doorselectcity").val());
            //console.log($("#doorselectcity").val());
        },
        servicechange: function () {
            this.target = getService($("#doorselectservice").val());
            //console.log($("#doorselectservice").val())
        }
    }
});


var area_data = new Vue({
    el: '#areasearch',
    data: {
        areas: [],
        cities: [],
        probe: [],
        probegroup_names: [],
        accessLayers: [],
        types: [],
        status: [],
        target: [],
    },
    methods: {
        servicechange: function () {
            this.target = getAreaService($("#area_service").val());
            //console.log($("#area_service").val())
        }
    }
});

var getCounty = function (cityid) {
      
    countrySeleted = 0
    $.ajax({
        url: "../../cem/county/info/" + cityid,
        type: "POST",
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json",
        success: function (result) {

            search_data.areas = [];
            areaNames = [];
            for (var i = 0; i < result.county.length; i++) {
                areaNames[i] = {message: result.county[i]}
            }
            search_data.areas = areaNames;
            setTimeout(function () {
                $('#country .jq22').comboSelect();
                $('.combo-dropdown').css("z-index", "3");
                $('#country .option-item').click(function (areas) {
                    setTimeout(function () {
                        var a = $(areas.currentTarget)[0].innerText;
                        countrySelected = $($(areas.currentTarget)[0]).data('value');
                        $('#country .combo-input').val(a);
                        $('#country .combo-select select').val(a);
                    }, 20)

                });
                $('#country input[type=text] ').keyup(function (areas) {
                    if (areas.keyCode == '13') {
                        var b = $("#country .option-hover.option-selected").text();
                        countrySelected = $("#country .option-hover.option-selected")[0].dataset.value;
                        $('#country .combo-input').val(b);
                        $('#country .combo-select select').val(b);
                    }
                })
            }, 50);
        }
    });
}

var getDoorArea = function (cityid) {
    countrySeleted = 0
    $.ajax({
        url: "../../cem/county/info/" + cityid,
        type: "POST",
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            search_data.areas = [];
            areaNames = [];
            for (var i = 0; i < result.county.length; i++) {
                areaNames[i] = {message: result.county[i]}
            }
            Doorsearch_data.areas = areaNames;
            setTimeout(function () {
                $('#doorcountry .jq22').comboSelect();
                $('.combo-dropdown').css("z-index", "3");
                $('#doorcountry .option-item').click(function (areas) {
                    setTimeout(function () {
                        var a = $(areas.currentTarget)[0].innerText;
                        countrySelected = $($(areas.currentTarget)[0]).data('value');

                        getdoorProbe(countrySelected);
                        $('#doorcountry .combo-input').val(a);
                        $('#doorcountry .combo-select select').val(a);
                    }, 20)

                });
                $('#doorcountry input[type=text] ').keyup(function (areas) {
                    if (areas.keyCode == '13') {
                        var b = $("#doorcountry .option-hover.option-selected").text();
                        countrySelected = $("#doorcountry .option-hover.option-selected")[0].dataset.value;
                        getdoorProbe(countrySelected);
                        $('#doorcountry .combo-input').val(b);
                        $('#doorcountry .combo-select select').val(b);
                    }
                })
            }, 50);
        }
    });
}

var getService = function (serviceId) {
    targetSelected = 0
    $.ajax({
        url: "../../target/infobat/" + serviceId,
        type: "POST", /*GET会乱码*/
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json", /*必须要,不可少*/
        success: function (result) {
            search_data.target = [];
            targetNames = [];
            for (var i = 0; i < result.target.length; i++) {
                targetNames[i] = {message: result.target[i]}
            }
            search_data.target = targetNames;
            setTimeout(function () {
                $('#target  .jq22').comboSelect();
                $('#target  .option-item').click(function (target) {
                    setTimeout(function () {
                        var a = $(target.currentTarget)[0].innerText;
                        targetSelected = $($(target.currentTarget)[0]).data('value');
                        $('#target .combo-input').val(a);
                        $('#target .combo-select select').val(a);
                    }, 30);
                });
                $('#target input[type=text] ').keyup(function (target) {
                    if (target.keyCode == '13') {
                        var b = $("#target  .option-hover.option-selected").text();
                        targetSelected = $("#target .option-hover.option-selected")[0].dataset.value;
                        $('#target .combo-input').val(b);
                        $('#target .combo-select select').val(b);
                    }
                })
            }, 50);

        }
    });
}

var getDoorService = function (serviceId) {
    //console.log("I'm here!!!!" + serviceId);

    targetSelected = 0
    $.ajax({
        url: "../../target/infobat/" + serviceId,
        type: "POST", /*GET会乱码*/
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json", /*必须要,不可少*/
        success: function (result) {
            Doorsearch_data.target = [];
            targetNames = [];
            for (var i = 0; i < result.target.length; i++) {
                targetNames[i] = {message: result.target[i]}
            }
            Doorsearch_data.target = targetNames;
            setTimeout(function () {
                $('#doortarget  .jq22').comboSelect();
                $('#doortarget  .option-item').click(function (target) {
                    setTimeout(function () {
                        var a = $(target.currentTarget)[0].innerText;
                        targetSelected = $($(target.currentTarget)[0]).data('value');
                        $('#doortarget .combo-input').val(a);
                        $('#doortarget .combo-select select').val(a);
                    }, 30);
                });
                $('#doortarget input[type=text] ').keyup(function (target) {
                    if (target.keyCode == '13') {
                        var b = $("#doortarget  .option-hover.option-selected").text();
                        targetSelected = $("#doortarget .option-hover.option-selected")[0].dataset.value;
                        $('#doortarget .combo-input').val(b);
                        $('#doortarget .combo-select select').val(b);
                    }
                })
            }, 50);
        }
    });
}

var getAreaService = function (serviceId) {
    //console.log("I'm here!!!!" + serviceId);
    targetSelected = 0
    $.ajax({
        url: "../../target/infobat/" + serviceId,
        type: "POST", /*GET会乱码*/
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json", /*必须要,不可少*/
        success: function (result) {
            area_data.target = [];
            targetNames = [];
            for (var i = 0; i < result.target.length; i++) {
                targetNames[i] = {message: result.target[i]}
            }
            area_data.target = targetNames;
            setTimeout(function () {
                $('#areaTarget  .jq22').comboSelect();
                $('#areaTarget  .option-item').click(function (target) {
                    setTimeout(function () {
                        var a = $(target.currentTarget)[0].innerText;
                        targetSelected = $($(target.currentTarget)[0]).data('value');
                        $('#areaTarget .combo-input').val(a);
                        $('#areaTarget .combo-select select').val(a);
                    }, 30);
                });
                $('#areaTarget input[type=text] ').keyup(function (target) {
                    if (target.keyCode == '13') {
                        var b = $("#areaTarget  .option-hover.option-selected").text();
                        targetSelected = $("#areaTarget .option-hover.option-selected")[0].dataset.value;
                        $('#areaTarget .combo-input').val(b);
                        $('#areaTarget .combo-select select').val(b);
                    }
                })
            }, 50);
        }
    });
}


function out() {/*导出事件*/
    var searchJson = getFormJson($('#probesearch'));
    if ((searchJson.startDate) > (searchJson.terminalDate)) {
        //console.log("时间选择有误，请重新选择！");
        $('#nonavailable_time').modal('show');
    } else {
        var search = new Object();
        search.city_id = searchJson.city_id;
        search.county_id = searchJson.country_id;
        search.service = searchJson.service_type;
        search.target_id = searchJson.target;
        if (searchJson.startDate.length != 0 && searchJson.terminalDate.length != 0) {
            var ava_start = searchJson.startDate.substr(0, 10);
            var ava_terminal = searchJson.terminalDate.substr(0, 10);
            var startTime = searchJson.startDate.substr(11, 15);
            var terminalTime = searchJson.terminalDate.substr(11, 15);
            search.ava_start = ava_start;
            search.ava_terminal = ava_terminal;
            search.startTime = startTime;
            search.terminalTime = terminalTime;
        } else {
            search.ava_start = today.Format("yyyy-MM-dd");
            search.ava_terminal = (new Date()).Format("yyyy-MM-dd");
        }
        var schedulepolicy = JSON.stringify(search);
        //console.log(schedulepolicy);

        document.getElementById("output").href = encodeURI('../../recordhourtracert/download/' + schedulepolicy);
        document.getElementById("output").click();
    }
}


function doorout() {/*导出事件*/
    var searchJson = getFormJson($('#door_search'));
    if ((searchJson.startDate) > (searchJson.terminalDate)) {
        //console.log("时间选择有误，请重新选择！");
        $('#nonavailable_time').modal('show');
    } else {
        var search = new Object();
        search.city_id = searchJson.city_id;
        search.county_id = searchJson.country_id;
        search.service = searchJson.service_type;
        search.probeId = searchJson.probe;
        search.target_id = searchJson.target;
        if (searchJson.startDate.length != 0 && searchJson.terminalDate.length != 0) {
            var ava_start = searchJson.startDate.substr(0, 10);
            var ava_terminal = searchJson.terminalDate.substr(0, 10);
            var startTime = searchJson.startDate.substr(11, 15);
            var terminalTime = searchJson.terminalDate.substr(11, 15);
            search.ava_start = ava_start;
            search.ava_terminal = ava_terminal;
            search.startTime = startTime;
            search.terminalTime = terminalTime;
        } else {
            search.ava_start = today.Format("yyyy-MM-dd");
            search.ava_terminal = (new Date()).Format("yyyy-MM-dd");
        }
        var schedulepolicy = JSON.stringify(search);
        //console.log(schedulepolicy);

        document.getElementById("door_output").href = encodeURI('../../recordhourtracert/doordownload/' + schedulepolicy);
        document.getElementById("door_output").click();
    }
}


//区域排名详情
//TODO：获取区域排名并展示
function areaupdate_this(obj) {     /*监听修改触发事件*/
    loading();
    countyId = parseInt(obj.id);
    var searchJson = getFormJson($('#areasearch'));
    if ((searchJson.startDate) > (searchJson.terminalDate)) {
        //console.log("时间选择有误，请重新选择！");
        $('#nonavailable_time').modal('show');
    } else {
        var search = new Object();
        search.city_id = searchJson.city_id;
        search.county_id = countyId;
        if (searchJson.service_type == undefined) {
            search.service = '0';
        } else {
            search.service = searchJson.service_type;
        }
        search.target_id = searchJson.target_id;
        if (searchJson.startDate.length != 0 && searchJson.terminalDate.length != 0) {
            var ava_start = searchJson.startDate.substr(0, 10);
            var ava_terminal = searchJson.terminalDate.substr(0, 10);
            var startTime = searchJson.startDate.substr(11, 15);
            var terminalTime = searchJson.terminalDate.substr(11, 15);
            search.ava_start = ava_start;
            search.ava_terminal = ava_terminal;
            search.startTime = startTime;
            search.terminalTime = terminalTime;
        } else {
            search.ava_start = today.Format("yyyy-MM-dd");
            search.ava_terminal = (new Date()).Format("yyyy-MM-dd");
        }
        var schedulepolicy = JSON.stringify(search);
        //console.log(schedulepolicy);
        $.ajax({
            type: "POST", /*GET会乱码*/
            url: "../../recordhourtracert/areadetail/" + schedulepolicy,
            cache: false,  //禁用缓存
            dataType: "json",
            contentType: "application/json", /*必须要,不可少*/
            success: function (result) {
                //console.log('收到数据', new Date(), result);
                    removeLoading('test');
                    var areaContent = result.scoreList;
                    area_this(obj, areaContent)

            }
        });
    }
}

function AreaOut() {/*导出事件*/
    var searchJson = getFormJson($('#areasearch'));
    if ((searchJson.startDate) > (searchJson.terminalDate)) {
        //console.log("时间选择有误，请重新选择！");
        $('#nonavailable_time').modal('show');
    } else {
        var search = new Object();
        search.city_id = searchJson.city_id;
        search.county_id = searchJson.country_id;
        search.service = searchJson.service_type;
        search.target_id = searchJson.target_id;
        if (searchJson.startDate.length != 0 && searchJson.terminalDate.length != 0) {
            var ava_start = searchJson.startDate.substr(0, 10);
            var ava_terminal = searchJson.terminalDate.substr(0, 10);
            var startTime = searchJson.startDate.substr(11, 15);
            var terminalTime = searchJson.terminalDate.substr(11, 15);
            search.ava_start = ava_start;
            search.ava_terminal = ava_terminal;
            search.startTime = startTime;
            search.terminalTime = terminalTime;
        } else {
            search.ava_start = today.Format("yyyy-MM-dd");
            search.ava_terminal = (new Date()).Format("yyyy-MM-dd");
        }
        var schedulepolicy = JSON.stringify(search);
        //console.log(schedulepolicy);

        document.getElementById("areaOutput").href = encodeURI('../../recordhourtracert/areaDownload/' + schedulepolicy);
        document.getElementById("areaOutput").click();
    }
}


var search_service = new Vue({
    el: '#search',
    data: {},
    // 在 `methods` 对象中定义方法
    methods: {
        testagentListsearch: function () {
            var searchJson = getFormJson($('#probesearch'));
            if ((searchJson.startDate) > (searchJson.terminalDate)) {
                //console.log("时间选择有误，请重新选择！");
                $('#nonavailable_time').modal('show');
            } else {
                var search = new Object();
                search.city_id = searchJson.city_id;
                search.county_id = searchJson.country_id;
                search.service = searchJson.service_type;
                search.target_id = searchJson.target;
                if (searchJson.startDate.length != 0 && searchJson.terminalDate.length != 0) {
                    var ava_start = searchJson.startDate.substr(0, 10);
                    var ava_terminal = searchJson.terminalDate.substr(0, 10);
                    var startTime = searchJson.startDate.substr(11, 15);
                    var terminalTime = searchJson.terminalDate.substr(11, 15);
                    search.ava_start = ava_start;
                    search.ava_terminal = ava_terminal;
                    search.startTime = startTime;
                    search.terminalTime = terminalTime;
                } else {
                    search.ava_start = today.Format("yyyy-MM-dd");
                    search.ava_terminal = (new Date()).Format("yyyy-MM-dd");
                }
                var schedulepolicy = JSON.stringify(search);
                //console.log(schedulepolicy);
                probetable.probedata = search;
                probetable.redraw();
            }
        },
        reset: function () {    /*重置*/
            document.getElementById("probesearch").reset();
            var data = {
                ava_start: today.Format("yyyy-MM-dd"),
                ava_terminal: (new Date()).Format("yyyy-MM-dd"),
                service: '0'
            };
            citySelected = 0;
            countrySelected = 0;
            serviceSelected = 0;
            area_Selected = 0;
            probeSelected = 0;
            targetSelected = 0;
            probetable.probedata = data;
            probetable.redraw();
            getNow();
        }
    }
});


var search_area_service = new Vue({
    el: '#area_search',
    data: {
        /*name: [],
            scheduler: [],
            remark: []*/
    },
    // 在 `methods` 对象中定义方法
    methods: {
        testagentListsearch: function () {
             
            var searchJson = getFormJson($('#areasearch'));
            if ((searchJson.startDate) > (searchJson.terminalDate)) {
                //console.log("时间选择有误，请重新选择！");
                $('#nonavailable_time').modal('show');
            } else {
                var search = new Object();
                search.city_id = searchJson.city_id;
                search.county_id = searchJson.country_id;
                search.service = searchJson.service_type;
                search.target_id = searchJson.target;
                if (searchJson.startDate.length != 0 && searchJson.terminalDate.length != 0) {
                    var ava_start = searchJson.startDate.substr(0, 10);
                    var ava_terminal = searchJson.terminalDate.substr(0, 10);
                    var startTime = searchJson.startDate.substr(11, 15);
                    var terminalTime = searchJson.terminalDate.substr(11, 15);
                    search.ava_start = ava_start;
                    search.ava_terminal = ava_terminal;
                    search.startTime = startTime;
                    search.terminalTime = terminalTime;
                }  else {
                    search.ava_start = today.Format("yyyy-MM-dd");
                    search.ava_terminal = (new Date()).Format("yyyy-MM-dd");
                }
                var schedulepolicy = JSON.stringify(search);
                //console.log(schedulepolicy);
                areatable.probedata = search;
                areatable.redraw();
            }
        },
        reset: function () {    /*重置*/
            document.getElementById("areasearch").reset();
            var data = {
                ava_start: today.Format("yyyy-MM-dd"),
                ava_terminal: (new Date()).Format("yyyy-MM-dd"),
                service: '0'
            };
            citySelected = 0;
            countrySelected = 0;
            serviceSelected = 0;
            area_Selected = 0;
            probeSelected = 0
            targetSelected = 0;
            areatable.probedata = data;
            areatable.redraw();
            getNow();
        }
    }
});

var search_door_service = new Vue({
    el: '#doorsearchbtn',
    data: {},
    // 在 `methods` 对象中定义方法
    methods: {
        DoorListsearch: function () {
            var searchJson = getFormJson($('#door_search'));
            if ((searchJson.startDate) > (searchJson.terminalDate)) {
                //console.log("时间选择有误，请重新选择！");
                $('#nonavailable_time').modal('show');
            } else {
                var search = new Object();
                search.city_id = searchJson.city_id;
                search.county_id = searchJson.country_id;
                if(searchJson.service_type==undefined){
                    search.service =1
                }else {
                    search.service =  searchJson.service_type;
                }
                search.probe_id = searchJson.probe;
                search.target_id = searchJson.target;
                if (searchJson.startDate.length != 0 && searchJson.terminalDate.length != 0) {
                    var ava_start = searchJson.startDate.substr(0, 10);
                    var ava_terminal = searchJson.terminalDate.substr(0, 10);
                    var startTime = searchJson.startDate.substr(11, 15);
                    var terminalTime = searchJson.terminalDate.substr(11, 15);
                    search.ava_start = ava_start;
                    search.ava_terminal = ava_terminal;
                    search.startTime = startTime;
                    search.terminalTime = terminalTime;
                } else {
                    search.ava_start = today.Format("yyyy-MM-dd");
                    search.ava_terminal = (new Date()).Format("yyyy-MM-dd");
                }
                var schedulepolicy = JSON.stringify(search);
                //console.log(schedulepolicy);
                doortable.probedata = search;
                doortable.redraw();
            }
        },
        reset: function () {    /*重置*/
            document.getElementById("door_search").reset();
            var data = {
                ava_start: today.Format("yyyy-MM-dd"),
                ava_terminal: (new Date()).Format("yyyy-MM-dd"),
                service: '1'
            };
            citySelected = 0;
            countrySelected = 0;
            serviceSelected = 0;
            area_Selected = 0;
            probeSelected = 0;
            targetSelected = 0;
            doortable.probedata = data;
            doortable.redraw();
            getNow();
        }
    }
});

function getFormJson(form) {      /*将表单对象变为json对象*/
    var a = $(form).serializeArray();
    var o = {};

    if (form.selector == '#probesearch') {
        if (citySelected != 0) {
            a[2] = {};
            a[2].name = "city_id";
            a[2].value = parseInt(citySelected);
        }
        if (countrySelected != 0) {
            a[3] = {};
            a[3].name = "country_id";
            a[3].value = parseInt(countrySelected);
        }
        if (serviceSelected != -1) {
            a[4] = {};
            a[4].name = "service_type";
            a[4].value = parseInt(serviceSelected);
        }
        if (targetSelected != 0) {
            a[5] = {};
            a[5].name = "target";
            a[5].value = parseInt(targetSelected);
        }

    } else if (form.selector == '#areasearch') {
        if (citySelected != 0) {
            a[2] = {};
            a[2].name = "city_id";
            a[2].value = parseInt(citySelected)
        }
        if (area_Selected != -1) {
            a[3] = {};
            a[3].name = "service_type";
            a[3].value = parseInt(area_Selected)
        }
        if (targetSelected != 0) {
            a[4] = {};
            a[4].name = "target";
            a[4].value = parseInt(targetSelected);
        }
    } else {
        if (citySelected != 0) {
            a[2] = {};
            a[2].name = "city_id";
            a[2].value = parseInt(citySelected);
        }
        if (countrySelected != 0) {
            a[3] = {};
            a[3].name = "country_id";
            a[3].value =parseInt(countrySelected);
        }

        if (probeSelected != 0) {
            a[4] = {};
            a[4].name = "probe";
            a[4].value = parseInt(probeSelected);
        }
        if (serviceSelected != 0) {
            a[5] = {};
            a[5].name = "service_type";
            a[5].value = parseInt(serviceSelected);
        }

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
        if (new RegExp("(" + k + ")").test(fmt)) {
            if (k == "y+") {
                fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
            }
            else if (k == "S+") {
                var lens = RegExp.$1.length;
                lens = lens == 1 ? 3 : lens;
                fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
            }
            else {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }
    return fmt;
};


// 探针排名列表
var probetable = new Vue({
    el: '#probedata_table',
    data: {
        headers: [
            {title: '<div ></div>'},
            {title: '<div >地市</div>'},
            {title: '<div >区县</div>'},
            {title: '<div >探针名称</div>'},
            {title: '<div >业务类型</div>'},
            {title: '<div >目标地址</div>'},
            {title: '<div >分数</div>'},
            {title: '<div >操作</div>'}
        ],
        rows: [],
        dtHandle: null,
        probedata: {
            ava_start: today.Format("yyyy-MM-dd"),
            ava_terminal: (new Date()).Format("yyyy-MM-dd"),
            service: '0'
        }

    },
    methods: {
        reset: function () {
            let vm = this;
            vm.probedata = {};
            /*清空probedata*/
            vm.dtHandle.clear();
            //console.log("重置");
            vm.dtHandle.draw();
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
    mounted: function () {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.
        vm.dtHandle = $(this.$el).DataTable({
            columnDefs: [{"orderable": false, "targets": 0},
                {"orderable": false, "targets": 1},
                {"orderable": false, "targets": 2},
                {"orderable": false, "targets": 3},
                {"orderable": false, "targets": 4},
                {"orderable": false, "targets": 5},
                {"orderable": false, "targets": 7}
            ],
            columns: vm.headers,
            data: vm.rows,
            searching: false,
            paging: true,
            serverSide: true,
            // s/crollXY :300,
            // scrollX: true,
            // scrollCollapse: true,
            // autoWidth: true,
            info: false,
            order:[[ 6, 'asc' ]],
            // bLoadingRecords: "载入中...",
            // ordering: false, /*禁用排序功能*/
            /*bInfo: false,*/
            /*bLengthChange: false,*/    /*禁用Show entries*/
            scroll: false,
            bProcessing: true,
            oLanguage: {
                sEmptyTable: "No data available in table",
                sZeroRecords:"No data available in table",
                sLengthMenu: "每页 _MENU_ 行数据",
                sProcessing: "正在努力加载数据中...",
                // sLoadingRecords: "载入中...",
                oPaginate: {
                    sNext: '<i class="fa fa-chevron-right" ></i>', /*图标替换上一页,下一页*/
                    sPrevious: '<i class="fa fa-chevron-left" ></i>'
                }
            },
            sDom: 'Rfrtlip', /*显示在左下角*/
            ajax: function (data, callback, settings) {
                //封装请求参数
                //console.log(data);
                let param = {};
                param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
                param.start = data.start;//开始的记录序号
                param.page = (data.start / data.length) + 1;//当前页码
                param.order = data.order[0].dir;
                //console.log(param.order);
                param.probedata = JSON.stringify(vm.probedata);
                /*用于查询probe数据*/
                //console.log(param);
                //ajax请求数据
                $.ajax({
                    type: "POST", /*GET会乱码*/
                    url: "../../recordhourping/list",
                    cache: false,  //禁用缓存
                    data: param,  //传入组装的参数
                    dataType: "json",
                    success: function (result) {
                        //console.log(result);
                        //console.log(param)
                        //封装返回数据
                        let returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                        returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.page.list;//返回的数据列表
                        // 重新整理返回数据以匹配表格
                        //console.log(returnData);
                        let rows = [];
                        var i = param.start + 1;
                        probeContent = result.page.list;
                        result.page.list.forEach(function (item) {
                            let row = [];
                            row.push(i++);
                            row.push(item.cityName);
                            row.push(item.countyName);
                            row.push(item.probeName);
                            probeId=item.probeId
                            targetId=item.targetId
                            row.push(st.get(item.serviceType));
                            row.push(item.targetName);
                            row.push(item.score.toFixed(2));
                            row.push('<a class="fontcolor" onclick="update_this(this)" id=' + item.id + ' type=' + st.get(item.serviceType) + ' >详情</a>&nbsp;' +
                                '<a class="fontcolor"    onclick="diagnose_info(this,1)"   id=' + item.probeName + ' title='+item.cityName+'  lang='+item.countyName+'         type='+item.serviceType+'  charset='+item.targetName+' >诊断</a>'); //Todo:完成详情与诊断
                            rows.push(row);
                        });
                        returnData.data = rows;
                        //console.log(returnData);
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                        $("#probedata_table").colResizable({
                            liveDrag: true,
                            gripInnerHtml: "<div class='grip'></div>",
                            draggingClass: "dragging",
                            resizeMode: 'overflow',
                        });
                        // $('td').closest('table').find('th').eq(1).attr('style', 'text-align: center;');
                        // $('#probe_table tbody').find('td').eq(1).attr('style', 'text-align: center;');
                        // var trs = $('#probe_table tbody').find('tr');
                        // trs.find("td").eq(1).attr('style', 'text-align: center;');

                    }
                });
            }
        });
    }
});

// 区域排名列表
var areatable = new Vue({
    el: '#areadata_table',
    data: {
        headers: [
            {title:''},
            {title: '<div style="width:180px">地市</div>'},
            {title: '<div style="width:180px">区县</div>'},
            {title: '<div style="width:180px">业务类型</div>'},
            {title: '<div style="width:180px">目标地址</div>'},
            {title: '<div style="width:180px">分数</div>'},
            {title: '<div style="width:50px">操作</div>'}
        ],
        rows: [],
        dtHandle: null,
        probedata: {
            ava_start: today.Format("yyyy-MM-dd"),
            ava_terminal: (new Date()).Format("yyyy-MM-dd"),
            service: '0'
        }
    },
    methods: {
        reset: function () {
            let vm = this;
            vm.probedata = {};
            /*清空probedata*/
            vm.dtHandle.clear();
            //console.log("重置");
            vm.dtHandle.draw();
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
    mounted: function () {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.
        vm.dtHandle = $(this.$el).DataTable({
            columnDefs: [{"orderable": false, "targets": 0},
                {"orderable": false, "targets": 1},
                {"orderable": false, "targets": 2},
                {"orderable": false, "targets": 3},
                {"orderable": false, "targets": 4},
                {"orderable": false, "targets": 6}
            ],
            columns: vm.headers,
            data: vm.rows,
            searching: false,
            paging: true,
            serverSide: true,
            info: false,
            bProcessing:true,
            bAutoWidth:true,
            order:[[ 5, 'asc' ]],
            //ordering: false, /*禁用排序功能*/
            /*bInfo: false,*/
            /*bLengthChange: false,*/    /*禁用Show entries*/
            scroll: false,
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
                param.order = data.order[0].dir;
                param.probedata = JSON.stringify(vm.probedata);
                /*用于查询probe数据*/
                ////console.log(param);
                //ajax请求数据
                $.ajax({
                    type: "POST", /*GET会乱码*/
                    url: "../../recordhourtracert/list",
                    cache: false,  //禁用缓存
                    data: param,  //传入组装的参数
                    dataType: "json",
                    success: function (result) {
                        //console.log(result);
                        //封装返回数据
                        let returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                        returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.page.list;//返回的数据列表
                        // 重新整理返回数据以匹配表格
                        let rows = [];
                        var i = param.start + 1;
                        result.page.list.forEach(function (item) {
                            let row = [];
                            row.push(i++);
                            row.push(item.cityName);
                            row.push(item.countyName);
                            probeId=item.probeId;
                            targetId=item.targetId;
                            cityId= item.cityId;

                            row.push(st.get(item.serviceType));
                            row.push(item.targetName);
                            row.push(item.score.toFixed(2));

                            row.push('<a class="fontcolor" onclick="areaupdate_this(this)"  id=' + item.countyId + '  type=' + st.get(item.serviceType) + ' >详情</a>&nbsp;' +
                                '<a class="fontcolor"    onclick="diagnose_info(this,2)"  id=' + item.countyId + '   title='+item.cityName+'  lang='+item.countyName+'         type='+item.serviceType+'  charset='+item.targetName+' >诊断</a>'); //Todo:完成详情与诊断
                            rows.push(row);
                        });
                        returnData.data = rows;
                        ////console.log(returnData);
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                        // setTimeout(function () {
                        //     //console.log('hello');
                        //     $("#areadata_table").colResizable({
                        //         liveDrag: true,
                        //         gripInnerHtml: "<div class='grip'></div>",
                        //         draggingClass: "dragging",
                        //         resizeMode: 'overflow',
                        //     });
                        // }, 250);
                        // $('td').closest('table').find('th').eq(1).attr('style', 'text-align: center;');
                        // $('#probe_table tbody').find('td').eq(1).attr('style', 'text-align: center;');
                        // var trs = $('#probe_table tbody').find('tr');
                        // trs.find("td").eq(1).attr('style', 'text-align: center;');

                    }
                });
            }
        });
    }
});
//门户排名列表
var doortable = new Vue({
    el: '#doordata_table',
    data: {
        headers: [
            {title: '<div></div>'},
            {title: '<div>测试目标</div>'},
            // {title: '<div>地市</div>'},
            // {title: '<div>区县</div>'},
            {title: '<div>探针名称</div>'},
            {title: '<div>业务类型</div>'},
            {title: '<div>分数</div>'},
            {title: '<div>操作</div>'},
        ],
        rows: [],
        dtHandle: null,
        probedata: {
            ava_start: today.Format("yyyy-MM-dd"),
            ava_terminal: (new Date()).Format("yyyy-MM-dd"),
            service: '1'
        }

    },
    methods: {
        reset: function () {
            let vm = this;
            vm.probedata = {};
            /*清空probedata*/
            vm.dtHandle.clear();
            //console.log("重置");
            vm.dtHandle.draw();
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
    mounted: function () {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.
        vm.dtHandle = $(this.$el).DataTable({
            columnDefs: [{"orderable": false, "targets": 0},
                // {"orderable": false, "targets": 1},
                // {"orderable": false, "targets": 2},
                {"orderable": false, "targets": 1},
                {"orderable": false, "targets": 2},
                {"orderable": false, "targets": 3},
                {"orderable": false, "targets": 5}
            ],
            columns: vm.headers,
            data: vm.rows,
            searching: false,
            paging: true,
            serverSide: true,
            // scrollY :300,
            // // scrollX: true,
            // scrollCollapse: true,
            // autoWidth: true,
            info: false,
            bProcessing: true,
            order:[[ 4, 'asc' ]],
            // ordering: false, /*禁用排序功能*/
            /*bInfo: false,*/
            /*bLengthChange: false,*/    /*禁用Show entries*/
            scroll: false,
            bAutoWidth:false,
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
                //console.log(data);
                let param = {};
                param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
                param.start = data.start;//开始的记录序号
                param.page = (data.start / data.length) + 1;//当前页码
                param.order = data.order[0].dir;
                //console.log(param.order);
                param.probedata = JSON.stringify(vm.probedata);
                /*用于查询probe数据*/
                //console.log(param);
                //ajax请求数据
                $.ajax({
                    type: "POST", /*GET会乱码*/
                    url: "../../recordhourtracert/targetlist",
                    cache: false,  //禁用缓存
                    data: param,  //传入组装的参数
                    dataType: "json",
                    success: function (result) {
                         
                        //console.log(result);
                        //封装返回数据
                        let returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                        returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.page.list;//返回的数据列表
                        // 重新整理返回数据以匹配表格
                        let rows = [];
                        var i = param.start + 1;
                        doorContent = result.page.list
                        result.page.list.forEach(function (item) {
                            let row = [];
                            row.push(i++);
                            row.push(item.targetName);
                            // row.push(item.cityName);
                            // row.push(item.countyName);
                            row.push(item.probeName);
                            probeId=item.probeId;
                            targetId=item.targetId;
                            cityName=item.cityName;
                            countyName=item.countyName;
                            cityId=item.cityId;
                            countyId=item.countyId
                            row.push(st.get(item.serviceType));
                            row.push(item.score.toFixed(2));
                            row.push('<a class="fontcolor" onclick="doorupdate_this(this)"  id=' + item.id + ' type=' + st.get(item.serviceType) + ' >详情</a>&nbsp;' +
                                '<a   class="fontcolor"  onclick="diagnose_info(this,3)"   type='+item.serviceType+'  charset='+item.targetName+'  id=' + item.probeName + ' >诊断</a>'); //Todo:完成详情与诊断
                            rows.push(row);
                        });
                        returnData.data = rows;
                        callback(returnData);
                        // setTimeout(function () {
                        //     $("#doordata_table").colResizable({
                        //         liveDrag: true,
                        //         gripInnerHtml: "<div class='grip'></div>",
                        //         draggingClass: "dragging",
                        //         resizeMode: 'overflow',
                        //     });
                        // }, 250);
                        // $('td').closest('table').find('th').eq(1).attr('style', 'text-align: center;');
                        // $('#probe_table tbody').find('td').eq(1).attr('style', 'text-align: center;');
                        // var trs = $('#probe_table tbody').find('tr');
                        // trs.find("td").eq(1).attr('style', 'text-align: center;');

                    }
                });
            }
        });
    }
});

$(document).ready(function () {
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
                $('.combo-dropdown').css("z-index", "3");
                $('div#city .option-item').click(function (city) {
                    setTimeout(function () {
                        var a = $(city.currentTarget)[0].innerText;
                        clearArea(a);
                        citySelected = $($(city.currentTarget)[0]).data('value');
                          
                        getCounty(citySelected);
                        $('div#city .combo-input').val(a);
                        $('div#city .combo-select select').val(a);
                    }, 30);
                });
                $('#city input[type=text] ').keyup(function (city) {
                    if (city.keyCode == '13') {
                        var b = $("#city .option-hover.option-selected").text();
                        clearArea(b);
                        var c = ($("#city .option-hover.option-selected"));
                        var c = c[0].dataset
                        citySelected = c.value;
                        getCounty(citySelected);
                        $('#city .combo-input').val(b);
                        $('#city .combo-select select').val(b);
                    }

                })
            }, 50);
        }
    });
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
            Doorsearch_data.city = cities;
            setTimeout(function () {
                $('#doorcity .jq22').comboSelect();
                $('.combo-dropdown').css("z-index", "3");
                $('#doorcity .option-item').click(function (city) {
                    setTimeout(function () {
                        var a = $(city.currentTarget)[0].innerText;
                        clearArea(a);
                        citySelected = $($(city.currentTarget)[0]).data('value');

                        getDoorArea(citySelected);
                        getdoorProbeCity(citySelected);
                        $('div#doorcity .combo-input').val(a);
                        $('div#doorcity .combo-select select').val(a);
                    }, 30);
                });
                $('#doorcity input[type=text] ').keyup(function (city) {
                    if (city.keyCode == '13') {
                        var b = $("#doorcity .option-hover.option-selected").text();
                        clearArea(b);
                        var c = ($("#doorcity .option-hover.option-selected"));
                        var c = c[0].dataset
                        citySelected = c.value;
                        getDoorArea(citySelected);
                        getdoorProbeCity(citySelected);
                        $('#doorcity .combo-input').val(b);
                        $('#doorcity .combo-select select').val(b);
                    }

                })
            }, 50);
        }
    });

    probeSelected = 0;
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
            Doorsearch_data.probe = probes;
            setTimeout(function () {
                $('#probe .jq22').comboSelect();
                $('.combo-dropdown').css("z-index", "3");
                $('#probe .option-item').click(function (probe) {
                    setTimeout(function () {
                        var a = $(probe.currentTarget)[0].innerText;
                        probeSelected = $($(probe.currentTarget)[0]).data('value');
                        $('#probe .combo-input').val(a);
                        $('#probe .combo-select select').val(a);
                    }, 30);
                });
                $('#probe input[type=text] ').keyup(function (probe) {
                    if (probe.keyCode == '13') {
                        var b = $("#probe .option-hover.option-selected").text();
                        probeSelected = $("#probe .option-hover.option-selected")[0].dataset.value;
                        $('#probe .combo-input').val(b);
                        $('#probe .combo-select select').val(b);
                    }
                })
            }, 50);
        }
    });

    function clearArea(a) {
        if (a == "所有地市") {
            $('#country .combo-input').val("所有区县");
            $('#country .combo-select select').val("所有区县");
            search_data.areas = [];
            doorprobe()
            $('#country ul').html("");
            $("#country ul").append("<li class='option-item option-hover option-selected' data-index=='0' data-value=''>" + "所有区县" + "</li>");
        }
    }

    $('#service .jq22').comboSelect();
    $("#service input[type=text]").attr('placeholder', "综合业务")
    $('.combo-dropdown').css("z-index", "3");
    $('#service .option-item').click(function (service) {
        var a = $(service.currentTarget)[0].innerText;
        serviceSelected = $($(service.currentTarget)[0]).data('value');
        setTimeout(function () {
            $('#service .combo-input').val(a);
        }, 20);

        getService(serviceSelected);
    });

    $('#service input[type=text] ').keyup(function (service) {
        if (service.keyCode == '13') {
            var b = $("#service .option-hover.option-selected").text();
            var c = ($("#service .option-hover.option-selected"));
            var c = c[0].dataset
            serviceSelected = c.value;
            getService(serviceSelected);
            $('#service .combo-input').val(b);
            $('#service .combo-select select').val(b);
        }

    });

    $('#doorservice .jq22').comboSelect();
    $("#doorservice input[type=text]").attr('placeholder', "网络连通性业务")
    $('.combo-dropdown').css("z-index", "3");
    $('#doorservice .option-item').click(function (service) {
        var a = $(service.currentTarget)[0].innerText;
        serviceSelected = $($(service.currentTarget)[0]).data('value');
        setTimeout(function () {
            $('#doorservice .combo-input').val(a);
        }, 20);

        getDoorService(serviceSelected);
    });

    $('#doorservice input[type=text] ').keyup(function (service) {
        if (service.keyCode == '13') {
            var b = $("#doorservice .option-hover.option-selected").text();
            var c = ($("#doorservice .option-hover.option-selected"));
            var c = c[0].dataset
            serviceSelected = c.value;
            getDoorService(serviceSelected);
            $('#doorservice .combo-input').val(b);
            $('#doorservice .combo-select select').val(b);
        }

    });

    $('#area .jq22').comboSelect();
    $("#area input[type=text]").attr('placeholder', "综合业务")
    $('.combo-dropdown').css("z-index", "3");
    $('#area .option-item').click(function (area) {
        var a = $(area.currentTarget)[0].innerText;
        area_Selected = $($(area.currentTarget)[0]).data('value');
        setTimeout(function () {
            $('#area .combo-input').val(a);
        }, 20);
        getAreaService(area_Selected);
    });

    $('#area input[type=text] ').keyup(function (area) {
        if (area.keyCode == '13') {
            var b = $("#area .option-hover.option-selected").text();
            area_Selected = $("#area .option-hover.option-selected")[0].dataset.value;
            getAreaService(serviceSelected);
            $('#area .combo-input').val(b);
            $('#area .combo-select select').val(b);
        }
    });
    //区域排名
    citySelected = 0;
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
                $('div#areaCity .jq22').comboSelect();
                $('.combo-dropdown').css("z-index", "3");
                $('div#areaCity .option-item').click(function (area) {
                    setTimeout(function () {
                        var a = $(area.currentTarget)[0].innerText;
                        clearArea(a);
                        citySelected = $($(area.currentTarget)[0]).data('value');
                        $('div#areaCity .combo-input').val(a);
                        $('div#areaCity .combo-select select').val(a);
                    }, 50);
                });
                $('#areaCity input[type=text] ').keyup(function (area) {
                    if (area.keyCode == '13') {
                        var b = $("#areaCity .option-hover.option-selected").text();
                        clearArea(b);
                        var c = ($("#areaCity .option-hover.option-selected"));
                        var c = c[0].dataset;
                        citySelected = c.value;
                        $('#areaCity .combo-input').val(b);
                        $('#areaCity .combo-select select').val(b);
                    }

                })
            }, 100);
        }
    });
});

//探针
var getdoorProbe = function (countyid) {
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
            Doorsearch_data.probe = probes;
            setTimeout(function () {
                $('#probe .jq22').comboSelect();
                $('.combo-dropdown').css("z-index", "3");
                $('#probe .option-item').click(function (probe) {
                    setTimeout(function () {
                        var a = $(probe.currentTarget)[0].innerText;
                        probeSelected = $($(probe.currentTarget)[0]).data('value');
                        $('#probe .combo-input').val(a);
                        $('#probe .combo-select select').val(a);
                    }, 30);
                });
                $('#probe input[type=text] ').keyup(function (probe) {
                    if (probe.keyCode == '13') {
                        var b = $("#probe .option-hover.option-selected").text();
                        probeSelected = $("#probe .option-hover.option-selected")[0].dataset.value;
                        $('#probe .combo-input').val(b);
                        $('#probe .combo-select select').val(b);
                    }

                })
            }, 50);
        }
    });
};
//城市探针
var getdoorProbeCity = function (cityid) {
    probeSelected = 0;
    if (cityid != "" && cityid != null) {
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
                Doorsearch_data.probe = probes;
                setTimeout(function () {
                    $('#probe .jq22').comboSelect();
                    $('.combo-dropdown').css("z-index", "3");
                    $('#probe .option-item').click(function (probe) {
                        setTimeout(function () {
                            var a = $(probe.currentTarget)[0].innerText;
                            probeSelected = $($(probe.currentTarget)[0]).data('value');
                            $('#probe .combo-input').val(a);
                            $('#probe .combo-select select').val(a);
                        }, 30);
                    });
                    $('#probe input[type=text] ').keyup(function (probe) {
                        if (probe.keyCode == '13') {
                            var b = $("#probe .option-hover.option-selected").text();
                            probeSelected = $("#probe .option-hover.option-selected")[0].dataset.value;
                            $('#probe .combo-input').val(b);
                            $('#probe .combo-select select').val(b);
                        }

                    })
                }, 50);
            }
        });
    }

};

function doorprobe() {
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
            Doorsearch_data.probe = probes;
            setTimeout(function () {
                $('#probe .jq22').comboSelect();
                $('.combo-dropdown').css("z-index", "3");
                $('#probe .option-item').click(function (probe) {
                    setTimeout(function () {
                        var a = $(probe.currentTarget)[0].innerText;
                        probeSelected = $($(probe.currentTarget)[0]).data('value');
                        $('#probe .combo-input').val(a);
                        $('#probe .combo-select select').val(a);
                    }, 30);
                });
                $('#probe input[type=text] ').keyup(function (probe) {
                    if (probe.keyCode == '13') {
                        var b = $("#probe .option-hover.option-selected").text();
                        probeSelected = $("#probe .option-hover.option-selected")[0].dataset.value;
                        $('#probe .combo-input').val(b);
                        $('#probe .combo-select select').val(b);
                    }

                })
            }, 50);
        }
    });
};

function diagnose_info(obj,num) {
      
    probeSelected=0;
    diagnosetargetSelected;
    $('#diagnoseprobe .combo-input').val('请选择');
    $('#diagnoseprobe .combo-select select').val('请选择');
    $('#diagnosecity .combo-input').val('请选择');
    $('#diagnosecity .combo-select select').val('请选择');
    $('#diagnosetarget .combo-input').val('请选择');
    $('#diagnosetarget .combo-select select').val('请选择');
    $('#diagnosecountry .combo-input').val('请选择');
    $('#diagnosecountry .combo-select select').val('请选择');
    if(num==1){
        var probeName=obj.id;
        var type=parseInt(obj.type);
        var cityName=obj.title;
        var countryName=obj.lang;
        var targetName=obj.charset;
        if(probeName!=undefined){
            setTimeout(function () {
                $('#diagnoseprobe .combo-input').val(probeName);
                $('#diagnoseprobe .combo-select select').val(probeName);
            },100)
        }
    }else if(num==2){
        var cityId=cityId;
        var countryId=obj.id;
        getdiagnoseProbeCounty(countryId);
        getArea(cityId);
        var type=parseInt(obj.type);
        var cityName=obj.title;
        var countryName=obj.lang;
        var targetName=obj.charset;
        if(probeName!=undefined){
            setTimeout(function () {
                $('#diagnoseprobe .combo-input').val(probeName);
                $('#diagnoseprobe .combo-select select').val(probeName);
            },100)
        }
    }else {
        probe();
        var probeName=obj.id;
        var type=parseInt(obj.type);
        if(cityId!=undefined){
          getArea(cityId)
        }else if(countyId!=-1){
            getdiagnoseProbeCounty(countryId);

        }
        var targetName=obj.charset;
        if(probeName!=undefined){
            setTimeout(function () {
                $('#diagnoseprobe .combo-input').val(probeName);
                $('#diagnoseprobe .combo-select select').val(probeName);
            },500)
        }
    }


    if(probeId!=-1){
        probeSelected=probeId;
    }
    if(targetId!=-1){
        diagnosetargetSelected=targetId;
    }

    //console.log(diagnosetargetSelected)
     if(type==1||type==0){
        $('#ping').click();
    }else if(type==2){
        $('#sla').click();
    }else if(type==3){
        $('#web').click();
    }else if(type==4){
        $('#diagnosedownload').click();
    }else if(type==5){
        $('#diagnosevideo').click();
    }else if(type==6){
        $('#diagnosegame').click();
    }

    if(cityName!=undefined){
        setTimeout(function () {
            $('#diagnosecity .combo-input').val(cityName);
            $('#diagnosecity .combo-select select').val(cityName);
        },200)
    }
    if(countryName!=undefined){
        setTimeout(function () {
            $('#diagnosecountry .combo-input').val(countryName);
            $('#diagnosecountry .combo-select select').val(countryName);
        },200)
    }
    if(targetName!= undefined){
       setTimeout(function () {
           $('#diagnosetarget .combo-input').val(targetName);
           $('#diagnosetarget .combo-select select').val(targetName);
       },500)
    }
    $('#myModal_diagnose').modal('show');

}


function update_this(obj) {
    $('#myModal_update').modal('show');
    if (obj.type == '综合业务') {
        information(obj);
        $('#myModal_update .modal-body').css('height', '110px');
        $('#connnection').css('display', 'none');
        $('#quality').css('display', 'none');
        $('#broswer').css('display', 'none');
        $('#download').css('display', 'none');
        $('#video').css('display', 'none');
        $('#game').css('display', 'none');
    } else if (obj.type == '网络连通性业务') {
        ping(obj)
        $('#myModal_update .modal-body').css('height', '160px');
        $('#information').css('display', 'none');
        $('#connnection').removeAttr('style');
        $('#quality').css('display', 'none');
        $('#broswer').css('display', 'none');
        $('#download').css('display', 'none');
        $('#video').css('display', 'none');
        $('#game').css('display', 'none');

    } else if (obj.type == '网络层质量业务') {
        quality(obj)
        $('#myModal_update .modal-body').css('height', '160px');
        $('#quality').removeAttr('style');
        $('#information').css('display', 'none');
        $('#connnection').css('display', 'none');
        $('#broswer').css('display', 'none');
        $('#download').css('display', 'none');
        $('#video').css('display', 'none');
        $('#game').css('display', 'none');
    } else if (obj.type == '网页浏览业务') {
        broswer(obj)
        $('#myModal_update  .modal-body').css('height', '130px');
        $('#broswer').removeAttr('style');
        $('#quality').css('display', 'none');
        $('#information').css('display', 'none');
        $('#connnection').css('display', 'none');
        $('#download').css('display', 'none');
        $('#video').css('display', 'none');
        $('#game').css('display', 'none');
    } else if (obj.type == '文件下载业务') {
        download(obj);
        $('#myModal_update .modal-body').css('height', '160px');
        $('#download').removeAttr('style');
        $('#information').css('display', 'none');
        $('#connnection').css('display', 'none');
        $('#quality').css('display', 'none');
        $('#broswer').css('display', 'none');
        $('#video').css('display', 'none');
        $('#game').css('display', 'none');
    } else if (obj.type == '在线视频业务') {
        video(obj);
        $('#myModal_update .modal-body').css('height', '160px');
        $('#video').removeAttr('style');
        $('#download').css('display', 'none');
        $('#quality').css('display', 'none');
        $('#information').css('display', 'none');
        $('#connnection').css('display', 'none');
        $('#broswer').css('display', 'none');
        $('#game').css('display', 'none');
    } else if (obj.type == '网络游戏业务') {
        game(obj);
        $('#myModal_update .modal-body').css('height', '160px');
        $('#game').removeAttr('style');
        $('#video').css('display', 'none');
        $('#quality').css('display', 'none');
        $('#information').css('display', 'none');
        $('#connnection').css('display', 'none');
        $('#broswer').css('display', 'none');
        $('#download').css('display', 'none');

    }

}

//探针排名
//综合性表格
function information(obj) {
    var id = obj.id;
    var information_table = new Vue({
        el: '#information_table',
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
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
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
                oLanguage: {
                    sEmptyTable: "No data available in table",
                    sZeroRecords:"No data available in table",
                },
                scroll: false,
                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数

                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = probeContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    probeContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(item.score.toFixed(2));
                            if (item.connectionScore != undefined) {
                                row.push(item.connectionScore.toFixed(2));
                            } else {
                                row.push(item.connectionScore);
                            }
                            if (item.qualityScore != undefined) {
                                row.push(item.qualityScore.toFixed(2));
                            } else {
                                row.push(item.qualityScore);
                            }
                            if (item.broswerScore != undefined) {
                                row.push(item.broswerScore.toFixed(2));
                            } else {
                                row.push(item.broswerScore);
                            }
                            if (item.downloadScore != undefined) {
                                row.push(item.downloadScore.toFixed(2));
                            } else {
                                row.push(item.downloadScore);
                            }
                            if (item.videoScore != undefined) {
                                row.push(item.videoScore.toFixed(2));
                            } else {
                                row.push(item.videoScore);
                            }
                            if (item.gameScore != undefined) {
                                row.push(item.gameScore.toFixed(2));
                            } else {
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
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
                    });
                }
            });
        }
    })
}

//网络连通性表格
function ping(obj) {
    // $("#pingdata_table  tr").remove();
    var id = obj.id;
    var ping_table = new Vue({
        el: '#pingdata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
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
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
                vm.dtHandle.clear();
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function (row, data, index) {
                    var trs = $("#pingdata_table>thead tr");
                    if (trs.length > 1) {
                        return
                    } else if (index == 0) { //生成了行之后，开始生成表头>>>
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        var columnsCount = 38;//具体情况
                        innerTh += '<th colspan="7" style="text-align: center">ping(ICMP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">ping(TCP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">ping(UDP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Trace Route(ICMP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Trace Route(UDP)</th>';
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    probeContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.pingIcmpDelay ));
                            row.push(fixed(item.pingIcmpDelayStd) );
                            row.push(fixed(item.pingIcmpDelayVar ));
                            row.push(fixed(item.pingIcmpJitter ));
                            row.push(fixed(item.pingIcmpJitterStd ));
                            row.push(fixed(item.pingIcmpJitterVar ));
                            row.push(fixedRate(item.pingIcmpLossRate ));
                            row.push(fixed(item.pingTcpDelay ));
                            row.push(fixed(item.pingTcpDelayStd ));
                            row.push(fixed(item.pingTcpDelayVar ));
                            row.push(fixed(item.pingTcpJitter ));
                            row.push(fixed(item.pingTcpJitterStd ));
                            row.push(fixed(item.pingTcpJitterVar ));
                            row.push(fixedRate(item.pingTcpLossRate ));
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
                        }
                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#pingdata_table").colResizable({
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

//网络质量表格
function quality(obj) {
    var id = obj.id;
    var quality_table = new Vue({
        el: '#qualitydata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
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
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
                vm.dtHandle.clear();
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function (row, data, index) {
                    var trs = $("#qualitydata_table>thead tr");
                    if (trs.length > 1) {
                        return
                    } else if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        var columnsCount = 25;//具体情况
                        innerTh += '<th colspan="2 " style="text-align: center">DNS</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Sla(TCP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Sla(UDP)</th>';

                        innerTh += '<th colspan="2" style="text-align: center">DHCP</th>';
                        innerTh += '<th colspan="3" style="text-align: center">ADSL</th>';
                        innerTh += '<th colspan="2"style="text-align: center">Radius</th>';
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    probeContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
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
                            row.push(fixedRate(item.dhcpSuccessRate));
                            row.push(fixed(item.pppoeDelay));
                            row.push(fixedRate(item.pppoeDropRate));
                            row.push(fixedRate(item.pppoeSuccessRate));
                            row.push(fixed(item.radiusDelay));
                            row.push(fixedRate(item.radiusSuccessRate));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#qualitydata_table").colResizable({
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

//网页浏览表格
function broswer(obj) {
    var id = obj.id;
    var broswer_table = new Vue({
        el: '#broswerdata_table',
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
                {title: '<div style="width:115px">页面加载时延(ms)</div>'},
                {title: '<div style="width:100px">下载速率(KB/s)</div>'},
                {title: '<div style="width:100px">失败率(KB/s)</div>'},
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
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    probeContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.webpageDnsDelay ));
                            row.push(fixed(item.webpageConnDelay ));
                            row.push(fixed(item.webpageHeadbyteDelay ));
                            row.push(fixed(item.webpagePageFileDelay ));
                            row.push(fixed(item.webpageRedirectDelay ));
                            row.push(fixed(item.webpageAboveFoldDelay ));
                            row.push(fixed(item.webpageLoadDelay) );
                            row.push(fixed(item.webpageDownloadRate ));
                            row.push(fixed(item.fail/item.total ));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#broswerdata_table").colResizable({
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

//下载
function download(obj) {
    var id = obj.id;
    //网页下载
    var download_table = new Vue({
        el: '#downloaddata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
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
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
                vm.dtHandle.clear();
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function (row, data, index) {
                    //生成了行之后，开始生成表头>>>
                    var trs = $("#downloaddata_table>thead tr");
                    if (trs.length > 1) {
                        return
                    }
                    if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';

                        var columnsCount = 17;//具体情况
                        innerTh += '<th colspan="4" style="text-align: center">WEB下载</th>';
                        innerTh += '<th colspan="5" style="text-align: center">FTP下载</th>';
                        innerTh += '<th colspan="5" style="text-align: center">FTP上传</th>';
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    probeContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
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
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
                    });
                }
            });
        }

    })
}

// /在线视频
function video(obj) {
    var id = obj.id;
    var video_table = new Vue({
        el: '#videodata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
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
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
                vm.dtHandle.clear();
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    probeContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.webVideoDnsDelay ));
                            row.push(fixed(item.webVideoWsConnDelay));
                            row.push(fixed(item.webVideoWebPageDelay ));
                            row.push(fixed(item.webVideoHeadFrameDelay ));
                            row.push(fixed(item.webVideoInitBufferDelay ));
                            row.push(fixed(item.webVideoLoadDelay ));
                            row.push(fixed(item.webVideoTotalBufferDelay ));
                            row.push(fixed(item.webVideoDownloadRate ) );
                            row.push(fixed(item.webVideoBufferTime ));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#videodata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
                    });
                }
            });
        }

    })
}

//在线游戏
function game(obj) {
    var id = obj.id;
    var download_table = new Vue({
        el: '#gamedata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">探针名称</div>'},
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
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
                vm.dtHandle.clear();
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    probeContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.gameDnsDelay));
                            row.push(fixed(item.gamePacketDelay) );
                            row.push(fixed(item.gamePacketJitter ));
                            row.push(fixedRate(item.gameLossRate ));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#gamedata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
                    });
                }
            });
        }
    })
}


function area_this(obj, areaContent) {
    recordtag = recordtype.get(area_Selected);
    if (recordtag == "info") {
        $(".record-table").addClass("service_unselected");
        $("#" + recordtag + "_record ").removeClass("service_unselected");

        information_table.reset(obj, areaContent);
    }
    if (recordtag == "ping1") {
        $(".record-table").addClass("service_unselected");
        $("#" + recordtag + "_record ").removeClass("service_unselected");

        ping_table.reset(obj, areaContent);
    }
    if (recordtag == "sla") {
        $(".record-table").addClass("service_unselected");
        $("#" + recordtag + "_record ").removeClass("service_unselected");

        quality_table.reset(obj, areaContent);

    }

    if (recordtag == "webpage") {
        $(".record-table").addClass("service_unselected");
        $("#" + recordtag + "_record ").removeClass("service_unselected");
        broswer_table.reset(obj, areaContent);
    }
    if (recordtag == "webdownload") {
        $(".record-table").addClass("service_unselected");
        $("#" + recordtag + "_record ").removeClass("service_unselected");
        download_table.reset(obj, areaContent);
    }

    if (recordtag == "webvideo") {
        $(".record-table").addClass("service_unselected");
        $("#" + recordtag + "_record ").removeClass("service_unselected");
        video_table.reset(obj, areaContent);
    }
    if (recordtag == "game1") {
        $(".record-table").addClass("service_unselected");
        $("#" + recordtag + "_record ").removeClass("service_unselected");
        /*根据查询条件重绘*/
        game_table.reset(obj, areaContent);
    }
    // if (obj.type == '综合业务') {
    //     area_information(obj, areaContent);
    //     $('#areaConnection').css('display', 'none');
    //     $('#areaQuality').css('display', 'none');
    //     $('#areaBroswer').css('display', 'none');
    //     $('#areaDownload').css('display', 'none');
    //     $('#areaVideo').css('display', 'none');
    //     $('#areaGame').css('display', 'none');
    // } else if (obj.type == '网络连通性业务') {
    //     area_ping(obj, areaContent)
    //
    //     $('#areaInformation').css('display', 'none');
    //     $('#areaConnection').removeAttr('style');
    //     $('#areaQuality').css('display', 'none');
    //     $('#areaBroswer').css('display', 'none');
    //     $('#areaDownload').css('display', 'none');
    //     $('#areaVideo').css('display', 'none');
    //     $('#areaGame').css('display', 'none');
    //
    // } else if (obj.type == '网络层质量业务') {
    //     area_quality(obj, areaContent)
    //     $('#areaQuality').removeAttr('style');
    //     $('#areaInformation').css('display', 'none');
    //     $('#areaConnection').css('display', 'none');
    //     $('#areaBroswer').css('display', 'none');
    //     $('#areaDownload').css('display', 'none');
    //     $('#areaVideo').css('display', 'none');
    //     $('#areaGame').css('display', 'none');
    // } else if (obj.type == '网页浏览业务') {
    //     area_broswer(obj, areaContent)
    //     $('#areaBroswer').removeAttr('style');
    //     $('#areaQuality').css('display', 'none');
    //     $('#areaInformation').css('display', 'none');
    //     $('#areaConnection').css('display', 'none');
    //     $('#areaDownload').css('display', 'none');
    //     $('#areaVideo').css('display', 'none');
    //     $('#areaGame').css('display', 'none');
    // } else if (obj.type == '文件下载业务') {
    //     area_download(obj, areaContent);
    //     $('#areaDownload').removeAttr('style');
    //     $('#areaInformation').css('display', 'none');
    //     $('#areaConnection').css('display', 'none');
    //     $('#areaQuality').css('display', 'none');
    //     $('#areaBroswer').css('display', 'none');
    //     $('#areaVideo').css('display', 'none');
    //     $('#areaGame').css('display', 'none');
    // } else if (obj.type == '在线视频业务') {
    //     area_video(obj, areaContent);
    //     $('#areaVideo').removeAttr('style');
    //     $('#areaDownload').css('display', 'none');
    //     $('#areaQuality').css('display', 'none');
    //     $('#areaInformation').css('display', 'none');
    //     $('#areaConnection').css('display', 'none');
    //     $('#areaBroswer').css('display', 'none');
    //     $('#areaGame').css('display', 'none');
    // } else if (obj.type == '网络游戏业务') {
    //     area_game(obj, areaContent);
    //     $('#areaGame').removeAttr('style');
    //     $('#areaVideo').css('display', 'none');
    //     $('#areaQuality').css('display', 'none');
    //     $('#areaInformation').css('display', 'none');
    //     $('#areaConnection').css('display', 'none');
    //     $('#areaBroswer').css('display', 'none');
    //     $('#areaDownload').css('display', 'none');
    // }
    $('#area_update').modal('show');

}

//区域排名
//综合性表格
var information_table = new Vue({
    el: '#infodata_table',
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
        reset: function (obj, areaContent) {
            var id = obj.id;
            var content = areaContent
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
                scrollY :300,
                scrollX: true,
                scrollCollapse: true,
                destroy: true,
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(content);
                    let rows = [];
                    var i = 1;
                    content.forEach(function (item) {
                        if (id == item.countyId) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(item.score.toFixed(2) );
                            if (item.connectionScore != undefined) {
                                row.push(item.connectionScore.toFixed(2));
                            } else {
                                row.push(item.connectionScore);
                            }
                            if (item.qualityScore != undefined) {
                                row.push(item.qualityScore.toFixed(2));
                            } else {
                                row.push(item.qualityScore);
                            }
                            if (item.broswerScore != undefined) {
                                row.push(item.broswerScore.toFixed(2));
                            } else {
                                row.push(item.broswerScore);
                            }
                            if (item.downloadScore != undefined) {
                                row.push(item.downloadScore.toFixed(2));
                            } else {
                                row.push(item.downloadScore);
                            }
                            if (item.videoScore != undefined) {
                                row.push(item.videoScore.toFixed(2));
                            } else {
                                row.push(item.videoScore);
                            }
                            if (item.gameScore != undefined) {
                                row.push(item.gameScore.toFixed(2));
                            } else {
                                row.push(item.gameScore);
                            }
                            rows.push(row);
                        }


                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#infodata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
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
    mounted: function () {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }
})

//网络连通性表格
var ping_table = new Vue({
    el: '#ping1data_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
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
        reset: function (obj, areaContent) {
            let vm = this;
            var id = obj.id;
            var content = areaContent;
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function (row, data, index) {
                    var trs=$("#ping1data_table_wrapper>.dataTables_scroll>.dataTables_scrollHead>.dataTables_scrollHeadInner>table>thead>tr");
                    if (trs.length > 1) {
                        return
                    } else if (index == 0) { //生成了行之后，开始生成表头>>>
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        var columnsCount = 38;//具体情况
                        innerTh += '<th colspan="7" style="text-align: center">ping(ICMP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">ping(TCP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">ping(UDP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Trace Route(ICMP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Trace Route(UDP)</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('ping1data_table').insertRow(0);
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
                scrollY :300,
                scrollX: true,
                scrollCollapse: true,
                destroy: true,

                // fixedColumns:   {
                //     leftColumns: 1,
                // },
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    content.forEach(function (item) {
                        if (id == item.countyId) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.pingIcmpDelay ));
                            row.push(fixed(item.pingIcmpDelayStd) );
                            row.push(fixed(item.pingIcmpDelayVar ));
                            row.push(fixed(item.pingIcmpJitter ));
                            row.push(fixed(item.pingIcmpJitterStd ));
                            row.push(fixed(item.pingIcmpJitterVar ));
                            row.push(fixedRate(item.pingIcmpLossRate ));
                            row.push(fixed(item.pingTcpDelay ));
                            row.push(fixed(item.pingTcpDelayStd ));
                            row.push(fixed(item.pingTcpDelayVar ));
                            row.push(fixed(item.pingTcpJitter ));
                            row.push(fixed(item.pingTcpJitterStd ));
                            row.push(fixed(item.pingTcpJitterVar ));
                            row.push(fixedRate(item.pingTcpLossRate ) );
                            row.push(fixed(item.pingUdpDelay));
                            row.push(fixed(item.pingUdpDelayStd));
                            row.push(fixed(item.pingUdpDelayVar));
                            row.push(fixed(item.pingUdpJitter));
                            row.push(fixed(item.pingUdpJitterStd));
                            row.push(fixed(item.pingUdpJitterVar));
                            row.push(fixedRate(item.pingUdpLossRate) );
                            row.push(fixed(item.tracertIcmpDelay));
                            row.push(fixed(item.tracertIcmpDelayStd));
                            row.push(fixed(item.tracertIcmpDelayVar));
                            row.push(fixed(item.tracertIcmpJitter));
                            row.push(fixed(item.tracertIcmpJitterStd));
                            row.push(fixed(item.tracertIcmpJitterVar));
                            row.push(fixedRate(item.tracertIcmpLossRate) );
                            row.push(fixed(item.tracertTcpDelay));
                            row.push(fixed(item.tracertTcpDelayStd));
                            row.push(fixed(item.tracertTcpDelayVar));
                            row.push(fixed(item.tracertTcpJitter));
                            row.push(fixed(item.tracertTcpJitterStd));
                            row.push(fixed(item.tracertTcpJitterVar));
                            row.push(fixedRate(item.tracertTcpLossRate) );
                            rows.push(row);
                        }
                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#ping1data_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
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
    mounted: function (obj) {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }

});


//网络质量表格
var quality_table = new Vue({
    el: '#sladata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
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
        reset: function (obj,areaContent) {
            let vm = this;
            var id = obj.id;
            var content = areaContent;
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function (row, data, index) {
                    var trs=$("#sladata_table_wrapper>.dataTables_scroll>.dataTables_scrollHead>.dataTables_scrollHeadInner>table>thead>tr");

                    if (trs.length > 1) {
                        return
                    } else if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        var columnsCount = 25;//具体情况
                        innerTh += '<th colspan="2 " style="text-align: center">DNS</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Sla(TCP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Sla(UDP)</th>';

                        innerTh += '<th colspan="2" style="text-align: center">DHCP</th>';
                        innerTh += '<th colspan="3" style="text-align: center">ADSL</th>';
                        innerTh += '<th colspan="2"style="text-align: center">Radius</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('sladata_table').insertRow(0);
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
                oLanguage: {
                    sEmptyTable: "No data available in table",
                    sZeroRecords:"No data available in table",
                },

                scrollY :300,
                scrollX: true,
                scrollCollapse: true,
                destroy: true,
                sDom: 'Rfrtlip', /*显示在左下角*/
                ajax: function (data, callback, settings) {
                    //封装请求参数
                    //ajax请求数据
                    let returnData = {};
                    // returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    // returnData.recordsTotal = result.page.totalCount;//返回数据全部记录
                    // returnData.recordsFiltered = result.page.totalCount;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = probeContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    content.forEach(function (item) {
                        if (id == item.countyId) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.dnsDelay));
                            row.push(fixedRate(item.dnsSuccessRate) );
                            row.push(fixed(item.slaTcpDelay));
                            row.push(fixed(item.slaTcpGDelay));
                            row.push(fixed(item.slaTcpRDelay));
                            row.push(fixed(item.slaTcpJitter));
                            row.push(fixed(item.slaTcpGJitter));
                            row.push(fixed(item.slaTcpRJitter));
                            row.push(fixedRate(item.slaTcpLossRate) );
                            row.push(fixed(item.slaUdpDelay));
                            row.push(fixed(item.slaUdpGDelay));
                            row.push(fixed(item.slaUdpRDelay));
                            row.push(fixed(item.slaUdpJitter));
                            row.push(fixed(item.slaUdpGJitter));
                            row.push(fixed(item.slaUdpRJitter));
                            row.push(fixedRate(item.slaUdpLossRate) );

                            row.push(fixed(item.dhcpDelay));
                            row.push(fixedRate(item.dhcpSuccessRate) );
                            row.push(fixed(item.pppoeDelay));
                            row.push(fixedRate(item.pppoeDropRate) );
                            row.push(fixedRate(item.pppoeSuccessRate) );
                            row.push(fixed(item.radiusDelay));
                            row.push(fixedRate(item.radiusSuccessRate) );
                            rows.push(row);
                        }
                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#sladata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
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
    mounted: function (obj) {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }

});


//网页浏览表格
var broswer_table = new Vue({
    el: '#webpagedata_table',
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
            {title: '<div style="width:115px">页面加载时延(ms)</div>'},
            {title: '<div style="width:100px">下载速率(KB/s)</div>'},
        ],
        rows: [],
        dtHandle: null,
    },
    methods: {
        reset: function (obj,areaContent) {
            let vm = this;
            var id = obj.id;
            var content = areaContent;
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                // serverSide: true,
                info: false,
                scrollY :300,
                scrollX: true,
                scrollCollapse: true,
                destroy: true,
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    content.forEach(function (item) {
                        if (id == item.countyId) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.webpageDnsDelay ));
                            row.push(fixed(item.webpageConnDelay ));
                            row.push(fixed(item.webpageHeadbyteDelay ));
                            row.push(fixed(item.webpagePageFileDelay ));
                            row.push(fixed(item.webpageRedirectDelay ));
                            row.push(fixed(item.webpageAboveFoldDelay ));
                            row.push(fixed(item.webpageLoadDelay) );
                            row.push(fixed(item.webpageDownloadRate ));
                            rows.push(row);
                        }
                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#webpagedata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
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

});

//网页下载
var download_table = new Vue({
    el: '#webdownloaddata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
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
        reset: function (obj,areaContent) {
            let vm = this;
            var id = obj.id;
            var content = areaContent;
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function (row, data, index) {
                    var trs=$("#webdownloaddata_table_wrapper>.dataTables_scroll>.dataTables_scrollHead>.dataTables_scrollHeadInner>table>thead>tr");

                    //生成了行之后，开始生成表头>>>
                    if (trs.length > 1) {
                        return
                    }
                    if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';

                        var columnsCount = 17;//具体情况
                        innerTh += '<th colspan="4" style="text-align: center">WEB下载</th>';
                        innerTh += '<th colspan="5" style="text-align: center">FTP下载</th>';
                        innerTh += '<th colspan="5" style="text-align: center">FTP上传</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('webdownloaddata_table').insertRow(0);
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
                scrollY :300,
                scrollX: true,
                scrollCollapse: true,
                destroy: true,
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    content.forEach(function (item) {
                        if (id == item.countyId) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(item.score.toFixed(2));
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

                    $("#webdownloaddata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
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
    mounted: function (obj) {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }

});

// /在线视频
var video_table = new Vue({
    el: '#webvideodata_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
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
        reset: function (obj, areaContent) {
            let vm = this;
            var id = obj.id;
            var content = areaContent
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
                scrollY :300,
                scrollX: true,
                scrollCollapse: true,
                destroy: true,
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    content.forEach(function (item) {
                        if (id == item.countyId) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.webVideoDnsDelay ));
                            row.push(fixed(item.webVideoWsConnDelay));
                            row.push(fixed(item.webVideoWebPageDelay ));
                            row.push(fixed(item.webVideoHeadFrameDelay ));
                            row.push(fixed(item.webVideoInitBufferDelay ));
                            row.push(fixed(item.webVideoLoadDelay ));
                            row.push(fixed(item.webVideoTotalBufferDelay ));
                            row.push(fixed(item.webVideoDownloadRate ) );
                            row.push(fixed(item.webVideoBufferTime ));
                            rows.push(row);
                        }
                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#webvideodata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
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
    mounted: function (obj) {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }

})

//网络游戏
var game_table = new Vue({
    el: '#game1data_table',
    data: {
        headers: [
            {title: '<div style="width:10px"></div>'},
            {title: '<div style="width:110px">探针名称</div>'},
            {title: '<div style="width:70px">综合分数</div>'},
            {title: '<div style="width:100px">DNS时延(ms)</div>'},
            {title: '<div style="width:120px">网络时延(ms)</div>'},
            {title: '<div style="width:120px">网络抖动(ms)</div>'},
            {title: '<div style="width:120px">丢包率(%)</div>'},
        ],
        rows: [],
        dtHandle: null,
    },
    methods: {
        reset: function (obj, areaContent) {
            let vm = this;
            var id = obj.id;
            var content = areaContent
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                searching: false,
                paging: false,
                // serverSide: true,
                info: false,
                scrollY :300,
                scrollX: true,
                scrollCollapse: true,
                destroy: true,
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    content.forEach(function (item) {
                        if (id == item.countyId) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.gameDnsDelay));
                            row.push(fixed(item.gamePacketDelay) );
                            row.push(fixed(item.gamePacketJitter ));
                            row.push(fixedRate(item.gameLossRate ) );
                            rows.push(row);
                        }
                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#game1data_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
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
    mounted: function () {
        let vm = this;
        // Instantiate the datatable and store the reference to the instance in our dtHandle element.

    }
})


//门户排名
function doorupdate_this(obj) {
    $('#door_update').modal('show');
    if (obj.type == '综合业务') {
        door_information(obj);
        $('#door_update .modal-body').css('height', '110px');
        $(".record-table").addClass("service_unselected");
        $("#doorinformation").removeClass("service_unselected");
    } else if (obj.type == '网络连通性业务') {
        door_ping(obj)
        $(".record-table").addClass("service_unselected");
        $("#doorconnnection").removeClass("service_unselected");
        $('#door_update .modal-body').css('height', '160px');

    } else if (obj.type == '网络层质量业务') {
        door_quality(obj)
        $('#door_update .modal-body').css('height', '160px');
        $(".record-table").addClass("service_unselected");
        $("#doorquality").removeClass("service_unselected");

    } else if (obj.type == '网页浏览业务') {
        door_broswer(obj)
        $('#door_update  .modal-body').css('height', '130px');
        $(".record-table").addClass("service_unselected");
        $("#doorbroswer").removeClass("service_unselected");
    } else if (obj.type == '文件下载业务') {
        door_download(obj);
        $('#door_update .modal-body').css('height', '160px');
        $(".record-table").addClass("service_unselected");
        $("#doordownload").removeClass("service_unselected");
    } else if (obj.type == '在线视频业务') {
        door_video(obj);
        $('#door_update .modal-body').css('height', '160px');
        $(".record-table").addClass("service_unselected");
        $("#doorvideo").removeClass("service_unselected");
    } else if (obj.type == '网络游戏业务') {
        door_game(obj);
        $('#door_update .modal-body').css('height', '160px');
        $(".record-table").addClass("service_unselected");
        $("#doorgame").removeClass("service_unselected");

    }

}

//综合性表格
function door_information(obj) {
    var id = obj.id;
    var information_table = new Vue({
        el: '#doorinformation_table',
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
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
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
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    doorContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.probeName);
                            row.push(item.score.toFixed(2));
                            if (item.connectionScore != undefined) {
                                row.push(item.connectionScore.toFixed(2));
                            } else {
                                row.push(item.connectionScore);
                            }
                            if (item.qualityScore != undefined) {
                                row.push(item.qualityScore.toFixed(2));
                            } else {
                                row.push(item.qualityScore);
                            }
                            if (item.broswerScore != undefined) {
                                row.push(item.broswerScore.toFixed(2));
                            } else {
                                row.push(item.broswerScore);
                            }
                            if (item.downloadScore != undefined) {
                                row.push(item.downloadScore.toFixed(2));
                            } else {
                                row.push(item.downloadScore);
                            }
                            if (item.videoScore != undefined) {
                                row.push(item.videoScore.toFixed(2));
                            } else {
                                row.push(item.videoScore);
                            }
                            if (item.gameScore != undefined) {
                                row.push(item.gameScore.toFixed(2));
                            } else {
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
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
                    });
                }
            });
        }
    })
}

//网络连通性表格
function door_ping(obj) {
    var id = obj.id;
    var ping_table = new Vue({
        el: '#doorpingdata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">测试目标</div>'},
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
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
                vm.dtHandle.clear();
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function (row, data, index) {
                    var trs = $("#doorpingdata_table>thead tr");
                    if (trs.length > 1) {
                        return
                    } else if (index == 0) { //生成了行之后，开始生成表头>>>
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        var columnsCount = 38;//具体情况
                        innerTh += '<th colspan="7" style="text-align: center">ping(ICMP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">ping(TCP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">ping(UDP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Trace Route(ICMP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Trace Route(UDP)</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('doorpingdata_table').insertRow(0);
                        var $tr = $("#doorpingdata_table tr").eq(0);
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
                    returnData.data = doorContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    doorContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.targetName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.pingIcmpDelay ));
                            row.push(fixed(item.pingIcmpDelayStd) );
                            row.push(fixed(item.pingIcmpDelayVar ));
                            row.push(fixed(item.pingIcmpJitter ));
                            row.push(fixed(item.pingIcmpJitterStd ));
                            row.push(fixed(item.pingIcmpJitterVar ));
                            row.push(fixedRate(item.pingIcmpLossRate ) );
                            row.push(fixed(item.pingTcpDelay ));
                            row.push(fixed(item.pingTcpDelayStd ));
                            row.push(fixed(item.pingTcpDelayVar ));
                            row.push(fixed(item.pingTcpJitter ));
                            row.push(fixed(item.pingTcpJitterStd ));
                            row.push(fixed(item.pingTcpJitterVar ));
                            row.push(fixedRate(item.pingTcpLossRate ) );
                            row.push(fixed(item.pingUdpDelay));
                            row.push(fixed(item.pingUdpDelayStd));
                            row.push(fixed(item.pingUdpDelayVar));
                            row.push(fixed(item.pingUdpJitter));
                            row.push(fixed(item.pingUdpJitterStd));
                            row.push(fixed(item.pingUdpJitterVar));
                            row.push(fixedRate(item.pingUdpLossRate) );
                            row.push(fixed(item.tracertIcmpDelay));
                            row.push(fixed(item.tracertIcmpDelayStd));
                            row.push(fixed(item.tracertIcmpDelayVar));
                            row.push(fixed(item.tracertIcmpJitter));
                            row.push(fixed(item.tracertIcmpJitterStd));
                            row.push(fixed(item.tracertIcmpJitterVar));
                            row.push(fixedRate(item.tracertIcmpLossRate) );
                            row.push(fixed(item.tracertTcpDelay));
                            row.push(fixed(item.tracertTcpDelayStd));
                            row.push(fixed(item.tracertTcpDelayVar));
                            row.push(fixed(item.tracertTcpJitter));
                            row.push(fixed(item.tracertTcpJitterStd));
                            row.push(fixed(item.tracertTcpJitterVar));
                            row.push(fixedRate(item.tracertTcpLossRate) );
                            rows.push(row);
                        }
                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#doorpingdata_table").colResizable({
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

//网络质量表格
function door_quality(obj) {
    var id = obj.id;
    var quality_table = new Vue({
        el: '#doorqualitydata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">测试目标</div>'},
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
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
                vm.dtHandle.clear();
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function (row, data, index) {
                    var trs = $("#doorqualitydata_table>thead tr");
                    if (trs.length > 1) {
                        return
                    } else if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        var columnsCount = 25;//具体情况
                        innerTh += '<th colspan="2 " style="text-align: center">DNS</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Sla(TCP)</th>';
                        innerTh += '<th colspan="7" style="text-align: center">Sla(UDP)</th>';

                        innerTh += '<th colspan="2" style="text-align: center">DHCP</th>';
                        innerTh += '<th colspan="3" style="text-align: center">ADSL</th>';
                        innerTh += '<th colspan="2"style="text-align: center">Radius</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('doorqualitydata_table').insertRow(0);
                        var $tr = $("#doorqualitydata_table tr").eq(0);
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
                    returnData.data = doorContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    doorContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.targetName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.dnsDelay));
                            row.push(fixedRate(item.dnsSuccessRate) );
                            row.push(fixed(item.slaTcpDelay));
                            row.push(fixed(item.slaTcpGDelay));
                            row.push(fixed(item.slaTcpRDelay));
                            row.push(fixed(item.slaTcpJitter));
                            row.push(fixed(item.slaTcpGJitter));
                            row.push(fixed(item.slaTcpRJitter));
                            row.push(fixedRate(item.slaTcpLossRate) );
                            row.push(fixed(item.slaUdpDelay));
                            row.push(fixed(item.slaUdpGDelay));
                            row.push(fixed(item.slaUdpRDelay));
                            row.push(fixed(item.slaUdpJitter));
                            row.push(fixed(item.slaUdpGJitter));
                            row.push(fixed(item.slaUdpRJitter));
                            row.push(fixedRate(item.slaUdpLossRate) );

                            row.push(fixed(item.dhcpDelay));
                            row.push(fixedRate(item.dhcpSuccessRate) );
                            row.push(fixed(item.pppoeDelay));
                            row.push(fixedRate(item.pppoeDropRate));
                            row.push(fixedRate(item.pppoeSuccessRate) );
                            row.push(fixed(item.radiusDelay));
                            row.push(fixedRate(item.radiusSuccessRate) );
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#doorqualitydata_table").colResizable({
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

//网页浏览表格
function door_broswer(obj) {
    var id = obj.id;
    var broswer_table = new Vue({
        el: '#doorbroswerdata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">测试目标</div>'},
                {title: '<div style="width:70px">综合分数</div>'},
                {title: '<div style="width:100px">DNS时延(ms)</div>'},
                {title: '<div style="width:100px">连接时延(ms)</div>'},
                {title: '<div style="width:100px">首字节时延(ms)</div>'},
                {title: '<div style="width:120px">页面文件时延(ms)</div>'},
                {title: '<div style="width:100px">重定向时延(ms)</div>'},
                {title: '<div style="width:100px">首屏时延(ms)</div>'},
                {title: '<div style="width:115px">页面加载时延(ms)</div>'},
                {title: '<div style="width:100px">下载速率(KB/s)</div>'},
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
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
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
                    returnData.data = doorContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    doorContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.targetName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.webpageDnsDelay ));
                            row.push(fixed(item.webpageConnDelay ));
                            row.push(fixed(item.webpageHeadbyteDelay ));
                            row.push(fixed(item.webpagePageFileDelay ));
                            row.push(fixed(item.webpageRedirectDelay ));
                            row.push(fixed(item.webpageAboveFoldDelay ));
                            row.push(fixed(item.webpageLoadDelay) );
                            row.push(fixed(item.webpageDownloadRate ));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#doorbroswerdata_table").colResizable({
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

//下载
function door_download(obj) {
    var id = obj.id;
    //网页下载
    var download_table = new Vue({
        el: '#doordownloaddata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">测试目标</div>'},
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
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
                vm.dtHandle.clear();
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
            let vm = this;
            // Instantiate the datatable and store the reference to the instance in our dtHandle element.
            vm.dtHandle = $(this.$el).DataTable({
                columns: vm.headers,
                data: vm.rows,
                createdRow: function (row, data, index) {
                    //生成了行之后，开始生成表头>>>
                    var trs = $("#doordownloaddata_table>thead tr");
                    if (trs.length > 1) {
                        return
                    }
                    if (index == 0) {
                        var innerTh = '<tr><th rowspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';
                        innerTh += '<th colspan="1"></th>';

                        var columnsCount = 17;//具体情况
                        innerTh += '<th colspan="4" style="text-align: center">WEB下载</th>';
                        innerTh += '<th colspan="5" style="text-align: center">FTP下载</th>';
                        innerTh += '<th colspan="5" style="text-align: center">FTP上传</th>';
                        innerTh += '</tr>';
                        //table的id为"id_table"
                        document.getElementById('doordownloaddata_table').insertRow(0);
                        var $tr = $("#doordownloaddata_table tr").eq(0);
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
                    returnData.data = doorContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    doorContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.targetName);
                            row.push(item.score.toFixed);
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

                    $("#doordownloaddata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
                    });
                }
            });
        }

    })
}

// /在线视频
function door_video(obj) {
    var id = obj.id;
    var video_table = new Vue({
        el: '#doorvideodata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">测试目标</div>'},
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
            reset: function () {
                let vm = this;
                vm.probedata = {};
                /*清空probedata*/
                vm.dtHandle.clear();
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
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
                    returnData.data = doorContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    doorContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.targetName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.webVideoDnsDelay ));
                            row.push(fixed(item.webVideoWsConnDelay));
                            row.push(fixed(item.webVideoWebPageDelay ));
                            row.push(fixed(item.webVideoHeadFrameDelay ));
                            row.push(fixed(item.webVideoInitBufferDelay ));
                            row.push(fixed(item.webVideoLoadDelay ));
                            row.push(fixed(item.webVideoTotalBufferDelay ));
                            row.push(fixed(item.webVideoDownloadRate ) );
                            row.push(fixed(item.webVideoBufferTime ));
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#doorvideodata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
                    });
                }
            });
        }

    })
}

//在线游戏
function door_game(obj) {
    var id = obj.id;
    var game_table = new Vue({
        el: '#doorgamedata_table',
        data: {
            headers: [
                {title: '<div style="width:10px"></div>'},
                {title: '<div style="width:110px">测试目标</div>'},
                {title: '<div style="width:70px">综合分数</div>'},
                {title: '<div style="width:100px">DNS时延(ms)</div>'},
                {title: '<div style="width:120px">网络时延(ms)</div>'},
                {title: '<div style="width:120px">网络抖动(ms)</div>'},
                {title: '<div style="width:120px">丢包率(%)</div>'},
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
                //console.log("重置");
                vm.dtHandle.draw();
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
        mounted: function (obj) {
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
                // bAutoWidth:false,
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
                    returnData.data = doorContent;//返回的数据列表
                    // // 重新整理返回数据以匹配表格
                    //console.log(returnData);
                    let rows = [];
                    var i = 1;
                    doorContent.forEach(function (item) {
                        if (id == item.id) {
                            let row = [];
                            row.push(i++);
                            row.push(item.targetName);
                            row.push(fixed(item.score));
                            row.push(fixed(item.gameDnsDelay));
                            row.push(fixed(item.gamePacketDelay) );
                            row.push(fixed(item.gamePacketJitter ));
                            row.push(fixedRate(item.gameLossRate ) );
                            rows.push(row);
                        }

                    });
                    returnData.data = rows;
                    callback(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                    $("#doorgamedata_table").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='grip'></div>",
                        draggingClass: "dragging",
                        resizeMode: 'overflow',
                    });
                }
            });
        }
    })
}

function resizeArea() {
    setTimeout(function () {
        $("#areadata_table").colResizable({
            liveDrag: true,
            gripInnerHtml: "<div class='grip'></div>",
            draggingClass: "dragging",
            resizeMode: 'overflow',
        });
    }, 250);
}

function resizeDoor() {
    setTimeout(function () {
        $("#doordata_table").colResizable({
            liveDrag: true,
            gripInnerHtml: "<div class='grip'></div>",
            draggingClass: "dragging",
            resizeMode: 'overflow',
        });
    }, 250);
}

function loading() {
    $('#Section2').loading({
        loadingWidth: 240,
        title: '正在努力的加载中~',
        name: 'test',
        discription: '这是一个描述...',
        direction: 'row',
        type: 'origin',
        originBg: '#B0E2FF',
        originDivWidth: 30,
        originDivHeight: 30,
        originWidth: 4,
        originHeight: 4,
        smallLoading: false,
        titleColor: '#ADD8E6',
        loadingBg: '#312923',
        loadingMaskBg: 'rgba(22,22,22,0.2)'
    });
}

function fixed(value) {
    if(value==null){
        return ''
    } else{
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

function probe() {
    $.ajax({
        url: "../../cem/probe/showlist",//探针列表
        type: "POST",
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var probes = [];
            for (var i = 0; i <  result.probe.length; i++) {
                probes[i] = {message: result.probe[i]}
            }
            diagnose_data.probe = probes;
            setTimeout(function () {
                $('#diagnoseprobe .jq22').comboSelect();
                $('#diagnoseprobe .option-item').click(function (probe) {
                    setTimeout(function () {
                        var a = $(probe.currentTarget)[0].innerText;
                        probeSelected = $($(probe.currentTarget)[0]).data('value');
                        $('#diagnoseprobe .combo-input').val(a);
                        $('#diagnoseprobe .combo-select select').val(a);
                    }, 30);
                });
                $('#diagnoseprobe input[type=text] ').keyup(function (probe) {
                    if( probe.keyCode=='13'){
                        var b = $("#diagnoseprobe .option-hover.option-selected").text();
                        probeSelected=parseInt(($("#diagnoseprobe .option-hover.option-selected"))[0].dataset.value);
                        $('#diagnoseprobe .combo-input').val(b);
                        $('#diagnoseprobe .combo-select select').val(b);
                    }

                })
            }, 50);
        }
    });
};
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
                diagnose_data.probe = probes;
                setTimeout(function () {
                    $('#diagnoseprobe .jq22').comboSelect();
                    $('#diagnoseprobe .option-item').click(function (probe) {
                        setTimeout(function () {
                            var a = $(probe.currentTarget)[0].innerText;
                            probeSelected = $($(probe.currentTarget)[0]).data('value');
                            $('#diagnoseprobe .combo-input').val(a);
                            $('#diagnoseprobe .combo-select select').val(a);
                        }, 30);
                    });
                    $('#diagnoseprobe input[type=text] ').keyup(function (probe) {
                        if( probe.keyCode=='13'){
                            var b = $("#diagnoseprobe .option-hover.option-selected").text();
                            probeSelected=parseInt(($("#diagnoseprobe .option-hover.option-selected"))[0].dataset.value);
                            $('#diagnoseprobe .combo-input').val(b);
                            $('#diagnoseprobe .combo-select select').val(b);
                        }

                    })
                }, 50);
            }
        });
    }

};
//页面上直接加载
$(document).ready(function () {
    $('#diagnosecity .jq22').comboSelect()
    $('#diagnosecountry .jq22').comboSelect();
    $('#diagnoseprobe .jq22').comboSelect();
    $('#diagnosetarget .jq22').comboSelect()
    citySelected=0
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
            diagnose_data.city = cities;
            setTimeout(function () {
                $('div#diagnosecity .jq22').comboSelect();
                $('div#diagnosecity .option-item').click(function (city) {
                    setTimeout(function () {
                        var a = $(city.currentTarget)[0].innerText;
                        citySelected = $($(city.currentTarget)[0]).data('value');
                        $('div#diagnosecity .combo-input').val(a);
                        $('div#diagnosecity .combo-select select').val(a);
                        clearArea(a);
                        getArea(citySelected);
                        getProbeCity(citySelected);
                    }, 30);
                });
                $('#diagnosecity input[type=text] ').keyup(function (city) {
                    if( city.keyCode=='13'){
                        var b = $("#diagnosecity .option-hover.option-selected").text();
                        clearArea(b);
                        citySelected=($("#diagnosecity .option-hover.option-selected"))[0].dataset.value;
                        getArea(citySelected);
                        getProbeCity(citySelected);
                        $('#diagnosecity .combo-input').val(b);
                        $('#diagnosecity .combo-select select').val(b);
                    }
                })
            }, 50);
        }
    });
    //目标列表
    var form = $('#superservice').serializeArray();
    $.ajax({
        type: "POST", /*GET会乱码*/
        url: "../../target/infoList/" + form[0].value,
        cache: false,  //禁用缓存
        dataType: "json",
        success: function (result) {
            var targets = [];
            for (var i = 0; i < result.target.length; i++) {
                targets[i] = {message: result.target[i]}
            }
            diagnose_target.target = targets;
            setTimeout(function () {
                $('div#diagnosetarget .jq22').comboSelect();
                $('div#diagnosetarget .option-item').click(function (target) {
                    setTimeout(function () {
                        var a = $(target.currentTarget)[0].innerText;
                        targetSelected = $($(target.currentTarget)[0]).data('value');
                        $('div#diagnosetarget .combo-input').val(a);
                        $('div#diagnosetarget .combo-select select').val(a);
                    }, 30);
                });
                $('#target input[type=text] ').keyup(function (probe) {
                    if( probe.keyCode=='13'){
                        var b = $("#diagnosetarget .option-hover.option-selected").text();
                        targetSelected=parseInt(($("#diagnosetarget .option-hover.option-selected"))[0].dataset.value);
                        $('#diagnosetarget .combo-input').val(b);
                        $('#diagnosetarget .combo-select select').val(b);
                    }

                })
            }, 50);
        }
    });
    //探针列表
    probe()

});

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
        diagnose_data.probe = probes;
        setTimeout(function () {
            $('#diagnoseprobe .jq22').comboSelect();
            //这个触发条件是先选择测试目标在选择探针的时候触发
            $('#diagnoseprobe .option-item').click(function (probe) {
                setTimeout(function () {
                    var a = $(probe.currentTarget)[0].innerText;
                    probeSelected = $($(probe.currentTarget)[0]).data('value');
                    $('#diagnoseprobe .combo-input').val(a);
                    $('#diagnoseprobe .combo-select select').val(a);
                }, 30);
            });
            $('#diagnoseprobe input[type=text] ').keyup(function (probe) {
                if( probe.keyCode=='13'){
                    var b = $("#diagnoseprobe .option-hover.option-selected").text();
                    probeSelected=parseInt(($("#diagnoseprobe .option-hover.option-selected"))[0].dataset.value);
                    $('#diagnoseprobe .combo-input').val(b);
                    $('#diagnoseprobe .combo-select select').val(b);
                }
            })
        },50);
    }
});

var diagnose_data = new Vue({
    el: '#diagnosesearch',
    data: {
        county: [],
        city: [],
        probe: [],
        target: []
    },
    methods: {
        citychange: function () {
            this.county = getArea($("#selectcity").val());
        },
        areachange: function () {
            this.probe = getProbeCounty($("#selectarea").val());
        }
    }
});

var diagnose_target = new Vue({
    el: '#diagnosetarget',
    data: {
        target: []
    },
    methods: {


    }
});
$('input[type=radio]').click(function () {

    var id= $(this).val()
    getTarget(id);
})
var getArea = function (cityid) {
    countrySeleted=0
    if (cityid != "" && cityid != null) {
        $.ajax({//区县
            url: "../../cem/county/info/" + cityid,
            type: "POST",
            cache: false,  //禁用缓存
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                search_data.county = [];
                var counties = [];
                for (var i = 0; i < result.county.length; i++) {
                    counties[i] = {message: result.county[i]}
                }
                diagnose_data.county = counties;
                setTimeout(function () {
                    $('#diagnosecountry .jq22').comboSelect();
                    $('#diagnosecountry .option-item').click(function (country) {
                        setTimeout(function () {
                            var a = $(country.currentTarget)[0].innerText;
                            clearArea(a)
                            countrySelected = $($(country.currentTarget)[0]).data('value');
                            $('#diagnosecountry .combo-input').val(a);
                            $('#diagnosecountry .combo-select select').val(a);
                            getdiagnoseProbeCounty(countrySelected);
                        }, 30);
                    });
                    $('#diagnosecountry input[type=text] ').keyup(function (country) {
                        if( country.keyCode=='13'){
                            var b = $("#diagnosecountry .option-hover.option-selected").text();
                            countrySelected=($("#diagnosecountry .option-hover.option-selected"))[0].dataset.value;
                            $('#diagnosecountry .combo-input').val(b);
                            $('#diagnosecountry .combo-select select').val(b);
                            getdiagnoseProbeCounty(countrySelected);
                        }
                    })
                },50);

            }
        });
    }
};

function clearArea(a) {
    if(a=="所有地市"){

        $('#diagnosecountry .combo-input').val("所有区县");
        $('#diagnosecountry .combo-select select').val("所有区县");
        diagnose_data.areas = [];
        $('#diagnosecountry ul').html("");
        // $('#country ul').append(<li class="option-item option-hover option-selected" data-index="0" data-value="">所有区县</li>);
        $("#diagnosecountry ul").append("<li class='option-item option-hover option-selected' data-index=='0' data-value=''>"+"所有区县"+"</li>");

    }
    if(a=="所有区县"){
        probe()
    }
}

//获取城市的时候探针会发生改变
var getdiagnoseProbeCounty = function (countyid) {
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
            diagnose_data.probe = probes;
            setTimeout(function () {
                $('#diagnoseprobe .jq22').comboSelect();
                $('#diagnoseprobe .option-item').click(function (probe) {
                    setTimeout(function () {
                        var a = $(probe.currentTarget)[0].innerText;
                        probeSelected = $($(probe.currentTarget)[0]).data('value');
                        $('#diagnoseprobe .combo-input').val(a);
                        $('#diagnoseprobe .combo-select select').val(a);
                    }, 30);
                });
                $('#diagnoseprobe input[type=text] ').keyup(function (probe) {
                    if( probe.keyCode=='13'){
                        var b = $("#diagnoseprobe .option-hover.option-selected").text();
                        probeSelected=parseInt(($("#diagnoseprobe .option-hover.option-selected"))[0].dataset.value);
                        $('#diagnoseprobe .combo-input').val(b);
                        $('#diagnoseprobe .combo-select select').val(b);
                    }

                })
            }, 50);
        }
    });
};


//目标
var getTarget = function (id) {
    // diagnosetargetSelected = 0;
    $.ajax({
        //目标列表
        url: "../../target/infoList/" +parseInt(id),
        type: "POST",
        cache: false,  //禁用缓存
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            var targets = [];
            for (var i = 0; i < result.target.length; i++) {
                targets[i] = {message: result.target[i]}
            }
            diagnose_target.target = targets;
            setTimeout(function () {
                $('div#diagnosetarget .jq22').comboSelect();
                $('div#diagnosetarget .option-item').click(function (target) {
                    setTimeout(function () {
                        var a = $(target.currentTarget)[0].innerText;
                        diagnosetargetSelected = $($(target.currentTarget)[0]).data('value');
                        $('div#diagnosetarget .combo-input').val(a);
                        $('div#diagnosetarget .combo-select select').val(a);
                    }, 30);
                });
                $('#diagnosetarget input[type=text] ').keyup(function (target) {
                    if( target.keyCode=='13'){
                        var b = $("#diagnosetarget .option-hover.option-selected").text();
                        diagnosetargetSelected=parseInt(($("#diagnosetarget .option-hover.option-selected"))[0].dataset.value);
                        $('#diagnosetarget .combo-input').val(b);
                        $('#diagnosetarget .combo-select select').val(b);
                    }

                })
            }, 50);
        }
    });

};



function diagnose() {
    var param = getFormJson3($('#superservice'));
    var service=param.service
    switch(service){
        case 1:param.ping=1;break;
        case 2:param.sla=2;break;
        case 3 :param.web=3;break;
        case 4 :param.download=4;break;
        case 5:param.video=5;break;
        case 6 :param.game=6;break;
    }
    if (probeSelected == 0) {
        toastr.warning('请选择探针！')
    } else if (diagnosetargetSelected == undefined) {
        toastr.warning('请选择测试目标！')
    } else {
        param.probeId = probeSelected;
        param.target = diagnosetargetSelected;

        $.ajax({
            url: "../../cem/taskdispatch/saveAndReturn",
            type: "POST",
            cache: false,  //禁用缓存
            data: JSON.stringify(param),
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                //console.log(result)
                var dispatch = result.taskdispatch;
                //console.log(JSON.stringify(dispatch));
                var url = "../diagnose/information.html";
                var dispatchString = JSON.stringify(dispatch);
                url = url + "?dispatch=" + dispatchString.substring(1,dispatchString.length-1);
                //console.log(url);
                document.getElementById("diagnose").href = encodeURI(url);
                document.getElementById("diagnose").click();
                $('#myModal_diagnose').modal('hide');
            }
        });
    }
}
/*将表单对象变为json对象*/
function getFormJson3(form) {
    var o = {};
    var a = $(form).serializeArray();
    for (var i = 0; i < a.length; i++) {
        if (a[i].value != null && a[i].value != "") {
            a[i].value = parseInt(a[i].value);
        }
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



function getNow() {
    var date=new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var years=date.getFullYear();
    var newdate=years+'-'+month+'-'+strDate;
    $('#start_date').flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate:newdate,
        time_24hr: true
    });
    var date=new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var years=date.getFullYear();
    var hours=date.getHours();
    var endday=years+'-'+month+'-'+strDate+' '+hours;
    $('#terminal_date').flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate:endday,
        time_24hr: true
    });
    $('#areastart_date').flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate:newdate,
        time_24hr: true
    });
    $('#areaterminal_date').flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate:endday,
        time_24hr: true
    });
    $('#doorstart_date').flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate:newdate,
        time_24hr: true
    });
    $('#doorterminal_date').flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate:endday,
        time_24hr: true
    });

}