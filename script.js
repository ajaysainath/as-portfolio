
/* ================= BOOT SCREEN ================= */

setTimeout(function(){

const boot = document.querySelector(".boot-screen");

if(boot){
boot.style.display = "none";
}

},3000);


/* ================= GLOBAL VARIABLES ================= */

let commandRunning = false;

let volume = 0;
let mouseX = 0;
let mouseY = 0;


/* ================= MOUSE TRACKING ================= */

document.addEventListener("mousemove", function(e){

mouseX = e.clientX;
mouseY = e.clientY;

});

const core = document.querySelector(".ai-core");

document.addEventListener("mousemove", function(e){

if(!core) return;

let rect = core.getBoundingClientRect();

let cx = rect.left + rect.width/2;
let cy = rect.top + rect.height/2;

let dx = e.clientX - cx;
let dy = e.clientY - cy;

let dist = Math.sqrt(dx*dx + dy*dy);

if(dist < 300){

core.style.transform =
"translate(" + dx*0.03 + "px," + dy*0.03 + "px)";

}else{

core.style.transform = "translate(0,0)";

}

});


/* ================= ORB ANIMATION ================= */

const canvas = document.getElementById("orbCanvas");

if(canvas){

const ctx = canvas.getContext("2d");

canvas.width = 420;
canvas.height = 420;

let orbParticles = [];

for(let i=0;i<120;i++){

orbParticles.push({

angle: Math.random()*Math.PI*2,
radius:150 + Math.random()*18,
speed:0.008 + Math.random()*0.015

});

}

function animateOrb(){

ctx.clearRect(0,0,canvas.width,canvas.height);

/* core */

let coreSize = 5 + volume * 0.05;

ctx.beginPath();
ctx.arc(210,210,coreSize,0,Math.PI*2);
ctx.fillStyle="#00eaff";
ctx.fill();

/* particles */

orbParticles.forEach(p=>{

p.angle += p.speed;

let x = 210 + Math.cos(p.angle)*p.radius;
let y = 210 + Math.sin(p.angle)*p.radius;

/* mouse interaction */

let dx = mouseX - canvas.getBoundingClientRect().left - 210;
let dy = mouseY - canvas.getBoundingClientRect().top - 210;

let dist = Math.sqrt(dx*dx + dy*dy);

if(dist < 200){

x += dx * 0.02;
y += dy * 0.02;

}

ctx.beginPath();
ctx.arc(x,y,2,0,Math.PI*2);
ctx.fillStyle="#00eaff";
ctx.fill();

});

requestAnimationFrame(animateOrb);

}

animateOrb();

}


/* ================= MICROPHONE WAVE VISUALIZER ================= */

document.addEventListener("DOMContentLoaded", function(){

const voiceCanvas = document.getElementById("voiceWave");

if(!voiceCanvas){
return;
}

const vctx = voiceCanvas.getContext("2d");

voiceCanvas.width = 420;
voiceCanvas.height = 240;

navigator.mediaDevices.getUserMedia({audio:true})
.then(function(stream){

const audioCtx = new AudioContext();

const analyser = audioCtx.createAnalyser();

const source = audioCtx.createMediaStreamSource(stream);

source.connect(analyser);

analyser.fftSize = 256;
analyser.smoothingTimeConstant = 0.6;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawWave(){

requestAnimationFrame(drawWave);

analyser.getByteTimeDomainData(dataArray);

/* calculate volume */

let sum = 0;

for(let i=0;i<bufferLength;i++){
sum += Math.abs(dataArray[i] - 128);
}

volume = sum / bufferLength;

vctx.clearRect(0,0,voiceCanvas.width,voiceCanvas.height);

/* baseline */

vctx.beginPath();
vctx.moveTo(0, voiceCanvas.height/2);
vctx.lineTo(voiceCanvas.width, voiceCanvas.height/2);
vctx.strokeStyle="rgba(0,234,255,0.2)";
vctx.lineWidth=1;
vctx.stroke();

/* waveform */

vctx.beginPath();

let sliceWidth = voiceCanvas.width / bufferLength;

let x = 0;

for(let i=0;i<bufferLength;i++){

let v = dataArray[i] / 128.0;
let y = voiceCanvas.height/2 + (v-1)*60;

if(i===0){
vctx.moveTo(x,y);
}else{
vctx.lineTo(x,y);
}

x += sliceWidth;

}

vctx.strokeStyle="#00eaff";
vctx.lineWidth=4;

vctx.shadowColor="#00eaff";
vctx.shadowBlur=15;

vctx.stroke();

}

drawWave();

})
.catch(function(err){

console.log("Mic error:", err);

});

});


/* ================= SCROLL REVEAL ================= */

