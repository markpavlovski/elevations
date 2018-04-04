//
// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }
// //
// function onDocumentMouseDown(event) {
//   event.preventDefault();
//   document.addEventListener('mousemove', onDocumentMouseMove, false);
//   document.addEventListener('mouseup', onDocumentMouseUp, false);
//   document.addEventListener('mouseout', onDocumentMouseOut, false);
//   mouseXOnMouseDown = event.clientX - windowHalfX;
//   targetRotationOnMouseDown = targetRotation;
// }
//
// function onDocumentMouseMove(event) {
//   mouseX = event.clientX - windowHalfX;
//   targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
// }
//
// function onDocumentMouseUp(event) {
//   document.removeEventListener('mousemove', onDocumentMouseMove, false);
//   document.removeEventListener('mouseup', onDocumentMouseUp, false);
//   document.removeEventListener('mouseout', onDocumentMouseOut, false);
// }
//
// function onDocumentMouseOut(event) {
//   document.removeEventListener('mousemove', onDocumentMouseMove, false);
//   document.removeEventListener('mouseup', onDocumentMouseUp, false);
//   document.removeEventListener('mouseout', onDocumentMouseOut, false);
// }
//
// function onDocumentTouchStart(event) {
//   if (event.touches.length == 1) {
//     event.preventDefault();
//     mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
//     targetRotationOnMouseDown = targetRotation;
//   }
// }
//
// function onDocumentTouchMove(event) {
//   if (event.touches.length == 1) {
//     event.preventDefault();
//     mouseX = event.touches[0].pageX - windowHalfX;
//     targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
//   }
// }
//
//
//   // WINDOW EVENTS
//   document.addEventListener('mousedown', onDocumentMouseDown, false);
//   document.addEventListener('touchstart', onDocumentTouchStart, false);
//   document.addEventListener('touchmove', onDocumentTouchMove, false);
//   window.addEventListener('resize', onWindowResize, false);
