import { Controller, Get,Param, ParseIntPipe, Post, UsePipes, Body, ValidationPipe, Query, Patch, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filder.dto';
import { TaskStatusValidationPipe } from './pipes/task-status.pipe';
import { TaskStatus } from './task.model';
import { DeleteResult } from 'typeorm';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService){}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto ): Promise<Task[]> {
        if (Object.keys(filterDto).length) {
            return this.taskService.getTaskWithFilters(filterDto);
        } else {
            return this.taskService.getAllTasks();
        }
    }

    @Get(':id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDTO): Promise<Task> {
        return this.taskService.createTask(createTaskDto);
    }

    // @Patch(':id/status')
    // updateTaskStatus(
    //     @Param('id') id: string, 
    //     @Body('status', TaskStatusValidationPipe) status: TaskStatus ): Promise<Task> {
    //     return this.taskService.updateTaskStatus(id, status);
    // }

    @Delete(':id')
    deleteTask(@Param('id') id: number): Promise<DeleteResult> {
        return this.taskService.deleteTask(id);
    }
}
