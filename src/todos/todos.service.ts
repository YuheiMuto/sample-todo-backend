// src/todos/todos.service.ts
import { Injectable } from '@nestjs/common';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodosService {
  private readonly filePath = 'todos.json';

  findAll(): Todo[] {
    return this.readTodosFile();
  }

  create(todo: CreateTodoDto): Todo {
    const newTodo: Todo = { id: uuidv4(), ...todo };
    const todos = this.readTodosFile();
    todos.push(newTodo);
    this.writeTodosFile(todos);
    return newTodo;
  }

  update(id: string, todo: UpdateTodoDto): Todo {
    const todos = this.readTodosFile();
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex > -1) {
      todos[todoIndex] = { ...todos[todoIndex], ...todo };
      this.writeTodosFile(todos);
      return todos[todoIndex];
    }
    return null;
  }

  remove(id: string): { id: string } | null {
    let todos = this.readTodosFile();
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex > -1) {
      todos = todos.filter(t => t.id !== id);
      this.writeTodosFile(todos);
      return { id };
    }
    return null;
  }

  private readTodosFile(): Todo[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private writeTodosFile(todos: Todo[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(todos, null, 2));
  }
}
