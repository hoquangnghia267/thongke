const mongoose = require('mongoose');

// Kết nối MongoDB
mongoose.connect('mongodb://10.0.0.15:27017/certserver', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const serial = "540101074ED97F0D81B984AA066D3FBC";
const type = "XML";

// ✅ Nhập tháng và năm cần thống kê
const inputMonth = 6;     // Tháng 5 (lưu ý: tháng bắt đầu từ 1, không phải 0)
const inputYear = 2025;

const signlogSchema = new mongoose.Schema({}, { strict: false });
const Signlog = mongoose.model('signlogs', signlogSchema);

async function run() {
  try {
    // Tính ngày bắt đầu và kết thúc của tháng
    const startDate = new Date(inputYear, inputMonth - 1, 1);
    const endDate = new Date(inputYear, inputMonth, 1); // đầu tháng tiếp theo

    console.log(`Thống kê theo ngày cho tháng ${inputMonth}/${inputYear}`);
    console.log('--------------------------------------');

    // Lặp từng ngày
    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const nextDay = new Date(dayStart);
      nextDay.setDate(dayStart.getDate() + 1);

      const startTimestamp = dayStart.getTime().toString();
      const endTimestamp = nextDay.getTime().toString();

      const count = await Signlog.countDocuments({
        serialnumber: serial,
        type: type,
        create_date: {
          $gte: startTimestamp,
          $lt: endTimestamp
        }
      });

      const dayStr = `${dayStart.getDate().toString().padStart(2, '0')}/${(dayStart.getMonth() + 1).toString().padStart(2, '0')}/${dayStart.getFullYear()}`;
      console.log(`${dayStr}: ${count}`);

      currentDate = nextDay;
    }

  } catch (err) {
    console.error("Lỗi:", err);
  } finally {
    mongoose.connection.close();
  }
}

run();
