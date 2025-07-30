const mongoose = require('mongoose');

// Kết nối MongoDB
mongoose.connect('mongodb://10.0.0.15:27017/certserver', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const serial = "540101074ED97F0D81B984AA066D3FBC";

// Khai báo schema nếu cần (hoặc dùng trực tiếp)
const requestSchema = new mongoose.Schema({}, { strict: false });
const signlogSchema = new mongoose.Schema({}, { strict: false });

const Request = mongoose.model('request', requestSchema);
const Signlog = mongoose.model('signlogs', signlogSchema);

async function run() {
  try {
    const request = await Request.findOne({ serialnumber: serial }).lean();

    if (!request || !request.valid_from || !request.valid_to) {
      console.log("Không tìm thấy request hoặc thiếu valid_from/valid_to");
      return;
    }

    // Ép kiểu timestamp
    const validFrom = parseInt(request.valid_from);
    const validTo = parseInt(request.valid_to);

    let startDate = new Date(validFrom);
    let endDate = new Date(validTo);

    // Bắt đầu từ đầu tháng của valid_from
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

    console.log(`Thống kê theo tháng cho serial: ${serial}`);
    console.log('--------------------------------------');

    while (startDate < endDate) {
      const monthStart = startDate.getTime();
      const nextMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
      const monthEnd = nextMonth.getTime();

      const count = await Signlog.countDocuments({
        serialnumber: serial,
        type: "XML", // Có thể bỏ nếu không cần lọc theo type
        create_date: {
          $gte: monthStart.toString(),  // nếu create_date là chuỗi timestamp
          $lt: monthEnd.toString()
        }
      });

      console.log(`Tháng ${startDate.getMonth() + 1}/${startDate.getFullYear()}: ${count}`);

      startDate = nextMonth;
    }

  } catch (err) {
    console.error("Lỗi:", err);
  } finally {
    mongoose.connection.close();
  }
}

run();
