let data, current = 0;
let currentTeamPlayers = [];

fetch('worldcup2026.json')
  .then(r => r.json())
  .then(d => {
    data = d.teams;
    render();
  });

function teamRating(players) {
  return Math.round(
    players.reduce((a, p) => a + (p.rating || 0), 0) / players.length
  );
}

function getAge(dob) {
  if (!dob) return "?";

  const birth = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const m = today.getMonth() - birth.getMonth();

  if (
    m < 0 ||
    (m === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

function render() {
  const t = data[current];

  currentTeamPlayers = t.players;

  document.getElementById('teamInfo').innerHTML = `
    <div>${t.flag || ''} ${t.name} | OVR ${teamRating(t.players)}</div>
    <div class="controls">
      <button onclick="move(-1)">◀</button>
      <button onclick="move(1)">▶</button>
    </div>
  `;

  const html = t.players.map((p, idx) => `
    <div class="card" onclick="showPlayer(${idx})">

      <img
        src="${p.photo || ''}"
        onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}'">

      <div>
        <div><b>${p.name}</b></div>

        <div>
          ${p.position || '-'} •
          ${getAge(p.dob)} •
          ${p.club || '-'}
        </div>

        <div class="rating">
          ${p.rating || '-'}
        </div>
      </div>

    </div>
  `).join('');

  document.getElementById('teamView').innerHTML = html;
}

function showPlayer(index) {

  const player = currentTeamPlayers[index];

  if (!player) return;

  const img =
    player.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}`;

  document.getElementById('modalBody').innerHTML = `
    <img
      src="${img}"
      onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}'"
      style="width:120px;height:120px;border-radius:50%;object-fit:cover">

    <h2>${player.name}</h2>

    <p><b>Position:</b> ${player.position || '-'}</p>
    <p><b>Age:</b> ${getAge(player.dob)}</p>
    <p><b>Club:</b> ${player.club || '-'}</p>
    <p><b>Rating:</b> ${player.rating || '-'}</p>
  `;

  document.getElementById('playerModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('playerModal').style.display = 'none';
}

function move(d) {
  current = (current + d + data.length) % data.length;
  render();
}

let sx = 0;

document.addEventListener('touchstart', e => {
  sx = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].screenX - sx;

  if (Math.abs(dx) > 60) {
    move(dx < 0 ? 1 : -1);
  }
});

window.addEventListener('click', e => {
  const modal = document.getElementById('playerModal');

  if (e.target === modal) {
    closeModal();
  }
});