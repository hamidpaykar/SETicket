export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CustomField {
  id: string;
  name: string;
  value: string;
}

export interface Subtask {
  id:string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: Priority;
  dueDate: string | null;
  subtasks: Subtask[];
  customFields: CustomField[];
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
}

export interface RuleCondition {
  type: 'due-date' | 'subtasks-completed' | 'custom-field';
  operator: 'is-overdue' | 'all-completed' | 'equals' | 'not-equals' | 'contains';
  field?: string;
  value?: string;
}

export interface RuleAction {
  type: 'move-to-column';
  targetColumnId: string;
}

export interface Rule {
  id: string;
  name: string;
  condition: RuleCondition;
  action: RuleAction;
  enabled: boolean;
} 