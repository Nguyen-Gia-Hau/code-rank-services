
import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { exec } from 'child_process';

// A mapping of file extensions to their corresponding programming language folder names
const FOLDER_MAP: { [key: string]: string } = {
  '.cpp': 'C++',
  '.java': 'Java',
  '.py': 'Python',
  '.ts': 'Typescript',
};


@Injectable()
export class CodeRunnerService {
  // Method to save a file and organize it based on its extension
  async saveFile(file: Express.Multer.File) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const languageFolder = FOLDER_MAP[fileExtension];

    if (!languageFolder) {
      throw new Error(`Unsupported file extension: ${fileExtension}`);
    }

    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const folderPath = path.join(__dirname, `./source-code/${languageFolder}`);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, uniqueFileName);
    fs.writeFileSync(filePath, file.buffer);

    return filePath;
  }

  // Method to run the saved file with input data
  async runFile(filePath: string, input: string): Promise<{ output: string; executionTime: number; memoryUsage: number }> {
    try {
      // Prepare the command to run the file based on its extension
      let command: string;
      const fileExtension = path.extname(filePath).toLowerCase();
      let compiledFilePath: string | null = null;

      switch (fileExtension) {
        case '.cpp':
          compiledFilePath = `${filePath}.out`;
          command = `g++ ${filePath} -o ${compiledFilePath} && ${compiledFilePath}`;
          break;
        case '.java':
          command = `javac ${filePath} && java -cp ${path.dirname(filePath)} ${path.basename(filePath, '.java')}`;
          break;
        case '.py':
          command = `python ${filePath}`;
          break;
        case '.ts':
          compiledFilePath = path.join(path.dirname(filePath), path.basename(filePath, '.ts') + '.js');
          command = `tsc ${filePath} && node ${compiledFilePath}`;
          break;
        default:
          throw new Error(`Unsupported file extension: ${fileExtension}`);
      }

      // Execute the command
      const childProcess = exec(command);

      return new Promise((resolve, reject) => {
        let output = '';
        let errorOutput = '';
        const startTime = performance.now(); // Thời điểm bắt đầu

        // Collect the standard output
        childProcess.stdout.on('data', async (data) => {
          output += data;
        });

        const endTime = performance.now(); // Thời điểm kết thúc
        const executionTime = endTime - startTime; // Thời gian chạy tính bằng miligiây

        // Collect the standard error output
        childProcess.stderr.on('data', (data) => {
          errorOutput += data;
        });

        // Write input to the standard input of the child process
        childProcess.stdin.write(input);
        childProcess.stdin.end(); // Close the stdin stream

        // Resolve or reject the promise based on the process exit code
        childProcess.on('close', async (code) => {
          // Lấy thông tin bộ nhớ sử dụng
          const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Chuyển đổi sang MB

          if (code === 0) {
            resolve({ output, executionTime, memoryUsage }); // Trả về output, thời gian chạy và bộ nhớ sử dụng nếu không có lỗi
          } else {
            // Phân tích lỗi và trả về thông báo lỗi cụ thể
            let errorMessage = `Process exited with code: ${code}`;
            if (errorOutput) {
              errorMessage += `\nError Output: ${errorOutput}`;
            }
            reject(new Error(errorMessage)); // Trả về lỗi
          }
        });
      });
    } catch (error) {
      console.error('Error running file:', error.message);
      throw new Error(`Failed to run file: ${error.message}`);
    }
  }

  async createFile(fileName: string, content: string, folderPath: string): Promise<string> {
    try {
      // Tạo đường dẫn lưu file
      const filePath = path.join(folderPath, fileName);

      // Kiểm tra xem thư mục có tồn tại không, nếu không thì tạo mới
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Ghi nội dung vào file
      fs.writeFileSync(filePath, content, 'utf8');

      return filePath; // Trả về đường dẫn file đã tạo
    } catch (error) {
      console.error('Error creating file:', error.message);
      throw new Error(`Failed to create file: ${error.message}`);
    }
  }

  // Method to get the content of a saved file
  async getFileContent(filePath: string): Promise<string> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return fileContent;
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }

  // Method to delete a file
  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Synchronously delete the file
      } else {
        throw new Error(`File not found: ${filePath}`);
      }
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Method to compare the actual output with the expected result
  compareResult(actualOutput: string, expectedOutput: string): boolean {
    return actualOutput.trim() === expectedOutput.trim();
  }
}

