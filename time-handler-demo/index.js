/**
 *Created by 夜雪暮歌 on 2019/8/11
 **/
const printResult = (type, moment, dateFns, dayJs) => {

  console.log(`%c/*****${type}*****/`, 'color: #fff; background: #f40; font-size: 18px;border-radius:0 15px 15px 0;padding:5px;')
  console.log("moment", moment)
  console.log("dateFns", dateFns)
  console.log("dayJs", dayJs)
}

// 打印对象
printResult(
  '对象',
  moment,
  dayjs,
  dateFns
)

// 字符串 + 日期格式化
printResult(
  '字符串 + 日期格式化',
  moment('2019年8月11日', 'YYYY年MM月DD日'), // 支持
  dateFns.parse('2019年8月11日', 'yyyy年MM月dd日', new Date()), // 不支持中文格式
  dayjs('2019年8月11日') // 不支持自定义格式
)

// 获取时分秒
printResult(
  '获取时分秒',
  `时：${moment().hours()}，分：${moment().minutes()}，秒：${moment().seconds()}`,
  `时：${dateFns.getHours(new Date())}，分：${dateFns.getMinutes(new Date())}，秒：${dateFns.getSeconds(new Date())}`,
  `时：${dayjs().hour()}，分：${dayjs().minute()}，秒：${dayjs().second()}`,  // dayJs没有hours等方法，moment有，所以并不是完全兼容
)

// 获取月份
printResult(
  '获取月份',
  moment().date() + '月',
  dateFns.getDate(new Date()) + '月',
  dayjs().date() + '月'
)

// 获取星期几
printResult(
  '获取星期几',
  '星期' + moment().day(),
  '星期' + dateFns.getDay(new Date()),
  '星期' + dayjs().day(),
)

// 获取一年中的第N天
printResult(
  '获取一年中的第N天',
  moment().dayOfYear(),
  dateFns.getDayOfYear(new Date()),
  // dayjs().dayOfYear(), // dayJs不支持
)

// 获取一年中的第N周
printResult(
  '获取一年中的第N周',
  moment().week(),
  dateFns.getISOWeek(new Date()), // ISO 对周的国际标准,表现为比moment少一周
  // dayjs.week() // dayJs不支持
)


