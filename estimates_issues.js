var txtToHours = function(content) {
	
	var sumInHours = 0;
	if (content && content.length > 1) {
		//console.log("card content: " + content);
		content.split(", ").forEach(function(item, index) {
			var timeUnit = item.split(" ")[1].charAt(0);
			var timeValue = parseFloat(item);
			//console.log("found card value: " + timeValue + " with unit " + timeUnit);

			switch(timeUnit) {
				case "w": sumInHours += timeValue * 8 * 5;
				break;
				case "d": sumInHours += timeValue * 8;
				break;
				case "h": sumInHours += timeValue;
				break;
				case "m": sumInHours += timeValue/60;
				break;
				default: console.log("Oops. Don't know how to handle time unit '" + timeUnit + "'. Please report me!");
			}
		});
		return sumInHours;
	} else {
		return 0;
	}
};

var handleColumn = function(column, columnIdx, sumPerColumn, noPerColumn) {
	console.log("new column, id=" + $(column).data("column-id"));

	var cards = $(column).find(".ghx-issue");
	var hasSumChangedForColumn = false;
	sumPerColumn[columnIdx] = 0;
	noPerColumn[columnIdx] = 0;
	
	cards.each(function() {
		var cardValue = handleCard(this);
		if(typeof cardValue != "undefined" && !isNaN(cardValue)) {
			sumPerColumn[columnIdx]+= parseFloat(cardValue)/8;
		}
		noPerColumn[columnIdx] += 1;
	});
	console.log("SUM FOR COLUMN #" + columnIdx + " is: " + sumPerColumn[columnIdx] + " days");
	
};


 setInterval(function() {
	
	var columns = [
		{title: "aggregatetimeoriginalestimate",
			tds: "table#issuetable td.aggregatetimeoriginalestimate",
			ths: ".headerrow-aggregatetimeoriginalestimate"},
		{title: "aggregatetimeestimate",
			tds: "table#issuetable td.aggregatetimeestimate",
			ths: ".headerrow-aggregatetimeestimate"}
	];
	
	columns.forEach(function(column){
	
		var divQty = $(".sumcount-"+column.title);
		//don't calculate if calculated
		if(divQty.length > 0) return;
	
		var sumHours = 0;
		$(column.tds).each(function(i,td){
			sumHours += txtToHours(td.innerHTML);
		});
		console.log("Got " + column.title + " hours " + sumHours);
		column.sumHours = sumHours;		
	
		var title = $(column.ths)[0].innerText; 
		$(".issue-table-info-bar .aui-item:first-child").append("<span>&nbsp;</span><span class='sumcount-" + column.title + " label label-default'>" + title + ": " + (Math.round(column.sumHours*10)/10) + "d</span>");
	
	});

}, 3000);