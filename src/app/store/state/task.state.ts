import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { TaskService } from "src/app/services/task.service";
import { Task } from "src/app/Task";
import { AddTask, DeleteTask, GetTask, UpdateTask } from "../actions/task.action";
import {tap} from "rxjs/operators";

export class TaskStateModel{
  tasks:Task[];
  tasksLoaded:boolean
}

@State<TaskStateModel>({
  name:'tasks',
  defaults:{
    tasks:[],
    tasksLoaded:false
  }
})

@Injectable()
export class TaskState{

    constructor(private taskService: TaskService){}

    @Selector()
    static getTaskList(state:TaskStateModel){
      return state.tasks
    }

    @Selector()
    static getTaskLoaded(state:TaskStateModel){
      return state.tasksLoaded
    }

    @Action(GetTask)
    getTasks({getState, setState}:StateContext<TaskStateModel>){
      return this.taskService.getTasks().pipe(tap(res=>{
        const state = getState()
        setState({
          ...state,
          tasks:res,
          tasksLoaded:true
        })
      }))
    }

    @Action(AddTask)
    addTask({getState, patchState}:StateContext<TaskStateModel>, {payload}:AddTask){
      return this.taskService.addTask(payload).pipe(tap((res:Task)=>{
        const state = getState();

        patchState({
          tasks:[...state.tasks, res]
        })
      }))
    }

    @Action(DeleteTask)
    deleteTask({getState, setState}:StateContext<TaskStateModel>, {id}:DeleteTask){
    
      return this.taskService.deleteTask(id).pipe(tap(res=>{
        const state = getState();
        const filteredTask = state.tasks.filter((t)=> t.id !== id)
  
        setState({
          ...state,
          tasks:filteredTask
        })
      }))
    }

    @Action(UpdateTask)
    updateTask({getState, patchState}:StateContext<TaskStateModel>, {payload}:UpdateTask){
      return this.taskService.updateTaskReminder(payload).pipe(tap((res:Task)=>{
        console.log(res)
        const state = getState()
        const taskList = state.tasks;
  
        const index = taskList.findIndex(task => task.id == payload.id);
  
        taskList[index] = res;

        patchState({
          tasks:taskList
        })
      }))
    }
}