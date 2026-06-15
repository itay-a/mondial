let data,current=0;
fetch('worldcup2026.json').then(r=>r.json()).then(d=>{data=d.teams;render();});
function teamRating(players){
 return Math.round(players.reduce((a,p)=>a+p.rating,0)/players.length);
}
function render(){
 const t=data[current];
 document.getElementById('teamInfo').innerHTML=`<div>${t.flag} ${t.name} | OVR ${teamRating(t.players)}</div>
 <div class="controls"><button onclick="move(-1)">◀</button><button onclick="move(1)">▶</button></div>`;
 const html=t.players.map(p=>`<div class="card">
 <img src="${p.photo}" onerror="this.src='https://ui-avatars.com/api/?name='+encodeURIComponent('${"${p.name}"}')">
 <div><div><b>${p.name}</b></div>
 <div>${p.position} • ${getAge(p.dob)} • ${p.club}</div>
 <div class="rating">${p.rating}</div></div></div>`).join('');
 document.getElementById('teamView').innerHTML=html;
}
function move(d){current=(current+d+data.length)%data.length;render();}
let sx=0;
document.addEventListener('touchstart',e=>sx=e.changedTouches[0].screenX);
document.addEventListener('touchend',e=>{let dx=e.changedTouches[0].screenX-sx;if(Math.abs(dx)>60) move(dx<0?1:-1);});
function getAge(dob) {

  const birth = new Date(dob);

  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {

    age--;

  }

  return age;

}