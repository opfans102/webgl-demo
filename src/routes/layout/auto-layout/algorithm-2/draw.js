import layoutPericleGenelator from './layout-pericle-genelator';
import layoutsHelper from './layoutsHelper';

export default {
    ctx: null,
    init(ctx, imgArrays, weakMode, canvasWidth, canvasHeight, dumpingForce) {
        this.ctx = ctx;
        let layouts = []
        if (imgArrays && imgArrays.length > 0) {
            imgArrays.forEach(img => {
                let s1 = (img.height / img.width);
                let layout = {
                    img: img.image,
                    width: 50,
                    height: s1 * 50
                }
                layouts.push(layout);
                this.ctx.clearRect(0, 0, 600, 600);
                ctx.drawImage(img.image, 30, 30, canvasWidth * .8, canvasHeight * s1 * .8);
            });
        }

        console.log('algorithm-2.draw layouts ' + JSON.stringify(layouts));

        layoutsHelper.initCanvas(canvasWidth, canvasHeight);
        layoutPericleGenelator.init(layouts, weakMode);
    },
    draw() {
        var pericles = layoutPericleGenelator.generateLayout();
        this.ctx.clearRect(0, 0, 600, 600);
        this.setAnimation(pericles);
        this.drawImageAnimation(pericles);
    },
    setAnimation(pericles) {
        pericles.forEach(pericle => {
            pericle.speedX = (pericle.toX - pericle.animationX) / 10;
            pericle.speedY = (pericle.toY - pericle.animationY) / 10;
            pericle.addSpeedX = 0;//pericle.speedX / 30;
            pericle.addSpeedY = 0;//pericle.speedY / 30;

            pericle.animationScale = 0.01;
            pericle.animationScaleRate = 1/10;
        });
    },

    speed(pericles) {
        pericles.forEach(pericle => {
            pericle.animationScale += pericle.animationScaleRate;
            pericle.speedX += pericle.addSpeedX;
            pericle.speedY += pericle.addSpeedY;
            if (Math.abs(pericle.animationX - pericle.toX) > Math.abs(pericle.speedX)) {
                pericle.animationX += pericle.speedX;
            } else {
                pericle.animationX = pericle.toX;
            }
            if (Math.abs(pericle.animationY - pericle.toY) > Math.abs(pericle.speedY)) {
                pericle.animationY += pericle.speedY;
            } else {
                pericle.animationY = pericle.toY;
            }

            if (pericle.animationScale > 1) {
                pericle.animationScale = 1;
            }
        });
    },
    drawImageAnimation(pericles) {
        this.ctx.clearRect(0, 0, 600, 600);
        let p;
        let loopFlag = true
        pericles.forEach(pericle => {
            p = pericle;
            this.ctx.save();
            this.ctx.rotate(pericle.toAngle);
            let x = pericle.animationX, y = pericle.animationY;
            this.ctx.drawImage(pericle._lo.img, x, y, pericle.width() * pericle.animationScale, pericle.height() * pericle.animationScale);
            this.ctx.restore();

            if (p.animationX === p.toX && p.animationY === p.toY &&  pericle.animationScale === 1) {
                loopFlag = false;
            }
        });

        if(!loopFlag){
            return;
        }

        window.requestAnimationFrame(() => {
            this.speed(pericles);
            this.drawImageAnimation(pericles)
        });
    }
}