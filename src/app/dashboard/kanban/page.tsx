import KanbanBoard from '@/features/kanban/componentsv2/kanban-board';

export const metadata = {
  title: 'Dashboard : Kanban view'
};

export default function page() {
  return (
      <KanbanBoard />
  );
}
