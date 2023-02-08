import { Component, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { spline } from '@georgedoescode/spline';
import SimplexNoise from 'simplex-noise';
import AOS from "aos";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements AfterContentInit {

  // second: adapt layout to mobile
  // TODO: use authguard to redirect user if already connected
  
  path: Array<any>;
  noiseStep: number;
  simplex: SimplexNoise;
  points: Array<any>;


  constructor(
    private cdr: ChangeDetectorRef
  ) { 
    this.path = new Array(3);
    this.noiseStep = 0.002;
    this.simplex = new SimplexNoise();
    this.points = [];
    AOS.init();
  }

  private map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
  }

  private noise(x, y) {
      return this.simplex.noise2D(x, y);
  }

  private createPoints() {
      const points = [];
      // how many points do we need
      const numPoints = 6;
      // used to equally space each point around the circle
      const angleStep = (Math.PI * 2) / numPoints;
      // the radius of the circle
      const rad = 75;

      for (let i = 1; i <= numPoints; i++) {
          // x & y coordinates of the current point
          const theta = i * angleStep;

          const x = 100 + Math.cos(theta) * rad;
          const y = 100 + Math.sin(theta) * rad;

          // store the point's position
          points.push({
          x: x,
          y: y,
          // we need to keep a reference to the point's original point for when we modulate the values later
          originX: x,
          originY: y,
          // more on this in a moment!
          noiseOffsetX: Math.random() * 1000,
          noiseOffsetY: Math.random() * 1000
          });
      }

      return points;
  }

  private animate() {
    for (let k = 0; k < this.path.length; ++k) {

        this.path[k].setAttribute("d", spline(this.points[k], 1, true));
        
        // for every point...
        for (let i = 0; i < this.points[k].length; i++) {
            const point = this.points[k][i];
            
            // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
            const nX = this.noise(point.noiseOffsetX, point.noiseOffsetX);
            const nY = this.noise(point.noiseOffsetY, point.noiseOffsetY);
            // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
            const x = this.map(nX, -1, 1, point.originX - 20, point.originX + 20);
            const y = this.map(nY, -1, 1, point.originY - 20, point.originY + 20);
            
            // update the point's current coordinates
            point.x = x;
            point.y = y;
            
            // progress the point's x, y values through "time"
            point.noiseOffsetX += this.noiseStep;
            point.noiseOffsetY += this.noiseStep;
        }
    }
        
    requestAnimationFrame(this.animate.bind(this));
    this.cdr.detectChanges();
  }


  ngAfterContentInit() {
    this.path[0] = document.querySelector('#first_path');
    this.path[1] = document.querySelector('#second_path');
    this.path[2] = document.querySelector('#third_path');

    for (let i = 0; i < 3; ++i)
      this.points.push(this.createPoints());
    this.animate();
  }

}
