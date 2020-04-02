const { VK } = require('vk-io');
const axios = require('axios');
const needle = require("needle");
const parser = require('xml2json');
const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs')
key = 'yandex translate token here'
var translate = require('yandex-translate')(key)
let v = 5.101
let t1ken = 'enter your token here';
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost', // link to mysql database
    user     : 'root', // username
    password : 'smthpsswd', // password
    database : 'links' // DB name
});
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

const vk = new VK({
    token: 'enter your token here'
});

vk.updates.on('message', async (data, next) => {
    let chk = 'chat_invite_user';
    let chk2 = 'chat_invite_user_by_link';
    let chk3 = 'chat_kick_user';
    let peer = data.peerId;
    if (data.eventType != undefined){
        let cid = data.peerId - 2e9
        let user = data.senderId;
        let fuser = data.eventMemberId
        if (fuser == -144372147 && data.eventType == chk){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `status` = 3", [peer], async function (err, ress11, f) {
                if (ress11.length != 0) {
                    for (var i = 0; i < ress11.length; i++) {
                        connection.query("DELETE FROM `admins` WHERE `admins`.`id` = ?;", [ress11[i].id], async function (err, ress22, f) { })
                    }
                    data.reply('Данный бот уже находился в данной беседе, список пользователей с правами администратора был обнулен! Выдайте права администратора боту и пропишите команду !apply снова!')
                } else  data.reply('Привет, я робот и меня создал Pacmard. \n\n Прежде чем Вы сможете начать использовать меня, выдайте мне права администратора беседы и затем пропишите команду !apply . После этого весь мой функционал станет доступен Вам.')
            })
        }
        if (data.eventType == chk3 && fuser == user){
            let commandor = 'exitkick'
            connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 1", [peer, commandor], async function (err, chkcmd, f) {
                if(chkcmd.length == 1){
                    vk.api.messages.removeChatUser({ chat_id: cid, member_id: user, access_token: t1ken, v: v });
                }
            })
        }
        if ((data.eventType == chk) || (data.eventType == chk2)){
            if (data.eventType == chk) {
                let banned = data.eventMemberId;
                connection.query("SELECT * FROM `bans` WHERE `peer` = ? AND `userid` = ?", [peer, banned], async function (err, alreadybanned, f) {
                    if(alreadybanned.length == 1){
                        vk.api.messages.removeChatUser({ chat_id: cid, member_id: banned, access_token: t1ken, v: v });
                        data.reply('Пользователь заблокирован! Чтобы его добавить, Вам необходимо разбанить его командой !unban')
                    }
                })
                connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, banned], async function (err, warnedlater, f) {
                    if(warnedlater.length == 1){
                        connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [0, warnedlater[0].id], function (error, result, fields) {})
                    }
                })
            }
            if (data.eventType == chk2) {
                let banned = data.senderId;
                connection.query("SELECT * FROM `bans` WHERE `peer` = ? AND `userid` = ?", [peer, banned], async function (err, alreadybanned, f) {
                    if(alreadybanned.length == 1) {
                        vk.api.messages.removeChatUser({ chat_id: cid, member_id: banned, access_token: t1ken, v: v });
                        data.reply('Пользователь заблокирован! Чтобы его добавить, Вам необходимо разбанить его командой !unban')
                    }
                })
                connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, banned], async function (err, warnedlater, f) {
                    if(warnedlater.length == 1){
                        connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [0, warnedlater[0].id], function (error, result, fields) {})
                    }
                })
            }
        }
    }
    const words = transformWords(
        ['еблоид','бляхомудия','мамкоёб','припизженный','выбляпиздрище','дурак','дура','Объебал','Объебать','Наебашиться','Доебаться','Блядский','Ебанутый','Спидозный','Схуяли','Пиздеж','Проёб','Уебан','Ебучка','Полуебок','Проститутка','Ёбаный','Ебалай','тупая','тупой','уебан','ебашим','матка','пиздогрыз','ебанашка','motherfucker','pussy','кончефлыга','dick','член','ебланище','ссанина','рукаблуд','bastard','маразота','Далбоёб','тварь','даун','пиздабол','Спермоглот','Кончалыга','хуйню','Хуеглот','ебланище','Гандонище','Конч','Конченый','Конченный','Пидр','Хуила','Ебантяй','Пидарасина','Ебаклак','хуятина','уебанище','урод','гавнаед','хуило','уебывай','геюга','гей','додик','пидараска','ебошит','Ебашу','Хуярю','пздц','шмара','хуесосина','Говнарь','переебу','уебу','выебу','Хуепутоло','суко','еблантяй','долбаебина','ЕБАНУЛ','УЕБАЛСЯ','Объебался','укроп','пиздых','охуитительный','нахуа','Блядогон','впиздячил','рофланебало','хуямбула','херасе','залупина','пендос','Шлюхан','Ёбана','Хули','Охуеный','Охуенный','Аутист','Припиздок','Пиздос','Наебал','Отсоси','хуеголовый','Хуелиз','Влагалище','Пидорас','Срань','Гандоновец',' говноедище','Пидораска','Пидрила','ебашь','Охуело','сракотан','Пенис','ахуель','Сиська','Сиськи','Дебич','Еблостер','Пидорский','Уебанский','Ебобо','Ебонатор','епта','долбоебина','пидорасина','обани рот','рукоблуд','mq','сосать','гамосек','гомосек','гомосексуал','Ебасосина','биба','хуяндок','голубой','Голубь','петух','хуеглотище','херобуромалиновый','хуеёб','ебанарот','сучёнок','сучечка','ДЦПшник','ДЦП','говноёб','Аутяга','спизжено','пиздолюб','пиздоглот','жопаглот','Пиздёнка','пидорасище','Пиздоболить','Еблакшери','спиздоболил','сполохуйка','Стриппиздунчик','Выебнуться','ебанаш','шкура','Хуёво','баян','епать','баля','Сучёныш','Сучёнышь','Дилдак','Дилдо','ебланка','Трахаться','Трах','хуяндог','пиздоног','шмаль','Шваль','ахуевшая','ахуевший','Кобель','Путана','найух','моча','хуня','залупок','сучище','Сучарище','ска','нахой','kurwa','фак','пезда','хера','пропиздейшен','Спидоблять','пидарок','хуедрыг','хуетряс','Идиот','идиотка','далбоебина','давалка','пиздокрылоглаз','писькогрыз','Хуйкоглот','cock', 'cunt', 'fuck', 'fucker', 'fucking', 'отпиздит', 'архипиздрит', 'ахуел', 'ахуеть', 'бздение', 'бздеть', 'бздех', 'бздецы', 'бздит', 'бздицы', 'бздло', 'бзднуть', 'бздун', 'бздунья', 'бздюха', 'бздюшка', 'бздюшко', 'бля', 'блябу', 'блябуду', 'бляд', 'бляди', 'блядина', 'блядище', 'блядки', 'блядовать', 'блядство', 'блядун', 'блядуны', 'блядунья', 'блядь', 'блядюга', 'блять', 'вафел', 'вафлёр', 'взъебка', 'взьебка', 'взьебывать', 'въеб', 'въебался', 'въебенн', 'въебусь', 'въебывать', 'выблядок', 'выблядыш', 'выеб', 'выебать', 'выебен', 'выебнулся', 'выебон', 'выебываться', 'выпердеть', 'высраться', 'выссаться', 'вьебен', 'гавно', 'гавнюк', 'гавнючка', 'гамно', 'гандон', 'гнид', 'гнида', 'гниды', 'говенка', 'говенный', 'говешка', 'говназия', 'говнецо', 'говнище', 'говно', 'говноед', 'говнолинк', 'говночист', 'говнюк', 'говнюха', 'говнядина', 'говняк', 'говняный', 'говнять', 'гондон', 'доебываться', 'долбоеб', 'долбоёб', 'долбоящер', 'дрисня', 'дрист', 'дристануть', 'дристать', 'дристун', 'дристуха', 'дрочелло', 'дрочена', 'дрочила', 'дрочилка', 'дрочистый', 'дрочить', 'дрочка', 'дрочун', 'еб твою мать', 'ёб твою мать', 'ебал', 'ебало', 'ебальник', 'ебан', 'ебанамать', 'ебанат', 'ебаная', 'ёбаная', 'ебанический', 'ебанный', 'ебанныйврот', 'ебаное', 'ебануть', 'ебануться', 'ёбаную', 'ебаный', 'ебанько', 'ебарь', 'ебат', 'ёбат', 'ебатория', 'ебать', 'ебать-копать', 'ебаться', 'ебашить', 'ебёна', 'ебет', 'ебёт', 'ебец', 'ебик', 'ебин', 'ебись', 'ебическая', 'ебки', 'ебла', 'еблан', 'ебливый', 'еблище', 'ебло', 'еблыст', 'ебля', 'ёбн', 'ебнуть', 'ебнуться', 'ебня', 'ебошить', 'ебская', 'ебский', 'ебтвоюмать', 'ебун', 'ебут', 'ебуч', 'ебуче', 'ебучее', 'ебучий', 'ебучим', 'ебущ', 'ебырь', 'елда', 'елдак', 'елдачить', 'жопа', 'жопу', 'заговнять', 'задрачивать', 'задристать', 'задрота', 'заеб', 'заёб', 'заеба', 'заебал', 'заебанец', 'заебастая', 'заебастый', 'заебать', 'заебаться', 'заебашить', 'заебистое', 'заёбистое', 'заебистые', 'заёбистые', 'заебистый', 'заёбистый', 'заебись', 'заебошить', 'заебываться', 'залуп', 'залупа', 'залупаться', 'залупить', 'залупиться', 'замудохаться', 'запиздячить', 'засерать', 'засерун', 'засеря', 'засирать', 'засрун', 'захуячить', 'заябестая', 'злоеб', 'злоебучая', 'злоебучее', 'злоебучий', 'ибанамат', 'ибонех', 'изговнять', 'изговняться', 'изъебнуться', 'ипать', 'ипаться', 'ипаццо', 'Какдвапальцаобоссать', 'конча', 'курва', 'курвятник', 'лох', 'лошара', 'лошары', 'лошок', 'лярва', 'малафья', 'манда', 'мандавошек', 'мандавошка', 'мандавошки', 'мандей', 'мандень', 'мандеть', 'мандища', 'мандой', 'манду', 'мандюк', 'минет', 'минетчик', 'минетчица', 'млять', 'мокрощелка', 'мокрощёлка', 'мразь', 'мудаг', 'мудак', 'муде', 'мудель', 'мудеть', 'муди', 'мудил', 'мудила', 'мудистый', 'мудня', 'мудоеб', 'мудозвон', 'мудоклюй', 'на хер', 'на хуй', 'набздел', 'набздеть', 'наговнять', 'надристать', 'надрочить', 'наебать', 'наебет', 'наебнуть', 'наебнуться', 'наебывать', 'напиздел', 'напиздели', 'напиздело', 'напиздили', 'насрать', 'настопиздить', 'нахер', 'нахрен', 'нахуй', 'нахуйник', 'не ебет', 'не ебёт', 'невротебучий', 'невъебенно', 'нехира', 'нехрен', 'Нехуй', 'нехуйственно', 'ниибацо', 'ниипацца', 'ниипаццо', 'ниипет', 'никуя', 'нихера', 'нихуя', 'обдристаться', 'обосранец', 'обосрать', 'обосцать', 'обосцаться', 'обсирать', 'объебос', 'обьебать обьебос', 'однохуйственно', 'опездал', 'опизде', 'опизденивающе', 'остоебенить', 'остопиздеть', 'отмудохать', 'отпиздить', 'отпиздячить', 'отпороть', 'отъебись', 'охуевательский', 'охуевать', 'охуевающий', 'охуел', 'охуенно', 'охуеньчик', 'охуеть', 'охуительно', 'охуительный', 'охуяньчик', 'охуячивать', 'охуячить', 'очкун', 'падла', 'падонки', 'падонок', 'паскуда', 'педерас', 'педик', 'педрик', 'педрила', 'педрилло', 'педрило', 'педрилы', 'пездень', 'пездит', 'пездишь', 'пездо', 'пездят', 'пердануть', 'пердеж', 'пердение', 'пердеть', 'пердильник', 'перднуть', 'пёрднуть', 'пердун', 'пердунец', 'пердунина', 'пердунья', 'пердуха', 'пердь', 'переёбок', 'пернуть', 'пёрнуть', 'пидар', 'пидарас', 'пидарасы', 'пидары', 'пидор', 'пидорасы', 'пидорка', 'пидорок', 'пидоры', 'пидрас', 'пизда', 'пиздануть', 'пиздануться', 'пиздарваньчик', 'пиздато', 'пиздатое', 'пиздатый', 'пизденка', 'пизденыш', 'пиздёныш', 'пиздеть', 'пиздец', 'пиздит', 'пиздить', 'пиздиться', 'пиздишь', 'пиздища', 'пиздище', 'пиздобол', 'пиздоболы', 'пиздобратия', 'пиздоватая', 'пиздоватый', 'пиздолиз', 'пиздонутые', 'пиздорванец', 'пиздорванка', 'пиздострадатель', 'пизду', 'пиздуй', 'пиздун', 'пиздунья', 'пизды', 'пиздюга', 'пиздюк', 'пиздюлина', 'пиздюля', 'пиздят', 'пиздячить', 'писбшки', 'писька', 'писькострадатель', 'писюн', 'писюшка', 'по хуй', 'по хую', 'подговнять', 'подонки', 'подонок', 'подъебнуть', 'подъебнуться', 'поебать', 'поебень', 'поёбываает', 'поскуда', 'посрать', 'потаскуха', 'потаскушка', 'похер', 'похерил', 'похерила', 'похерили', 'похеру', 'похрен', 'похрену', 'похуй', 'похуист', 'похуистка', 'похую', 'придурок', 'приебаться', 'припиздень', 'припизднутый', 'припиздюлина', 'пробзделся', 'проблядь', 'проеб', 'проебанка', 'проебать', 'промандеть', 'промудеть', 'пропизделся', 'пропиздеть', 'пропиздячить', 'раздолбай', 'разхуячить', 'разъеб', 'разъеба', 'разъебай', 'разъебать', 'распиздай', 'распиздеться', 'распиздяй', 'распиздяйство', 'распроеть', 'сволота', 'сволочь', 'сговнять', 'секель', 'серун', 'серька', 'сестроеб', 'сикель', 'сирать', 'сирывать', 'соси', 'спиздел', 'спиздеть', 'спиздил', 'спиздила', 'спиздили', 'спиздит', 'спиздить', 'срака', 'сраку', 'сраный', 'сранье', 'срать', 'срун', 'ссака', 'ссышь', 'стерва', 'страхопиздище', 'сука', 'суки', 'суходрочка', 'сучара', 'сучий', 'сучка', 'сучко', 'сучонок', 'сучье', 'сцание', 'сцать', 'сцука', 'сцуки', 'сцуконах', 'сцуль', 'сцыха', 'сцышь', 'съебаться', 'сыкун', 'трахаеб', 'трахаёб', 'трахатель', 'ублюдок', 'уебать', 'уёбища', 'уебище', 'уёбище', 'уебищное', 'уёбищное', 'уебк', 'уебки', 'уёбки', 'уебок', 'уёбок', 'урюк', 'усраться', 'ушлепок', 'хамло', 'хер', 'херня', 'херовато', 'херовина', 'херовый', 'хитровыебанный', 'хитрожопый', 'хуе', 'хуё', 'хуевато', 'хуёвенький', 'хуевина', 'хуево', 'хуевый', 'хуёвый', 'хуек', 'хуёк', 'хуел', 'хуем', 'хуенч', 'хуеныш', 'хуенький', 'хуеплет', 'хуеплёт', 'хуепромышленник', 'хуерик', 'хуерыло', 'хуесос', 'хуесоска', 'хуета', 'хуетень', 'хуею', 'хуи', 'хуй', 'хуйком', 'хуйло', 'хуйня', 'хуйрик', 'хуище', 'хуля', 'хую', 'хуюл', 'хуя', 'хуяк', 'хуякать', 'хуякнуть', 'хуяра', 'хуясе', 'хуячить', 'целка', 'чмо', 'чмошник', 'чмырь', 'шалава', 'шалавой', 'шараёбиться', 'шлюха', 'шлюхой', 'шлюшка', 'ябывае', 'хуету', 'сукаблять'],
        {   'а' : ['a', '@', '4'],
            'б' : ['6', 'b'],
            'в' : ['b', 'v'],
            'г' : ['r', 'g'],
            'д' : ['d', 'g'],
            'е' : ['e'],
            'ё' : ['е', 'e'],
            'ж' : ['zh', '*'],
            'з' : ['3', 'z'],
            'и' : ['u', 'i'],
            'й' : ['u', 'y', 'i'],
            'к' : ['k', 'i{', '|{'],
            'л' : ['l', 'ji'],
            'м' : ['m'],
            'н' : ['h', 'n'],
            'о' : ['o', '0'],
            'п' : ['n', 'p'],
            'р' : ['r', 'p'],
            'с' : ['c', 's'],
            'т' : ['m', 't'],
            'у' : ['y', 'u'],
            'ф' : ['f'],
            'х' : ['x', 'h', '}{'],
            'ц' : ['c', 'u,'],
            'ч' : ['ch'],
            'ш' : ['sh'],
            'щ' : ['sch'],
            'ь' : ['b'],
            'ы' : ['bi'],
            'э' : ['е', 'e'],
            'ю' : ['io'],
            'я' : ['ya']}
    )
    const regexp = new RegExp(`(^|[^a-zа-яё])(${words.join('|')})($|[^a-zа-яё])`, 'i');

    if (data.text && regexp.test(data.text)) {
        let user_warned = data.senderId;
        let peer = data.peerId;
        let cid = data.peerId - 2e9;
        let commandor = 'banmat';
        connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 1", [peer, commandor], async function (err, chkcmd, f) {
            if (chkcmd.length == 1) {
                givewarn(data, peer, user_warned, cid)
            }
        })
    }

    return next()
});

