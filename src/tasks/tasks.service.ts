import { Injectable,  NotFoundException, Query } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task.model';
import { GetTasksFilterDto } from './dto/get-tasks-filder.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
    ) {}


    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with ID: ${id} not Found!`);
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
        const {title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await this.taskRepository.save(task);
        return task;
    }

    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.find();
    }

    getTaskWithFilters(@Query() filterDto: GetTasksFilterDto) {
        // const { status, search } = filterDto;

        const tasks = this.getAllTasks();

        // if (status) {
        //     tasks = this.taskRepository.filter(task => this.taskRepository === status);
        // }

        // if (search) {
        //     tasks = this.taskRepository.filter(task => this.taskRepository.includes(search) || this.taskRepository.description.includes(search))
        // }
        
        return tasks;
    }


    // updateTaskStatus(id: number, status: TaskStatus) : Promise<Task> {
    //     const task = this.getTaskById(id);
    //     const taskUpdated = Object.assign(task, dto);
    //     const savedUser = await this.taskRepository.save(taskUpdated);
    //     return savedUser;
    // }

    deleteTask(id: number): Promise<DeleteResult> {
        this.getTaskById(id);
        return this.taskRepository.delete(id);
    }
}
