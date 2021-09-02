import { Task } from "src/app/Task";

export class AddTask {
  static readonly type = '[Task] Add';
  
  constructor(public payload:Task) {}
}

export class GetTask{
    static readonly type = '[Task] Get';
}

export class DeleteTask {
  static readonly type = '[Task] Delete';

  constructor(public id:number){}
}

export class UpdateTask{
  static readonly type = '[Task] Update';

  constructor(public payload:Task){}
}