vk.updates.hear(/^!banlist/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].banlist > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].banlist], async function (err, banlistchk, f) {
                if (banlistchk.length == 1){
                    banlistcommand(data)
                }
            })
        } else {
            banlistcommand(data)
        }
    })
})

vk.updates.hear(/^!warnlist/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].warnlist > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].warnlist], async function (err, warnlistchk, f) {
                if (warnlistchk.length == 1){
                    warnlistcommand(data)
                }
            })
        } else {
            warnlistcommand(data)
        }
    })
})

vk.updates.hear(/^!число/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].number > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].number], async function (err, numberchk, f) {
                if (numberchk.length == 1){
                    numbercommand(data)
                }
            })
        } else {
            numbercommand(data)
        }
    })
})

vk.updates.hear('!нг', data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].newyear > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].newyear], async function (err, newyearchk, f) {
                if (newyearchk.length == 1){
                    var now = new Date(),
                        ny = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
                    data.reply('Осталось ' + Math.floor((ny.getTime() - now.getTime()) / 86400000) + ' дней');
                }
            })
        } else {
            var now = new Date(),
                ny = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
            data.reply('Осталось ' + Math.floor((ny.getTime() - now.getTime()) / 86400000) + ' дней');
        }
    })
})

vk.updates.hear('!орел и решка', data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].orel > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].orel], async function (err, orelchk, f) {
                if (orelchk.length == 1){
                    orelcommand(data)
                }
            })
        } else {
            orelcommand(data)
        }
    })
})

