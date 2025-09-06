// 暗号化/復号化（ゲーム本体と同じ仕組み）
function encryptData(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function decryptData(str) {
  return decodeURIComponent(escape(atob(str)));
}

// DOM
const fileInput = document.getElementById("load-file");
const editor = document.getElementById("editor");
const downloadBtn = document.getElementById("download");

let currentSave = "";

// ファイル読み込み
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const decrypted = decryptData(reader.result);
      editor.value = JSON.stringify(JSON.parse(decrypted), null, 2);
      currentSave = decrypted;
      alert("✅ セーブデータを読み込みました");
    } catch (err) {
      alert("⚠️ 読み込みエラー: " + err.message);
    }
  };
  reader.readAsText(file);
});

// ダウンロード
downloadBtn.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(editor.value);
    const newEncrypted = encryptData(JSON.stringify(parsed));
    const blob = new Blob([newEncrypted], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "edited_save.yjrnd";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert("💾 保存完了！ edited_save.yjrnd をダウンロードしました");
  } catch (err) {
    alert("⚠️ JSONの形式が正しくありません: " + err.message);
  }
});