const reveals = document.querySelectorAll(".reveal");

function revealSections(){

const windowHeight = window.innerHeight;

reveals.forEach(section => {

const sectionTop = section.getBoundingClientRect().top;

if(sectionTop < windowHeight - 100){
section.classList.add("active");
}

});

}

window.addEventListener("scroll", revealSections);


/* ================= ACTIVE NAVBAR LINK ================= */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

let current = "";

sections.forEach(section => {

const sectionTop = section.offsetTop;
const sectionHeight = section.clientHeight;

if(scrollY >= sectionTop - 200){
current = section.getAttribute("id");
}

});

navLinks.forEach(link => {

link.classList.remove("active");

if(link.getAttribute("href") === "#" + current){
link.classList.add("active");
}

});

});

/* ================= COMMAND HANDLER ================= */

function handleCommand(command){

command = command.toLowerCase().trim();

/* PROJECTS */
if(
command.includes("projects") ||
command.includes("open projects")
){
document.querySelector("#projects").scrollIntoView({behavior:"smooth"});
}

/* SKILLS */
else if(
command.includes("skills") ||
command.includes("open skills")
){
document.querySelector("#skills").scrollIntoView({behavior:"smooth"});
}

/* CONTACT */
else if(
command.includes("contact") ||
command.includes("open contact")
){
document.querySelector("#contact").scrollIntoView({behavior:"smooth"});
}

/* ABOUT */
else if(
command.includes("about") ||
command.includes("open about")
){
document.querySelector("#about").scrollIntoView({behavior:"smooth"});
}

/* HOME */
else if(
command.includes("home") ||
command.includes("go home")
){
document.querySelector("#home").scrollIntoView({behavior:"smooth"});
}

/* GITHUB */
else if(command.includes("github")){
window.open("https://github.com/ajaysainath","_blank");
}

/* LINKEDIN */
else if(command.includes("linkedin")){
window.open("https://www.linkedin.com/in/ajay-sainath-3269832a4","_blank");
}

/* PROJECT LINKS */
else if(command.includes("code review")){
window.open("https://github.com/ajaysainath/ai-code-review-assistant","_blank");
}

else if(command.includes("voice agent")){
window.open("https://github.com/ajaysainath/voice-ai-agent","_blank");
}

else if(command.includes("knowledge graph")){
window.open("https://github.com/ajaysainath/ai-codebase-knowledge-graph","_blank");
}

}

document.querySelectorAll(".project-card").forEach(card=>{
card.addEventListener("mousemove",e=>{
const rect = card.getBoundingClientRect();
card.style.setProperty("--x",(e.clientX-rect.left)+"px");
card.style.setProperty("--y",(e.clientY-rect.top)+"px");
});
});




const canvasSkills = document.getElementById("skillsCanvas");

if(canvasSkills){

const ctx = canvasSkills.getContext("2d");
const chips = document.querySelectorAll(".ai-skill-chip");

let particles = [];

function resizeCanvas(){
canvasSkills.width = canvasSkills.offsetWidth;
canvasSkills.height = canvasSkills.offsetHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


function getPoints(){

let points = [];

chips.forEach(chip=>{

const rect = chip.getBoundingClientRect();
const parent = canvasSkills.getBoundingClientRect();

points.push({
x: rect.left - parent.left + rect.width/2,
y: rect.top - parent.top + rect.height/2
});

});

return points;

}


function spawnParticle(points){

let a = Math.floor(Math.random()*points.length);
let b = Math.floor(Math.random()*points.length);

if(a !== b){

particles.push({

from: points[a],
to: points[b],
progress:0,
speed:0.01 + Math.random()*0.02

});

}

}


function drawNetwork(){

ctx.clearRect(0,0,canvasSkills.width,canvasSkills.height);

const points = getPoints();

ctx.strokeStyle="rgba(0,234,255,0.25)";
ctx.lineWidth=1;

for(let i=0;i<points.length;i++){

for(let j=i+1;j<points.length;j++){

ctx.beginPath();
ctx.moveTo(points[i].x,points[i].y);
ctx.lineTo(points[j].x,points[j].y);
ctx.stroke();

}

}


particles.forEach(p=>{

p.progress += p.speed;

let x = p.from.x + (p.to.x - p.from.x)*p.progress;
let y = p.from.y + (p.to.y - p.from.y)*p.progress;

ctx.beginPath();
ctx.arc(x,y,2.5,0,Math.PI*2);
ctx.fillStyle="#00eaff";
ctx.shadowColor="#00eaff";
ctx.shadowBlur=10;
ctx.fill();

});

particles = particles.filter(p=>p.progress < 1);


if(Math.random() < 0.05){
spawnParticle(points);
}

requestAnimationFrame(drawNetwork);

}

drawNetwork();

}


const consoleBox = document.getElementById("ai-console");
const consoleInput = document.getElementById("console-input");


document.addEventListener("keydown", function(e){

if(e.key === "/"){

e.preventDefault()

consoleBox.style.display="flex";
consoleInput.focus();

}

if(e.key === "Escape"){

consoleBox.style.display="none";

}

});


if (consoleInput) {
  consoleInput.addEventListener("keydown", function(e){

    if(e.key === "Enter"){
      let cmd = consoleInput.value.toLowerCase();

      handleCommand(cmd);

      consoleBox.style.display = "none";

      consoleInput.value = "";
    }

  });
}



const cards = document.querySelectorAll(".project-card");

cards.forEach(card => {

  card.addEventListener("mousemove", (e) => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 12;
    const rotateY = (x - centerX) / 12;

    card.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;

    card.style.setProperty("--x", x + "px");
    card.style.setProperty("--y", y + "px");

  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });

});

