const { VK } = require('vk-io');
const axios = require('axios');
const needle = require("needle");
const parser = require('xml2json');
const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs')
var cmdsfnc = require('./funcmds.js')
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
        ['еблоид','бляхомудия','мамкоёб','припизженный','выбляпиздрище','дурак','дура','Объебал','Объебать','Наебашиться','Доебаться','Блядский','Ебанутый','Спидозный','Схуяли','Пиздеж','Проёб','Уебан','Ебучка','Полуебок','Проститутка','Ёбаный','Ебалай','тупая','тупой','уебан','ебашим','матка','пиздогрыз','ебанашка','motherfucker','pussy','кончефлыга','dick','член','ебланище','ссанина','рукаблуд','bastard','маразота','Далбоёб','тварь','даун','пиздабол','Спермоглот','Кончалыга','хуйню','Хуеглот','ебланище','Гандонище','Конч','Конченый','Конченный','Пидр','Хуила','Ебантяй','Пидарасина','Ебаклак','хуятина','уебанище','урод','гавнаед','хуило','уебывай','геюга','гей','додик','пидараска','ебошит','Ебашу','Хуярю','пздц','шмара','хуесосина','Говнарь','переебу','уебу','выебу','Хуепутоло','суко','еблантяй','долбаебина','ЕБАНУЛ','УЕБАЛСЯ','Объебался','пиздых','охуитительный','нахуа','Блядогон','впиздячил','рофланебало','хуямбула','херасе','залупина','пендос','Шлюхан','Ёбана','Хули','Охуеный','Охуенный','Аутист','Припиздок','Пиздос','Наебал','Отсоси','хуеголовый','Хуелиз','Влагалище','Пидорас','Срань','Гандоновец',' говноедище','Пидораска','Пидрила','ебашь','Охуело','сракотан','Пенис','ахуель','Сиська','Сиськи','Дебич','Еблостер','Пидорский','Уебанский','Ебобо','Ебонатор','епта','долбоебина','пидорасина','обани рот','рукоблуд','mq','сосать','гамосек','гомосек','гомосексуал','Ебасосина','биба','хуяндок','голубой','Голубь','петух','хуеглотище','херобуромалиновый','хуеёб','ебанарот','сучёнок','сучечка','ДЦПшник','ДЦП','говноёб','Аутяга','спизжено','пиздолюб','пиздоглот','жопаглот','Пиздёнка','пидорасище','Пиздоболить','Еблакшери','спиздоболил','сполохуйка','Стриппиздунчик','Выебнуться','ебанаш','шкура','Хуёво','баян','епать','баля','Сучёныш','Сучёнышь','Дилдак','Дилдо','ебланка','Трахаться','Трах','хуяндог','пиздоног','шмаль','Шваль','ахуевшая','ахуевший','Кобель','Путана','найух','моча','хуня','залупок','сучище','Сучарище','ска','нахой','kurwa','фак','пезда','хера','пропиздейшен','Спидоблять','пидарок','хуедрыг','хуетряс','Идиот','идиотка','далбоебина','давалка','пиздокрылоглаз','писькогрыз','Хуйкоглот','cock', 'cunt', 'fuck', 'fucker', 'fucking', 'отпиздит', 'архипиздрит', 'ахуел', 'ахуеть', 'бздение', 'бздеть', 'бздех', 'бздецы', 'бздит', 'бздицы', 'бздло', 'бзднуть', 'бздун', 'бздунья', 'бздюха', 'бздюшка', 'бздюшко', 'бля', 'блябу', 'блябуду', 'бляд', 'бляди', 'блядина', 'блядище', 'блядки', 'блядовать', 'блядство', 'блядун', 'блядуны', 'блядунья', 'блядь', 'блядюга', 'блять', 'вафел', 'вафлёр', 'взъебка', 'взьебка', 'взьебывать', 'въеб', 'въебался', 'въебенн', 'въебусь', 'въебывать', 'выблядок', 'выблядыш', 'выеб', 'выебать', 'выебен', 'выебнулся', 'выебон', 'выебываться', 'выпердеть', 'высраться', 'выссаться', 'вьебен', 'гавно', 'гавнюк', 'гавнючка', 'гамно', 'гандон', 'гнид', 'гнида', 'гниды', 'говенка', 'говенный', 'говешка', 'говназия', 'говнецо', 'говнище', 'говно', 'говноед', 'говнолинк', 'говночист', 'говнюк', 'говнюха', 'говнядина', 'говняк', 'говняный', 'говнять', 'гондон', 'доебываться', 'долбоеб', 'долбоёб', 'долбоящер', 'дрисня', 'дрист', 'дристануть', 'дристать', 'дристун', 'дристуха', 'дрочелло', 'дрочена', 'дрочила', 'дрочилка', 'дрочистый', 'дрочить', 'дрочка', 'дрочун', 'еб твою мать', 'ёб твою мать', 'ебал', 'ебало', 'ебальник', 'ебан', 'ебанамать', 'ебанат', 'ебаная', 'ёбаная', 'ебанический', 'ебанный', 'ебанныйврот', 'ебаное', 'ебануть', 'ебануться', 'ёбаную', 'ебаный', 'ебанько', 'ебарь', 'ебат', 'ёбат', 'ебатория', 'ебать', 'ебать-копать', 'ебаться', 'ебашить', 'ебёна', 'ебет', 'ебёт', 'ебец', 'ебик', 'ебин', 'ебись', 'ебическая', 'ебки', 'ебла', 'еблан', 'ебливый', 'еблище', 'ебло', 'еблыст', 'ебля', 'ёбн', 'ебнуть', 'ебнуться', 'ебня', 'ебошить', 'ебская', 'ебский', 'ебтвоюмать', 'ебун', 'ебут', 'ебуч', 'ебуче', 'ебучее', 'ебучий', 'ебучим', 'ебущ', 'ебырь', 'елда', 'елдак', 'елдачить', 'жопа', 'жопу', 'заговнять', 'задрачивать', 'задристать', 'задрота', 'заеб', 'заёб', 'заеба', 'заебал', 'заебанец', 'заебастая', 'заебастый', 'заебать', 'заебаться', 'заебашить', 'заебистое', 'заёбистое', 'заебистые', 'заёбистые', 'заебистый', 'заёбистый', 'заебись', 'заебошить', 'заебываться', 'залуп', 'залупа', 'залупаться', 'залупить', 'залупиться', 'замудохаться', 'запиздячить', 'засерать', 'засерун', 'засеря', 'засирать', 'засрун', 'захуячить', 'заябестая', 'злоеб', 'злоебучая', 'злоебучее', 'злоебучий', 'ибанамат', 'ибонех', 'изговнять', 'изговняться', 'изъебнуться', 'ипать', 'ипаться', 'ипаццо', 'Какдвапальцаобоссать', 'конча', 'курва', 'курвятник', 'лох', 'лошара', 'лошары', 'лошок', 'лярва', 'малафья', 'манда', 'мандавошек', 'мандавошка', 'мандавошки', 'мандей', 'мандень', 'мандеть', 'мандища', 'мандой', 'манду', 'мандюк', 'минет', 'минетчик', 'минетчица', 'млять', 'мокрощелка', 'мокрощёлка', 'мразь', 'мудаг', 'мудак', 'муде', 'мудель', 'мудеть', 'муди', 'мудил', 'мудила', 'мудистый', 'мудня', 'мудоеб', 'мудозвон', 'мудоклюй', 'на хер', 'на хуй', 'набздел', 'набздеть', 'наговнять', 'надристать', 'надрочить', 'наебать', 'наебет', 'наебнуть', 'наебнуться', 'наебывать', 'напиздел', 'напиздели', 'напиздело', 'напиздили', 'насрать', 'настопиздить', 'нахер', 'нахрен', 'нахуй', 'нахуйник', 'не ебет', 'не ебёт', 'невротебучий', 'невъебенно', 'нехира', 'нехрен', 'Нехуй', 'нехуйственно', 'ниибацо', 'ниипацца', 'ниипаццо', 'ниипет', 'никуя', 'нихера', 'нихуя', 'обдристаться', 'обосранец', 'обосрать', 'обосцать', 'обосцаться', 'обсирать', 'объебос', 'обьебать обьебос', 'однохуйственно', 'опездал', 'опизде', 'опизденивающе', 'остоебенить', 'остопиздеть', 'отмудохать', 'отпиздить', 'отпиздячить', 'отпороть', 'отъебись', 'охуевательский', 'охуевать', 'охуевающий', 'охуел', 'охуенно', 'охуеньчик', 'охуеть', 'охуительно', 'охуительный', 'охуяньчик', 'охуячивать', 'охуячить', 'очкун', 'падла', 'падонки', 'падонок', 'паскуда', 'педерас', 'педик', 'педрик', 'педрила', 'педрилло', 'педрило', 'педрилы', 'пездень', 'пездит', 'пездишь', 'пездо', 'пездят', 'пердануть', 'пердеж', 'пердение', 'пердеть', 'пердильник', 'перднуть', 'пёрднуть', 'пердун', 'пердунец', 'пердунина', 'пердунья', 'пердуха', 'пердь', 'переёбок', 'пернуть', 'пёрнуть', 'пидар', 'пидарас', 'пидарасы', 'пидары', 'пидор', 'пидорасы', 'пидорка', 'пидорок', 'пидоры', 'пидрас', 'пизда', 'пиздануть', 'пиздануться', 'пиздарваньчик', 'пиздато', 'пиздатое', 'пиздатый', 'пизденка', 'пизденыш', 'пиздёныш', 'пиздеть', 'пиздец', 'пиздит', 'пиздить', 'пиздиться', 'пиздишь', 'пиздища', 'пиздище', 'пиздобол', 'пиздоболы', 'пиздобратия', 'пиздоватая', 'пиздоватый', 'пиздолиз', 'пиздонутые', 'пиздорванец', 'пиздорванка', 'пиздострадатель', 'пизду', 'пиздуй', 'пиздун', 'пиздунья', 'пизды', 'пиздюга', 'пиздюк', 'пиздюлина', 'пиздюля', 'пиздят', 'пиздячить', 'писбшки', 'писька', 'писькострадатель', 'писюн', 'писюшка', 'по хуй', 'по хую', 'подговнять', 'подонки', 'подонок', 'подъебнуть', 'подъебнуться', 'поебать', 'поебень', 'поёбываает', 'поскуда', 'посрать', 'потаскуха', 'потаскушка', 'похер', 'похерил', 'похерила', 'похерили', 'похеру', 'похрен', 'похрену', 'похуй', 'похуист', 'похуистка', 'похую', 'придурок', 'приебаться', 'припиздень', 'припизднутый', 'припиздюлина', 'пробзделся', 'проблядь', 'проеб', 'проебанка', 'проебать', 'промандеть', 'промудеть', 'пропизделся', 'пропиздеть', 'пропиздячить', 'раздолбай', 'разхуячить', 'разъеб', 'разъеба', 'разъебай', 'разъебать', 'распиздай', 'распиздеться', 'распиздяй', 'распиздяйство', 'распроеть', 'сволота', 'сволочь', 'сговнять', 'секель', 'серун', 'серька', 'сестроеб', 'сикель', 'сирать', 'сирывать', 'соси', 'спиздел', 'спиздеть', 'спиздил', 'спиздила', 'спиздили', 'спиздит', 'спиздить', 'срака', 'сраку', 'сраный', 'сранье', 'срать', 'срун', 'ссака', 'ссышь', 'стерва', 'страхопиздище', 'сука', 'суки', 'суходрочка', 'сучара', 'сучий', 'сучка', 'сучко', 'сучонок', 'сучье', 'сцание', 'сцать', 'сцука', 'сцуки', 'сцуконах', 'сцуль', 'сцыха', 'сцышь', 'съебаться', 'сыкун', 'трахаеб', 'трахаёб', 'трахатель', 'ублюдок', 'уебать', 'уёбища', 'уебище', 'уёбище', 'уебищное', 'уёбищное', 'уебк', 'уебки', 'уёбки', 'уебок', 'уёбок', 'урюк', 'усраться', 'ушлепок', 'хамло', 'хер', 'херня', 'херовато', 'херовина', 'херовый', 'хитровыебанный', 'хитрожопый', 'хуе', 'хуё', 'хуевато', 'хуёвенький', 'хуевина', 'хуево', 'хуевый', 'хуёвый', 'хуек', 'хуёк', 'хуел', 'хуем', 'хуенч', 'хуеныш', 'хуенький', 'хуеплет', 'хуеплёт', 'хуепромышленник', 'хуерик', 'хуерыло', 'хуесос', 'хуесоска', 'хуета', 'хуетень', 'хуею', 'хуи', 'хуй', 'хуйком', 'хуйло', 'хуйня', 'хуйрик', 'хуище', 'хуля', 'хую', 'хуюл', 'хуя', 'хуяк', 'хуякать', 'хуякнуть', 'хуяра', 'хуясе', 'хуячить', 'целка', 'чмо', 'чмошник', 'чмырь', 'шалава', 'шалавой', 'шараёбиться', 'шлюха', 'шлюхой', 'шлюшка', 'ябывае', 'хуету', 'сукаблять'],
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
    let cmdchk = 'banlist'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!warnlist/i, data => {
    let cmdchk = 'warnlist'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!число/i, data => {
    let cmdchk = 'number'
    checkrights(data, cmdchk)
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
    let cmdchk = 'orel'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!rand/i, data => {
    let cmdchk = 'rand'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!перевод/i, data => {
    let cmdchk = 'translate'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^@everyone/i, data => {
    let cmdchk = 'everyone'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!kick/i, data => {
    let cmdchk = 'kick'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!id/i, data => {
    let cmdchk = 'idofuser'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!q/i, data => {
    let cmdchk = 'q'
    checkrights(data, cmdchk)
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
    let cmdchk = 'cid'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!reg/i, data => {
    let cmdchk = 'reg'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!др/i, data => {
    let cmdchk = 'birthday'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!когда/i, data => {
    let cmdchk = 'whenit'
    checkrights(data, cmdchk)
})
vk.updates.hear(/^!triggers/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 5", [peer, user], async function (err, crchk, f) {
        if (crchk.length == 1) {
            data.reply('!число - number \n !нг - newyear \n !орел и решка - orel \n !rand - rand \n !перевод - translate \n @everyone - everyone \n !kick - kick \n !id - idofuser \n !q - q \n /alive - alive \n !cid - cid \n !reg - reg \n !др - birthday \n !когда - whenit \n !ban - ban \n !unban - unban \n !что лучше - better \n !погода - weather \n !кикатьвышедших - exitkick \n !антимат - antimat \n !пред - warn \n !снять - unwarn \n !сколько - checkwarn \n !banlist  - banlist \n !warnlist - warnlist \b !addspec - addspec \n !remspec - remspec \n !admin - admin \n !unadmin - unadmin')
        }
    })
})


vk.updates.hear(/^!levels/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 5", [peer, user], async function (err, crchk, f) {
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
                                data.reply('Бот успешно проверил наличие прав администратора, создателю беседы выданы права администратора, для выдачи прав другому человеку используйте !admin @id. Приятного использования, с любовью, ваш Pacmard (автор бота) \n \n P.S Вы автоматически подписаны на рассылку! Отписаться может создатель беседы или спец. администратор при помощи команды !отписаться')
                        })
                    });
                } else data.reply('Бот уже проверил наличие прав администратора и выдал полномочия создателю беседы, повторная проверка не требуется, пожалуйста, не используйте данную команду без надобности.')
            });
        } else data.reply('Бот все еще не администратор. Выдайте права администратора для его полноценного функционирования.')
    })
})

