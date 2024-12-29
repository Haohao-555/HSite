// 引入mockjs
import Mock from 'mockjs'
const Random = Mock.Random

// 从数据模板中取数据
Random.extend({
  constellation: function (date) {
    const constellations = [
      '白羊座',
      '金牛座',
      '双子座',
      '巨蟹座',
      '狮子座',
      '处女座',
      '天秤座',
      '天蝎座',
      '射手座',
      '摩羯座',
      '水瓶座',
      '双鱼座'
    ]
    return this.pick(constellations)
  }
})

Mock.mock('/notesApi/mock/getBanner', 'post', (ctx) => {
  return {
    errorno: 0,
    data: [
      {
        id: 1,
        url: 'http://39.104.61.32/imgHome/blog/3.jpg',
        style: {
          backgroundPosition: 'bottom'
        },
        top: true
      },
      {
        id: 2,
        url: 'http://39.104.61.32/imgHome/blog/5.jpg',
        style: {
          backgroundPosition: 'center'
        },
        top: true
      },
      {
        id: 3,
        url: 'http://39.104.61.32/imgHome/blog/1.jpg'
      },
      {
        id: 4,
        url: 'http://39.104.61.32/imgHome/blog/bg1.png'
      }
    ]
  }
})
