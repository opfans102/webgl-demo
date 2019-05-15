import React from "react"

import './draw.css';
import imgIcon from './images/template.jpeg'

import draw2 from './auto-layout/algorithm-2/draw'

export default class Layout extends React.Component {
    constructor() {
        super();
        this.state = {
            srcType: 'square',
            currentTab: 'algorithm3',
            weakMode: false,
            tabs: [
                {
                    code: 'algorithm1',
                    name: "算法1",
                    selected: false
                },
                {
                    code: 'algorithm2',
                    name: "算法2",
                    selected: false
                },
                {
                    code: 'algorithm3',
                    name: "算法3",
                    selected: true
                }
            ]
        }
        this.canvasWidth = 300;
        this.canvasHeight = 400;
        this.canvas = null;
        this.text = 'hand';
        this.imgArray = [];
    }

    canvasRef = (canvas) => {
        if (canvas) {
            this.canvas = canvas;
            this.width = canvas.width;
            this.height = canvas.height;
        }
    };

    componentDidMount() {
        this.resetAlgorithm3(this.state.srcType);
    };

    loadImg(type) {
        let img = new Image();
        img.src = imgIcon;
        img.onload = () => {
            console.log('loadImg img.width ' + img.width);
            console.log('loadImg img.height ' + img.height);
            let width = img.width, height = img.height;
            if(type === 'square'){
                height = width;
            }else{
                height = width/5;
            }
            this.imgArray.push({
                image: img,
                width: width,
                height: height
            })
        }
    };

    changeAlgorithm(tab) {
    };

    draw(){
        draw2.draw();
    }

    reset() {
        this.resetAlgorithm3('square');
    };

    changePic(type) {
        this.setState({srcType: type});
        this.resetAlgorithm3(type)
    };

    resetAlgorithm3(type) {
        this.imgArray = [];
        this.loadImg(type);
        let ctx = this.canvas.getContext('2d');
        setTimeout(()=>{
            let ctx = this.canvas.getContext('2d');
            draw2.init(ctx,this.imgArray,this.state.weakMode,300,300,0.95);
        },200)
    };

    render() {
        const tabs = this.state.tabs, weakMode = this.state.weakMode;
        return (
            <div>
                <div>多张图一起布局和字体布局还在调试中</div>
                <div className="tabs">
                    {
                        tabs.map(data =>
                            (<div className={`tab ${ data.selected ? 'selected' : ''}`}
                                  onClick={() => {
                                      this.changeAlgorithm(data)
                                  }}>{data.name}</div>)
                        )
                    }
                </div>

                <div className="buttons">
                    <div className="auto-layout-button primary"
                         onClick={() => {
                             this.draw();
                         }}>变换
                    </div>
                    <div className="auto-layout-button"
                         onClick={() => {
                             this.reset();
                         }}>重置
                    </div>
                </div>

                <canvas className='auto-layout' ref={this.canvasRef} width={this.canvasWidth}
                        height={this.canvasHeight}/>

                <div className="buttons">
                    <div className="auto-layout-button primary"
                         onClick={() => {
                             this.changePic('square');
                         }}>等边图片
                    </div>
                    <div className="auto-layout-button primary"
                         onClick={() => {
                             this.changePic('react');
                         }}>不等边图片
                    </div>
                    <div className="auto-layout-button primary"
                         onClick={() => {
                             this.changePic('text');
                         }}>文字
                    </div>
                    <div className="auto-layout-button"
                         onClick={() => {
                             this.setState({weakMode: !this.state.weakMode});
                             this.reset();
                         }}>{weakMode ? ('随机：弱化模式') : ('随机性：强化处理')}
                    </div>

                    <div className="auto-layout-button">摇动幅度参数： 0.98
                    </div>
                </div>
            </div>
        )
    }
}






