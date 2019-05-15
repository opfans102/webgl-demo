import layoutPericleGenelator from './layout-pericle-genelator';
import layoutsHelper from './layoutsHelper';

export default {
    ctx: null,
    imgArr: [],
    imgIcon: null,
    init(ctx, imgArr) {
        this.ctx = ctx;
        this.imgArr = imgArr;
        this.imgIcon = imgArr[0];
        ctx.drawImage(this.imgIcon, 50, 50, 300, 300);
    },
    draw() {
        var imgArr = layoutPericleGenelator.generateLayout1();
        this.ctx.clearRect(0, 0, 600, 600);
        // 内存中先加载，然后当内存加载完毕时，再把内存中的数据填充到我们的 dom元素中，这样能够快速的去
        let imgList = imgArr.images;
        this.setAnimation(imgList);
        console.log('imgList ' + JSON.stringify(imgList))
        this.drawImageAnimation(imgArr.rotate, imgList)
    },

    drawluqaing(){
        var result = layoutPericleGenelator3.generate(300,300);

        var  arr = []
        result.forEach((ii,i)=>{
            ii.forEach((singal,j)=>{
                singal.left = singal.x;
                singal.top = singal.y;

                if (i === 0 || i === (result.length - 1)) {
                    if (j > 1 || j < (ii.length - 2)) {
                        singal.show = Math.floor(Math.random() * 2);
                    } else {
                        singal.show = 1;
                    }
                } else {
                    if (j < 1 || j > (ii.length - 2)) {
                        singal.show = Math.floor(Math.random() * 2);
                    } else {
                        singal.show = 1;
                    }
                }
                arr.push(singal)
            })
        });

        var imgArr = {
            rotate: 0,
            images: arr
        }
        this.ctx.clearRect(0, 0, 600, 600);
        // 内存中先加载，然后当内存加载完毕时，再把内存中的数据填充到我们的 dom元素中，这样能够快速的去
        let imgList = imgArr.images;
        this.setAnimation(imgList);
        console.log('imgList ' + JSON.stringify(imgList))
        this.drawImageAnimation(imgArr.rotate, imgList)
    },

    onlyDraw() {
        var bitmap = layoutPericleGenelator.generateLayout1();
        var imgArr = bitmap.images;
        this.ctx.clearRect(0, 0, 600, 600);
        this.ctx.save();
        this.ctx.rotate(bitmap.rotate);
        for (var i = 0, length = imgArr.length; i < length; i++) {
            var img = imgArr[i];
            let x = img.left, y = img.top;
            if (img.show) {
                this.ctx.drawImage(this.imgIcon, x, y, img.width, img.height);
            }
        }
        this.ctx.restore();
    },
    setAnimation(imgArr) {
        for (var i = 0, length = imgArr.length; i < length; i++) {
            var img = imgArr[i];
            img.drawLeft = 80;
            img.drawTop = 100;
            img.speedX = (img.left - img.drawLeft) / 25;
            img.speedY = (img.top - img.drawTop) / 25;
            img.addSpeedX = img.speedX / 30;
            img.addSpeedY = img.speedY / 30;
        }
    },

    speed(imgArr) {
        for (var i = 0, length = imgArr.length; i < length; i++) {
            var img = imgArr[i];
            img.speedX = img.speedX + img.addSpeedX;
            img.speedY = img.speedY + img.addSpeedY;
            if (Math.abs(img.drawLeft - img.left) > Math.abs(img.speedX)) {
                img.drawLeft = img.drawLeft + img.speedX;
            } else {
                img.drawLeft = img.left
            }
            if (Math.abs(img.drawTop - img.top) > Math.abs(img.speedY)) {
                img.drawTop = img.drawTop + img.speedY;
            } else {
                img.drawTop = img.top
            }
        }
    },
    drawImageAnimation(rotate, imgArr) {
        this.ctx.clearRect(0, 0, 600, 600);
        this.ctx.save();
        this.ctx.rotate(rotate);
        for (var i = 0, length = imgArr.length; i < length; i++) {
            var img = imgArr[i];
            let x = img.drawLeft, y = img.drawTop;
            if (img.show) {
                this.ctx.drawImage(this.imgIcon, x, y, img.width, img.height);
            }
        }
        this.ctx.restore();
        if (img.drawLeft === img.left && img.drawTop === img.top) {
            return;
        }
        window.requestAnimationFrame(() => {
            this.speed(imgArr);
            this.drawImageAnimation(rotate, imgArr)
        });
    }
}