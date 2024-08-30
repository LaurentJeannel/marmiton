exports.action = function (data) {

var cheerio = require('cheerio');
var request = require('request');

var reg="/"+data.RecetteMarmiton+"(.+)/i" ; var rgxp = eval(reg) ; var temp = JarvisIA.reco.match(rgxp) ; console.log(temp)
var urlMarmiton = 'https://www.marmiton.org/recettes/recherche.aspx?aqt='+temp[1].trim();

console.log(urlMarmiton)

  request({ uri: urlMarmiton }, function (error, response, html) {
    var $ = cheerio.load(html);
    var listRecetteUrl = [];

    $('.recipe-results').find('a').each(function (index, element) {
      listRecetteUrl.push($(element).attr('href'));
    });

    var recetteUrl = listRecetteUrl[0]
    console.log(recetteUrl)
  

///////////////

        request({ uri: recetteUrl, headers: { 'Accept-Charset': 'utf-8' } }, function (error, response, html) {
            
          $ = cheerio.load(html);
          console.log($(".mrtn-recette_ingredients-items").text().replace(new RegExp("  ", 'ig'),"").replace(/\s{2,}/g, ' '))
          listRecetteIngredients=$(".mrtn-recette_ingredients-items").text().replace(new RegExp("  ", 'ig'),"").replace(/\s{2,}/g, ' ')

          console.log($(".recipe-step-list__container").text().replace(new RegExp("  ", 'ig'),"").replace(/\s{2,}/g, ' '))
          listRecettePreparation= $(".recipe-step-list__container").text().replace(new RegExp("  ", 'ig'),"").replace(/\s{2,}/g, ' ')
 

          JarvisAskMe('veux-tu les ingrédients ou la recette', function (result) {
              if (result.search('ingrédients') > -1) {
                  JarvisIASpeech(listRecetteIngredients);
              }
              else if (result.search('recette') > -1) {
                  JarvisIASpeech(listRecettePreparation);
              } 
              else {
          JarvisIASpeech('je sors');
        }
      });
    });
  });
};
