let express = require('express');
let bodyParser = require('body-parser');
let app = express();
const os = require('os');

let t1ken = 'enter your token here';
const VkBot = require('node-vk-bot-api'),
  Markup = require('node-vk-bot-api/lib/markup'),
  api = require('node-vk-bot-api/lib/api'),
  Scene = require('node-vk-bot-api/lib/scene'),
  Context = require('node-vk-bot-api/lib/context'),
  bot = new VkBot(t1ken)
var VK = require('VK-Promise'),
    vk = new VK('enter your token here');
var fs = require('fs')
key = 'yandex translate token here'
var translate = require('yandex-translate')(key)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
var mysql      = require('mysql');
const parser = require('xml2json');
var needle = require("needle");
const axios = require('axios');
const moment = require('moment');
let v = 5.101
var text = 1;
const admins = [] // admins massive, only numbers (example: 1, 1111, 1112113122 etc.), will be deleted soon
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

/*
bot.command(/(\/|!)rand/i, async (data) => {
	let peer = data.message.peer_id
	let cid = data.message.peer_id - 2e9
  let chatUsersReq = await api('messages.getConversationMembers', { access_token: t1ken, peer_id: peer, v: v }) 
  let chatUsers = chatUsersReq.response.items 
  let arr = chatUsers.map(el => el.member_id)
  let id = arr[getRandomInRange(0, arr.length-1)];
  api('messages.removeChatUser', { chat_id: cid, user_id: id, access_token: t1ken, v: v }).then(res => {
	let da = res.data.response[0]
  data.reply("Успешно")
  }).catch(er => 
          {
        if (id > 0) data.reply('Невозможно исключить ' + '@id' + id + '(данного) ' + 'пользователя')
      else data.reply('Невозможно исключить ' + '@club' + (-id) + '(данное) ' + 'сообщество')
			})
}) // kick random conversation member 
*/



bot.command(/^!перевод/i, (data) => {
  const regex = /^(?:!перевод) (.*?)$/gm;
      const str = data.message.text
      const m = regex.exec(str);
translate.detect(m[1], function(err, res) {
  if(res.lang != 'ru'){
    translate.translate(m[1], { to: 'ru' }, function(err, res) {
      data.reply('Перевод: ' + res.text);
     });
  } else {
        translate.translate(m[1], { to: 'en' }, function(err, res) {

            data.reply(res.text + ' \n \n С Русского временно можно переводить только на английский. Приносим извинения за неудобства.')
        })
    }
});
}) // translation from any language, which supported by Yandex Translator and from Russian to English

bot.command(/(\/|@)everyone/i, async (data) => {
    let user1 = data.message.from_id;
    let admin2 = 120158515;
    let admin3 = 305738074;
    let peer = data.message.peer_id;
    connection.query("SELECT * FROM `yourls_url` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user1], async function (err, admins, f) {
        if (admins.length == 1) {
            const regex = /^(?:@everyone).*?([\d]+).*?$/gm;
            var str = data.message.text;
            var str2 = str.replace(/@everyone/i, '')
            let cid = data.message.peer_id
            let uId = data.message.from_id
            let chatUsersReq = await api('messages.getConversationMembers', {access_token: t1ken, peer_id: cid, v: v})
            let chatUsers = chatUsersReq.response.items
            var mes;
            let arr = chatUsers.map(el => el.member_id)
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] > 0) {
                    mes += ' @id' + JSON.stringify(arr[i]) + '(&#8300;)'
                } else mes += ' @club' + -JSON.stringify(arr[i]) + '(&#8300;)'
            }
            try {

                axios.get('https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + uId + '&v=' + v)
                    .then(res => {
                        let dataa = res.data.response[0]
                        let user = dataa.id
                        var text = String(mes).replace(/undefined/i, 'Объявление от ' + "@id" + user + "(администратора)")
                        var text = text.replace(/305738074/i, '1') // dont mention user, which id is 305738074
                        data.reply(text)
                    })
            } catch (er) {

            }

        } else data.reply('Вы не администратор!')
    })
}) // mention everyone in the conversation

bot.command(/^!dkb/i, (data) => {
  	let peer = data.message.peer_id;
  let dkb = '{ "one_time": true, "buttons": [ [{ "action": { "type": "vkpay", "hash": "action=transfer-to-group&group_id=144372147&aid=10" } }] ] }'
api('messages.send', {peer_id: peer, keyboard: dkb, message: 'Клавиатура подана', random_id: '0', access_token: t1ken, v: v })
}) // donate to me by VK Pay

