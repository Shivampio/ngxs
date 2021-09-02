import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AddTask, DeleteTask, GetTask, UpdateTask } from 'src/app/store/actions/task.action';
import { TaskState } from 'src/app/store/state/task.state';
import { TaskService } from '../../services/task.service';
import { Task } from '../../Task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];

  @Select(TaskState.getTaskList) tasks$:Observable<Task[]>
  @Select(TaskState.getTaskLoaded) taskLoaded$:Observable<Task[]>

  taskLoadedSub:Subscription;

  constructor(private taskService: TaskService, private store: Store) {}

  ngOnInit(): void {
    // this.tasks$.subscribe(res=>{
    //   console.log(res)
    //   this.tasks = res
    // })
    this.taskLoadedSub =  this.taskLoaded$.subscribe(res=>{
      if(!res){
        this.store.dispatch(new GetTask());
      }
    })
    // this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
  }

  ngOnDestroy(){
    this.taskLoadedSub.unsubscribe();
  }

  deleteTask(task: Task) {
    // this.taskService
    //   .deleteTask(task)
    //   .subscribe(
    //     () => (this.tasks = this.tasks.filter((t) => t.id !== task.id))
    //   );
    this.store.dispatch(new DeleteTask(task.id))
  }

  toggleReminder(task: Task) {
    task.reminder = !task.reminder;
    // this.taskService.updateTaskReminder(task.id).subscribe();
    this.store.dispatch(new UpdateTask(task));
  }

  addTask(task: Task) {
    // this.taskService.addTask(task).subscribe((task) => this.tasks.push(task));
    this.store.dispatch(new AddTask(task));
  }
}
