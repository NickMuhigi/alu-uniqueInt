const fs = require('fs');
const path = require('path');

class UniqueInt {
    constructor() {
        this.seen = new Array(2047).fill(false); // Boolean array for integers from -1023 to 1023
        this.minInt = -1023;
    }

    processFile(inputFilePath, outputFilePath) {
        // Reset seen array for each file
        this.seen = new Array(2047).fill(false);
        const uniqueNumbers = this.readUniqueIntegers(inputFilePath);
        this.writeUniqueIntegers(uniqueNumbers, outputFilePath);
    }

    readUniqueIntegers(inputFilePath) {
        const uniqueNumbers = [];
        const data = fs.readFileSync(inputFilePath, 'utf-8');
        const lines = data.split('\n');
        
        lines.forEach(line => {
            const strippedLine = line.trim();
            if (strippedLine) {
                if (this.isValidIntegerLine(strippedLine)) {
                    const number = parseInt(strippedLine, 10);
                    if (number >= -1023 && number <= 1023) { // Ensure the number is within range
                        if (!this.seen[number - this.minInt]) {
                            this.seen[number - this.minInt] = true;
                            uniqueNumbers.push(number);
                        }
                    } else {
                        console.log(`Number out of range: ${number}`);
                    }
                }
            }
        });

        return this.sortUniqueNumbers(uniqueNumbers);
    }

    isValidIntegerLine(line) {
        const number = parseInt(line, 10);
        if (!isNaN(number)) {
            return true;
        } else {
            console.log(`Invalid integer line: ${line}`);
            return false;
        }
    }

    sortUniqueNumbers(numbers) {
        if (numbers.length === 0) {
            return numbers;
        }

        // Implementing Bubble Sort for simplicity
        const n = numbers.length;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (numbers[j] > numbers[j + 1]) {
                    [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]];
                }
            }
        }
        return numbers;
    }

    writeUniqueIntegers(uniqueNumbers, outputFilePath) {
        const data = uniqueNumbers.join('\n') + '\n';
        fs.writeFileSync(outputFilePath, data, 'utf-8');
    }
}

const inputFolder = './Inputs';
const outputFolder = './Output';

const uniqueIntProcessor = new UniqueInt();

fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error(`Error reading input folder: ${err}`);
        return;
    }

    files.forEach(file => {
        if (file.endsWith('.txt')) {
            const inputPath = path.join(inputFolder, file);
            const outputPath = path.join(outputFolder, `${file}_results.txt`);

            // Timing for each file
            const startTime = Date.now();
            uniqueIntProcessor.processFile(inputPath, outputPath);
            const endTime = Date.now();

            console.log(`Processed ${file} in ${(endTime - startTime) / 1000} seconds`);
        }
    });
});
