var person = {name:'John', age:24};

function updatePerson(personObj) {
	//personObj.age = 25;
	personObj = { name: 'John', age:25};
}

updatePerson(person);
console.log(person);





// var grades = [15,88];

// function addGrades(gradesArr) {
// 	//gradesArr.push(99);
// 	gradesArr = [80,88,99];
// 	console.log(gradesArr);
// }

// updateArray(grades);
// console.log(grades);