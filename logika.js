var osszeTermek = [];
var kosar = [];
var aktivKategoria = 'all';

function termekekMegjelenites(termekek) {
  var racs = document.getElementById('termekRacs');
  racs.innerHTML = '';

  if (termekek.length === 0) {
    racs.innerHTML = '<div class="ures-allapot"><div class="ikon">🔍</div><p>Nincs találat!</p></div>';
    return;
  }

  for (var i = 0; i < termekek.length; i++) {
    var t = termekek[i];
    var kartya = document.createElement('div');
    kartya.className = 'termek-kartya';
    kartya.style.animationDelay = (i * 0.06) + 's';
    kartya.innerHTML =
      '<img class="termek-kep" src="' + t.image + '" alt="' + t.title + '" loading="lazy">' +
      '<div class="termek-info">' +
        '<div class="termek-nev">' + t.title + '</div>' +
        '<div class="termek-ar">$' + t.price + '</div>' +
        '<button class="kosarba-gomb" data-id="' + t.id + '">🛒 Kosárba</button>' +
      '</div>';
    racs.appendChild(kartya);
  }

  var gombok = document.querySelectorAll('.kosarba-gomb');
  for (var j = 0; j < gombok.length; j++) {
    gombok[j].addEventListener('click', function(e) {
      var gomb = e.currentTarget;
      kosarbaAd(parseInt(gomb.getAttribute('data-id')));
      gomb.classList.remove('nyomva');
      void gomb.offsetWidth;
      gomb.classList.add('nyomva');
      gomb.addEventListener('animationend', function() { gomb.classList.remove('nyomva'); }, { once: true });
    });
  }
}

function szures() {
  var keresett = document.getElementById('keresesMezo').value.toLowerCase();
  var eredmeny = osszeTermek.filter(function(t) {
    var kategoriaIllik = (aktivKategoria === 'all') || (t.category === aktivKategoria);
    var nevIllik = t.title.toLowerCase().indexOf(keresett) !== -1;
    return kategoriaIllik && nevIllik;
  });
  termekekMegjelenites(eredmeny);
}

function kategoriaGombokLetrehoz(kategoriak) {
  var tartaly = document.getElementById('kategoriak');
  tartaly.innerHTML = '';

  var osszeGomb = document.createElement('button');
  osszeGomb.className = 'kat-gomb aktiv';
  osszeGomb.textContent = 'Összes';
  osszeGomb.addEventListener('click', function() { kategoriaValaszt('all', osszeGomb); });
  tartaly.appendChild(osszeGomb);

  for (var i = 0; i < kategoriak.length; i++) {
    (function(kat) {
      var gomb = document.createElement('button');
      gomb.className = 'kat-gomb';
      gomb.textContent = kat;
      gomb.addEventListener('click', function() { kategoriaValaszt(kat, gomb); });
      tartaly.appendChild(gomb);
    })(kategoriak[i]);
  }
}

function kategoriaValaszt(kat, kattintottGomb) {
  aktivKategoria = kat;
  var osszeGomb = document.querySelectorAll('.kat-gomb');
  for (var i = 0; i < osszeGomb.length; i++) { osszeGomb[i].classList.remove('aktiv'); }
  kattintottGomb.classList.add('aktiv');
  szures();
}

function kosarbaAd(termekId) {
  var termek = null;
  for (var i = 0; i < osszeTermek.length; i++) {
    if (osszeTermek[i].id === termekId) { termek = osszeTermek[i]; break; }
  }
  if (!termek) return;

  var benneVan = false;
  for (var j = 0; j < kosar.length; j++) {
    if (kosar[j].id === termekId) { kosar[j].db++; benneVan = true; break; }
  }
  if (!benneVan) {
    kosar.push({ id: termek.id, nev: termek.title, ar: termek.price, kep: termek.image, db: 1 });
  }

  kosarFrissit();
  ertesitest('✓ Termék hozzáadva a kosárhoz!');
}

function kosarTorles(termekId) {
  kosar = kosar.filter(function(elem) { return elem.id !== termekId; });
  kosarFrissit();
}

function kosarFrissit() {
  var osszeDb = 0;
  for (var i = 0; i < kosar.length; i++) { osszeDb += kosar[i].db; }

  var jelveny = document.getElementById('kosarJelveny');
  jelveny.style.display = osszeDb > 0 ? 'flex' : 'none';
  jelveny.textContent = osszeDb;

  var tartaly = document.getElementById('kosarTermekek');
  var vegosszeg = document.getElementById('kosarVegosszeg');

  if (kosar.length === 0) {
    tartaly.innerHTML = '<div class="kosar-ures">🛒<br>A kosár üres.</div>';
    vegosszeg.textContent = '$0.00';
    return;
  }

  tartaly.innerHTML = '';
  var osszeg = 0;
  for (var j = 0; j < kosar.length; j++) {
    var elem = kosar[j];
    osszeg += elem.ar * elem.db;
    var div = document.createElement('div');
    div.className = 'kosar-elem';
    div.innerHTML =
      '<img class="kosar-kep" src="' + elem.kep + '" alt="' + elem.nev + '">' +
      '<div class="kosar-info">' +
        '<div class="kosar-nev">' + elem.nev + '</div>' +
        '<div class="kosar-ar">$' + elem.ar + ' × ' + elem.db + '</div>' +
      '</div>' +
      '<button class="kosar-torol" data-id="' + elem.id + '">✕</button>';
    tartaly.appendChild(div);
  }

  var torolGombok = tartaly.querySelectorAll('.kosar-torol');
  for (var k = 0; k < torolGombok.length; k++) {
    torolGombok[k].addEventListener('click', function(e) {
      kosarTorles(parseInt(e.currentTarget.getAttribute('data-id')));
    });
  }

  vegosszeg.textContent = '$' + osszeg.toFixed(2);
}

function kosarNyit() {
  document.getElementById('kosarFedel').classList.add('nyitva');
  document.getElementById('kosarPanel').classList.add('nyitva');
  kosarFrissit();
}

function kosarZar() {
  document.getElementById('kosarFedel').classList.remove('nyitva');
  document.getElementById('kosarPanel').classList.remove('nyitva');
}

function ertesitest(uzenet) {
  var e = document.getElementById('ertesites');
  e.textContent = uzenet;
  e.classList.add('latszik');
  setTimeout(function() { e.classList.remove('latszik'); }, 2200);
}

function termekekBetolt() {
  fetch('https://fakestoreapi.com/products')
    .then(function(valasz) { return valasz.json(); })
    .then(function(termekek) { osszeTermek = termekek; termekekMegjelenites(termekek); })
    .catch(function() {
      document.getElementById('termekRacs').innerHTML =
        '<div class="ures-allapot"><div class="ikon">⚠️</div><p>Nem sikerült betölteni a termékeket.</p></div>';
    });
}

function kategoriaklBetolt() {
  fetch('https://fakestoreapi.com/products/categories')
    .then(function(valasz) { return valasz.json(); })
    .then(function(kategoriak) { kategoriaGombokLetrehoz(kategoriak); });
}

document.getElementById('kosarNyitGomb').addEventListener('click', kosarNyit);
document.getElementById('kosarZarGomb').addEventListener('click', kosarZar);
document.getElementById('kosarFedel').addEventListener('click', kosarZar);
document.getElementById('keresesMezo').addEventListener('input', szures);
document.getElementById('rendelesGomb').addEventListener('click', function() {
  alert('Köszönjük a rendelést! 🎉');
  kosar = [];
  kosarFrissit();
  kosarZar();
});

kategoriaklBetolt();
termekekBetolt();
