export default function (array, sampleSize) {
  let sampleArray = [];
  let randomNumber;
  let randomCard;

  for (let index = 0; index < sampleSize; index++) {
    randomNumber = Math.floor(Math.random() * array.length);
    randomCard = array[randomNumber];
    sampleArray.push(randomCard);
    array.splice(randomNumber, 1);
  }

  return sampleArray
};