package utme.views.main.stage3d.helpers.AutoLayout
{
	public class perticleObject
	{
		public function perticleObject(layoutObject:LayoutObject,_index:int){
			_lo=layoutObject;
			index=_index;
		}
		private  var _lo:LayoutObject;
		public var _scale:Number=0;
		public var _angle:Number=0;
		public var _x:Number=0;
		public var _y:Number=0;
		
		public function updateLayoutObject(layoutObject:LayoutObject):void{
			_lo=layoutObject;
		}
		
		public var willDelete:Boolean=false;
		public var toX:Number=512;
		public var toY:Number=512;
		public var toScale:Number=1;
		public var toAngle:Number=0;
		
		private var accX:Number=0;
		private var accY:Number=0;
		private var accScale:Number=0;
		private var accAngle:Number=0;
		
		public var dumpingForce:Number=0.98;
		
		public var index:int;
		private var springiness:Number=0.2;
		
		public function draw():void{
			/*
			updateSpringMotion();
			
			_x+=accX;
			_y+=accY;
			_scale+=accScale;
			_angle+=accAngle;
			
			accX*=dumpingForce;
			accY*=dumpingForce;
			accScale*=dumpingForce
			accAngle*=dumpingForce
				*/	
			
			var df:Number=(1-dumpingForce)*0.6+0.3;
//			if(df<0.2)df=0.2;
//			if(df>0.8)df=0.8;
			
			_x+=(toX-_x)*df;	
			_y+=(toY-_y)*df;		
			_angle+=(toAngle-_angle)*df;		
			_scale+=(toScale-_scale)*df;	
				
			
			_lo.x=_x;
			_lo.y=_y;
			_lo.angle=_angle;
			_lo.scale=_scale;
			_lo.draw();
		}
		
		public function width():Number{
			return _lo.width*toScale;
		}
		
		public function height():Number{
			return _lo.height*toScale;
		}
		
		public function setPositon(ax:Number,ay:Number,ascale:Number,aangle:Number):void{
			_x=toX=ax;
			_y=toY=ay;
			_scale=toScale=ascale;
			_angle=toAngle=aangle;	
		}	
		
		public function setPositonWithAnimate(ax:Number,ay:Number,ascale:Number,aangle:Number):void{
			toX=ax;
			toY=ay;
			toScale=ascale;
			toAngle=aangle;	
		}
		
		public function updateSpringMotion():void{
			
			var vecX:Number=_x-toX;
			var vecY:Number=_y-toY;
			var theirDistance:Number =Math.sqrt(vecX*vecX+vecY*vecY);
			var springForce:Number = springiness * ( - theirDistance);
			vecX = vecX/theirDistance  * springForce;
			vecY = vecY/theirDistance  * springForce;
			
			accX+=vecX||0;
			accY+=vecY||0;

			accScale+= springiness * ( - (_scale-toScale));
			accAngle+= springiness * ( - (_angle-toAngle));
						
		}
	}
}



/*
 * 
package utme.views.stage3d.AutoLayout
{
public class perticleObject
{
public function perticleObject(layoutObject:LayoutObject,_index:int){
_lo=layoutObject;
index=_index;
}
private  var _lo:LayoutObject;
public var _scale:Number=0;
public var _angle:Number=0;
public var _x:Number=0;
public var _y:Number=0;

public function updateLayoutObject(layoutObject:LayoutObject):void{
_lo=layoutObject;
}

public var willDelete:Boolean=false;
public var toX:Number=512;
public var toY:Number=512;
public var toScale:Number=1;
public var toAngle:Number=0;

private var accX:Number=0;
private var accY:Number=0;
private var accScale:Number=0;
private var accAngle:Number=0;

public var dumpingForce:Number=0.98;

public var index:int;
private var springiness:Number=0.2;

public function draw():void{
updateSpringMotion();

_x+=accX;
_y+=accY;
_scale+=accScale;
_angle+=accAngle;

accX*=dumpingForce;
accY*=dumpingForce;
accScale*=dumpingForce
accAngle*=dumpingForce


_lo.x=_x;
_lo.y=_y;
_lo.angle=_angle;
_lo.scale=_scale;
_lo.draw();
}

public function width():Number{
return _lo.width*toScale;
}

public function height():Number{
return _lo.height*toScale;
}

public function setPositon(ax:Number,ay:Number,ascale:Number,aangle:Number):void{
_x=toX=ax;
_y=toY=ay;
_scale=toScale=ascale;
_angle=toAngle=aangle;	
}	

public function setPositonWithAnimate(ax:Number,ay:Number,ascale:Number,aangle:Number):void{
toX=ax;
toY=ay;
toScale=ascale;
toAngle=aangle;	
}

public function updateSpringMotion():void{

var vecX:Number=_x-toX;
var vecY:Number=_y-toY;
var theirDistance:Number =Math.sqrt(vecX*vecX+vecY*vecY);
var springForce:Number = springiness * ( - theirDistance);
vecX = vecX/theirDistance  * springForce;
vecY = vecY/theirDistance  * springForce;

accX+=vecX||0;
accY+=vecY||0;

accScale+= springiness * ( - (_scale-toScale));
accAngle+= springiness * ( - (_angle-toAngle));


}
}
}
*/
