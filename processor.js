const fileSystem = require('fs');
const path = require('path');

class UniqueIntProcessor {
    constructor() {
        this.hasAppeared = new Array(2047).fill(false); 
        this.minimumInteger = -1023;
    }

    processFile(inputFilePath, outputFilePath) {
        
        this.hasAppeared = new Array(2047).fill(false);
        const uniqueNumbers = this.readUniqueNumbers(inputFilePath);
        this.writeUniqueNumbers(uniqueNumbers, outputFilePath);
    }

    readUniqueNumbers(inputFilePath) {
        const uniqueNumbers = [];
        const data = fileSystem.readFileSync(inputFilePath, 'utf-8');
        const lines = data.split('\n');
        
        lines.forEach(line => {
            const strippedLine = line.trim();
            if (strippedLine) {
                if (this.isValidIntegerLine(strippedLine)) {
                    const number = parseInt(strippedLine, 10);
                    if (number >= -1023 && number <= 1023) { 
                        if (!this.hasAppeared[number - this.minimumInteger]) {
                            this.hasAppeared[number - this.minimumInteger] = true;
                            uniqueNumbers.push(number);
                        }
                    } else {
                        console.log(`Number that's not in range: ${number}`);
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

        
        const count = numbers.length;
        for (let firstIndex = 0; firstIndex < count; firstIndex++) {
            for (let secondIndex = 0; secondIndex < count - firstIndex - 1; secondIndex++) {
                if (numbers[secondIndex] > numbers[secondIndex + 1]) {
                    [numbers[secondIndex], numbers[secondIndex + 1]] = [numbers[secondIndex + 1], numbers[secondIndex]];
                }
            }
        }
        return numbers;
    }

    writeUniqueNumbers(uniqueNumbers, outputFilePath) {
        const data = uniqueNumbers.join('\n') + '\n';
        fileSystem.writeFileSync(outputFilePath, data, 'utf-8');
    }
}

const inputFolder = './Input';
const outputFolder = './Output';

const processor = new UniqueIntProcessor();

fileSystem.readdir(inputFolder, (error, files) => {
    if (error) {
        console.error(`Error: ${error}`);
        return;
    }

    files.forEach(fileName => {
        if (fileName.endsWith('.txt')) {
            const inputPath = path.join(inputFolder, fileName);
            const outputPath = path.join(outputFolder, `${fileName}_results.txt`);

            
            const startTime = Date.now();
            processor.processFile(inputPath, outputPath);
            const endTime = Date.now();

            console.log(`Processed ${fileName} in ${(endTime - startTime) / 1000} seconds`);
        }
    });
});
