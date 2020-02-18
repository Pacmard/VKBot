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
        [] // база мата в формате 'слово1', 'слово2',
        {   'а' : ['a', '@'],
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

    const hooks = {
        'а' : ['a', '@'],
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
        'у' : [ 'y', 'u'],
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
        'я' : ['ya']
    }


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

vk.updates.hear(/^!число/i, data => {
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
})

vk.updates.hear('!нг', data => {
    var now = new Date(),
        ny = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
    data.reply('Осталось ' + Math.floor((ny.getTime() - now.getTime()) / 86400000) + ' дней');
})

vk.updates.hear('!орел и решка', data => {
    let abc = ['Выпал Орел', 'Выпала Решка']
    let randomn = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    if (randomn == 0){
        data.reply(abc[0])
    } else data.reply(abc[1])
})

vk.updates.hear(/^!rand/i, data => {
    let peer = data.peerId;
    let cid = data.peerId - 2e9
    let user = data.senderId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1" , [peer, user], async function (err, res, f) {
        if (res.length == 1) {
            let chatUsersReq = await api('messages.getConversationMembers', {access_token: t1ken, peer_id: peer, v: v})
            let chatUsers = chatUsersReq.response.items
            let arr = chatUsers.map(el => el.member_id)
            let id = arr[getRandomInRange(0, arr.length - 1)];
            vk.api.messages.removeChatUser({chat_id: cid, member_id: id, access_token: t1ken, v: v});
        } else data.reply('Эту команду может использовать только создатель беседы!')
    })
})

vk.updates.hear(/^!перевод/i, data => {
    const regex = /^(?:!перевод) (.*?)$/gm;
    const str = data.text
    const m = regex.exec(str);
    if (m.length != 0) {
        translate.detect(m[1], function (err, res) {
            if (res.lang != 'ru') {
                translate.translate(m[1], {to: 'ru'}, function (err, res) {
                    data.reply('Перевод: ' + res.text);
                });
            } else {
                translate.translate(m[1], {to: 'en'}, function (err, res) {
                    data.reply(res.text + ' \n \n С Русского временно можно переводить только на английский. Приносим извинения за неудобства.')
                })
            }
        });
    }
})

vk.updates.hear(/^@everyone/i, data => {
    let user1 = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user1], async function (err, admins, f) {
        if (admins.length == 1) {
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
            var text = text.replace(/305738074/i, '1') // dont mention user, which id is 305738074
            data.reply(text)
        } else data.reply('Вы не администратор!')
    })
})

vk.updates.hear(/^!kick/i, data => {
    let user = data.senderId;
    let peer = data.peerId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
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
    })
})

vk.updates.hear(/^!id/i, data => {
    let id;
    if (data.hasForwards == false && data.hasReplyMessage == false) id = data.message.from_id
    if (data.hasForwards == true && data.hasReplyMessage == false) id = data.forwards[0].senderId
    if (data.hasForwards == false && data.hasReplyMessage == true) id = data.replyMessage.senderId
    data.reply(id)
})

vk.updates.hear(/^\/q$/, data => {
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
})

vk.updates.hear(/(я спать|всем пока я спать)/i, data => {
    data.reply('споки зайка <3')
})

vk.updates.hear(/(не спать)/i, data => {
    data.reply('💔')
})

vk.updates.hear(/(!donate)/i, data => {
    data.reply('https://www.donationalerts.com/r/pacmard', 'video-42722952_171514596')
})

vk.updates.hear('/alive', data => {
    data.reply('живой')
})

vk.updates.hear(/^!cid/i, data => {
    let peer = data.peerId;
    let cid = data.peerId - 2e9
    data.reply('ChatID: ' + cid + '\n PeerID: ' + peer)
})

vk.updates.hear(/^!reg/i, data => {
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
})

vk.updates.hear(/^!др/i, data => {
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
})

vk.updates.hear(/^!когда/i, data => {
    let user = data.senderId;
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
})