bot.command(/^разбуди/i, (data) => {
      let user = data.message.from_id;
let admin = 376404149;
let admin2 = 305738074;
let admin3 = 297973760;
      const regex = /^(?:разбуди|проснись).*?([\d]+).*?$/gm;
      const str = data.message.text
      const m = regex.exec(str);
      const user_id = m[1]; 
  if ((user == admin) || (user == admin2) || (user == admin3)) {
  for(let y=0; y<100; y++){
     setTimeout(function() {  data.reply('@id'+m[1]) }, 5000)
  }
  }
}) // send 25 mentiones to user. example: разбуди @id1, needs to be finished

bot.command(/^кик/i, (data) => {
    let user = data.message.from_id;
    let peer = data.message.peer_id;
    connection.query("SELECT * FROM `yourls_url` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user], async function (err, admins, f) {
        if (admins.length == 1) {
            if ((data.message.reply_message != undefined) || (data.message.fwd_messages != undefined) || (data.message.reply_message == data.message.fwd_messages)){
                if ((data.message.reply_message == undefined) && (data.message.fwd_messages.length == 0)) {
                    const regex = /^(?:кик|кусь).*?([\d]+).*?$/gm;
                    const str = data.message.text
                    const m = regex.exec(str);
                    const user_id = m[1];
                    let cid = data.message.peer_id - 2e9
                    if (user != user_id) {
                        api('messages.removeChatUser', { chat_id: cid, member_id: m[1], access_token: t1ken, v: v })
                    }
                } else

                if ((data.message.fwd_messages.length == 0) && (data.message.reply_message != undefined)) {
                    let cid = data.message.peer_id - 2e9
                    let user_kicked = data.message.reply_message.from_id
                    if (user_kicked != user) {
                        api('messages.removeChatUser', { chat_id: cid, member_id: user_kicked, access_token: t1ken, v: v })
                    }
                } else

                if ((data.message.fwd_messages.length != 0) && (data.message.reply_message == undefined)) {
                    let cid = data.message.peer_id - 2e9
                    for (var i = 0; i < data.message.fwd_messages.length; i++) {
                        let user_kicked = data.message.fwd_messages[i].from_id
                        if (user_kicked > 1 && user_kicked != user) {
                            api('messages.removeChatUser', { chat_id: cid, member_id: user_kicked, access_token: t1ken, v: v })
                        }
                    }
                }
            } else data.reply('Укажите пользователя, которого вы хотите кикнуть')
        }
    })
}) // kick specific member, you can kick one or more users by replying messages or kick one user by mention
/*
bot.command(/^(\/|!)m/i, (data) => {
	data.reply(JSON.stringify(data.message))
}) // service command, returns info about conversation

bot.command(/^(\/|!)id$/, (data) => {
	let id;
	if (data.message.fwd_messages[0] == undefined && data.message.reply_message == undefined) id = data.message.from_id
	if (data.message.fwd_messages[0] != undefined && data.message.reply_message == undefined) id = data.message.fwd_messages[0].from_id
	if (data.message.fwd_messages[0] == undefined && data.message.reply_message != undefined) id = data.message.reply_message.from_id
	data.reply(id) 
}) // command returns id of specific user
*/

bot.command(/^(\/|!)cid$/, (data) => {
  	      let peer = data.message.peer_id
        	let cid = data.message.peer_id - 2e9
        	data.reply('ChatID: ' + cid + '\n PeerID: ' + peer)
}) // returns peer and chat id 


bot.command(/^\/q$/, (data) => {
	let chat_id = data.message.peer_id - 2e9
	let userKick = data.message.from_id
api('messages.removeChatUser', { chat_id: chat_id, user_id: userKick, access_token: t1ken })
	.then(res => {
		if (res.response == 1) {
		data.reply(`Пока`)
		}
	})
	.catch(er => {
		data.reply(`Опа, ошибочка! \n\n Скорее всего Вы являетесь администратором либо создателем беседы, поэтому выйти невозможно :с`)
		})
}) // self kick from conversation

bot.command(/(я спать|всем пока я спать)/i, (data) => {
  data.reply('споки зайка <3')
}) // wishes good night 

bot.command(/(не спать)/i, (data) => {
  data.reply('💔')
}) // broken heart if you dont sleep

bot.command(/(!donate)/i, (data) => {
  data.reply('https://www.donationalerts.com/r/pacmard', 'video-42722952_171514596')
}) // donate to me


