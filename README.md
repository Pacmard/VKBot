# VKBot
Bot for VK groups based on NodeJS and MySQL
# Requerements
1. Firstly, you need to install NodeJS v10 to your server or PC. 

* You can download it from here: https://nodejs.org/en/

* If you are a Linux user, the installation guide is here: https://pacmard.ru/nodejs/guide

* Open your terminal (For Windows installed Python and Visual Studio required), go to your bot directory and use *npm i* 

2. Bot will correctly work **ONLY WITH GROUP OAUTH KEY!** You can get it in the settings of your group.
* Key needs all permissions. 

3. Place key in these vars:

* let t1ken = 'enter your token here';

* vk = new VK('enter your token here'); (maybe will be deleted soon as well)

4. For commands with checking for bot administrator privileges, the mysql base is required.
* Set your host, user, password and database name at the top of the code
* Import table into your database, link to sql file: https://pacmard.ru/admins.sql
* For !ban and !unban working import one more table into your database, link to sql file: https://pacmard.ru/bans.sql
* For some other commands (like !кикатьвышедших) import one more table into your database, link to sql file: https://pacmard.ru/commands.sql

5. You need your own yandex translate key.
* place in *key = 'yandex translate token here'*

6. You need your own https://openweathermap.org/api key. 
* Signup and place in *let weatherToken = "token from https://openweathermap.org/api"*

### After completing all of the above actions, launch the bot by *node index.js* command, invite him to the conversation, give the administrator rights of the conversation and send !apply to the conversation, this command will give admin rights to creator of the conversation


# Commands

* !перевод word or sentence - translate from any language to Russian and from Russian to English
* @everyone - mention everyone in this conversation (administrator privilegies requered)
* разбуди @id1 - send 10 messages with mentioning user, which id is 1 (example, you can mention anyone)
* !kick - kick someone from conversation. You can kick user by mention him with command (!kick @id1), reply to his message, or kick several members replying to their messages with one command (administrator privilegies requered)
* /q - self-kick from conversation
* !donate - donate to me
* !dkb - donate to me by VK Pay
* !reg - check your or someone registration date (for check someone reg date: !reg @id1 or reply on his/her messege by this command)
* /alive - check bot status (up or down)
* !др - check your or someone birthday (for check someone birthday: !др @id1 or reply on his/her messege by this command)
* !когда - when. just sends a random response.
* !число number - random number from 0 to your number (example: !число 100 - sends random number from 0 to 100) 
* !орел и решка - heads or tails 
* /что лучше - using: /что лучше X или Y . sends random answer (X or Y)
* погода city - current weather in specified city.
* !admin - give administrator privilegies (using: !admin @id1)
* !unadmin - clear user admin rights
* !apply - сheck for chat administrator privileges on the bot. It is necessary to use only 1 time, after issuing the rights of the administrator of the conversation
* !ban - ban user in this conversation (using: !ban @id1)
* !unban - unban user iin this conversation (using: !unban @id1)
* !кикатьвышедших - Enables or disables the function of excluding people leaving the conversation


# How to support me

You can donate me by this link: https://www.donationalerts.com/r/pacmard

# How to get help with a bot

Create Issue in those repository, i'll answer as soon as I can
