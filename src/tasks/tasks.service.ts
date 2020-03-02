import { Injectable, Query, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filder.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks() {
        return this.tasks;
    }

    getTaskWithFilters(@Query() filterDto: getTasksFilterDto) {
        const { status, search } = filterDto;

        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
        }
        
        return tasks;
    }

    getTaskById(id: string): Task {
        const found = this.tasks.find(task => task.id === id);

        if (!found) {
            throw new NotFoundException(`Task with ID: ${id} not Found!`);
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDTO) : Task {
        const {title, description } = createTaskDto;

        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);
        return task;
    }

    updateTaskStatus(id: string, status: TaskStatus) : Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    deleteTask(id: string): void {
        this.getTaskById(id);
        this.tasks.filter(task => task.id !== id)
    }
}
