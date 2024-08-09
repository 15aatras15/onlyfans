// Admin-Menu
export const adminMenuItems = [
  '📩 ارسال پیام همگانی',
  '📺 مدیریت مدیا ها'
]

export const adminMenu = {
  reply_markup: {
    keyboard: [
      [{ text: adminMenuItems[0] }, { text: adminMenuItems[1] }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
}

// Back-Menu
export const backMenuItems = [
  '⬅️ لغو و بازگشت به منو اصلی'
]
export const backMenu = {
  reply_markup: {
    keyboard: [
      [{ text: backMenuItems[0] }],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
}