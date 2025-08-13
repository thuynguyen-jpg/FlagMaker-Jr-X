var division = "grid";
var maxX, maxY;
var colors = ['rgb(93, 53, 39);', 'rgb(130, 36, 51);', 'rgb(198, 12, 48);', 'rgb(255, 99, 25);', 'rgb(253, 200, 47);','rgb(254, 221, 0);', 'rgb(51, 115, 33);', 'rgb(20, 77, 41);', 'rgb(40, 78, 54);', 'rgb(99, 153, 171);', 'rgb(0, 101, 189);', 'rgb(0, 57, 166);', 'rgb(0, 38, 100);', 'rgb(0, 33, 71);', 'rgb(0, 0, 0);', 'rgb(141, 129, 123);', 'rgb(255, 255, 255);'];

$(document).ready(function() {
	loadOverlays();
	
	// Set up color pickers
	$("#divColors input").each(function() { makePalette($(this)); });
	
	$("#divColors input").change(function() {
		draw();
	});
	
	// Hook up events
	$(".ratio").change(function() {
		setRatio($("#ratioWidth").val(), $("#ratioHeight").val());
	});
	
	$("#gridSize").change(function() {
		var val = $("#gridSize").val().split(':');
		maxY = val[0];
		maxX = val[1];
		setSliderMaxes(maxX, maxY);
		draw();
	});
	
	$(".divbutton").click(function() {
		division = $(this).attr("id");
		draw();
	});
	
	$("#divisions input").bind("change", function() {
		draw();
	});

	$('#flagNameText').friendurl({
		id : '_flagNameText',
		divider: '-',
		transliterate: true
	});
});

function shuffleEverything() {
    const nationalColors = [
        "#ffffff", "#000000", "#ff0000", "#0000ff",
        "#00ff00", "#ffff00", "#ff8000", "#800080"
    ];

    function shuffle(array) {
        let m = array.length;
        while (m) {
            let i = Math.floor(Math.random() * m--);
            [array[m], array[i]] = [array[i], array[m]];
        }
        return array;
    }

    /* === 1. Shuffle Flag Division Colors === */
    // Pick a background/base color first
    let bgColor = nationalColors[Math.floor(Math.random() * nationalColors.length)];
    let pool = nationalColors.filter(c => c !== bgColor);
    shuffle(pool);

    // Force-apply even if disabled
    $("#div1col").spectrum("set", pool[0]);
    $("#div2col").spectrum("set", pool[1 % pool.length]);
    $("#div3col").spectrum("set", pool[2 % pool.length]);

    /* === 2. Shuffle Overlay Colors === */
    $("#overlays input[type=text]").each(function() {
        const newColor = shuffle([...nationalColors])[0];
        $(this).spectrum("set", newColor);
    });

    /* === 3. Redraw === */
    draw();
}

$(document).on('click', '#shuffleColorsBtn', function(e) {
    e.preventDefault();
    shuffleEverything();
});

function makePalette(p) {
	p.spectrum({
		showPalette: true,
		showSelectionPalette: true,
		palette: colors,
		localStorageKey: "flagmakerjr"
	});
}

$(window).load(function() {
	newFlag();
});

$(window).resize(function() {
	setFlagSize();
});

function newFlag() {
	$("#div1col").spectrum("set", colors[1]);
	$("#div2col").spectrum("set", colors[5]);
	$("#div3col").spectrum("set", colors[11]);
	$("#div1val").val(2);
	$("#div2val").val(2);
	$("#div3val").val(2);
	$("#overlays").empty();
	division = "grid";
	maxX = 3;
	maxY = 2;
	setRatio(3, 2);
}

function setRatio(x, y) {
	$("#ratioWidth").val(x);
	$("#ratioHeight").val(y);
	
	$("#gridSize").children().remove();
	for(var i = 1; i <= 20; i++) {
		$("#gridSize").append("<option>" + (i*y) + ":" + (i*x) + "</option>");
	}
	
	$("#gridSize").selectmenu("refresh");
	$("#gridSize").trigger("change");
	
	setSliderMaxes(x, y);
	setFlagSize();
}