bot.command(/^(\/|!)reg/i, (data) => {
  let message = data.message.text
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
    } else if (data.message.fwd_messages[0] == undefined && data.message.reply_message == undefined) {
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
    } else if (data.message.fwd_messages[0] != undefined && data.message.reply_message == undefined) {
      if (data.message.fwd_messages[0].from_id > 0) {
        let url = 'https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + data.message.fwd_messages[0].from_id + '&name_case=gen&v=' + v
        axios.get(url)
          .then(res => {
            let info = res.data.response[0]
            let name = `${info.first_name} ${info.last_name}`
            needle.get(`https://vk.com/foaf.php?id=${data.message.fwd_messages[0].from_id}`, function (err, res) {
              if (err) console.log(err)
              let xml = res.body
              let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы 
              let unixCreated = moment(out).unix()
              let tzReg = moment.unix(unixCreated).utcOffset(+3)
              let age = getAgeText(unixCreated)
              let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
              data.reply(`Дата регистрации страницы ${name}:\n ${created}\n Возраст страницы: ${age}`)
              console.log (url,)
            })
          })
      } else {
        data.reply('Только попробуй еще раз чекнуть у группы, скотина')
      }
    } else if (data.message.fwd_messages[0] == undefined && data.message.reply_message != undefined) {
      if (data.message.reply_message.from_id > 0) {
        let url = 'https://api.vk.com/method/users.get?access_token=' + t1ken + '&user_ids=' + data.message.reply_message.from_id + '&name_case=gen&v=' + v
        axios.get(url)
          .then(res => {
            let info = res.data.response[0]
            let name = `${info.first_name} ${info.last_name}`
            needle.get(`https://vk.com/foaf.php?id=${data.message.reply_message.from_id}`, function (err, res) {
              if (err) console.log(err)
              let xml = res.body
              let out = JSON.parse(parser.toJson(xml))["rdf:RDF"]["foaf:Person"]["ya:created"]["dc:date"] // Дата регистрации страницы 
              let unixCreated = moment(out).unix()
              let tzReg = moment.unix(unixCreated).utcOffset(+3)
              let age = getAgeText(unixCreated)
              let created = tzReg.locale('ru').format('D MMMM YYYY, HH:mm')
              data.reply(`Дата регистрации страницы ${name}:\n ${created}\n Возраст страницы: ${age}`)
              //console.log (url,)
            })
          })
      } else {
        data.reply('Только попробуй еще раз чекнуть у группы, скотина')
      }
    }

 } catch (er) {
    data.reply(er.message)
  }
}) // check reg data of any user


bot.command('/alive', (data) => {
  data.reply('живой')
}) // service command, checking bot status


bot.command(/^(\/|!)др$/i, (cmd) => {
  let id;
  if (cmd.message.fwd_messages[0] != undefined && cmd.message.reply_message == undefined) {
    id = cmd.message.fwd_messages[0].from_id
  } else if (cmd.message.fwd_messages[0] == undefined && cmd.message.reply_message != undefined) {
    id = cmd.message.reply_message.from_id
  } else id = cmd.message.from_id
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
          if (cmd.message.fwd_messages[0] == undefined && cmd.message.reply_message == undefined) {
            cmd.reply(`🎁 ${name}, до твоего дня рождения: ${rem} 🎁`)
          } else { cmd.reply(`🎁 До дня рождения ${name_gen}: ${rem}`) }
        } else
          if (res.data.response[0].bdate == undefined) cmd.reply('Не могу получить дату рождения, включите её в настройках вашего профиля.')
      })
  } else {
    cmd.reply(`Ты чо`)
  }
}) // check your birthday 