vk.updates.hear(/^!rand/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].rand > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].rand], async function (err, randchk, f) {
                if (randchk.length == 1){
                    randcommand(data)
                }
            })
        } else {
            randcommand(data)
        }
    })
})

vk.updates.hear(/^!перевод/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].translate > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].translate], async function (err, translatechk, f) {
                if (translatechk.length == 1){
                    translatecommand(data)
                }
            })
        } else {
            translatecommand(data)
        }
    })
})

vk.updates.hear(/^@everyone/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].everyone > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].everyone], async function (err, everyonechk, f) {
                if (everyonechk.length == 1){
                    everyonecommand(data)
                }
            })
        } else {
            everyonecommand(data)
        }
    })
})

vk.updates.hear(/^!kick/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].kick > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].kick], async function (err, kickchk, f) {
                if (kickchk.length == 1){
                    kickcommand(data)
                }
            })
        } else {
            kickcommand(data)
        }
    })
})

vk.updates.hear(/^!id/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].id > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].id], async function (err, idchk, f) {
                if (idchk.length == 1){
                    idcommand(data)
                }
            })
        } else {
            idcommand(data)
        }
    })
})

vk.updates.hear(/^\/q$/, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].q > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].q], async function (err, qchk, f) {
                if (qchk.length == 1){
                    qcommand(data)
                }
            })
        } else {
            qcommand(data)
        }
    })
})

vk.updates.hear(/(я спать|всем пока я спать)/i, data => {
    data.reply('споки зайка <3')
})

vk.updates.hear(/(доброе утро|утречка)/i, data => {
    data.reply('Привет, пупсик')
})

vk.updates.hear(/(не спать)/i, data => {
    data.reply('💔')
})

vk.updates.hear(/(!donate)/i, data => {
    data.reply('https://www.donationalerts.com/r/pacmard', 'video-42722952_171514596')
})

vk.updates.hear('/alive', data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].alive > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].alive], async function (err, alivechk, f) {
                if (alivechk.length == 1){
                    data.reply('Функционирую!')
                }
            })
        } else {
            data.reply('Функционирую!')
        }
    })
})

vk.updates.hear(/^!cid/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].cid > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].cid], async function (err, cidchk, f) {
                if (cidchk.length == 1){
                    cidcommand(data)
                }
            })
        } else {
            cidcommand(data)
        }
    })
})

vk.updates.hear(/^!reg/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].reg > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].reg], async function (err, regchk, f) {
                if (regchk.length == 1){
                    regcommand(data)
                }
            })
        } else {
            regcommand(data)
        }
    })
})

vk.updates.hear(/^!др/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].birthday > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].birthday], async function (err, birthdaychk, f) {
                if (birthdaychk.length == 1){
                    birthdaycommand(data)
                }
            })
        } else {
            birthdaycommand(data)
        }
    })
})

vk.updates.hear(/^!когда/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].whenit > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].whenit], async function (err, whenchk, f) {
                if (whenchk.length == 1){
                    when(data)
                }
            })
        } else {
            when(data)
        }
    })
})

vk.updates.hear(/^!triggers/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 5", [peer, user, perm[0].whenit], async function (err, crchk, f) {
        if (crchk.length == 1) {
            data.reply('!число - number \n !нг - newyear \n !орел и решка - orel \n !rand - rand \n !перевод - translate \n @everyone - everyone \n !kick - kick \n !id - idofuser \n !q - q \n /alive - alive \n !cid - cid \n !reg - reg \n !др - birthday \n !когда - whenit \n !ban - ban \n !unban - unban \n !что лучше - better \n !погода - weather \n !кикатьвышедших - exitkick \n !антимат - antimat \n !пред - warn \n !снять - unwarn \n !сколько - checkwarn \n !banlist  - banlist \n !warnlist - warnlist \b !addspec - addspec \n !remspec - remspec \n !admin - admin \n !unadmin - unadmin')
        }
    })
})


vk.updates.hear(/^!levels/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 5", [peer, user, perm[0].whenit], async function (err, crchk, f) {
        if (crchk.length == 1) {
            data.reply('Пока-что доступны только следующие категории: \n 0 - Пользователь \n 3 - Администратор \n 4 - Спец.администратор \n 5 - Создатель')
        }
    })
})

