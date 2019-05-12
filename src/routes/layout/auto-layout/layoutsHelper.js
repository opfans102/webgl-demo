export default {
    IMAGE_WIDTH: 400,
    IMAGE_HEIGHT: 400,
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
            //po = new perticleObject(layouts[pid], pid);
            //po.setPositon(Math.random() * UTItemManager.IMAGE_WIDTH, Math.random() * UTItemManager.IMAGE_HEIGHT, 0, Math.random() * Math.PI * 2 - Math.PI);
        }
        //po.setPositonWithAnimate(ax, ay, ascale, aangle);
        po.willDelete = false;
        if (!found) perticles.push(po);
    },

    fixLayouts(perticles, rad) {
        var found;
        var i;
        var po;
        var hh;
        var hw;
        var cx;
        var cy;
        var minX;
        var maxX;
        var minY;
        var maxY;
        var w;
        var h;
        var movX;
        var movY;
        var s;

        if (rad != 0) {
            for (i = 0; i < perticles.length; i++) {
                po = perticles[i];
                if (po.willDelete) continue;
                cx = po.toX * Math.cos(rad) - po.toY * Math.sin(rad);
                cy = po.toX * Math.sin(rad) + po.toY * Math.cos(rad);
                po.toX = cx;
                po.toY = cy;
                po.toAngle += rad;

            }
        }


        found = false;
        for (i = 0; i < perticles.length; i++) {
            po = perticles[i];
            if (po.willDelete) continue;
            hh = po.height() * .5;
            hw = po.width() * .5;

            cx = Math.max(Math.abs(hw * Math.cos(po.toAngle) - hh * Math.sin(po.toAngle)), Math.abs(hw * Math.cos(po.toAngle) + hh * Math.sin(po.toAngle)));
            cy = Math.max(Math.abs(hw * Math.sin(po.toAngle) + hh * Math.cos(po.toAngle)), Math.abs(hw * Math.sin(po.toAngle) - hh * Math.cos(po.toAngle)));

            if (!found) {
                found = true;
                minX = po.toX - cx;
                maxX = po.toX + cx;
                minY = po.toY - cy;
                maxY = po.toY + cy;
            } else {
                minX = Math.min(minX, po.toX - cx);
                maxX = Math.max(maxX, po.toX + cx);
                minY = Math.min(minY, po.toY - cy);
                maxY = Math.max(maxY, po.toY + cy);
            }
        }

        w = maxX - minX;
        h = maxY - minY;

        var MaxW = this.IMAGE_WIDTH - 200;
        var MaxH = this.IMAGE_HEIGHT;

        if (MaxH / h < MaxW / w) {
            s = MaxH / h;
            //if(w*s>AppVals.IMAGE_WIDTH*.5)movX=(AppVals.IMAGE_WIDTH-w*s)*.5;
            //else movX=(AppVals.IMAGE_WIDTH-w*s)*(Math.random());
        } else {
            s = MaxW / w;
            //if(Math.random()<0.6) movY=(AppVals.IMAGE_HEIGHT-h*s)*.2;
            //else movY=(AppVals.IMAGE_HEIGHT-h*s)*(Math.random());

        }
        movX = (this.IMAGE_WIDTH - w * s) * .5;
        movY = (this.IMAGE_HEIGHT - h * s) * .2;


        //位置を再定義する。
        for (i = 0; i < perticles.length; i++) {
            po = perticles[i];
            if (po.willDelete) continue;
            po.toX -= minX;
            po.toY -= minY;
            po.toScale *= s;
            po.toX *= s;
            po.toY *= s;
            po.toX += movX;
            po.toY += movY;
        }
    }
}