// src/todos/todos.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(): Todo[] {
    return this.todosService.findAll();
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.todosService.create(createTodoDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto): Todo {
    const updatedTodo = this.todosService.update(id, updateTodoDto);
    if (!updatedTodo) {
      throw new HttpException('ToDo not found', HttpStatus.NOT_FOUND);
    }
    return updatedTodo;
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    const result = this.todosService.remove(id);
    if (!result) {
      throw new HttpException('ToDo not found', HttpStatus.NOT_FOUND);
    }
  }
}
