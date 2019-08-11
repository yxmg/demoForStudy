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

// 获取某月有多少天
printResult(
  '获取某月有多少天',
  moment().daysInMonth() + '天',
  dateFns.getDaysInMonth(new Date()) + '天',
  dayjs().daysInMonth() + '天',
)

// 获取一年有多少周
printResult(
  '获取一年有多少周',
  moment().isoWeeksInYear() + '周',
  dateFns.getISOWeeksInYear(new Date()) + '周',
  // dayjs().isoWeeksInYear() + '周', // 不支持获取一年有多少周
)

// 返回给定日期的最大值/最小值
const dateArr = [
  new Date(2019, 0, 1),
  new Date(2018, 0, 1),
  new Date(2019, 0, 2)
]
printResult(
  '返回给定日期的最大值/最小值',
  moment.max(dateArr.map(date => moment(date))).format(), // 注意max是类方法
  dateFns.format(dateFns.max(...dateArr))
  // 不支持返回给定日期的最大值/最小值
)

// 获取N天后时间
printResult(
  '获取N天后时间',
  '三天后：' + moment().add(3, 'days').format('YYYY-MM-DD'),
  '三天后：' + dateFns.format(dateFns.addDays(new Date(), 3), 'YYYY-MM-DD'),
  '三天后：' + dayjs().add(3, 'days').format('YYYY-MM-DD'),
)

// 获取N天前时间
printResult(
  '获取N天前时间',
  '三天前：' + moment().subtract(3, 'days').format('YYYY-MM-DD'),
  '三天前：' + dateFns.format(dateFns.subDays(new Date(), 3), 'YYYY-MM-DD'),
  '三天前：' + dayjs().subtract(3, 'days').format('YYYY-MM-DD')
)

// 获取某月开始日期
printResult(
  '获取某月开始日期',
  moment().startOf('month').format('YYYY-MM-DD'),
  dateFns.format(dateFns.startOfMonth(new Date()), 'YYYY-MM-DD'),
  dayjs().startOf('month').format('YYYY-MM-DD'),
)

// 获取距现在几天
printResult(
  '获取距现在几天',
  moment(moment().subtract(3, 'days')).fromNow(),
  dateFns.distanceInWords(dateFns.subDays(new Date(), 3), new Date(), { addSuffix: true })
  // dayjs需要引入插件，且解析规则不同
)

// 判断是否在之前
printResult(
  '判断是否在之前',
  moment('2019-09-12').isBefore('2020-10-01'), // 字符串需要补零
  dateFns.isBefore(new Date(), new Date(2020, 9))
)
