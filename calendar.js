/*
 * JavaScript-native calendar 
 * allow multiple date selection
 * Created by : Sriwatanasakdi Noppayut
*/

var calendarTargetField = {};

function setAction(no){
	var id = '_'+no;
  $('.prev'+id).on('click', function(){
	  moveCalendar('.calendar', -1, no)}
  );  
  $('.next'+id).on('click', function(){
	  moveCalendar('.calendar', 1, no)
  });
  
  $('.date'+id).click(function(){
    $(this).toggleClass("date-clicked"+id);
    if ($(this).attr('class').search("date-clicked") == -1){
    	removeFromTarget(no, $(this).text());
    }
    else {
    	addToTarget(no, $(this).text());
    }
    //$(this).css('background-color','gray');     
  });
}

function removeFromTarget(no, date){
	var datestr = formatDate(no, date);
	var prevdates = $(calendarTargetField[no]).val().split(',');
	var index = prevdates.indexOf(datestr);
	if (index != -1){
		prevdates.splice(index, 1);
	}
	$(calendarTargetField[no]).val(prevdates.join(',')).trigger('change');
}

function addToTarget(no, date){
	var datestr = formatDate(no, date);
	var prevdates = $(calendarTargetField[no]).val();
	var prevdatesArr = $(calendarTargetField[no]).val().split(',');
	if (prevdatesArr.indexOf(datestr) == -1){
		var comma = ',';
		if (prevdates.length == 0){
			comma = '';
		}
		$(calendarTargetField[no]).val(prevdates + comma + datestr).trigger('change');
	}
	
}

function formatDate(no, date){
	var monthyear = $('.month_'+no).text().split(' ');  
	var month = mapMonthToMonthNo(monthyear[0])+1;
	var year = parseInt(monthyear[1]);
	if (month < 10){
		month = '0' + month;
	}
	if (date < 10){
		date = '0' + date;
	}
	return year + '/' + month + '/' + date; 
}

function collectClickedDate(no){	
  var dates = [];
  var clicked = $('.date-clicked'+'_'+no).each(function(){  
	  dates.push(formatDate(no, $(this).text()));
  });
  var prevdates = $(calendarTargetField[no]).val().split(',');
  var additional = getDifference(prevdates, dates);
  $(calendarTargetField[no]).val(additional.join(','));
}

function getDifference(dates1, dates2){	
	var additional = [];
	for (var i in dates1){
		if (dates1[i].length > 5){
			additional.push(dates1[i]);
		}
	}
	for (var i in dates2){
		if (dates1.indexOf(dates2[i])==-1){
			additional.push(dates2[i]);
		}
	}
	return additional;
}

function createCalendar(element, targetfield, no){
	calendarTargetField[no] = targetfield;
	var today = new Date();
  //alert(today.getMonth());
	var id = '_'+no;
  var calendar = getCalendarByDateYear(today.getMonth(), today.getFullYear(), no);
  $(element+id).append(calendar);  
  setAction(no);
}

function moveCalendar(element, distance, no){
	var id = '_'+no;
	no = parseInt(no);
	distance = parseInt(distance);
	var monthyear = $('.month'+id).text().split(' ');  
  var month = mapMonthToMonthNo(monthyear[0]);
  var year = parseInt(monthyear[1]);
  //alert(month + ' ' + year);
  $(element+id).empty();
  _moveCalendar(element, no, month, year, distance);
  setAction(no);
}

function _moveCalendar(element, no, month, year, distance){
	month = month + 1;
	var newmonth = new Date(year + '-' + month + '-15');
	var id = '_'+no;
  var nm = newmonth.getMonth() + distance;  
  newmonth.setMonth(nm);
  var month2 = newmonth.getMonth();
  var year2 = newmonth.getFullYear();    
  var calendar = getCalendarByDateYear(month2, year2, no);
  $(element+id).append(calendar);
}

function getCalendarByDateYear(month, year, no){
	var tablestart = '<table class="mew-calendar_'+no+'"><tbody>';
  var tableend = "</tbody></table>";
	var rowstart = "<tr>";
  var rowstop = "</tr>";
  var id = "_"+no;
  var prevMonth = '<th class="prev_'+no+'"><button type="button" class="date-collector_'+no+'"><</button></th>';
  var nextMonth = '<th class="next_'+no+'"><button type="button" class="date-collector_'+no+'">></button></th>';
  var head = rowstart + prevMonth + '<th colspan="5" class = "month_'+no+'">' + mapMonthNoToMonth(month)+ ' ' + year +'</th>' + nextMonth + rowstop;
  var daylist = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  var days = '';
  for (var i in daylist){
  	days += '<td>' + daylist[i] + '</td>';
  }
  days = rowstart + days + rowstop;
  //var collectButton = '<button type="button" class="date-collector_'+no+'" onclick="collectClickedDate('+no+')">Add date</button>';
  var datetag = fillDatesInTable(month + 1, year, no);
  return tablestart + head + days + datetag + tableend;
}

function weekdayMapper(no){
	return ['Su','Mo','Tu','We','Th','Fr','Sa'][no];
}

function leapYear(year)
{
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function getNoOfDayInMonth(month, year){
	if (month==1){
  	return leapYear(year) ? 29:28;
  }
  else {
  	return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
  }
}

function mapMonthNoToMonth(monthno){
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return months[monthno];
}

function mapMonthToMonthNo(month){
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return months.indexOf(month);
}

function fill(array, times){
	for(var i = 0 ; i < times; i++){
  	array.push('');
  }
	return array;
}

function fillDatesInTable(month, year, no){
	var dates = [];  
  var firstDayOfMonth = new Date(year + '-' + month + '-01');
  var noOfDays = getNoOfDayInMonth(month-1, year);
  var lastDayOfMonth = new Date(year + '-' + month + '-'+noOfDays);
  /*
  var distance = (today.getDate() % 7) - 1;
  var firstDayOfMonth = today.getDay() - distance;
  */
  var frontFill = firstDayOfMonth.getDay();  
  dates = fill([], frontFill);
  var backFill = 6 - lastDayOfMonth.getDay();
  for (var i = 1 ; i <= noOfDays; i++){
  	dates.push(i);
  }
  dates = fill(dates, backFill);
  var tags = '';
  var datetag = '<td class ="date_'+no+'">'
  var normaltag = '<td>';
  var endtag = '</td>';
  var headtag;
  for (var j in dates){
  	if (parseInt(j) % 7 == 0){
    	tags += '<tr>';
    }
  	headtag = (dates[j]=='') ? normaltag:datetag;
    tags += headtag + dates[j] + endtag;
    if (parseInt(j) % 7 == 6){
    	tags += '</tr>';
    }
  }
  return tags;
}