vk.updates.hear(/^!ban/i, data => {
    let cmdchk = 'ban'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!unban/i, data => {
    let cmdchk = 'unban'
    checkrights(data, cmdchk)
})

vk.updates.hear(/!что лучше/i, data => {
    let cmdchk = 'better'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!погода/i, data => {
    let cmdchk = 'weather'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!кикатьвышедших/i, data => {
    let cmdchk = 'exitkick'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!антимат/i, data => {
    let cmdchk = 'antimat'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!admin/i, data => {
    let cmdchk = 'admin'
    checkrights(data, cmdchk)
});

vk.updates.hear(/^!addspec/i, data => {
    let cmdchk = 'addspec'
    checkrights(data, cmdchk)
}); // TODO: повышение с модера и ст.модера + защита от двойной выдачи

vk.updates.hear(/^!remspec/i, data => {
    let cmdchk = 'remspec'
    checkrights(data, cmdchk)
});

vk.updates.hear(/^!unadmin/i, data => {
    let cmdchk = 'unadmin'
    checkrights(data, cmdchk)
});

vk.updates.hear(/^!пред/i, async data => {
    let cmdchk = 'warn'
    checkrights(data, cmdchk)
})

vk.updates.hear(/^!moder/i, data => {
    let cmdchk = 'moder'
    checkrights(data, cmdchk)
});

vk.updates.hear(/^!unmoder/i, data => {
    let cmdchk = 'unmoder'
    checkrights(data, cmdchk)
});

vk.updates.hear(/^!снять/i, async data => {
    let cmdchk = 'unwarn'
    checkrights(data, cmdchk)
})


vk.updates.hear(/^!сколько/i, async data => {
    let cmdchk = 'checkwarn'
    checkrights(data, cmdchk)
})

vk.updates.start().catch(console.error);

function checkrights(data, cmdchk) {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `settings` WHERE `peer` = ?", [peer], async function (err, perm, f) {
        if (perm[0][cmdchk] > 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` >= ?", [peer, user, perm[0][cmdchk]], async function (err, checkwarnchk, f) {
                if (checkwarnchk.length == 1){
                    cmdsfnc.commands[cmdchk + 'command'](data)
                }
            })
        } else {
            cmdsfnc.commands[cmdchk + 'command'](data)
        }
    })
}

function escapeRegExpText(text) {
    return text.replace(
        /(\*|\{|\}|\(|\))/g,
        '\\$1'
    );
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
