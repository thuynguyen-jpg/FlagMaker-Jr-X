function drawGrid(x, y) {
	var x = $("#div1val").val();
	var y = $("#div2val").val();
	var h = $("#flag").height() / y;
	var w = $("#flag").width() / x;

	drawThing(makeSVG("rect", {
		width: $("#flag").width(),
		height: $("#flag").height(),
		x: 0,
		y: 0,
		fill: $("#div1col").val()
	}));
	
	var color = $("#div2col").val();
	for (var i = 0; i < x; i++) {
		for (var j = 0; j < y; j++) {
			if ((i + j) % 2 == 0) continue;
			drawThing(makeSVG("rect", {
				width: w,
				height: h,
				x: i*w,
				y: j*h,
				fill: color
			}));
		}
	}
}

function drawFesses() {
	var a = parseInt($("#div1val").val());
	var b = parseInt($("#div2val").val());
	var c = parseInt($("#div3val").val());
	
	var h = $("#flag").height();
	var h1 = h * (a / (a+b+c));
	var h2 = h * (b / (a+b+c));
	var h3 = h * (c / (a+b+c));
	
	drawThing(makeSVG("rect", {
		width: $("#flag").width(),
		height: h,
		x: 0,
		y: 0,
		fill: $("#div1col").val()
	}));
	
	drawThing(makeSVG("rect", {
		width: $("#flag").width(),
		height: h2 + h3,
		x: 0,
		y: h1,
		fill: $("#div2col").val()
	}));

	drawThing(makeSVG("rect", {
		width: $("#flag").width(),
		height: h3,
		x: 0,
		y: h1 + h2,
		fill: $("#div3col").val()
	}));
}

function drawPales() {
	var a = parseInt($("#div1val").val());
	var b = parseInt($("#div2val").val());
	var c = parseInt($("#div3val").val());
	
	var w = $("#flag").width();
	var w1 = w * (a / (a+b+c));
	var w2 = w * (b / (a+b+c));
	var w3 = w * (c / (a+b+c));
	
	drawThing(makeSVG("rect", {
		width: $("#flag").width(),
		height: $("#flag").height(),
		x: 0,
		y: 0,
		fill: $("#div1col").val()
	}));
	
	drawThing(makeSVG("rect", {
		width: w2 + w3,
		height: $("#flag").height(),
		x: w1,
		y: 0,
		fill: $("#div2col").val()
	}));

	drawThing(makeSVG("rect", {
		width: w3,
		height: $("#flag").height(),
		x: w1 + w2,
		y: 0,
		fill: $("#div3col").val()
	}));
}

function drawBendsF() {
	drawThing(makeSVG("rect", {
		width: $("#flag").width(),
		height: $("#flag").height(),
		x: 0,
		y: 0,
		fill: $("#div1col").val()
	}));
	
	drawThing(makeSVG("polygon", {
		points: $("#flag").width() + "," + $("#flag").height() + " " + $("#flag").width() + ",0 0," + $("#flag").height(),
		fill: $("#div2col").val()
	}));
}

function drawBendsB() {
	drawThing(makeSVG("rect", {
		width: $("#flag").width(),
		height: $("#flag").height(),
		x: 0,
		y: 0,
		fill: $("#div1col").val()
	}));
	
	drawThing(makeSVG("polygon", {
		points: "0," + $("#flag").height() + " " + "0,0 " + $("#flag").width() + "," + $("#flag").height(),
		fill: $("#div2col").val()
	}));
}

function drawX() {
	drawThing(makeSVG("rect", {
		width: $("#flag").width(),
		height: $("#flag").height(),
		x: 0,
		y: 0,
		fill: $("#div1col").val()
	}));
	
	drawThing(makeSVG("polygon", {
		points: "0,0 " + $("#flag").width() + "," + $("#flag").height() + " " + $("#flag").width() + ",0 0," + $("#flag").height(),
		fill: $("#div2col").val()
	}));
}

