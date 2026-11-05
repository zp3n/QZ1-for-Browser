// 1. すでにブラウザへのアクセス権限（パーミッション）が許可されている接続済みデバイスの一覧を取得する
async function getConnectedDevices() {
  try {
    const devices = await navigator.usb.getDevices();
    console.log(`許可済みで接続されているデバイスの数: ${devices.length}`);
    
    devices.forEach((device, index) => {
      console.log(`[デバイス ${index + 1}]`);
      console.log(`  製品名: ${device.productName || '不明'}`);
      console.log(`  メーカー名: ${device.manufacturerName || '不明'}`);
      console.log(`  ベンダーID (VendorId): 0x${device.vendorId.toString(16).padStart(4, '0')}`);
      console.log(`  プロダクトID (ProductId): 0x${device.productId.toString(16).padStart(4, '0')}`);
    });

    return devices;
  } catch (error) {
    console.error('デバイスの取得に失敗しました:', error);
  }
}

// 2. ユーザーにダイアログを表示して新しいUSBデバイスへのアクセスを要求・取得する
async function requestNewDevice() {
  try {
    // 特定のベンダーIDなどでフィルタリングすることも可能（空の場合はすべてのデバイスが選択肢に出ます）
    const options = {
      // filters: [{ vendorId: 0x1234 }] // 必要に応じてベンダーIDを指定
    };

    const device = await navigator.usb.requestDevice(options);
    console.log('ユーザーが選択したデバイス:', device.productName);
    return device;
  } catch (error) {
    console.log('ユーザーがデバイス選択をキャンセルしたか、エラーが発生しました:', error);
  }
}

// 3. デバイスの接続・切断イベントを監視する
navigator.usb.addEventListener('connect', (event) => {
  console.log('USBデバイスが接続されました:', event.device.productName);
});

navigator.usb.addEventListener('disconnect', (event) => {
  console.log('USBデバイスが取り外されました:', event.device.productName);
});