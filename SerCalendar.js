function Clear() {
    $("#ddlYear").val("105"); //學年度
    $("#txtStd").val(""); //學生姓名
    $("#txtStd").attr("placeholder", "關鍵字");
    $("#txtStdID").val(""); //學生學號
    $("#txtStdID").attr("placeholder", "關鍵字");
    Search();
}

function Search() {
    var vS_UID = $("#S_UID").val();
    var vP_UID = $("#P_UID").val();

    var Values = new Array();
    var Year = $("#ddlYear").val(); //學年度
    var BI_CName = $("#txtStd").val(); //學生姓名
    var SI_STUID = $("#txtStdID").val(); //學生學號

    var Obj = new Object;
    Obj.Year = Year;
    Obj.BI_CName = BI_CName;
    Obj.SI_STUID = SI_STUID;

    Obj.ProcessType = "";
    Obj.Page = "1";
    var os = new OrderSort("");
    Obj.OrderColumn = os.Column;
    Obj.OrderType = os.ColumnType;
    var objData;
    Values.push(Obj);
    objData = ProcessDataFunction(
        "SerCalendar.aspx?S_UID=" + vS_UID + "&P_UID=" + vP_UID + "&D=EIS.CTL&N=EIS.CTL",
        "text",
        JSON.stringify(Values)
        );

    document.getElementById("formTable").innerHTML = "";
    $("#formTable").append(objData);

    initPage();
}

function Order(id) {
    var os = new OrderSort(id);
    Search();
}

function Edit(id) {
    var vS_UID = $("#S_UID").val();
    var vP_UID = $("#P_UID").val();
    var Type = $("#" + id).attr("type"); //view, edit
    var GUID = $("#" + id).attr("value");

    document.getElementById("Form1").action = "SerCalendar.aspx?S_UID=" + vS_UID + "&P_UID=" + vP_UID + "&D=EIS.API&N=EIS.API&Type=" + Type + "&Guid=" + GUID;
    document.getElementById("Form1").submit();
}

// 班表異動modal [確定] 設定排班時間
function submit() {
    $("#tempStr").val($("#StartDate").val());
    $("#tempEnd").val($("#EndDate").val());

    if ($("#tempStr").val() != "") {

        //計算選取天數
        var st = new Date($("#tempStr").val().replace(/-/g, "\/"));
        var et = new Date($("#tempEnd").val().replace(/-/g, "\/"));
        var count = Math.ceil((et - st) / (24 * 60 * 60 * 1000)); //取大於這個數的最小整數(無條件進位)

        var tempSDate = new Date($("#tempStr").val()); //選取的第一天
        var tempEDate = new Date($("#tempEnd").val()); //選取的最後一天

        for (var i = 0; i < count; i++) {
            var eventData;
            eventData = {
                title: $("#txtTitle").val(),
                start: defaultDate(tempSDate, i), //每日上班時間
                end: defaultDate(tempEDate, -count + 1 + i), //每日下班時間
                allDay: false,
            };

            $('#NEWcalendar').fullCalendar('renderEvent', eventData, true); // stick? = true
        }

        $("#StartDate").val("");
        $("#EndDate").val("");
        $("#tempStr").val("");
        $("#tempEnd").val("");
    }

    $('#NEWcalendar').fullCalendar('refetchEvents'); //重新渲染事件(日曆重整)
}

//時間天數加減
function defaultDate(date, amont) {
    var myDate = new Date(date);
    var mydayOfMonth = myDate.getDate();
    myDate.setDate(mydayOfMonth + amont);
    return myDate;
}

function EditInit() {
    $('input.datepicker').datetimepicker({
        dateFormat: "yy-mm-dd",
        hour: 00,
        minute: 00,
        second: 00
    });

    $('input.timepicker').timepicker({
        pickDate: false
    });

    var initialLangCode = 'zh-tw'; //日曆語言:繁中
    $(function () {
        $('#NEWcalendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            //defaultDate: '2016-06-12',
            lang: initialLangCode,
            buttonIcons: true, // show the prev/next text
            weekNumbers: false,
            selectable: true,
            selectHelper: true,
            select: function (start, end) {
                start = moment(start).format("YYYY-MM-DD"); //日期時間的互轉和格式化 https://read01.com/5x5aGP.html

                //----------- 把選取日期範圍塞到日期下拉選單 -------------

                //--結束時間減一天
                var tempDate = new Date(end);
                var dayOfMonth = tempDate.getDate();
                tempDate.setDate(dayOfMonth - 1);
                end = moment(tempDate).format("YYYY-MM-DD");
                //--

                $("#StartDate").val(start + " 08:00");
                $("#EndDate").val(end + " 16:00");

                $("#EditDate").modal('show');
                //---------------------------------------------------------
                
                $('#NEWcalendar').fullCalendar('unselect');
            },
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            //minTime: '08:00:00',
            //maxTime: '18:00:00',
            slotEventOverlap: false,
            eventClick: function (event) { //刪除點選的上班時段
                var r = confirm("Delete " + event.title);
                if (r === true) {
                    $('#NEWcalendar').fullCalendar('removeEvents', event._id);
                }
            },
            buttonText: {
                prev: '‹', // ‹ 
                next: '›', // › 
                prevYear: '«', // « 
                nextYear: '»', // » 
                today: '今日',
                month: '月',
                week: '週',
                day: '日'
            },

            events: [
                {
                    title: 'All Day Event',
                    start: '2016-06-01'
                },
                {
                    title: 'Long Event',
                    start: '2016-06-07',
                    end: '2016-06-10'
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: '2016-06-09T16:00:00'
                },
                {
                    id: 999,
                    title: 'Repeating Event',
                    start: '2016-06-16T16:00:00'
                },
                {
                    title: 'Conference',
                    start: '2016-06-11',
                    end: '2016-06-13'
                },
                {
                    title: 'Meeting',
                    start: '2016-06-12T10:30:00',
                    end: '2016-06-12T12:30:00'
                },
                {
                    title: 'Lunch',
                    start: '2016-06-12T12:00:00'
                },
                {
                    title: 'Meeting',
                    start: '2016-06-12T14:30:00'
                },
                {
                    title: 'Happy Hour',
                    start: '2016-06-12T17:30:00'
                },
                {
                    title: 'Dinner',
                    start: '2016-06-12T20:00:00'
                },
                {
                    title: 'Birthday Party',
                    start: '2016-06-13T07:00:00'
                },
                {
                    title: 'Click for Google',
                    url: 'http://google.com/',
                    start: '2016-06-28'
                }
            ]

        });
    });
}