vk.updates.hear(/^!settings/i, data => {
    let peer = data.peerId
    let user = data.senderId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 5", [peer, user], async function (err, crchk, f) {
        if (crchk.length == 1) {
            let commands = ['number', 'newyear', 'orel', 'rand', 'translate', 'everyone', 'kick', 'idofuser', 'q', 'alive', 'cid', 'reg', 'birthday', 'whenit', 'ban', 'unban', 'better', 'weather', 'exitkick', 'antimat', 'warn', 'unwarn', 'checkwarn', 'banlist', 'warnlist', 'addspec', 'remspec', 'admin', 'unadmin']
            let levels = [0, 1, 2, 3, 4, 5]
            message = data.text;
            test = message.replace('!settings ', '').split(' ');
            setting = test.shift()
            message = test.join(' ').replace(setting, '');
            var level = parseInt(message)
            if (commands.includes(setting)) {
                console.log(level)
                if (levels.includes(level)) {
                    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
                        let requestion = "UPDATE `settings` SET `" + setting + "` = ? WHERE `settings`.`id` = ?"
                        connection.query(requestion, [level, perm[0].id], async function (err, perm, f) {
                            data.reply('Уровень прав для команды успешно назначен!')
                        })
                    })
                } else data.reply('Укажите уровень прав, который необходимо установить команде! Список уровней прав и их триггеры можете получить при помощи команды !levels')
            } else {
                data.reply('Укажите команду для которой надо настроить права, список команд и их триггеры можете получить используя команду !triggers')
            }
        }
    })
})

