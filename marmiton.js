exports.action = function (data) {

console.log("les datas : ",data)

var cheerio = require('cheerio');var request = require('request');

var reg="/"+data.RecetteMarmiton+"(.+)/i" ; var rgxp = eval(reg) ; var temp = JarvisIA.reco.match(rgxp) ; console.log(temp)
var urlmarmitonTemp = temp[1].trim() ; console.log("on cherche : ",urlmarmitonTemp)

var urlmarmiton="https://www.marmiton.org/recettes/recherche.aspx?aqt="+urlmarmitonTemp

request({'uri':urlmarmiton }, function (error, response, html) {

	$ = cheerio.load(html);

	var listRecetteUrl = [];
	$('div[class="recipe-card"]').find('div > div > a').each(function (index, element) {listRecetteUrl.push($(element).attr('href'));});

	var listRecette = [];
	$('div[class="recipe-card"]').find('div > div > a> div >h4').each(function (index, element) {listRecette.push($(element).text());});

	listRecetteUrl[0]=listRecetteUrl[0].replace('/recettes','') ; console.log(listRecetteUrl[0]+" recette trouvée")
	urlmarmiton="https://www.marmiton.org/recettes"+listRecetteUrl[0]

		request({'uri':urlmarmiton, 'headers':{'Accept-Charset': 'utf-8'} }, function (error, response, html) {

			$ = cheerio.load(html);

			var listRecetteIngredients = [];
			$(".recipe-ingredients__list .recipe-ingredients__list__item").each(function () {listRecetteIngredients.push( ($(this).find('.recipe-ingredient-qt').text() + $(this).find('.ingredient').text()).replace(/\s{2,}/g, ' '));                        })
			console.dir("ingrédients : "+listRecetteIngredients);

			var listRecettePrepraration = [];
			$('li[class="recipe-preparation__list__item"]').each(function (index, element) {listRecettePrepraration.push($(element).text().trim());});
			console.dir("déroulement : "+listRecettePrepraration+listRecettePrepraration.length);

			JarvisAskMe('veux-tu les ingrédients ou la recette',function(result){
				console.log("retour askme me     :          "+result)
				if(result.search('ingrédients')>-1){JarvisIASpeech(JSON.stringify(listRecetteIngredients));return}
				if(result.search('recette')>-1){JarvisIASpeech(JSON.stringify(listRecettePrepraration));return}	
				JarvisIASpeech('je sors');return
			})

		})//fin request
})//fin request

}