//取當月份第一天和最後一天
function thisMonthInfo() {
    var thisPageDate = $('#NEWcalendar').fullCalendar('getView').title;
    var year = thisPageDate.substr(0, 4);
    var month = thisPageDate.substr(6);

    var monthZW = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    var monthNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    for (var i = 0; i < 12; i++) { //中文月份換阿拉伯數字
        if (month == monthZW[i]) {
            month = monthNum[i];
            break;
        }
    }
    //當月第一天
    var allMonthS = year + "-" + month + "-" + 1;
    //當月最後一天
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) { //大月
        var allMonthE = year + "-" + month + "-" + 31;
    }
    else if (month == 2) {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) { //閏年
            var allMonthE = year + "-" + month + "-" + 29;
        }
        else {
            var allMonthE = year + "-" + month + "-" + 28;
        }
    }
    else { //小月
        var allMonthE = year + "-" + month + "-" + 30;
    }

    return { MonthS: allMonthS, MonthE: allMonthE }; //傳回多個值 Json 格式 {MonthS: 當月第一天, MonthE: 當月最後一天}
}

function SeleThisMonth() {
    var allMonthS = thisMonthInfo().MonthS; //當月第一天
    var allMonthE = thisMonthInfo().MonthE; //當月最後一天

    //----------- 把選取日期範圍塞到日期下拉選單 -------------
    $("#StartDate").val(allMonthS + " 08:00");
    $("#EndDate").val(allMonthE + " 16:00");

    $("#EditDate").modal('show');
    //---------------------------------------------------------
}

function SelectAllWeek() {
    $("#StartTime").val("08:00");
    $("#EndTime").val("16:00");
    $("#submitType").val("Week");
    $("#EditTime").modal('show');
}

function Weekendes() {
    $("#StartTime").val("08:00");
    $("#EndTime").val("16:00");
    $("#submitType").val("Weekendes");
    $("#EditTime").modal('show');
}

// 班表異動modal [確定] 設定排班時間 (工作日、周末)
function submitTime() {

    var allMonthS = thisMonthInfo().MonthS; //當月第一天
    var allMonthE = thisMonthInfo().MonthE; //當月最後一天
    alert(allMonthS);
    var dfirst = new Date(allMonthS + " " + $("#StartTime").val());
    var dend = new Date(allMonthE + " " + $("#EndTime").val());

    //計算選取天數
    var st = new Date(allMonthS.replace(/-/g, "\/"));
    var et = new Date(allMonthE.replace(/-/g, "\/"));
    var count = (et - st) / (24 * 60 * 60 * 1000) + 1;

    for (var i = 0; i < count; i++) {
        if ($("#submitType").val() == "Week") { //周間
            //取得日期物件中的星期幾，傳回值是一個0到6的整數值，0是星期日，1是星期一，以此類推
            if (defaultDate(dfirst, i).getDay() != 0 && defaultDate(dfirst, i).getDay() != 6) { //非六日
                var eventData;
                eventData = {
                    title: $("#txtTitle").val(),
                    start: defaultDate(dfirst, i), //每日上班時間
                    end: defaultDate(dend, -count + 1 + i), //每日下班時間
                    allDay: false,
                };

                $('#NEWcalendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }
        }

        if ($("#submitType").val() == "Weekendes") { //周末
            //取得日期物件中的星期幾，傳回值是一個0到6的整數值，0是星期日，1是星期一，以此類推
            if (defaultDate(dfirst, i).getDay() == 0 || defaultDate(dfirst, i).getDay() == 6) { //六日
                var eventData;
                eventData = {
                    title: $("#txtTitle").val(),
                    start: defaultDate(dfirst, i), //每日上班時間
                    end: defaultDate(dend, -count + 1 + i), //每日下班時間
                    allDay: false,
                };

                $('#NEWcalendar').fullCalendar('renderEvent', eventData, true); // stick? = true
            }
        }
    }

    $('#NEWcalendar').fullCalendar('refetchEvents'); //重新渲染事件(日曆重整)
}