vk.updates.hear(/^!apply/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    vk.api.messages.getConversationsById({ peer_ids: peer, access_token: t1ken, v: v }) .then(res => {
        if(res.count != 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `status` = 5" , [peer, user], function (err, ress, f) {
                if (ress.length == 0){
                    let user_id = res.items[0].chat_settings.owner_id
                    connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`) VALUES (?, ?, ?);" , [peer, user_id, 5], function (error, result, fields) {
                        connection.query("INSERT INTO `settings` (`peer`) VALUES (?);", [peer], function (error, result, fields) {
                            data.reply('Бот успешно проверил наличие прав администратора, создателю беседы выданы права администратора, для выдачи прав другому человеку используйте !admin @id. Приятного использования, с любовью, ваш Pacmard (автор бота)')
                        })
                    });
                } else data.reply('Бот уже проверил наличие прав администратора и выдал полномочия создателю беседы, повторная проверка не требуется, пожалуйста, не используйте данную команду без надобности.')
            });
        } else data.reply('Бот все еще не администратор. Выдайте права администратора для его полноценного функционирования.')
    })
})

vk.updates.hear(/^!ban/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].ban > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].ban], async function (err, banchk, f) {
                if (banchk.length == 1){
                    bancommand(data)
                }
            })
        } else {
            bancommand(data)
        }
    })
})

vk.updates.hear(/^!unban/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].unban > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].unban], async function (err, unbanchk, f) {
                if (unbanchk.length == 1){
                    unbancommand(data)
                }
            })
        } else {
            unbancommand(data)
        }
    })
})

vk.updates.hear(/!что лучше/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].unban > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].better], async function (err, betterchk, f) {
                if (betterchk.length == 1){
                    bettercommand(data)
                }
            })
        } else {
            bettercommand(data)
        }
    })
})

vk.updates.hear(/^!погода/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].weather > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].weather], async function (err, weatherchk, f) {
                if (weatherchk.length == 1){
                    weathercommand(data)
                }
            })
        } else {
            weathercommand(data)
        }
    })
})

vk.updates.hear(/^!кикатьвышедших/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].exitkick > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].exitkick], async function (err, exitkickchk, f) {
                if (exitkickchk.length == 1){
                    exitkickcommand(data)
                }
            })
        } else {
            exitkickcommand(data)
        }
    })
})

vk.updates.hear(/^!антимат/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].antimat > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].antimat], async function (err, antimatchk, f) {
                if (antimatchk.length == 1){
                    antimatcommand(data)
                }
            })
        } else {
            antimatcommand(data)
        }
    })
})

vk.updates.hear(/^!admin/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].admin > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].admin], async function (err, adminchk, f) {
                if (adminchk.length == 1){
                    admincommand(data)
                }
            })
        } else {
            admincommand(data)
        }
    })
});

vk.updates.hear(/^!addspec/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].addspec > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].addspec], async function (err, addspecchk, f) {
                if (addspecchk.length == 1){
                    addspec(data)
                }
            })
        } else {
            addspec(data)
        }
    })
}); // TODO: повышение с модера и ст.модера + защита от двойной выдачи

vk.updates.hear(/^!remspec/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].remspec > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].remspec], async function (err, remspecchk, f) {
                if (remspecchk.length == 1){
                    remspec(data)
                }
            })
        } else {
            remspec(data)
        }
    })
});

vk.updates.hear(/^!unadmin/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].unadmin > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].unadmin], async function (err, unadminchk, f) {
                if (unadminchk.length == 1){
                    unadmincommand(data)
                }
            })
        } else {
            unadmincommand(data)
        }
    })
});

vk.updates.hear(/^!пред/i, async data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].warn > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].warn], async function (err, warnchk, f) {
                if (warnchk.length == 1){
                    warncommand(data)
                }
            })
        } else {
            warncommand(data)
        }
    })
})

vk.updates.hear(/^!снять/i, async data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].unwarn > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].unwarn], async function (err, unwarnchk, f) {
                if (unwarnchk.length == 1){
                    unwarncommand(data)
                }
            })
        } else {
            unwarncommand(data)
        }
    })
})

vk.updates.hear(/^!сколько/i, async data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0].checkwarn > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0].checkwarn], async function (err, checkwarnchk, f) {
                if (checkwarnchk.length == 1){
                    checkwarncommand(data)
                }
            })
        } else {
            checkwarncommand(data)
        }
    })
})

vk.updates.start().catch(console.error);

var yearName = ['год', 'года', 'лет']
var dayname = ['день', 'дня', 'дней'];
var hourname = ['час', 'часа', 'часов'];
var minname = ['минута', 'минуты', 'минут'];
var secname = ['секунда', 'секунды', 'секунд'];

function CheckNumber(number) {
    var number = number;
    var b = number % 10; var a = (number % 100 - b) / 10;
    if (a == 0 || a >= 2) {
        if (b == 0 || (b > 4 && b <= 9)) { return 2; } else { if (b != 1) { return 1; } else { return 0; } }
    }
    else { return 2; }
}

function getAgeText(dateUnix) {
    let actUnix = moment().unix()
    let diffUnux = actUnix - dateUnix
    let y, d, residue = ''
    y = Math.floor(diffUnux / 31556926)
    residue = (y * 31556926) - diffUnux
    if (residue < 0) residue = residue - residue - residue
    d = Math.round(residue / 86400)
    if (d == 365) d = 0, y++

    let mes = `${y} ${yearName[CheckNumber(y)]} и ${d} ${dayname[CheckNumber(d)]}`
    if (y == 0) mes = `${d} ${dayname[CheckNumber(d)]}`
    if (d == 0) mes = `${y} ${yearName[CheckNumber(y)]}`
    if (d == 0 && y == 0) mes = `0 лет и 0 дней`
    return (mes);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var declOfNum = (function () {
    var cases = [2, 0, 1, 1, 1, 2];
    var declOfNumSubFunction = function (titles, number) {
        number = Math.abs(number);
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }
    return function (_titles) {
        if (arguments.length === 1) {
            return function (_number) {
                return declOfNumSubFunction(_titles, _number)
            }
        } else {
            return declOfNumSubFunction.apply(null, arguments)
        }
    }
})()

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function bettercommand(data) {
    try {
        let message = data.text
        let b = message.replace(/\[(club|id)(\d+)\|(.+?)\]/, '')
        let c = b.replace(/(,)/, '')
        let str = c.replace(/(\/|!)что лучше/i, '')
        let pick = str.split(/ или /i)
        let max = pick.length - 1
        let rand = random(0, max)
        if (!pick[rand]) {
            // data.reply('А из чего выбирать-то?')
        } else data.reply("Я думаю, что " + pick[rand] + " лучше")
    } catch (er) {
        data.reply('')
    }
}

function unbancommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!unban).*?([\d]+).*?$/gm;
    const str = data.text
    const m = regex.exec(str);
    if (m != null) {
        const user_id = m[1];
        connection.query("SELECT * FROM `bans` WHERE `peer` = ? AND `userid` = ?", [peer, user_id], async function (err, alreadybanned, f) {
            if (alreadybanned.length == 1) {
                connection.query("DELETE FROM `bans` WHERE `bans`.`id` = ?;", [alreadybanned[0].id], async function (err, ress22, f) {
                    data.reply('Пользователь разблокирован!')
                })
            } else data.reply('Пользователь не заблокирован!')
        })
    } else data.reply('Укажите пользователя, которого нужно разблокировать!')
}

function bancommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!ban).*?([\d]+).*?$/gm;
    const str = data.text
    const m = regex.exec(str);
    if (m != null) {
        const user_id = m[1];
        connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= 3", [peer, user_id], async function (err, creator, f) {
            if (creator.length == 0) {
                connection.query("SELECT * FROM `bans` WHERE `peer` = ? AND `userid` = ?", [peer, user_id], async function (err, alreadybanned, f) {
                    if (alreadybanned.length == 0) {
                        connection.query("INSERT INTO `bans` (`peer`, `userid`) VALUES (?, ?);", [peer, user_id], function (error, result, fields) {
                            let cid = data.peerId - 2e9
                            vk.api.messages.removeChatUser({
                                chat_id: cid,
                                member_id: user_id,
                                access_token: t1ken,
                                v: v
                            });
                            data.reply('Пользователь успешно заблокирован!')
                        })
                    } else data.reply('Пользователь уже заблокирован!')
                })
            } else data.reply('Вы не можете заблокировать администратора!')
        })
    } else data.reply('Укажите, какого пользователя Вы хотите заблокировать через упоминание!')
}

function givewarn(data, peer, user_warned, cid) {
    connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, user_warned], async function (err, chkwrn, f) {
        if (chkwrn.length == 1) {
            if (chkwrn[0].number == 1) {
                let nwrn = chkwrn[0].number + 1;
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [nwrn, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Вам вынесено второе предупреждение, в следующий раз Вы будете исключены из чата! Старайтесь не использовать нецензурную лексику и оскорбления при общении друг с другом!' + ' #user' + user_warned)
                })
            } else if (chkwrn[0].number == 2){
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [3, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Мы неоднократно выносили Вам предупреждения. Вы будете исключены за большое количество нарушений.' + ' #user' + user_warned)
                    vk.api.messages.removeChatUser({
                        chat_id: cid,
                        member_id: user_warned,
                        access_token: t1ken,
                        v: v
                    });
                })
            } else if (chkwrn[0].number == 0){
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [1, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Вам вынесено первое предупреждение, когда их будет 3 Вы будете исключены из чата! Старайтесь не использовать нецензурную лексику и оскорбления при общении друг с другом!' + ' #user' + user_warned)
                })
            }
        } else {
            connection.query("INSERT INTO `warns` (`peer`, `userid`, `number`) VALUES (?, ?, ?);", [peer, user_warned, 1], function (error, result, fields) {
                data.reply('Вам вынесено первое предупреждение, когда их будет 3 Вы будете исключены из чата! Старайтесь не использовать нецензурную лексику и оскорбления при общении друг с другом!' + ' #user' + user_warned)
            })
        }
    })
}

function removewarn(data, peer, user_unwarned) {
    connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, user_unwarned], async function (err, chkwrn, f) {
        if (chkwrn.length == 1) {
            if (chkwrn[0].number <= 3 && chkwrn[0].number != 0) {
                let nwrn = chkwrn[0].number - 1;
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [nwrn, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Пользователю снято одно предупреждение. Теперь у него их ' + nwrn + '. #user' + user_unwarned)
                })
            } else {
                data.reply('У пользователя нет предупреждений!')
            }
        }
    })
}

function checkwrn(data, peer, user_chk) {
    connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, user_chk], async function (err, chkwrn, f) {
        if (chkwrn.length == 1) {
            if (chkwrn[0].number <= 3 && chkwrn[0].number != 0) {
                data.reply('У пользователя ' + chkwrn[0].number + ' предупреждения(е)')
            } else data.reply('У пользователя нет предупреждений!')
        } else data.reply('У пользователя нет предупреждений!')
    })
}

function kick(peer, cid, user_kicked) {
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= 3", [peer, user_kicked], async function (err, kickadmin2, f) {
        if (kickadmin2 == 0) {
            vk.api.messages.removeChatUser({
                chat_id: cid,
                member_id: user_kicked,
                access_token: t1ken,
                v: v
            });
        } else data.reply('Вы не можете кикнуть администратора!')
    })
}

function escapeRegExpText(text) {
    return text.replace(
        /(\*|\{|\}|\(|\))/g,
        '\\$1'
    );
}
function remspec(data) {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!remspec).*?([\d]+).*?$/gm;
    const str = data.text;
    const m = regex.exec(str);
    if (m != null) {
        const user_id = m[1];
        if (user_id != admins[0].userid) {
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 4", [peer, user_id], async function (err, ress11, f) {
                if (ress11.length == 1) {
                    connection.query("DELETE FROM `admins` WHERE `admins`.`id` = ?;", [ress11[0].id], async function (err, ress22, f) {
                        data.reply('С пользователя успешно сняты права спец.администратора!')
                    })
                } else data.reply('Пользователь не является спец.администратором!')
            })
        } else data.reply('Вы не можете снять права спец.администратора с себя!')
    } else data.reply('Упомяните пользователя с которого нужно снять права спец.администратора!')
}
function addspec(data) {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!addspec).*?([\d]+).*?$/gm;
    const str = data.text;
    const m = regex.exec(str);
    if (m.length != null) {
        const user_id = m[1];
        if (user != user_id) {
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ?", [peer, user_id], function (err, alreadyadm, f) {
                if (alreadyadm.length == 0) {
                    connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`) VALUES (?, ?, ?);", [peer, user_id, 4], function (error, result, fields) {
                        data.reply('Права спец.администратора были успешно выданы!')
                    })
                } else if (alreadyadm[0].status < 4) {
                    connection.query("UPDATE `admins` SET `status` = '4' WHERE `admins`.`id` = ?;", [alreadyadm[0].id], function (error, result, fields) {
                        data.reply('Пользователь успешно повышен до спец.администратора!')
                    })
                }
            })
        } else data.reply('Вы не можете выдать права спец.администратора самому себе, вы и так администратор.')
    } else data.reply('Укажите пользователя, которому необходимо выдать права спец.администратора через упоминание.')
}

