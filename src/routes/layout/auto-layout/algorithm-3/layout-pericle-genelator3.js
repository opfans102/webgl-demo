var ctx= null,
    // canvasWidth= 0,
    // canvasHeight= 0,
    gridWidth= 0,
    gridHeight= 0,
    gridX= 0,
    gridY= 0,
    margin= 10,
    step= 1,
    allGemtries= []
var random= Math.random,
    abs= Math.abs,
    floor= Math.floor,
    ceil= Math.ceil,
    round= Math.round,
    isDebugger= true,
    needAll= false // 是所有位置都填充还是 其它图形占位
let rectInfo= {
    x: 0,
    y: 0,
    width: 150,
    height: 150
}

function rectRender(canvasWidth= 0, canvasHeight= 0){
    // 工具方法
    function getEle(id){
        return document.getElementById(id)
    }
    function getRandomColor(all){
        if(all){
            return `rgba(${getRandomColor()},${getRandomColor()}, ${getRandomColor()}, ${getRandomOpecity()})`
        }else{
            return parseInt(random()*255)
        }
    }
    function getRandomOpecity(){
        return (random()+0.2).toFixed(2)
    }
    function canvasClear(width, height){
        width= width || canvasWidth;
            height= height || canvasHeight;
        ctx.clearRect(0, 0, width, height)
    }
    function change(){
        canvasClear()
        let result= update()
        console.log('result', result);
        return result
    }
    function btnInit(canvasWidth, canvasHeight){
        var btnClear= getEle('btn-clear')
        btnClear.onclick= function(e){
            canvasClear(canvasWidth, canvasHeight)
        }
        var btnTrans= getEle('btn-transform')
        btnTrans.onclick= function(e){
            change()
        }
    }
    const init=()=>{
        var myCanvas= getEle('cas')
        canvasWidth= myCanvas.width
        canvasHeight= myCanvas.height
        btnInit(canvasWidth, canvasHeight)
        ctx= myCanvas.getContext('2d')
        console.log(ctx);
    }
    // 公用处理
    const beginPath=()=>{
        ctx.beginPath()
        ctx.save()
    }
    const closePath=()=>{
        ctx.restore()
        ctx.closePath()
    }
    const render=(fn)=>{
        ctx && beginPath()
        fn && fn()
        ctx && closePath()
    }
    // 样式处理
    const setStyle=(style)=>{
        if(!ctx)return
        for(let key in style){
            ctx[key]= style[key]
        }
    }
    // 位置处理
    const translate=(x, y)=>{
        ctx.translate(x, y)
    }
    const translateCenter=()=>{
        let center= canvasWidth/2,
            middle= canvasHeight/2
        translate(center,middle)
        return {
            x: center,
            y: middle
        }
    }
    const translateCenterOfGem=({width, height},{posX, posY})=>{
        let srcPosX= posX - width/2,
            srcPosY= posY - height/2
        translate(srcPosX, srcPosY)
        return {
            x: posX,
            y: posY
        }
    }
    // 数据处理
    const getBoundsOfScaled=(width, height, scale)=>{
        return {
            width: width*scale,
            height: height*scale
        }
    }

    /*  图形处理  */
    // 矩形
    const rect=({x, y, width, height}, stroke)=>{
        if(stroke){
            ctx.strokeRect(x, y, width, height)
        }else{
            ctx.fillRect(x, y, width, height)
        }

    }
    // 缩放的矩形
    const rectByScale=(rectInfo, scale, stroke)=>{
        ctx.scale(scale, scale);
        rect(rectInfo, stroke)
        return getBoundsOfScaled(rectInfo.width, rectInfo.height, scale)
    }


    // 网格
    function grid(rows, cols, width, height, gridX, gridY){
        console.log(rows, cols, width, height);
        allGemtries= []
        margin= random()*5 + 5
        if(!width){
            width= canvasWidth/2
        }
        if(!height){
            height= canvasHeight/2
        }
        gridWidth= width
        gridHeight= height
        if(gridX == null){
            gridX= gridWidth/2
        }
        if(gridY == null){
            gridY= gridHeight/2
        }
        let basePosX= gridX,
            basePosY= gridY,
            ratio= 1,
        sigleWidth= (gridWidth-margin*cols)/cols,
            sigleHeight=(gridHeight- margin*rows)/rows,
            maxRectWidth= Math.min(Math.ceil(random()*cols), Math.ceil(cols/2))/(ratio > 1 ? ratio: 1/ratio), // 保证最大图形
            maxRectHeight= maxRectWidth*ratio

        let area= 0,
            maxArea= rows*cols,
            count=0,
            totalRects= [],
            maxCount= 5000,
            totalHeight=0,
            totalWidth= 0,
            maxRectPosX= 0, // 正方形所在的位置x
            maxRectPosY= 0, // 正方形所在的位置y
            maxRectRatio= 1
        maxRectPosX= round(random()*(cols - maxRectWidth)) // 最大的图形 所在位置保证不溢出的情况下 随便放
        maxRectPosY= round(random()*(rows - maxRectHeight)) // 最大的图片，所在位置保证不溢出的情况下 随便放
        maxRectRatio= maxRectWidth/maxRectHeight

        // isDebugger && console.log('maxArea= '+maxArea, ';basePosX= '+basePosX, ';basePosY= '+basePosY, ';sigleWidth= '+sigleWidth,';sigleHeight= '+sigleHeight, ';maxRectPosX= '+maxRectPosX, ';maxRectPosY= '+maxRectPosY, ';maxRectWidth= '+maxRectWidth, ';maxRectHeight= '+maxRectHeight, ';maxRectRatio= '+maxRectRatio,';cols= '+cols, ';rows= '+rows);

        const localRender=(rectInfo)=>{
            let {x, y, width, height, style}= rectInfo
            // console.log('maxRectWidth/width='+maxRectWidth/width, 'maxRectHeight/height= '+maxRectHeight/height);

            // if(maxRectWidth/width >= 3 || maxRectHeight/height >= 3){
            //   return
            // }
            render(function(){
                if(style){
                    setStyle({
                        fillStyle: style
                    })
                }
                if(!allGemtries[x]){
                    allGemtries[x]= []
                }
                if(!allGemtries[x][y]){
                    allGemtries[x][y]= []
                }
                let posX=  basePosX + x*(sigleWidth + margin),
                    posY= basePosY+y*(sigleHeight+margin)
                width= width*(sigleWidth + margin)-margin
                height= height*(sigleHeight + margin)-margin
                allGemtries[x][y]={
                    x: posX,
                    y:  posY,
                    width:width,
                    height: height
                }
                if(!ctx)return
                translate(posX, posY)
                rect({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height
                })
            })
        }
        localRender({
            x: maxRectPosX,
            y: maxRectPosY,
            width: maxRectWidth,
            height: maxRectHeight,
            style: 'red'
        })
        let posX =0,
            posY= 0
        count= 0
        fill()
        function rectLeftHandler(posX, posY){
            console.log('rectLeftHandler=======');
            if(count++ > 100)return
            if(posX > 0){
                let diffWidth= posX
                if(diffWidth >= maxRectWidth){
                    width= maxRectWidth
                }else{
                    width= abs(posX)
                }
                posX -= width
                totalWidth += width
                height= width/maxRectRatio
                let originRectCount= totalHeight/height,
                    rectCount= floor(originRectCount)
                const normalHandler=(averangeNum=0)=>{
                    let originPosY= posY
                    if(rectCount > 1){
                        averangeNum= averangeNum/(rectCount-1)
                    }
                    for(let i=0; i<rectCount; i++){
                        posY= originPosY - ( i + 1 )*height - i*averangeNum
                        let tempRectInfo={
                            x: posX,
                            y: posY,
                            width: width,
                            height: height,
                            style: '#aaa'
                        }
                        area += width*height
                        localRender(tempRectInfo)
                    }
                }
                if(originRectCount === rectCount){
                    normalHandler()
                }else{
                    let lastHeight= totalHeight - height*rectCount,
                        lastWidth= lastHeight*maxRectRatio,
                        originWidth= width,
                        originPosX= posX,
                        originPosY= posY
                    if(needAll || rectCount === 1){
                        normalHandler()
                        width= lastWidth
                        height= lastHeight
                        posX= posX + (originWidth - lastWidth)
                        posY -= lastHeight
                        let tempRectInfo={
                            x: posX,
                            y: posY,
                            width: width,
                            height: height,
                            style: '#aaa'
                        }
                        if(rectCount != 1){
                            localRender(tempRectInfo)
                        }
                        posX= originPosX
                        width= originWidth
                    } else{
                        normalHandler(lastHeight)
                    }
                }
                area += height*width
                rectTopHandler(posX, posY)
            } else {
                posY -= totalHeight
                rectTopHandler(posX, posY)
            }
        }
        function rectBottomHandler(posX, posY){
            if(count++ > 100)return
            if(rows - posY > 0){
                let diffHeight= rows - posY
                if(diffHeight >= maxRectHeight){
                    height= maxRectHeight
                } else {
                    height= abs(diffHeight)
                }
                totalHeight += height
                width= height*maxRectRatio
                let originRectCount= totalWidth / width,
                    rectCount= floor(originRectCount)
                const normalHandler=(averangeNum=0)=>{
                    let originPosX = posX
                    if(rectCount > 1){
                        averangeNum= averangeNum/(rectCount-1)
                    }
                    for(let i=0;i<rectCount;i++){
                        posX= originPosX - (i+1)*width - i*averangeNum
                        let tempRectInfo={
                            x: posX,
                            y: posY,
                            width: width,
                            height: height,
                            style: 'blue'
                        }
                        area += width*height
                        localRender(tempRectInfo)
                    }
                }
                if(originRectCount === rectCount){
                    normalHandler()
                }else{
                    let lastWidth= totalWidth - width*rectCount,
                        lastHeight= lastWidth/maxRectRatio,
                        originHeight= height
                    if(needAll || rectCount === 1){
                        normalHandler()
                        posX -= lastWidth
                        width = lastWidth
                        height= lastHeight
                        let tempRectInfo={
                            x: posX,
                            y: posY,
                            width: width,
                            height: height,
                            style: 'blue'
                        }
                        height= originHeight
                        if(rectCount != 1){
                            localRender(tempRectInfo)
                        }
                    } else {
                        normalHandler(lastWidth)
                    }
                    area += width *originHeight
                }
                posY += height
                rectLeftHandler(posX, posY)
            }else{
                posX -= totalWidth
                rectLeftHandler(posX, posY)
            }
        }
        function rectRightHandler( posX, posY){
            if(count++ > 100)return
            if(cols - posX > 0){
                let diffWidth= cols - posX
                if(diffWidth >= maxRectWidth){
                    // 可以容纳一个大rect
                    width= maxRectWidth
                } else {
                    width= abs(diffWidth)
                }
                height= width/maxRectRatio
                totalWidth += width
                let originRectCount= totalHeight / height,
                    rectCount= floor(originRectCount)
                const normalHandler=(averangeNum=0)=>{
                    let originPosY = posY
                    if(rectCount > 1){
                        averangeNum= averangeNum/(rectCount-1)
                    }
                    for(let i=0;i<rectCount;i++){
                        posY= originPosY + i*height + i*averangeNum
                        let tempRectInfo={
                            x: posX,
                            y: posY,
                            width: width,
                            height: height,
                            style: 'yellow'
                        }
                        area += width*height
                        localRender(tempRectInfo)
                    }
                }
                if(originRectCount === rectCount){
                    normalHandler()
                }else{
                    let lastHeight= totalHeight - height*rectCount,
                        lastWidth= lastHeight * maxRectRatio,
                        originWidth= width
                    if(needAll || rectCount === 1){
                        normalHandler()
                        posY += height
                        width= lastWidth
                        height= lastHeight
                        let tempRectInfo={
                            x: posX,
                            y: posY,
                            width: width,
                            height: height,
                            style: 'yellow'
                        }
                        width= originWidth
                        if(rectCount != 1){
                            localRender(tempRectInfo)
                        }
                    }else{
                        normalHandler(lastHeight)
                    }
                    area += height*width
                }
                posX += width
                posY += height
                rectBottomHandler(posX, posY)
            } else{
                // 处理底部的空间
                posY += totalHeight
                rectBottomHandler(posX, posY)
            }
        }
        function rectTopHandler(posX, posY){
            console.log('rectTopHandler area:'+ area, 'maxArea: '+maxArea);

            if(count++ > 100)return
            if(area >= maxArea)return

            if(posY > 0){
                // 说明上部 还有位置
                if(posY >= maxRectHeight){
                    height= maxRectHeight
                }else{
                    height= abs(posY)
                }
                width= height*maxRectRatio
                posY -= height
                totalHeight += height
                let originRectCount= totalWidth/width,
                    rectCount= floor(originRectCount)
                const normalHandler=(averangeNum=0)=>{
                    let originPosX= posX
                    if(rectCount > 1){
                        averangeNum= averangeNum/(rectCount-1)
                    }
                    for(let i=0; i< rectCount; i++){
                        posX= originPosX + i*width + i*averangeNum
                        let tempRectInfo={
                            x: posX,
                            y: posY,
                            width: width,
                            height: height,
                            style: 'green'
                        }
                        localRender(tempRectInfo)
                        area += height*width
                    }
                }
                if(originRectCount === rectCount){
                    normalHandler()
                }else{
                    let lastWidth= totalWidth - rectCount*width,
                        lastHeight= lastWidth/maxRectRatio,
                        originHeight= height,
                        originPosY= posY
                    if(needAll || rectCount === 1){
                        normalHandler()
                        posX += width
                        posY = originHeight - lastHeight
                        width= lastWidth
                        height= lastHeight
                        let tempRectInfo= {
                            x: posX,
                            y: posY,
                            width: width,
                            height: height,
                            style: 'green'
                        }
                        height= originHeight
                        posY= originPosY
                        if(rectCount != 1){
                            localRender(tempRectInfo)
                        }
                    } else {
                        normalHandler(lastWidth)
                    }
                    area += height*lastWidth
                }
                posX += width
                rectRightHandler(posX, posY)
            } else {
                posX += totalWidth
                rectRightHandler(posX, posY)
            }
        }
        function fill(){
            if(count > 5000)return
            if( count++ == 0){
                posX= maxRectPosX
                posY= maxRectPosY
                width= maxRectWidth
                height= maxRectHeight
                area += width*height
                totalWidth= maxRectWidth
                totalHeight= maxRectHeight
                fill()
            }else{
                // 从上开始
                rectTopHandler(posX, posY)
                // console.log('allGemtries', JSON.stringify(allGemtries));

            }
        }
    }


    const draw=()=>{
        if(step>10){
            step = Math.random()*5 + 5
        }
        var rows= ceil(step),
            cols= rows
        grid(rows, cols, canvasWidth, canvasHeight, 0, 0)
        step += 0.3
        return allGemtries
    }

    function update(){
        return draw()
    }

    // window.onload=function(){
    //   if(!canvasWidth || !canvasHeight){
    //     init()
    //   }
    // }
    // if(!canvasWidth || !canvasHeight){
    //   init()
    // }
    return draw()
}
// console.log(rectRender());

export default {
    generate: rectRender
}