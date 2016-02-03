/**
 * Created by Alex on 20.01.16.
 */
/**
 * Created by Alex on 14.01.16.
 */
var request = require("request");
var fs = require('fs');
var http = require('http');
var parser = require('xml2json');


//var parser = require("./parseStringFromCaliforniaGasPrices");


var data = [];
var index = 0;
var baseURL = 'www.swissworldcargo.com';
// First I want to read the file

var main = function(){
    fs.readFile('swissworldcargo.json', function read(err, response) {
        if (err) {
            //throw err;
            console.log('Файл swissworldcargo.json не найден.');

        }else{
            data = JSON.parse(response);
            parse();
        }
        console.log('Всего записей в базе '+data.length);
        // Invoke the next step here however you like
        //console.log(content);   // Put all of the code here (not the best solution)
    });

}


var parse = function(){
    if (index+1>data.length){
        console.log('Congratulation!');
        fs.writeFile('swissworldcargoDetail.json', JSON.stringify(data));
        return;
    }

    request('https://'+baseURL+data[index].destinationpageurl, function (error, response, body) {
        console.log(error);
        if (!error && response.statusCode == 200) {
            console.log('index ' + index);
            data[index].fullhtml= body;
            index++;
            parse();
        }
    })

    //var cheerio = require('cheerio'),
    //    $ = cheerio.load(baseURL+data[index].destinationpageurl);

}
var cargofluxMain = function(){
    fs.readFile('cargolux.json', function read(err, response) {
        if (err) {
            //throw err;
            console.log('Файл cargolux.json не найден.');

        }else{
            data = JSON.parse(response);
            cargofluxParse();
        }
        console.log('Всего записей в базе '+data.length);
        // Invoke the next step here however you like
        //console.log(content);   // Put all of the code here (not the best solution)
    });
}

var cargofluxParse = function(){
    //http://www.cargolux.com/Network/StationData.php?sId=393
    if (index+1>data.length){
        console.log('Congratulation!');
        fs.writeFile('cargoluxDetail.json', JSON.stringify(data));
        return;
    }

    request('http://www.cargolux.com/Network/StationData.php?sId='+data[index].id, function (error, response, body) {
        console.log(error);
        if (!error && response.statusCode == 200) {
            console.log('index ' + index);
            //console.log('body ' + body);
            //console.log(data[index]);
            data[index].detail = JSON.parse(parser.toJson(body)).cityData.Station;
            //console.log(JSON.parse(parser.toJson(body)).cityData.Station);
            //data[index].fullhtml= body;
            index++;
            cargofluxParse();
        }
    })
}


//main();//swissworldcargo
cargofluxMain();//cargoflux