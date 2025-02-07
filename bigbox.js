/******************************************************
//
// "3D Big Box" by Benjamin Wimmer (V1.0)
//
// More details and latest version available at 
// https://bigboxcollection.com/#3DBB
//
******************************************************/

var camera, scene, renderer, group;
var mesh;
var textureFile;
var gatefold1;
var gatefold1Container;
var gatefold2;
var gatefold2Container;
var gatefold2;
var gatefold2Container;
var clickme;
var targetCRotation=0;
var targetRotation = 1.2;
var targetRotationY = 0;
var targetRotationOnMouseDown = 0;
var targetRotationYOnMouseDown = 0;
var targetPanning = 0;
var targetPanningY = 0;
var targetPanningOnMouseDown = 0;
var targetPanningYOnMouseDown = 0;
var maxPanningX=0;
var minPanningX=0;
var maxPanningY=0;
var minPanningY=0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var mouseY = 0;
var mouseYOnMouseDown = 0;
var mouseYOnMouseThreshold = 0;
var zoomMin=0.6;
var zoomMax=5;
var zooming=0;
var zoomLevel=1;
var zoomable=0;
var fullscreen=1;
var windowHalfX = window.innerWidth / 3;
var windowHalfY = window.innerHeight / 3;
var byId = function( id ) { return document.getElementById( id ); };
var ratio=1;
var webp="/webp";
var webGL=false;
var touchZoomDistanceStart=0;
var touchZoomDistanceEnd=0;
var touchPanStart1=0;
var touchPanStartY1=0;
var touchPanStart2=0;
var touchPanStartY2=0;
var PixelRatio = window.devicePixelRatio;
var clickTimer = null;
var BoxFadeIn=0;
var mousebutton=0;
var light=new THREE.HemisphereLight( 0xffffff, 0xccccbb, 1 );
var topbottom;
var hasgatefold;
var gatefoldShown=0;
var gatefold1pos=0;
var gatefold2pos=0;
var gatefold3pos=0;
var groupPosX=0;
var groupPosY=0;
var gatefolddirection;
var boxwidth;
var boxheight;
var boxdepth;
var gatefolddepth=1;
var autorotate=1;
var photoshoot=0;
var overscroll=0;


if(init()){
	animate();
	window.addEventListener( 'resize', onWindowResize, false );
	byId('boxcontrols').addEventListener("mousedown", onDocumentMouseDown, false);
	byId('boxcontrols').addEventListener("touchstart", onDocumentTouchStart, {passive: false} );	
	byId('boxcontrols').addEventListener("wheel", onMouseWheel, false);
	byId('boxcontrols').addEventListener("dblclick", onDoubleClick, false);
	byId('boxcontrols').addEventListener('keyup', keyboardNavigation, {passive: true} );
}

function getQueryVariable(variable){
	var query = window.location.search.substring(1);
    var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
	var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}
