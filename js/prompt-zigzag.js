
class Prompt_zigzag extends Prompt {

	constructor(domID,doneCallback) {
		super('zigzag',domID,doneCallback);
		this.tpl = `<div class="prompt zigzag fullscreen" id="">
				      <div class="promptBg"></div>	      
				      <div class="center"></div>
				  </div> `;

		this._factor = -.1;
		if(isIOS()) {
			this._factor = 1;
		}
	}
	set gravity(data) {
		this.world.gravity.y = this._factor*(data.z+5)/9.81;
		this.world.gravity.x = this._factor*(data.x+5)/9.81;
	}
	show() {

		// get available height
		var h = $('body').innerHeight();
		var r = h/600; // for scaling matter.js instance

		super.show();
		var _this = this;
		// do zigzag stuff
		// Matter.js - http://brm.io/matter-js/

		var Zigzag = Zigzag || {};
		
		Zigzag.go = function() {
		    var Engine = Matter.Engine,
		        Render = Matter.Render,
		        Runner = Matter.Runner,
		        Composite = Matter.Composite,
		        Composites = Matter.Composites,
		        Common = Matter.Common,
		        MouseConstraint = Matter.MouseConstraint,
		        Mouse = Matter.Mouse,
		        World = Matter.World,
		        Bodies = Matter.Bodies,
		        Events = Matter.Events;

		    // create engine
		    var engine = Engine.create();
		    _this.world = engine.world;
		  

		    // create renderer
		    var render = Render.create({
		        element: _this.interface[0],
		        engine: engine,
		        options: {
		            width: 200*r,
		            height: 600*r,
		            wireframes: false
		        }
		    });

		    Render.run(render);

		    // create runner
		    var runner = Runner.create();
		    Runner.run(runner, engine);
		    
		    _this.world.gravity.y = -1;
		    // add bodies
		    /* var stack = Composites.stack(1, 1, 1, 1, 0, 0, function(x, y) {
		        return Bodies.circle(x, y, Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
		    }); */
		    var ball = Bodies.circle(150*r, 600*r, 8*r, { friction: 0.00001, restitution: 0.5, density: 0.001, label:'match' });

		    World.add(_this.world, ball);
		    
		    World.add(_this.world, [
		      // left rectangles
		      Bodies.rectangle(0, 600*r, 200*r, 200*r, { isStatic: true, angle: Math.PI/4, 
		      	render: {
		      		fillStyle:'#339933',
		      		lineWidth:0
		      	}	 
		  	}),
		      
		      Bodies.rectangle(0, 400*r, 200*r, 200*r, { isStatic: true, angle: Math.PI/4 , 
		      	render: {
		      		fillStyle:'#339933',
		      		lineWidth:0
		      	}	 }),
		      Bodies.rectangle(0, 200*r, 200*r, 200*r, { isStatic: true, angle: Math.PI/4 , 
		      	render: {
		      		fillStyle:'#339933',
		      		lineWidth:0
		      	}	 }),
		      Bodies.rectangle(0, 0, 200*r, 200*r, { isStatic: true, angle: Math.PI/4 , 
		      	render: {
		      		fillStyle:'#339933',
		      		lineWidth:0
		      	}	 }),
		      
		      // right rectangles
		      Bodies.rectangle(210*r, 500*r, 200*r, 200*r, { isStatic: true, angle: Math.PI/4 , 
		      	render: {
		      		fillStyle:'#339933',
		      		lineWidth:0
		      	}	 }),
		      // right rectangles
		      Bodies.rectangle(210*r, 300*r, 200*r, 200*r, { isStatic: true, angle: Math.PI/4 , 
		      	render: {
		      		fillStyle:'#339933',
		      		lineWidth:0
		      	}	 }),
		      
		      // right rectangles
		      Bodies.rectangle(210*r, 100*r, 200*r, 200*r, { isStatic: true, angle: Math.PI/4 , 
		      	render: {
		      		fillStyle:'#339933',
		      		lineWidth:0
		      	}	 }),
		      
		      // bottom border
		      Bodies.rectangle(100*r, 600*r, 200*r, 2*r, { isStatic: true, angle: 0 , 
		      	render: {
		      		fillStyle:'#339933',
		      		lineWidth:0
		      	}	 })

		    ]);

		    // following a collisionStart event, check if the collision occurs between the player and the goal post
			function handleCollision(e) {
				if(ball.position.y<=10) {
					
		            
		            World.clear(_this.world);
		            Engine.clear(engine);
		            Render.stop(render);
		            Runner.stop(runner);
		            render.canvas.remove();
		            render.canvas = null;
		            render.context = null;
		            render.textures = {};
		            _this.complete();
				}
			}
			Events.on(engine, 'afterUpdate', handleCollision);


		    return {
		        engine: engine,
		        runner: runner,
		        render: render,
		        canvas: render.canvas,
		        stop: function() {
		            Matter.Render.stop(render);
		            Matter.Runner.stop(runner);
		        }
		    };
		};

		Zigzag.go();
		
	}
}