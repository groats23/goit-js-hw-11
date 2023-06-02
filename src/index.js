const inData =
  'user.name.firstname=Bob&user.namelastname=Smith&user.favoritecolor=Light%20Blue&experiments.theme=dark';

function queryObjectify(str) {
  let res = {};

  str = str.split('&');
  str = str.map(i => i.split('.'));

  for (let i = 0; i < str.length; i++) {
    let cur = res;
    for (let key = 0; key < str[i].length; key++) {
      let name = str[i][key];
      if (key == str[i].length - 1) {
        name = name.split('=');
        cur[name[0]] = name[1];
        break;
      }
      if (cur[name]) {
        cur = cur[name];
      } else {
        cur[name] = {};
        cur = cur[name];
      }
    }
  }

  return res;
}

// console.log(queryObjectify(inData));

/**
  |==================================
   
  |==================================
*/

// const inData =
//   'user.name.firstname=Bob&user.namelastname=Smith&user.favoritecolor=Light%20Blue&experiments.theme=dark';

// function convertToNestedObject(data) {
//   const result = {};

//   // Розділяємо рядок на окремі пари ключ-значення
//   const pairs = data.split('&');

//   //   console.log(pairs);

//   for (let pair of pairs) {
//     // Розділяємо пару ключ-значення на ключ та значення
//     const [key, value] = pair.split('=');

//     // Розбиваємо ключ на окремі частини
//     const keys = key.split('.');

//     let nestedObject = result;

//     for (let i = 0; i < keys.length; i++) {
//       const currentKey = keys[i];

//       if (i === keys.length - 1) {
//         // Досягли кінця ключа - присвоюємо значення
//         nestedObject[currentKey] = decodeURIComponent(value);
//       } else {
//         // Перевіряємо, чи існує об'єкт для поточного ключа
//         if (!nestedObject[currentKey]) {
//           nestedObject[currentKey] = {};
//         }

//         // Переходимо до наступного вкладеного об'єкта
//         nestedObject = nestedObject[currentKey];
//       }
//     }
//   }

//   return result;
// }

// const result = convertToNestedObject(inData);
// console.log(result);

/**
  |==================================
   
  |==================================
*/

/**
  |==================================
   {
    'user': {
        'name': {
            'firstname': 'Bob'
            'lastname': 'Smith'
        },
        'favoritecolor': 'Light Blue'
    },
    experiments: {
        theme: 'dark'
    }
}
  |==================================
*/