function init() {
	if( window.parent.document.body.classList.contains("photoshoot") ){
		autorotate=0;
		photoshoot=1;
		byId('box').style.filter="drop-shadow(2px 0px 0px #000) drop-shadow(-2px 0px 0px #000) drop-shadow(0px -2px 0px #000) drop-shadow(0px 2px 0px #000) drop-shadow(4px 0px 0px #ff0) drop-shadow(-4px 0px 0px #ff0) drop-shadow(0px -4px 0px #ff0) drop-shadow(0px 4px 0px #ff0) drop-shadow(0 50px 30px black)";
	}
	var ratio=200/boxheight;
	boxwidth*=ratio;
	boxheight*=ratio;
	boxdepth*=ratio;
	
	if(textureFile=="Diablo2LSE"){
		gatefolddepth=4;
	} else if(textureFile=="IndoorSports"){
		gatefolddepth=boxdepth*0.5;
	}
	if(hasgatefold){
		boxdepth-=gatefolddepth;
	}
	
	maxPanningX=0-boxwidth/2.2;
	minPanningX=boxwidth/2.2;
	maxPanningY=0-boxheight/2.2;
	minPanningY=boxheight/2.2;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;
	camera.position.y = 0;
	camera.position.x = 0;	
	camera.zoom=1;
	
	renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true, alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
    byId('box').insertBefore(renderer.domElement, byId('box').childNodes[0]);
	window.addEventListener( 'resize', onWindowResize, false );

	if(window.innerWidth/window.innerHeight<0.7)
		camera.zoom=0.5;
	/*
	var ambientLight = new THREE.AmbientLight(0xffffff,0.8);
	scene.add(ambientLight);
	const light = new THREE.PointLight(0xffffff, 0.02)
	light.position.set(-300, 105, boxwidth*4)
	scene.add(light)
	*/
	light = new THREE.HemisphereLight( 0xffffff, 0xccccbb, 1 );
	scene.add( light );
	
	var directionalLight = new THREE.DirectionalLight(0xffffee,0.04);
	directionalLight.position.set(boxwidth*2,boxheight/10,800);
	scene.add(directionalLight);

	var directionalLight2 = new THREE.DirectionalLight(0xffffee,0.05);
	directionalLight2.position.set(0,boxheight,400);
	scene.add(directionalLight2);

	var directionalLight3 = new THREE.DirectionalLight(0xffffee,0.02);
	directionalLight3.position.set(-boxwidth*1,-boxheight,800);
	scene.add(directionalLight3);
	
	
	if(true){
		//var ratio=1;
			
		if(textureFile=="OmikronUS" || textureFile=="RevenantUS"){
			var shape = new THREE.Shape();
			shape.moveTo( 0,0 );
			shape.lineTo( (255), 0 );
			shape.lineTo( (192), (255));
			shape.lineTo( (63), (255) );
			shape.lineTo( 0, 0 );			
			var extrudeSettings = { amount: (46), bevelEnabled: false, steps: 1 };
			geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		}
		else if(textureFile=="PrinceOfPersia"){
			var shape = new THREE.Shape();
			shape.moveTo( 0,0 );
			shape.lineTo( 34, 65 );
			shape.lineTo( 0, 255 );
			shape.lineTo( 225, 255 );
			shape.lineTo( 191, 65 );
			shape.lineTo( 225, 0 );	
			shape.lineTo( 0, 0 );
			var extrudeSettings = { amount: 40, bevelEnabled: false, steps: 1 };
			geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		}
		else if(textureFile=="PrinceOfPersia2"){
			var shape = new THREE.Shape();
			shape.moveTo( 0,0 );
			shape.lineTo( 34, 190 );
			shape.lineTo( 0, 255 );
			shape.lineTo( 225, 255 );
			shape.lineTo( 191, 190 );
			shape.lineTo( 225, 0 );	
			shape.lineTo( 0, 0 );
			var extrudeSettings = { amount: 40, bevelEnabled: false, steps: 1 };
			geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		}
		else{
			geometry = new THREE.CubeGeometry( (boxwidth), (boxheight), (boxdepth)); 
		}
	} else{
		if(textureFile=="OmikronUS" || textureFile=="RevenantUS"){
			var shape = new THREE.Shape();
			shape.moveTo( 0,0 );
			shape.lineTo( 255, 0 );
			shape.lineTo( 205, 255 );
			shape.lineTo( 50, 255 );
			shape.lineTo( 0, 0 );			
			var extrudeSettings = { amount: 46, bevelEnabled: false, steps: 1 };
			geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		}
		else if(textureFile=="PrinceOfPersia"){
			var shape = new THREE.Shape();
			shape.moveTo( 0,0 );
			shape.lineTo( 34, 65 );
			shape.lineTo( 0, 255 );
			shape.lineTo( 225, 255 );
			shape.lineTo( 191, 65 );
			shape.lineTo( 225, 0 );	
			shape.lineTo( 0, 0 );
			var extrudeSettings = { amount: 40, bevelEnabled: false, steps: 1 };
			geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		}
		else if(textureFile=="PrinceOfPersia2"){
			var shape = new THREE.Shape();
			shape.moveTo( 0,0 );
			shape.lineTo( 34, 190 );
			shape.lineTo( 0, 255 );
			shape.lineTo( 225, 255 );
			shape.lineTo( 191, 190 );
			shape.lineTo( 225, 0 );	
			shape.lineTo( 0, 0 );
			var extrudeSettings = { amount: 40, bevelEnabled: false, steps: 1 };
			geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
		}
		else
			geometry = new THREE.CubeGeometry( boxwidth, boxheight, boxdepth); 
	}
	BoxFadeIn=0;
    const loader = new THREE.TextureLoader();
	var materials;
	var material;
	var fronttex="textures/front";
	var frontspec="specularmaps/front";
	if(hasgatefold>0){
		fronttex="gatefold/frontright";
		frontspec="gatefoldspecmaps/frontright";
	}
	var maxAnisotropy = renderer.getMaxAnisotropy();
	if(textureFile=="PrinceOfPersia" || textureFile=="PrinceOfPersia2" || textureFile=="OmikronUS" || textureFile=="RevenantUS"){	
		var texture = new THREE.TextureLoader().load('/images/textures/special/'+textureFile+'.webp', function(){});
		//material = new THREE.MeshBasicMaterial( { map: texture,transparent: true} );
		material = new THREE.MeshPhongMaterial( { map: texture,transparent: true,
			specularMap: loader.load('/images/specularmaps/right/'+specularMapFile+'.webp'),
			specular: new THREE.Color(0x333330),
			shininess:Math.max(boxwidth,boxheight)*3,} );	
			texture.minFilter = THREE.LinearMipmapNearestFilter;
			texture.magFilter = THREE.LinearFilter ;
			texture.anisotropy = (maxAnisotropy);
	} else if(topbottom==1){
		materials = [		
			new THREE.MeshPhongMaterial( {//right side
				map: loader.load('/images/textures/right/'+textureFile+'.webp', function(texture){ 		
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/specularmaps/right/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*3,
				transparent:true, 
				side:THREE.DoubleSide
			}), 
			new THREE.MeshPhongMaterial({ //left side
				map: loader.load('/images/textures/left/'+textureFile+'.webp', function(texture){ 			
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/specularmaps/left/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true, 
				side:THREE.DoubleSide
			}),
			new THREE.MeshPhongMaterial({ //top side
				map: loader.load('/images/textures/top/'+textureFile+'.webp', function(texture){ 		
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/specularmaps/top/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true, 
				side:THREE.DoubleSide
			}), 
			new THREE.MeshPhongMaterial({ //bottom side
				map: loader.load('/images/textures/bottom/'+textureFile+'.webp', function(texture){ 	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/specularmaps/bottom/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true, 
				side:THREE.DoubleSide
			}), 
			new THREE.MeshPhongMaterial({ //front side
				map: loader.load('/images/'+fronttex+'/'+textureFile+'.webp', function(texture){ 		
					texture.minFilter = THREE.LinearMipmapNearestFilter ;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/'+frontspec+'/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide,
			}), 
			new THREE.MeshPhongMaterial({ //back side
				map: loader.load('/images/textures/back/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/specularmaps/back/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide}), 
		];
	} else {
		materials = [		
			new THREE.MeshPhongMaterial( {//right side
				map: loader.load('/images/textures/right/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/specularmaps/right/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*3,
				transparent:true, 
				side:THREE.DoubleSide
			}), 
			new THREE.MeshPhongMaterial({ //left side
				map: loader.load('/images/textures/left/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/specularmaps/left/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true, 
				side:THREE.DoubleSide
			}),
			new THREE.MeshPhongMaterial({ //top side
				transparent:true, 
				side:THREE.DoubleSide
			}), 
			new THREE.MeshPhongMaterial({ //bottom side
				transparent:true, 
				side:THREE.DoubleSide
			}), 
			new THREE.MeshPhongMaterial({ //front side
				map: loader.load('/images/'+fronttex+'/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/'+frontspec+'/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide,
			}), 
			new THREE.MeshPhongMaterial({ //back side
				map: loader.load('/images/textures/back/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				}), 
				specularMap: loader.load('/images/specularmaps/back/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide}), 
		];
	}
	
	var front;
	var back;
	var right;
	var left;
	var top;
	var bottom;
	var front2;
	var back2;
	var right2;	
	var left2;

	top = [new THREE.Vector2(.9, 1), new THREE.Vector2(.9, 0), new THREE.Vector2(.8, 0), new THREE.Vector2(.8, 1)];
	bottom = [new THREE.Vector2(1, 1), new THREE.Vector2(1, 0), new THREE.Vector2(.9, 0), new THREE.Vector2(.9, 1)];

	if(textureFile=="SkyrimCE" || textureFile=="STVEliteForceCE"){
		front = [new THREE.Vector2(0, 0), new THREE.Vector2(.25, 0), new THREE.Vector2(.25, 1), new THREE.Vector2(0, 1)];
		back = [new THREE.Vector2(.25, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, 1), new THREE.Vector2(.25, 1)];
		
		right = [new THREE.Vector2(1, 1), new THREE.Vector2(.75, 1), new THREE.Vector2(.75, 0), new THREE.Vector2(1, 0)];
		left = [new THREE.Vector2(.75, 1), new THREE.Vector2(.5, 1), new THREE.Vector2(.5, 0), new THREE.Vector2(.75, 0)];
	}
	else if(textureFile=="OmikronUS" || textureFile=="RevenantUS"){
		/*
		front = [new THREE.Vector2(0, 0), new THREE.Vector2(.4, 0), new THREE.Vector2(.3, 1), new THREE.Vector2(.1, 1)];
		back = [new THREE.Vector2(.4, 0), new THREE.Vector2(.8, 0), new THREE.Vector2(.7, 1), new THREE.Vector2(.5, 1)];
		
		right = [new THREE.Vector2(.9, 0), new THREE.Vector2(.9, 1), new THREE.Vector2(.8, 1), new THREE.Vector2(.8, 0)];
		left = [new THREE.Vector2(.9, 1), new THREE.Vector2(.9, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)];
		*/
		front = [new THREE.Vector2(0, 0), new THREE.Vector2(.4, 0), new THREE.Vector2(.3, 1), new THREE.Vector2(.1, 1)];
		back = [new THREE.Vector2(.4, 0), new THREE.Vector2(.8, 0), new THREE.Vector2(.7, 1), new THREE.Vector2(.5, 1)];
		
		right = [new THREE.Vector2(.85, 0), new THREE.Vector2(.85, 1), new THREE.Vector2(.8, 1), new THREE.Vector2(.8, 0)];
		left = [new THREE.Vector2(.85, 1), new THREE.Vector2(.85, 0), new THREE.Vector2(.9, 0), new THREE.Vector2(.9, 1)];

		top = [new THREE.Vector2(.95, 0), new THREE.Vector2(.95, 1), new THREE.Vector2(.9, 1), new THREE.Vector2(.9, 0)];
		top = [new THREE.Vector2(.95, 0), new THREE.Vector2(.95, 1), new THREE.Vector2(.9, 1), new THREE.Vector2(.9, 0)];
		bottom = [new THREE.Vector2(.95, 1), new THREE.Vector2(.95, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1)];
	}
	else if(textureFile=="PrinceOfPersia"){
		front = [new THREE.Vector2(0.06, 0.2), new THREE.Vector2(.34, 0.2), new THREE.Vector2(.4, 1), new THREE.Vector2(0, 1)];
		back = [new THREE.Vector2(.46, 0.2), new THREE.Vector2(.74, 0.2), new THREE.Vector2(.8, 1), new THREE.Vector2(.4, 1)];	
		front2 = [new THREE.Vector2(0, 0), new THREE.Vector2(.4, 0), new THREE.Vector2(.34, 0.2), new THREE.Vector2(0.06, 0.2)];
		back2 = [new THREE.Vector2(.4, 0), new THREE.Vector2(.8, 0), new THREE.Vector2(.74, 0.2), new THREE.Vector2(.46, 0.2)];		
		left = [new THREE.Vector2(.9, 0.2), new THREE.Vector2(.9, 1), new THREE.Vector2(.8, 1), new THREE.Vector2(.8, 0.2)];
		right = [new THREE.Vector2(1, 0.2), new THREE.Vector2(1, 1), new THREE.Vector2(0.9, 1), new THREE.Vector2(0.9, 0.2)];		
		left2 = [new THREE.Vector2(.9, 0), new THREE.Vector2(.9, 0.2), new THREE.Vector2(.8, 0.2), new THREE.Vector2(.8, 0)];
		right2 = [new THREE.Vector2(1, 0), new THREE.Vector2(1, 0.2), new THREE.Vector2(0.9, 0.2), new THREE.Vector2(0.9, 0)];
	}
	else if(textureFile=="PrinceOfPersia2"){
		front2 = [new THREE.Vector2(0, 0.2), new THREE.Vector2(.4, 0.2), new THREE.Vector2(.34, 1), new THREE.Vector2(0.06, 1)];
		back2 = [new THREE.Vector2(.4, 0.2), new THREE.Vector2(.8, 0.2), new THREE.Vector2(.74, 1), new THREE.Vector2(.46, 1)];	
		front = [new THREE.Vector2(0.06, 0), new THREE.Vector2(.34, 0), new THREE.Vector2(.4, 0.2), new THREE.Vector2(0, 0.2)];
		back = [new THREE.Vector2(.46, 0), new THREE.Vector2(.74, 0), new THREE.Vector2(.8, 0.2), new THREE.Vector2(.4, 0.2)];		
		left2 = [new THREE.Vector2(.9, 0.2), new THREE.Vector2(.9, 1), new THREE.Vector2(.8, 1), new THREE.Vector2(.8, 0.2)];
		right2 = [new THREE.Vector2(1, 0.2), new THREE.Vector2(1, 1), new THREE.Vector2(0.9, 1), new THREE.Vector2(0.9, 0.2)];		
		left = [new THREE.Vector2(.9, 0), new THREE.Vector2(.9, 0.2), new THREE.Vector2(.8, 0.2), new THREE.Vector2(.8, 0)];
		right = [new THREE.Vector2(1, 0), new THREE.Vector2(1, 0.2), new THREE.Vector2(0.9, 0.2), new THREE.Vector2(0.9, 0)];
	}
	else{
		front = [new THREE.Vector2(0, 0), new THREE.Vector2(.4, 0), new THREE.Vector2(.4, 1), new THREE.Vector2(0, 1)];
		back = [new THREE.Vector2(.4, 0), new THREE.Vector2(.8, 0), new THREE.Vector2(.8, 1), new THREE.Vector2(.4, 1)];		
		right = [new THREE.Vector2(1, 1), new THREE.Vector2(.9, 1), new THREE.Vector2(.9, 0), new THREE.Vector2(1, 0)];
		left = [new THREE.Vector2(.9, 1), new THREE.Vector2(.8, 1), new THREE.Vector2(.8, 0), new THREE.Vector2(.9, 0)];
	}
	
	
	//geometry.faceVertexUvs[0] = [];
	
	if(textureFile=="OmikronUS" || textureFile=="RevenantUS"){
		geometry.faceVertexUvs[0][0] = [ back[3], back[0], back[1] ]; //back
		geometry.faceVertexUvs[0][1] = [ back[1], back[2], back[3] ]; //back
		geometry.faceVertexUvs[0][2] = [ front[0], front[1], front[2] ]; // front
		geometry.faceVertexUvs[0][3] = [ front[2], front[3], front[0] ]; // front		
		geometry.faceVertexUvs[0][4] = [ left[0], left[1], left[3] ]; // left side
		geometry.faceVertexUvs[0][5] = [ left[1], left[2], left[3] ]; // left side		
		geometry.faceVertexUvs[0][6] = [ top[0], top[1], top[3] ];
		geometry.faceVertexUvs[0][7] = [ top[1], top[2], top[3] ];
		geometry.faceVertexUvs[0][10] = [ bottom[0], bottom[1], bottom[3] ];
		geometry.faceVertexUvs[0][11] = [ bottom[1], bottom[2], bottom[3] ]; 
		geometry.faceVertexUvs[0][8] = [ right[0], right[1], right[3] ]; // right side
		geometry.faceVertexUvs[0][9] = [ right[1], right[2], right[3] ]; // right side
		THREE.GeometryUtils.center(geometry);		
    	mesh = new THREE.Mesh(geometry,  material);
		BoxFadeIn=6;
		fadeIn();
	}
	else if(textureFile=="PrinceOfPersia"){
		geometry.faceVertexUvs[0] = [];
		geometry.faceVertexUvs[0][0] = [ back2[3], back2[0], back2[1] ]; //back bottom bottom-left
		geometry.faceVertexUvs[0][1] = [ back[2], back[3], back[0] ]; //back top top-left
		geometry.faceVertexUvs[0][2] = [ back2[3], back2[1], back2[2] ]; // back bottom top-right
		geometry.faceVertexUvs[0][3] = [ back[1], back[2], back[0] ]; // back top bottom-right		
		geometry.faceVertexUvs[0][4] = [ front2[0], front2[1], front2[2] ]; // front bottom bottom-right
		geometry.faceVertexUvs[0][5] = [ front[1], front[2], front[3] ]; // front top top-right
		geometry.faceVertexUvs[0][6] = [ front2[3], front2[0], front2[2] ]; // front bottom top-left
		geometry.faceVertexUvs[0][7] = [ front[1], front[3], front[0] ]; // front top bottom-left		
		geometry.faceVertexUvs[0][8] = [ right2[2], right2[3], right2[1] ]; // right bottom bottom-right
		geometry.faceVertexUvs[0][9] = [ right2[3], right2[0], right2[1] ]; // right bottom top-left
		geometry.faceVertexUvs[0][10] = [ right[2], right[3], right[1] ]; // right top bottom-right
		geometry.faceVertexUvs[0][11] = [ right[3], right[0], right[1] ]; // right top top-left		
		geometry.faceVertexUvs[0][12] = [ right[0], right[0], right[0] ]; // nothing
		geometry.faceVertexUvs[0][13] = [ right[0], right[0], right[0] ]; // nothing		
		geometry.faceVertexUvs[0][14] = [ left[0], left[1], left[3] ]; // left top top-left
		geometry.faceVertexUvs[0][15] = [ left[1], left[2], left[3] ]; // left top bottom-right
		geometry.faceVertexUvs[0][16] = [ left2[0], left2[1], left2[3] ]; // left bottom top-left
		geometry.faceVertexUvs[0][17] = [ left2[1], left2[2], left2[3] ]; // left bottom bottom-right
		THREE.GeometryUtils.center(geometry);
    	mesh = new THREE.Mesh(geometry,  material);	
		BoxFadeIn=6;
		fadeIn();
	}
	else if(textureFile=="PrinceOfPersia2"){
		geometry.faceVertexUvs[0][0] = [ back2[3], back2[0], back2[1] ]; //back bottom bottom-left
		geometry.faceVertexUvs[0][1] = [ back[2], back[3], back[0] ]; //back top top-left
		geometry.faceVertexUvs[0][2] = [ back2[3], back2[1], back2[2] ]; // back bottom top-right
		geometry.faceVertexUvs[0][3] = [ back[1], back[2], back[0] ]; // back top bottom-right
		geometry.faceVertexUvs[0][4] = [ front2[0], front2[1], front2[2] ]; // front bottom bottom-right
		geometry.faceVertexUvs[0][5] = [ front[1], front[2], front[3] ]; // front top top-right
		geometry.faceVertexUvs[0][6] = [ front2[3], front2[0], front2[2] ]; // front bottom top-left
		geometry.faceVertexUvs[0][7] = [ front[1], front[3], front[0] ]; // front top bottom-left
		geometry.faceVertexUvs[0][8] = [ right2[2], right2[3], right2[1] ]; // right bottom bottom-right
		geometry.faceVertexUvs[0][9] = [ right2[3], right2[0], right2[1] ]; // right bottom top-left
		geometry.faceVertexUvs[0][10] = [ right[2], right[3], right[1] ]; // right top bottom-right
		geometry.faceVertexUvs[0][11] = [ right[3], right[0], right[1] ]; // right top top-left
		geometry.faceVertexUvs[0][12] = [ right[0], right[0], right[0] ]; // nothing
		geometry.faceVertexUvs[0][13] = [ right[0], right[0], right[0] ]; // nothing
		geometry.faceVertexUvs[0][14] = [ left[0], left[1], left[3] ]; // left top top-left
		geometry.faceVertexUvs[0][15] = [ left[1], left[2], left[3] ]; // left top bottom-right
		geometry.faceVertexUvs[0][16] = [ left2[0], left2[1], left2[3] ]; // left bottom top-left
		geometry.faceVertexUvs[0][17] = [ left2[1], left2[2], left2[3] ]; // left bottom bottom-right
		THREE.GeometryUtils.center(geometry);
    	mesh = new THREE.Mesh(geometry,  material);	
		BoxFadeIn=6;
		fadeIn();
	} else {
    	mesh = new THREE.Mesh(geometry,  materials);	
	}
	
		for(var i=0;i<scene.children.length;i++){
			if(scene.children[i].type=="Mesh")
				scene.remove(scene.children[i]);
		}
		for(var i=0;i<scene.children.length;i++){
			if(scene.children[i].type=="Mesh")
				scene.remove(scene.children[i]);				
		}
		for(var i=0;i<scene.children.length;i++){
			if(scene.children[i].type=="Mesh")
				scene.remove(scene.children[i]);				
		}
		for(var i=0;i<scene.children.length;i++){
			if(scene.children[i].type=="Mesh")
				scene.remove(scene.children[i]);				
		}
		for(var i=0;i<scene.children.length;i++){
			if(scene.children[i].type=="Mesh")
				scene.remove(scene.children[i]);				
		}
		for(var i=0;i<scene.children.length;i++){
			if(scene.children[i].type=="Mesh")
				scene.remove(scene.children[i]);				
		}
		for(var i=0;i<scene.children.length;i++){
			if(scene.children[i].type=="Mesh")
				scene.remove(scene.children[i]);				
		}

		
	group = new THREE.Group();
	group.add(mesh);


	if(textureFile=="DaggerfallInteractivePreview"){
		//var ratio=1;
		var cutouttexture=["left","middle","right"];
		var posx=[3.5,0,-3.5];
		var posz=[15,3,15];
		var innercover=[0.45,0,-0.45];
		for(var x=0;x<3;x++){
			var textureinlay, material, plane;
			material=new THREE.MeshPhongMaterial( {//right side
				map: loader.load("/images/cutout/DaggerfallInteractivePreview_"+cutouttexture[x]+".webp"), 
				specularMap: loader.load('/images/specularmaps/_default/8.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*3
			}), 
			plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth/3.1),boxheight), material);
			plane.position.x = (boxwidth/-2)+((boxwidth/3.1)*x)+(boxwidth/3.1/2)+posx[x];
			plane.position.y = 0;
			plane.position.z = posz[x]-(boxdepth/2);
			plane.rotation.y = innercover[x];
			group.add(plane);
		}
		material=new THREE.MeshPhongMaterial( {//inside top/bottom
			color: new THREE.Color(0x222222),
		}), 
		plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth),boxdepth), material);
		plane.position.x=0;
		plane.position.y=boxheight/2-2;
		plane.position.z=0;
		plane.rotation.x=Math.PI/2;
		group.add(plane);
		plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth),boxdepth), material);
		plane.position.x=0;
		plane.position.y=boxheight/-2+2;
		plane.position.z=0;
		plane.rotation.x=Math.PI/-2;
		group.add(plane);

	} else 
	if(textureFile=="Daggerfall25Anniversary"){
		//var ratio=1;
		var cutouttexture=["left","middle","right"];
		var posx=[3.5,0,-3.5];
		var posz=[15,3,15];
		var innercover=[0.45,0,-0.45];
		for(var x=0;x<3;x++){
			var textureinlay, material, plane;
			material=new THREE.MeshPhongMaterial( {//right side
				map: loader.load("/images/cutout/Daggerfall25Anniversary_"+cutouttexture[x]+".webp"), 
				specularMap: loader.load('/images/specularmaps/_default/8.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*3
			}), 
			plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth/3.1),boxheight), material);
			plane.position.x = (boxwidth/-2)+((boxwidth/3.1)*x)+(boxwidth/3.1/2)+posx[x];
			plane.position.y = 0;
			plane.position.z = posz[x]-(boxdepth/2);
			plane.rotation.y = innercover[x];
			group.add(plane);
		}
		material=new THREE.MeshPhongMaterial( {//inside top/bottom
			color: new THREE.Color(0x222222),
		}), 
		plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth),boxdepth), material);
		plane.position.x=0;
		plane.position.y=boxheight/2-2;
		plane.position.z=0;
		plane.rotation.x=Math.PI/2;
		group.add(plane);
		plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth),boxdepth), material);
		plane.position.x=0;
		plane.position.y=boxheight/-2+2;
		plane.position.z=0;
		plane.rotation.x=Math.PI/-2;
		group.add(plane);

	} else if(textureFile=="TerminatorFutureShockIP"){
		//var ratio=1;
		var cutouttexture=["left","middle","right"];
		var posx=[3.5,0,-3.5];
		var posz=[15,3,15];
		var innercover=[0.45,0,-0.45];
		for(var x=0;x<3;x++){
			var textureinlay, material, plane;		
			material=new THREE.MeshPhongMaterial( {//right side
				map: loader.load("/images/cutout/TerminatorFutureShockIP_"+cutouttexture[x]+".webp"), 
				specularMap: loader.load('/images/specularmaps/_default/8.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*3
			}), 
			plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth/3.1),boxheight), material);
			plane.position.x = (boxwidth/-2)+((boxwidth/3.1)*x)+(boxwidth/3.1/2)+posx[x];
			plane.position.y = 0;
			plane.position.z = posz[x]-(boxdepth/2);
			plane.rotation.y = innercover[x];
			group.add(plane);
		}
		material=new THREE.MeshPhongMaterial( {//inside top/bottom
			color: new THREE.Color(0x222222),
		}), 
		plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth),boxdepth), material);
		plane.position.x=0;
		plane.position.y=boxheight/2-2;
		plane.position.z=0;
		plane.rotation.x=Math.PI/2;
		group.add(plane);
		plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth),boxdepth), material);
		plane.position.x=0;
		plane.position.y=boxheight/-2+2;
		plane.position.z=0;
		plane.rotation.x=Math.PI/-2;
		group.add(plane);

	} else if(textureFile=="XFilesGame"){
		var textureinlay, material, plane;

		//textureinlay = THREE.ImageUtils.loadTexture( "/images/cutout/XFilesGame.webp" );		
		//material = new THREE.MeshLambertMaterial({ map : textureinlay });
		
		material=new THREE.MeshPhongMaterial( {//right side
			map: loader.load("/images/cutout/XFilesGame.webp"), 
			specularMap: loader.load('/images/specularmaps/_default/15.webp'),
			specular: new THREE.Color(0x333330),
			shininess:Math.max(boxwidth,boxheight)*3
		}), 
		plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth),boxheight), material);			
		plane.position.x = 0;
		plane.position.y = 0;
		plane.position.z = boxdepth/2*0.8;
		plane.rotation.y = 0;
		group.add(plane);
	} else if(textureFile=="X3ReunionCE"){
			var textureinlay, material, plane;
			textureinlay = THREE.ImageUtils.loadTexture( "/images/cutout/X3ReunionCE.webp" );
			
			material = new THREE.MeshLambertMaterial({ map : textureinlay });
			plane = new THREE.Mesh(new THREE.PlaneGeometry((boxwidth),boxheight), material);			
			plane.position.x = 0;
			plane.position.y = 0;
			plane.position.z = boxdepth/2*0.8;
			plane.rotation.y = 0;
			group.add(plane);
	} else if(textureFile=="MorrowindInteractivePreview"){
		var depth=boxdepth-2;
		var height=depth*0.66;
		var width=depth;		
		//Bottom left
		let positionY=[width, width/2, 0+(height*0.25)];
		let positionX=[0+(height*0.25), width/2, width];
		let rotation=[0.3926991,0.785398,1.178097,1.5708];		
		for(var y=0;y<3;y++){			
			const geometry = new THREE.CubeGeometry( 1, height,width); 			
			const texture = new THREE.TextureLoader().load( "/images/cutout/MorrowindInteractivePreview.webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = -(boxwidth/2)+positionX[y];
			plane.position.y = -(boxheight/2)+positionY[y];	
			plane.position.z = 0;
			plane.rotation.z = rotation[y];
			plane.rotation.y = 0;
			plane.rotation.x = 0;
		}
		//Bottom right
		positionY=[width, width/2, 0+(height*0.25)];
		positionX=[0+(height*0.25), width/2, width];
		rotation=[0.3926991,0.785398,1.178097,1.5708];		
		for(var y=0;y<3;y++){			
			const geometry = new THREE.CubeGeometry( 1, height,width); 			
			const texture = new THREE.TextureLoader().load( "/images/cutout/MorrowindInteractivePreview.webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = (boxwidth/2)-positionX[y];
			plane.position.y = -(boxheight/2)+positionY[y];	
			plane.position.z = 0;
			plane.rotation.z = rotation[y];
			plane.rotation.y = 0;
			plane.rotation.x = 3.14159;
		}
		//Top left
		positionY=[width, width/2, 0+(height*0.25)];
		positionX=[0+(height*0.25), width/2, width];
		rotation=[0.3926991,0.785398,1.178097,1.5708];		
		for(var y=0;y<3;y++){			
			const geometry = new THREE.CubeGeometry( 1, height,width); 			
			const texture = new THREE.TextureLoader().load( "/images/cutout/MorrowindInteractivePreview.webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = -(boxwidth/2)+positionX[y];
			plane.position.y = (boxheight/2)-positionY[y];	
			plane.position.z = 0;
			plane.rotation.z = -rotation[y];
			plane.rotation.y = 0;
			plane.rotation.x = 0;
		}
		//Top right
		positionY=[width, width/2, 0+(height*0.25)];
		positionX=[0+(height*0.25), width/2, width];
		rotation=[0.3926991,0.785398,1.178097,1.5708];		
		for(var y=0;y<3;y++){			
			const geometry = new THREE.CubeGeometry( 1, height,width); 			
			const texture = new THREE.TextureLoader().load( "/images/cutout/MorrowindInteractivePreview.webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = (boxwidth/2)-positionX[y];
			plane.position.y = (boxheight/2)-positionY[y];	
			plane.position.z = 0;
			plane.rotation.z = -rotation[y];
			plane.rotation.y = 0;
			plane.rotation.x = 3.14159;
		}
		//Box left
		if(1){
			const geometry = new THREE.CubeGeometry( width, boxwidth-(width*4.13),width);
			const texture = new THREE.TextureLoader().load( "/images/cutout/MorrowindInteractivePreview.webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = -(boxwidth/2)+(width/2);
			plane.position.y = 0;	
			plane.position.z = 0;
		}
		//Box right
		if(1){
			const geometry = new THREE.CubeGeometry( width, boxwidth-(width*4.13),width);
			const texture = new THREE.TextureLoader().load( "/images/cutout/MorrowindInteractivePreview.webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = (boxwidth/2)-(width/2);
			plane.position.y = 0;	
			plane.position.z = 0;
			plane.rotation.x = 3.14159;
		}
	} 
	else if(textureFile=="Prey"){
		var depth=(boxdepth);
		var height=(depth*0.66);
		var width=depth;		
		//Bottom left
		let positionY=[height/4.6, height/9, (height/9/2)];
		let positionX=[(height/12/2), height/7.6, height/4.8];
		let rotation=[0.3926991,0.785398,1.178097,1.5708];		
		for(var y=0;y<3;y++){			
			const geometry = new THREE.CubeGeometry( 1, height/8.5,width); 			
			const texture = new THREE.TextureLoader().load( "/images/cutout/PreyLB"+(y+1)+".webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = -(boxwidth/2)+(positionX[y]);
			plane.position.y = -(boxheight/2)+(positionY[y]);	
			plane.position.z = 0;
			plane.rotation.z = rotation[y];
			plane.rotation.y = 0;
			plane.rotation.x = 0;
		}
		//Bottom right
		positionY=[height/4.6, height/9, (height/9/2)];
		positionX=[(height/12/2), height/7.6, height/4.8];
		
		rotation=[0.3926991,0.785398,1.178097,1.5708];		
		for(var y=0;y<3;y++){			
			const geometry = new THREE.CubeGeometry( 1, height/8.5,width); 			
			const texture = new THREE.TextureLoader().load( "/images/cutout/PreyRB"+(y+1)+".webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = (boxwidth/2)-positionX[y];
			plane.position.y = -(boxheight/2)+positionY[y];	
			plane.position.z = 0;
			plane.rotation.z = rotation[y];
			plane.rotation.y = 0;
			plane.rotation.x = 3.14159;
		}
		//Top left
		positionY=[height/4.6, height/9, (height/9/2)];
		positionX=[(height/12/2), height/7.6, height/4.8];
		rotation=[0.3926991,0.785398,1.178097,1.5708];		
		for(var y=0;y<3;y++){			
			const geometry = new THREE.CubeGeometry( 1, height/8.5,width); 			
			const texture = new THREE.TextureLoader().load( "/images/cutout/PreyLT"+(3-y)+".webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = -(boxwidth/2)+positionX[y];
			plane.position.y = (boxheight/2)-positionY[y];	
			plane.position.z = 0;
			plane.rotation.z = -rotation[y];
			plane.rotation.y = 0;
			plane.rotation.x = 0;
		}
		//Top right
		positionY=[height/4.6, height/9, (height/9/2)];
		positionX=[(height/12/2), height/7.6, height/4.8];
		rotation=[0.3926991,0.785398,1.178097,1.5708];		
		for(var y=0;y<3;y++){			
			const geometry = new THREE.CubeGeometry( 1, height/8.5,width); 			
			const texture = new THREE.TextureLoader().load( "/images/cutout/PreyLR"+(y+1)+".webp" );
			const material = new THREE.MeshBasicMaterial( { map: texture } );
			const plane = new THREE.Mesh( geometry, material ) ;
			
			group.add(plane);
			plane.position.x = (boxwidth/2)-positionX[y];
			plane.position.y = (boxheight/2)-positionY[y];	
			plane.position.z = 0;
			plane.rotation.z = -rotation[y];
			plane.rotation.y = 0;
			plane.rotation.x = 3.14159;
		}
	} else {
	}
	if(hasgatefold>0){
		if(textureFile=="OmikronUS" || textureFile=="RevenantUS"){
			boxwidth=255;
			boxheight=255;
			boxdepth=46;
		} 
		gatefold1Container = new THREE.Mesh(new THREE.CubeGeometry( (boxwidth), (boxheight), (gatefolddepth)),new THREE.MeshBasicMaterial( { visible:false }));
		if(gatefolddirection=="horizontal"){
			gatefold1Container.position.x = -boxwidth/2;
		} else {
			gatefold1Container.position.y = boxheight/2;
		}		
		gatefold1Container.position.z = boxdepth/2+(gatefolddepth/2);
		group.add( gatefold1Container );
		
		const geometry = new THREE.CubeGeometry( (boxwidth-0.02), (boxheight-0.02), gatefolddepth);		
		var gatefoldmaterials = [			
			new THREE.MeshPhongMaterial({ //right side
				map: loader.load('/images/gatefold/right/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				},undefined, err => {console.log("Gatefold/Right couldn't be loaded.");fadeIn()} ),  
				specularMap: loader.load('/images/gatefoldspecmaps/right/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide
			}), 	
			new THREE.MeshPhongMaterial({ //left side
				map: loader.load('/images/gatefold/left/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				},undefined, err => {console.log("Gatefold/Left couldn't be loaded.");fadeIn()} ),  
				specularMap: loader.load('/images/gatefoldspecmaps/left/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide
			}), 	
			new THREE.MeshPhongMaterial({ //top side
				map: loader.load('/images/gatefold/top/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				},undefined, err => {console.log("Gatefold/Top couldn't be loaded.");fadeIn()} ),  
				specularMap: loader.load('/images/gatefoldspecmaps/top/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide
			}), 
			new THREE.MeshPhongMaterial({ //bottom side
				map: loader.load('/images/gatefold/bottom/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				},undefined, err => {console.log("Gatefold/Bottom couldn't be loaded.");fadeIn()} ),  
				specularMap: loader.load('/images/gatefoldspecmaps/bottom/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide
			}), 
			new THREE.MeshPhongMaterial({ //outside
				map: loader.load('/images/textures/front/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				},undefined, err => {console.log("Gatefold/Front couldn't be loaded.");fadeIn()} ),  
				specularMap: loader.load('/images/specularmaps/front/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide
			}), 
			new THREE.MeshPhongMaterial({ //inside left side
				map: loader.load('/images/gatefold/frontleft/'+textureFile+'.webp', function(texture){	
					texture.minFilter = THREE.LinearMipmapNearestFilter;
					texture.magFilter = THREE.LinearFilter ;
					texture.anisotropy = (maxAnisotropy);
					fadeIn() 
				},undefined, err => {console.log("Gatefold/InsideLeft couldn't be loaded.");fadeIn()} ),  
				specularMap: loader.load('/images/gatefoldspecmaps/frontleft/'+specularMapFile+'.webp'),
				specular: new THREE.Color(0x333330),
				shininess:Math.max(boxwidth,boxheight)*2,
				transparent:true,
				side:THREE.DoubleSide
			}), 
		];
		// add gatefold
		gatefold1 = new THREE.Mesh( geometry, gatefoldmaterials ) ;
		gatefold1Container.add(gatefold1);
		if(gatefolddirection=="horizontal"){
			gatefold1.position.x = boxwidth/2;
			gatefold1.position.y = 0;	
		} else {
			gatefold1.position.x = 0;
			gatefold1.position.y = -boxheight/2;
		}
		gatefold1.position.z = 0;

		// add click me icon
		var iconsize=10;
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ){
			iconsize*=2;
		}
		const clickmegeometry = new THREE.CubeGeometry( 0.0001, iconsize,iconsize); 
		var icontexture="/icon/gatefold.png";
		if(textureFile=="Fallout" || textureFile=="HoMM5LE" || textureFile=="OmikronUS" || textureFile=="RevenantUS"){		
			var icontexture="/icon/gatefoldLandscape.png";	
		}			
		const clickmetexture = new THREE.TextureLoader().load( icontexture );
		const clickmematerial = new THREE.MeshPhongMaterial( { map: clickmetexture,
			transparent:true/*,
		side:THREE.DoubleSide*/ } );
		clickme = new THREE.Mesh( clickmegeometry, clickmematerial ) ;
		clickme.name="clickme";
		
		if(photoshoot==0)
			group.add(clickme);		
		
		if(textureFile=="OmikronUS" || textureFile=="RevenantUS"){
			clickme.position.x = ((140)/2) + iconsize;
			clickme.position.z = (boxdepth/2+2);		
		} else {
			clickme.position.x = (boxwidth/2) + iconsize;
			clickme.position.z = (boxdepth/2);		
		}
		clickme.position.y = (boxheight/2) - iconsize/2;
		clickme.rotation.y = -Math.PI/2;

	}
    //scene.add( mesh );
	scene.add(group);
	
    mesh.position.z = 0;
	mesh.overdraw = true;
    scene.rotation.y =0;
    scene.rotation.z =0;
	targetRotation = -0.45;
	targetRotationY = 0;
	targetPanning = 0;
	targetPanningY = 0;
	
	return true;
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function toggleGatefold(){
	scene.children[4].remove(scene.children[4].getObjectByName('clickme'))
	if(gatefold1pos==0){
		// Open 1st gatefold
		gatefoldShown=1;
		if(gatefolddirection=="horizontal"){
			gatefold1pos=Math.PI-0.5;
			groupPosX=-boxwidth/2;		
			maxPanningX=0-((boxwidth*2)/2.2);
			minPanningX=(boxwidth*2)/2.2;
			targetRotation = 0.225;
			gatefold1Container.position.z = boxdepth/2;
			targetPanning=Math.max(maxPanningX,Math.min(minPanningX,targetPanning));
		} else {
			gatefold1pos=Math.PI-0.5;
			groupPosY=boxheight/2;		
			maxPanningY=0-((boxheight*2)/2.2);
			minPanningY=(boxheight*2)/2.2;
			if(topbottom==1)
				targetRotationY = 0.225;
			targetRotation = 0;
			gatefold1Container.position.z = boxdepth/2;
			targetPanningY=Math.max(maxPanningY,Math.min(minPanningY,targetPanningY));
		}
	} else {
		// Close all gatefolds
		if(gatefoldShown==hasgatefold){
			gatefoldShown=0;
			if(gatefolddirection=="horizontal"){
				gatefold1pos=0;
				groupPosX=0;
				maxPanningX=0-boxwidth/2.2;
				minPanningX=boxwidth/2.2;
				targetPanning=Math.max(maxPanningX,Math.min(minPanningX,targetPanning));
				gatefold1Container.position.z = boxdepth/2+(gatefolddepth/2);
			} else {
				gatefold1pos=0;
				gatefold2pos=0;
				gatefold3pos=0;
				groupPosY=0;
				maxPanningY=0-boxheight/2.2;
				minPanningY=boxheight/2.2;
				if(topbottom==1)
					targetRotationY = 0;
				targetRotation = 0.225;
				targetPanningY=Math.max(maxPanningY,Math.min(minPanningY,targetPanningY));
				gatefold1Container.position.z = boxdepth/2+(gatefolddepth/2);
				gatefold2Container.position.z = boxdepth/2+(gatefolddepth/2);
				gatefold3Container.position.z = boxdepth/2+(gatefolddepth/2);
			}
		} else if(gatefoldShown==1){
			// Open 2nd gatefold
			gatefoldShown=2;
			if(gatefolddirection=="horizontal"){
			} else {
				gatefold2pos=Math.PI-0.5;
				groupPosY=boxheight/2;		
				maxPanningY=0-((boxheight*2)/2.2);
				minPanningY=(boxheight*2)/2.2;
				if(topbottom==1)
					targetRotationY = 0.225;
				targetRotation = 0;
				gatefold2Container.position.z = boxdepth/2;
				targetPanningY=Math.max(maxPanningY,Math.min(minPanningY,targetPanningY));
			}
		} else if(gatefoldShown==2){
			// Open 3nd gatefold			
			gatefoldShown=3;
			if(gatefolddirection=="horizontal"){
			} else {
				gatefold3pos=0-Math.PI+0.5;
				groupPosY=boxheight/2;		
				maxPanningY=0-((boxheight*2)/2.2);
				minPanningY=(boxheight*2)/2.2;
				if(topbottom==1)
					targetRotationY = 0.225;
				targetRotation = 0;
				gatefold3Container.position.z = boxdepth/2;
				targetPanningY=Math.max(maxPanningY,Math.min(minPanningY,targetPanningY));
			}
		}
	}
}
function animate() {
	requestAnimationFrame( animate );
	if(autorotate==1)
		targetRotation-=0.0025;
	group.rotation.y -= (targetRotation + group.rotation.y ) * 0.1;
	if(hasgatefold>0){
		if(gatefolddirection=="horizontal"){
			gatefold1Container.rotation.y -= (gatefold1pos + gatefold1Container.rotation.y) *0.1;
			mesh.position.x -= (groupPosX + mesh.position.x) *0.1;			
			gatefold1Container.position.x -= (groupPosX + gatefold1Container.position.x +(boxwidth/2)) *0.1;
		} else {
			gatefold1Container.rotation.x -= (gatefold1pos + gatefold1Container.rotation.x) *0.1;
			mesh.position.y -= (groupPosY + mesh.position.y) *0.1;			
			gatefold1Container.position.y -= (groupPosY + gatefold1Container.position.y -(boxheight/2)) *0.1;
		}
	}
	if(topbottom==1){
		group.rotation.x -= (targetRotationY + group.rotation.x ) * 0.1;
	}
	camera.position.x -= (targetPanning + camera.position.x) * 0.5;
	camera.position.y -= (targetPanningY + camera.position.y) * 0.5;
	camera.updateProjectionMatrix();
	renderer.render( scene, camera );
}

function onDocumentMouseDown( event ) {
	autorotate=0;
	event.preventDefault();
	mousebutton=event.button;
	byId('boxcontrols').addEventListener( 'mousemove', onDocumentMouseMove, false );
	byId('boxcontrols').addEventListener( 'mouseup', onDocumentMouseUp, false );
	byId('boxcontrols').addEventListener( 'mouseout', onDocumentMouseOut, false );
	mouseXOnMouseDown = event.clientX - windowHalfX;
	mouseYOnMouseDown = event.clientY - windowHalfY;
	mouseYOnMouseThreshold = event.clientY;
	targetRotationOnMouseDown = targetRotation;
	targetRotationYOnMouseDown = targetRotationY;
	targetPanningOnMouseDown = targetPanning;
	targetPanningYOnMouseDown = targetPanningY;
}
function onDocumentMouseMove( event ) {
	if(mousebutton==0/*event.which===1 || event.which===0*/){ // left mouse button
		byId('boxcontrols').style.cursor="-webkit-grabbing";
		mouseX = event.clientX - windowHalfX;
		targetRotation = targetRotationOnMouseDown - ( mouseX - mouseXOnMouseDown ) * 0.01;
		mouseY = event.clientY - windowHalfY;
		targetRotationY = targetRotationYOnMouseDown - ( mouseY - mouseYOnMouseDown ) * 0.01;
		targetRotationY = Math.max(-1.5,Math.min(1.5,targetRotationY));
		
	} else if(mousebutton==2/*event.which===3 || event.which===2*/ ){ //right mouse button
		window.oncontextmenu = function(e) {
			e.preventDefault();
		}
		mouseX = event.clientX - windowHalfX;
		targetPanning = targetPanningOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.2;
		targetPanning=Math.max(maxPanningX,Math.min(minPanningX,targetPanning));

		mouseY = event.clientY - windowHalfY;
		targetPanningY = targetPanningYOnMouseDown - ( mouseY - mouseYOnMouseDown ) * 0.2;
		targetPanningY=Math.max(maxPanningY,Math.min(minPanningY,targetPanningY));
	}
}

function onMouseWheel(event){
	autorotate=0;
	if(event.deltaY>0 && camera.zoom<1){
		if(overscroll<5){
			overscroll++;
		} else {
			return;
		}
	} else {
		overscroll=0;
	}
	var zoomstep=0.2;
	if(event.deltaY<0){
		camera.zoom*=(1+zoomstep);		
		overscroll=0;
		if(camera.zoom>3)
			event.preventDefault();
	}
	else{
		camera.zoom*=(1-zoomstep);
		event.preventDefault();
	}    
	camera.zoom=Math.max(zoomMin,Math.min(zoomMax,camera.zoom));
}
function onDocumentMouseUp( event ) {
	zooming=0;
	byId('boxcontrols').removeEventListener( 'mousemove', onDocumentMouseMove, false );
	byId('boxcontrols').removeEventListener( 'mouseup', onDocumentMouseUp, false );
	byId('boxcontrols').removeEventListener( 'mouseout', onDocumentMouseOut, false );
	byId('boxcontrols').style.cursor="-webkit-grab";
	mousebutton=-1;
}
function onDocumentMouseOut( event ) {
	zooming=0;
	byId('boxcontrols').removeEventListener( 'mousemove', onDocumentMouseMove, false );
	byId('boxcontrols').removeEventListener( 'mouseup', onDocumentMouseUp, false );
	byId('boxcontrols').removeEventListener( 'mouseout', onDocumentMouseOut, false );
	byId('boxcontrols').style.cursor="-webkit-grab";
	mousebutton=-1;
}
var panning=0;
var zooming=0;
function onDocumentTouchStart( event ) {
	autorotate=0;

    if (clickTimer == null && event.touches.length == 1) {
        clickTimer = setTimeout(function () {
            clickTimer = null;
        }, 250)
    } else if(event.touches.length == 1){
        clearTimeout(clickTimer);
        clickTimer = null;
		onDoubleClick();
    }
	touchstart=1;
	event.preventDefault();
	byId('boxcontrols').addEventListener( 'touchmove', onDocumentTouchMove, false );
	byId('boxcontrols').addEventListener( 'touchend', onDocumentTouchEnd, false );
	
    if (event.touches.length == 1) {
		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
		mouseYOnMouseThreshold = event.touches[ 0 ].pageY;
		targetRotationOnMouseDown = targetRotation;
		targetRotationYOnMouseDown = targetRotationY;
	} else if (event.touches.length ==2) {
		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
		targetPanningOnMouseDown = targetPanning;
		targetPanningYOnMouseDown = targetPanningY;
        var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
        var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
		touchZoomDistanceEnd = touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );
	}
}
function onDocumentTouchMove( event ) {
	event.preventDefault();
    if (event.touches.length == 1) {		
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown - ( mouseX - mouseXOnMouseDown ) * 0.01;
		mouseY = event.touches[ 0 ].pageY - windowHalfY;
		targetRotationY = targetRotationYOnMouseDown - ( mouseY - mouseYOnMouseDown ) * 0.01;
		targetRotationY = Math.max(-1.5,Math.min(1.5,targetRotationY));
	}

    if (event.touches.length == 2) {
		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
		touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );
		var distance=(touchZoomDistanceStart-touchZoomDistanceEnd)*PixelRatio*PixelRatio;
		// Zoom
		if(!panning){
			if(distance< (0-0.5)/PixelRatio || distance > 0.5/PixelRatio){
				var zoomstep=touchZoomDistanceEnd/touchZoomDistanceStart;
				if(zoomstep>1)
					zoomstep=1+(zoomstep-1)/(PixelRatio*0.8);
				else
					zoomstep=1-(1-zoomstep)/(PixelRatio*0.8);
				camera.zoom*=zoomstep;
				camera.zoom=Math.max(zoomMin,Math.min(zoomMax,camera.zoom));
				zooming=1;
			} else {
				zooming=0;
				mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
				mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
			}
		}
		touchZoomDistanceStart = touchZoomDistanceEnd;
		if(!zooming){	
			if(!panning){
				mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
				mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
			}			
			// Pan X
			if((touchPanStart1 > event.touches[ 0 ].pageX && touchPanStart2 > event.touches[ 1 ].pageX)|| (touchPanStart1 < event.touches[ 0 ].pageX && touchPanStart2 < event.touches[ 1 ].pageX)){
				mouseX = event.touches[ 0 ].pageX - windowHalfX;
				targetPanning = targetPanningOnMouseDown + ( mouseX - mouseXOnMouseDown ) * (0.5/camera.zoom);
				panning=1;
			} 
			targetPanning=Math.max(maxPanningX,Math.min(minPanningX,targetPanning));

			// Pan Y
			if((touchPanStartY1 > event.touches[ 0 ].pageY && touchPanStartY2 > event.touches[ 1 ].pageY)||(touchPanStartY1 < event.touches[ 0 ].pageY && touchPanStartY2 < event.touches[ 1 ].pageY)){
				mouseY = event.touches[ 0 ].pageY - windowHalfY;
				targetPanningY = targetPanningYOnMouseDown - ( mouseY - mouseYOnMouseDown ) * (0.5/camera.zoom);
				panning=1;
			}
			targetPanningY=Math.max(maxPanningY,Math.min(minPanningY,targetPanningY));
			if(distance<-20 || distance >20)
				panning=0;
		}
	}
}
function onDocumentTouchEnd( event ) {
	panning=0;
	zooming=0;
	byId('boxcontrols').removeEventListener( 'touchmove', onDocumentTouchMove, false );
	byId('boxcontrols').removeEventListener( 'touchend', onDocumentTouchEnd, false );
}
function onDoubleClick( event ){
	if(hasgatefold>0)		
		toggleGatefold();
	camera.zoom=1;
	if(window.innerWidth/window.innerHeight<0.7)
		camera.zoom=0.5;
	targetPanning=0;
	targetPanningY=0;
	if(gatefold1pos==0){
		targetRotation = -0.45;	
	} else 
		targetRotation = 0.45;
	targetRotationY=0;
}
function fadeIn(){
	BoxFadeIn++;
	var limit=3;
	if(topbottom==1)
		limit=5;
	if(hasgatefold==1)
		limit+=2;
	if(BoxFadeIn>=limit){		
		if(byId('box'))
			byId('box').style.opacity=1;
		if(byId('idle'))
			byId('idle').style.opacity=0;
	}

}

/***********************/
/* Keyboard Navigation
/***********************/

function keyboardNavigation( event ) {
	autorotate=0;
	var keyCode = event.keyCode;
    if(keyCode == 81){ // Q > Show Front
		targetRotation = -0.45;
    } else if(keyCode == 69){ // E > Show Back
		targetRotation = Math.PI+0.45;
    } else if(keyCode == 71){ // G > Toggle Gatefold
		if(hasgatefold>0)
			toggleGatefold();
    } 
}
