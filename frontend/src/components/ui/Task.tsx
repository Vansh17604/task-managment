import { useDrag } from 'react-dnd';

const Task = ({ task }: any) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="shade-card mb-2 p-2 bg-white rounded-lg shadow-sm"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {task.name}
    </div>
  );
};

export default Task;
