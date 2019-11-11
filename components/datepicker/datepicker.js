Component({
  properties: {
    monthCnt: {
      type: Number,
      value: 12
    },
    notice: {
      type: Array,
      value: ['入住', '离店']
    },
    value: {
      type: Object,
      optionalTypes: [String, Array, Number],
      observer() {
        this.genMonths()
        this.initDates()
      }
    }, // Date、[Date, Date]  Date,时间戳，时间字符串等能被格式化为时间对象的格式
    disabled: {
      type: Object // { from: Date, to: Date}  Date,时间戳，时间字符串等能被格式化为时间对象的格式
    },
    visible: {
      type: Boolean,
      value: false
    },
    descs: {
      type: Object,
      observer() {
        this.genMonths()
      }
    }
  },

  data: {
    months: [],
    selected: new Date(),
    mode: 'date', // date 、range 单选还是双选
    days: ['日', '一', '二', '三', '四', '五', '六'],
    todayTimestamp: 0
  },
  observers: {
    visible(visible) {
      console.log(visible)
    }
  },

  attached() {
    this.setData({
      todayTimestamp: this.genTodayTimestamp()
    })
  },

  methods: {
    initDates() {
      if (this.data.value) {
        if (!Array.isArray(this.data.value)) {
          let selected = this.findDate(this.data.value)
          this.setData({
            mode: 'date',
            selected
          })
        } else {
          let selected = this.data.value.map(this.findDate.bind(this))
          this.setData({
            mode: 'range',
            selected
          })
        }
      }
    },
    genTodayTimestamp() {
      let today = new Date()
      let yearNumber = today.getFullYear()
      let monthNumber = this.formatNumber(today.getMonth() + 1)
      let dateNumber = this.formatNumber(today.getDate())
      let todayTimestamp = new Date([yearNumber, monthNumber, dateNumber].join('-')).getTime()
      return todayTimestamp
    },

    confirm() {
      if (this.data.mode === 'range') {
        if (this.data.selected.length === 1) return wx.toast('请选择结束日期');
        this.triggerEvent('change', this.data.selected.map(date => new Date(date.timestamp)))
      } else if (this.data.mode === 'date') {
        this.triggerEvent('change', new Date(this.data.selected.timestamp))
      }
      this.setData({
        visible: false
      })
    },
    hideMask() {
      this.setData({
        visible: false
      })
    },
    // 给定一个Date对象寻找对应的那一天的日期信息对象
    findDate(date) {
      date = new Date(date) // 因为date可以传Date对象，日期字符串，时间戳等可以转换成日期对象的数据类型，所以这里需要统一转换成日期对象
      try {
        let yearNumber = date.getFullYear()
        let monthNumber = date.getMonth() + 1
        let dateNumber = date.getDate()
        let yearMatchedMonths = this.data.months.filter(month => month.yearNumber === yearNumber)
        let monthMatched = yearMatchedMonths.find(month => month.monthNumber === monthNumber)

        let dateMatched = monthMatched.dates.find(date => date.dateNumber === dateNumber)
        return dateMatched
      } catch (err) {
        wx.showModalSync(`所选日期${date}超出当前日期范围`, { showCancel: false })
        throw new Error(`所选日期${date}超出当前日期范围`)
      }
    },
    // 选择日期
    selectDate(e) {
      let selected = e.currentTarget.dataset.date
      if (selected.disabled) return;
      if (this.data.mode === 'range') {
        let [startDate, endDate] = this.data.selected
        if (!startDate && !endDate || startDate && endDate) {
          this.setData({
            selected: [selected]
          })
        } else {
          let date1 = startDate
          let date2 = selected
          if (date1.date === date2.date) return;
          this.setData({
            selected: [date1, date2].sort((date1, date2) => {
              return new Date(date1.timestamp) - new Date(date2.timestamp)
            })
          })
        }
      } else if (this.data.mode === 'date') {
        this.setData({
          selected
        })
      }
    },
    // 生成月信息列表
    genMonths(monthCnt = this.data.monthCnt) {
      let months = []
      let startYearNumber = new Date().getFullYear()
      let startMonthNumber = new Date().getMonth() + 1
      let month = this.genPreMonth(startYearNumber, startMonthNumber)
      for (let i = 0; i < monthCnt; i++) {
        month = this.genNextMonth(month.yearNumber, month.monthNumber, i)
        months.push(month)
      }
      this.setData({
        months
      })
    },

    // 生成月信息
    genMonth(yearNumber, monthNumber) {
      let monthLength = this.getMonthLength(yearNumber, monthNumber)
      let dateNumbers = [...Array(monthLength).keys()].map(n => n + 1)
      return {
        yearNumber,
        monthNumber,
        startDayNumber: this.getStartDayNumber(yearNumber, monthNumber),
        dates: dateNumbers.map(dateNumber => this.genDate(yearNumber, monthNumber, dateNumber))
      }
    },

    formatNumber: number => {
      number = number.toString()
      return number[1] ? number : '0' + number
    },

    // 生成日期禁用信息
    genDisabled(date) {
      if (this.data.disabled) {
        let {
          from,
          to
        } = this.data.disabled
        if (from && to) {
          from = new Date(from)
          to = new Date(to)
          return date >= from && date <= to
        } else if (to) {
          to = new Date(to)
          return date <= to
        } else if (from) {
          from = new Date(from)
          return date >= from
        } else {
          return false
        }
      }
    },

    // 生成日期信息
    genDate(yearNumber, monthNumber, dateNumber) {
      let value = new Date(`${this.formatNumber(yearNumber)}-${this.formatNumber(monthNumber)}-${this.formatNumber(dateNumber)}`)
      return {
        yearNumber,
        monthNumber,
        dateNumber,
        date: `${this.formatNumber(yearNumber)}-${this.formatNumber(monthNumber)}-${this.formatNumber(dateNumber)}`,
        value,
        timestamp: value.getTime(),
        disabled: this.genDisabled(value)
      }
    },

    // 获取上一个月
    genPreMonth(yearNumber, monthNumber) {
      yearNumber = monthNumber === 1 ? yearNumber - 1 : yearNumber
      monthNumber = monthNumber === 1 ? 12 : monthNumber - 1
      return this.genMonth(yearNumber, monthNumber)
    },

    // 获取下一个月
    genNextMonth(yearNumber, monthNumber) {
      yearNumber = monthNumber === 12 ? yearNumber + 1 : yearNumber
      monthNumber = monthNumber === 12 ? 1 : monthNumber + 1
      return this.genMonth(yearNumber, monthNumber)
    },

    // 判断是否是闰年
    isLeapYear: yearNumber => yearNumber % 4 == 0 || yearNumber % 100 == 0 && yearNumber % 400 == 0,
    // 获取当月天数
    getMonthLength(yearNumber, monthNumber) {
      return [2, 4, 6, 9, 11].indexOf(monthNumber) == -1 ? 31 : monthNumber == 2 ? this.isLeapYear(yearNumber) ? 29 : 28 : 30
    },
    // 当月从周几开始
    getStartDayNumber: (yearNumber, monthNumber) => new Date([yearNumber, monthNumber, 1].join('-')).getDay(),
  }
})
