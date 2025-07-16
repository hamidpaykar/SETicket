import KanbanBoard from '@/features/kanban/components/kanban-board';

export const metadata = {
  title: 'Dashboard : Kanban view'
};

export default function page() {
  return (
      <KanbanBoard />
  );
}