const networkCanvas = document.getElementById("projectsNetwork");

if(networkCanvas){

const ctx = networkCanvas.getContext("2d");

let width;
let height;

function resize(){
width = networkCanvas.offsetWidth;
height = networkCanvas.offsetHeight;

networkCanvas.width = width;
networkCanvas.height = height;
}

resize();
window.addEventListener("resize", resize);

const nodes = [];

for(let i=0;i<40;i++){
nodes.push({
x:Math.random()*width,
y:Math.random()*height,
vx:(Math.random()-0.5)*0.6,
vy:(Math.random()-0.5)*0.6
});
}

function draw(){

ctx.clearRect(0,0,width,height);

nodes.forEach(node=>{
node.x += node.vx;
node.y += node.vy;

if(node.x<0||node.x>width) node.vx *= -1;
if(node.y<0||node.y>height) node.vy *= -1;

ctx.beginPath();
ctx.arc(node.x,node.y,2,0,Math.PI*2);
ctx.fillStyle="#00eaff";
ctx.fill();
});

for(let i=0;i<nodes.length;i++){
for(let j=i+1;j<nodes.length;j++){

const dx = nodes[i].x - nodes[j].x;
const dy = nodes[i].y - nodes[j].y;
const dist = Math.sqrt(dx*dx + dy*dy);

if(dist < 120){

ctx.beginPath();
ctx.moveTo(nodes[i].x,nodes[i].y);
ctx.lineTo(nodes[j].x,nodes[j].y);

ctx.strokeStyle = "rgba(0,234,255,"+(1 - dist/120)+")";
ctx.lineWidth = 0.5;

ctx.stroke();
}

}
}

requestAnimationFrame(draw);
}

draw();

}


/* ================= ORB ANIMATION ================= */

const orbCanvas = document.getElementById("orbCanvas");

if(orbCanvas){

const ctx = orbCanvas.getContext("2d");

let w = orbCanvas.width = 420;
let h = orbCanvas.height = 420;

let particles = [];

for(let i=0;i<60;i++){
particles.push({
x:Math.random()*w,
y:Math.random()*h,
vx:(Math.random()-0.5)*0.7,
vy:(Math.random()-0.5)*0.7
});
}

function drawOrb(){

ctx.clearRect(0,0,w,h);

particles.forEach(p=>{
p.x += p.vx;
p.y += p.vy;

if(p.x<0||p.x>w) p.vx *= -1;
if(p.y<0||p.y>h) p.vy *= -1;

ctx.beginPath();
ctx.arc(p.x,p.y,2,0,Math.PI*2);
ctx.fillStyle="#00eaff";
ctx.fill();
});

for(let i=0;i<particles.length;i++){
for(let j=i+1;j<particles.length;j++){

const dx = particles[i].x - particles[j].x;
const dy = particles[i].y - particles[j].y;

const dist = Math.sqrt(dx*dx + dy*dy);

if(dist < 120){

ctx.beginPath();
ctx.moveTo(particles[i].x,particles[i].y);
ctx.lineTo(particles[j].x,particles[j].y);

ctx.strokeStyle="rgba(0,234,255,"+(1 - dist/120)+")";
ctx.lineWidth=0.6;

ctx.stroke();
}
}
}

requestAnimationFrame(drawOrb);

}

drawOrb();

}

/* ================= VOICE COMMAND SYSTEM ================= */

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";

recognition.onresult = function(event){

const transcript =
event.results[event.results.length - 1][0].transcript
.toLowerCase().trim();

console.log("Voice command:", transcript);

handleCommand(transcript);

};

recognition.onerror = function(event){
console.log("Speech error:", event.error);
};

recognition.onend = function(){
recognition.start();
};

recognition.start();

}