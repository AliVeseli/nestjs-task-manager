import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filder.dto';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService){}

    @Get()
    getTasks(@Query() filterDto: getTasksFilterDto ): Task[] {
        if (Object.keys(filterDto).length) {
            return this.taskService.getTaskWithFilters(filterDto);
        } else {
            return this.taskService.getAllTasks();
        }
    }

    @Get(':id')
    getTaskById(@Param('id') id: string): Task {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDTO): Task {
        return this.taskService.createTask(createTaskDto);
    }

    @Patch(':id/status')
    updateTaskStatus(
        @Param('id') id: string, 
        @Body('status') status: TaskStatus ) : Task {
        return this.taskService.updateTaskStatus(id, status);
    }

    @Delete(':id')
    deleteTask(@Param('id') id: string): void {
        this.taskService.deleteTask(id);
    }
}