function weathercommand(data) {
    let message = data.text;
    let cityName = encodeURI(message.replace(/!погода /i, ''))
    let weatherToken = "153ca3260d689a77a64566dc04a803c9"
    let url = "https://api.openweathermap.org/data/2.5/weather?&q=" + cityName + '&appid=' + weatherToken + '&lang=ru'
    axios.get(url)
        .then(res => {
            let wth = res.data
            if (wth.sys.country == "RU") wth.sys.country = "🇷🇺"
            if (wth.sys.country == "UA") wth.sys.country = "🇺🇦"
            if (wth.sys.country == "LV") wth.sys.country = "🇦🇹"
            if (wth.sys.country == "KZ") wth.sys.country = "🇰🇿"
            if (wth.sys.country == "KR") wth.sys.country = "🇰🇷"
            if (wth.sys.country == "LT") wth.sys.country = "🇱🇹"
            if (wth.sys.country == "US") wth.sys.country = "🇺🇸"
            if (wth.sys.country == "PL") wth.sys.country = "🇵🇱"
            if (wth.sys.country == "JP") wth.sys.country = "🇯🇵"
            if (wth.sys.country == "BY") wth.sys.country = "🇧🇾"
            if (wth.sys.country == "CL") wth.sys.country = "🇨🇱"
            if (wth.sys.country == "GB") wth.sys.country = "🇬🇧"
            if (wth.sys.country == "CN") wth.sys.country = "🇨🇳"
            if (wth.sys.country == "BE") wth.sys.country = "🇧🇪"
            let visibility = "👀 Видимость: " + wth.visibility / 1000 + " км"
            if (wth.visibility == undefined) visibility = ''
            data.reply(
                wth.name + ' | ' + wth.sys.country + '<br>' +
                '🌍 Погода: ' + wth.weather[0].description + '<br>' +
                '🌡 Температура: ' + Math.round(wth.main.temp - 273) + '°С' + '<br>' +
                '💧 Влажность: ' + wth.main.humidity + '%' + '<br>' +
                '☁ Облачность: ' + wth.clouds.all + '%' + '<br>' +
                '🌀 Ветер: ' + Math.floor(wth.wind.speed) + ' м/с' + ' | ' + Math.floor(wth.wind.deg) + '°<br>' +
                visibility
            )
        })
        .catch(er => {
            console.log(er.response.status)
            data.reply(`Упс.. Что-то пошло не так. Скорее всего, города не существует`)
        })
}

function when(data) {
    switch (random(1, 18)) {
        case 1:
            var mintes = declOfNum(['минуту', 'минуты', 'минут'])
            var rs = random(1, 60);
            data.reply("Это случится через -- " + rs + " " + mintes(rs))
            break;
        case 2:
            var mintes = declOfNum(['час', 'часа', 'часов'])
            var rs = random(1, 24);
            data.reply("Это случится через -- " + rs + " " + mintes(rs))
            break;
        case 3:
            var mintes = declOfNum(['день', 'дня', 'дней'])
            var rs = random(1, 365);
            data.reply("Это случится через -- " + rs + " " + mintes(rs))
            break;
        case 4:
            var mintes = declOfNum(['год', 'года', 'лет'])
            var rs = random(1, 60);
            data.reply("Это случится через -- " + rs + " " + mintes(rs))
            break;
        case 5:
            data.reply("Завтра.");
            break;
        case 6:
            data.reply("Никогда.")
            break;
        case 7:
            data.reply("Когда на амазинге выйдет неспизженное обновление (никогда).")
            break;
        case 8:
            data.reply("Когда-нибудь.")
            break;
        case 9:
            data.reply("Сегодня.")
            break;
        case 10:
            data.reply("В этом месяце.")
            break;
        case 11:
            data.reply("В следующем месяце.")
            break;
        case 12:
            data.reply("На этой неделе.")
            break;
        case 13:
            data.reply("На следующей неделе.")
            break;
        case 14:
            data.reply("Через неделю.")
            break;
        case 15:
            data.reply("Через месяц.")
            break;
        case 16:
            data.reply("Вчера.")
            break;
        case 17:
            data.reply("Когда рак на горе свистнет")
            break;
        case 18:
            data.reply("В следующем году.")
            break;
    }
}

function checkwarncommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
        if ((data.replyMessage == undefined) && (data.forwards.length == 0)) {
            const regex = /^(?:!сколько).*?([\d]+).*?$/gm;
            const str = data.text;
            const m = regex.exec(str);
            let cid = data.peerId - 2e9;
            if (m != null) {
                const user_chk = m[1];
                checkwrn(data, peer, user_chk)
            }
        } else if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
            let cid = data.peerId - 2e9;
            let user_chk = data.replyMessage.senderId;
            checkwrn(data, peer, user_chk)
        } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
            let cid = data.peerId - 2e9;
            for (var i = 0; i < data.forwards.length; i++) {
                let user_chk = data.forwards[i].senderId
                checkwrn(data, peer, user_chk)
            }
        }
    } else data.reply('Укажите пользователя, кол-во предупреждений которого нужно проверить!')
}

function antimatcommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    let commandor = 'banmat'
    connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 1", [peer, commandor], async function (err, chkcmd, f) {
        if(chkcmd.length == 1){
            connection.query("UPDATE `commands` SET `status` = '0' WHERE `commands`.`id` = ?;", [chkcmd[0].id], function (error, result, fields) {
                data.reply('Теперь можно материться!')
            })
        } else {
            connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 0", [peer, commandor], async function (err, chkcmd2, f) {
                if(chkcmd2.length == 1){
                    connection.query("UPDATE `commands` SET `status` = '1' WHERE `commands`.`id` = ?;", [chkcmd2[0].id], function (error, result, fields) {
                        data.reply('Теперь нельзя материться!')
                    })
                } else {
                    connection.query("INSERT INTO `commands` (`peer`, `command`, `status`) VALUES (?, ?, ?);", [peer, commandor, 1], function (error, result, fields) {
                        data.reply('Теперь нельзя материться!')
                    })
                }
            })
        }
    })
}

function admincommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!admin|!админ).*?([\d]+).*?$/gm;
    const str = data.text;
    const m = regex.exec(str);
    if (m.length != null) {
        const user_id = m[1];
        if (user != user_id) {
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ?", [peer, user_id], function (err, alreadyadm, f) {
                if (alreadyadm.length == 0) {
                    connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`) VALUES (?, ?, ?);", [peer, user_id, 3], function (error, result, fields) {
                        data.reply('Права администратора были успешно выданы!')
                    })
                } else {
                    if(alreadyadm[0].status < 3){
                        connection.query("UPDATE `admins` SET `status` = '3' WHERE `admins`.`id` = ?;", [alreadyadm[0].id], function (error, result, fields) {
                            data.replt('Пользователь успешно повышен до администратора!')
                        })
                    } else data.reply('Вы не можете понизить спец.администратора этой командой! Используйте !remspec перед тем как назначить его администратором!')
                }
            })
        } else data.reply('Вы не можете выдать права администратора самому себе, вы и так администратор.')
    } else data.reply('Укажите пользователя, которому необходимо выдать права администратора через упоминание.')
}

function unadmincommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!unadmin).*?([\d]+).*?$/gm;
    const str = data.text;
    const m = regex.exec(str);
    if (m != null) {
        const user_id = m[1];
        if (user_id != admins[0].userid) {
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_id], async function (err, ress11, f) {
                if (ress11.length == 1) {
                    connection.query("DELETE FROM `admins` WHERE `admins`.`id` = ?;", [ress11[0].id], async function (err, ress22, f) {
                        data.reply('С пользователя успешно сняты права администратора!')
                    })
                } else data.reply('Пользователь не является администратором!')
            })
        } else data.reply('Вы не можете снять права администратора с себя!')
    } else data.reply('Упомяните пользователя с которого нужно снять права администратора!')
}

function warncommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
        if ((data.replyMessage == undefined) && (data.forwards.length == 0)) {
            const regex = /^(?:!пред).*?([\d]+).*?$/gm;
            const str = data.text;
            const m = regex.exec(str);
            let cid = data.peerId - 2e9;
            if (m != null) {
                const user_warned = m[1];
                if (user != user_warned) {
                    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= 3", [peer, user_warned], async function (err, kickadmin, f) {
                        if (kickadmin.length == 0) {
                            givewarn(data, peer, user_warned, cid)
                        } else data.reply('Вы не можете дать предупреждение администратору!')
                    })
                }
            }
        } else if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
            let cid = data.peerId - 2e9;
            let user_warned = data.replyMessage.senderId;
            if (user_warned != user) {
                connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= 3", [peer, user_warned], async function (err, kickadmin1, f) {
                    if (kickadmin1 == 0) {
                        givewarn(data, peer, user_warned, cid)
                    } else data.reply('Вы не можете дать предупреждение администратору!')
                })
            }
        } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
            let cid = data.peerId - 2e9;
            for (var i = 0; i < data.forwards.length; i++) {
                let user_warned = data.forwards[i].senderId
                if (user_warned > 1 && user_warned != user) {
                    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= 3", [peer, user_warned], async function (err, kickadmin2, f) {
                        if (kickadmin2 == 0) {
                            givewarn(data, peer, user_warned, cid)
                        } else data.reply('Вы не можете дать предупреждение администратору!')
                    })
                }
            }
        }
    } else data.reply('Укажите пользователя, которому надо дать предупреждение!')
}

function qcommand(data) {
    let chat_id = data.peerId - 2e9
    let userKick = data.senderId;
    vk.api.messages.removeChatUser({
        chat_id: chat_id,
        member_id: userKick,
        access_token: t1ken,
        v: v
    }).then(res => {
        if (res == 1) {
            data.reply(`Пока`)
        }
    }).catch(er => {
        data.reply(`Опа, ошибочка! \n\n Скорее всего Вы являетесь администратором либо создателем беседы, поэтому выйти невозможно :с`)
    })
}

function unwarncommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
        if ((data.replyMessage == undefined) && (data.forwards.length == 0)) {
            const regex = /^(?:!снять).*?([\d]+).*?$/gm;
            const str = data.text;
            const m = regex.exec(str);
            let cid = data.peerId - 2e9;
            if (m != null) {
                const user_unwarned = m[1];
                if (user != user_unwarned) {
                    removewarn(data, peer, user_unwarned)
                }
            }
        } else if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
            let cid = data.peerId - 2e9;
            let user_unwarned = data.replyMessage.senderId;
            if (user_unwarned != user) {
                removewarn(data, peer, user_unwarned)
            }
        } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
            let cid = data.peerId - 2e9;
            for (var i = 0; i < data.forwards.length; i++) {
                let user_unwarned = data.forwards[i].senderId
                if (user_unwarned > 1 && user_unwarned != user) {
                    removewarn(data, peer, user_unwarned)
                }
            }
        }
    } else data.reply('Укажите пользователя, которому надо дать предупреждение!')
}

function idcommand(data) {
    let id;
    if (data.hasForwards == false && data.hasReplyMessage == false) id = data.message.from_id
    if (data.hasForwards == true && data.hasReplyMessage == false) id = data.forwards[0].senderId
    if (data.hasForwards == false && data.hasReplyMessage == true) id = data.replyMessage.senderId
    data.reply(id)
}

function kickcommand(data) {
    let user = data.senderId;
    let peer = data.peerId;
    if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
        if ((data.replyMessage == undefined) && (data.forwards.length == 0)) {
            const regex = /^(?:!kick).*?([\d]+).*?$/gm;
            const str = data.text;
            const m = regex.exec(str);
            let cid = data.peerId - 2e9;
            if (m != null) {
                const user_kicked = m[1];
                if (user != user_kicked) {
                    kick(peer, cid, user_kicked)
                }
            }
        } else if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
            let cid = data.peerId - 2e9;
            let user_kicked = data.replyMessage.senderId;
            if (user_kicked != user) {
                kick(peer, cid, user_kicked)
            }
        } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
            let cid = data.peerId - 2e9;
            for (var i = 0; i < data.forwards.length; i++) {
                let user_kicked = data.forwards[i].senderId
                if (user_kicked > 1 && user_kicked != user) {
                    kick(peer, cid, user_kicked)
                }
            }
        }
    } else data.reply('Укажите пользователя, которого вы хотите кикнуть')
}

function translatecommand(data) {
    let langs = ['aa', 'ab', 'af', 'am', 'an', 'ar', 'as', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bn', 'bo', 'br', 'ca', 'co', 'cs', 'cy', 'da', 'de', 'dz', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'iw', 'hi', 'hr', 'ht', 'hu', 'hy', 'ia', 'id', 'in', 'ie', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kk', 'kl', 'km', 'kn', 'ko', 'ks', 'ku', 'ky', 'la', 'li', 'ln', 'lo', 'lt', 'lv', 'mg', 'mi', 'mk', 'ml', 'mn', 'mo', 'mr', 'ms', 'mt', 'my', 'na', 'ne', 'nl', 'no', 'oc', 'om', 'or', 'pa', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sd', 'sg', 'sh', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ug', 'uk', 'ur', 'uz', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'ji', 'yo', 'zh', 'zu']
    message = data.text;
    test = message.replace('!перевод ', '').split(' ');
    lang = test.shift()
    message = test.join(' ').replace(lang, '');
    if (langs.includes(lang)) {
        if (message != '') {
            translate.translate(message, {to: lang}, function (err, res) {
                data.reply('Перевод: ' + res.text);
            });
        } else data.reply('Укажите текст для перевода!')
    } else {
        data.reply('Укажите язык, на который надо перевести. Напимер: en, de. Список языков тут: https://snipp.ru/handbk/iso-639-1')
    }
}

function orelcommand(data) {
    let abc = ['Выпал Орел', 'Выпала Решка']
    let randomn = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    if (randomn == 0){
        data.reply(abc[0])
    } else data.reply(abc[1])
}

function birthdaycommand(data) {
    let id;
    if (data.forwards.length != 0 && data.replyMessage == undefined) {
        id = data.forwards[0].senderId
    } else if (data.forwards.length == 0 && data.replyMessage != undefined) {
        id = data.replyMessage.senderId
    } else id = data.senderId
    if (id >= 0) {
        let url = 'https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + id + '&fields=bdate,first_name_gen,last_name_gen&v=' + v
        axios.get(url)
            .then(res => {
                let name = `${res.data.response[0].first_name}`
                let name_gen = `${res.data.response[0].first_name_gen} ${res.data.response[0].last_name_gen}`
                if (res.data.response[0].bdate != undefined) {
                    let bdate = res.data.response[0].bdate.split('.')
                    let one;
                    let year = moment().year().toString();
                    let curUnix = moment().unix()
                    if (bdate[2] == undefined) {
                        one = moment(bdate + "," + year, "DD,MM,YYYY").unix()
                    } else {
                        bdate = bdate.join(',').replace(/,[\d]*$/g, '')
                        one = moment(bdate + "," + year, "DD,MM,YYYY").unix()
                    }
                    let two = moment(curUnix) + 10800 // +TZ
                    let rem = one - two
                    if (rem < 0) {
                        year = (moment().year() + 1).toString();
                        one = moment(bdate + "," + year, "DD,MM,YYYY").unix()
                        two = moment(curUnix) + 10800
                        rem = one - two
                    } else { rem = one - two }
                    let m, s, h;
                    s = rem % 60;
                    rem = (rem - s) / 60;
                    m = rem % 60;
                    rem = (rem - m) / 60
                    h = (rem) % 24
                    rem = (rem - h) / 24
                    h = `${rem} ${dayname[CheckNumber(rem)]} ${h} ${hourname[CheckNumber(h)]}`
                    rem = `${h} и ${m} ${minname[CheckNumber(m)]}`
                    if (data.forwards.length == 0 && data.replyMessage == undefined) {
                        data.reply(`🎁 ${name}, до твоего дня рождения: ${rem} 🎁`)
                    } else { data.reply(`🎁 До дня рождения ${name_gen}: ${rem}`) }
                } else
                if (res.data.response[0].bdate == undefined) data.reply('Не могу получить дату рождения, включите её в настройках вашего профиля.')
            })
    }
}

async function everyonecommand(data) {
    let user1 = data.senderId;
    let peer = data.peerId;
    const regex = /^(?:@everyone).*?([\d]+).*?$/gm;
    var str = data.text;
    var str2 = str.replace(/@everyone/i, '')
    let cid = data.peerId;
    let uId = data.senderId;
    let chatUsersReq = await vk.api.messages.getConversationMembers({access_token: t1ken, peer_id: cid, v: v})
    let chatUsers = chatUsersReq.items
    var mes;
    let arr = chatUsers.map(el => el.member_id)
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > 0) {
            mes += ' @id' + JSON.stringify(arr[i]) + '(&#8300;)'
        } else mes += ' @club' + -JSON.stringify(arr[i]) + '(&#8300;)'
    }
    var text = String(mes).replace(/undefined/i, 'Объявление от ' + "@id" + uId + "(администратора)")
    var text = text.replace(/305738074/i, '1')
    data.send(text)
}

async function randcommand(data) {
    let peer = data.peerId;
    let cid = data.peerId - 2e9
    let user = data.senderId;
    let chatUsersReq = await api('messages.getConversationMembers', {access_token: t1ken, peer_id: peer, v: v})
    let chatUsers = chatUsersReq.response.items
    let arr = chatUsers.map(el => el.member_id)
    let id = arr[getRandomInRange(0, arr.length - 1)];
    vk.api.messages.removeChatUser({chat_id: cid, member_id: id, access_token: t1ken, v: v});
}

function numbercommand(data) {
    const regex = /^(?:!число) (.*?)$/gm;
    const str = data.text
    const m = regex.exec(str);
    if(m != null){
        let number = m[1];
        let  min = Math.ceil(0);
        let  max = Math.floor(number);
        let its = Math.floor(Math.random() * (max - min + 1)) + min;
        data.reply('Случайное число от 0 до ' + number + ': ' + its)
    }
}

function warnlistcommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    connection.query("SELECT * FROM `warns` WHERE `peer` = ?", [peer], async function (err, alreadybanned, f) {
        if (alreadybanned.length != 0) {
            var mes
            for (var i = 0; i < alreadybanned.length; i++) {
                if (alreadybanned[i].userid > 0) {
                    mes += ' @id' + JSON.stringify(alreadybanned[i].userid) + ' [' + JSON.stringify(alreadybanned[i].number) + '/3] \n'
                }
            }
            var text = String(mes).replace(/undefined/i, 'Список варнов в данной беседе:\n')
            data.send(text)
        }
    })
}

function banlistcommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    connection.query("SELECT * FROM `bans` WHERE `peer` = ?", [peer], async function (err, alreadybanned, f) {
        if (alreadybanned.length != 0) {
            var mes
            for (var i = 0; i < alreadybanned.length; i++) {
                if (alreadybanned[i].userid > 0) {
                    mes += ' @id' + JSON.stringify(alreadybanned[i].userid)
                } else mes += ' @club' + -JSON.stringify(alreadybanned[i].userid)
            }
            var text = String(mes).replace(/undefined/i, 'Список заблокированных в данной беседе:\n')
            data.send(text)
        }
    })
}

function regcommmand(data) {
    let message = data.text
    let uIdReg = message.replace(/(\/|!)reg/i, '').replace(/(([a-zа-я]+:\/\/)?([\w\.]+\.[a-zа-я]{2,6}\.?)(\S)?)/gi, '')
    let uId = uIdReg.match(/[\w*](\w*)]?/i)
    try {
        if (uId != null) {
            let url = 'https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + uId[0] + '&name_case=gen&v=' + v
            axios.get(url)
                .then(res => {
                    let info = res.data.response[0]
                    let name = `${info.first_name} ${info.last_name}`
                    needle.get(`https://vk.com/foaf.php?id=${info.id}`, function (err, res) {
                        if (err) console.log(err)
                        let xml = res.body
                        let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы

                        let unixCreated = moment(out).unix()
                        let tzReg = moment.unix(unixCreated).utcOffset(+3)
                        let age = getAgeText(unixCreated)
                        let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
                        data.reply(`Дата регистрации страницы ${name}:\n ${created}\n Возраст страницы: ${age}`)
                    })
                })
        } else if (data.forwards.length == 0 && data.replyMessage == undefined) {
            needle.get(`https://vk.com/foaf.php?id=${data.message.from_id}`, function (err, res) {
                if (err) console.log(err)
                let xml = res.body
                let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы
                let unixCreated = moment(out).unix()
                let tzReg = moment.unix(unixCreated).utcOffset(+3)
                let age = getAgeText(unixCreated)
                let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
                data.reply(`Дата регистрации Вашей страницы:\n${created}\n Возраст страницы: ${age}`)
            })
        } else if (data.forwards.length != 0 && data.message.reply_message == undefined) {
            if (data.forwards[0].senderId > 0) {
                let url = 'https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + data.forwards[0].senderId + '&name_case=gen&v=' + v
                axios.get(url)
                    .then(res => {
                        let info = res.data.response[0]
                        let name = `${info.first_name} ${info.last_name}`
                        needle.get(`https://vk.com/foaf.php?id=${data.forwards[0].senderId}`, function (err, res) {
                            if (err) console.log(err)
                            let xml = res.body
                            let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы
                            let unixCreated = moment(out).unix()
                            let tzReg = moment.unix(unixCreated).utcOffset(+3)
                            let age = getAgeText(unixCreated)
                            let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
                            data.reply(`Дата регистрации страницы ${name}:\n ${created}\n Возраст страницы: ${age}`)
                        })
                    })
            }
        } else if (data.forwards.length == 0 && data.replyMessage != undefined) {
            if (data.replyMessage.senderId > 0) {
                let url = 'https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + data.replyMessage.senderId + '&name_case=gen&v=' + v
                axios.get(url)
                    .then(res => {
                        let info = res.data.response[0]
                        let name = `${info.first_name} ${info.last_name}`
                        needle.get(`https://vk.com/foaf.php?id=${data.replyMessage.senderId}`, function (err, res) {
                            if (err) console.log(err)
                            let xml = res.body
                            let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы
                            let unixCreated = moment(out).unix()
                            let tzReg = moment.unix(unixCreated).utcOffset(+3)
                            let age = getAgeText(unixCreated)
                            let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
                            data.reply(`Дата регистрации страницы ${name}:\n ${created}\n Возраст страницы: ${age}`)
                        })
                    })
            }
        }
    } catch (er) {
        data.reply(er.message)
    }
}

