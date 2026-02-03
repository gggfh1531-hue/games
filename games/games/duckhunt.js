let ducks=[];
let score=0;
let level=1;

let roundsPerLevel=10;
let round=1;
let hits=0;

let shotsLeft=4;
let gameW=window.innerWidth;
let gameH=window.innerHeight*0.75;

const duckTypes={
  normal:{speed:4, points:500},
  blue:{speed:6, points:1000},
  red:{speed:6, points:1500}
};

window.onload=()=>startRound();

function startRound(){
  shotsLeft=4;
  updateHUD();
  spawnDucks();
}

function spawnDucks(){
  ducks=[];
  let maxDucks = level<=2 ? 1 : level<=10 ? 2 : 3;
  let duckCount=Math.min(maxDucks,1+Math.floor((round-1)/3));

  let usedBlue=false, usedRed=false;

  for(let i=0;i<duckCount;i++){
    let type="normal";

    if(!usedBlue && Math.random()<0.5){ type="blue"; usedBlue=true; }
    else if(!usedRed){ type="red"; usedRed=true; }

    createDuck(type);
  }
}

function createDuck(type){
  let img=document.createElement("img");
  img.src=Math.random()<0.5?"duck-left.gif":"duck-right.gif";
  img.width=96;
  img.height=93;

  let duck={
    image:img,
    type:type,
    x:Math.random()*(gameW-100),
    y:Math.random()*(gameH-100),
    vx:(Math.random()<0.5?-1:1)*duckTypes[type].speed,
    vy:(Math.random()<0.5?-1:1)*duckTypes[type].speed
  };

  img.style.left=duck.x+"px";
  img.style.top=duck.y+"px";

  img.onclick=(e)=>{
    e.stopPropagation();
    shootDuck(duck);
  };

  document.body.appendChild(img);
  ducks.push(duck);
}

document.body.onclick=()=>{
  if(shotsLeft<=0) return;
  shotsLeft--;
  updateHUD();
  new Audio("duck-shot.mp3").play();
  if(shotsLeft===0) endRound();
};

function shootDuck(duck){
  if(shotsLeft<=0) return;

  shotsLeft--;
  hits++;
  score+=duckTypes[duck.type].points;

  updateHUD();
  new Audio("duck-shot.mp3").play();

  document.body.removeChild(duck.image);
  ducks=ducks.filter(d=>d!==duck);

  if(ducks.length===0) endRound();
}

function endRound(){
  round++;

  if(round>roundsPerLevel){
    showDog(hits>=6);
    if(hits>=6 && level<25) level++;
    round=1;
    hits=0;
  }

  setTimeout(startRound,2000);
}

function showDog(success){
  let dog=document.createElement("img");
  dog.src=success?"dog-duck1.png":"dog-duck2.png";
  dog.width=success?172:224;
  dog.height=152;

  dog.style.bottom="0";
  dog.style.left="50%";
  dog.style.transform="translateX(-50%)";
  dog.style.position="fixed";

  document.body.appendChild(dog);
  new Audio("dog-score.mp3").play();

  setTimeout(()=>document.body.removeChild(dog),2500);
}

function updateHUD(){
  document.getElementById("score").textContent=score;
  document.getElementById("level").textContent=level;
  document.getElementById("shots").textContent=shotsLeft;
}

setInterval(()=>{
  ducks.forEach(d=>{
    d.x+=d.vx;
    d.y+=d.vy;

    if(d.x<0||d.x+96>gameW){ d.vx*=-1; }
    if(d.y<0||d.y+93>gameH){ d.vy*=-1; }

    d.image.style.left=d.x+"px";
    d.image.style.top=d.y+"px";
  });
},1000/60);
