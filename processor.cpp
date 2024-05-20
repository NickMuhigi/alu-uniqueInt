#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>

class UniqueInt {
private:
    std::vector<bool> seen;
    int minInt;
public:
    UniqueInt() : seen(2047, false), minInt(-1023) {}

    void processFile(std::string inputFilePath, std::string outputFilePath) {
        seen.assign(2047, false); // Reset seen array for each file
        std::vector<int> uniqueNumbers = readUniqueIntegers(inputFilePath);
        writeUniqueIntegers(uniqueNumbers, outputFilePath);
    }

private:
    std::vector<int> readUniqueIntegers(std::string inputFilePath) {
        std::vector<int> uniqueNumbers;
        std::ifstream inputFile(inputFilePath);
        if (!inputFile.is_open()) {
            std::cerr << "Error: Unable to open input file: " << inputFilePath << std::endl;
            return uniqueNumbers;
        }
        std::string line;
        while (std::getline(inputFile, line)) {
            std::istringstream iss(line);
            std::string strippedLine;
            iss >> strippedLine;
            if (!strippedLine.empty() && isValidIntegerLine(strippedLine)) {
                int number;
                if (std::stringstream(strippedLine) >> number) {
                    if (-1023 <= number && number <= 1023) { // Ensure the number is within range
                        if (!seen[number - minInt]) {
                            seen[number - minInt] = true;
                            uniqueNumbers.push_back(number);
                        }
                    } else {
                        std::cerr << "Number out of range: " << number << std::endl;
                    }
                }
            }
        }
        inputFile.close();
        std::sort(uniqueNumbers.begin(), uniqueNumbers.end());
        return uniqueNumbers;
    }

    bool isValidIntegerLine(const std::string& line) {
        try {
            std::stoi(line);
            return true;
        } catch (const std::invalid_argument& e) {
            std::cerr << "Invalid integer line: " << line << std::endl;
            return false;
        }
    }

    void writeUniqueIntegers(const std::vector<int>& uniqueNumbers, const std::string& outputFilePath) {
        std::ofstream outputFile(outputFilePath);
        if (!outputFile.is_open()) {
            std::cerr << "Error: Unable to open output file: " << outputFilePath << std::endl;
            return;
        }
        for (int number : uniqueNumbers) {
            outputFile << number << std::endl;
        }
        outputFile.close();
    }
};

int main() {
    UniqueInt uniqueIntProcessor;
    std::string inputFolder = "/root/UniqueInt/Inputs";
    std::string outputFolder = "/root/UniqueInt/Output";

    // Process each file in the input folder
    for (const auto& entry : std::filesystem::directory_iterator(inputFolder)) {
        if (entry.path().extension() == ".txt") {
            std::string inputPath = entry.path().string();
            std::string outputPath = outputFolder + "/" + entry.path().stem().string() + "_results.txt";

            // Timing for each file
            auto startTime = std::chrono::steady_clock::now();
            uniqueIntProcessor.processFile(inputPath, outputPath);
            auto endTime = std::chrono::steady_clock::now();
            std::chrono::duration<double> elapsedTime = endTime - startTime;
            std::cout << "Processed " << inputPath << " in " << elapsedTime.count() << " seconds" << std::endl;
        }
    }

    return 0;
}
