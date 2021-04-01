const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
let stop = false;

module.exports = {
  name: "kotoba",
  description: "Thử thách từ vựng xD",
  args: true,
  execute(message, args) {
    const list = args[0].toLowerCase();

    if (args[1]) {
      try {
        stop = args[1].toLowerCase();

        if (stop === "stop") {
          stop = true;
          message.channel.send(
            `Ngừng hỏi list từ vựng ${list}. Nhập \`!kotoba ${list} start\` để bắt đầu lại.`
          );
        } else if (stop === "start" || stop === "s") stop = false;
      } catch (err) {
        console.log(err.message);
      }
    }

    const listNames = fs
      .readdirSync(`./vocablist`)
      .filter((file) => file.endsWith(".xlsx"));

    if (!listNames.includes(`${list}.xlsx`))
      return message.channel.send(
        `Không tìm thấy list từ \`${list}\` mà bạn yêu cầu! リストが見つかりません。`
      );

    outputExcelList(message, `${list}.xlsx`);
  },
};

async function outputExcelList(message, filename) {
  try {
    const schema = {
      STT: {
        prop: "stt",
        type: Number,
      },
      Word: {
        prop: "word",
        type: String,
        required: true,
      },
      Reading: {
        prop: "reading",
        type: String,
      },
      Definition: {
        prop: "defintion",
        type: String,
        required: true,
      },
    };

    const excelFile = await readXlsxFile(`./vocablist/${filename}`, { schema });

    //        `${row.stt}\t${row.word}\t${row.reading}\n${row.defintion}`

    const rowsArray = excelFile.rows;

    const listIdxtoSend = randomListIdx(rowsArray.length);
    console.log(listIdxtoSend);

    for (let i = 0; i < rowsArray.length; i++) {
      let randomRow = listIdxtoSend[i];
      if (!stop) {
        await message.channel.send(
          `${rowsArray[randomRow].stt}\t${rowsArray[randomRow].word}`
        );
        await wait(5);
        await message.channel.send(
          `${rowsArray[randomRow].reading}\n${rowsArray[randomRow].defintion}`
        );
        await wait(1);
      }
    }
  } catch (error) {
    console.error("Couldn't read excel list" + error.message);
  }
}

const wait = function (sec) {
  return new Promise(function (resolve) {
    setTimeout(resolve, sec * 1000);
  });
};

function randomListIdx(listnums) {
  let s = new Set();
  while (s.size < listnums) {
    s.add(Math.floor(Math.random() * listnums));
  }

  return [...s];
}