function cidcommand(data) {
    let peer = data.peerId;
    let cid = data.peerId - 2e9
    data.reply('ChatID: ' + cid + '\n PeerID: ' + peer)
}

function exitkickcommand(data) {
    let peer = data.peerId;
    let user = data.senderId;
    let commandor = 'exitkick'
    connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 1", [peer, commandor], async function (err, chkcmd, f) {
        if(chkcmd.length == 1){
            connection.query("UPDATE `commands` SET `status` = '0' WHERE `commands`.`id` = ?;", [chkcmd[0].id], function (error, result, fields) {
                data.reply('Теперь вышедшие пользователи не будут автоматически исключаться из беседы!')
            })
        } else {
            connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 0", [peer, commandor], async function (err, chkcmd2, f) {
                if(chkcmd2.length == 1){
                    connection.query("UPDATE `commands` SET `status` = '1' WHERE `commands`.`id` = ?;", [chkcmd2[0].id], function (error, result, fields) {
                        data.reply('Теперь вышедшие пользователи будут автоматически исключаться из беседы!')
                    })
                } else {
                    connection.query("INSERT INTO `commands` (`peer`, `command`, `status`) VALUES (?, ?, ?);", [peer, commandor, 1], function (error, result, fields) {
                        data.reply('Теперь вышедшие пользователи будут автоматически исключаться из беседы!')
                    })
                }
            })
        }
    })
}

function transformWords(words, hooks) {
    const newWords = [];

    for (let word of words) {
        const checkedSymbols = new Set();
        for (const symbol of word) {
            const replaces = hooks[symbol];
            if (replaces && !checkedSymbols.has(symbol)) {
                checkedSymbols.add(symbol);
                const validSymbol = escapeRegExpText(symbol);
                const validReplaces = escapeRegExpText(replaces.join('|'));
                word = word.replace(
                    new RegExp(validSymbol, 'gi'),
                    `(${validSymbol}|${validReplaces})`
                );
            }
        }
        newWords.push(word);
    }
    return newWords;
}
