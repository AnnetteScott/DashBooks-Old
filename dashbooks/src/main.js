import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Quasar } from 'quasar';
import quasarUserOptions from './quasar-user-options';
import { reactive } from 'vue';

/* fs doesn't work
const fs = module.constructor._load('fs');
let pjson = require('../package.json');
const userDictMaster = {"projects": {}, "clients": {}, "colours": {'colourWhite':{'name': 'Clear', 'colour': '#ffffff'}}, "users": {}, "records": {"accounts": [], "categories": {}, 'savedTransactions': {}}, "saveVersion": 15, "showGST": true, "version": pjson.version}

function read_file(path){
    return fs.readFileSync(path, 'utf8');
}


const dataPath = app.getPath('userData') + "\\saveData";

if(!fs.existsSync(dataPath)){
    fs.mkdirSync(dataPath);
    fs.mkdirSync(dataPath + "\\receipts");
    fs.writeFile({path: dataPath + "\\settings.json", contents: JSON.stringify({'saveFilePath': `${dataPath + "\\userData.json"}`})});
    fs.writeFile({path: dataPath + "\\userData.json", contents: JSON.stringify(userDictMaster)});
} 

const settingsObj = JSON.parse(read_file(dataPath + "/settings.json"));

let userDictRead = JSON.parse(read_file(settingsObj['saveFilePath']));
userDictRead['version'] = pjson.version;
*/

