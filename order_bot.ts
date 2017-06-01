const { Wechaty, log, Room } = require('wechaty')
const qrcode = require('qrcode-terminal')

const choices = [
    {weight: 10, txt: '烤辣鸡'},
    {weight: 10, txt: '韩妈'},
    {weight: 20, txt: '烧鸭面'},
    {weight: 10, txt: '精品牛肉面'},
    {weight: 10, txt: '杨国福'},
    {weight: 10, txt: '妈妈手擀面'},
    {weight: 5, txt: '请点外卖'},
]

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}

function randomChoices() {
    return choices[getRandomInt(0, choices.length)].txt
}

Wechaty.instance()
    .on('scan', (url, code) => {
        let loginUrl = url.replace('qrcode', 'l')
        qrcode.generate(loginUrl)
        console.log(url)
    })
    .on('login',  user => console.log(`User ${user.name()} logined`))
    .on('message', async m => {
        try {
            const vagRoom = await Room.find({topic: /预备役部队/})
            // console.log(vagRoom)
            if (vagRoom
                && m.room().topic() === vagRoom.topic()
                && m.mentioned()
                && /GeekPlux|人形饭桶/.test(m.content())
                && /吃/.test(m.content())
                && !m.self()){

                await m.say(`我们今天吃：${randomChoices()}\nfrom 人形饭桶`)
                log.info('Bot', 'REPLY: 我们今天吃：${randomChoices()}')
            }

        } catch (e) {
            log.error('Bot', 'on(message) exception: %s' , e)
        }
    })
    .init()
