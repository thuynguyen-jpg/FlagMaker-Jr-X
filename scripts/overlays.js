var overlays = [];
var overlayId = 0;
var overlayProperties = [];

function loadOverlays() {
	loadOverlaysBasic();
	loadOverlaysPath();
	loadOverlaysObject();
}

function overlayNames(overlayName) {
	var list = "";
	if(typeof overlayName !== "undefined"){
		var overlayIndex = overlayProperties[overlayName][0];
		for (var i = 0; i < overlays.length; i++) {
			var overlaySelected = "";
			if(i == overlayIndex)
				overlaySelected = " selected";
			list += "<option" + overlaySelected + ">" + overlays[i].name + "</option>";
		}
	} else {
		for (var i = 0; i < overlays.length; i++) {
			list += "<option>" + overlays[i].name + "</option>";
		}
	}
	
	return list;
}

function addOverlay(overlayName) {
	event.preventDefault();
	overlayProperties["overlay" + overlayId] = [];
	overlayProperties["overlay" + overlayId].visible = true;
	if(typeof overlayName !== "undefined"){
		var overlay = overlays[overlayProperties[overlayName][0]];
		overlayProperties["overlay" + overlayId][0] = overlayProperties[overlayName][0];
	} else {
		var overlay = overlays[0];
		overlayProperties["overlay" + overlayId][0] = 0;
	}
	
	var string = "<div id=\"overlay" + overlayId + "\" data-role=\"collapsible\" data-collapsed-icon=\"carat-d\" data-expanded-icon=\"carat-u\" data-collapsed=\"false\">" +
				"<h4>" + overlay.name + "</h4>" +
				"<div class=\"buttons\" data-role=\"controlgroup\" data-type=\"horizontal\" data-mini=\"true\">" +
				"<a href=\"#\" class=\"ui-btn ui-corner-all\" title=\"Toggle visibility\" onclick=\"toggleVisibility(this);\"><img src=\"img\\check_on.png\" /></a>" +
				"<a href=\"#\" class=\"ui-btn ui-corner-all\" title=\"Remove\" onclick=\"deleteOverlay(this);\"><img src=\"img\\remove.png\" /></a>" +
				"<a href=\"#\" class=\"ui-btn ui-corner-all\" title=\"Move up\" onclick=\"moveUp(this);\"><img src=\"img\\moveup.png\" /></a>" +
				"<a href=\"#\" class=\"ui-btn ui-corner-all\" title=\"Move down\" onclick=\"moveDown(this);\"><img src=\"img\\movedown.png\" /></a>" +
				"<a href=\"#\" class=\"ui-btn ui-corner-all\" title=\"Clone\" onclick=\"cloneOverlay(this);\"><img src=\"img\\clone.png\" /></a>" +
				"</div>" +
				"<input type=\"text\" id=\"ovcol-" + overlayId + "\" data-role=\"none\" />" +
				"<select id=\"type-" + overlayId + "\" data-mini=\"true\">" + overlayNames(overlayName) + "</select><div id=\"sliders\">";

	if(typeof overlayName !== "undefined"){
		var overlayColor = overlayProperties[overlayName][1];
		overlayProperties["overlay" + overlayId][1] = overlayProperties[overlayName][1];
	} else {
		var overlayColor = colors[10];
		overlayProperties["overlay" + overlayId][1] = overlayColor;
	}
	
	string += getSliderString(overlay, overlayId, overlayName);
	string += "</div></div>";
	
	if(typeof overlayName !== "undefined"){
		$("#" + overlayName).after(string);
	} else {
		$("#overlays").append(string);
	}
	
	// Apply jQuery mobile styles to dynamic controls
	makePalette($("#ovcol-" + overlayId));
	$("#ovcol-" + overlayId).spectrum("set", overlayColor);
	$("#overlay" + overlayId).collapsible();
	$("#overlay" + overlayId).trigger("create");

	console.log(overlayProperties);
	
	//update if overlay color changes
	$("#ovcol-" + overlayId).change(function(e) {
		var overlayName = e.target.parentElement.parentElement.id;
		overlayProperties[overlayName][1] = e.target.value;
		draw();
		console.log(overlayProperties);
	});
	
	//update if slider value changes
	$("#overlay" + overlayId + " input[type=number]").bind("change", function(e) {
		var overlayName = e.target.parentElement.parentElement.parentElement.parentElement.id;
		for(var i = 0; i < $("#" + overlayName + " #sliders .ui-slider").length; i++){
			overlayProperties[overlayName][i+2] = $("#" + overlayName + " #sliders .ui-slider").eq(i).find("input").val();
		}
		draw();
		console.log(overlayProperties);
	});
	
	//update if overlay changes
	$("#type-" + overlayId).change(function() {
		var id = $(this).attr("id").substr($(this).attr("id").indexOf("-") + 1);
		var sliderDiv = $(this).parent().parent().next();
		sliderDiv.empty();
		var selectedIndex = document.getElementById($(this).attr("id")).selectedIndex;
		overlayProperties["overlay" + id][0] = selectedIndex;
		var newOverlayId = selectedIndex;
		var newOverlay = overlays[newOverlayId];
		sliderDiv.html(getSliderString(newOverlay, id), id);
		sliderDiv.trigger("create");
		sliderDiv.find("input[type=number]").bind("change", function(e) {
			var overlayName = e.target.parentElement.parentElement.parentElement.parentElement.id;
			for(var i = 0; i < $("#" + overlayName + " #sliders .ui-slider").length; i++){
				overlayProperties[overlayName][i+2] = $("#" + overlayName + " #sliders .ui-slider").eq(i).find("input").val();
			}
			draw();
			console.log(overlayProperties);
		});
		setSliderMaxes(maxX, maxY);
		$("#overlay" + id).children("h4").children("a")[0].innerHTML = newOverlay.name;
		draw();
		console.log(overlayProperties);
	});
	
	setSliderMaxes(maxX, maxY);
	draw();
	overlayId++;
}