let userDictRead = {"projects":{"otkcl":{"name":"Vircadia Website","colours":["colourWhite","FGAsO","PlUsT","DYXjQ","euqlh","kcwJL","kIzIH","fsLvT"],"weeks":{"1 - 2":{"startDate":"3/1/22","colouredCells":{"FGAsO":["A96","A95","A94","A93","A92","A91","A90","A89","A88","A87","A86","A85","A84","A83","B96","B95","B94","B93","B92","B91","B90","B89","B88","B87","B86","B85","B84","B83","B82","B81","B80","B79","B78","B77","B76","B75","B74","B73","B72","D96","D95","D94","D93","D92","D91","D90","D89","D88","D87","D86","D85","D84","D83","D82","D81","D80","D79","E96","E95","E94","E93","E92","E91","E90","E89","E88","E87","E86","E85","E84","E83","E82","E81","E80","E79","E78","E77","F90","F91","F92","F93","F94","F95","F96","F89","F88","F87","F86","F85","F84","F83","F82","F81","F80","F79","G96","G95","G94","H96","H95","H94","H93","H92","H91","H90","H89","H88","H87","H86","H85","H84","H83","I81","I82","I83","I84","I85","I86","I87","I88","I89","I90","I91","I92","I93","I94","I95","I96","J96","J95","J94","J93","J92","J91","J90","J89","J88","J87","J86","J85","J84","J83","K96","K95","K94","K93","K92","K91","K90","K89","K88","K87","K86","K85","K84","K83","K82","K81","K80","K79","K78","K77","K76","K75","M96","M95","M94","M93","M92","M91","M90","M89","M88","M87","M86","M85","M84","N96","N95","N94","N93","N92","N91","N90","N89","N88","N87","N86","N85","N84","N83","N82","N81","N80","N79","N78","N77","N76","N75","N74","N73","N72","N71"],"PlUsT":["B68","B69","B70","B71","G93","G92","G91","G90"],"DYXjQ":["H82","H81","H80","H79","H78","H77","H76","H75","H74","H73","H72","H71","H70","H69","I80","I79","I78","I77","K74","K73","K72","K71","K70","K69","K68"],"euqlh":["K67","K66","K65","K64","K63","K62","K61","K60","K59"],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":true},"3 - 4":{"startDate":"17/01/22","colouredCells":{"FGAsO":[],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":true},"5 - 6":{"startDate":"31/01/22","colouredCells":{"FGAsO":[],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":true},"7 - 8":{"startDate":"14/02/22","colouredCells":{"FGAsO":[],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":true},"9 - 10":{"startDate":"28/02/22","colouredCells":{"FGAsO":[],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":true},"11 - 12":{"startDate":"14/03/22","colouredCells":{"FGAsO":["C96","C95","C94","C93","C92","C91","C90","C89","C88","C87","C86","C85","C84","C83","C82","C81","C80","C79","D96","D95","D94","D93","D92","D91","E96","E95","E94","E93","E92","E91","E90","E89","E88","E87","E86","E85","E84","E83","E82","E81","E80","E79","E68","E69","E70","E71","E72","E73","E74","E75","E76","E77","E78","F96","F95","F94","F93","F92","F91","H96","H95","H94","H93","H92","I96","I95","I94","I93","I92","I91","I90","I89","I88","I87","I86","I85","I84","I83","I82","I81","I80","I79","I78","I77","I76","I75","I74","I73","I72","J96","J95","J94","J93","J92","J91","J90","J89","J88","J87","J86","J85","J84","J83","J82","J81","L96","L95","L94","L93","M79","M80","M81","M82","M83","M84","M85","M86","M87","M88","M89","M90","M91","M92","M93","M94","M95","M96","N1","N2","I71","N96","N95","N94","N93","N92","N91","N90","N89","N88","N87"],"PlUsT":["M78","M77","M76","M75"],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":true},"13 - 14":{"startDate":"28/03/22","colouredCells":{"FGAsO":["E52","F51","F52","F90","G81","G48","G82","G83","G84","G85","G86","G87","G88","G89","G91","G92","G95","G96","G94","G93","H45","H46","H47","H66","H67","H63","H64","H71","H72","H73","H91","H92","H93","H94","H95","I56","I57","I58","I73","I74","I72","I75","I79","I80","I81","I78","I82","I86","I87","I88","I89","I90","I92","I93","I94","K47","K48","K49","K53","K54","K55","K57","K58","K59","K61","K71","K72","K73","K74","K75","K85","K86","K84","K89","K90","K91","K92","K95","K96","L1","L2","L5","L4","L6","L7","L8","M43","M45","M46","M47","M48","M49","M50","M57","M59","M61","M62","M63","M73","M74","M75","M76","N41","N42","N43","N44","N45","N46","N47","N49","N50","N51","N52","N54","N55","N56","N57","N58","N59","N61"],"PlUsT":["I53","I54","I55"],"DYXjQ":["E54","E55","E56","E83","E84","E85","E86","E89","E90","E92","F45","F46","F47","F48","F87"],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":true},"15 - 16":{"startDate":"11/04/22","colouredCells":{"FGAsO":["E58","E59","E60","E75","E76","E77","E78","E79","E89","E90","E91","E92","E93","E88","E94","E95","E96","E87","E86","E85","F9","F10","F11","F12","J49","K30","K31"],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":true},"17 - 18":{"startDate":"25/04/22","colouredCells":{"FGAsO":["B49","B50","B51","B75","B76","B77","B78","B79","B80","B81","B82","B83","B84","B86","B87","C36","C37","C38","C39","C40","C45","C46","C47","C48","C49","C50","C51","C52","C55","C56","C57","C58","C59","C60","C61","C62","C63","C64","C88","C89","C90","C91","C92","C93","D1","D2","D3","D61","D62","D63","D64","D84","K50","K51","K52","K56","K55","K58","K59","K61","K62","K60","K76","K77","K78","K79","K80","K81","K94"],"PlUsT":["B53","B54","B55","B56","B57"],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":false},"19 - 20":{"startDate":"09/05/22","colouredCells":{"FGAsO":["A45","A46","A47","A48","A73"],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":false}},"timeList":["00:00","00:15","00:30","00:45","01:00","01:15","01:30","01:45","02:00","02:15","02:30","02:45","03:00","03:15","03:30","03:45","04:00","04:15","04:30","04:45","05:00","05:15","05:30","05:45","06:00","06:15","06:30","06:45","07:00","07:15","07:30","07:45","08:00","08:15","08:30","08:45","09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45","21:00","21:15","21:30","21:45","22:00","22:15","22:30","22:45","23:00","23:15","23:30","23:45"],"duration":20,"weekInterval":2,"timeInterval":15,"targetHours":0},"eYTJv":{"name":"ED3N","colours":["colourWhite","FGAsO","PlUsT","DYXjQ","euqlh","kcwJL","kIzIH","fsLvT"],"weeks":{"1 - 2":{"startDate":"25/04/22","colouredCells":{"FGAsO":["D122","D124","E73","E74","E75","E76","E77","E78","E79","E80","E81","E82","E83","E84","E85","E70","E71","E72","E62","E86","E87","E88","E89","E90","E91","E119","G86","G87","G88","G89","G90","G91","G92","G93","G94","G95","G96","G97","G98","G101","G102","G103","G104","G105","G106","G107","G127","G128","G129","G130","G131","G133","G134","G135","G136","G137","G138","G139","G140","H2","H3","H4","H5","H7","H8","H9","H10","H11","H12","H82","H83","H84","H85","H86","H87","H88","H89","H132","H133","H134","H135","H136","H137","H138","I116","I117","I118","I121","I119","K133","K134","K135","K136","K137","K138","M74","M75","M76","M77","M78"],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":["G85"]},"invoiced":false},"3 - 4":{"startDate":"09/05/22","colouredCells":{"FGAsO":["A81","A82","A123","A124","A125","A126","A127","A128","A136","A135","A141","A142","B66","B69","B70","B71","B73","B74","B75"],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":false}},"timeList":["00:00","00:10","00:20","00:30","00:40","00:50","01:00","01:10","01:20","01:30","01:40","01:50","02:00","02:10","02:20","02:30","02:40","02:50","03:00","03:10","03:20","03:30","03:40","03:50","04:00","04:10","04:20","04:30","04:40","04:50","05:00","05:10","05:20","05:30","05:40","05:50","06:00","06:10","06:20","06:30","06:40","06:50","07:00","07:10","07:20","07:30","07:40","07:50","08:00","08:10","08:20","08:30","08:40","08:50","09:00","09:10","09:20","09:30","09:40","09:50","10:00","10:10","10:20","10:30","10:40","10:50","11:00","11:10","11:20","11:30","11:40","11:50","12:00","12:10","12:20","12:30","12:40","12:50","13:00","13:10","13:20","13:30","13:40","13:50","14:00","14:10","14:20","14:30","14:40","14:50","15:00","15:10","15:20","15:30","15:40","15:50","16:00","16:10","16:20","16:30","16:40","16:50","17:00","17:10","17:20","17:30","17:40","17:50","18:00","18:10","18:20","18:30","18:40","18:50","19:00","19:10","19:20","19:30","19:40","19:50","20:00","20:10","20:20","20:30","20:40","20:50","21:00","21:10","21:20","21:30","21:40","21:50","22:00","22:10","22:20","22:30","22:40","22:50","23:00","23:10","23:20","23:30","23:40","23:50"],"duration":4,"weekInterval":2,"timeInterval":10,"targetHours":10},"uWWbz":{"name":"Goobieverse Website","colours":["colourWhite","FGAsO","PlUsT","DYXjQ","euqlh","kcwJL","kIzIH","fsLvT"],"weeks":{"1 - 2":{"startDate":"11/04/22","colouredCells":{"FGAsO":["F59","F65","F66","F67","F68","F96","F95","F94","F93","G1","G2","G3","G6","G7","G8","G9","G10","G11","G12","G13","G14","G15","G57","G58","G59","G60","G61","G62","H58","H59","H60","H61","H62","H65","H69","H70","H73","H74","H75","H76","H79","H81","H82","H85","I28","I29","I30","I31","I51","I52","I53","I54","I55","I56","I57","I61","I67","I68","I69","I70","I71","I72","I73","I77","I78","I81","I96","J1","J2","J5","J6","J7","J8","K12","K57","K58","L38","L40","L41","L42","L44","L48","L49","L50","L51","L52","L53","L54","L56","L57","L58","L59","L60","L72","L73","L74","L76","L77","L78","L79","L81","L82","L83","L84","L85","L86","L88","M95","M94","M93","M92","M91","M90","M88","M87","M86","M85","M84","M83","N77","N78","N79","N80","N83","N84","N85","N73","N72","N71","N66","N61","N60","N55","N54","N53","M44","M45","M46","M47","N95","N96"],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":["H63","H64","H71","H72","H80","I80","I79","I47","I48","I49","I50","I58","I59","I60","I76","I75","I74","J3","J4","J48","J49","J50","J57","J56","L39","M82","M81","M80","M79","M78","M77","N59","N58","N57","N56"]},"invoiced":true},"3 - 4":{"startDate":"25/04/22","colouredCells":{"FGAsO":[],"PlUsT":[],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":[]},"invoiced":false},"5 - 6":{"startDate":"09/05/22","colouredCells":{"FGAsO":["A96","B78","B79","B80","B81","B82","B52","B53","B54","B55","B56","B57","B58","B84","B85","C51","C52","C53","C54","C55","C56","C82","C83","C84","C85","C86","C87","C88","C91","C92","C93","D3","D4","D5","D6","D7","D8","D44","D54","D55","D56","D57","D58","D59","D60"],"PlUsT":["B59","B60","B61"],"DYXjQ":[],"euqlh":[],"kcwJL":[],"kIzIH":[],"fsLvT":["C94","C95","C96"]},"invoiced":false}},"timeList":["00:00","00:15","00:30","00:45","01:00","01:15","01:30","01:45","02:00","02:15","02:30","02:45","03:00","03:15","03:30","03:45","04:00","04:15","04:30","04:45","05:00","05:15","05:30","05:45","06:00","06:15","06:30","06:45","07:00","07:15","07:30","07:45","08:00","08:15","08:30","08:45","09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45","21:00","21:15","21:30","21:45","22:00","22:15","22:30","22:45","23:00","23:15","23:30","23:45"],"duration":6,"weekInterval":2,"timeInterval":15,"targetHours":60}},"clients":{"TqYRt":{"client":"DigiSomni","name":"Kalila Lakeworth","addOne":"DigiSomni","addTwo":"Melbourne","city":"Florida","country":"United States","contact":""}},"colours":{"colourWhite":{"name":"Clear","colour":"#ffffff"},"FGAsO":{"name":"General","rate":"25.00","colour":"#11d418"},"PlUsT":{"name":"Meeting","rate":"15.00","colour":"#d49711"},"DYXjQ":{"name":"Training","rate":"12.50","colour":"#05c1f0"},"euqlh":{"name":"Debug","rate":"25.00","colour":"#d11010"},"kcwJL":{"name":"Set Up","rate":"25.00","colour":"#e60ab6"},"kIzIH":{"name":"Docs","rate":"25.00","colour":"#500a8a"},"fsLvT":{"name":"Graphic Design","rate":"25.00","colour":"#0a49db"}},"users":{"qUnCv":{"user":"Zak Manley","name":"Zak Manley","addOne":"Unit 5G","addTwo":"15 Mount Street","city":"Auckland CBD, Auckland","country":"New Zealand","contact":""}},"records":{"accounts":["Visa","Business"],"categories":{"Contract Work":true,"LVA":true,"Rent":true,"Power":true,"Internet":true,"Salary":false,"Tax & SL":false},"2021 - 2022":{"transactions":{"qHqmQ":{"month":"Apr","date":"09/04/2022","account":"Visa","type":"Debit","item":"Monitor","category":"LVA","amount":-799,"receiptID":"","payee":""}},"assets":{}},"2022 - 2023":{"transactions":{"nAYDK":{"month":"Apr","date":"19/04/2022","account":"Business","type":"Credit","item":"DigiSomni - VMW007","category":"Contract Work","amount":803,"receiptID":"","payee":"","id":"nAYDK"},"xXDHN":{"month":"Apr","date":"01/04/2022","account":"Business","type":"Credit","item":"DigiSomni - VMW006","category":"Contract Work","amount":884,"receiptID":"","payee":"","id":"xXDHN"},"nLsAa":{"month":"Apr","date":"23/04/2022","account":"Business","type":"Debit","item":"PB TECH - Power Supply","category":"LVA","amount":-218.99,"receiptID":"UIjsJ","payee":"","id":"nLsAa"},"txXQd":{"month":"Apr","date":"07/04/2022","account":"Visa","type":"Debit","item":"Supercity Rental - Rent","category":"Rent","amount":-76,"receiptID":"","payee":"","id":"txXQd"},"Mcxpe":{"month":"Apr","date":"14/04/2022","account":"Visa","type":"Debit","item":"Supercity Rental - Rent","category":"Rent","amount":-76,"receiptID":"","payee":"","id":"Mcxpe"},"VJLfu":{"month":"Apr","date":"20/04/2022","account":"Visa","type":"Debit","item":"Electric Kiwi - Power","category":"Power","amount":-10,"receiptID":"","payee":"","id":"VJLfu"},"KriQX":{"month":"Apr","date":"21/04/2022","account":"Visa","type":"Debit","item":"Supercity Rental - Rent","category":"Rent","amount":-76,"receiptID":"","payee":"","id":"KriQX"},"tYbNb":{"month":"Apr","date":"28/04/2022","account":"Visa","type":"Debit","item":"Supercity Rental - Rent","category":"Rent","amount":-76,"receiptID":"","payee":"","id":"tYbNb"},"wVxRy":{"month":"Apr","date":"14/04/2022","account":"Visa","type":"Debit","item":"Hot Shot - Internet","category":"Internet","amount":-16,"receiptID":"","payee":"","id":"wVxRy"},"Creje":{"month":"Apr","date":"29/04/2022","account":"Business","type":"Debit","item":"20%","category":"Tax & SL","amount":-160,"receiptID":"","payee":"","id":"Creje"},"HxnaQ":{"month":"May","date":"03/05/2022","account":"Business","type":"Debit","item":"Salary","category":"Salary","amount":-450,"receiptID":"","payee":"","id":"HxnaQ"},"CNIta":{"month":"May","date":"03/05/2022","account":"Business","type":"Credit","item":"DigiSomni - GVW-001 & VMW-008","category":"Contract Work","amount":1262.75,"receiptID":"","payee":"","id":"CNIta"},"bDWPL":{"month":"May","date":"10/05/2022","account":"Business","type":"Debit","item":"Salary","category":"Salary","amount":-450,"receiptID":"","id":"bDWPL"}},"assets":{}},"savedTransactions":{"DuReb":{"account":"Visa","type":"Debit","item":"Supercity Rental - Rent","category":"Rent","amount":-76},"SjMiV":{"account":"Visa","type":"Debit","item":"Electric Kiwi - Power","category":"Power","amount":-10},"pLwLL":{"account":"Visa","type":"Debit","item":"Hot Shot - Internet","category":"Internet","amount":-16},"feECe":{"account":"Business","type":"Debit","item":"Salary","category":"Salary","amount":-450}},"payee":[]},"saveVersion":15,"showGST":false,"version":"4.1.7"}

function saveChecker(){
    let pjson = require('../package.json');
    if(userDictRead['saveVersion'] == 4){
        userDictRead['records']['accounts'] = [];
        userDictRead['records']['categories'] = ['Contract Work'];
        userDictRead['saveVersion'] = 5;
    }
    if(userDictRead['saveVersion'] == 5){
        userDictRead['records']['homeExpenses'] = {};
        userDictRead['saveVersion'] = 6;
    }
    if(userDictRead['saveVersion'] == 6){
        userDictRead['colours']['colourWhite']['name'] = 'Clear';
        for(const[projectID, projectDict] of Object.entries(userDictRead['projects'])){
            for(const[weekID, weekDict] of Object.entries(projectDict['weeks'])){
                userDictRead['projects'][projectID]['weeks'][weekID]['invoiced'] = false;
                weekDict['invoiced'] = false;
            }
        }
        userDictRead['saveVersion'] = 7;
    }
    if(userDictRead['saveVersion'] == 7){
        for(const[projectID, projectDict] of Object.entries(userDictRead['projects'])){
            projectDict['targetHours'] = 0;
            projectID;
        }
        userDictRead['saveVersion'] = 8;
    }
    if(userDictRead['saveVersion'] == 8){
        for(const[yearID, recordsDict] of Object.entries(userDictRead['records'])){
            if(yearID != 'accounts' && yearID != 'categories' && yearID != 'homeExpenses'){
                if(recordsDict['transactions'] != undefined){
                    for(const[transID, transDict] of Object.entries(recordsDict['transactions'])){
                        transDict['receiptID'] = '';
                        transID;
                    }
                }
                
            }
        }
        userDictRead['saveVersion'] = 9;
    }
    if(userDictRead['saveVersion'] == 9){
        delete userDictRead['records']['homeExpenses']
        userDictRead['records']['savedTransactions'] = {}
        userDictRead['saveVersion'] = 10;
    }
    if(userDictRead['saveVersion'] == 10){
        let categoryCopy = [... userDictRead['records']['categories']];
        userDictRead['records']['categories'] = {};
        categoryCopy.forEach(item => {
            userDictRead['records']['categories'][item] = true;
        });
        userDictRead['saveVersion'] = 11;
    }
    if(userDictRead['saveVersion'] == 11){
        userDictRead['records']['payee'] = [];
        userDictRead['saveVersion'] = 12;
    }
    if(userDictRead['saveVersion'] == 12){
        for(const[yearID, recordsDict] of Object.entries(userDictRead['records'])){
            if(yearID != 'accounts' && yearID != 'categories' && yearID != 'homeExpenses'){
                if(recordsDict['transactions'] != undefined){
                    for(const[transID, transDict] of Object.entries(recordsDict['transactions'])){
                        transDict['payee'] = '';
                        transID;
                    }
                }
            }
        }
        userDictRead['saveVersion'] = 13;
    }
    if(userDictRead['saveVersion'] == 13){
        userDictRead['showGST'] = true;
        userDictRead['saveVersion'] = 14;
    }
    if(userDictRead['saveVersion'] == 14){
        userDictRead['version'] = pjson.version;
        userDictRead['saveVersion'] = 15;
    }
    if(userDictRead['saveVersion'] == 15){
        for(const[projectID, projectDict] of Object.entries(userDictRead['projects'])){
            for(const[weekID, weekDict] of Object.entries(projectDict['weeks'])){
                for(const[colourID, cellsArr] of Object.entries(weekDict['colouredCells'])){
                    cellsArr.forEach((cellID, i) => {
                        let cellInt = parseInt(cellID.substring(1)) - 1;
                        let cellCol = cellID.charAt(0);
                        cellsArr[i] = `${cellCol}${cellInt}`
                    })
                }
            }
        }
        userDictRead['saveVersion'] = 16;
    }
    userDictRead['version'] = pjson.version;
}
saveChecker();

export const userDict = reactive({...userDictRead})

let myApp = createApp(App)
myApp.use(Quasar, quasarUserOptions).use(router).mount('#app')