const input = document.querySelector("#nmea-input");
const parseButton = document.querySelector("#parse-button");
const result = document.querySelector("#result");

parseButton.addEventListener("click", () => {
  const line = input.value.trim();
  const gga = parseGga(line);
  const resultText = buildResultText(gga);
  result.textContent = resultText;
});

function parseGga(line) {
  const fields = line.split(",");
  return {
    utcTime: formatUtcTime(fields[1]),
    latitude: nmeaToDecimal(fields[2], fields[3]),
    longitude: nmeaToDecimal(fields[4], fields[5]),
    fixQuality: fields[6],
    satelliteCount: Number(fields[7]), // 衛星数を数値に変換
    hdop: Number(fields[8]), // HDOPを数値に変換
    altitude: Number(fields[9]), // 高度を数値に変換
    altitudeUnit: fields[10],
  };
}

function buildResultText(gga) {
  let text = "";
  text += `UTC時刻: ${gga.utcTime}\n`;
  text += `緯度: ${gga.latitude}\n`;
  text += `経度: ${gga.longitude} \n`;
  text += `測位品質: ${gga.fixQuality}\n`;
  text += `衛星数: ${gga.satelliteCount}\n`;
  text += `HDOP: ${gga.hdop}\n`;
  text += `高度: ${gga.altitude} ${gga.altitudeUnit}\n`;
  return text;
}

function formatUtcTime(utcTime) {
  const hours = utcTime.slice(0, 2);
  const minutes = utcTime.slice(2, 4);
  const seconds = utcTime.slice(4, 6);
  return `${hours}:${minutes}:${seconds}`;
}

function nmeaToDecimal(value, direction) {
  const dotIndex = value.indexOf("."); // 小数点の位置を取得
  const minutesStartIndex = dotIndex - 2; // 分の開始位置を計算
  const degreesPart = value.slice(0, minutesStartIndex); // 度の部分
  const minutesPart = value.slice(minutesStartIndex); // 分の部分

  const degrees = Number(degreesPart); // 度を数値に変換
  const minutes = Number(minutesPart); // 分を数値に変換

  const decimal = degrees + minutes / 60; // 度と分を10進数に変換

  if (direction === "S" || direction === "W") {
    return -decimal; // 南緯または西経の場合は負の値にする
  }
  return decimal;
}
