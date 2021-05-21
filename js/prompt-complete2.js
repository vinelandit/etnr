class Prompt_complete extends Prompt {
    constructor(domID,doneCallback,userID=null) {
        
        super('complete',domID,doneCallback);
        this.userID = userID;
        this.s = null;


        // load final saved state
        if(userID==null) {
          this.s = JSON.parse(localStorage.getItem('etnr_state'));
        } else {
          // get the state from the database
          console.log('getting state from database');
          var _this = this;
          api('data',{ 'id': userID },function(r){
            console.log(r);
            console.log('got state for user '+userID,r.data['user'+userID].state);
            _this.s = r.data['user'+userID].state;
            _this.show();
          },'../api/',-1);
        }

        this.tpl = `
          <div class="prompt complete fullscreen" id="">
              <div class="page fullscreen hidden">

                  <svg style="width:350px;height:450px" width="350" height="450" id="gpsPath"></svg>
                  <button class="nextPage next right"></button>
              </div>
              <div class="page fullscreen hidden" data-voiceover="journey">
                  <div class="center">
                    <div class="unit"><div class="instruction">The journey you just took, through land, air and sea, reflects the subtle ways that can connect global carbon cycles to local environment.</div></div>
                    <div class="unit"><button class="autoNext nextPage next"></button></div>
                  </div>
              </div>
              <div class="page fullscreen hidden" data-voiceover="traces">
                  <div class="center">
                    <div class="unit"><div class="instruction">
The traces of your personal journey have helped form a collective call to action. Every time you walk with the experience, this artwork will grow.</div></div>
                    <div class="unit"><button class="autoNext nextPage next"></button></div>
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

                

      
        
    }
    xy(latlng,psi0) {
          return [
            [latlng.lon*Math.cos(psi0)],
            [latlng.lat]
          ];
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

        // enforce height to stop Android devices shrinking the viewport when the keyboard is displayed
        this.interface.css({'min-height':$(document).height()});


        var gpx = [];
        var s = this.s;

        if(s!==null&&s!=='') {
          
          gpx = s.gpx;
          console.log('obtained gpx');
          console.log(gpx);
        } 

        var origin = gpx[0];
        var psi0 = gpx[0].lat;
        var scale = 500000;

        var dims = [350,450];


        var maxX = null;
        var maxY = null;
        var minX = null;
        var minY = null;

        var points = [];
        var graph = [];
        var times = [];
        var endSpheres = [];
        var spheres = [];

        var graphOrigin = [20,430];
        var speedFactor = 10;


        var totalTime = s.overallTime;


        var tFactor = 410/totalTime;

        console.log(totalTime,tFactor);

        // calculate xy
        for(var i=0;i<gpx.length;i++) {
          


          points.push(this.xy(gpx[i],psi0));
          times.push(gpx[i].time);




          if(i>0) {
            points[i][0] -= points[0][0];
            points[i][1] -= points[0][1];
            times[i] = gpx[i].timestamp - gpx[0].timestamp;

            points[i][0] *= scale;
            points[i][1] *= scale;

            var d = distance(gpx[i].lat, gpx[i].lon, gpx[i-1].lat, gpx[i-1].lon);
            var t = (gpx[i].timestamp - gpx[i-1].timestamp)/1000;
            var et = (gpx[i].timestamp-gpx[0].timestamp)/1000;

            var speed = d/t;
            if(speed>15) {
              speed = 15;
            }
            if(!isNaN(speed)&&!isNaN(et)) {
             graph.push([speed*speedFactor+graphOrigin[0],graphOrigin[1]-(et*tFactor)]);
            }

          } else {
            graph.push(graphOrigin);
          }
          if(maxX==null) {
            maxX = points[i][0];
          } else {
            if(points[i][0] > maxX) {
              maxX = points[i][0];
            }
          }
          if(maxY==null) {
            maxY = points[i][1];
          } else {
            if(points[i][1] > maxY) {
              maxY = points[i][1];
            }
          }
          if(minX==null) {
            minX = points[i][0];
          } else {
            if(points[i][0] < minX) {
              minX = points[i][0];
            }
          }
          if(minY==null) {
            minY = points[i][1];
          } else {
            if(points[i][1] < minY) {
              minY = points[i][1];
            }
          }


        }
        points[0][0] = dims[0]/2;
        points[0][1] = dims[1]/2;
        for(var i=1;i<gpx.length;i++) {
          points[i][0] += dims[0]/2;
          points[i][1] += dims[1]/2;
        }
        console.log(gpx);
        console.log(minX,minY,maxX,maxY);

        var scaleAdjust = Math.max(Math.abs(minX),Math.abs(minY),Math.abs(maxX),Math.abs(maxY));

        scaleAdjust = 120/scaleAdjust;


        for(var i=1;i<gpx.length;i++) {
          points[i][0] *= scaleAdjust;
          points[i][1] *= scaleAdjust;
          points[i][0] += dims[0]/2;
          points[i][1] += dims[1]/2;
        }

        console.log(scaleAdjust);

        // points[0] = [0,0];
        times[0] = 0;

        var timeRange = (times[times.length-1] - times[0])/1000;

        var timeScale = 10/timeRange;

        console.log(timeRange);

        var offset = [ points[points.length-1][0] , points[points.length-1][1] ];

        console.log('offset',offset);




        console.log(graph,times);
        var currentStage = -1;
        var isStepping = true;

        for(var i=0;i<gpx.length;i++) {

            /* var offsetFactor = gpx[i].time/gpx[gpx.length-1].time;
            console.log('offsetFactor',offsetFactor);
            var myOffset = {
              'x':offset.x*offsetFactor,
              'y':offset.y*offsetFactor
            }; */

            

            if(isStepping&&!gpx[i].stepping) {
              // switching from stepping to not stepping, i.e. prompts for this stage; show sphere
              // place end sphere
              spheres.push([ graph[i], gpx[i].stageType ]);
            }
            if(i==0||i==gpx.length-1) {
              // place end sphere
              
              endSpheres.push(graph[i]);
              
            } 

            isStepping = gpx[i].stepping;
            currentStage = gpx[i].stage;
          
        }


        // The smoothing ratio
        const smoothing = 0.05;

        

        // Properties of a line 
        // I:  - pointA (array) [x,y]: coordinates
        //     - pointB (array) [x,y]: coordinates
        // O:  - (object) { length: l, angle: a }: properties of the line
        const line = (pointA, pointB) => {
          const lengthX = pointB[0] - pointA[0]
          const lengthY = pointB[1] - pointA[1]
          return {
            length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
            angle: Math.atan2(lengthY, lengthX)
          }
        }

        // Position of a control point 
        // I:  - current (array) [x, y]: current point coordinates
        //     - previous (array) [x, y]: previous point coordinates
        //     - next (array) [x, y]: next point coordinates
        //     - reverse (boolean, optional): sets the direction
        // O:  - (array) [x,y]: a tuple of coordinates
        const controlPoint = (current, previous, next, reverse) => {

          // When 'current' is the first or last point of the array
          // 'previous' or 'next' don't exist.
          // Replace with 'current'
          const p = previous || current
          const n = next || current

          // Properties of the opposed-line
          const o = line(p, n)

          // If is end-control-point, add PI to the angle to go backward
          const angle = o.angle + (reverse ? Math.PI : 0)
          const length = o.length * smoothing

          // The control point position is relative to the current point
          const x = current[0] + Math.cos(angle) * length
          const y = current[1] + Math.sin(angle) * length
          return [x, y]
        }

        // Create the bezier curve command 
        // I:  - point (array) [x,y]: current point coordinates
        //     - i (integer): index of 'point' in the array 'a'
        //     - a (array): complete array of points coordinates
        // O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
        const bezierCommand = (point, i, a) => {

          // start control point
          const cps = controlPoint(a[i - 1], a[i - 2], point)

          // end control point
          const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
          return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
        }

        // Render the svg <path> element 
        // I:  - points (array): points coordinates
        //     - command (function)
        //       I:  - point (array) [x,y]: current point coordinates
        //           - i (integer): index of 'point' in the array 'a'
        //           - a (array): complete array of points coordinates
        //       O:  - (string) a svg path command
        // O:  - (string): a Svg <path> element
        const svgPath = (points, command) => {
          // build the d attributes by looping over the points
          const d = points.reduce((acc, point, i, a) => i === 0
            ? `M ${point[0]},${point[1]}`
            : `${acc} ${command(point, i, a)}`
          , '')
          return `<path d="${d}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1" />`;
        }

        const svg = document.querySelector('svg#gpsPath');

        svg.innerHTML = svgPath(graph, bezierCommand);

        console.log('SPHERES',spheres);

        for(var i=0;i<spheres.length;i++) {
          var html = '<ellipse rx="6" ry="6" stroke="none" class="'+spheres[i][1]+'" cx="'+spheres[i][0][0]+'" cy="'+spheres[i][0][1]+'" />';
          svg.innerHTML += html;
        }
        for(var i=0;i<endSpheres.length;i++) {
          var html = '<ellipse rx="6" ry="6" stroke="none" fill="white" cx="'+endSpheres[i][0]+'" cy="'+endSpheres[i][1]+'" />';
          svg.innerHTML += html;
        }   




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


        // stop stuff
        this.doneCallback();
    }
    
}