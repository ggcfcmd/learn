import anniePicUrl from '@assets/images/annie.jpg';

console.log('anniePicUrl log: ', anniePicUrl);

const img = document.createElement('img');

img.src = anniePicUrl;

document.body.append(img);