window.onload = function() {
    var map = document.getElementById("map");
    var context = map.getContext("2d");

    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;

    var initialized = false;

    var level = {
        x: 4,
        y: 83,
        width: 0,
        height: 0,
        columns: 15,
        rows: 14,
        bubblewidth: 40,
        bubbleheight: 40,
        rowheight: 34,
        radius: 20,
        bubbles: []
    };

    var bubble = function(x, y, color, shift) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.removed = false;
        this.shift = shift;
        this.velocity = 0;
        this.alpha = 1;
        this.processed = false;
    };

    var player = {
        x: 0,
        y: 0,
        angle: 0,
        bubblecolor: 0,
        bubble: {
                    x: 0,
                    y: 0,
                    angle: 0,
                    speed: 1000,
                    dropspeed: 900,
                    bubblecolor: 0,
                    visible: false
                },
        nextbubble: {
                        x: 0,
                        y: 0,
                        bubblecolor: 0
                    }
    };

    var neighborsoffsets = [[[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]],
                            [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]];

    var bubblecolors = 7;
    var gamestates = { init: 0, ready: 1, shootbubble: 2, removecluster: 3, gameover: 4 };
    var gamestate = gamestates.init;
    var score = 0;
    var turncounter = 0;
    var rowoffset = 0;
    var animationstate = 0;
    var animationtime = 0;
    var showcluster = false;
    var cluster = [];
    var floatingclusters = [];
    var images = [];
    var bubbleimage;
    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;

    function loadImages(imagefiles) {
        loadcount = 0;
        loadtotal = imagefiles.length;
        preloaded = false;

        var loadedimages = [];
        for (var i=0; i<imagefiles.length; i++) {
            var image = new Image();
            image.onload = function () {
                loadcount++;
                if (loadcount == loadtotal) {
                    preloaded = true;
                }
            };
            image.src = imagefiles[i];
            loadedimages[i] = image;
        }
        return loadedimages;
    }

    function init() {
        images = loadImages(["public/image/bts-bubble.png"]);
        bubbleimage = images[0];
        map.addEventListener("mousemove", onMouseMove);
        map.addEventListener("mousedown", onMouseDown);
        for (var i=0; i<level.columns; i++) {
            level.bubbles[i] = [];
            for (var j=0; j<level.rows; j++) {
                level.bubbles[i][j] = new bubble(i, j, 0, 0);
            }
        }
        level.width = level.columns * level.bubblewidth + level.bubblewidth/2;
        level.height = (level.rows-1) * level.rowheight + level.bubbleheight;
        player.x = level.x + level.width/2 - level.bubblewidth/2;
        player.y = level.y + level.height;
        player.angle = 90;
        player.bubblecolor = 0;
        player.nextbubble.x = player.x - 2 * level.bubblewidth;
        player.nextbubble.y = player.y;
        newGame();
        main(0);
    }

    function main(tframe) {
        window.requestAnimationFrame(main);
        if (!initialized) {
            context.clearRect(0, 0, map.width, map.height);
            drawFrame();
            var loadpercentage = loadcount/loadtotal;
            context.strokeStyle = "#C2DED1";
            context.lineWidth=3;
            context.strokeRect(18.5, 0.5 + map.height - 51, map.width-37, 32);
            context.fillStyle = "#C2DED1";
            context.fillRect(18.5, 0.5 + map.height - 51, loadpercentage*(map.width-37), 32);
            var loadtext = "Loaded " + loadcount + "/" + loadtotal + " images";
            context.fillStyle = "#000000";
            context.font = "16px Verdana";
            context.fillText(loadtext, 18, 0.5 + map.height - 63);
            if (preloaded) {
                setTimeout(function(){initialized = true;}, 1000);
            }
        }
        else {
            update(tframe);
            render();
        }
    }

    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;
        updateFps(dt);
        if (gamestate == gamestates.shootbubble) {
            stateShootBubble(dt);
        }
        else if (gamestate == gamestates.removecluster) {
            stateRemoveCluster(dt);
        }
    }

    function setGameState(newgamestate) {
        gamestate = newgamestate;
        animationstate = 0;
        animationtime = 0;
    }

    function stateShootBubble(dt) {
        player.bubble.x += dt * player.bubble.speed * Math.cos(degToRad(player.bubble.angle));
        player.bubble.y += dt * player.bubble.speed * -1*Math.sin(degToRad(player.bubble.angle));
        if (player.bubble.x <= level.x) {
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x;
        }
        else if (player.bubble.x + level.bubblewidth >= level.x + level.width) {
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x + level.width - level.bubblewidth;
        }
        if (player.bubble.y <= level.y) {
            player.bubble.y = level.y;
            snapBubble();
            return;
        }
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                var bubble = level.bubbles[i][j];
                if (bubble.color < 0) {
                    continue;
                }
                var coord = getbubbleCoordinate(i, j);
                if (circleIntersection(player.bubble.x + level.bubblewidth/2,
                                       player.bubble.y + level.bubbleheight/2,
                                       level.radius,
                                       coord.bubblex + level.bubblewidth/2,
                                       coord.bubbley + level.bubbleheight/2,
                                       level.radius)) {
                    snapBubble();
                    return;
                }
            }
        }
    }

    function stateRemoveCluster(dt) {
        if (animationstate == 0) {
            resetRemoved();
            for (var i=0; i<cluster.length; i++) {
                cluster[i].removed = true;
            }
            // one bubble one score
            score += cluster.length;
            floatingclusters = findFloatingClusters();
            if (floatingclusters.length > 0) {
                for (var i=0; i<floatingclusters.length; i++) {
                    for (var j=0; j<floatingclusters[i].length; j++) {
                        var bubble = floatingclusters[i][j];
                        bubble.shift = 0;
                        bubble.shift = 1;
                        bubble.velocity = player.bubble.dropspeed;
                        score += 100;
                    }
                }
            }
            animationstate = 1;
        }

        if (animationstate == 1) {
            var bubblesleft = false;
            for (var i=0; i<cluster.length; i++) {
                var bubble = cluster[i];
                if (bubble.color >= 0) {
                    bubblesleft = true;
                    bubble.alpha -= dt * 15;
                    if (bubble.alpha < 0) {
                        bubble.alpha = 0;
                    }
                    if (bubble.alpha == 0) {
                        bubble.color = -1;
                        bubble.alpha = 1;
                    }
                }
            }

            for (var i=0; i<floatingclusters.length; i++) {
                for (var j=0; j<floatingclusters[i].length; j++) {
                    var bubble = floatingclusters[i][j];
                    if (bubble.color >= 0) {
                        bubblesleft = true;
                        bubble.velocity += dt * 700;
                        bubble.shift += dt * bubble.velocity;
                        bubble.alpha -= dt * 8;
                        if (bubble.alpha < 0) {
                            bubble.alpha = 0;
                        }
                        if (bubble.alpha == 0 || (bubble.y * level.rowheight + bubble.shift > (level.rows - 1) * level.rowheight + level.bubbleheight)) {
                            bubble.color = -1;
                            bubble.shift = 0;
                            bubble.alpha = 1;
                        }
                    }

                }
            }
            if (!bubblesleft) {
                nextBubble();
                var bubblefound = false
                for (var i=0; i<level.columns; i++) {
                    for (var j=0; j<level.rows; j++) {
                        if (level.bubbles[i][j].color != -1) {
                            bubblefound = true;
                            break;
                        }
                    }
                }
                if (bubblefound) {
                    setGameState(gamestates.ready);
                }
                else {
                    setGameState(gamestates.gameover);
                }
            }
        }
    }

    function snapBubble() {
        var centerx = player.bubble.x + level.bubblewidth/2;
        var centery = player.bubble.y + level.bubbleheight/2;
        var gridpos = getGridPosition(centerx, centery);
        if (gridpos.x < 0) {
            gridpos.x = 0;
        }
        if (gridpos.x >= level.columns) {
            gridpos.x = level.columns - 1;
        }
        if (gridpos.y < 0) {
            gridpos.y = 0;
        }
        if (gridpos.y >= level.rows) {
            gridpos.y = level.rows - 1;
        }
        var addbubble = false;
        if (level.bubbles[gridpos.x][gridpos.y].color != -1) {
            for (var newrow=gridpos.y+1; newrow<level.rows; newrow++) {
                if (level.bubbles[gridpos.x][newrow].color == -1) {
                    gridpos.y = newrow;
                    addbubble = true;
                    break;
                }
            }
        }
        else {
            addbubble = true;
        }

        if (addbubble) {
            player.bubble.visible = false;
            level.bubbles[gridpos.x][gridpos.y].color = player.bubble.bubblecolor;
            if (checkGameOver()) {
                return;
            }
            cluster = findCluster(gridpos.x, gridpos.y, true, true, false);
            if (cluster.length >= 3) {
                setGameState(gamestates.removecluster);
                return;
            }
        }
        turncounter++;
        if (turncounter >= 5) {
            addBubbles();
            turncounter = 0;
            rowoffset = (rowoffset + 1) % 2;
            if (checkGameOver()) {
                return;
            }
        }
        nextBubble();
        setGameState(gamestates.ready);
    }

    function checkGameOver() {
        for (var i=0; i<level.columns; i++) {
            if (level.bubbles[i][level.rows-1].color != -1) {
                nextBubble();
                setGameState(gamestates.gameover);
                return true;
            }
        }

        return false;
    }

    function addBubbles() {
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows-1; j++) {
                level.bubbles[i][level.rows-1-j].color = level.bubbles[i][level.rows-1-j-1].color;
            }
        }

        for (var i=0; i<level.columns; i++) {
            level.bubbles[i][0].color = getExistingColor();
        }
    }

    function findColors() {
        var foundcolors = [];
        var colortable = [];
        for (var i=0; i<bubblecolors; i++) {
            colortable.push(false);
        }
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                var bubble = level.bubbles[i][j];
                if (bubble.color >= 0) {
                    if (!colortable[bubble.color]) {
                        colortable[bubble.color] = true;
                        foundcolors.push(bubble.color);
                    }
                }
            }
        }
        return foundcolors;
    }

    function findCluster(tx, ty, matchcolor, reset, skipremoved) {
        if (reset) {
            resetProcessed();
        }
        var targetbubble = level.bubbles[tx][ty];
        var toprocess = [targetbubble];
        targetbubble.processed = true;
        var foundcluster = [];
        while (toprocess.length > 0) {
            var currentbubble = toprocess.pop();
            if (currentbubble.color == -1) {
                continue;
            }
            if (skipremoved && currentbubble.removed) {
                continue;
            }
            if (!matchcolor || (currentbubble.color == targetbubble.color)) {
                foundcluster.push(currentbubble);
                var neighbors = getNeighbors(currentbubble);
                for (var i=0; i<neighbors.length; i++) {
                    if (!neighbors[i].processed) {
                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
            }
        }
        return foundcluster;
    }

    function findFloatingClusters() {
        resetProcessed();
        var foundclusters = [];
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                var bubble = level.bubbles[i][j];
                if (!bubble.processed) {
                    var foundcluster = findCluster(i, j, false, false, true);
                    if (foundcluster.length <= 0) {
                        continue;
                    }
                    var floating = true;
                    for (var k=0; k<foundcluster.length; k++) {
                        if (foundcluster[k].y == 0) {
                            floating = false;
                            break;
                        }
                    }
                    if (floating) {
                        foundclusters.push(foundcluster);
                    }
                }
            }
        }
        return foundclusters;
    }

    function resetProcessed() {
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                level.bubbles[i][j].processed = false;
            }
        }
    }

    function resetRemoved() {
        for (var i=0; i<level.columns; i++) {
            for (var j=0; j<level.rows; j++) {
                level.bubbles[i][j].removed = false;
            }
        }
    }

    function getNeighbors(bubble) {
        var bubblerow = (bubble.y + rowoffset) % 2;
        var neighbors = [];
        var n = neighborsoffsets[bubblerow];
        for (var i=0; i<n.length; i++) {
            var nx = bubble.x + n[i][0];
            var ny = bubble.y + n[i][1];
            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
                neighbors.push(level.bubbles[nx][ny]);
            }
        }
        return neighbors;
    }

    function updateFps(dt) {
        if (fpstime > 0.25) {
            fps = Math.round(framecount / fpstime);
            fpstime = 0;
            framecount = 0;
        }
        fpstime += dt;
        framecount++;
    }

    function drawCenterText(text, x, y, width) {
        var textdim = context.measureText(text);
        context.fillText(text, x + (width-textdim.width)/2, y);
    }

    function render() {
        drawFrame();
        var yoffset =  level.bubbleheight/2;

        context.fillStyle = "#F5F5F5";
        context.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 4 - yoffset);

        renderbubbles();

        context.fillStyle = "#354259";
        context.fillRect(level.x - 4, level.y - 4 + level.height + 4 - yoffset, level.width + 8, 2*level.bubbleheight + 3);

        context.fillStyle = "#ffffff";
        context.font = "18px Marcellus SC";
        var scorex = level.x + level.width - 150;
        var scorey = level.y+level.height + level.bubbleheight - yoffset - 8;
        drawCenterText("s c o r e:", scorex, scorey, 150);
        context.font = "24px  serif";
        drawCenterText(score, scorex, scorey+30, 150);

        if (showcluster) {
            renderCluster(cluster, 255, 128, 128);

            for (var i=0; i<floatingclusters.length; i++) {
                var col = Math.floor(100 + 100 * i / floatingclusters.length);
                renderCluster(floatingclusters[i], col, col, col);
            }
        }

        renderPlayer();

        if (gamestate == gamestates.gameover) {
            context.fillStyle = "rgba(0, 0, 0, 0.8)";
            context.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 2 * level.bubbleheight + 8 - yoffset);
            context.fillStyle = "#ffffff";
            context.font = "24px Berkshire Swash";
            drawCenterText("Game Over!", level.x, level.y + level.height / 2 + 10, level.width);
            drawCenterText("Click to start", level.x, level.y + level.height / 2 + 40, level.width);
        }
    }

    function drawFrame() {
        // context.fillStyle = "#e8eaec";
        // context.fillRect(0, 0, map.width, map.height);

        // context.fillStyle = "#30475E";
        // context.fillRect(0, 0, map.width, 79);

        // context.fillStyle = "#ffffff";
        // context.font = "24px Berkshire Swash";
        // context.fillText("Jas Hello Bubble Shooter", 10, 50);

    }

    function renderbubbles() {
        for (var j=0; j<level.rows; j++) {
            for (var i=0; i<level.columns; i++) {
                var bubble = level.bubbles[i][j];
                var shift = bubble.shift;
                var coord = getbubbleCoordinate(i, j);
                if (bubble.color >= 0) {
                    context.save();
                    context.globalAlpha = bubble.alpha;
                    drawBubble(coord.bubblex, coord.bubbley + shift, bubble.color);
                    context.restore();
                }
            }
        }
    }

    function renderCluster(cluster, r, g, b) {
        for (var i=0; i<cluster.length; i++) {
            var coord = getbubbleCoordinate(cluster[i].x, cluster[i].y);
            context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            context.fillRect(coord.bubblex+level.bubblewidth/4, coord.bubbley+level.bubbleheight/4, level.bubblewidth/2, level.bubbleheight/2);
        }
    }

    function renderPlayer() {
        var centerx = player.x + level.bubblewidth/2;
        var centery = player.y + level.bubbleheight/2;
        context.fillStyle = "#7a7a7a";
        context.beginPath();
        context.arc(centerx, centery, level.radius+12, 0, 2*Math.PI, false);
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "#8c8c8c";
        context.stroke();
        context.lineWidth = 2;
        context.strokeStyle = "#1D5C63";
        context.beginPath();
        context.moveTo(centerx, centery);
        context.lineTo(centerx + 1.5*level.bubblewidth * Math.cos(degToRad(player.angle)), centery - 1.5*level.bubbleheight * Math.sin(degToRad(player.angle)));
        context.stroke();
        drawBubble(player.nextbubble.x, player.nextbubble.y, player.nextbubble.bubblecolor);
        if (player.bubble.visible) {
            drawBubble(player.bubble.x, player.bubble.y, player.bubble.bubblecolor);
        }

    }

    function getbubbleCoordinate(column, row) {
        var bubblex = level.x + column * level.bubblewidth;
        if ((row + rowoffset) % 2) {
            bubblex += level.bubblewidth/2;
        }
        var bubbley = level.y + row * level.rowheight;
        return { bubblex: bubblex, bubbley: bubbley };
    }

    function getGridPosition(x, y) {
        var gridy = Math.floor((y - level.y) / level.rowheight);
        var xoffset = 0;
        if ((gridy + rowoffset) % 2) {
            xoffset = level.bubblewidth / 2;
        }
        var gridx = Math.floor(((x - xoffset) - level.x) / level.bubblewidth);

        return { x: gridx, y: gridy };
    }

    function drawBubble(x, y, index) {
        if (index < 0 || index >= bubblecolors)
            return;
        context.drawImage(bubbleimage, index * 40 + 3,0,40,40, x, y, level.bubblewidth, level.bubbleheight);
    }

    function newGame() {
        score = 0;
        turncounter = 0;
        rowoffset = 0;
        setGameState(gamestates.ready);
        createLevel();
        nextBubble();
        nextBubble();
    }

    function createLevel() {
        for (var j=0; j<level.rows; j++) {
            var randombubble = randRange(0, bubblecolors-1);
            var count = 0;
            for (var i=0; i<level.columns; i++) {
                if (count >= 2) {
                    var newbubble = randRange(0, bubblecolors-1);
                    if (newbubble == randombubble) {
                        newbubble = (newbubble + 1) % bubblecolors;
                    }
                    randombubble = newbubble;
                    count = 0;
                }
                count++;

                if (j < level.rows/2) {
                    level.bubbles[i][j].color = randombubble;
                }
                else {
                    level.bubbles[i][j].color = -1;
                }
            }
        }
    }

    // New bubble for player
    function nextBubble() {
        player.bubblecolor = player.nextbubble.bubblecolor;
        player.bubble.bubblecolor = player.nextbubble.bubblecolor;
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.visible = true;
        var nextcolor = getExistingColor();
        player.nextbubble.bubblecolor = nextcolor;
    }

    function getExistingColor() {
        existingcolors = findColors();
        var bubblecolor = 0;
        if (existingcolors.length > 0) {
            bubblecolor = existingcolors[randRange(0, existingcolors.length-1)];
        }
        return bubblecolor;
    }

    function randRange(low, high) {
        return Math.floor(low + Math.random()*(high-low+1));
    }

    function shootBubble() {
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.angle = player.angle;
        player.bubble.bubblecolor = player.bubblecolor;
        setGameState(gamestates.shootbubble);
    }

    function circleIntersection(x1, y1, r1, x2, y2, r2) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len < r1 + r2) {
            return true;
        }
        return false;
    }

    function radToDeg(angle) {
        return angle * (180 / Math.PI);
    }

    function degToRad(angle) {
        return angle * (Math.PI / 180);
    }

    function onMouseMove(e) {
        var pos = getMousePos(map, e);
        var mouseangle = radToDeg(Math.atan2((player.y+level.bubbleheight/2) - pos.y, pos.x - (player.x+level.bubblewidth/2)));
        if (mouseangle < 0) {
            mouseangle = 180 + (180 + mouseangle);
        }
        // min 8, max 172
        var lbound = 8;
        var ubound = 172;
        if (mouseangle > 90 && mouseangle < 270) {
            if (mouseangle > ubound) {
                mouseangle = ubound;
            }
        }
        else {
            if (mouseangle < lbound || mouseangle >= 270) {
                mouseangle = lbound;
            }
        }
        player.angle = mouseangle;
    }

    function onMouseDown(e) {
        var pos = getMousePos(map, e);

        if (gamestate == gamestates.ready) {
            shootBubble();
        }
        else if (gamestate == gamestates.gameover) {
            newGame();
        }
    }

    function getMousePos(map, e) {
        var rect = map.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*map.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*map.height)
        };
    }
    init();
};
