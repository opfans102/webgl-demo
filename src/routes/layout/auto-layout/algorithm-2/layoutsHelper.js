export default {
    IMAGE_WIDTH: 300,
    IMAGE_HEIGHT: 300,
    initCanvas(width,height){
        this.IMAGE_WIDTH = width;
        this.IMAGE_HEIGHT = height;
    },
    fixLayouts(perticles, rad) {
        let xMin = 100000000, yMin = 100000000, xMax = 0, yMax = 0;
        perticles.forEach(perticle => {
            if (xMin > perticle._x) {
                xMin = perticle._x
            }
            if (yMin > perticle._y) {
                yMin = perticle._y
            }

            //console.log('perticle.width()' + perticle.width());
            //console.log('perticle.height()' + perticle.height());

            if ((perticle._x + perticle.width()) > xMax) {
                xMax = perticle._x + perticle.width()
            }
            if ((perticle._y + perticle.height()) > yMax) {
                yMax = perticle._y + perticle.height()
            }
        });

        let width = xMax - xMin, height = yMax - yMin;

        console.log(`xMin: ${xMin} yMin: ${xMin} xMax: ${xMax} yMax: ${yMax} width: ${width} height: ${height} rad: ${rad} Math.sin(rad): ${Math.sin(rad)} `)

        let MaxW = this.IMAGE_WIDTH - 50;
        let MaxH = this.IMAGE_HEIGHT - 50;

        console.log('MaxW/width < MaxH/height ' + ((MaxW / width) < (MaxH / height)))
        let s1;
        let ax, ay;

        if ((MaxW / width) < (MaxH / height)) {
            s1 = MaxW / width;

        } else {
            s1 = MaxH / height;
        }

        let moveX = (this.IMAGE_WIDTH - width * s1) * 0.5;
        let moveY = (this.IMAGE_HEIGHT - height * s1) * 0.5;

        perticles.forEach(perticle => {
            perticle.toX = perticle.toX - xMin;
            perticle.toX = perticle.toX * s1;
            perticle.toX = perticle.toX + moveX;

            perticle.toY = perticle.toY - yMin;
            perticle.toY = perticle.toY * s1;
            perticle.toY = perticle.toY + moveY;

            perticle.toScale = perticle.toScale * s1;

            perticle.animationX = this.IMAGE_WIDTH * 0.5 * 0.9;
            perticle.animationY = this.IMAGE_HEIGHT * 0.5 * 0.9;

            if (rad > 0) {
                ax = this.IMAGE_HEIGHT * Math.sin(rad) * 0.4;
                ay = this.IMAGE_WIDTH * Math.sin(rad) * 0.5;
                perticle.toX = perticle.toX + ax;
                perticle.toY = perticle.toY - ay;


                perticle.animationX = perticle.animationX + ax;
                perticle.animationY = perticle.animationY - ay;

            } else if (rad < 0) {
                ax = this.IMAGE_HEIGHT * Math.sin(rad) * 0.7;
                ay = this.IMAGE_WIDTH * Math.sin(rad) * 0.3;
                perticle.toX = perticle.toX + ax;
                perticle.toY = perticle.toY - ay;

                perticle.animationX = perticle.animationX + ax;
                perticle.animationY = perticle.animationY - ay;
            }
        })
    }
}