function getSliderString(overlay, id, overlayName) {
	var string = "";
	for (var i = 0; i < overlay.sliders.length; i++) {
		var label = overlay.sliders[i][0];
		var name = "slider-" + id + "-" + i;
		var useX = overlay.sliders[i][1];
		
		if(typeof overlayName !== "undefined"){
			overlayProperties["overlay" + id][i + 2] = overlayProperties[overlayName][i + 2];
			string += "<label for=\"slider-" + name + "-" + i + "\">" + label + "</label>" +
			          "<input type=\"range\" name=\"" + name + "\" id=\"" + name + "\" data-highlight=\"true\" min=\"0\" max=\"" + (useX ? maxX : maxY) + "\" value=\"" + overlayProperties[overlayName][i + 2] + "\" step=\".1\" ";
		} else {
			overlayProperties["overlay" + id][i + 2] = overlay.sliders[i][2];
			string += "<label for=\"slider-" + name + "-" + i + "\">" + label + "</label>" +
			          "<input type=\"range\" name=\"" + name + "\" id=\"" + name + "\" data-highlight=\"true\" min=\"0\" max=\"" + (useX ? maxX : maxY) + "\" value=\"" + overlay.sliders[i][2] + "\" step=\".1\" ";
		}
		if (useX) {
			string += "use-x ";
		} else {
			string += "use-y ";
		}
		string += ">";
	}
	
	return string;
}

function toggleVisibility(button) {
    event.preventDefault();
    var overlayDiv = $(button).closest("div[id^='overlay']");
    var overlayName = overlayDiv.attr("id");

    // Ensure object exists
    overlayProperties[overlayName] = overlayProperties[overlayName] || [];

    // Flip stored visibility
    overlayProperties[overlayName].visible = !overlayProperties[overlayName].visible;

    // Update the button icon (the clicked <a> contains the img)
    var img = $(button).find("img").get(0);
    if (img) img.src = overlayProperties[overlayName].visible ? "img/check_on.png" : "img/check_off.png";

    // Add CSS class to dim it in the list (needs CSS below)
    overlayDiv.toggleClass("hidden-overlay", !overlayProperties[overlayName].visible);

    // Redraw canvas
    draw();
}

function deleteOverlay(button) {
	event.preventDefault();
	$(button).parent().parent().parent().parent().remove();
	draw();
}

function cloneOverlay(button) {
	event.preventDefault();
	var overlay = $(button).parent().parent().parent().parent();
	addOverlay(overlay.attr("id"));
}

function moveUp(button) {
	event.preventDefault();
	var before = $(button).parent().parent().parent().parent().prev();
	if (before.length > 0) {
		before.before($(button).parent().parent().parent().parent());
		draw();
	}
}

function moveDown(button) {
	event.preventDefault();
	var after = $(button).parent().parent().parent().parent().next();
	if (after.length > 0) {
		after.after($(button).parent().parent().parent().parent());
		draw();
	}
}

function drawOverlay(div) {
    var overlayName = div.attr("id");
    if (overlayProperties[overlayName] && overlayProperties[overlayName].visible === false) {
        return; // skip drawing if hidden
    }

    var overlay;
    var typeString = div.find("[id^=type]").last().val();
	for (var i = 0; i < overlays.length; i++) {
		if (typeString == overlays[i].name) {
			overlay = overlays[i];
			break;
		}
	}
	
	// Put slider values into an array
	var values = [];
	div.find("input[type=number]").each(function() {
		values.push($(this).val());
	});
	
	overlay.draw(div.find("[id^=ovcol]").val(), values);
}

