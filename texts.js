export const texts = {
  // General texts
  general: {
    welcome: `✅ عضویت شما تایید شد`,
    continue: 'چه کاری میتونم برات انجام بدم؟ 👇',
    deleteMedia: 'به علت مواد امنیتی مدیا ها دیلیت شدن.',
    fileWarning: '⚠️ لطفا فایل را ذخیره کنید چون بزودی پاک میشود...',
    promptToJoin: `برای استفاده از ربات ابتدا در کانال‌های ما عضو شوید:\n\nپس از عضویت، روی دکمه ( عضو شدم ✅ ) کلیک کنید.`,
    leftChannel: (channelName = 'none') => `دوست عزیز 🙃\nشما از کانال ${channelName && `<b>${channelName}</b>`} خارج شدید\n\nجهت استفاده مجدد از ربات دوباره در کانال عضو شوید، و سپس روی دکمه ( عضو شدم ✅ ) کلیک کنید.`,
    promptToRejoin: (channelCount = 'none') => `⚠️ متوجه شدیم شما در ${channelCount} کانال عضو نیستید. \n\nجهت استفاده مجدد از ربات دوباره در کانال ها عضو شوید، و سپس روی دکمه ( عضو شدم ✅ ) کلیک کنید.`,

    // General Error texts
    notAccess: 'شما اجازه انجام این عملیات رو ندارید ❗',
    failProcess: '❌ مشکلی در انجام عملیات پیش آمد\n\nلطفاً دوباره تلاش کنید 🔄️',
    failProcessAlert: 'مشکلی در انجام عملیات پیش آمد ❌ لطفاً دوباره تلاش کنید 🔄️',
    failPromptToJoin: 'لطفاً ابتدا در کانال‌ها عضو شوید و سپس ( عضو شدم ✅ ) را فشار دهید❗',
    failMembershipCheck: '❌ مشکلی در بررسی عضویت شما وجود دارد. \n\nلطفاً دوباره تلاش کنید 🔄️',
  },

  // Public Message texts
  publicMessage: {
    sentToAll: 'پیام شما به همه کاربران ارسال شد.',
    deleteMessage: 'پیام همگانی با موفقیت حذف شد ✅',
    requestMessage: 'لطفاً پیام خود را وارد کنید:',

    // Public Message Error texts
    deleteAdminMessage: 'پیام شما پس از ارسال همگانی توسط ادمین حذف شد ❌',
    notFoundSentMessage: 'پیام همگانی ارسال شده پیدا نشد!'
  },

  // Media texts
  media: {
    deleteMedia: 'مدیا با موفقیت حذف شد ✅',
    manageMedia: 'چه کاری میخوای انجام بدی؟\n\nاز لیست پایین کاری که میخوای انجام بدی رو انتخاب کن 👇',
    sendMediaId: 'لطفا شناسه مدیا را وارد کنید:',
    editMediaInfo: 'در قسمت زیر می‌توانید مدیا را ادیت کنید 👇',
    getLink: (username, media, mediaTypeText) => `مدیا با نوع ( ${mediaTypeText} ) ایجاد شد ✅\n\nلینک مدیا: \n <code>https://t.me/${username}?start=${media.id}</code> \n شناسه مدیا: \n <code>${media.id}</code>`,
    addVideo: (limit, length) => `ویدیو با موفقیت به مدیا اضافه شد ✅\n\nتعداد آیتم ها: ${length}/${limit}\n جهت ذخیره و دریافت لینک قبل از پر شدن آیتم های مدیا کلمه ( <code>END</code> ) را ارسال کنید.`,
    addImage: (limit, length) => `عکس با موفقیت به مدیا اضافه شد ✅\n\nتعداد آیتم ها: ${length}/${limit}\n جهت ذخیره و دریافت لینک قبل از پر شدن آیتم های مدیا کلمه ( <code>END</code> ) را ارسال کنید.`,
    editMedia: (data) => 'ادیت مدیا',
    fullMedia: (botUsername, media, mediaTypeText) => `مدیا با نوع ( ${mediaTypeText} ) پر شد 💯\n\nلینک مدیا: \n<code>https://t.me/${botUsername}?start=${media.id}</code>\n\nشناسه مدیا: \n<code>${media.id}</code>`,
    sendMedia: (media) => `مدیا با شناسه (<code>${media.id}</code>) ایجاد شد.\n\nلطفا فایل 📹 ویدیو یا 🖼 تصویر را جهت اضافه کردن به مدیا ارسال کنید:`,

    // Media Error texts
    invalidFileType: 'لطفا فقط ویدیو یا عکس ارسال کنید دهید❗',
    notFoundMedia: 'هیچ مدیایی با این شناسه پیدا نشد ❗️',
    invalidMediaId: 'شناسه مدیا نامعتبر است. لطفا یک آیدی معتبر وارد کنید ❗️',
  },
  
};
