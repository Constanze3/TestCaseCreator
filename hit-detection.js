let outputBox;
let startText =
    `1, 2, 3 to choose what to position (circle1, circle2, point)<br>
Scroll wheel to change the radius of the currently selected circle`;

let selected = 0;
let shapes = [];

let outputDecimalCount = 2;

function roundToNDecimals(number, N) {
    if (N == null) N = 1;
    return Math.round(number * Math.pow(10, N)) / Math.pow(10, N);
}

class Shape {
    constructor(position, color) {
        this.position = position;
        this.color = color;
    }

    move(newPosition) {
        this.position = newPosition;
    }

    draw() { }

    outputText() {
        return roundToNDecimals(this.position.x, outputDecimalCount) + " "
            + roundToNDecimals(this.position.y, outputDecimalCount);
    }
}

class Circle extends Shape {
    constructor(position, radius, color) {
        super(position, color);
        this.radius = radius;
    }

    draw() {
        noStroke(); fill(this.color);
        circle(this.position.x, this.position.y, this.radius * 2);
    }

    changeRadius(amount) {
        this.radius -= amount;
        if (this.radius - amount < 3) this.radius = 3;
    }

    outputText() {
        return roundToNDecimals(this.position.x, outputDecimalCount) + " "
            + roundToNDecimals(this.position.y, outputDecimalCount) + " " + roundToNDecimals(this.radius, outputDecimalCount);
    }
}

class Point extends Shape {
    constructor(position, size, color) {
        super(position, color);
        this.size = size;
    }

    draw() {
        stroke(this.color); strokeWeight(this.size);
        point(this.position.x, this.position.y);
    }
}

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent("p5-canvas");

    outputBox = select('#output-box');

    translate(width / 2, height / 2);

    shapes.push(new Circle(createVector(0, 0), 100, color(255, 0, 0, 70)));
    shapes.push(new Circle(createVector(0, 0), 200, color(0, 255, 0, 70)));
    shapes.push(new Point(createVector(0, 0), 1, color(255)));

    background(0);
    drawShapes(startText);
}

function drawShapes(customOutputMessage) {
    background(0);

    fill("#7a7a7a"); noStroke(); textSize(60);
    text(selected + 1, width / 2 - 60, -height / 2 + 60);

    let output = "";

    shapes.forEach(shape => {
        shape.draw();
        output += shape.outputText() + " ";
    });

    console.log(output.slice(-1));

    outputBox.html(customOutputMessage == null ? output : customOutputMessage);
}

function draw() {
    translate(width / 2, height / 2);
    if (mouseIsPressed && mouseY < height - 10) {
        shapes[selected].move(createVector(mouseX - width / 2, mouseY - height / 2));
        drawShapes();
    }
}

function keyPressed() {
    if ([1, 2, 3].includes(parseInt(key))) {
        selected = key - 1;
        drawShapes();
    }
}

function mouseWheel(event) {
    console.log(event.delta / 100);
    if (shapes[selected] instanceof Circle) {
        shapes[selected].changeRadius(event.delta / 40);
        drawShapes();
    }
}