// document.addEventListener("DOMContentLoaded", function () {
//   const container = document.querySelector(".container");
//   const image = document.getElementById("image");


//  const imageUrls = ["./img/2.jpg", "./img/3.jpg", "./img/4.jpg"]; 
//   let currentImageIndex = 0;
//   let isAnimating = false;

//   function replaceImage() {
//     if (isAnimating) return;
//     isAnimating = true;

//     const newImage = new Image();
//     newImage.onload = function () {
//       newImage.style.opacity = "1";
//       newImage.style.transform = "translateX(0) translateY(0)";
//       image.style.opacity = "0";
//       image.style.transform = "translateX(-100%) translateY(-100%)";

//       setTimeout(function () {
//         image.src = newImage.src;
//         image.style.opacity = "1";
//         image.style.transform = "translateX(0) translateY(0)";
//         newImage.style.opacity = "0";
//         newImage.style.transform = "translateX(100%) translateY(100%)";

//         isAnimating = false;
//       }, 1000);
//     };

//     newImage.src = imageUrls[currentImageIndex];
//     currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
//     container.appendChild(newImage);
//   }

//   setInterval(replaceImage, 3000); // 每隔3秒自动替换图片
// });