bot.command(/^(\/|!)когда/i, (msg) => {
    switch (random(1, 18)) {
      case 1:
        var mintes = declOfNum(['минуту', 'минуты', 'минут'])
        var rs = random(1, 60);
        msg.reply("Это случится через -- " + rs + " " + mintes(rs))
        break;
      case 2:
        var mintes = declOfNum(['час', 'часа', 'часов'])
        var rs = random(1, 24);
        msg.reply("Это случится через -- " + rs + " " + mintes(rs))
        break;
      case 3:
        var mintes = declOfNum(['день', 'дня', 'дней'])
        var rs = random(1, 365);
        msg.reply("Это случится через -- " + rs + " " + mintes(rs))
        break;
      case 4:
        var mintes = declOfNum(['год', 'года', 'лет'])
        var rs = random(1, 60);
        msg.reply("Это случится через -- " + rs + " " + mintes(rs))
        break;
      case 5:
        msg.reply("Завтра.");
        break;
      case 6:
        msg.reply("Никогда.")
        break;
      case 7:
        msg.reply("Прямо сейчас.")
        break;
      case 8:
        msg.reply("Когда-нибудь.")
        break;
      case 9:
        msg.reply("Сегодня.")
        break;
      case 10:
        msg.reply("В этом месяце.")
        break;
      case 11:
        msg.reply("В следующем месяце.")
        break;
      case 12:
        msg.reply("На этой неделе.")
        break;
      case 13:
        msg.reply("На следующей неделе.")
        break;
      case 14:
        msg.reply("Через неделю.")
        break;
      case 15:
        msg.reply("Через месяц.")
        break;
      case 16:
        msg.reply("Вчера.")
        break;
      case 17:
        msg.reply("Когда рак на горе свистнет")
        break;
      case 18:
        msg.reply("В следующем году.")
        break;

    }
}) // sample of 'when'. sends random answer from massive

bot.command(/^!число/i, (data) => {
    const regex = /^(?:!число) (.*?)$/gm;
    const str = data.message.text
    const m = regex.exec(str);
    if(m[1] != undefined){
        let number = m[1];
      let  min = Math.ceil(0);
      let  max = Math.floor(number);
        let its = Math.floor(Math.random() * (max - min + 1)) + min;
        data.reply('Случайное число от 0 до ' + number + ': ' + its)
    }
}) // random number in range of 0 to nubmer you wrote at the command, command example: !число 102

bot.command('!нг', (data) => {
    var now = new Date(),
        ny = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
    data.reply('Осталось ' + Math.floor((ny.getTime() - now.getTime()) / 86400000) + ' дней');
}) // time to new year, thanks, google

bot.command('!орел и решка', (data) => {
    let abc = ['Выпал Орел', 'Выпала Решка']
    let randomn = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
    if (randomn == 0){
        data.reply(abc[0])
    }else data.reply(abc[1])
}) // heads or tails


