//Määritellään muuttujia
var parser = new DOMParser;
var xml = null;
var valinta = document.getElementById("teatteriv");
var lista = document.getElementById("lista");
var teatterit = null;
var teatteri = null;
var teatteriID = null;
//Kun sivu avataan ajetaan funktio jossa...
window.onload = function () {
    //...haetaan fetchillä dataa osoitteesta...
    fetch('https://www.finnkino.fi/xml/TheatreAreas/')
        //...otetaan vastauksesta teksti...
        .then((response) => response.text())
        //...parsetaan teksti xml tiedostoksi
        .then((data) => xml = parser.parseFromString(data, "text/xml"))
        .then((xml) => {
            //xml tiedostosta haetaan kaikki TheatreArea tagit muuttujaan teatterit
            teatterit = xml.getElementsByTagName('TheatreArea');
            //Loopataan kaikki teatterit läpi ja yksitellen...
            for (var x = 0; x < teatterit.length; x++) {
                //...luodaan uusi option elementti...
                var vaihtoehto = document.createElement("option");
                //...haetaan teatterin nimi ja ID muuttujaan käsittelyssä olevasta teatterista...
                teatteri = xml.getElementsByTagName('Name')[x].childNodes[0].nodeValue;
                teatteriID = xml.getElementsByTagName('ID')[x].childNodes[0].nodeValue;
                console.log(teatteri + teatteriID);
                //...lisätään option elementin sisään teatterin id ja nimi...
                vaihtoehto.append(teatteriID + " " + teatteri);
                //...ja lopuksi lisätään option elementti selectin sisään...
                valinta.appendChild(vaihtoehto);
            }
        })
};
//Kun select elementin valittua vaihtoehtoa muutetaan ajetaan funktio jossa...
valinta.addEventListener("change", function () {
    //...ensin ostoslistasta tutulla funktiolla tyhjennetään lista...
    function poistaKaikki() {
        function lapsetVittuun(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
        let lista = document.getElementById('lista');
        lapsetVittuun(lista);
    }
    poistaKaikki();
    //Muuttujia
    var valinta = document.getElementById("teatteriv").value;
    var valintaid = valinta.substring(0, 4);
    console.log(valintaid);
    //...fetchillä haetaan taas dataa ja käsitellään sitä...
    fetch('https://www.finnkino.fi/xml/Events/?area=${' + valintaid + '}/?listType=${NowInTheatres}')
        .then((response) => response.text())
        .then((data) => xml = parser.parseFromString(data, "text/xml"))
        .then((xml) => {
            //...samaan tyyliin kuin aiemmin...
            var leffat = xml.getElementsByTagName('Event');
            //...for loopataan
            for (var z = 0; z < leffat.length; z++) {
                var li = document.createElement("li");
                var div1 = document.createElement("div");
                var div2 = document.createElement("div");
                var br = document.createElement("br");
                var br2 = document.createElement("br");
                var br3 = document.createElement("br");
                var p = document.createElement("p");
                var img = document.createElement("img");
                var leffakuva = xml.getElementsByTagName('EventSmallImagePortrait')[z].childNodes[0].nodeValue;
                var leffa = xml.getElementsByTagName('OriginalTitle')[z].childNodes[0].nodeValue;
                var julkaisu = xml.getElementsByTagName('dtLocalRelease')[z].childNodes[0].nodeValue;
                var leffainfo = xml.getElementsByTagName('ShortSynopsis')[z].childNodes[0].nodeValue;
                //Tässä leikataan leffan julkaisuajasta 10 merkkiä, jotta se olisi ainoastaan YYYY-MM-DD
                let leffaVuosiKk = julkaisu.substring(0, 10);
                console.log(leffa + leffainfo + julkaisu);
                //Kuvaa ei voi appendata suoraan, vaan se pitää lisätä img elementin attributeen src
                img.setAttribute("src", leffakuva);
                div1.setAttribute("id", "leffaNimi");
                div2.setAttribute("id", "leffaTiedot");
                li.append(img);
                li.append(br);
                div1.append(leffa);
                li.append(br2);
                div2.append(leffainfo);
                li.append(div1);
                li.append(div2);
                p.append("Julkaistu " + leffaVuosiKk);
                li.append(p);
                li.append(br3);
                lista.appendChild(li);
                //Käytännössä ainoa eroavaisuus aiempaan fetchiin on että tällä kertaa lisätään tietoa...
                //...li elementtien kautta listaan
            }
            //Määritellään muuttuja "sortataan", jolla sanotaan että sorttaus on käynnissä
            var sortataan = true;
            //Haetaan HTML dokumentista li elementit
            var li = document.getElementsByTagName("li");
            //Kun sorttaus on käynnissä
            while (sortataan) {
                //Otetaan sorttaus pois käynnistä
                sortataan = false;
                //For loopilla käydään kaikki li elementit yksitellen läpi
                for (var s = 0; s < (li.length - 1); s++) {
                    //Muuttuja, jolla sanotaan sortataanko käsittelyssä oleva li elementti
                    var sorttaus = false;
                    //Haetaan HTML dokumentista p elementit, koska halutaan sortata li:ssä olevan p:n sisällä olevan numeron mukaan
                    var p = document.getElementsByTagName("p");
                    //Jos käsittelyssä olevan li:ssä olevan p:n sisällä oleva numero on pienempi kuin seuraavan li:ssä olevan p:n numero...
                    if (p[s].innerHTML.toString().toLowerCase() > p[s + 1].innerHTML.toString().toLowerCase()) {
                        //...sortataan
                        sorttaus = true;
                        //Tarkistetaan uudestaan
                        break;
                    }
                }
                //Jos sortataan
                if (sorttaus) {
                    //...siirretään käsittelyssä oleva li ylöspäin
                    li[s].parentNode.insertBefore(li[s + 1], li[s]);
                    //Laitetaan sorttaus takaisin käyntiin
                    sortataan = true;
                }
            }
        })
});