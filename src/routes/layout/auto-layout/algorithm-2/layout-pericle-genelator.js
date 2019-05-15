import LayoutsHelper from './layoutsHelper'

//图片的信息
let layout = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    scale: 1,
    angle: 0
};

export default {
    _step: 0,
    flag: false,
    layouts: null,
    perticles: null,
    weakMode: false,
    init(layouts, weakMode = false) {
        this.weakMode = weakMode;
        this._step = 0;
        this.flag = false;
        this.layouts = layouts;
        this.perticles = [];
    },
    //
    addPerticleObject(perticles, layouts, pid, ax, ay, ascale, aangle) {
        var j;
        var found;
        var po;
        found = false;
        for (j = 0; j < perticles.length; j++) {
            if (perticles[j].willDelete && perticles[j].index == pid) {
                po = perticles[j];
                found = true;
            }
        }
        if (!found) {
            po = createPerticles(layouts[pid], pid, ax, ay, ascale, aangle);
            //po.setPositon(Math.random()*UTItemManager.IMAGE_WIDTH,Math.random()*UTItemManager.IMAGE_HEIGHT,0,Math.random()*Math.PI*2-Math.PI);
        }
        //po.setPositonWithAnimate(ax,ay,ascale,aangle);
        po.willDelete = false;
        if (!found) perticles.push(po);
    },
    //创建规则形态的布局
    generatePictLayouts(perticles, layouts) {
        var marginX;
        var iStep;

        var rad = 0;

        var x;
        var y;
        var scale;

        var palette = [];
        var divX;
        var divY;
        var posX;
        var posY;
        var size;
        var yi;
        var xi;
        var checkTimes;

        var mw = 0;
        var mh = 0;
        var defaultScale = 1;

        for (var i = 0; i < layouts.length; i++) {
            var lo = layouts[i];
            mw = Math.max(mw, lo.width);
            mh = Math.max(mh, lo.height);
        }

        for (i = 0; i < layouts.length; i++) {
            lo = layouts[i];
            defaultScale = Math.min(defaultScale, mw / lo.width);
            defaultScale = Math.min(defaultScale, mh / lo.height);
        }

        divX = 1;
        divY = 1;
        marginX = 2;
        iStep = Math.pow(this._step, 0.75) * 20 + Math.sqrt(layouts.length);

        console.log('iStep' + iStep);

        for (i = 0; i < iStep; i++) {
            if (divX * mw < divY * mh) {
                divX++;
            } else {
                divY++;
            }
        }
        //trace("LAYOUT STAGE INFO:",divX,divY,mw,mh);
        //divX = 2;
        //divY = 3;
        //for (i = 0; i < 6; i++) palette.push(0);
        for (i = 0; i < divX * divY; i++) palette.push(0);

        console.log('palette ' + JSON.stringify(palette));

        marginX = Math.max(divX * mw, divY * mh) * 0.02;

        console.log('marginX ' + marginX)

        rad = Math.random() * Math.PI * .5 - Math.PI * 0.25;
        if (Math.abs(rad / Math.PI * 180) < 15) rad = 0;
        rad = 0;

        i = Math.floor(Math.random() * layouts.length);

        //trace("----");

        //startingSize:
        //console.log('size ' + size);
        size = Math.min(divX, divY);
        size = Math.min(size < 5 ? Math.ceil(size * .5) + (Math.ceil(size * .5) + 1) * Math.random() : 1 + ((size - 1) * 0.8) * Math.random(), size);

        //console.log('size ' + size);
        //console.log('divX ' + divX);
        //console.log('divY ' + divY);

        if (size > 1 && size == divX && size == divY) size--;

        checkTimes = 0;

        var _self = this;

        function checkPicpos() {
            let status = 'OK';
            for (yi = posY; yi < posY + size; yi++) {
                if (status == 'OK') {
                    for (xi = posX; xi < posX + size; xi++) {
                        if (status == 'OK') {
                            if (palette[yi * divX + xi]) {
                                checkTimes++;
                                if (checkTimes > 500) {
                                    size--;
                                    checkTimes = 0;
                                    if (size < 2) status = 'END';
                                }
                                status = 'RECHECK';
                            }
                        } else {
                            break;
                        }
                    }
                } else {
                    break;
                }
            }
            return status;
        }

        function getNextLayout() {
            lo = layouts[i];

            posX = Math.floor((divX - size + 1) * Math.random());
            posY = Math.floor((divY - size + 1) * Math.random());

            let res = checkPicpos();

            //console.log(`posX: ${posX}  posY: ${posY}  res: ${res} checkTimes: ${checkTimes}`);

            if (res === 'OK') {
            } else if (res === 'RECHECK') {
                if (size > 1) {
                    getNextLayout();
                }
                return;
            } else {
                return;
            }

            console.log(`posX + ${posX} posY + ${posY} size + ${size} Math.round(size) + ${Math.round(size)}`);
            console.log('posY ' + posY);

            //源代码处理边界地方好像有bug，会有突出的块
            size = Math.round(size);

            if (size > (divX - posX)) {
                size = (divX - posX);
            }
            if (size > (divY - posY)) {
                size = (divY - posY)
            }
            //处理结束

            for (yi = posY; yi < posY + size; yi++) {
                for (xi = posX; xi < posX + size; xi++) {
                    if (xi < divX) {
                        palette[yi * divX + xi] = 1;
                    }
                }
            }
            scale = size * defaultScale;

            x = posX * mw + mw * defaultScale * .5;  //源代码这里好像有bug
            y = posY * mh + mh * defaultScale * .5;

            {
                if (lo.width / (mw * scale) > lo.height / (mh * scale)) {
                    scale = (mw * scale) / lo.width;
                    scale *= (lo.width * scale - marginX) / (lo.width * scale);
                } else {
                    scale = (mh * scale) / lo.height;
                    scale *= (lo.height * scale - marginX) / (lo.height * scale);
                }
            }
            console.log('digui loop x,y' + x + ' ' + y + '' + scale);
            _self.addPerticleObject(perticles, layouts, i, x, y, scale, rad);

            i++;
            if (i + 1 > layouts.length) i = 0;

            if (size > 1) {
                getNextLayout();
            }
        };

        getNextLayout();

        for (yi = 0; yi < divY; yi++) {
            for (xi = 0; xi < divX; xi++) {
                if (!palette[yi * divX + xi]) {
                    lo = layouts[i];
                    scale = defaultScale;
                    x = xi * mw + mw * scale * .5;
                    y = yi * mh + mh * scale * .5;

                    {
                        if (lo.width / (mw * scale) > lo.height / (mh * scale)) {
                            scale = (mw * scale) / lo.width;
                            scale *= (lo.width * scale - marginX) / (lo.width * scale);
                        } else {
                            scale = (mh * scale) / lo.height;
                            scale *= (lo.height * scale - marginX) / (lo.height * scale);
                        }
                    }
                    //console.log('x ' + x);
                    //console.log('y ' + y);
                    //console.log('scale ' + scale);
                    console.log('loop x,y' + x + ' ' + y);
                    this.addPerticleObject(perticles, layouts, i, x, y, scale, rad);

                    i++;
                    if (i + 1 > layouts.length) i = 0;
                }
            }
        }

        //console.log('divX ' + divX);
        //console.log('divY ' + divY);
        //console.log('palette ' + JSON.stringify(palette));
        //调试用输出矩阵布局
        for (yi = 0; yi < divY; yi++) {
            let divXStr = yi < 10 ? ' ' + yi + ' : ' : yi + ' : ';
            for (xi = 0; xi < divX; xi++) {
                divXStr = divXStr + palette[yi * divX + xi] + ','
            }
            //console.log(divXStr)
        }

        //console.log('perticles1');
        //console.log(perticles);
        LayoutsHelper.fixLayouts(perticles, rad);

        return perticles;
        //LayoutsHelper.fixLayouts(perticles, 0);

        //console.log('perticles');
        //console.log(perticles);
    },

    //创建不规则的布局-一个图像
    generatePictLayouts2Single(perticles, layouts) {
        var i;
        var t;
        var j;
        var v;
        var y;
        var marginX = 3;
        var marginY = 3;
        var MAX_WIDTH = 200;
        var MAX_HEIGHT = 7;
        var po;
        var lo;

        var x;
        var scale;
        var angle;

        var found;
        var MAX_LINE;
        var ax;
        var ay;
        var cx;
        var cy;

        var rad;
        var strechMode;
        var addDecoration;
        var sizes;

        var palette;
        var divX;
        var divY;
        var numH;
        var numW;
        var posX;
        var posY;
        var size;
        var yi;
        var xi;
        var checkTimes;
        var kaburiNum;


        palette = [];

        var mw = 0;
        var mh = 0;

        for (i = 0; i < layouts.length; i++) {
            lo = layouts[i];
            mw = Math.max(mw, lo.width);
            mh = Math.max(mh, lo.height);
        }
        var aspect = mw / mh;


        var widM = mw > mh;
        var iaspect = Math.max(1, Math.round(widM ? mw / mh : mh / mw));
        //	trace(aspect,iaspect);

        console.log(iaspect);

        divX = Math.max(20 + (40 * 1.5 - 20) * this._step, widM ? 8 * iaspect : 0);
        divY = Math.max(25 + (50 * 1.5 - 20) * this._step, widM ? 0 : 8 * iaspect);

        divX = Math.round(divX);
        divY = Math.round(divY);

        MAX_WIDTH = divX * 10;
        MAX_HEIGHT = divY * 10;

        marginX = 0;

        rad = Math.random() * Math.PI * .5 - Math.PI * 0.25;
        if (Math.abs(rad / Math.PI * 180) < 15) rad = 0;

        console.log(rad);
        for (i = 0; i < divX * divY; i++) palette.push(0);

        //console.log('palette ' + JSON.stringify(palette));


        i = Math.floor(Math.random() * layouts.length);

        //trace("----");

        var objectNum = Math.max(layouts.length, 2) + 30 * this._step;

        for (j = 0; j < objectNum; j++) {
            lo = layouts[i];
            if (j == 0) {
                //初回文字
                size = 3;
                numH = 1;
                for (t = 0; t < size; t++) numH += numH
                if (widM) {
                    numW = numH * iaspect;
                } else {
                    numW = numH;
                    numH = numW * iaspect;
                }
                scale = MAX_HEIGHT / Number(divY) * numH / lo.height;
                posX = Math.round((divX - numW) * .5);
                posY = Math.round((divY - numH) * .5);
                size = 2;
            } else {
                numH = 0;
                numW = 0;
                while (numH * numW < 4) {
                    numH = 1;
                    for (t = 0; t < size; t++) numH += numH
                    if (widM) {
                        numW = numH * iaspect;
                    } else {
                        numW = numH;
                        numH = numW * iaspect;
                    }
                    scale = MAX_HEIGHT / Number(divY) * numH / lo.height;
                    if (numH * numW < 4) {
                        size++;
                    } else {
                        size = Math.floor(Math.random() * 3);
                    }
                }

                kaburiNum = 0;
                checkTimes = 0;
                {
                    //RE_CHECK:

                    function reCheck() {

                        let status = 'OK';

                        posX = 1 + Math.floor((divX - numW - 2) * Math.random());
                        posY = 1 + Math.floor((divY - numH - 2) * Math.random());

                        checkTimes++;
                        if (checkTimes > 500) {
                            //trace("NOT FOUND")
                            return 'END';
                            //continue;
                        }
                        for (y = posY; y < posY + numH; y++) {
                            if (status === 'OK') {
                                for (x = posX; x < posX + numW; x++) {
                                    if (status === 'OK') {
                                        if (palette[y * divX + x]) {
                                            //goto RE_CHECK;
                                            status = 'RECHECK';
                                        }
                                    }
                                    else {
                                        break
                                    }
                                }
                            } else {
                                break;
                            }
                        }

                        if (status === 'OK') {

                        } else if (status == 'RECHECK') {
                            return reCheck();
                        } else {
                            return status;
                        }
                        kaburiNum = 0;

                        for (y = posY; y < posY + numH && !found; y++) {
                            x = posX - 1;
                            if (palette[y * divX + x]) {
                                kaburiNum++;
                            }
                            x = posX + numW;
                            if (palette[y * divX + x]) {
                                kaburiNum++;
                            }
                        }
                        if (kaburiNum < 2)
                            for (x = posX; x < posX + numW && !found; x++) {
                                y = posY - 1;
                                if (palette[y * divX + x]) {
                                    kaburiNum++;
                                }
                                y = posY + numH;
                                if (palette[y * divX + x]) {
                                    kaburiNum++;
                                }
                            }
                        if (kaburiNum < 2) {
                            return reCheck();
                        }

                        return status;
                    }

                    let status = reCheck();
                    console.log('end status' + status);
                    if (status === 'END') {
                        continue;
                    }

                }
            }

            //パレットにマーキング
            for (yi = posY; yi < posY + numH; yi++) {
                for (xi = posX; xi < posX + numW; xi++) {
                    if (xi < divX) {  //源代码处理边界地方好像有bug
                        palette[yi * divX + xi] = 1;
                    }
                }
            }

            console.log(`posX: ${posX} posY: ${posY} numW: ${numW} numH: ${numH} `)

            marginX = 3;

            y = posY * 10;
            x = (posX * 10) * aspect * (widM ? 1.0 / Number(iaspect) : iaspect);
            //x=(posX+numW)/Number(divX)*MAX_WIDTH-lo.width*0.5*scale-marginX*.5;
            scale *= (lo.height * scale - marginX) / (lo.height * scale);//margin for Y

            angle = 0;
            console.log('2 loop x,y' + x + ' ' + y + '' + scale);
            this.addPerticleObject(perticles, layouts, i, x, y, scale, rad);

            i++;
            if (i + 1 > layouts.length) i = 0;
        }

        //console.log('divX ' + divX);
        //console.log('divY ' + divY);
        //console.log('palette ' + JSON.stringify(palette));
        //console.log('palette.length ' + palette.length);

        for (yi = 0; yi < divY; yi++) {
            let divXStr = yi < 10 ? ' ' + yi + ' : ' : yi + ' : ';
            for (xi = 0; xi < divX; xi++) {
                divXStr = divXStr + palette[yi * divX + xi] + ','
            }
            //console.log(divXStr)
        }

        LayoutsHelper.fixLayouts(perticles, rad);

        //console.log('perticles2');
        //console.log(perticles);

        return perticles;

        //LayoutsHelper.debugDrawPalette(divX,divY,palette);
    },

    generateLayout() {
        this._step += 0.015 * 0.2;
        if (this._step > 1.0) this._step = 1.0;
        if (this.weakMode && this._step > 0.05) this._step = 0.05;

        let num = this.perticles.length;
        for (var i = 0; i < num;) {
            if (this.perticles[i].willDelete) {
                this.perticles.splice(i, 1);
                num--;
            } else {
                this.perticles[i].willDelete = true;
                i++;
            }
        }

        this.perticles = [];

        let res;
        if (this.flag) {
            res = this.generatePictLayouts2Single(this.perticles, this.layouts);
        } else {
            res = this.generatePictLayouts(this.perticles, this.layouts);
        }

        this.flag = !this.flag;
        return res;
    }
}

//创建布局
function createPerticles(layout, pid, ax, ay, ascale, aangle) {
    var po = {};
    po._scale = 0;
    po._angle = 0;
    po._x = 0;
    po._y = 0;


    po.willDelete = false;
    po.toX = 50;
    po.toY = 50;
    po.toScale = 1;
    po.toAngle = 0;

    po.accX = 0;
    po.accY = 0;
    po.accScale = 0;
    po.accAngle = 0;

    po.dumpingForce = 0.98;
    po.springiness = 0.2;


    po._lo = layout;
    po.index = pid;
    po.toX = ax;
    po._x = po.toX;
    po.toY = ay;
    po._y = po.toY;
    po.toScale = ascale;
    po._scale = po.toScale;
    po.toAngle = aangle;
    po._angle = po.toAngle;

    po.width = function () {
        return po._lo.width * po.toScale;
    };

    po.height = function () {
        return po._lo.height * po.toScale;
    };

    return po;
}