bot.command(/(что лучше|что лучше)/i, (data) => {
  try {
    let message = data.message.text
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
}) // using: /что лучше X или Y . sends random answer (X or Y)


bot.command(/^погода/i, (msg) => { 
	if (msg.message.peer_id != 2e9 + 42) {
		let message = msg.message.text;
		let cityName = encodeURI(message.replace(/погода /i, ''))
		let weatherToken = "153ca3260d689a77a64566dc04a803c9"
		let url = "https://api.openweathermap.org/data/2.5/weather?&q=" + cityName + '&appid=' + weatherToken + '&lang=ru'
		//console.log (url)
		axios.get(url)
			.then(res => {
				let data = res.data
				if (data.sys.country == "RU") data.sys.country = "🇷🇺"
				if (data.sys.country == "UA") data.sys.country = "🇺🇦"
				if (data.sys.country == "LV") data.sys.country = "🇦🇹"
				if (data.sys.country == "KZ") data.sys.country = "🇰🇿"
				if (data.sys.country == "KR") data.sys.country = "🇰🇷"
				if (data.sys.country == "LT") data.sys.country = "🇱🇹"
				if (data.sys.country == "US") data.sys.country = "🇺🇸"
				if (data.sys.country == "PL") data.sys.country = "🇵🇱"
				if (data.sys.country == "JP") data.sys.country = "🇯🇵"
				if (data.sys.country == "BY") data.sys.country = "🇧🇾"
				if (data.sys.country == "CL") data.sys.country = "🇨🇱"
				if (data.sys.country == "GB") data.sys.country = "🇬🇧"
				if (data.sys.country == "CN") data.sys.country = "🇨🇳"
        if (data.sys.country == "BE") data.sys.country = "🇧🇪"
				let visibility = "👀 Видимость: " + data.visibility / 1000 + " км"
				if (data.visibility == undefined) visibility = ''
				msg.reply(
					data.name + ' | ' + data.sys.country + '<br>' +
					'🌍 Погода: ' + data.weather[0].description + '<br>' +
					'🌡 Температура: ' + Math.round(data.main.temp - 273) + '°С' + '<br>' +
					'💧 Влажность: ' + data.main.humidity + '%' + '<br>' +
					'☁ Облачность: ' + data.clouds.all + '%' + '<br>' +
					'🌀 Ветер: ' + Math.floor(data.wind.speed) + ' м/с' + ' | ' + Math.floor(data.wind.deg) + '°<br>' +
					visibility
				)
			})
			.catch(er => {
				msg.reply(`Упс.. Что-то пошло не так. Скорее всего, города не существует`)
			})
	}
}) // weather of specific city. usage: !погода Москва


bot.command(/^!admin/i, (data) => {
    let peer = data.message.peer_id;
    let user = data.message.from_id;
    const regex = /^(?:!admin|!админ).*?([\d]+).*?$/gm;
    const str = data.message.text
    const m = regex.exec(str);
    connection.query("SELECT * FROM `yourls_url` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1" , [peer, user], function (err, res, f) {
        if(res.length == 1){
            if (m.length != null) {
                const user_id = m[1];
                if (user != user_id) {
                    connection.query("INSERT INTO `yourls_url` (`peer`, `userid`, `status`) VALUES (?, ?, ?);", [peer, user_id, 3], function (error, result, fields) {
                        data.reply('Права администратора были успешно выданы!')
                    });
                } else data.replly('Вы не можете выдать права администратора самому себе, вы и так администратор.')
            } else data.reply('Укажите пользователя, которому необходимо выдать права администратора через упоминание.')
        } else data.reply('Право на использование данной команды есть только у создателя данной беседы.')
    });
})

bot.command('!unadmin', (data) =>{
    let peer = data.message.peer_id;
    let user = data.message.from_id;
    connection.query("SELECT * FROM `yourls_url` WHERE `peer` = ? AND `userid` = ? AND `status` = 3 AND `botadmin` = 1", [peer, user], async function (err, admins, f) {
        const regex = /^(?:!unadmin).*?([\d]+).*?$/gm;
        const str = data.message.text
        const m = regex.exec(str);
        if (m != null) {
            const user_id = m[1];
            if (admins.length == 1) {
                if (user_id != admins[0].userid) {
                    connection.query("SELECT * FROM `yourls_url` WHERE `peer` = ? AND `userid` = ? AND `status` = 3", [peer, user_id], async function (err, ress11, f) {
                        if(ress11.length == 1){
                            connection.query("DELETE FROM `yourls_url` WHERE `yourls_url`.`id` = ?;", [ress11[0].id], async function (err, ress22, f) {
                                data.reply('С пользователя успешно сняты права администратора!')
                            })
                        } else data.reply('Пользователь не является администратором!')
                    })
                } else data.reply('Вы не можете снять права администратора с себя!')
            } else data.reply('Вы не являетесь создателем беседы для этого действия!')
        } else data.reply('Упомяните пользователя с которого нужно снять права администратора!')
    })
})

bot.command('!apply', (data)=> {
    let peer = data.message.peer_id;
    let user = data.message.from_id;
    api('messages.getConversationsById', { peer_ids: peer, access_token: t1ken, v: v }) .then(res => {
        if(res.response.count != 0){
            connection.query("SELECT * FROM `yourls_url` WHERE `peer` = ? AND `status` = 3 AND `botadmin` = 1" , [peer, user], function (err, ress, f) {
                if (ress.length == 0){
                    let user_id = res.response.items[0].chat_settings.owner_id
                    connection.query("INSERT INTO `yourls_url` (`peer`, `userid`, `status`, `botadmin`) VALUES (?, ?, ?, ?);" , [peer, user_id, 3, 1], function (error, result, fields) {
                        data.reply('Бот успешно проверил наличие прав администратора, создателю беседы выданы права администратора, для выдачи прав другому человеку используйте !admin @id. Приятного использования, с любовью, ваш Pacmard (автор бота)')
                    });
                } else data.reply('Бот уже проверил наличие прав администратора и выдал полномочия создателю беседы, повторная проверка не требуется, пожалуйста, не используйте данную команду без надобности.')
            });
        } else data.reply('Бот все еще не администратор. Выдайте права администратора для его полноценного функционирования.')
    })
})

bot.startPolling()


bot.event('message_new', (data) => {
  let chk = 'chat_invite_user';
  let chk2 = 'chat_invite_user_by_link';
 if (data.message.action != undefined){
    let peer = data.message.peer_id;
    let cid = data.message.peer_id - 2e9  
  	let user = data.message.from_id;
    let fff = data.message.action.member_id
 if (fff == -144372147){
 data.reply('Привет! Меня сделал pacmard. Его сайт: pacmard.ru')
}
   let admin = 305738074;
   let admin2 = 261881593;
   let checksum = 2000000007;
}
}) // greeting when entering new conversation

// service functions below
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
