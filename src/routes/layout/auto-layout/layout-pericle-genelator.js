export default {
    step: 0,
    baseY: 3,
    nW: 70,
    nH: 70,
    baseX: 3,
    maxY: 3, //Y轴网格数
    maxX: 3, //Y轴网格数
    baseWidth: 70,
    baseHeight: 70,

    init: function () {
        this.step = 0;
        this.baseY = 3;
        this.nW = 70;
        this.nH = 70;
        this.baseX = 3;
        this.maxY = 3; //Y轴网格数
        this.maxX = 3; //Y轴网格数
        this.baseWidth = 70;
        this.baseHeight = 70;
    },

    generateLayout1: function () {

        this.step = this.step + 0.1;
        let _step = Math.floor(this.step);

        if (_step >= 4) {
            _step = 4
        }

        this.maxX = this.baseX + _step;
        this.maxY = this.baseY + _step;

        this.baseWidth = this.nW - 10 * _step;
        this.baseHeight = this.nH - 10 * _step;


        var xW = 0, yH = 0, xArr = [], yArr = []

        this.getRandomY(yH, yArr, 2, this.maxY);

        console.log('end');
        console.log('arr ' + JSON.stringify(yArr));

        for (var i = 0, length = yArr.length; i < length; i++) {
            var max = yArr[i];
            var xArrLine = [max];
            var xWLine = max;
            this.getRandomY(xWLine, xArrLine, max, this.maxX);
            console.log('xArrLine ' + JSON.stringify(xArrLine));
            xArr.push(xArrLine)
        }

        return this.generatePosition(xArr);
    },

    getRandomY(yH, arr, baseRadom, maxNum) {
        var singal = Math.floor(Math.random() * baseRadom) + 1;
        var temp = yH + singal;

        if (temp <= maxNum) {
        } else if (temp > maxNum) {
            singal = maxNum - yH;
        }

        arr.push(singal);
        yH = yH + singal;

        /*console.log('singal ' + singal);
        console.log('yH ' + yH)
        console.log('maxNum ' + maxNum)*/

        if (yH < maxNum) {
            this.getRandomY(yH, arr, baseRadom, maxNum);
            //console.log('Loop getRandom');
        } else {

        }
    },

    generatePosition(xLineArr) {
        var top = 0;
        var left = 0;
        var baseWidth = this.baseWidth;
        var baseHeight = this.baseHeight;
        var margin = 2;
        var arrayList = [];

        var rotate = Math.floor(Math.random() * 3) - 1; // 0不用转，1正玄  2负玄

        console.log('rotate ' + rotate)

        if (rotate === 1) {
            left = left + 105;
        } else if (rotate === -1) {
            top = top + 130;
            left = left - 40;
        } else {
            left = left + 75;
            top = top + 80;
        }

        var drawTop = top;

        for (var i = 0, length = xLineArr.length; i < length; i++) {
            var line = xLineArr[i];
            var drawLeft = left;

            if (i > 0) {
                drawTop = drawTop + xLineArr[i - 1][0] * baseHeight + margin;
            }

            for (var j = 0, lengthJ = line.length; j < lengthJ; j++) {
                var element = line[j];

                if (j > 0) {
                    drawLeft = drawLeft + line[j - 1] * baseWidth + margin;
                }
                var elementObj = {
                    left: drawLeft,
                    top: drawTop,
                    width: element * baseWidth,
                    height: element * baseHeight
                };

                if (i === 0 || i === (xLineArr.length - 1)) {
                    if (j > 1 || j < (line.length - 2)) {
                        elementObj.show = Math.floor(Math.random() * 2);
                    } else {
                        elementObj.show = 1;
                    }
                } else {
                    if (j < 1 || j > (line.length - 2)) {
                        elementObj.show = Math.floor(Math.random() * 2);
                    } else {
                        elementObj.show = 1;
                    }
                }

                //elementObj.show = 1;

                arrayList.push(elementObj);
            }
        }

        var bitmap = {
            rotate: rotate * (1 / 6 * Math.PI),
            images: arrayList
        };

        console.log('bitmap ' + JSON.stringify(bitmap));

        return bitmap;

    }
}