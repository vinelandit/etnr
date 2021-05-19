class Prompt_complete extends Prompt {
    constructor(domID,doneCallback) {
        super('complete',domID,doneCallback);
        this.tpl = `
          <div class="prompt complete fullscreen" id="">
              <div class="page fullscreen hidden">
                  <button class="nextPage next right"></button>
              </div>
              <div class="page fullscreen hidden">
                  <div class="center">
                    <div class="unit"><div class="instruction">The journey you just took, through land, air and sea, explores the local, subtle ways, that global climate events and their entanglements manifest locally.</div></div>
                    <div class="unit"><button class="nextPage next"></button></div>
                  </div>
              </div>
              <div class="page fullscreen hidden">
                  <div class="center">
                    <div class="unit"><div class="instruction">From the soil you held to the tree you rested beneath. From the quietness you sought to the breaths you took. Small, subtle gestures, anchored within the current climate emergency; a request to stop and consider, how we relate with, in, and to the ecological complexity that we are facing regarding climate change.</div></div>
                    <div class="unit"><button class="nextPage next"></button></div>
                  </div>
              </div>
              <div class="page fullscreen hidden">
                  <div class="center">
                    <div class="unit"><div class="instruction">Thank you for taking part in this pilot experience. To finish we would greatly appreciate your opinion. Please answer the 3 short questions on the next page.</div></div>
                    <div class="unit"><button class="nextPage halfLeft">Okay</button><button class="gotoPage halfRight" data-page="final">Skip</button></div>
                  </div>
              </div>
              
              <div class="page fullscreen hidden feedback">
                  <div class="center">
                    <form>
                      <div class="unit">
                        <div class="instruction">
                          <label>What is the best thing?</label>
                          <textarea id="feedback1" name="feedback1"></textarea>
                        </div>
                      </div>
                        <div class="instruction">
                          <label>What is the worst thing?</label>
                          <textarea id="feedback2" name="feedback2"></textarea>
                        </div>
                     
                      <div class="unit">
                        <div class="instruction">
                          <label>What is a thing?</label>
                          <textarea id="feedback3" name="feedback3"></textarea>
                        </div>
                      </div>
                      <div class="unit"><button class="submitFeedback">Submit</button></div>
                    </form>
                  </div>
              </div>
              <div class="page fullscreen final hidden">
                  <div class="center">
                    <div class="unit">
                      <div class="instruction">
                        <form>
                          <input name="email" class="email" placeholder="Email address" /><button class="formButton subscribe">OK</button>
                          <label>If you would like to be one of the first to hear about future iterations of this experience, please fill in your email above.</label>
                        </form>
                      </div>
                    </div>
                    <div class="unit"><div class="instruction">You might also be interested in <a href="#">Learning more</a> about the research that informed each interaction.</div></div>
                  </div>
              </div>
          </div>`;

        // load final saved state
        var s = localStorage.getItem('etnr_state');
        if(s!==null&&s!=='') {
          s = JSON.parse(s);
          this.gpx = s.gpx;
          console.log('obtained gpx');
          console.log(this.gpx);
        } else {
          this.gpx = [];
        }

        this.origin = this.gpx[0];
        var psi0 = this.gpx[0].lat;
        this.scale = 50000;



        

        var maxX = null;
        var maxY = null;
        var minX = null;
        var minY = null;

        // calculate xy
        for(var i=0;i<this.gpx.length;i++) {
          this.gpx[i].point = this.xy(this.gpx[i],psi0);
          if(i>0) {
            this.gpx[i].point.x -= this.gpx[0].point.x;
            this.gpx[i].point.y -= this.gpx[0].point.y;
            this.gpx[i].timestamp = this.gpx[i].timestamp - this.gpx[0].timestamp;

            this.gpx[i].point.x *= this.scale;
            this.gpx[i].point.y *= this.scale;
          }
          if(maxX==null) {
            maxX = this.gpx[i].point.x;
          } else {
            if(this.gpx[i].point.x > maxX) {
              maxX = this.gpx[i].point.x;
            }
          }
          if(maxY==null) {
            maxY = this.gpx[i].point.y;
          } else {
            if(this.gpx[i].point.y > maxY) {
              maxY = this.gpx[i].point.y;
            }
          }
          if(minX==null) {
            minX = this.gpx[i].point.x;
          } else {
            if(this.gpx[i].point.x < minX) {
              minX = this.gpx[i].point.x;
            }
          }
          if(minY==null) {
            minY = this.gpx[i].point.y;
          } else {
            if(this.gpx[i].point.y < minY) {
              minY = this.gpx[i].point.y;
            }
          }
        }
        console.log(minX,minY,maxX,maxY);

        this.scaleAdjust = Math.max(Math.abs(minX),Math.abs(minY),Math.abs(maxX),Math.abs(maxY));

        this.scaleAdjust = 10/this.scaleAdjust;

        console.log(this.scaleAdjust);

        this.gpx[0].point = {'x':0,'y':0};
        this.gpx[0].timestamp = 0;

        var timeRange = (this.gpx[this.gpx.length-1].timestamp - this.gpx[0].timestamp)/1000;

        this.timeScale = 40/timeRange;

        console.log(timeRange);

        this.offset = {'x':-this.gpx[this.gpx.length-1].point.x,'y':-this.gpx[this.gpx.length-1].point.y};

        console.log('offset',this.offset);

        
    }
    xy(latlng,psi0) {
          return {
            'x':latlng.lon*Math.cos(psi0),
            'y':latlng.lat
          };
        }

    debounce(func){
      var timer;
      return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,100,event);
      };
    }
    onDocumentMouseMove( event ) {

      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight );

    }
    show() {
        super.show();
        var _this = this;

        // handle newsletter subscribe requests
        this.interface.find('form').on('submit',function(e){
          e.preventDefault();
          return false;
        });
        this.interface.find('.subscribe').off('click').on('click',function(){

            var e = _this.interface.find('.email').val().trim();
            if(e!='') {
                api('email',{
                  'email':e
                },function(data){
                  if(data.result=='success') {
                    _this.interface.find('.email').val('');
                    _this.interface.find('.subscribe').html('Thank you!').off('click');
                    window.setTimeout(function(){
                      _this.interface.find('.final form').closest('.instruction').slideUp(1000);
                    },1000);
                  } else {
                    console.log('Error: '+data.message);
                    alert(data.message);
                  }
                });
            }
            
        });

        // handle feedback request
        this.interface.find('.submitFeedback').off('click').on('click',function(){

            var q1 = _this.interface.find('#feedback1').val().trim();
            var q2 = _this.interface.find('#feedback2').val().trim();
            if(q1!=''&&q2!='') {
                $(this).off('click').html('Submitting...');
                api('feedback',{
                  'q1':q1,
                  'q2':q2
                },function(data){
                  if(data.result=='success') {
                    _this.nextPage(_this.interface.find('.page.feedback'));
                  } else {
                    console.log('Error: '+data.message);
                    alert(data.message);
                  }
                });
            } else {
              if(q1=='') {
                _this.interface.find('#feedback1').addClass('error').on('focus',function(){
                  $(this).removeClass('error');
                });
              }
              if(q2=='') {
                _this.interface.find('#feedback2').addClass('error').on('focus',function(){
                  $(this).removeClass('error');
                });
              }
            }
            
        });


        this.cameraPositionZ = 64;
        this.background = 'grey';
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1 );
        this.camera.position.z = this.cameraPositionZ;
        this.camera.position.y = 0;

        this.cubeSize = 10;
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        // Configure renderer clear color
        this.renderer.setClearColor("#000000");
        this.scene.background = new THREE.Color(this.background);
        this.renderer.setPixelRatio(devicePixelRatio);

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.interface.find('.page:eq(0)')[0].appendChild( this.renderer.domElement );

        // Create a Cube Mesh with basic material
        this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
        this.material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
        this.cube = new THREE.Mesh( this.geometry, this.material );
        // this.axesHelper = new THREE.AxesHelper( 500 );
        // this.scene.add( this.axesHelper );

        // this.points = [];
        this.points2 = [];
        this.pivot = new THREE.Group();

        var sGeom = new THREE.SphereGeometry(.5,16,16);
        var sEndGeom = new THREE.SphereGeometry(.75,16,16);

        var sMaterial = new THREE.MeshBasicMaterial({
          color:0xffff00,
          transparent: true,
          opacity:0.5
        });
        var sEndMaterial = new THREE.MeshBasicMaterial({
          color:0x0000ff,
          transparent: true,
          opacity:0.5
        });

        var currentStage = 0;
        var isStepping = true;

        for(var i=0;i<this.gpx.length;i++) {

            var offsetFactor = this.gpx[i].timestamp/this.gpx[this.gpx.length-1].timestamp;
            console.log('offsetFactor',offsetFactor);
            var myOffset = {
              'x':this.offset.x*offsetFactor,
              'y':this.offset.y*offsetFactor
            };

            this.points2.push(new THREE.Vector3(
                  this.scaleAdjust*(this.gpx[i].point.x+myOffset.x),this.timeScale*this.gpx[i].timestamp/1000,this.scaleAdjust*(this.gpx[i].point.y+myOffset.y)
              ));

            if(isStepping&&!this.gpx[i].stepping || (isStepping&&this.gpx[i].stepping&&currentStage!=this.gpx[i].stage)) {
              // switching from stepping to not stepping, i.e. prompts for this stage; show sphere
              // place end sphere
              var sphere = new THREE.Mesh(sGeom,sMaterial);
              sphere.position.x = this.points2[i].x;
              sphere.position.y = this.points2[i].y;
              sphere.position.z = this.points2[i].z;
              this.pivot.add(sphere);
            }
            if(i==0||i==this.gpx.length-1) {
              // place end sphere
              var sphere = new THREE.Mesh(sEndGeom,sEndMaterial);
              sphere.position.x = this.points2[i].x;
              sphere.position.y = this.points2[i].y;
              sphere.position.z = this.points2[i].z;
              this.pivot.add(sphere);
            } 

            isStepping = this.gpx[i].stepping;
            currentStage = this.gpx[i].stage;
          
        }


        this.pGeom2 = new THREE.BufferGeometry().setFromPoints(this.points2);


        this.pLineMaterial2 = new THREE.LineBasicMaterial( { color: 0x00ffff, transparent: false, depthTest:false } );

        // this.line2 = new THREE.Line(this.pGeom2,this.pLineMaterial2);
        this.curve = new THREE.CatmullRomCurve3(this.points2);
        var curvePoints = this.curve.getPoints(this.points2.length*8);

        this.curveGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
        this.line2 = new THREE.Line(this.curveGeom,this.pLineMaterial2);
       

        

        // bounding box
        var bbox = new THREE.Box3().setFromObject(this.line2);
        var center = bbox.min.lerp(bbox.max,0.5);
        console.log(center);

        this.line2.position.set(-center.x,-center.y,-center.z);        


        bbox = new THREE.Box3().setFromObject(this.line2);
        bbox.getCenter(this.line2.position);
        // this.line2.position.multiplyScalar(-1);

        this.scene.add(this.pivot);

        this.pivot.add(this.line2);
        this.pivot.position.y = -center.y;


        this.mouse = new THREE.Vector2();

        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.addEventListener('change',() => this.renderer.render(this.scene,this.camera));
        // this.camera.position.z = this.cameraPositionZ;


        // Render Loop
        var render = function () {
          requestAnimationFrame( render );

          _this.pivot.rotation.y += 0.01;

          // Render the scene
          _this.renderer.render(_this.scene, _this.camera);
        };

        render();

        // this.cube.position.set(x-this.offsets.x,y-this.offsets.y,z-this.offsets.z);

        var _this = this;
        document.addEventListener( 'mousemove', function(e) {
          _this.onDocumentMouseMove(e);
        });
        window.addEventListener( 'resize', 
          _this.debounce(function(e) {
            _this.onWindowResize(e);
          })
        );
        

      
        // stop stuff
        this.doneCallback();
    }
    
}