function drawCrossOfBurgundyDivision() {
    // Background
    drawThing(makeSVG("rect", {
        width: $("#flag").width(),
        height: $("#flag").height(),
        x: 0,
        y: 0,
        fill: $("#div1col").val()
    }));

    // Cross of Burgundy path (from SVG)
    var pathData = "m 0 0 v 47.5137 l 81.3379 54.2266 l -33.6426 5.25391 l 51.0918 34.0586 l 33.6406 -5.2539 l 46.6953 31.1309 l -33.6426 5.2539 l 48.4629 32.3066 l 33.6406 -5.2539 l 46.6231 31.082 l -33.6406 5.25391 l 48.4668 32.3125 l 33.6406 -5.25391 l 56.1406 37.4258 l -56.6973 37.7988 l -32.1797 -5.02539 l -50.3945 33.2226 l 32.6309 5.09571 l -46.4512 30.9688 l -32.5723 -5.08789 l -49.0859 33.0488 l 32.1777 5.0254 l -46.8008 31.2012 l -32.4785 -5.07227 l -49.2676 33.0918 l 32.1777 5.02539 L 0 552.6 V 600 h 71.2715 l 68.8887 -45.9258 l -6.83789 32.2402 l 52.9219 -35.2813 l 6.83984 -32.2402 l 47.6465 -31.7656 l -6.83985 32.2422 l 48.5274 -32.3535 l 6.83984 -32.2402 l 47.1367 -31.4238 l -6.83984 32.2402 l 50.2832 -33.5215 l 6.83984 -32.2422 L 450 347.514 l 63.3223 42.2149 l 6.83984 32.2422 l 50.2832 33.5215 l -6.83984 -32.2402 l 47.1367 31.4238 l 6.83984 32.2402 l 48.5274 32.3535 l -6.83985 -32.2422 l 47.6465 31.7656 l 6.83984 32.2402 l 52.9219 35.2813 l -6.83789 -32.2402 L 828.729 600 H 900 v -47.4004 l -79.873 -53.25 l 32.1777 -5.02539 l -49.2676 -33.0918 l -32.4785 5.07227 l -46.8008 -31.2012 l 32.1777 -5.0254 l -49.0859 -33.0488 l -32.5723 5.08789 l -46.4512 -30.9688 l 32.6309 -5.09571 l -50.3945 -33.2226 l -32.1797 5.02539 l -56.6973 -37.7988 l 56.1406 -37.4258 l 33.6406 5.25391 l 48.4668 -32.3125 l -33.6406 -5.25391 l 46.6231 -31.082 l 33.6406 5.2539 l 48.4629 -32.3066 l -33.6426 -5.2539 l 46.6953 -31.1309 l 33.6406 5.2539 l 51.0918 -34.0586 l -33.6426 -5.25391 L 900 47.5137 V 0 h -71.1016 l -70.1113 46.7402 l 6.54101 -30.8379 l -52.8223 35.2149 l -6.54297 30.8398 l -47.5566 31.7051 l 6.54102 -30.8398 l -48.4375 32.293 l -6.54102 30.8379 l -47.0469 31.3652 l 6.54101 -30.8398 l -50.1894 33.4609 l -6.54102 30.8379 L 450 252.6 l -62.7324 -41.8223 l -6.54102 -30.8379 l -50.1894 -33.4609 l 6.54101 30.8398 l -47.0469 -31.3652 l -6.54102 -30.8379 l -48.4375 -32.293 l 6.54102 30.8398 L 194.037 81.957 L 187.494 51.1172 L 134.672 15.9023 L 141.213 46.7402 L 71.1016 0 Z";

    var path = makeSVG("path", {
        d: pathData,
        fill: $("#div2col").val()
    });

    // Scale to fit flag size
    var scaleX = $("#flag").width() / 900;
    var scaleY = $("#flag").height() / 600;
    $(path).attr("transform", "scale(" + scaleX + "," + scaleY + ")");

    drawThing(path);
}
