 const currentX = e.touches[0].clientX;
 const diffX = currentX - startX;

 // Apply a visual effect during the swipe (optional)
 imageContainer.style.transform = `translateX(${diffX}px)`;
 });

 imageContainer.addEventListener('touchend', (e) => {
     if (!startX) return;

     const endX = e.changedTouches[0].clientX;
     const diffX = endX - startX;

     // Reset the visual effect
     imageContainer.style.transform = 'translateX(0)';
     startX = null;

     const threshold = 50; // Adjust as needed

     if (Math.abs(diffX) > threshold) {
         if (diffX > 0) {
             currentIndex = Math.max(0, currentIndex - 1); // Swipe right
         } else {
             currentIndex = Math.min(images.length - 1, currentIndex + 1); // Swipe left
         }
         updateImage();
     }
 });

 function updateImage() {
     images.forEach((img, index) => {
         img.style.display = index === currentIndex ? 'block' : 'none';
     });
 }

 // Initial setup
 updateImage();