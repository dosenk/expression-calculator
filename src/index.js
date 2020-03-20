function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {

    // let arr = expr.split(" ").filter(e => e.length > 0).map(item => {
    //     return isNaN(item) ? item : Number(item);
    // });

    let arr = expr.split("+").join(" + ")
        .split("-").join(" - ")
        .split("*").join(" * ")
        .split("/").join(" / ")
        .split("(").join(" ( ")
        .split(")").join(" ) ")
        .split(" ").filter(e => e.length > 0).map(item => {
            return isNaN(item) ? item : Number(item);
        });

    // проверка парных скобок
    let pariedLeft = arr.filter(e => e === ')');
    let pariedRight = arr.filter(e => e === '(');
    if (pariedLeft.length !== pariedRight.length) throw new Error('ExpressionError: Brackets must be paired');

    const mathOperation = (a, b, operator) => {
        switch (operator) {
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                if (b === 0) throw new Error('TypeError: Division by zero.');
                return a / b;
            default:
                return a + b;
        }
    }

    let calcBrakets = (array) => {
        // ищем '/' или '*', если не находим то выполняем операции сложения и вычитания
        let divisionMultiply = (array) => {
            let res;
            let divisionIndex = array.indexOf('/');
            let multiplyIndex = array.indexOf('*');
            let pos;
            if (divisionIndex > 0) {
                res = mathOperation(array[divisionIndex - 1], array[divisionIndex + 1], '/');
                pos = divisionIndex;
            } else if (multiplyIndex > 0) {
                res = mathOperation(array[multiplyIndex - 1], array[multiplyIndex + 1], '*');
                pos = multiplyIndex;
            }
            if (!isNaN(res)) {
                array.splice(pos - 1, 3, res);
                divisionMultiply(array);
            }
            return array;

        }
        array = divisionMultiply(array);
        return array.reduce((prevItem, item, index, arr) => {
            if (isNaN(item)) return prevItem;
            if (arr[index - 1] === '+') prevItem += item
            else prevItem -= item;
            return prevItem;
        });
    }

    let calc = (arr) => {
        let resultNumber;
        let extArr = []; // - массив между двумя найдеными скобками
        let firstIndexClosedBraket = arr.indexOf(')'); // - первая закрывающаяся скобка ')'
        if (firstIndexClosedBraket === -1) {
            return calcBrakets(arr);
        }
        let firstIndexOpenBraket;
        for (let i = firstIndexClosedBraket; i >= 0; i--) {
            extArr.unshift(arr[i]); // - добавляем в начало массива значение
            if (arr[i] == '(') {
                firstIndexOpenBraket = i; // - первая открывающаяся скобка '('
                extArr.pop(); // - удаляем скобки
                extArr.shift();
                let resultBraketsCalc = calcBrakets(extArr); // функция подсчета в скобках
                arr.splice(firstIndexOpenBraket, firstIndexClosedBraket - firstIndexOpenBraket + 1, resultBraketsCalc);
                resultNumber = calc(arr);
            }
        }
        return Math.round(resultNumber * 10000) / 10000;
    }
    return calc(arr);
}

module.exports = {
    expressionCalculator
}
