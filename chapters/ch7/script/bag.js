// 내 가방 보기
function showMyBag() {
  const myBag = [
    { name: "여권 🛂", count: 1 },
    { name: "스마트폰 📱", count: 2 },
    { name: "지갑 👛", count: 1 },
    { name: "카메라 📷", count: 1 },
  ];

  let message = "🎒 [내 가방 속 물품 목록]\n--------------------------\n";
  for (let i = 0; i < myBag.length; i++) {
    message += "· " + myBag[i].name + " : " + myBag[i].count + "개\n";
  }
  message += "--------------------------\n총 물품 종류: " + myBag.length + "가지";

  alert(message);
}

const bagBtn = document.getElementById("bagBtn");
if (bagBtn) {
  bagBtn.addEventListener("click", showMyBag);
}