function setFlagSize() {
	$("#flag").height($("#flag").width() * $("#ratioHeight").val() / $("#ratioWidth").val());
	$("#canvas").attr("height", $("#flag").height() + "px");
	$("#canvas").attr("width", $("#flag").width() + "px");
	draw();
}

function setSliderMaxes(x, y) {
	$("#divisions input[type=number]").each(function() {
		$(this).prop({
			max: x > y ? x : y
		}).slider("refresh");
	});
	
	$("#overlayArea input[type=number]").each(function() {
		var useX = $(this).attr("use-x");
		var useY = $(this).attr("use-y");
		var max = x;
		
		var newValue = $(this).val() * (max / $(this).attr("max"));
		if (useY !== undefined && useY !== false) {
			max = y;
			newValue = $(this).val() * (max / $(this).attr("max"));
			$(this).attr("max", y);
		} else {
			$(this).attr("max", max);
		}
		
		$(this).val(newValue.toFixed(1));
		$(this).parent().prev().children().html($(this).val());
	});
}

function makeSVG(tag, attrs, child) {
	var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
	for (var k in attrs) {
		el.setAttribute(k, attrs[k]);
	}
	if (child != null) {
		el.appendChild(child);
	}
	return el;
}

function drawThing(thing) {
	document.getElementById("flag").appendChild(thing);
}

function draw() {
	$("#flag").empty();
	
	switch(division) {
		case "grid":
			$("#div3col").spectrum("disable");
			showSliders(2);
			drawGrid();
			break;
		case "fesses":
			$("#div3col").spectrum("enable");
			showSliders(3);
			drawFesses();
			break;
		case "pales":
			$("#div3col").spectrum("enable");
			showSliders(3);
			drawPales();
			break;
		case "bendsf":
			$("#div3col").spectrum("disable");
			showSliders(0);
			drawBendsF();
			break;
		case "bendsb":
			$("#div3col").spectrum("disable");
			showSliders(0);
			drawBendsB();
			break;
		case "x":
			$("#div3col").spectrum("disable");
			showSliders(0);
			drawX();
			break;
		case "crossofburgundy":
    		$("#div3col").spectrum("disable");
			showSliders(0);
    		drawCrossOfBurgundyDivision();
    		break;
	}
	
	$("#overlays").children().filter("div").each(function() {
		drawOverlay($(this));
	});

}

function showSliders(count) {
	if (count == 0) {
		$("#div1val").parent().hide();
		$("#div2val").parent().hide();
		$("#div3val").parent().hide();
		$("#div3col").next().hide();
	} else if (count == 2) {
		$("#div1val").parent().show();
		$("#div2val").parent().show();
		$("#div3val").parent().hide();
		$("#div3col").next().hide();
	} else if (count == 3) {
		$("#div1val").parent().show();
		$("#div2val").parent().show();
		$("#div3val").parent().show();
		$("#div3col").next().show();
	}
}

function exportSvg() {
	var flagName = $("#_flagNameText").val();
	if (flagName == "" || typeof flagName === "undefined")
		flagName = "flag.svg";
	else
		flagName += ".svg";
	var pom = document.createElement("a");
	pom.setAttribute("href", "data:image/svg+xml;charset=utf-8," + $('<svg>').append($('#flag').clone()).html(), flagName);
	pom.setAttribute("download", flagName);
	pom.click();
}

function exportPng() {
	var flagName = $("#_flagNameText").val();
	if (flagName == "" || typeof flagName === "undefined")
		flagName = "flag.png";
	else
		flagName += ".png";
	var flagObject = $('#flag');
	
	canvg(document.getElementById('canvas'), $('<svg>').append($('#flag').clone()).html());
	var canvas = document.getElementById("canvas");
	var a = document.createElement('a');
	a.download = flagName;
	a.href = canvas.toDataURL('image/png');
	document.body.appendChild(a);
	a.click();

	// var canvas = document.createElement('canvas');
	// canvas.width = Math.floor(flagObject.width());
	// canvas.height = Math.floor(flagObject.height());
	// var context = canvas.getContext('2d');
	// context.drawImage(flagObject, 0, 0);
	
}
