exports.action = function (data) {

console.log("les datas : ",data)

var cheerio = require('cheerio');var request = require('request');

var reg="/"+data.RecetteMarmiton+"(.+)/i" ; var rgxp = eval(reg) ; var temp = JarvisIA.reco.match(rgxp) ; console.log(temp)
var urlmarmitonTemp = temp[1].trim() ; console.log("on cherche : ",urlmarmitonTemp.replace("œ","oe"))
//temp=temp
var urlmarmiton="https://www.marmiton.org/recettes/recherche.aspx?aqt="+urlmarmitonTemp.replace("œ","oe")
console.log(urlmarmiton,"ddddddd")

request({'uri':urlmarmiton }, function (error, response, html) {

	$ = cheerio.load(html);

	var listRecetteUrl = [];
	$('.MRTN__sc-1gofnyi-0').find('a').each(function (index, element) {listRecetteUrl.push($(element).attr('href'));});
	console.log(listRecetteUrl)
	
	listRecetteUrl[0]=listRecetteUrl[0].replace('/recettes','') ; console.log(listRecetteUrl[0]+" recette trouvée")
	var urlmarmiton="https://www.marmiton.org/recettes"+listRecetteUrl[0]

		request({'uri':urlmarmiton, 'headers':{'Accept-Charset': 'utf-8'} }, function (error, response, html) {

			$ = cheerio.load(html);
			var listRecetteIngredients = [];
			
				$("div.MuiGrid-root").each(function () {
					listRecetteIngredients.push( ($(this).children().text()).replace(/\s{2,}/g, ' ')); console.log(($(this).children().text()).replace(/\s{2,}/g, ' '),'wwwwwwww')}
				)

			var listRecettePrepraration = [];
		//	$('div[class="recipe-step-list__container"]').each(function () {listRecettePrepraration.push( ($(this).find('p').text()).replace(/\s{2,}/g, ' '));                        })
				$(".SHRD__sc-juz8gd-3 > ul").each(function () {
					listRecettePrepraration.push( ($(this).find('p').text()).replace(/\s{2,}/g, ' ')); console.log(($(this).find('p').text()).replace(/\s{2,}/g, ' '),'rrrrrrr')}
				)

			
			JarvisAskMe('veux-tu les ingrédients ou la recette',function(result){
				console.log("retour askme me     :          "+result)
				if(result.search('ingrédients')>-1){JarvisIASpeech(JSON.stringify(listRecetteIngredients.shift()));return}
				if(result.search('recette')>-1){JarvisIASpeech(JSON.stringify(listRecettePrepraration));return}	
				JarvisIASpeech('je sors');return
			})

		})//fin request
})//fin request

}