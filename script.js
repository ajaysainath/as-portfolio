
/* ================= BOOT SCREEN ================= */

setTimeout(function(){

const boot = document.querySelector(".boot-screen");

if(boot){
boot.style.display = "none";
}

},3000);


/* ================= GLOBAL VARIABLES ================= */

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


/* ================= VOICE COMMAND SYSTEM ================= */

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if(SpeechRecognition){

const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;

recognition.start();

recognition.onresult = function(event){

const transcript =
event.results[event.results.length-1][0].transcript
.toLowerCase().trim();

handleCommand(transcript);

};

recognition.onerror = function(event){

if(event.error !== "no-speech"){
console.log("Speech error:", event.error);
}

};

recognition.onend = function(){
recognition.start();
};

}


/* ================= COMMAND HANDLER ================= */


function handleCommand(command){

command = command.toLowerCase();

/* PROJECTS */

if(command.includes("project") || command.includes("show project")){
document.getElementById("projects").scrollIntoView({behavior:"smooth"});
}

/* SKILLS */

else if(command.includes("skill") || command.includes("show skills")){
document.getElementById("skills").scrollIntoView({behavior:"smooth"});
}

/* CONTACT */

else if(
command.includes("contact") ||
command.includes("contact me") ||
command.includes("open contact")
){
document.getElementById("contact").scrollIntoView({behavior:"smooth"});
}

/* ABOUT */

else if(
command.includes("about") ||
command.includes("about section") ||
command.includes("open about")
){
document.getElementById("about").scrollIntoView({behavior:"smooth"});
}

/* HOME */

else if(
command.includes("home") ||
command.includes("go home") ||
command.includes("open home")
){
document.getElementById("home").scrollIntoView({behavior:"smooth"});
}

/* GITHUB */

else if(
command.includes("github") ||
command.includes("open github")
){
window.open("https://github.com/ajaysainath","_blank");
}

/* LINKEDIN */

else if(
command.includes("linkedin") ||
command.includes("linked in") ||
command.includes("open linkedin")
){
window.open("https://linkedin.com/in/ajay-sainath-3269832a4","_blank");
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

e.preventDefault();

consoleBox.style.display="flex";
consoleInput.focus();

}

if(e.key === "Escape"){

consoleBox.style.display="none";

}

});


consoleInput.addEventListener("keydown", function(e){

if(e.key === "Enter"){

let cmd = consoleInput.value.toLowerCase();

handleCommand(cmd);

consoleBox.style.display="none";

consoleInput.value="";

}

});