// scripts/randomizer.js
function randomFlag() {
    newFlag();

    // 🎯 Step 1: Pick a color palette
    const palette = palettes[Math.floor(Math.random() * palettes.length)];

    // 🎯 Step 2: Weighted division pick
    const divisionWeights = {
        grid: 2,
        fesses: 3,
        pales: 3,
        bendsf: 2,
        bendsb: 2,
        x: 1,
        crossofburgundy: 0.5
    };
    const randomDivision = weightedPick(divisionWeights);
    $("#" + randomDivision).click();

    // 🎯 Step 3: Division colors + sliders
    $("#div1col").spectrum("set", randomPaletteColor(palette));
    $("#div2col").spectrum("set", randomPaletteColor(palette));
    $("#div3col").spectrum("set", randomPaletteColor(palette));

    $("#div1val").val(getRandomInt(1, 20)).trigger("change");
    $("#div2val").val(getRandomInt(1, 20)).trigger("change");
    $("#div3val").val(getRandomInt(1, 20)).trigger("change");

    // 🎯 Step 4: Weighted overlays
    const overlayWeights = {};
    overlays.forEach(o => overlayWeights[o.name] = 1.5); // default weight
    // Make some overlays more common
    ["circle", "square", "cross", "star"].forEach(name => {
        if (overlayWeights[name] !== undefined) overlayWeights[name] = 3;
    });

    const overlayCount = getRandomInt(0, 1);
    for (let i = 0; i < overlayCount; i++) {
        addOverlay();
        const overlayDiv = $("#overlays").children().last();

        // Random overlay type
        const type = weightedPick(overlayWeights);
        overlayDiv.find("[id^=type]").last().val(type).trigger("change");

        // Colors from palette
        overlayDiv.find("input[type=text]").each(function () {
            $(this).spectrum("set", randomPaletteColor(palette));
        });

        // Random sliders with weighted center for "left" and "top"
        overlayDiv.find("input[type=range]").each(function () {
            const min = parseInt($(this).attr("min"));
            const max = parseInt($(this).attr("max"));
            if ($(this).attr("name").includes("left") || $(this).attr("name").includes("top")) {
                $(this).val(weightedCenter(min, max)).trigger("change");
            } else {
                $(this).val(getRandomInt(min, max)).trigger("change");
            }
        });
    }

    // 🎯 Step 5: Random ratio
    $("#ratioHeight").val(getRandomInt(1, 3));
    $("#ratioWidth").val(getRandomInt(1, 3));

    const h = parseInt($("#ratioHeight").val(getRandomInt(1, 3))) || 1;
    const w = parseInt($("#ratioWidth").val(getRandomInt(1, 3))) || 1;

    // Set SVG aspect ratio
    $("#flag")
        .attr("viewBox", `0 0 ${w * 100} ${h * 100}`)
        .attr("width", w * 50)   // or any scale factor you like
        .attr("height", h * 50);

    drawFlag();
}

// 🎨 Color palettes
const palettes = [
    ["#002868", "#BF0A30", "#FFFFFF"], // USA style
    ["#FFCE00", "#DD0000", "#000000"], // Germany style
    ["#006400", "#FFD700", "#FFFFFF"], // African style
    ["#0033A0", "#ED2939", "#FFFFFF"], // France style
    ["#F4C430", "#FF671F", "#046A38"]  // India style
];

function randomPaletteColor(palette) {
    return palette[Math.floor(Math.random() * palette.length)];
}

// Weighted random picker
function weightedPick(weights) {
    let sum = 0;
    for (const key in weights) sum += weights[key];
    let rnd = Math.random() * sum;
    for (const key in weights) {
        if (rnd < weights[key]) return key;
        rnd -= weights[key];
    }
    return Object.keys(weights)[0]; // fallback
}

// Weighted toward center position
function weightedCenter(min, max) {
    const mid = (min + max) / 2;
    const spread = (max - min) / 4; // narrower range
    return Math.floor(mid + (Math.random() - 0.5) * spread * 2);
}

// Utilities
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
