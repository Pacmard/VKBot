const { VK } = require('vk-io');
const vk = new VK({
    token: 'your VK token'
});
const axios = require('axios');
const needle = require("needle");
const parser = require('xml2json');
const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs')
let v = 5.124
let t1ken = 'your VK token';
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'yourpasswd',
    database : 'yourmaindb'
});
var stats = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'yourpasswd',
    database : 'yourstatsdb'
});
connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});
stats.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected to stats as id ' + connection.threadId);
});
var commands = {
    banlistcommand: function (data) {
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
    },
    warnlistcommand: function (data) {
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
    },
    numbercommand: function (data) {
        const regex = /^(?:!число) (.*?)$/gm;
        const str = data.text
        const m = regex.exec(str);
        if (m != null) {
            let number = m[1];
            let min = Math.ceil(0);
            let max = Math.floor(number);
            let its = Math.floor(Math.random() * (max - min + 1)) + min;
            data.reply('Случайное число от 0 до ' + number + ': ' + its)
        }
    },
    orelcommand: function (data) {
        let abc = ['Выпал Орел', 'Выпала Решка']
        let randomn = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
        if (randomn == 0) {
            data.reply(abc[0])
        } else data.reply(abc[1])
    },
    randcommand: async function (data) {
        let peer = data.peerId;
        let cid = data.peerId - 2e9
        let user = data.senderId;
        let chatUsersReq = await vk.api.messages.getConversationMembers({ peer_id: peer, access_token: t1ken, v: v });
        let chatUsers = chatUsersReq.items
        let arr = chatUsers.map(el => el.member_id)
        let id = arr[getRandomInRange(0, arr.length - 1)];
        vk.api.messages.removeChatUser({chat_id: cid, member_id: id, access_token: t1ken, v: v});
    },
    kickcommand: function (data) {
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
                        kick(data, peer, cid, user_kicked)
                    }
                }
            } else if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
                let cid = data.peerId - 2e9;
                let user_kicked = data.replyMessage.senderId;
                if (user_kicked != user) {
                    kick(data, peer, cid, user_kicked)
                }
            } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
                let cid = data.peerId - 2e9;
                for (var i = 0; i < data.forwards.length; i++) {
                    let user_kicked = data.forwards[i].senderId
                    if (user_kicked > 1 && user_kicked != user) {
                        kick(data, peer, cid, user_kicked)
                    }
                }
            }
        } else data.reply('Укажите пользователя, которого вы хотите кикнуть')
    },
    idofusercommand: function (data) {
        let id;
        if (data.hasForwards == false && data.hasReplyMessage == false) id = data.message.from_id
        if (data.hasForwards == true && data.hasReplyMessage == false) id = data.forwards[0].senderId
        if (data.hasForwards == false && data.hasReplyMessage == true) id = data.replyMessage.senderId
        data.reply(id)
    },
    qcommand: function qcommand(data) {
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
    },
    cidcommand: function (data) {
        let peer = data.peerId;
        let cid = data.peerId - 2e9
        data.reply('ChatID: ' + cid + '\n PeerID: ' + peer)
    },
    regcommand: function (data) {
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
                            console.log(xml)
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
                    console.log(xml)
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
                                console.log(xml)
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
                                console.log(xml)
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
    },
    birthdaycommand: function (data) {
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
                        } else {
                            rem = one - two
                        }
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
                        } else {
                            data.reply(`🎁 До дня рождения ${name_gen}: ${rem}`)
                        }
                    } else if (res.data.response[0].bdate == undefined) data.reply('Не могу получить дату рождения, включите её в настройках вашего профиля.')
                })
        }
    },
    whenit: function (data) {
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
    },
    checkwarncommand: function (data) {
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
    },
    bancommand: function (data) {
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
    },
    unbancommand: function (data) {
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
    },
    bettercommand: function (data) {
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
    },
    weathercommand: function (data) {
        let message = data.text;
        let cityName = encodeURI(message.replace(/!погода /i, ''))
        let weatherToken = "your weather token"
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
    },
    exitkickcommand: function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        let commandor = 'exitkick'
        connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 1", [peer, commandor], async function (err, chkcmd, f) {
            if (chkcmd.length == 1) {
                connection.query("UPDATE `commands` SET `status` = '0' WHERE `commands`.`id` = ?;", [chkcmd[0].id], function (error, result, fields) {
                    data.reply('Теперь вышедшие пользователи не будут автоматически исключаться из беседы!')
                })
            } else {
                connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 0", [peer, commandor], async function (err, chkcmd2, f) {
                    if (chkcmd2.length == 1) {
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
    },
    antimatcommand: function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        let commandor = 'banmat'
        connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 1", [peer, commandor], async function (err, chkcmd, f) {
            if (chkcmd.length == 1) {
                connection.query("UPDATE `commands` SET `status` = '0' WHERE `commands`.`id` = ?;", [chkcmd[0].id], function (error, result, fields) {
                    data.reply('Теперь можно материться!')
                })
            } else {
                connection.query("SELECT * FROM `commands` WHERE `peer` = ? AND `command` = ? AND `status` = 0", [peer, commandor], async function (err, chkcmd2, f) {
                    if (chkcmd2.length == 1) {
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
    },
    admincommand: function (data) {
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
                        if (alreadyadm[0].status < 3) {
                            connection.query("UPDATE `admins` SET `status` = '3' WHERE `admins`.`id` = ?;", [alreadyadm[0].id], function (error, result, fields) {
                                data.reply('Пользователь успешно повышен до администратора!')
                            })
                        } else data.reply('Вы не можете понизить спец.администратора этой командой! Используйте !remspec перед тем как назначить его администратором!')
                    }
                })
            } else data.reply('Вы не можете выдать права администратора самому себе, вы и так администратор.')
        } else data.reply('Укажите пользователя, которому необходимо выдать права администратора через упоминание.')
    },
    addspeccommand: function (data) {
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
    },
    remspeccommand: function (data) {
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
    },
    unadmincommand: function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        const regex = /^(?:!unadmin).*?([\d]+).*?$/gm;
        const str = data.text;
        const m = regex.exec(str);
        if (m != null) {
            const user_id = m[1];
            if (user_id != user) {
                connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_id], async function (err, ress11, f) {
                    if (ress11.length == 1) {
                        connection.query("DELETE FROM `admins` WHERE `admins`.`id` = ?;", [ress11[0].id], async function (err, ress22, f) {
                            data.reply('С пользователя успешно сняты права администратора!')
                        })
                    } else data.reply('Пользователь не является администратором!')
                })
            } else data.reply('Вы не можете снять права администратора с себя!')
        } else data.reply('Упомяните пользователя с которого нужно снять права администратора!')
    },
    warncommand: function (data) {
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
    },
    unwarncommand: function (data) {
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
    },
    unmodercommand: function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        const regex = /^(?:!unmoder).*?([\d]+).*?$/gm;
        const str = data.text;
        const m = regex.exec(str);
        if (m != null) {
            const user_id = m[1];
            if (user_id != user) {
                connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 1", [peer, user_id], async function (err, ress11, f) {
                    if (ress11.length == 1) {
                        connection.query("DELETE FROM `admins` WHERE `admins`.`id` = ?;", [ress11[0].id], async function (err, ress22, f) {
                            data.reply('С пользователя успешно сняты права модератора!')
                        })
                    } else data.reply('Пользователь не является модератором!')
                })
            } else data.reply('Вы не можете снять права модератора с себя!')
        } else data.reply('Упомяните пользователя с которого нужно снять права модератора!')
    },
    modercommand: function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        const regex = /^(?:!moder).*?([\d]+).*?$/gm;
        const str = data.text;
        const m = regex.exec(str);
        if (m.length != null) {
            const user_id = m[1];
            if (user != user_id) {
                connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ?", [peer, user_id], function (err, alreadyadm, f) {
                    if (alreadyadm.length == 0) {
                        connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`) VALUES (?, ?, ?);", [peer, user_id, 1], function (error, result, fields) {
                            data.reply('Права модератора были успешно выданы!')
                        })
                    }
                })
            } else data.reply('Вы не можете выдать права модератора самому себе, вы и так владеете данными полномочиями.')
        } else data.reply('Укажите пользователя, которому необходимо выдать права модератора через упоминание.')
    },
    unstmodercommand: function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        const regex = /^(?:!unstmoder).*?([\d]+).*?$/gm;
        const str = data.text;
        const m = regex.exec(str);
        if (m != null) {
            const user_id = m[1];
            if (user_id != user) {
                connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ? AND `status` = 2", [peer, user_id], async function (err, ress11, f) {
                    if (ress11.length == 1) {
                        connection.query("DELETE FROM `admins` WHERE `admins`.`id` = ?;", [ress11[0].id], async function (err, ress22, f) {
                            data.reply('С пользователя успешно сняты права ст.модератора!')
                        })
                    } else data.reply('Пользователь не является ст.модератором!')
                })
            } else data.reply('Вы не можете снять права с себя!')
        } else data.reply('Упомяните пользователя с которого нужно снять права ст.модератора!')
    },
    stmodercommand: function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        const regex = /^(?:!stmoder).*?([\d]+).*?$/gm;
        const str = data.text;
        const m = regex.exec(str);
        if (m.length != null) {
            const user_id = m[1];
            if (user != user_id) {
                connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ?", [peer, user_id], function (err, alreadyadm, f) {
                    if (alreadyadm.length == 0) {
                        connection.query("INSERT INTO `admins` (`peer`, `userid`, `status`) VALUES (?, ?, ?);", [peer, user_id, 2], function (error, result, fields) {
                            data.reply('Права ст.модератора были успешно выданы!')
                        })
                    } else {
                        if (alreadyadm[0].status < 2) {
                            connection.query("UPDATE `admins` SET `status` = '2' WHERE `admins`.`id` = ?;", [alreadyadm[0].id], function (error, result, fields) {
                                data.reply('Пользователь успешно повышен до ст.модератора!')
                            })
                        }
                    }
                })
            } else data.reply('Вы не можете выдать права модератора самому себе, вы и так владеете данными полномочиями.')
        } else data.reply('Укажите пользователя, которому необходимо выдать права модератора через упоминание.')
    },
    statscommand: async function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        stats.query("SELECT * FROM `users` WHERE `peer` = ? AND `userid` = ?", [peer, user], async function (err, userstable, f) {
            stats.query("SELECT * FROM `messages` WHERE `peer` = ? AND `userid` = ?", [peer, user], async function (err, msgcount, f) {
                connection.query("SELECT * FROM `warns` WHERE `peer` = ? AND `userid` = ?", [peer, user], async function (err, warns, f) {
                    connection.query("SELECT * FROM `admins` WHERE `peer` = ? AND `userid` = ?", [peer, user], async function (err, rolecheck, f) {
                        let userinfo = await vk.api.users.get({
                            user_ids: user
                        });
                        let role
                        let msgnumber
                        let warnscount
                        let dateadd = userstable[0].date
                        let dating = new Date(dateadd * 1000);
                        let datestamp = dating.toLocaleDateString("ru-RU")
                        if (warns.length == 0) {
                            warnscount = 0
                        } else warnscount = warns[0].number
                        if (msgcount.length == 0) {
                            msgnumber = 0
                        } else msgnumber = msgcount[0].count
                        if (rolecheck.length == 0) {
                            role = 'Пользователь'
                        } else {
                            if (rolecheck[0].status == 1) {
                                role = 'Модератор'
                            }
                            if (rolecheck[0].status == 2) {
                                role = 'Ст.Модератор'
                            }
                            if (rolecheck[0].status == 3) {
                                role = 'Администратор'
                            }
                            if (rolecheck[0].status == 4) {
                                role = 'Спец.Администратор'
                            }
                            if (rolecheck[0].status == 5) {
                                role = 'Владелец'
                            }
                        }
                        let msg = 'Статистика пользователя @id' + user + '(' + userinfo[0].first_name + ' ' + userinfo[0].last_name + ')\n\n Ник: ' + userstable[0].nickname + '\nРоль в беседе: ' + role + '\n\n💭Количество отправленных сообщений: ' + msgcount[0].count + '\n❗Количество варнов: ' + warnscount + '\n🕺Дата добавления в чат: ' + datestamp
                        data.reply(msg)
                    })
                })
            })
        })
    },
    uploadstatscommand: async function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        let convusers = await vk.api.messages.getConversationMembers({
            peer_id: peer
        });
        for (var i = 0; i < convusers.items.length; i++) {
            let useradd = convusers.items[i].member_id
            let joindate = convusers.items[i].join_date
            stats.query("SELECT * FROM `users` WHERE `peer` = ? AND `userid` = ?", [peer, useradd], async function (err, isspec, f) {
                if (isspec.length == 0) {
                    stats.query("INSERT INTO `users` (`peer`, `userid`, `date`, `nickname`) VALUES (?, ?, ?, ?);", [peer, useradd, joindate, 'нет'], function (error, result, fields) {
                    })
                }
            })
        }
    },
    setnickcommand: async function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
            if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
                let cid = data.peerId - 2e9;
                let user_nicked = data.replyMessage.senderId;
                setusernick(data, user_nicked)
            } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
                let cid = data.peerId - 2e9;
                for (var i = 0; i < data.forwards.length; i++) {
                    let user_nicked = data.forwards[i].senderId
                    if (user_nicked > 1) {
                        setusernick(data, user_nicked)
                    }
                }
            }
        } else data.reply('Укажите пользователя, которому надо дать предупреждение!')
    },
    remnickcommand: async function (data) {
        let peer = data.peerId;
        let user = data.senderId;
        if ((data.replyMessage != undefined) || (data.forwards.length != 0) || ((data.replyMessage == undefined) && (data.forwards.length == 0))) {
            if ((data.forwards.length == 0) && (data.replyMessage != undefined)) {
                let cid = data.peerId - 2e9;
                let user_nicked = data.replyMessage.senderId;
                remusernick(data, user_nicked)
            } else if ((data.forwards.length != 0) && (data.replyMessage == undefined)) {
                let cid = data.peerId - 2e9;
                for (var i = 0; i < data.forwards.length; i++) {
                    let user_nicked = data.forwards[i].senderId
                    if (user_nicked > 1) {
                        remusernick(data, user_nicked)
                    }
                }
            }
        } else data.reply('Укажите пользователя, которому надо дать предупреждение!')
    }
}

var yearName = ['год', 'года', 'лет']
var dayname = ['день', 'дня', 'дней'];
var hourname = ['час', 'часа', 'часов'];
var minname = ['минута', 'минуты', 'минут'];
var secname = ['секунда', 'секунды', 'секунд'];

function setusernick(data, user_nicked) {
    let peer = data.peerId;
    let msg = data.text;
    let nick = msg.replace(/!setnick /i, '')
    stats.query("SELECT * FROM `users` WHERE `peer` = ? AND `userid` = ?", [peer, user_nicked], async function (err, userstable, f) {
        stats.query("UPDATE `users` SET `nickname` = ? WHERE `users`.`id` = ?;", [nick, userstable[0].id], function (error, result, fields) {
            data.reply('Новый ник успешно установлен!')
        })
    })
}

function remusernick(data, user_nicked) {
    let peer = data.peerId;
    let msg = data.text;
    let nick = 'нет'
    stats.query("SELECT * FROM `users` WHERE `peer` = ? AND `userid` = ?", [peer, user_nicked], async function (err, userstable, f) {
        stats.query("UPDATE `users` SET `nickname` = ? WHERE `users`.`id` = ?;", [nick, userstable[0].id], function (error, result, fields) {
            data.reply('Ник удален!')
        })
    })
}

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

function kick(data, peer, cid, user_kicked) {
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

module.exports.commands = commands;