vk.updates.hear(/^!apply/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    vk.api.messages.getConversationsById({ peer_ids: peer, access_token: t1ken, v: v }) .then(res => {
        if(res.count != 0){
            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `status` = 3 AND `botadmin` = 1" , [peer, user], function (err, ress, f) {
                if (ress.length == 0){
                    let user_id = res.items[0].chat_settings.owner_id
                    connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`, `botadmin`) VALUES (?, ?, ?, ?);" , [peer, user_id, 3, 1], function (error, result, fields) {
                        data.reply('Бот успешно проверил наличие прав администратора, создателю беседы выданы права администратора, для выдачи прав другому человеку используйте !admin @id. Приятного использования, с любовью, ваш Pacmard (автор бота)')
                    });
                } else data.reply('Бот уже проверил наличие прав администратора и выдал полномочия создателю беседы, повторная проверка не требуется, пожалуйста, не используйте данную команду без надобности.')
            });
        } else data.reply('Бот все еще не администратор. Выдайте права администратора для его полноценного функционирования.')
    })
})

vk.updates.hear(/^!ban/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!ban).*?([\d]+).*?$/gm;
    const str = data.text
    const m = regex.exec(str);
    if (m != null) {
        const user_id = m[1];
        connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
            if (admins.length == 1) {
                connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_id], async function (err, creator, f) {
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
            } else data.reply('Вы не администратор!')
        })
    } else data.reply('Укажите, какого пользователя Вы хотите заблокировать через упоминание!')
})

vk.updates.hear(/^!unban/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!unban).*?([\d]+).*?$/gm;
    const str = data.text
    const m = regex.exec(str);
    if (m != null) {
        const user_id = m[1];
        connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
            if (admins.length == 1) {
                connection.query("SELECT * FROM `bans` WHERE `peer` = ? AND `userid` = ?", [peer, user_id], async function (err, alreadybanned, f) {
                    if (alreadybanned.length == 1) {
                        connection.query("DELETE FROM `bans` WHERE `bans`.`id` = ?;", [alreadybanned[0].id], async function (err, ress22, f) {
                            data.reply('Пользователь разблокирован!')
                        })
                    } else data.reply('Пользователь не заблокирован!')
                })
            } else data.reply('Вы не являетесь администратором!')
        })
    } else data.reply('Укажите пользователя, которого нужно разблокировать!')
})

vk.updates.hear(/!что лучше/i, data => {
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
})

vk.updates.hear(/^!погода/i, data => {
    let message = data.text;
    let cityName = encodeURI(message.replace(/!погода /i, ''))
    let weatherToken = "token from https://openweathermap.org/api"
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
            let htmlcode = er.response.status;
            if (htmlcode == 404) {
                data.reply(`Упс.. Что-то пошло не так. Скорее всего, города не существует`)
            }
        })
})

vk.updates.hear(/^!кикатьвышедших/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    let commandor = 'exitkick'
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1", [peer, user], async function (err, admins, f) {
        if(admins.length == 1){
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
        } else data.reply('Вы не являетесь создателем данной беседы!')
    })
})

vk.updates.hear(/^!admin/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    const regex = /^(?:!admin|!админ).*?([\d]+).*?$/gm;
    const str = data.text;
    const m = regex.exec(str);
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1", [peer, user], function (err, res, f) {
        if (res.length == 1) {
            if (m.length != null) {
                const user_id = m[1];
                if (user != user_id) {
                    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_id], function (err, alreadyadm, f) {
                        if (alreadyadm.length == 0) {
                            connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`) VALUES (?, ?, ?);", [peer, user_id, 3], function (error, result, fields) {
                                data.reply('Права администратора были успешно выданы!')
                            })
                        } else data.reply('Пользователь уже администратор!')
                    })
                } else data.reply('Вы не можете выдать права администратора самому себе, вы и так администратор.')
            } else data.reply('Укажите пользователя, которому необходимо выдать права администратора через упоминание.')
        }
    });
});

vk.updates.hear(/^!unadmin/i, data => {
    let peer = data.peerId;
    let user = data.senderId;
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
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
        } else data.reply('Вы не являетесь создателем беседы для этого действия!')
    })
});

vk.updates.hear(/^!пред/i, async data => {
    let peer = data.peerId;
    let user = data.senderId;
    await data.loadMessagePayload();
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
            if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
                if ((data.replyMessage == undefined) && (data.forwards.length == 0)) {
                    const regex = /^(?:!пред).*?([\d]+).*?$/gm;
                    const str = data.text;
                    const m = regex.exec(str);
                    let cid = data.peerId - 2e9;
                    if (m != null) {
                        const user_warned = m[1];
                        if (user != user_warned) {
                            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_warned], async function (err, kickadmin, f) {
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
                        connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_warned], async function (err, kickadmin1, f) {
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
                            connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_warned], async function (err, kickadmin2, f) {
                                if (kickadmin2 == 0) {
                                    givewarn(data, peer, user_warned, cid)
                                } else data.reply('Вы не можете дать предупреждение администратору!')
                            })
                        }
                    }
                }
            } else data.reply('Укажите пользователя, которому надо дать предупреждение!')
        }
    })
})

vk.updates.hear(/^!снять/i, async data => {
    let peer = data.peerId;
    let user = data.senderId;
    await data.loadMessagePayload();
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
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
    })
})

vk.updates.hear(/^!сколько/i, async data => {
    let peer = data.peerId;
    let user = data.senderId;
    await data.loadMessagePayload();
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
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
            } else data.reply('Укажите пользователя, которому надо дать предупреждение!')
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

function givewarn(data, peer, user_warned, cid) {
    connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, user_warned], async function (err, chkwrn, f) {
        if (chkwrn.length == 1) {
            if (chkwrn[0].number == 1) {
                let nwrn = chkwrn[0].number + 1;
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [nwrn, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Вам вынесено второе предупреждение, в следующий раз Вы будете исключены из чата и программы! Старайтесь не использовать нецензурную лексику и оскорбления при общении друг с другом!' + ' #user' + user_warned)
                })
            } else if (chkwrn[0].number == 2){
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [3, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Мы неоднократно выносили Вам предупреждения. Вы будете исключены за большое количество нарушений.' + ' #user' + user_warned + ' @vkexperts')
                    vk.api.messages.removeChatUser({
                        chat_id: cid,
                        member_id: user_warned,
                        access_token: t1ken,
                        v: v
                    });
                })
            } else if (chkwrn[0].number == 0){
                connection.query("UPDATE `warns` SET `number` = ? WHERE `warns`.`id` = ?;", [1, chkwrn[0].id], function (error, result, fields) {
                    data.reply('Вам вынесено первое предупреждение, когда их будет 3 Вы будете исключены из чата и программы! Старайтесь не использовать нецензурную лексику и оскорбления при общении друг с другом!' + ' #user' + user_warned)
                })
            }
        } else {
            connection.query("INSERT INTO `warns` (`peer`, `userid`, `number`) VALUES (?, ?, ?);", [peer, user_warned, 1], function (error, result, fields) {
                data.reply('Вам вынесено первое предупреждение, когда их будет 3 Вы будете исключены из чата и программы! Старайтесь не использовать нецензурную лексику и оскорбления при общении друг с другом!' + ' #user' + user_warned)
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
    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_kicked], async function (err, kickadmin2, f) {
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
        /(\*|\{|\})/g,
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
