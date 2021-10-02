// prérequi : node.js et la librairie Puppeteer installe avec la commande npm i puppeteer
// il faut aussi un navigateur headless comme chromium : https://download-chromium.appspot.com/



let totalData = '';
let i = 5;
let j = 2;


const puppeteer = require('puppeteer');
const fs = require('fs');

// ouvre un brower headless, crée une page puis charge l'URL, depuis l'URL en cours retrouve 
// le contnue des div
// souci : pas trouvé comment utiliser une variable pour lire la bonne position du tableau [] de la div clas=".f2"
puppeteer.launch({ headless: false }).then(async browser => {

  const page = await browser.newPage();

  for (i = 5; i < 18; i++) {
    // recupere la première page
    await page.goto(`https://www.listesdemots.net/mots${i}lettres.htm`);
    let stringNbPage = await page.evaluate(() => { return document.querySelectorAll('.f2')[10].textContent; });

    let data = await page.evaluate(() => { return document.querySelector('.mot').textContent; });
    totalData = totalData + data;
    // recupére les autres pages
    for (j = 2; j < Number(stringNbPage) + 1; j++) {
      await page.goto(`https://www.listesdemots.net/mots${i}lettrespage${j}.htm`);
      data = await page.evaluate(() => {
        return document.querySelector('.mot').textContent;
      });
      totalData = totalData + data;
    }
    // sauvegarde dans un fichier la liste des mot dans un fichier
    fichier(i);
  }
  // pour les mots de 18 lettres 
  i = 18;
  await page.goto(`https://www.listesdemots.net/mots${i}lettres.htm`);
  let data = await page.evaluate(() => { return document.querySelector('.mot').textContent; });
  totalData = totalData + data;
  for (j = 2; j < 5; j++) {
    await page.goto(`https://www.listesdemots.net/mots18lettrespage${j}.htm`);
    data = await page.evaluate(() => { return document.querySelector('.mot').textContent; });
    totalData = totalData + data;
  };
  fichier(i);

  // pour les mots de 19 lettres
  i = 19;
  // page 1
  await page.goto(`https://www.listesdemots.net/mots${i}lettres.htm`);
  data = await page.evaluate(() => { return document.querySelector('.mot').textContent; });
  totalData = totalData + data;
  // page 2
  j = 2;
  await page.goto(`https://www.listesdemots.net/mots18lettrespage${j}.htm`);
  data = await page.evaluate(() => { return document.querySelector('.mot').textContent; });
  totalData = totalData + data;
  fichier(i);
  // pour les mots de 20 et 21 lettres
  for (i = 20; i < 22; i++) {
    await page.goto(`https://www.listesdemots.net/mots${i}lettres.htm`);
    let data = await page.evaluate(() => { return document.querySelector('.mot').textContent; });
    totalData = totalData + data;
    fichier(i);
  }

  // crée un fichier JSON avec fs
  function fichier(nbLettre) {
    totalData = "const motDe" + nbLettre + "lettres = '" + totalData + "'   export{ motDe"+ i +"lettres,};";
    fs.writeFile(`motDe_${nbLettre}_lettres.js`, JSON.stringify(totalData), 'utf8', function (err) {
      if (err) {
        return console.log(err);
      };
      totalData = '';
      console.log('ok');
    });
  }

  browser.close();
  // i = 22
  // fichier(i);
});



