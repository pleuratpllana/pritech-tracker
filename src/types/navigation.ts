export type RootStackParamList = {
  Welcome: undefined;
  TaskList: undefined;
  AddTask:
    | {
        taskId?: string;
      }
    | undefined;
  TaskDetails: {
    taskId: string;
  };
};
