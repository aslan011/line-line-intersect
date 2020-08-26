
/*
    The goal of this exercise is to take a polygon defined by the points 'points', use the mouse
    events to draw a path that will split the polygon and then draw the two split polygons.
    In the start, you'll have the initial polygon (start.png)
    While dragging the mouse, the polygon should be shown along with the path you're drawing (mouseMove.png)
    After letting go of the mouse, the polygon will be split into two along that path (mouseUp.png)

    The code provided here can be used as a starting point using plain-old-Javascript, but it's fine
    to provide a solution using react/angular/vue/etc if you prefer.
*/

const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
const svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');

let x1, y1;
let firstIntersect = null;
let secondIntersect = null;
let mousedown;
let path = '';
let startPoint = '';

function onMouseDown(event) {
    //Add code here
    x1 = event.x;
    y1 = event.y;
    mousedown = true;
    startPoint = 'M' + event.x + ' ' + event.y;
};

function onMouseMove(event) {
    if (!mousedown) {return};
    const content = document.getElementById('content');
    
    point = ' L' + event.x + ' ' + event.y;
    path = startPoint + point;
    svgPath.setAttribute('d', path);
    svgPath.setAttribute('stroke', "red");
    
    svgElement.setAttribute('height', "100%"); 
    svgElement.setAttribute('width', "100%");
    
    svgElement.appendChild(svgPath);
    content.appendChild(svgElement);
};

function onMouseUp(event) {
    mousedown = false;
    const poly1 = [];
    const poly2 = [];
    const x2 = event.x;
    const y2 = event.y;

    //Generate the two sets of points for the split polygons
    //An algorithm for finding interceptions of two paths can be found in https://en.wikipedia.org/wiki/line%E2%80%93line_intersection
    function checkIntersection(ax,ay,bx,by, cx, cy, dx, dy) {
        const l1 = (dx- cx) * (ay - cy) - (dy - cy) * (ax - cx);
        const l2 = (bx - ax) * (ay - cy) - (by - ay) * (ax - cx);
        const denom = (dy - cy) * (bx - ax) - (dx - cx) * (by - ay);
        const ua = l1 / denom;
        const ub = l2 / denom;

        // this checks if ua and ab are between 0-1
        const inBetween = (ua, ub) => {
            if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {
                return true
            } else { return false }
        };

        if (inBetween(ua, ub)) {
            if (!firstIntersect) {
                firstIntersect = 
                    {
                        x: x1 + ua * (x2 - x1),
                        y: y1 + ua * (y2 - y1) 
                    }
                return firstIntersect
            }
            else {
                secondIntersect = 
                    {
                        x: x1 + ua * (x2 - x1),
                        y: y1 + ua * (y2 - y1) 
                    }
                return secondIntersect
            }
        };
        return false;
    };

    points.forEach((point, index) => {
        let ind = index + 1;
        if (ind == points.length) {ind = 0}
        // check for first intersection
        if (checkIntersection(x1, y1, x2, y2, point.x, point.y, points[ind].x, points[ind].y) == firstIntersect) {
               for (let i = 0; i <= index; i ++){
                   poly1.push(points[i]);
               }
               poly1.push(firstIntersect)
               poly2.push(firstIntersect)
        }
        // check for second intersection
        else if (checkIntersection(x1, y1, x2, y2, point.x, point.y, points[ind].x, points[ind].y) == secondIntersect) {
            poly1.push(secondIntersect)
            for (let i = index + 1; i < points.length; i++){
                poly1.push(points[i]);
            };
        };
    });

    // create the second polygon with the remaining edges
    const remainderPoints = points.filter((point, index) => {
        return !poly1.includes(point);
    });

    remainderPoints.forEach(point => {
        poly2.push(point)
    });

    poly2.push(secondIntersect);

    // check if the line is outside of the shape, therefore will not intersect
    if (poly1.length === 0 || poly2.length === 0) {
        return alert('Line does not intersect')
    };

    clearPoly();
    addPoly(poly1, 'blue');
    addPoly(poly2, 'green');
};

/*
	Code below this path shouldn't need to be changed
*/

//Draws a polygon from the given points and sets a stroke with the specified color
function addPoly(points, color = 'black') {
    if(points.length < 2) {
        console.error("Not enough points");
        return;
    }
    
    const content = document.getElementById('content');
    
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    let path = 'M' + points[0].x + ' ' + points[0].y
    
    for(const point of points) {
        path += ' L' + point.x + ' ' + point.y;
    }
    path += " Z";
    svgPath.setAttribute('d', path);
    svgPath.setAttribute('stroke', color);
    
    svgElement.setAttribute('height', "500"); 
    svgElement.setAttribute('width', "500");
    svgElement.setAttribute('style', 'position: absolute;');
    svgElement.setAttribute('fill', 'transparent');
    
    svgElement.appendChild(svgPath);
    content.appendChild(svgElement);
}

//Clears the all the drawn polygons
function clearPoly() {
    const content = document.getElementById('content');
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

//Sets the mouse events needed for the exercise
function setup() {
    this.clearPoly();
    this.addPoly(points);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
}

const points = [
    { x : 100, y: 100 },
    { x : 200, y: 50 },
    { x : 300, y: 50 },
    { x : 400, y: 200 },
    { x : 350, y: 250 },
    { x : 200, y: 300 },
    { x : 150, y: 300 },
]

window.onload = () => setup()




























