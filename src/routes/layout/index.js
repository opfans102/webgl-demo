import React, {useContext, useEffect, useRef} from 'react';
import CanvasContext from '../../context/CanvasContext';
import './draw.css';
import imgIcon from './images/template.jpeg'
import drawHandler from './draw.js'
import layoutPericleGenelator from './auto-layout/layout-pericle-genelator';
import layoutPericleGenelator2 from './auto-layout/layout-pericle-genelator2';
import layoutPericleGenelator3 from './auto-layout/layout-pericle-genelator3';

export default function Layout() {
    const canvasRef = useRef();
    const {width, height} = useContext(CanvasContext);


    useEffect(() => {
        layoutPericleGenelator2.init();
        //start();
        test();
    }, [canvasRef, width, height]);

    function algorithm1() {
        const {current} = canvasRef;
        if (current) {
            let ctx = current.getContext('2d');
            ctx.clearRect(0, 0, 600, 600);
            console.log(ctx);
            let img = new Image();
            img.src = imgIcon;
            img.onload = function () {
                layoutPericleGenelator.init();
                drawHandler.init(ctx, [img]);
            }
        }
    }

    function algorithm2() {
        const {current} = canvasRef;
        if (current) {
            let ctx = current.getContext('2d');
            ctx.clearRect(0, 0, 600, 600);
            console.log(ctx);
            let img = new Image();
            img.src = imgIcon;
            img.onload = function () {
                drawHandler.init(ctx, [img]);
                drawHandler.drawluqaing();
            }
        }
    }

    function test() {
        const {current} = canvasRef;
        if (current) {
            let ctx = current.getContext('2d');
            ctx.clearRect(0, 0, 600, 600);
            let img = new Image();
            img.src = imgIcon;
            img.onload = function () {

                let res = layoutPericleGenelator2.generateLayout();
                res.forEach(data=>{
                    ctx.save();
                    ctx.rotate(data._angle);
                    let moveToX = 0;
                    let moveToY = 0;

                    if(data._angle > 0){
                        let p = 400 * data._angle /  Math.PI ;
                        moveToX = p - 10;
                        moveToY = -p;
                    }else if(data._angle < 0){
                        let p = 0 - 400 * data._angle /  Math.PI ;
                        moveToX = 0 - p - 30;
                        moveToY = p + 40
                    }
                    ctx.drawImage(img, data.toX + moveToX, data.toY + moveToY, 50 * data.toScale, 50 * data.toScale);
                    ctx.restore()
                })
            }
        }
    }

    function change() {
        drawHandler.draw();
    }

    function reset1() {
        algorithm1();
        layoutPericleGenelator.init();
    }

    function reset2() {
        algorithm2();
        layoutPericleGenelator.init();
    }

    return (
        <div>
            <div className="buttons">
                <div className="auto-layout-button primary" onClick={() => {
                    change()
                }}>算法1
                </div>
                <div className="auto-layout-button primary" onClick={() => {
                    algorithm2()
                }}>算法2
                </div>
                <div className="auto-layout-button primary" onClick={() => {
                    test()
                }}>算法3test
                </div>
                <div className="auto-layout-button" onClick={() => {
                    reset1();
                }}>重置算法1
                </div>
                <div className="auto-layout-button" onClick={() => {
                    reset1();
                }}>重置算法2
                </div>
            </div>
            <canvas className='auto-layout' ref={canvasRef} width={width} height={height}/>

            <div className="buttons">
                <div className="auto-layout-button primary" onClick={() => {
                    //change()
                }}>设置等边图片
                </div>
                <div className="auto-layout-button primary" onClick={() => {
                    //change()
                }}>设置不等边图片
                </div>
                <div className="auto-layout-button primary" onClick={() => {
                    //change()
                }}>设置文字
                </div>
            </div>
        </div>
    );
}
