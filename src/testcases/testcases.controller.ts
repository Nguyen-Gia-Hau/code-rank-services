import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestcasesService } from './testcases.service';
import { CreateTestcaseDto } from './dto/create-testcase.dto';
import { UpdateTestcaseDto } from './dto/update-testcase.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';

@UseGuards(AuthGuard)
@Role('admin')
@Controller('testcases')
export class TestcasesController {
  constructor(private readonly testcasesService: TestcasesService) { }


  @Post(':problemID')
  async create(@Param('problemID') id: string, @Body() createTestcaseDto: CreateTestcaseDto[]) {
    const testcases = await Promise.all(
      createTestcaseDto.map(dto => this.testcasesService.create(+id, dto)) // Assuming you have a service method to handle creation
    );

    return {
      message: `${testcases.length} testcases created successfully`,
      testcases
    };
  }

  @Get(':problemID')
  findAll(@Param('problemID') id: string) {
    return this.testcasesService.findAll({ problem_id: +id });
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.testcasesService.findOne();
  // }

  @Patch()
  async update(@Body() updateTestcaseDto: UpdateTestcaseDto[]) {
    const updatedtestcases = await Promise.all(
      updateTestcaseDto.map(dto => this.testcasesService.update(dto.testcase_id, dto)) // Assuming you have a service method to handle creation
    );
    return {
      message: `${updatedtestcases.length} testcases updated successfully`,
      updatedtestcases
    };
  }

  @Delete()
  async remove(@Body() ids: string[]) {
    const deletedTestcase = await Promise.all(
      ids.map(id => this.testcasesService.remove(+id))
    )
    return {
      message: `${deletedTestcase.length} testcases updated successfully`,
      deletedTestcase
    };
  }
}
