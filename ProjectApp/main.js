const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPiicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImage = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");
var selectedColor = "#000";

//global varibles with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5;

window.addEventListener("load", () => {
  //setting canvas width/height offsetwidth/height of an element\
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const setCanvasBackground = () => {
  //setting whole canvas background to white, so the download img background will be white
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor; //setting fillstyle back to the selectedColor, it'll be the brush color
}

const drawRect = (e) => {
  //if fillColor isn't checked draw a rect with boder else draw rect with background
  if(!fillColor.checked){
    return  ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
  //creating circle according to the mouse pointer
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

const drawCircle = (e) => {
  ctx.beginPath(); // creating new path to draw circle
  //getting radius for circle according to the mouse pointer
  let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
  //creating circle according to the mouse pointer
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  //if fillColor is Checked fill circle else draw boder circle
  fillColor.checked ?ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  ctx.stroke();
  fillColor.checked ?ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; //passing current mouseX position as prevMouseX value
  prevMouseY = e.offsetY;// passing current mouseY position as prevMouseY value
  ctx.beginPath(); // creating new path to draw
  ctx.lineWidth = brushWidth; //passing brushSize as line width
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  // copying canvas data & passing as anapshot value.. this avoids dragging the image
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
  if(!isDrawing) return; //if isDrawing is false return from here
  ctx.putImageData(snapshot, 0, 0);// adding copied canvas data on to this canvas

  if(selectedTool === "brush" ||selectedTool === "eraser"){
    //if sected tool eraser then set strokeStyle to white
    //to paint white color on to the existing canvas content else set the stoke color to selected color
    ctx.strokeStyle = selectedTool === "eraser" ?"#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
    ctx.stroke(); //drawing/filling line with color
  }else if(selectedTool === "rectangle"){
    drawRect(e);
  }else if(selectedTool === "circle"){
    drawCircle(e);
  }else{
    drawTriangle(e);
  }

}

toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {//adding click event to all tool option 
  //removing active class from the previous option and adding on current clicked option
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    //adding click event to all color button
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
  });
});

colorPiicker.addEventListener("change", () => {
  colorPiicker.parentElement.style.background = colorPiicker.value;
  colorPiicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //clearing whole canvas
  setCanvasBackground();
});

saveImage.addEventListener("click", () => {
  const link =  document.createElement("a"); 
  link.download = `${Date.now()}.jpg`;//passing current date as link domnload value
  link.href = canvas.toDataURL();//passing canvasData as link href value
  link.click();//clicking link to download image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);