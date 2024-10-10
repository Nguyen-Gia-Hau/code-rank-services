import { Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeRunnerService } from 'src/code-runner/code-runner.service';
import { Submission } from './entities/submission.entity';
import { Repository } from 'typeorm';
import { ProblemsService } from 'src/problems/problems.service';
import { TestcasesService } from 'src/testcases/testcases.service';
import { LanguagesService } from 'src/languages/languages.service';
import { NotFoundException } from '@nestjs/common';
import { UserProfilesService } from 'src/users/services/user.profiles.service'; import { UsersService } from 'src/users/services/users.service'; import { ContestsService } from 'src/contests/contests.service';
import { convertToVietnamTime } from 'src/utils';


@Injectable()
export class SubmissionsService {
  constructor(private readonly codeRunnerService: CodeRunnerService,
    private readonly problemService: ProblemsService,
    private readonly testcaseService: TestcasesService,
    private readonly languageService: LanguagesService,
    private readonly userProfileService: UserProfilesService,
    private readonly userService: UsersService,
    private readonly contestService: ContestsService,
    @InjectRepository(Submission) private submissionRepository: Repository<Submission>
  ) { }


  async create(createSubmissionDto: CreateSubmissionDto, file: Express.Multer.File) {
    // Save the submitted file
    const filePath = await this.codeRunnerService.saveFile(file);

    // Find the problem, throw an error if not found
    const problem = await this.problemService.findOne({ problem_id: createSubmissionDto.problem_id });
    if (!problem) {
      throw new NotFoundException(`Problem with id ${createSubmissionDto.problem_id} not found`);
    }

    // Find all test cases related to the problem
    const testcases = await this.testcaseService.findAll({ problem_id: createSubmissionDto.problem_id });
    if (!testcases || testcases.length === 0) {
      throw new NotFoundException(`Testcases for problem id ${createSubmissionDto.problem_id} not found`);
    }

    // Find the programming language
    const language = await this.languageService.findOne({ language_id: createSubmissionDto.language_id });
    if (!language) {
      throw new NotFoundException(`Language with id ${createSubmissionDto.language_id} not found`);
    }

    // Find the user, throw an error if not found
    const currentUser = await this.userService.findOne({ user_id: createSubmissionDto.user_id });
    if (!currentUser) {
      throw new NotFoundException(`User with id ${createSubmissionDto.user_id} not found`);
    }

    // Find a previous submission by the user for the problem
    const submissionOfUser = await this.findOne({
      problem: problem,
      user: currentUser,
      status: 1
    });

    const contestProblem = await this.contestService.findOneProblemContest({ problem: problem })
    const contest = contestProblem.contest
    const contestUser = await this.contestService.findOneUserContest({ contest: contest, user: currentUser })

    // Loop through each test case and execute the submitted code
    const results = [];
    let correctCount = 0; // Initialize the count of correct answers

    for (const testcase of testcases) {
      const { input, expected_output } = testcase;

      try {
        // Run the saved file and capture the actual output for the current test case
        const actualOutput = await this.codeRunnerService.runFile(filePath, input);
        // Compare the actual output with the expected output
        const isCorrect = this.codeRunnerService.compareResult(actualOutput.output, expected_output);

        if (isCorrect) {
          correctCount++;
        }

        // Save the result for the current test case
        results.push({
          testcase_id: testcase.testcase_id,
          input,
          isCorrect,
          actualOutput
        });
      } catch (error) {
        // Handle specific errors for this test case
        results.push({
          testcase_id: testcase.testcase_id,
          input,
          isCorrect: false,
          error: error.message, // Capture error message
        });
      }
    }

    // Update the user's profile with the number of solved problems and total points
    const userProfile = await this.userProfileService.findOne({ user_id: createSubmissionDto.user_id });
    if (!userProfile) throw new NotFoundException(`User with id ${createSubmissionDto.user_id} not found`);

    let problemSolved: number = userProfile.problems_solved;
    let totalPoints: number = userProfile.total_points;
    if (!submissionOfUser && correctCount === results.length) {
      problemSolved++;
      totalPoints += problem.point;

      const nowUTC: Date = new Date();
      const nowVietnam: Date = convertToVietnamTime(nowUTC);
      const startTimeVietnam: Date = convertToVietnamTime(contest.start_time);
      const endTimeVietnam: Date = new Date(startTimeVietnam);
      endTimeVietnam.setMinutes(endTimeVietnam.getMinutes() + contest.total_time);
      const isOngoing: boolean = nowVietnam >= startTimeVietnam && nowVietnam <= endTimeVietnam;

      if (contestUser && isOngoing) {
        await this.contestService.updateContestUser(contestUser.contest_user_id, {
          total_point: contestUser.total_point + problem.point
        })
      }
    }

    // Update user profile with the new submission count, points, and solved problems
    await this.userProfileService.update(createSubmissionDto.user_id, {
      total_submission: userProfile.total_submission + 1,
      total_points: totalPoints,
      problems_solved: problemSolved,
    });

    // Retrieve the content of the submitted source code
    const sourceCode: string = await this.codeRunnerService.getFileContent(filePath);

    // Create a new submission record
    const createdSubmission = this.submissionRepository.create({
      problem: problem,
      user: currentUser,
      language: language,
      source_code: sourceCode,
      status: (correctCount === results.length) ? 1 : 0, // Set status as 1 if all test cases passed
    });

    // Save the submission to the database
    await this.submissionRepository.save(createdSubmission);

    // Delete the temporary file after processing
    await this.codeRunnerService.deleteFile(filePath);

    // Return the results of the test cases
    return {
      problem_id: createSubmissionDto.problem_id,
      user_id: createSubmissionDto.user_id,
      language_id: createSubmissionDto.language_id,
      results, // Contains the results of all test cases
    };
  }

  async findAllSubmission(problemID: number) {
    const problem = await this.problemService.findOne({ problem_id: problemID })
    if (!problem) throw new NotFoundException()

    const records = await this.findAll({ problem }, ['submission_id', 'status', 'language', 'submission_time'])
    console.log(records)
    if (!records) throw new NotFoundException()
    return records
  }

  async findAll(condition: Partial<Submission>, selection?: (keyof Submission)[]) {
    return await this.submissionRepository.find({
      where: condition,
      ...(selection ? { select: selection } : {}),
      relations: ['language']
    })
  }

  async findOne(condition: Partial<Submission>, select?: (keyof Submission)[]) {
    return await this.submissionRepository.findOne({
      where: condition,
      ...(select ? { select } : {}), // Use the select array if provided
    });
  }

  update(id: number, updateSubmissionDto: UpdateSubmissionDto) {
    return `This action updates a #${id} submission`;
  }

  remove(id: number) {
    return `This action removes a #${id} submission`;
  }
}
